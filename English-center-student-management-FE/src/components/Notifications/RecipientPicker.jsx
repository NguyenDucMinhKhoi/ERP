import React, { useMemo, useState } from "react";
import { students, staff, courses } from "./dummyData";

export default function RecipientPicker({ isAdmin, value, onChange }) {
  const [mode, setMode] = useState("single"); // single | course | class | center
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const toggle = (id) => {
    if (value.includes(id)) onChange(value.filter((x) => x !== id));
    else onChange([...value, id]);
  };

  const filteredStudents = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.phone.includes(search) ||
        s.email.toLowerCase().includes(q)
    );
  }, [search]);

  const classOptions = useMemo(() => {
    const c = courses.find((c) => String(c.id) === String(selectedCourse));
    return c ? c.classes : [];
  }, [selectedCourse]);

  const renderBody = () => {
    if (mode === "center") {
      return (
        <div className="space-y-2">
          <div className="text-sm text-slate-600">
            Gửi toàn bộ trung tâm (nhân viên + học viên)
          </div>
          <button
            type="button"
            onClick={() => onChange(["CENTER_ALL"])}
            className="px-3 py-2 text-sm rounded-lg border"
          >
            Chọn toàn bộ
          </button>
        </div>
      );
    }

    if (mode === "course") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Khóa học
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setSelectedClass("");
              }}
              className="w-full px-3 py-2 border rounded-lg border-slate-300"
            >
              <option value="">Chọn khóa học</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() =>
                selectedCourse && onChange([`COURSE_${selectedCourse}`])
              }
              className="px-3 py-2 text-sm rounded-lg border"
            >
              Chọn khóa này
            </button>
          </div>
        </div>
      );
    }

    if (mode === "class") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Khóa học
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setSelectedClass("");
              }}
              className="w-full px-3 py-2 border rounded-lg border-slate-300"
            >
              <option value="">Chọn khóa học</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Lớp
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-slate-300"
            >
              <option value="">Chọn lớp</option>
              {classOptions.map((cl) => (
                <option key={cl.id} value={cl.id}>
                  {cl.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() =>
                selectedClass && onChange([`CLASS_${selectedClass}`])
              }
              className="px-3 py-2 text-sm rounded-lg border"
            >
              Chọn lớp này
            </button>
          </div>
        </div>
      );
    }

    // single
    return (
      <>
        <div className="mb-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, sđt, email"
            className="w-full px-3 py-2 border rounded-lg border-slate-300"
          />
        </div>
        <div className="max-h-56 overflow-y-auto divide-y">
          {filteredStudents.map((s) => (
            <label key={s.id} className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                checked={value.includes(s.id)}
                onChange={() => toggle(s.id)}
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-900">
                  {s.name}
                </div>
                <div className="text-xs text-slate-500">
                  {s.phone} • {s.email}
                </div>
              </div>
            </label>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-slate-700 font-medium">Người nhận</div>
        <div className="text-sm text-slate-500">{value.length} đã chọn</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Chế độ chọn
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg border-slate-300"
          >
            <option value="single">Đơn</option>
            <option value="course">Theo khóa</option>
            <option value="class">Theo lớp</option>
            {isAdmin && <option value="center">Toàn bộ trung tâm</option>}
          </select>
        </div>
      </div>

      {renderBody()}
    </div>
  );
}