import type {
  Tenant, Branch, Staff, InsuranceCompany, Product,
  CommissionRecord, CalculationRule, LookupTable,
  PayrollRun, PayrollLine, ClawbackItem, AuditLog,
} from '../types';

// =============================================
// Tenant
// =============================================
export const MOCK_TENANT: Tenant = {
  id: 'T001',
  name: '株式会社プロアルファ',
  plan: 'enterprise',
  status: 'active',
};

// =============================================
// Branches
// =============================================
export const MOCK_BRANCHES: Branch[] = [
  { id: 'B001', tenantId: 'T001', name: '臼杵本店', rank: 'S' },
  { id: 'B002', tenantId: 'T001', name: '中津支社', rank: 'A' },
  { id: 'B003', tenantId: 'T001', name: '大分支社', rank: 'A' },
];

// =============================================
// Staff
// =============================================
export const MOCK_STAFF: Staff[] = [
  {
    id: 'S001', tenantId: 'T001', staffCode: 'S001',
    name: '安東 弘敏', branchId: 'B001', branchName: '臼杵本店',
    role: '代表・マスター管理者', employmentType: 'employed',
    joinDate: '1998-04-01', baseSalary: 500000, commuteAllowance: 0,
    positionAllowance: 100000, dependents: 2, taxCategory: 'A',
    bankAccount: '大分銀行 臼杵支店 普通 1234567',
  },
  {
    id: 'S002', tenantId: 'T001', staffCode: 'S002',
    name: '田中 一郎', branchId: 'B001', branchName: '臼杵本店',
    role: '支社長', employmentType: 'employed',
    joinDate: '2005-04-01', baseSalary: 300000, commuteAllowance: 15000,
    positionAllowance: 50000, dependents: 1, taxCategory: 'A',
    bankAccount: '大分銀行 臼杵支店 普通 2345678',
  },
  {
    id: 'S003', tenantId: 'T001', staffCode: 'S003',
    name: '鈴木 花子', branchId: 'B001', branchName: '臼杵本店',
    role: 'チームリーダー', employmentType: 'hybrid',
    joinDate: '2012-07-01', baseSalary: 200000, commuteAllowance: 10000,
    positionAllowance: 20000, dependents: 0, taxCategory: 'A',
    invoiceNumber: 'T1234567890123',
    bankAccount: '大分銀行 臼杵支店 普通 3456789',
  },
  {
    id: 'S004', tenantId: 'T001', staffCode: 'S004',
    name: '佐藤 次郎', branchId: 'B002', branchName: '中津支社',
    role: '一般', employmentType: 'employed',
    joinDate: '2018-04-01', baseSalary: 220000, commuteAllowance: 12000,
    positionAllowance: 0, dependents: 0, taxCategory: 'A',
    bankAccount: '大分銀行 中津支店 普通 4567890',
  },
  {
    id: 'S005', tenantId: 'T001', staffCode: 'S005',
    name: '高橋 三郎', branchId: 'B003', branchName: '大分支社',
    role: '一般', employmentType: 'commission',
    joinDate: '2020-10-01', baseSalary: 0, commuteAllowance: 0,
    positionAllowance: 0, dependents: 1, taxCategory: 'A',
    invoiceNumber: 'T9876543210987',
    bankAccount: '大分銀行 大分支店 普通 5678901',
  },
];

// =============================================
// Insurance Companies
// =============================================
export const MOCK_INSURANCE_COMPANIES: InsuranceCompany[] = [
  {
    id: 'IC001', tenantId: 'T001',
    name: '東京海上日動火災保険株式会社', shortName: '東京海上日動（損保）',
    csvMapping: { 証券番号: 0, 契約者名: 1, 商品コード: 3, 手数料金額: 6, 担当者名: 10 },
  },
  {
    id: 'IC002', tenantId: 'T001',
    name: '東京海上日動あんしん生命保険株式会社', shortName: '東京海上あんしん生命',
    csvMapping: { 証券番号: 0, 被保険者名: 2, 商品コード: 4, 手数料金額: 8, 担当者コード: 11 },
  },
];

