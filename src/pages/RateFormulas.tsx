import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Save, Plus, AlertCircle } from "lucide-react";

export function RateFormulas() {
  const [activeTab, setActiveTab] = useState("commission");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary tracking-tight">計算式エディター</h1>
          <p className="text-muted-foreground mt-1">各種歩合率や戻入率の設定を行います</p>
        </div>
        <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
          <Save className="w-4 h-4 mr-2" />
          変更を保存
        </Button>
      </div>

      <div className="flex space-x-1 border-b">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "commission" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("commission")}
        >
          歩合率テーブル (初年度)
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "clawback" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("clawback")}
        >
          戻入率テーブル
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "incentive" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("incentive")}
        >
          インセンティブ設定
        </button>
      </div>

      {activeTab === "commission" && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>初年度歩合率設定</CardTitle>
                <CardDescription>保険会社・商品ごとのスタッフへの還元率(%)を設定します</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" /> 行を追加
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>保険会社</TableHead>
                  <TableHead>商品種別</TableHead>
                  <TableHead>手数料ランク</TableHead>
                  <TableHead className="text-right">スタッフ還元率 (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <select className="border-0 bg-transparent outline-none w-full cursor-pointer text-sm">
                      <option>東京海上日動</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    <select className="border-0 bg-transparent outline-none w-full cursor-pointer text-sm">
                      <option>自動車保険</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    <select className="border-0 bg-transparent outline-none w-full cursor-pointer text-sm">
                      <option>A</option>
                    </select>
                  </TableCell>
                  <TableCell className="text-right">
                    <input type="number" defaultValue="15" className="w-16 text-right border rounded px-2 py-1 text-sm bg-muted/30 focus:bg-background" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>東京海上日動</TableCell>
                  <TableCell>火災保険</TableCell>
                  <TableCell>A</TableCell>
                  <TableCell className="text-right">
                    <input type="number" defaultValue="20" className="w-16 text-right border rounded px-2 py-1 text-sm bg-muted/30 focus:bg-background" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>東京海上日動あんしん生命</TableCell>
                  <TableCell>医療保険</TableCell>
                  <TableCell>S</TableCell>
                  <TableCell className="text-right">
                    <input type="number" defaultValue="35" className="w-16 text-right border rounded px-2 py-1 text-sm bg-muted/30 focus:bg-background" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="mt-4 p-4 bg-muted/50 rounded-md text-sm text-muted-foreground flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 text-primary shrink-0" />
              <p>変更は次回の給与計算（未確定分）から適用されます。確定済みの過去の計算結果には影響しません。</p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "clawback" && (
        <Card>
          <CardHeader>
            <CardTitle>戻入率テーブル</CardTitle>
            <CardDescription>契約からの経過月数に応じた天引き率(%)を設定します</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>経過月数 (〜から)</TableHead>
                  <TableHead>経過月数 (〜まで)</TableHead>
                  <TableHead className="text-right">戻入率 (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <input type="number" defaultValue="0" className="w-16 border rounded px-2 py-1 text-sm" /> ヶ月
                  </TableCell>
                  <TableCell>
                    <input type="number" defaultValue="3" className="w-16 border rounded px-2 py-1 text-sm" /> ヶ月
                  </TableCell>
                  <TableCell className="text-right">
                    <input type="number" defaultValue="100" className="w-16 text-right border rounded px-2 py-1 text-sm bg-muted/30" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <input type="number" defaultValue="4" className="w-16 border rounded px-2 py-1 text-sm" /> ヶ月
                  </TableCell>
                  <TableCell>
                    <input type="number" defaultValue="6" className="w-16 border rounded px-2 py-1 text-sm" /> ヶ月
                  </TableCell>
                  <TableCell className="text-right">
                    <input type="number" defaultValue="80" className="w-16 text-right border rounded px-2 py-1 text-sm bg-muted/30" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <input type="number" defaultValue="7" className="w-16 border rounded px-2 py-1 text-sm" /> ヶ月
                  </TableCell>
                  <TableCell>
                    <input type="number" defaultValue="12" className="w-16 border rounded px-2 py-1 text-sm" /> ヶ月
                  </TableCell>
                  <TableCell className="text-right">
                    <input type="number" defaultValue="50" className="w-16 text-right border rounded px-2 py-1 text-sm bg-muted/30" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === "incentive" && (
        <Card>
          <CardHeader>
            <CardTitle>インセンティブ設定 (ボーナス係数)</CardTitle>
            <CardDescription>目標達成率に応じた歩合給の割増・割引係数を設定します</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>達成率 (下限)</TableHead>
                  <TableHead>達成率 (上限)</TableHead>
                  <TableHead className="text-right">ボーナス係数</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>100%</TableCell>
                  <TableCell>〜 (上限なし)</TableCell>
                  <TableCell className="text-right">
                    <input type="number" step="0.1" defaultValue="1.20" className="w-20 text-right border rounded px-2 py-1 text-sm font-mono text-success bg-muted/30" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>80%</TableCell>
                  <TableCell>99%</TableCell>
                  <TableCell className="text-right">
                    <input type="number" step="0.1" defaultValue="1.00" className="w-20 text-right border rounded px-2 py-1 text-sm font-mono bg-muted/30" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>60%</TableCell>
                  <TableCell>79%</TableCell>
                  <TableCell className="text-right">
                    <input type="number" step="0.1" defaultValue="0.90" className="w-20 text-right border rounded px-2 py-1 text-sm font-mono text-destructive bg-muted/30" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
