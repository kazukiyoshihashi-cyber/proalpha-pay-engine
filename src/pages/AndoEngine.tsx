import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { MOCK_CALCULATION_RULES, MOCK_LOOKUP_TABLES } from "../lib/mockData";
import type { CalculationRule, LookupTable } from "../types";
import {
  Plus, Zap, Table2, AlertCircle, CheckCircle2, Clock,
  ChevronDown, ChevronRight, History, Shield, Sparkles,
} from "lucide-react";

const CATEGORY_LABELS: Record<CalculationRule['category'], string> = {
  commission: '歩合給計算',
  clawback: 'クローバック',
  incentive: 'インセンティブ',
  tax: '税務・控除',
  deduction: 'その他控除',
};
const CATEGORY_COLORS: Record<CalculationRule['category'], string> = {
  commission: 'bg-blue-100 text-blue-800',
  clawback: 'bg-red-100 text-red-800',
  incentive: 'bg-green-100 text-green-800',
  tax: 'bg-purple-100 text-purple-800',
  deduction: 'bg-gray-100 text-gray-800',
};
const STATUS_BADGE: Record<CalculationRule['status'], React.ReactNode> = {
  approved: <Badge className="bg-success/10 text-success border-success/20 gap-1"><CheckCircle2 className="w-3 h-3" />承認済</Badge>,
  pending_approval: <Badge className="bg-warning/10 text-warning border-warning/20 gap-1"><Clock className="w-3 h-3" />承認待ち</Badge>,
  draft: <Badge variant="outline" className="text-muted-foreground gap-1"><Clock className="w-3 h-3" />下書き</Badge>,
  archived: <Badge variant="outline" className="text-muted-foreground">アーカイブ</Badge>,
};

const OPERATOR_LABELS: Record<string, string> = {
  eq: '=', neq: '≠', gt: '>', gte: '≥', lt: '<', lte: '≤', in: 'いずれか', contains: '含む',
};

type Tab = 'rules' | 'tables' | 'ai_helper';