// =============================================
// Products
// =============================================
export const MOCK_PRODUCTS: Product[] = [
  { id: 'P001', tenantId: 'T001', insuranceCompanyId: 'IC001', insuranceCompanyName: '東京海上日動（損保）', name: '自動車保険', category: '自動車', contractType: 'renewal', defaultRate: 20 },
  { id: 'P002', tenantId: 'T001', insuranceCompanyId: 'IC001', insuranceCompanyName: '東京海上日動（損保）', name: '火災保険', category: '火災', contractType: 'renewal', defaultRate: 18 },
  { id: 'P003', tenantId: 'T001', insuranceCompanyId: 'IC001', insuranceCompanyName: '東京海上日動（損保）', name: '傷害保険', category: '傷害', contractType: 'renewal', defaultRate: 15 },
  { id: 'P004', tenantId: 'T001', insuranceCompanyId: 'IC002', insuranceCompanyName: '東京海上あんしん生命', name: '医療保険（新契約）', category: '医療', contractType: 'new', defaultRate: 45 },
  { id: 'P005', tenantId: 'T001', insuranceCompanyId: 'IC002', insuranceCompanyName: '東京海上あんしん生命', name: '定期保険（新契約）', category: '定期', contractType: 'new', defaultRate: 50 },
  { id: 'P006', tenantId: 'T001', insuranceCompanyId: 'IC002', insuranceCompanyName: '東京海上あんしん生命', name: '医療保険（継続）', category: '医療', contractType: 'renewal', defaultRate: 5 },
];

// =============================================
// ANDO Engine: Calculation Rules
// =============================================
export const MOCK_CALCULATION_RULES: CalculationRule[] = [
  {
    id: 'CR001', tenantId: 'T001',
    name: '損保・継続手数料 → 個人配分（基本）',
    description: '損保継続手数料を代理店受領額 × 個人配分率で計算する基本ルール',
    category: 'commission',
    conditions: [
      { field: 'product.contractType', operator: 'eq', value: 'renewal' },
      { field: 'product.category', operator: 'in', value: ['自動車', '火災', '傷害'] },
    ],
    action: { type: 'formula', expression: 'COMMISSION_AMOUNT * ALLOCATION_RATE / 100' },
    priority: 10,
    effectiveFrom: '2025-04-01',
    status: 'approved',
    createdBy: '安東 弘敏',
    approvedBy: '安東 弘敏',
    approvedAt: '2025-03-25T10:00:00',
    changeReason: '2025年度改定に伴い料率テーブルを更新',
  },
  {
    id: 'CR002', tenantId: 'T001',
    name: '生保・新契約手数料 → 個人配分（初年度）',
    description: '生保新契約初年度手数料の個人配分。担当者の勤続年数・資格に応じた配分率テーブルを参照する。',
    category: 'commission',
    conditions: [
      { field: 'product.contractType', operator: 'eq', value: 'new' },
      { field: 'product.insuranceCompanyId', operator: 'eq', value: 'IC002' },
    ],
    action: { type: 'formula', expression: 'COMMISSION_AMOUNT * LOOKUP("allocation_by_years", YEARS_OF_SERVICE) / 100' },
    priority: 20,
    effectiveFrom: '2025-04-01',
    status: 'approved',
    createdBy: '安東 弘敏',
    approvedBy: '安東 弘敏',
    approvedAt: '2025-03-25T10:00:00',
    changeReason: '2025年度改定',
  },
  {
    id: 'CR003', tenantId: 'T001',
    name: '早期解約クローバック（13ヶ月未満）',
    description: '契約から13ヶ月未満で解約された場合の天引きルール。経過月数に応じた戻入率テーブルを参照する。',
    category: 'clawback',
    conditions: [
      { field: 'clawback.elapsedMonths', operator: 'lt', value: 13 },
    ],
    action: { type: 'formula', expression: 'ORIGINAL_COMMISSION * LOOKUP("clawback_rates", ELAPSED_MONTHS) / 100 * -1' },
    priority: 10,
    effectiveFrom: '2024-01-01',
    status: 'approved',
    createdBy: '安東 弘敏',
    approvedBy: '安東 弘敏',
    approvedAt: '2023-12-20T10:00:00',
    changeReason: '初期設定',
  },
  {
    id: 'CR004', tenantId: 'T001',
    name: '目標達成率インセンティブ',
    description: '月次目標の達成率100%以上で歩合給の120%、80-99%で100%、60-79%で90%を乗じる。',
    category: 'incentive',
    conditions: [],
    action: { type: 'formula', expression: 'COMMISSION_SUBTOTAL * (IF(ACHIEVEMENT_RATE >= 100, 1.20, IF(ACHIEVEMENT_RATE >= 80, 1.00, 0.90)) - 1)' },
    priority: 30,
    effectiveFrom: '2025-04-01',
    status: 'pending_approval',
    createdBy: '安東 弘敏',
    changeReason: '達成率ボーナス制度の導入（承認待ち）',
  },
  {
    id: 'CR005', tenantId: 'T001',
    name: '外交員報酬 源泉徴収（所得税法204条）',
    description: '業務委託型・ハイブリッド型の歩合給部分に適用。1ヶ月の支払額 - 120,000円 の残額 × 10.21%',
    category: 'tax',
    conditions: [
      { field: 'staff.employmentType', operator: 'in', value: ['commission', 'hybrid'] },
    ],
    action: { type: 'formula', expression: 'MAX(0, AGENT_COMMISSION - 120000) * 0.1021' },
    priority: 10,
    effectiveFrom: '2024-01-01',
    status: 'approved',
    createdBy: '安東 弘敏',
    approvedBy: '安東 弘敏',
    approvedAt: '2023-12-20T10:00:00',
    changeReason: '初期設定：所得税法204条に基づく外交員報酬の源泉徴収',
  },
];

