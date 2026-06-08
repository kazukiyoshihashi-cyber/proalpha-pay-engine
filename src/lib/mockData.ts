// モックデータ (初期ダミーデータ)
export const MOCK_STAFF = [
  { id: '1', staffCode: 'S001', name: '田中 一郎', branch: '臼杵本店', role: '支社長', baseSalary: 300000, commuteAllowance: 15000, positionAllowance: 50000 },
  { id: '2', staffCode: 'S002', name: '鈴木 花子', branch: '臼杵本店', role: 'チームリーダー', baseSalary: 250000, commuteAllowance: 10000, positionAllowance: 20000 },
  { id: '3', staffCode: 'S003', name: '佐藤 次郎', branch: '中津支社', role: '一般', baseSalary: 220000, commuteAllowance: 12000, positionAllowance: 0 },
  { id: '4', staffCode: 'S004', name: '高橋 三郎', branch: '大分支社', role: '一般', baseSalary: 220000, commuteAllowance: 10000, positionAllowance: 0 },
];

export const MOCK_PAYROLL_SUMMARY = {
  targetYearMonth: '2025-06',
  status: '未実行', // 未実行, 計算中, 承認待ち, 確定済み
  totalExpectedPayout: 1850000,
  staffCount: 4,
  pendingClawbacks: 2,
  clawbackAlertAmount: 45000,
};

export const MOCK_CHART_DATA = [
  { month: '3月', 支給額: 1750000 },
  { month: '4月', 支給額: 1800000 },
  { month: '5月', 支給額: 1720000 },
  { month: '6月(予)', 支給額: 1850000 },
];

export const MOCK_STAFF_PAYOUTS = [
  { id: '1', name: '田中 一郎', base: 365000, commission: 250000, expected: 615000, status: '未計算' },
  { id: '2', name: '鈴木 花子', base: 280000, commission: 180000, expected: 460000, status: '未計算' },
  { id: '3', name: '佐藤 次郎', base: 232000, commission: 120000, expected: 352000, status: '未計算' },
  { id: '4', name: '高橋 三郎', base: 230000, commission: 193000, expected: 423000, status: '未計算' },
];

export const MOCK_PENDING_CLAWBACKS = [
  { id: 'C001', policyNumber: 'A1234567', insuredName: '山田 太郎', contractDate: '2024-03-01', cancelDate: '2025-06-10', elapsedMonths: 15, originalAmount: 50000, clawbackRate: 0.25, deductionAmount: 12500, staffName: '田中 一郎', status: '未処理' },
  { id: 'C002', policyNumber: 'B9876543', insuredName: '伊藤 美咲', contractDate: '2025-01-15', cancelDate: '2025-06-05', elapsedMonths: 5, originalAmount: 40000, clawbackRate: 0.80, deductionAmount: 32000, staffName: '佐藤 次郎', status: '未処理' },
];
