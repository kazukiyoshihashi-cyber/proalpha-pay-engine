import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { PayrollRun } from './pages/PayrollRun';
import { RateFormulas } from './pages/RateFormulas';
import { CommissionUpload } from './pages/CommissionUpload';
import { ClawbackPending } from './pages/ClawbackPending';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payroll/run" element={<PayrollRun />} />
          <Route path="/master/rate-formulas" element={<RateFormulas />} />
          <Route path="/commission/upload" element={<CommissionUpload />} />
          <Route path="/clawback/pending" element={<ClawbackPending />} />
          <Route path="*" element={<div className="p-4 flex items-center justify-center h-full text-muted-foreground">現在開発中の機能です</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