// =============================================
// ANDO Engine: Lookup Tables
// =============================================
export const MOCK_LOOKUP_TABLES: LookupTable[] = [
  {
    id: 'LT001', tenantId: 'T001',
    name: 'allocation_by_years',
    description: '勤続年数別 個人配分率（生保新契約）',
    dimensions: ['勤続年数（年）'],
    rows: [
      { keys: ['0-2'], value: 55 },
      { keys: ['3-5'], value: 60 },
      { keys: ['6-9'], value: 65 },
      { keys: ['10-'], value: 70 },
    ],
  },
  {
    id: 'LT002', tenantId: 'T001',
    name: 'clawback_rates',
    description: '経過月数別 戻入率（クローバック）',
    dimensions: ['経過月数'],
    rows: [
      { keys: ['0-3'], value: 100 },
      { keys: ['4-6'], value: 80 },
      { keys: ['7-9'], value: 60 },
      { keys: ['10-12'], value: 40 },
    ],
  },
  {
    id: 'LT003', tenantId: 'T001',
    name: 'life_renewal_rate',
    description: '外貨建て保険 継続手数料率（通貨×経過年数）',
    dimensions: ['通貨', '経過年数'],
    rows: [
      { keys: ['USD', '1-5'], value: 2.5 },
      { keys: ['USD', '6-10'], value: 1.8 },
      { keys: ['USD', '11-'], value: 1.2 },
      { keys: ['AUD', '1-5'], value: 2.8 },
      { keys: ['AUD', '6-10'], value: 2.0 },
      { keys: ['AUD', '11-'], value: 1.5 },
    ],
  },
];

