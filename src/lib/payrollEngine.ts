// 給与計算エンジンのモック実装

export interface CalculationResult {
  staffId: string;
  staffName: string;
  baseTotal: number;
  commissionFirstYear: number;
  commissionRenewal: number;
  incentive: number;
  clawback: number;
  grossAmount: number;
  deductions: number;
  netAmount: number;
}

export function runPayrollSimulation(): CalculationResult[] {
  // 擬似的な計算ロジック
  return [
    {
      staffId: '1',
      staffName: '田中 一郎',
      baseTotal: 365000,
      commissionFirstYear: 150000,
      commissionRenewal: 100000,
      incentive: 12500,
      clawback: 12500, // C001
      grossAmount: 615000,
      deductions: 120000,
      netAmount: 495000
    },
    {
      staffId: '2',
      staffName: '鈴木 花子',
      baseTotal: 280000,
      commissionFirstYear: 100000,
      commissionRenewal: 80000,
      incentive: 0,
      clawback: 0,
      grossAmount: 460000,
      deductions: 90000,
      netAmount: 370000
    },
    {
      staffId: '3',
      staffName: '佐藤 次郎',
      baseTotal: 232000,
      commissionFirstYear: 90000,
      commissionRenewal: 30000,
      incentive: 0,
      clawback: 32000, // C002
      grossAmount: 320000, // 232k + 120k - 32k
      deductions: 60000,
      netAmount: 260000
    },
    {
      staffId: '4',
      staffName: '高橋 三郎',
      baseTotal: 230000,
      commissionFirstYear: 150000,
      commissionRenewal: 43000,
      incentive: 0,
      clawback: 0,
      grossAmount: 423000,
      deductions: 80000,
      netAmount: 343000
    }
  ];
}