export function AndoEngine() {
  const [activeTab, setActiveTab] = useState<Tab>('rules');
  const [expandedRule, setExpandedRule] = useState<string | null>('CR001');
  const [filterCategory, setFilterCategory] = useState('all');
  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState<string | null>(null);

  const rules = MOCK_CALCULATION_RULES.filter(r =>
    filterCategory === 'all' || r.category === filterCategory
  );

  const handleAiGenerate = () => {
    if (!aiInput.trim()) return;
    setAiResult(`【提案されたルール骨子】

ルール名: 「${aiInput}」に基づく自動提案

条件:
  • staff.employmentType IN ['commission', 'hybrid']
  • product.contractType = 'new'
  • clawback.elapsedMonths < 13

アクション（計算式）:
  ORIGINAL_COMMISSION × LOOKUP("clawback_rates", ELAPSED_MONTHS) / 100 × -1

説明:
入力された条件をもとに、クローバックルールの骨子を生成しました。
数値・参照テーブルは安東さんの実際の設定値をもとに調整が必要です。

⚠️ このルールは「下書き」として保存され、安東さんの確認・承認後に有効化されます。`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary tracking-tight flex items-center gap-2">
            <Zap className="w-7 h-7 text-secondary" /> ANDO Engine
          </h1>
          <p className="text-muted-foreground mt-1">手数料・歩合給の計算ロジックをコードなしで設定・管理します</p>
        </div>
        <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
          <Plus className="w-4 h-4 mr-2" /> 新しいルール
        </Button>
      </div>

      {/* アーキテクチャ説明 */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm">
          <span className="font-semibold text-primary">設計思想：</span>
          <span className="text-foreground">ルールは「条件分岐ルーティング層」と「数式計算層」に分離して管理します。確定済みの給与計算期間はロック済みのため、ルール変更は次回計算から適用されます。</span>
        </div>
      </div>

      {/* タブ */}
      <div className="flex space-x-1 border-b">
        <TabBtn label="計算ルール" icon={<Zap className="w-4 h-4" />} active={activeTab === 'rules'} onClick={() => setActiveTab('rules')} count={MOCK_CALCULATION_RULES.length} />
        <TabBtn label="参照テーブル" icon={<Table2 className="w-4 h-4" />} active={activeTab === 'tables'} onClick={() => setActiveTab('tables')} count={MOCK_LOOKUP_TABLES.length} />
        <TabBtn label="AI ヒアリング支援" icon={<Sparkles className="w-4 h-4" />} active={activeTab === 'ai_helper'} onClick={() => setActiveTab('ai_helper')} />
      </div>

      {/* ====== 計算ルール ====== */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="flex gap-3 items-center">
            <select
              className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
            >
              <option value="all">全カテゴリ</option>
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <span className="text-sm text-muted-foreground">{rules.length}件表示</span>
          </div>

          <div className="space-y-3">
            {rules.map((rule) => (
              <RuleCard
                key={rule.id}
                rule={rule}
                expanded={expandedRule === rule.id}
                onToggle={() => setExpandedRule(expandedRule === rule.id ? null : rule.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ====== 参照テーブル ====== */}
      {activeTab === 'tables' && (
        <div className="space-y-4">
          {MOCK_LOOKUP_TABLES.map(table => (
            <LookupTableCard key={table.id} table={table} />
          ))}
        </div>
      )}

      {/* ====== AI ヒアリング支援 ====== */}
      {activeTab === 'ai_helper' && (
        <div className="space-y-6 max-w-3xl">
          <Card className="border-secondary/30 bg-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-secondary" /> AI ヒアリングモード
              </CardTitle>
              <CardDescription>
                安東さんが日本語でルールを説明すると、AIがルール骨子の候補を提案します。
                提案された骨子は「下書き」として保存され、安東さんが確認・修正して確定します。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">ルール内容を自然な日本語で説明してください</label>
                <textarea
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px] resize-none"
                  placeholder="例：「医療保険の新契約で、契約から13ヶ月以内に解約された場合は、担当者に支払った初年度手数料の80%を天引きする。ただし6ヶ月を超えている場合は50%にする。」"
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                />
              </div>
              <Button
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                onClick={handleAiGenerate}
                disabled={!aiInput.trim()}
              >
                <Sparkles className="w-4 h-4 mr-2" /> ルール骨子を生成
              </Button>
            </CardContent>
          </Card>

          {aiResult && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" /> AI提案結果
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap font-mono leading-relaxed">
                  {aiResult}
                </pre>
                <div className="flex gap-3 mt-4">
                  <Button size="sm">下書きとして保存</Button>
                  <Button size="sm" variant="outline">修正する</Button>
                  <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => setAiResult(null)}>破棄</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-muted/30">
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>AI提案はあくまで骨子の候補です。実際の数値・条件は安東さんが確認・修正し、承認フローを経て有効化されます。</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function RuleCard({ rule, expanded, onToggle }: { rule: CalculationRule; expanded: boolean; onToggle: () => void }) {
  return (
    <Card className={`transition-all ${rule.status === 'pending_approval' ? 'border-warning/40' : ''}`}>
      <div className="p-4 cursor-pointer select-none" onClick={onToggle}>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground shrink-0">優先度 {rule.priority}</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${CATEGORY_COLORS[rule.category]}`}>
            {CATEGORY_LABELS[rule.category]}
          </span>
          <span className="font-semibold text-sm flex-1">{rule.name}</span>
          {STATUS_BADGE[rule.status]}
          {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
        </div>
        <p className="text-xs text-muted-foreground mt-2 ml-0">{rule.description}</p>
      </div>

      {expanded && (
        <div className="border-t px-4 pb-4 pt-3 space-y-4">
          {/* 条件分岐 */}
          {rule.conditions.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">適用条件（条件分岐ルーティング層）</div>
              <div className="space-y-2">
                {rule.conditions.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm bg-blue-50 border border-blue-200 rounded-md px-3 py-2">
                    <span className="text-xs bg-blue-200 text-blue-800 rounded px-1 font-mono">{i === 0 ? 'IF' : 'AND'}</span>
                    <code className="text-blue-800 font-mono">{c.field}</code>
                    <span className="text-blue-600 font-bold">{OPERATOR_LABELS[c.operator]}</span>
                    <code className="text-blue-800 font-mono">{Array.isArray(c.value) ? `[${c.value.join(', ')}]` : String(c.value)}</code>
                  </div>
                ))}
              </div>
            </div>
          )}
          {rule.conditions.length === 0 && (
            <div className="text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">条件なし（全スタッフに適用）</div>
          )}

          {/* 計算式 */}
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">計算式（数式計算層）</div>
            <div className="bg-gray-900 text-green-400 rounded-md px-4 py-3 font-mono text-sm">
              {rule.action.expression}
            </div>
          </div>

          {/* 有効期間 */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-muted-foreground mb-1">有効開始日</div>
              <div className="font-mono">{rule.effectiveFrom}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">有効終了日</div>
              <div className="font-mono">{rule.effectiveTo ?? '無期限'}</div>
            </div>
          </div>

          {/* 変更履歴 */}
          {rule.approvedBy && (
            <div className="text-xs text-muted-foreground flex items-center gap-2 bg-muted/50 rounded-md px-3 py-2">
              <History className="w-3 h-3" />
              <span>作成: {rule.createdBy} ／ 承認: {rule.approvedBy}（{rule.approvedAt?.slice(0, 10)}）</span>
              {rule.changeReason && <span className="ml-2 text-foreground">「{rule.changeReason}」</span>}
            </div>
          )}
          {rule.status === 'pending_approval' && (
            <div className="flex gap-2 pt-1">
              <Button size="sm" className="bg-success text-white hover:bg-success/80">承認する</Button>
              <Button size="sm" variant="outline">差し戻し</Button>
              <Button size="sm" variant="ghost" className="ml-auto text-muted-foreground">編集</Button>
            </div>
          )}
          {rule.status === 'approved' && (
            <div className="flex gap-2 pt-1 justify-end">
              <Button size="sm" variant="outline">バージョン履歴</Button>
              <Button size="sm" variant="outline">編集（改訂）</Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function LookupTableCard({ table }: { table: LookupTable }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Table2 className="w-4 h-4 text-muted-foreground" />
              {table.name}
            </CardTitle>
            <CardDescription className="mt-1">{table.description}</CardDescription>
          </div>
          <Button variant="outline" size="sm">編集</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground mb-2 font-mono">
          次元: [{table.dimensions.join(', ')}]
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {table.dimensions.map(d => <TableHead key={d}>{d}</TableHead>)}
              <TableHead className="text-right">値</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.rows.map((row, i) => (
              <TableRow key={i}>
                {row.keys.map((k, j) => <TableCell key={j} className="font-mono">{k}</TableCell>)}
                <TableCell className="text-right font-mono font-bold text-primary">{row.value}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function TabBtn({ label, icon, active, onClick, count }: { label: string; icon: React.ReactNode; active: boolean; onClick: () => void; count?: number }) {
  return (
    <button
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
        active ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
      }`}
      onClick={onClick}
    >
      {icon}{label}
      {count !== undefined && (
        <span className="bg-muted text-muted-foreground text-xs rounded-full px-1.5">{count}</span>
      )}
    </button>
  );
}