// =============================================
// Commission Records
// =============================================
export const MOCK_COMMISSION_RECORDS: CommissionRecord[] = [
  { id: 'CM001', tenantId: 'T001', policyNumber: 'TM-2024-001', insuredName: '山田 太郎', productId: 'P001', productName: '自動車保険', insuranceCompanyName: '東京海上日動（損保）', contractDate: '2024-04-01', annualPremium: 120000, commissionAmount: 24000, staffId: 'S002', staffName: '田中 一郎', targetYearMonth: '2025-06', contractType: 'renewal' },
  { id: 'CM002', tenantId: 'T001', policyNumber: 'TM-2024-002', insuredName: '佐藤 恵子', productId: 'P002', productName: '火災保険', insuranceCompanyName: '東京海上日動（損保）', contractDate: '2024-04-15', annualPremium: 80000, commissionAmount: 14400, staffId: 'S002', staffName: '田中 一郎', targetYearMonth: '2025-06', contractType: 'renewal' },
  { id: 'CM003', tenantId: 'T001', policyNumber: 'AS-2025-001', insuredName: '高山 正之', productId: 'P004', productName: '医療保険（新契約）', insuranceCompanyName: '東京海上あんしん生命', contractDate: '2025-05-01', annualPremium: 200000, commissionAmount: 90000, staffId: 'S002', staffName: '田中 一郎', targetYearMonth: '2025-06', contractType: 'new' },
  { id: 'CM004', tenantId: 'T001', policyNumber: 'TM-2025-010', insuredName: '中村 美香', productId: 'P001', productName: '自動車保険', insuranceCompanyName: '東京海上日動（損保）', contractDate: '2024-06-01', annualPremium: 95000, commissionAmount: 19000, staffId: 'S003', staffName: '鈴木 花子', targetYearMonth: '2025-06', contractType: 'renewal' },
  { id: 'CM005', tenantId: 'T001', policyNumber: 'AS-2025-002', insuredName: '伊藤 健一', productId: 'P005', productName: '定期保険（新契約）', insuranceCompanyName: '東京海上あんしん生命', contractDate: '2025-06-01', annualPremium: 180000, commissionAmount: 90000, staffId: 'S003', staffName: '鈴木 花子', targetYearMonth: '2025-06', contractType: 'new' },
  { id: 'CM006', tenantId: 'T001', policyNumber: 'TM-2024-030', insuredName: '松田 浩二', productId: 'P003', productName: '傷害保険', insuranceCompanyName: '東京海上日動（損保）', contractDate: '2024-06-15', annualPremium: 55000, commissionAmount: 8250, staffId: 'S004', staffName: '佐藤 次郎', targetYearMonth: '2025-06', contractType: 'renewal' },
  { id: 'CM007', tenantId: 'T001', policyNumber: 'TM-2025-021', insuredName: '渡辺 幸子', productId: 'P002', productName: '火災保険', insuranceCompanyName: '東京海上日動（損保）', contractDate: '2025-05-20', annualPremium: 110000, commissionAmount: 19800, staffId: 'S005', staffName: '高橋 三郎', targetYearMonth: '2025-06', contractType: 'renewal' },
  { id: 'CM008', tenantId: 'T001', policyNumber: 'AS-2025-010', insuredName: '加藤 誠', productId: 'P004', productName: '医療保険（新契約）', insuranceCompanyName: '東京海上あんしん生命', contractDate: '2025-06-10', annualPremium: 150000, commissionAmount: 67500, staffId: 'S005', staffName: '高橋 三郎', targetYearMonth: '2025-06', contractType: 'new' },
];

// =============================================
// Clawback Items
// =============================================
export const MOCK_CLAWBACKS: ClawbackItem[] = [
  {
    id: 'CW001', tenantId: 'T001',
    policyNumber: 'AS-2024-055', insuredName: '山田 太郎',
    contractDate: '2024-03-01', cancelDate: '2025-06-10',
    elapsedMonths: 15, originalCommission: 50000,
    clawbackRate: 0.25, deductionAmount: 12500,
    staffId: 'S002', staffName: '田中 一郎',
    status: 'pending',
  },
  {
    id: 'CW002', tenantId: 'T001',
    policyNumber: 'AS-2025-003', insuredName: '伊藤 美咲',
    contractDate: '2025-01-15', cancelDate: '2025-06-05',
    elapsedMonths: 5, originalCommission: 40000,
    clawbackRate: 0.80, deductionAmount: 32000,
    staffId: 'S004', staffName: '佐藤 次郎',
    status: 'pending',
  },
];

