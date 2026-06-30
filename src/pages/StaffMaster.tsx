import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { MOCK_STAFF } from "../lib/mockData";
import type { Staff, EmploymentType } from "../types";
import { UserPlus, Pencil, X, Building2, Briefcase } from "lucide-react";

const EMPLOYMENT_LABELS: Record<EmploymentType, string> = {
  employed: '雇用型',
  commission: '業務委託型',
  hybrid: 'ハイブリッド型',
};
const EMPLOYMENT_VARIANTS: Record<EmploymentType, string> = {
  employed: 'bg-blue-100 text-blue-800',
  commission: 'bg-purple-100 text-purple-800',
  hybrid: 'bg-orange-100 text-orange-800',
};

export function StaffMaster() {
  const [staff] = useState<Staff[]>(MOCK_STAFF);
  const [selected, setSelected] = useState<Staff | null>(null);
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filtered = staff.filter(s => {
    if (filterBranch !== 'all' && s.branchId !== filterBranch) return false;
    if (filterType !== 'all' && s.employmentType !== filterType) return false;
    return true;
  });

  const branches = [...new Set(staff.map(s => s.branchId))].map(id => ({
    id, name: staff.find(s => s.branchId === id)!.branchName,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary tracking-tight">スタッフマスタ</h1>
          <p className="text-muted-foreground mt-1">従業員・募集人の基本情報と雇用形態を管理します</p>
        </div>
        <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
          <UserPlus className="w-4 h-4 mr-2" /> スタッフ追加
        </Button>
      </div>

      {/* 雇用形態の説明 */}
      <div className="grid grid-cols-3 gap-4">
        {(Object.entries(EMPLOYMENT_LABELS) as [EmploymentType, string][]).map(([type, label]) => (
          <div key={type} className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${EMPLOYMENT_VARIANTS[type]}`}>{label}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {type === 'employed' && '固定給＋歩合給。給与所得として源泉徴収税額表を適用。社会保険加入。'}
              {type === 'commission' && '歩合給のみ。外交員報酬（所得税法204条）を適用。社会保険加入なし。'}
              {type === 'hybrid' && '固定給＝給与所得、歩合給＝外交員報酬として按分計算。'}
            </p>
            <div className="mt-2 font-bold text-lg text-primary">
              {staff.filter(s => s.employmentType === type).length} 名
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="space-y-1 flex-1">
          <label className="text-sm font-medium">拠点で絞り込み</label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
            value={filterBranch}
            onChange={e => setFilterBranch(e.target.value)}
          >
            <option value="all">全拠点</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div className="space-y-1 flex-1">
          <label className="text-sm font-medium">雇用形態で絞り込み</label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
          >
            <option value="all">全形態</option>
            {(Object.entries(EMPLOYMENT_LABELS) as [EmploymentType, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        {/* 一覧テーブル */}
        <Card className="flex-1">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>コード</TableHead>
                  <TableHead>氏名</TableHead>
                  <TableHead>拠点</TableHead>
                  <TableHead>役職</TableHead>
                  <TableHead>雇用形態</TableHead>
                  <TableHead className="text-right">基本給</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(s => (
                  <TableRow
                    key={s.id}
                    className={`cursor-pointer ${selected?.id === s.id ? 'bg-primary/5' : ''}`}
                    onClick={() => setSelected(s)}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">{s.staffCode}</TableCell>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm">
                        <Building2 className="w-3 h-3 text-muted-foreground" /> {s.branchName}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm">
                        <Briefcase className="w-3 h-3 text-muted-foreground" /> {s.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${EMPLOYMENT_VARIANTS[s.employmentType]}`}>
                        {EMPLOYMENT_LABELS[s.employmentType]}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {s.baseSalary > 0 ? `¥${s.baseSalary.toLocaleString()}` : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); setSelected(s); }}>
                        <Pencil className="w-3 h-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 詳細パネル */}
        {selected && (
          <Card className="w-80 shrink-0">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">{selected.name}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelected(null)}><X className="w-4 h-4" /></Button>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="スタッフコード" value={selected.staffCode} mono />
              <Row label="拠点" value={selected.branchName} />
              <Row label="役職" value={selected.role} />
              <Row label="入社日" value={selected.joinDate} />
              <Row label="雇用形態" value={
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${EMPLOYMENT_VARIANTS[selected.employmentType]}`}>
                  {EMPLOYMENT_LABELS[selected.employmentType]}
                </span>
              } />
              <hr />
              <div className="font-medium text-xs text-muted-foreground uppercase tracking-wider">給与設定</div>
              {selected.baseSalary > 0 && <Row label="基本給" value={`¥${selected.baseSalary.toLocaleString()}`} mono />}
              {selected.positionAllowance > 0 && <Row label="役職手当" value={`¥${selected.positionAllowance.toLocaleString()}`} mono />}
              {selected.commuteAllowance > 0 && <Row label="通勤手当" value={`¥${selected.commuteAllowance.toLocaleString()}`} mono />}
              <Row label="扶養人数" value={`${selected.dependents}人`} />
              <Row label="源泉区分" value={selected.taxCategory === 'A' ? '甲欄' : '乙欄'} />
              {selected.invoiceNumber && (
                <>
                  <hr />
                  <div className="font-medium text-xs text-muted-foreground uppercase tracking-wider">インボイス</div>
                  <Row label="登録番号" value={selected.invoiceNumber} mono />
                </>
              )}
              <hr />
              <Row label="銀行口座" value={selected.bankAccount} />
              <div className="pt-2">
                <Button className="w-full" size="sm">編集する</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex justify-between items-center gap-2">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={`text-right font-medium ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  );
}
