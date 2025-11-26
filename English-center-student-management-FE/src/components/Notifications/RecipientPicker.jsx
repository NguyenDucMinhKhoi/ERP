import React, { useMemo, useState } from "react";
import { students, staff, courses } from "./dummyData";
import notificationsService from "../../services/notificationsService";

export default function RecipientPicker({ isAdmin, value, onChange, onNotificationSent }) {
  const [mode, setMode] = useState("single"); // single | course | class | center
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [sending, setSending] = useState(false);
  const [channel, setChannel] = useState("app");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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

  const filteredStaff = useMemo(() => {
    const q = search.toLowerCase();
    return staff.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.phone.includes(search) ||
        s.email.toLowerCase().includes(q) ||
        (s.roleLabel || "").toLowerCase().includes(q)
    );
  }, [search]);

  const allRecipients = useMemo(() => {
    return [
      ...filteredStudents.map(s => ({ ...s, type: 'student' })),
      ...filteredStaff.map(s => ({ ...s, type: 'staff' }))
    ].sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredStudents, filteredStaff]);

  const classOptions = useMemo(() => {
    const c = courses.find((c) => String(c.id) === String(selectedCourse));
    return c ? c.classes : [];
  }, [selectedCourse]);

  const handleSend = async () => {
    if (value.length === 0) {
      alert("Vui lòng chọn người nhận");
      return;
    }
    if (!title.trim()) {
      alert("Vui lòng nhập tiêu đề");
      return;
    }
    if (!content.trim()) {
      alert("Vui lòng nhập nội dung");
      return;
    }
    
    setSending(true);
    try {
      // Gửi qua API
      const apiData = await notificationsService.sendNotification({
        title,
        content,
        channel,
        recipients: value,
      });
      
      // Tạo notification data để hiển thị trong UI
      const notificationData = {
        id: apiData.id || Date.now(),
        channel,
        title,
        content,
        recipients: value,
        timestamp: apiData.created_at || new Date().toISOString(),
        sentAt: new Date(apiData.created_at || new Date()).toLocaleString('vi-VN'),
      };
      
      console.log("Send notification:", notificationData);
      
      // Gọi callback để lưu lịch sử
      if (onNotificationSent) {
        onNotificationSent(notificationData);
      }
      
      alert("Đã gửi thông báo thành công!");
      
      // Reset form sau khi gửi (không reset recipients để xem feedback)
      setSearch("");
      setSelectedCourse("");
      setSelectedClass("");
      setChannel("app");
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error sending notification:", error);
      alert(`Có lỗi xảy ra khi gửi thông báo: ${error.response?.data?.message || error.message}`);
    } finally {
      setSending(false);
    }
  };

  const renderBody = () => {
    if (mode === "students") {
      return (
        <>
          <div className="mb-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, sđt, email..."
              className="w-full px-3 py-2 border rounded-lg border-slate-300"
            />
          </div>
          <div className="mb-2 text-xs text-slate-500">
            Tổng: {filteredStudents.length} học viên
          </div>
          <div className="max-h-96 overflow-y-auto divide-y">
            {filteredStudents.map((student) => (
              <label key={`student-${student.id}`} className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  checked={value.includes(student.id)}
                  onChange={() => toggle(student.id)}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900">
                    {student.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {student.phone} • {student.email}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </>
      );
    }

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
            placeholder="Tìm theo tên, sđt, email, vai trò..."
            className="w-full px-3 py-2 border rounded-lg border-slate-300"
          />
        </div>
        <div className="mb-2 text-xs text-slate-500">
          Tổng: {allRecipients.length} người ({filteredStudents.length} học viên, {filteredStaff.length} nhân sự)
        </div>
        <div className="max-h-96 overflow-y-auto divide-y">
          {allRecipients.map((person) => (
            <label key={`${person.type}-${person.id}`} className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                checked={value.includes(person.id)}
                onChange={() => toggle(person.id)}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-slate-900">
                    {person.name}
                  </div>
                  {person.type === 'staff' && person.roleLabel && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {person.roleLabel}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500">
                  {person.phone} • {person.email}
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

      {/* Notification content section */}
      <div className="mb-6 pb-4 border-b border-slate-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Kênh
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-slate-300"
            >
              <option value="app">App</option>
              <option value="sms">SMS</option>
              <option value="email">Email</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tiêu đề
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg border-slate-300"
            placeholder="VD: Lịch khai giảng"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nội dung
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border rounded-lg border-slate-300 resize-vertical"
            placeholder="Nội dung thông báo"
          />
        </div>
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
            <option value="students">Chọn học viên</option>
            <option value="course">Theo khóa</option>
            <option value="class">Theo lớp</option>
            {isAdmin && <option value="center">Toàn bộ trung tâm</option>}
          </select>
        </div>
      </div>

      {renderBody()}

      {/* Send button */}
      <div className="flex items-center justify-end mt-4 pt-4 border-t border-slate-200">
        <button
          onClick={handleSend}
          disabled={sending || value.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-main rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-primary-dark transition-colors"
        >
          {sending ? "Đang gửi..." : "Gửi thông báo"}
        </button>
      </div>
    </div>
  );
}