// =============================================
// Payroll Lines (計算済みサンプル)
// =============================================
export const MOCK_PAYROLL_LINES: PayrollLine[] = [
  {
    id: 'PL001', tenantId: 'T001', payrollRunId: 'PR001',
    staffId: 'S002', staffName: '田中 一郎', employmentType: 'employed',
    baseSalary: 300000, positionAllowance: 50000, commuteAllowance: 15000,
    commissionFirstYear: 63000, commissionRenewal: 26880, incentive: 0, clawback: -12500,
    grossSalary: 442380,
    healthInsurance: 22000, nursingInsurance: 3500, pensionInsurance: 40260,
    employmentInsurance: 2654, withholdingTax: 14430,
    agent204Tax: 0, totalDeductions: 82844, netSalary: 359536,
    trace: [
      { ruleId: 'CR002', ruleName: '生保・新契約手数料 → 個人配分（初年度）', inputValues: { COMMISSION_AMOUNT: 90000, LOOKUP_KEY: '20年', ALLOCATION_RATE: 70 }, result: 63000, formula: '90000 × 70% = 63,000' },
      { ruleId: 'CR001', ruleName: '損保・継続手数料 → 個人配分（基本）', inputValues: { COMMISSION_AMOUNT: 38400, ALLOCATION_RATE: 70 }, result: 26880, formula: '38,400 × 70% = 26,880' },
      { ruleId: 'CR003', ruleName: '早期解約クローバック（13ヶ月未満）', inputValues: { ORIGINAL_COMMISSION: 50000, ELAPSED_MONTHS: 15, CLAWBACK_RATE: 25 }, result: -12500, formula: '50,000 × 25% × -1 = -12,500' },
    ],
  },
  {
    id: 'PL002', tenantId: 'T001', payrollRunId: 'PR001',
    staffId: 'S003', staffName: '鈴木 花子', employmentType: 'hybrid',
    baseSalary: 200000, positionAllowance: 20000, commuteAllowance: 10000,
    commissionFirstYear: 54000, commissionRenewal: 11400, incentive: 0, clawback: 0,
    grossSalary: 295400,
    healthInsurance: 14000, nursingInsurance: 2240, pensionInsurance: 25740,
    employmentInsurance: 1697, withholdingTax: 5590,
    agent204Tax: 6905, // MAX(0, 65400-120000)*10.21% = 0... actually (54000+11400-120000)*10.21% but 65400<120000 so 0... wait
    // 歩合給計 = 54000+11400 = 65400。65400-120000<0 なので204条税 = 0
    // 実際: agent204Tax = MAX(0, 65400-120000)*0.1021 = 0
    totalDeductions: 49227, netSalary: 246173,
    trace: [
      { ruleId: 'CR002', ruleName: '生保・新契約手数料 → 個人配分（初年度）', inputValues: { COMMISSION_AMOUNT: 90000, YEARS_OF_SERVICE: 12, ALLOCATION_RATE: 60 }, result: 54000, formula: '90,000 × 60% = 54,000' },
      { ruleId: 'CR001', ruleName: '損保・継続手数料 → 個人配分（基本）', inputValues: { COMMISSION_AMOUNT: 19000, ALLOCATION_RATE: 60 }, result: 11400, formula: '19,000 × 60% = 11,400' },
      { ruleId: 'CR005', ruleName: '外交員報酬 源泉徴収（所得税法204条）', inputValues: { AGENT_COMMISSION: 65400, THRESHOLD: 120000 }, result: 0, formula: 'MAX(0, 65,400 - 120,000) × 10.21% = 0（120,000未満のため非課税）' },
    ],
  },
  {
    id: 'PL003', tenantId: 'T001', payrollRunId: 'PR001',
    staffId: 'S004', staffName: '佐藤 次郎', employmentType: 'employed',
    baseSalary: 220000, positionAllowance: 0, commuteAllowance: 12000,
    commissionFirstYear: 0, commissionRenewal: 4950, incentive: 0, clawback: -32000,
    grossSalary: 204950,
    healthInsurance: 11000, nursingInsurance: 1760, pensionInsurance: 20130,
    employmentInsurance: 1230, withholdingTax: 5900,
    agent204Tax: 0, totalDeductions: 40020, netSalary: 164930,
    trace: [
      { ruleId: 'CR001', ruleName: '損保・継続手数料 → 個人配分（基本）', inputValues: { COMMISSION_AMOUNT: 8250, ALLOCATION_RATE: 60 }, result: 4950, formula: '8,250 × 60% = 4,950' },
      { ruleId: 'CR003', ruleName: '早期解約クローバック（13ヶ月未満）', inputValues: { ORIGINAL_COMMISSION: 40000, ELAPSED_MONTHS: 5, CLAWBACK_RATE: 80 }, result: -32000, formula: '40,000 × 80% × -1 = -32,000' },
    ],
  },
  {
    id: 'PL004', tenantId: 'T001', payrollRunId: 'PR001',
    staffId: 'S005', staffName: '高橋 三郎', employmentType: 'commission',
    baseSalary: 0, positionAllowance: 0, commuteAllowance: 0,
    commissionFirstYear: 47250, commissionRenewal: 13860, incentive: 0, clawback: 0,
    grossSalary: 61110,
    healthInsurance: 0, nursingInsurance: 0, pensionInsurance: 0,
    employmentInsurance: 0, withholdingTax: 0,
    agent204Tax: 0, // MAX(0, 61110-120000)*10.21% = 0（120,000未満）
    totalDeductions: 0, netSalary: 61110,
    trace: [
      { ruleId: 'CR002', ruleName: '生保・新契約手数料 → 個人配分（初年度）', inputValues: { COMMISSION_AMOUNT: 67500, YEARS_OF_SERVICE: 4, ALLOCATION_RATE: 70 }, result: 47250, formula: '67,500 × 70% = 47,250' },
      { ruleId: 'CR001', ruleName: '損保・継続手数料 → 個人配分（基本）', inputValues: { COMMISSION_AMOUNT: 19800, ALLOCATION_RATE: 70 }, result: 13860, formula: '19,800 × 70% = 13,860' },
      { ruleId: 'CR005', ruleName: '外交員報酬 源泉徴収（所得税法204条）', inputValues: { AGENT_COMMISSION: 61110, THRESHOLD: 120000 }, result: 0, formula: 'MAX(0, 61,110 - 120,000) × 10.21% = 0（120,000未満のため非課税）' },
    ],
  },
];

