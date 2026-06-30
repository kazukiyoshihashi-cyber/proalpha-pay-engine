import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { MOCK_PAYROLL_LINES } from "../lib/mockData";
import { Beaker, ChevronUp, ChevronDown, Minus, AlertCircle } from "lucide-react";

interface SimConfig {
  ruleId: string;
  ruleName: string;
  paramLabel: string;
  currentValue: number;
  newValue: number;
  unit: string;
}

const INITIAL_CONFIG: SimConfig = {
  ruleId: 'CR001',
  ruleName: '損保・継続手数料 → 個人配分（基本）',
  paramLabel: 'スタッフ還元率',
  currentValue: 70,
  newValue: 75,
  unit: '%',
};

export function WhatIfSimulation() {
  const [config, setConfig] = useState<SimConfig>(INITIAL_CONFIG);
  const [simulated, setSimulated] = useState(false);

  const diff = config.newValue - config.currentValue;
  const ratio = config.newValue / config.currentValue;

  const simulatedLines = MOCK_PAYROLL_LINES.map(line => {
    const newRenewal = Math.round(line.commissionRenewal * ratio);
    const newGross = line.grossSalary - line.commissionRenewal + newRenewal;
    const newNet = line.netSalary - line.commissionRenewal + newRenewal;
    return {
      ...line,
      simCommissionRenewal: newRenewal,
      simGross: newGross,
      simNet: newNet,
      grossDiff: newGross - line.grossSalary,
    };
  });

  const totalCurrentGross = MOCK_PAYROLL_LINES.reduce((s, l) => s + l.grossSalary, 0);
  const totalSimGross = simulatedLines.reduce((s, l) => s + l.simGross, 0);
  const totalDiff = totalSimGross - totalCurrentGross;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary tracking-tight flex items-center gap-2">
          <Beaker className="w-7 h-7 text-secondary" /> What-if シミュレーション
        </h1>
        <p className="text-muted-foreground mt-1">ルール変更前に全スタッフへの影響額を試算します。本番反映はされません。</p>
      </div>

      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <p className="text-sm text-warning">
          シミュレーション結果は試算値です。「本番に適用」ボタンを押すまでは、現在の計算ルールには一切影響しません。
        </p>
      </div>

      {/* 変更パラメータ設定 */}
      <Card>
        <CardHeader>
          <CardTitle>変更シナリオ設定</CardTitle>
          <CardDescription>シミュレーションするルールと変更後の値を設定してください</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">対象ルール</label>
              <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm">
                <option>損保・継続手数料 → 個人配分（基本）</option>
                <option>生保・新契約手数料 → 個人配分（初年度）</option>
                <option>早期解約クローバック（13ヶ月未満）</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">変更パラメータ</label>
              <input type="text" value={config.paramLabel} readOnly className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">現在の値</label>
              <div className="flex h-9 items-center rounded-md border border-muted bg-muted/50 px-3 text-sm font-mono font-bold text-muted-foreground">
                {config.currentValue}{config.unit}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">変更後の値</label>
              <div className="flex">
                <Button variant="outline" size="sm" className="rounded-r-none" onClick={() => setConfig(c => ({ ...c, newValue: c.newValue - 1 }))}>
                  <ChevronDown className="w-4 h-4" />
                </Button>
                <input
                  type="number"
                  value={config.newValue}
                  onChange={e => setConfig(c => ({ ...c, newValue: Number(e.target.value) }))}
                  className="flex-1 text-center border-y border-input bg-background font-mono font-bold text-lg text-primary outline-none"
                />
                <Button variant="outline" size="sm" className="rounded-l-none" onClick={() => setConfig(c => ({ ...c, newValue: c.newValue + 1 }))}>
                  <ChevronUp className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">変化量</label>
              <div className={`flex h-9 items-center rounded-md border px-3 text-sm font-mono font-bold ${diff > 0 ? 'border-success/30 bg-success/10 text-success' : diff < 0 ? 'border-destructive/30 bg-destructive/10 text-destructive' : 'border-muted bg-muted/50 text-muted-foreground'}`}>
                {diff > 0 ? `+${diff}${config.unit}` : diff < 0 ? `${diff}${config.unit}` : `変化なし`}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
              onClick={() => setSimulated(true)}
            >
              <Beaker className="w-4 h-4 mr-2" /> シミュレーション実行
            </Button>
            {simulated && (
              <Button variant="outline" onClick={() => setSimulated(false)}>リセット</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* シミュレーション結果 */}
      {simulated && (
        <div className="space-y-4">
          {/* サマリー */}
          <div className="grid grid-cols-3 gap-4">
            <SummaryCard label="現在の総支給額" value={`¥${totalCurrentGross.toLocaleString()}`} />
            <SummaryCard label="変更後の総支給額" value={`¥${totalSimGross.toLocaleString()}`} highlight />
            <SummaryCard
              label="差額（全スタッフ計）"
              value={`${totalDiff > 0 ? '+' : ''}¥${totalDiff.toLocaleString()}`}
              color={totalDiff > 0 ? 'success' : 'destructive'}
            />
          </div>

          {/* 個人別比較 */}
          <Card>
            <CardHeader>
              <CardTitle>スタッフ別 影響額一覧</CardTitle>
              <CardDescription>
                変更ルール:「{config.ruleName}」 ／ {config.paramLabel}: {config.currentValue}% → {config.newValue}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>スタッフ</TableHead>
                    <TableHead className="text-right">現在の支給額</TableHead>
                    <TableHead className="text-right">変更後の支給額</TableHead>
                    <TableHead className="text-right font-bold">差額</TableHead>
                    <TableHead className="text-center">影響</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {simulatedLines.map(line => (
                    <TableRow key={line.id}>
                      <TableCell>
                        <div className="font-medium">{line.staffName}</div>
                        <div className="text-xs text-muted-foreground">{line.employmentType === 'commission' ? '業務委託型' : line.employmentType === 'hybrid' ? 'ハイブリッド型' : '雇用型'}</div>
                      </TableCell>
                      <TableCell className="text-right font-mono">¥{line.grossSalary.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono font-bold">¥{line.simGross.toLocaleString()}</TableCell>
                      <TableCell className={`text-right font-mono font-bold ${line.grossDiff > 0 ? 'text-success' : line.grossDiff < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {line.grossDiff > 0 ? '+' : ''}{line.grossDiff !== 0 ? `¥${line.grossDiff.toLocaleString()}` : '変化なし'}
                      </TableCell>
                      <TableCell className="text-center">
                        {line.grossDiff > 0 ? <ChevronUp className="w-4 h-4 text-success mx-auto" />
                          : line.grossDiff < 0 ? <ChevronDown className="w-4 h-4 text-destructive mx-auto" />
                          : <Minus className="w-4 h-4 text-muted-foreground mx-auto" />}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* アクション */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">シミュレーション結果を保存</Button>
            <Button className="bg-primary">本番ルールに適用する（承認フローへ）</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, highlight, color }: { label: string; value: string; highlight?: boolean; color?: 'success' | 'destructive' }) {
  return (
    <Card className={highlight ? 'border-primary/30 bg-primary/5' : ''}>
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className={`text-2xl font-bold font-mono mt-1 ${color === 'success' ? 'text-success' : color === 'destructive' ? 'text-destructive' : highlight ? 'text-primary' : ''}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
