import React, { useEffect, useState } from "react";
import LeadList from "../components/CRMLeads/LeadList";
import AddLeadForm from "../components/CRMLeads/AddLeadForm";
import CareScheduleModal from "../components/CRMLeads/CareScheduleModal";
import InteractionLogModal from "../components/CRMLeads/InteractionLogModal";
import ConvertLeadModal from "../components/CRMLeads/ConvertLeadModal";
import authService from "../services/authService";
import { ROLES } from "../utils/permissions";
import crmService from "../services/crmService";

export default function CRMLeads() {
  const [role, setRole] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [showConvert, setShowConvert] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (authService.isAuthenticated()) {
          const me = await authService.getMe();
          if (mounted) setRole(me?.role || null);
        } else if (mounted) setRole(null);
      } catch {
        if (mounted) setRole(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const canManageLeads = role === ROLES.ADMIN || role === ROLES.SALES_STAFF || role === ROLES.ACADEMIC_STAFF;

  const openAdd = () => setShowAdd(true);
  const openSchedule = (lead) => { setSelectedLead(lead); setShowSchedule(true); };
  const openLog = (lead) => { setSelectedLead(lead); setShowLog(true); };
  const openConvert = (lead) => { setSelectedLead(lead); setShowConvert(true); };

  const closeAll = () => {
    setShowAdd(false);
    setShowSchedule(false);
    setShowLog(false);
    setShowConvert(false);
    setSelectedLead(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">CRM – Leads</h1>
          <p className="text-slate-600">Quản lý khách hàng tiềm năng</p>
        </div>
        <div className="flex items-center gap-3">
          {canManageLeads && (
            <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-primary-main px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors interactive-button">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
              Thêm lead mới
            </button>
          )}
        </div>
      </div>

      <LeadList
        role={role}
        onSchedule={openSchedule}
        onLog={openLog}
        onConvert={openConvert}
      />

      {showAdd && (
        <AddLeadForm
          onClose={closeAll}
          onSuccess={closeAll}
          // provide createLead API method to the form
          createLead={crmService.createLead}
        />
      )}
      {showSchedule && selectedLead && (
        <CareScheduleModal lead={selectedLead} onClose={closeAll} onSuccess={closeAll} />
      )}
      {showLog && selectedLead && (
        <InteractionLogModal lead={selectedLead} onClose={closeAll} onSuccess={closeAll} />
      )}
      {showConvert && selectedLead && (
        <ConvertLeadModal lead={selectedLead} onClose={closeAll} onSuccess={closeAll} />
      )}
    </div>
  );
}

