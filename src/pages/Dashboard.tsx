import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { MOCK_PAYROLL_LINES, MOCK_CLAWBACKS, MOCK_CHART_DATA, MOCK_CALCULATION_RULES, MOCK_STAFF } from "../lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, Clock, Users, Banknote, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Dashboard() {
  const totalGross = MOCK_PAYROLL_LINES.reduce((s, l) => s + l.grossSalary, 0);
  const pendingApproval = MOCK_CALCULATION_RULES.filter(r => r.status === 'pending_approval').length;
  const pendingClawbacks = MOCK_CLAWBACKS.filter(c => c.status === 'pending').length;
  const clawbackTotal = MOCK_CLAWBACKS.filter(c => c.status === 'pending').reduce((s, c) => s + c.deductionAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary tracking-tight">ダッシュボード</h1>
          <p className="text-muted-foreground mt-1">2025年6月度 — 確認中</p>
        </div>
        <Button asChild>
          <Link to="/payroll/run">給与計算を実行 <ArrowRight className="w-4 h-4 ml-2" /></Link>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">計算ステータス</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge className="text-sm bg-warning/10 text-warning border-warning/20">確認中</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">承認者による最終確認待ち</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総支給予定額</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{totalGross.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">前月比 +5%（概算）</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">対象スタッフ</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_PAYROLL_LINES.length} 名</div>
            <p className="text-xs text-muted-foreground mt-1">
              雇用型{MOCK_STAFF.filter(s => s.employmentType === 'employed').length} ／ 委託型{MOCK_STAFF.filter(s => s.employmentType === 'commission').length} ／ ハイブリッド{MOCK_STAFF.filter(s => s.employmentType === 'hybrid').length}
            </p>
          </CardContent>
        </Card>

        <Card className={`${(pendingClawbacks > 0 || pendingApproval > 0) ? 'border-warning/50 bg-warning/5' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-warning">要対応アラート</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingClawbacks + pendingApproval} 件</div>
            <p className="text-xs text-warning/80 mt-1">
              {pendingClawbacks > 0 && `戻入承認待ち ${pendingClawbacks}件・`}
              {pendingApproval > 0 && `ルール承認待ち ${pendingApproval}件`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* アラートバナー */}
      {pendingApproval > 0 && (
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-warning" />
            <div>
              <span className="font-medium text-warning">ANDO Engineに承認待ちルールがあります</span>
              <p className="text-sm text-warning/80">「目標達成率インセンティブ」が承認待ちです。次回給与計算前に確認してください。</p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="border-warning/30 text-warning hover:bg-warning/10 shrink-0">
            <Link to="/engine">確認する</Link>
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-7">
        {/* チャート */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>直近の支給額推移</CardTitle>
            <CardDescription>過去3ヶ月と今月の支給予定額の比較</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} tickFormatter={v => `¥${(v / 10000).toFixed(0)}万`} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} formatter={(v) => [`¥${Number(v).toLocaleString()}`, '支給額']} />
                  <Bar dataKey="支給額" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* スタッフ別支給予定 */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>今月の支給予定（スタッフ別）</CardTitle>
            <CardDescription>計算根拠トレース付き（確認中）</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>スタッフ</TableHead>
                  <TableHead className="text-right">総支給額</TableHead>
                  <TableHead className="text-right">手取り</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_PAYROLL_LINES.map(line => (
                  <TableRow key={line.id}>
                    <TableCell>
                      <div className="font-medium text-sm">{line.staffName}</div>
                      <div className="text-xs text-muted-foreground">
                        {line.employmentType === 'commission' ? '業務委託' : line.employmentType === 'hybrid' ? 'ハイブリッド' : '雇用型'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">¥{line.grossSalary.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono text-sm font-bold text-primary">¥{line.netSalary.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-3 pt-3 border-t flex justify-between text-sm font-bold">
              <span>合計</span>
              <span className="font-mono text-primary">¥{totalGross.toLocaleString()}</span>
            </div>
            <Button asChild variant="link" className="w-full mt-2 text-primary">
              <Link to="/payslip">明細・計算根拠を確認 →</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 戻入アラート */}
      {pendingClawbacks > 0 && (
        <Card className="border-destructive/20">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" /> 戻入処理待ち（クローバック）
              </CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link to="/clawback/pending">一覧を確認</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {MOCK_CLAWBACKS.filter(c => c.status === 'pending').map(cw => (
                <div key={cw.id} className="flex items-center justify-between text-sm bg-destructive/5 rounded-md px-3 py-2">
                  <div>
                    <span className="font-medium">{cw.insuredName} 様</span>
                    <span className="text-muted-foreground ml-2">({cw.policyNumber})</span>
                    <span className="text-muted-foreground ml-2">経過 {cw.elapsedMonths}ヶ月</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-destructive">- ¥{cw.deductionAmount.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">担当: {cw.staffName}</div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between font-bold text-destructive pt-1 border-t">
                <span>合計天引き予定額</span>
                <span className="font-mono">- ¥{clawbackTotal.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ANDO Engine ステータス */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-secondary" /> ANDO Engine ルール状況
            </CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to="/engine">ルール管理</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {MOCK_CALCULATION_RULES.map(r => (
              <div key={r.id} className={`border rounded-lg p-3 ${r.status === 'pending_approval' ? 'border-warning/40 bg-warning/5' : 'border-border'}`}>
                <div className="text-xs text-muted-foreground mb-1">{r.category === 'commission' ? '歩合給' : r.category === 'clawback' ? 'クローバック' : r.category === 'incentive' ? 'インセンティブ' : '税務'}</div>
                <div className="text-sm font-medium leading-tight">{r.name.length > 20 ? r.name.slice(0, 20) + '…' : r.name}</div>
                <div className="mt-2">
                  {r.status === 'approved'
                    ? <span className="text-xs text-success flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />承認済</span>
                    : <span className="text-xs text-warning flex items-center gap-1"><Clock className="w-3 h-3" />承認待ち</span>
                  }
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
