import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { MOCK_CLAWBACKS } from "../lib/mockData";
import type { ClawbackItem } from "../types";

export function ClawbackPending() {
  const [clawbacks, setClawbacks] = useState<ClawbackItem[]>(MOCK_CLAWBACKS);

  const handleApprove = (id: string) => {
    setClawbacks(clawbacks.map(c =>
      c.id === id ? { ...c, status: 'approved' as const } : c
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary tracking-tight">戻入処理待ち一覧</h1>
          <p className="text-muted-foreground mt-1">保険契約の解約等による手数料の戻入（天引き）を確認・承認します</p>
        </div>
      </div>

      {clawbacks.some(c => c.status === 'pending') && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div>
            <h4 className="text-warning font-medium">未処理の戻入データがあります</h4>
            <p className="text-sm text-warning/80 mt-1">
              未処理の案件は、次回の給与計算（天引き）に反映されません。内容を確認し「承認」を行ってください。
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>戻入データ一覧</CardTitle>
          <CardDescription>
            経過月数に応じて自動計算された天引き予定額です（ANDO Engine: クローバックルール CR003 適用）。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>証券番号 / 被保険者</TableHead>
                <TableHead>契約・解約日</TableHead>
                <TableHead className="text-center">経過月数</TableHead>
                <TableHead className="text-right">元歩合給</TableHead>
                <TableHead className="text-center">戻入率</TableHead>
                <TableHead className="text-right font-bold">天引き予定額</TableHead>
                <TableHead>担当スタッフ</TableHead>
                <TableHead className="text-center">ステータス</TableHead>
                <TableHead className="text-center">アクション</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clawbacks.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium text-primary">{item.policyNumber}</div>
                    <div className="text-xs text-muted-foreground">{item.insuredName} 様</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">契: {item.contractDate}</div>
                    <div className="text-sm text-destructive">解: {item.cancelDate}</div>
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    {item.elapsedMonths} ヶ月
                  </TableCell>
                  <TableCell className="text-right">
                    ¥{item.originalCommission.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-mono">
                      {item.clawbackRate * 100}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-destructive">
                    - ¥{item.deductionAmount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {item.staffName}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.status === 'pending' ? (
                      <Badge className="bg-warning/10 text-warning border-warning/20">未処理</Badge>
                    ) : (
                      <Badge className="bg-success/10 text-success border-success/20">承認済</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.status === 'pending' ? (
                      <Button size="sm" onClick={() => handleApprove(item.id)}>
                        確認・承認
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-success" /> 承認済
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
