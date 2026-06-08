import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { MOCK_PAYROLL_SUMMARY, MOCK_CHART_DATA, MOCK_STAFF_PAYOUTS } from "../lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, Clock, Users, Banknote } from "lucide-react";

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary tracking-tight">ダッシュボード</h1>
        <p className="text-muted-foreground mt-1">2025年6月度の給与計算サマリー</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">計算ステータス</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_PAYROLL_SUMMARY.status}</div>
            <p className="text-xs text-muted-foreground mt-1">
              給与実行から開始してください
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総支給予定額</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{MOCK_PAYROLL_SUMMARY.totalExpectedPayout.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              前月比 +5%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">対象スタッフ</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_PAYROLL_SUMMARY.staffCount} 名</div>
            <p className="text-xs text-muted-foreground mt-1">
              全スタッフデータ登録済
            </p>
          </CardContent>
        </Card>

        <Card className="border-warning/50 bg-warning/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-warning">戻入アラート</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{MOCK_PAYROLL_SUMMARY.pendingClawbacks} 件</div>
            <p className="text-xs text-warning/80 mt-1">
              天引き予定: ¥{MOCK_PAYROLL_SUMMARY.clawbackAlertAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>直近の支給額推移</CardTitle>
            <CardDescription>
              過去3ヶ月と今月の支給予定額の比較
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} dy={10} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#6b7280'}} 
                    tickFormatter={(value) => `¥${(value / 10000).toLocaleString()}万`}
                  />
                  <Tooltip 
                    cursor={{fill: '#f3f4f6'}}
                    formatter={(value: any) => [`¥${Number(value).toLocaleString()}`, '支給額']}
                  />
                  <Bar dataKey="支給額" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>今月の支給予定（スタッフ別）</CardTitle>
            <CardDescription>
              ※最終計算前の概算値を含みます
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>スタッフ</TableHead>
                  <TableHead className="text-right">予定額</TableHead>
                  <TableHead className="text-center">状態</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_STAFF_PAYOUTS.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">{staff.name}</TableCell>
                    <TableCell className="text-right font-mono">¥{staff.expected.toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-muted-foreground">
                        {staff.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
