// =============================================
// Domain Types
// =============================================

export type EmploymentType = 'employed' | 'commission' | 'hybrid';

export interface Tenant {
  id: string;
  name: string;
  plan: string;
  status: 'active' | 'inactive';
}

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  rank: string;
}

export interface Staff {
  id: string;
  tenantId: string;
  staffCode: string;
  name: string;
  branchId: string;
  branchName: string;
  role: string;
  employmentType: EmploymentType;
  joinDate: string;
  baseSalary: number;
  commuteAllowance: number;
  positionAllowance: number;
  dependents: number;
  taxCategory: 'A' | 'B'; // 甲欄/乙欄
  invoiceNumber?: string; // インボイス番号（業務委託型）
  bankAccount: string;
}

export interface InsuranceCompany {
  id: string;
  tenantId: string;
  name: string;
  shortName: string;
  csvMapping: Record<string, number>; // column -> index
}

export interface Product {
  id: string;
  tenantId: string;
  insuranceCompanyId: string;
  insuranceCompanyName: string;
  name: string;
  category: string;
  contractType: 'new' | 'renewal';
  defaultRate: number; // 代理店受取料率(%)
}

export interface CommissionRecord {
  id: string;
  tenantId: string;
  policyNumber: string;
  insuredName: string;
  productId: string;
  productName: string;
  insuranceCompanyName: string;
  contractDate: string;
  annualPremium: number;
  commissionAmount: number;
  staffId: string;
  staffName: string;
  targetYearMonth: string;
  contractType: 'new' | 'renewal';
}

export interface AllocationRule {
  id: string;
  tenantId: string;
  name: string;
  staffId?: string;
  productCategory?: string;
  rate: number; // %
  effectiveFrom: string;
  effectiveTo?: string;
}

// =============================================
// ANDO Engine Types
// =============================================

export type ConditionOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains';

export interface RuleCondition {
  field: string;
  operator: ConditionOperator;
  value: string | number | string[];
}

export interface RuleAction {
  type: 'formula' | 'lookup' | 'fixed';
  expression?: string;
  lookupTableId?: string;
  fixedValue?: number;
}

export interface CalculationRule {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  category: 'commission' | 'clawback' | 'incentive' | 'tax' | 'deduction';
  conditions: RuleCondition[];
  action: RuleAction;
  priority: number;
  effectiveFrom: string;
  effectiveTo?: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'archived';
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  changeReason?: string;
}

export interface LookupTable {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  dimensions: string[];
  rows: LookupRow[];
}

export interface LookupRow {
  keys: string[];
  value: number;
}

// =============================================
// Payroll Types
// =============================================

export type PayrollStatus = 'draft' | 'calculating' | 'review' | 'approved' | 'paid';

export interface PayrollRun {
  id: string;
  tenantId: string;
  targetYearMonth: string;
  status: PayrollStatus;
  createdBy: string;
  approvedBy?: string;
  lockedAt?: string;
}

export interface PayrollLineTrace {
  ruleId: string;
  ruleName: string;
  inputValues: Record<string, string | number>;
  result: number;
  formula?: string;
}

export interface PayrollLine {
  id: string;
  tenantId: string;
  payrollRunId: string;
  staffId: string;
  staffName: string;
  employmentType: EmploymentType;
  // 支給
  baseSalary: number;
  positionAllowance: number;
  commuteAllowance: number;
  commissionFirstYear: number;
  commissionRenewal: number;
  incentive: number;
  clawback: number;
  grossSalary: number;
  // 控除（雇用型）
  healthInsurance: number;
  nursingInsurance: number;
  pensionInsurance: number;
  employmentInsurance: number;
  withholdingTax: number; // 源泉所得税
  // 控除（外交員報酬）
  agent204Tax: number; // 所得税法204条
  totalDeductions: number;
  netSalary: number;
  // 計算根拠トレース
  trace: PayrollLineTrace[];
}

export interface ClawbackItem {
  id: string;
  tenantId: string;
  policyNumber: string;
  insuredName: string;
  contractDate: string;
  cancelDate: string;
  elapsedMonths: number;
  originalCommission: number;
  clawbackRate: number;
  deductionAmount: number;
  staffId: string;
  staffName: string;
  status: 'pending' | 'approved' | 'applied';
}

export interface AuditLog {
  id: string;
  tenantId: string;
  operator: string;
  operatedAt: string;
  target: string;
  action: string;
  before?: string;
  after?: string;
  comment?: string;
}
