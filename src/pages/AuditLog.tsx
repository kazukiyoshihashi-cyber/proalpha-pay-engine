import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { MOCK_AUDIT_LOGS } from "../lib/mockData";
import { Shield, FileSearch } from "lucide-react";

const ACTION_COLORS: Record<string, string> = {
  作成: 'bg-blue-100 text-blue-800',
  更新: 'bg-yellow-100 text-yellow-800',
  承認: 'bg-green-100 text-green-800',
  計算実行: 'bg-purple-100 text-purple-800',
  削除: 'bg-red-100 text-red-800',
};

export function AuditLog() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary tracking-tight flex items-center gap-2">
          <Shield className="w-7 h-7 text-secondary" /> 監査ログ
        </h1>
        <p className="text-muted-foreground mt-1">誰が・いつ・何を操作したかを記録します（保存期間: 7年）</p>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
        <FileSearch className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm">
          <span className="font-semibold text-primary">法令対応：</span>
          <span>電子帳簿保存法・税務上の保存義務（7年）に対応。全ての操作は操作者・日時・変更前後の値とともに記録され、変更できません。</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>操作履歴</CardTitle>
            <div className="flex gap-2">
              <input type="month" defaultValue="2025-06" className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm" />
              <select className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm">
                <option>全操作</option>
                <option>ルール変更</option>
                <option>承認</option>
                <option>計算実行</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>日時</TableHead>
                <TableHead>操作者</TableHead>
                <TableHead>対象</TableHead>
                <TableHead className="text-center">操作</TableHead>
                <TableHead>変更内容 / コメント</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_AUDIT_LOGS.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs whitespace-nowrap">
                    {log.operatedAt.replace('T', ' ').slice(0, 16)}
                  </TableCell>
                  <TableCell className="font-medium">{log.operator}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{log.target}</TableCell>
                  <TableCell className="text-center">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ACTION_COLORS[log.action] ?? 'bg-gray-100 text-gray-800'}`}>
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {(log.before || log.after) && (
                      <div className="space-y-1 text-xs font-mono">
                        {log.before && <div className="text-destructive">変更前: {log.before}</div>}
                        {log.after && <div className="text-success">変更後: {log.after}</div>}
                      </div>
                    )}
                    {log.comment && (
                      <div className="text-muted-foreground text-xs mt-1 italic">「{log.comment}」</div>
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
