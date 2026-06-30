import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { MOCK_PAYROLL_LINES, MOCK_STAFF } from "../lib/mockData";
import type { EmploymentType } from "../types";
import { ChevronDown, ChevronRight, Download, Search, Info } from "lucide-react";

const EMPLOYMENT_LABELS: Record<EmploymentType, string> = {
  employed: '雇用型',
  commission: '業務委託型',
  hybrid: 'ハイブリッド型',
};

export function PayslipDetail() {
  const [selectedId, setSelectedId] = useState<string>(MOCK_PAYROLL_LINES[0].id);
  const [showTrace, setShowTrace] = useState(true);

  const selected = MOCK_PAYROLL_LINES.find(l => l.id === selectedId)!;
  const staff = MOCK_STAFF.find(s => s.id === selected.staffId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary tracking-tight">給与明細・計算根拠</h1>
        <p className="text-muted-foreground mt-1">2025年6月度　— 各スタッフの明細と、金額の根拠をトレースできます</p>
      </div>

      <div className="flex gap-6">
        {/* スタッフ選択 */}
        <Card className="w-64 shrink-0 h-fit">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Search className="w-4 h-4" />スタッフ選択</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            {MOCK_PAYROLL_LINES.map(line => {
              const s = MOCK_STAFF.find(st => st.id === line.staffId);
              return (
                <button
                  key={line.id}
                  className={`w-full text-left rounded-md px-3 py-2 text-sm transition-colors ${selectedId === line.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  onClick={() => setSelectedId(line.id)}
                >
                  <div className="font-medium">{line.staffName}</div>
                  <div className={`text-xs ${selectedId === line.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {s?.branchName} / {EMPLOYMENT_LABELS[line.employmentType]}
                  </div>
                  <div className={`font-mono text-xs font-bold mt-1 ${selectedId === line.id ? 'text-secondary' : 'text-primary'}`}>
                    ¥{line.netSalary.toLocaleString()}
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* 明細本体 */}
        <div className="flex-1 space-y-4">
          {/* ヘッダー */}
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xl font-bold">{selected.staffName} 様</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {staff?.branchName} ／ {staff?.role} ／
                    <Badge className={`ml-2 text-xs ${selected.employmentType === 'employed' ? 'bg-blue-100 text-blue-800' : selected.employmentType === 'commission' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'} border-0`}>
                      {EMPLOYMENT_LABELS[selected.employmentType]}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">2025年6月度</div>
                </div>
                <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />PDF</Button>
              </div>
            </CardContent>
          </Card>

          {/* 支給 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">支給</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {selected.baseSalary > 0 && <PayRow label="基本給" value={selected.baseSalary} />}
                {selected.positionAllowance > 0 && <PayRow label="役職手当" value={selected.positionAllowance} />}
                {selected.commuteAllowance > 0 && <PayRow label="通勤手当" value={selected.commuteAllowance} />}
                {selected.commissionFirstYear > 0 && <PayRow label="初年度歩合給" value={selected.commissionFirstYear} highlight="blue" />}
                {selected.commissionRenewal > 0 && <PayRow label="継続歩合給" value={selected.commissionRenewal} highlight="blue" />}
                {selected.incentive > 0 && <PayRow label="インセンティブ" value={selected.incentive} highlight="green" />}
                {selected.clawback !== 0 && <PayRow label="クローバック調整" value={selected.clawback} highlight="red" />}
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-base">
                  <span>支給合計（税引前）</span>
                  <span className="font-mono">¥{selected.grossSalary.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 控除 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">控除</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {selected.employmentType !== 'commission' && (
                  <>
                    {selected.healthInsurance > 0 && <DeductRow label="健康保険料" value={selected.healthInsurance} />}
                    {selected.nursingInsurance > 0 && <DeductRow label="介護保険料" value={selected.nursingInsurance} />}
                    {selected.pensionInsurance > 0 && <DeductRow label="厚生年金保険料" value={selected.pensionInsurance} />}
                    {selected.employmentInsurance > 0 && <DeductRow label="雇用保険料" value={selected.employmentInsurance} />}
                    {selected.withholdingTax > 0 && <DeductRow label="源泉所得税（給与所得）" value={selected.withholdingTax} note="甲欄 源泉徴収税額表適用" />}
                  </>
                )}
                {selected.agent204Tax > 0 && (
                  <DeductRow
                    label="源泉所得税（外交員報酬 所204条）"
                    value={selected.agent204Tax}
                    note={`(歩合給 - ¥120,000) × 10.21%`}
                  />
                )}
                {selected.agent204Tax === 0 && (selected.employmentType === 'commission' || selected.employmentType === 'hybrid') && (
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>源泉所得税（外交員報酬 所204条）</span>
                    <span className="font-mono text-xs">歩合給¥120,000未満のため非課税</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-base text-destructive">
                  <span>控除合計</span>
                  <span className="font-mono">- ¥{selected.totalDeductions.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 差引支給額 */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">差引支給額（手取り）</span>
                <span className="font-mono text-3xl font-bold text-secondary">¥{selected.netSalary.toLocaleString()}</span>
              </div>
              <div className="text-primary-foreground/70 text-sm mt-1">
                振込先: {staff?.bankAccount}
              </div>
            </CardContent>
          </Card>

          {/* 計算根拠トレース */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  計算根拠トレース（E-08）
                </CardTitle>
                <button
                  className="text-sm text-primary flex items-center gap-1"
                  onClick={() => setShowTrace(!showTrace)}
                >
                  {showTrace ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  {showTrace ? '折りたたむ' : '展開する'}
                </button>
              </div>
            </CardHeader>
            {showTrace && (
              <CardContent>
                <div className="text-xs text-muted-foreground mb-3 bg-muted/50 rounded-md p-3">
                  どのルール・どの参照テーブル・どの入力値が適用されたかを確認できます。本人にも開示可能な透明性を確保しています。
                </div>
                <div className="space-y-3">
                  {selected.trace.map((t, i) => (
                    <div key={i} className="border rounded-lg overflow-hidden">
                      <div className="bg-muted/50 px-4 py-2 flex items-center justify-between">
                        <div className="font-medium text-sm">{t.ruleName}</div>
                        <div className={`font-mono text-sm font-bold ${t.result < 0 ? 'text-destructive' : 'text-success'}`}>
                          {t.result >= 0 ? '+' : ''}¥{t.result.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-4 grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs font-semibold text-muted-foreground mb-2">入力値</div>
                          <div className="space-y-1">
                            {Object.entries(t.inputValues).map(([k, v]) => (
                              <div key={k} className="flex justify-between text-xs font-mono">
                                <span className="text-muted-foreground">{k}</span>
                                <span className="font-semibold">{typeof v === 'number' ? v.toLocaleString() : String(v)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-muted-foreground mb-2">計算過程</div>
                          <div className="bg-gray-900 text-green-400 rounded-md px-3 py-2 font-mono text-xs">
                            {t.formula}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function PayRow({ label, value, highlight }: { label: string; value: number; highlight?: 'blue' | 'green' | 'red' }) {
  const colorMap = { blue: 'text-blue-700', green: 'text-green-700', red: 'text-destructive' };
  return (
    <div className={`flex justify-between items-center ${highlight ? colorMap[highlight] : ''}`}>
      <span>{label}</span>
      <span className="font-mono">{value < 0 ? '-' : '+'}¥{Math.abs(value).toLocaleString()}</span>
    </div>
  );
}

function DeductRow({ label, value, note }: { label: string; value: number; note?: string }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <span>{label}</span>
        {note && <span className="text-xs text-muted-foreground ml-2">({note})</span>}
      </div>
      <span className="font-mono text-muted-foreground">- ¥{value.toLocaleString()}</span>
    </div>
  );
}
