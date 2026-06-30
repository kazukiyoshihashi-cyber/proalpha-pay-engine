import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { PayrollRun } from './pages/PayrollRun';
import { RateFormulas } from './pages/RateFormulas';
import { CommissionUpload } from './pages/CommissionUpload';
import { ClawbackPending } from './pages/ClawbackPending';
import { StaffMaster } from './pages/StaffMaster';
import { InsuranceMaster } from './pages/InsuranceMaster';
import { AndoEngine } from './pages/AndoEngine';
import { PayslipDetail } from './pages/PayslipDetail';
import { WhatIfSimulation } from './pages/WhatIfSimulation';
import { AuditLog } from './pages/AuditLog';

function Placeholder({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center h-64 text-muted-foreground">
      {name} — 開発中
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payroll/run" element={<PayrollRun />} />
          <Route path="/payslip" element={<PayslipDetail />} />
          <Route path="/commission/upload" element={<CommissionUpload />} />
          <Route path="/clawback/pending" element={<ClawbackPending />} />
          <Route path="/engine" element={<AndoEngine />} />
          <Route path="/master/rate-formulas" element={<RateFormulas />} />
          <Route path="/simulation" element={<WhatIfSimulation />} />
          <Route path="/master/staff" element={<StaffMaster />} />
          <Route path="/master/insurance" element={<InsuranceMaster />} />
          <Route path="/audit" element={<AuditLog />} />
          <Route path="/reports/monthly" element={<Placeholder name="月次レポート" />} />
          <Route path="/settings" element={<Placeholder name="システム設定" />} />
          <Route path="*" element={<Placeholder name="このページ" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