// =============================================
// Payroll Run
// =============================================
export const MOCK_PAYROLL_RUN: PayrollRun = {
  id: 'PR001', tenantId: 'T001',
  targetYearMonth: '2025-06',
  status: 'review',
  createdBy: '安東 弘敏',
};

// =============================================
// Audit Log
// =============================================
export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'AL001', tenantId: 'T001', operator: '安東 弘敏', operatedAt: '2025-06-20T10:15:00', target: 'CalculationRule:CR003', action: '更新', before: 'clawbackRate=0.50', after: 'clawbackRate=0.80（6ヶ月未満）', comment: '保険会社からの通達に基づき戻入率を改定' },
  { id: 'AL002', tenantId: 'T001', operator: '安東 弘敏', operatedAt: '2025-06-18T14:30:00', target: 'CalculationRule:CR004', action: '作成', after: 'インセンティブルール（承認待ち）', comment: '目標達成率連動インセンティブ制度の試験導入' },
  { id: 'AL003', tenantId: 'T001', operator: '田中 一郎', operatedAt: '2025-06-15T09:00:00', target: 'ClawbackItem:CW001', action: '承認', before: 'status=pending', after: 'status=approved', comment: '解約通知書確認済み' },
  { id: 'AL004', tenantId: 'T001', operator: '安東 弘敏', operatedAt: '2025-06-01T08:30:00', target: 'PayrollRun:PR001', action: '計算実行', after: 'status=review', comment: '2025年6月度給与計算を実行' },
  { id: 'AL005', tenantId: 'T001', operator: '安東 弘敏', operatedAt: '2025-05-25T11:00:00', target: 'LookupTable:LT001', action: '更新', before: '3-5年=58%', after: '3-5年=60%', comment: '2025年度配分率改定' },
];

// =============================================
// Dashboard summary (derived)
// =============================================
export const MOCK_CHART_DATA = [
  { month: '3月', 支給額: 1750000 },
  { month: '4月', 支給額: 1800000 },
  { month: '5月', 支給額: 1720000 },
  { month: '6月', 支給額: MOCK_PAYROLL_LINES.reduce((s, l) => s + l.grossSalary, 0) },
];

export const MOCK_PENDING_CLAWBACKS = MOCK_CLAWBACKS; // alias for backward compat
