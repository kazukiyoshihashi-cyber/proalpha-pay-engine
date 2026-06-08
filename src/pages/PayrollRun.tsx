import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { CheckCircle2, ChevronRight, Calculator, FileText, Download, Banknote } from "lucide-react";
import { runPayrollSimulation, type CalculationResult } from "../lib/payrollEngine";

const STEPS = [
  "対象月・スタッフ選択",
  "データ確認",
  "計算実行",
  "結果プレビュー",
  "承認・確定",
  "出力"
];

export function PayrollRun() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<CalculationResult | null>(null);

  const handleNext = () => {
    if (currentStep === 1) { // データ確認 -> 計算実行
      setIsCalculating(true);
      setTimeout(() => {
        setResults(runPayrollSimulation());
        setIsCalculating(false);
        setCurrentStep(3); // 結果プレビューへ
      }, 1500);
      setCurrentStep(2);
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary tracking-tight">給与計算実行</h1>
        <p className="text-muted-foreground mt-1">ウィザードに従って対象月の給与計算を行います</p>
      </div>

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step} className="flex flex-col items-center relative w-full">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 
                  ${index < currentStep ? 'bg-success text-white' : index === currentStep ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
              >
                {index < currentStep ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
              </div>
              <div className={`text-xs mt-2 font-medium ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step}
              </div>
              {index < STEPS.length - 1 && (
                <div className={`absolute top-4 left-[50%] w-full h-[2px] -z-10
                  ${index < currentStep ? 'bg-success' : 'bg-muted'}`} 
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep]}</CardTitle>
          <CardDescription>
            {currentStep === 0 && "計算対象の月とスタッフを選択してください。"}
            {currentStep === 1 && "取り込み済みの手数料CSVデータに漏れがないか確認してください。"}
            {currentStep === 2 && "給与計算エンジンが計算を実行中です。"}
            {currentStep === 3 && "計算結果のプレビューです。各スタッフの詳細を確認できます。"}
            {currentStep === 4 && "結果を確認し、確定処理を行ってください。"}
            {currentStep === 5 && "各種帳票や振込データを出力します。"}
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {/* Step 0: 対象選択 */}
          {currentStep === 0 && (
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-medium">対象年月</label>
                <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>2025年6月</option>
                  <option>2025年5月</option>
                </select>
              </div>
              <div className="space-y-2 mt-4">
                <label className="text-sm font-medium">対象スタッフ</label>
                <div className="p-4 border rounded-md bg-muted/50">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary" />
                    <span>全スタッフ（4名）</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: データ確認 */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <Badge variant="success" className="mb-4">すべてのCSVデータが揃っています</Badge>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>保険会社</TableHead>
                    <TableHead>取込状況</TableHead>
                    <TableHead className="text-right">件数</TableHead>
                    <TableHead className="text-right">手数料合計</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>東京海上日動</TableCell>
                    <TableCell><Badge variant="success">取込済</Badge></TableCell>
                    <TableCell className="text-right">156件</TableCell>
                    <TableCell className="text-right">¥1,250,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>東京海上日動あんしん生命</TableCell>
                    <TableCell><Badge variant="success">取込済</Badge></TableCell>
                    <TableCell className="text-right">42件</TableCell>
                    <TableCell className="text-right">¥850,000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {/* Step 2: 計算中 */}
          {currentStep === 2 && (
            <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
              {isCalculating ? (
                <>
                  <Calculator className="w-12 h-12 text-primary animate-pulse" />
                  <p className="text-lg font-medium">計算エンジンを実行中...</p>
                  <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="w-full h-full bg-primary animate-[pulse_1s_ease-in-out_infinite]" />
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-12 h-12 text-success" />
                  <p className="text-lg font-medium">計算が完了しました</p>
                </>
              )}
            </div>
          )}

          {/* Step 3: 結果プレビュー */}
          {currentStep === 3 && (
            <div className="flex gap-6 h-[400px]">
              <div className="w-1/2 border rounded-md overflow-hidden flex flex-col">
                <div className="bg-muted p-2 font-medium text-sm text-center border-b">スタッフ一覧</div>
                <div className="overflow-y-auto flex-1">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>氏名</TableHead>
                        <TableHead className="text-right">総支給額</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((r) => (
                        <TableRow 
                          key={r.staffId} 
                          className={`cursor-pointer ${selectedStaff?.staffId === r.staffId ? 'bg-primary/5' : ''}`}
                          onClick={() => setSelectedStaff(r)}
                        >
                          <TableCell className="font-medium text-primary">{r.staffName}</TableCell>
                          <TableCell className="text-right font-mono">¥{r.grossAmount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="w-1/2 border rounded-md bg-card flex flex-col">
                {selectedStaff ? (
                  <>
                    <div className="bg-primary/5 p-3 font-medium text-sm border-b flex justify-between items-center">
                      <span>{selectedStaff.staffName} 様 給与明細</span>
                      <Badge>計算完了</Badge>
                    </div>
                    <div className="p-4 space-y-4 overflow-y-auto font-mono text-sm">
                      <div className="flex justify-between border-b pb-1">
                        <span>固定支給計</span>
                        <span>¥{selectedStaff.baseTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span>初年度歩合給</span>
                        <span className="text-success">+ ¥{selectedStaff.commissionFirstYear.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span>継続歩合給</span>
                        <span className="text-success">+ ¥{selectedStaff.commissionRenewal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span>インセンティブ</span>
                        <span className="text-success">+ ¥{selectedStaff.incentive.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span>戻入天引き</span>
                        <span className="text-destructive">- ¥{selectedStaff.clawback.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold pt-2 text-base">
                        <span>総支給額 (税引前)</span>
                        <span>¥{selectedStaff.grossAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 text-muted-foreground">
                        <span>控除合計</span>
                        <span>- ¥{selectedStaff.deductions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t-2 border-primary pt-2 text-primary">
                        <span>差引支給額 (手取り)</span>
                        <span>¥{selectedStaff.netAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    左のリストからスタッフを選択してください
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: 承認・確定 */}
          {currentStep === 4 && (
            <div className="space-y-6 text-center max-w-lg mx-auto py-8">
              <CheckCircle2 className="w-16 h-16 text-success mx-auto" />
              <h3 className="text-xl font-bold">計算内容の最終確認</h3>
              <p className="text-muted-foreground">
                計算結果に問題がなければ、給与データの確定を行ってください。
                確定後は計算結果の変更ができなくなります。
              </p>
              <div className="bg-warning/10 border border-warning/20 p-4 rounded-md text-warning text-sm text-left">
                <strong>注意:</strong> 確定処理を実行すると、各スタッフのマイページに給与明細が公開される準備が整います。
              </div>
            </div>
          )}

          {/* Step 5: 出力 */}
          {currentStep === 5 && (
            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto py-8">
              <Card className="border-primary/20 hover:border-primary transition-colors cursor-pointer group">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <div className="font-bold">給与明細PDF出力</div>
                  <p className="text-xs text-muted-foreground">全スタッフ分のPDFを一括ダウンロードします</p>
                  <Button variant="outline" size="sm" className="w-full"><Download className="w-4 h-4 mr-2" /> ダウンロード</Button>
                </CardContent>
              </Card>
              <Card className="border-primary/20 hover:border-primary transition-colors cursor-pointer group">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Banknote className="w-8 h-8 text-primary" />
                  </div>
                  <div className="font-bold">振込データ (全銀) 出力</div>
                  <p className="text-xs text-muted-foreground">銀行振込用の全銀協フォーマットデータです</p>
                  <Button variant="outline" size="sm" className="w-full"><Download className="w-4 h-4 mr-2" /> ダウンロード</Button>
                </CardContent>
              </Card>
            </div>
          )}

        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button variant="outline" onClick={handlePrev} disabled={currentStep === 0 || currentStep === 2}>
            戻る
          </Button>
          {currentStep < STEPS.length - 1 ? (
            <Button onClick={handleNext} disabled={currentStep === 2} className="min-w-[120px]">
              {currentStep === 1 ? "計算実行" : "次へ"} <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button className="min-w-[120px]" onClick={() => window.location.href = '/dashboard'}>
              ダッシュボードへ戻る
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
