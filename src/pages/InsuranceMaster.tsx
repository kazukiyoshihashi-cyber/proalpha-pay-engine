import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { MOCK_INSURANCE_COMPANIES, MOCK_PRODUCTS } from "../lib/mockData";
import { Plus, Building, Package } from "lucide-react";

export function InsuranceMaster() {
  const [activeTab, setActiveTab] = useState<'companies' | 'products'>('companies');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary tracking-tight">保険会社・商品マスタ</h1>
          <p className="text-muted-foreground mt-1">取扱保険会社とCSVフォーマット定義、商品ごとのデフォルト料率を管理します</p>
        </div>
        <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
          <Plus className="w-4 h-4 mr-2" /> 新規追加
        </Button>
      </div>

      <div className="flex space-x-1 border-b">
        <TabBtn label="保険会社" icon={<Building className="w-4 h-4" />} active={activeTab === 'companies'} onClick={() => setActiveTab('companies')} />
        <TabBtn label="商品" icon={<Package className="w-4 h-4" />} active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
      </div>

      {activeTab === 'companies' && (
        <div className="space-y-4">
          {MOCK_INSURANCE_COMPANIES.map(company => (
            <Card key={company.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{company.name}</CardTitle>
                    <CardDescription className="mt-1">{company.shortName}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">マッピング編集</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium text-muted-foreground mb-3">CSVカラムマッピング</div>
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm grid grid-cols-2 gap-x-8 gap-y-2">
                  {Object.entries(company.csvMapping).map(([col, idx]) => (
                    <div key={col} className="flex justify-between border-b border-border/50 pb-1">
                      <span className="text-muted-foreground">{col}</span>
                      <span className="font-semibold">{idx + 1}列目</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <Badge variant="outline" className="text-success border-success/30 bg-success/5">
                    取込済: {MOCK_PRODUCTS.filter(p => p.insuranceCompanyId === company.id).length} 商品
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'products' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>商品一覧</CardTitle>
                <CardDescription>デフォルト料率は個別ルールがない場合の基準値です。ANDO Engineのルールが優先されます。</CardDescription>
              </div>
              <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-2" />商品追加</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>保険会社</TableHead>
                  <TableHead>商品名</TableHead>
                  <TableHead>カテゴリ</TableHead>
                  <TableHead className="text-center">契約区分</TableHead>
                  <TableHead className="text-right">代理店受取料率</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_PRODUCTS.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="text-sm text-muted-foreground">{p.insuranceCompanyName}</TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell className="text-center">
                      {p.contractType === 'new'
                        ? <Badge className="bg-blue-100 text-blue-800 border-0">新契約</Badge>
                        : <Badge className="bg-green-100 text-green-800 border-0">継続</Badge>
                      }
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-primary">
                      {p.defaultRate}%
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">編集</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TabBtn({ label, icon, active, onClick }: { label: string; icon: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
        active ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
      }`}
      onClick={onClick}
    >
      {icon}{label}
    </button>
  );
}
