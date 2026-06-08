import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { UploadCloud, FileType2, Settings2, CheckCircle2 } from "lucide-react";

export function CommissionUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setSuccess(false);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary tracking-tight">CSVアップロード</h1>
        <p className="text-muted-foreground mt-1">保険会社から受領した手数料明細データを取り込みます</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>ファイル取り込み</CardTitle>
              <CardDescription>対象となる保険会社と年月を指定してアップロードしてください</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">保険会社</label>
                  <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">選択してください</option>
                    <option value="1">東京海上日動</option>
                    <option value="2">東京海上日動あんしん生命</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">対象年月</label>
                  <input type="month" defaultValue="2025-06" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                </div>
              </div>

              {!success ? (
                <div 
                  className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors
                    ${file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <>
                      <FileType2 className="w-12 h-12 text-primary mb-4" />
                      <p className="font-medium text-lg">{file.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                      <Button variant="outline" size="sm" className="mt-4" onClick={() => setFile(null)}>キャンセル</Button>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
                      <p className="font-medium">CSVファイルをここにドラッグ＆ドロップ</p>
                      <p className="text-sm text-muted-foreground mt-1">または</p>
                      <Button variant="outline" className="mt-4 pointer-events-none">ファイルを選択</Button>
                    </>
                  )}
                </div>
              ) : (
                <div className="bg-success/10 border border-success/20 rounded-xl p-8 flex flex-col items-center text-center">
                  <CheckCircle2 className="w-16 h-16 text-success mb-4" />
                  <h3 className="text-xl font-bold text-success">アップロード完了</h3>
                  <p className="text-sm text-success/80 mt-2">
                    156件のデータ（合計 ¥1,250,000）を正常に取り込みました。
                  </p>
                  <Button variant="outline" className="mt-6" onClick={() => { setFile(null); setSuccess(false); }}>
                    さらにアップロード
                  </Button>
                </div>
              )}
            </CardContent>
            {!success && (
              <CardFooter className="bg-muted/30 border-t flex justify-end p-4">
                <Button 
                  onClick={handleUpload} 
                  disabled={!file || uploading} 
                  className={uploading ? 'opacity-50' : ''}
                >
                  {uploading ? '処理中...' : 'アップロード実行'}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings2 className="w-5 h-5 mr-2" />
                マッピング設定
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                選択された保険会社には以下のCSVマッピングテンプレートが適用されます。
              </p>
              <div className="bg-muted p-3 rounded-md text-sm font-mono space-y-2 border">
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">証券番号</span>
                  <span>A列 (1列目)</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">契約者名</span>
                  <span>B列 (2列目)</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">商品コード</span>
                  <span>D列 (4列目)</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">手数料金額</span>
                  <span>G列 (7列目)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">担当者名</span>
                  <span>K列 (11列目)</span>
                </div>
              </div>
              <Button variant="link" className="w-full text-primary h-auto p-0 justify-start">
                マッピング設定を編集する →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
