# AlphaPay（保険代理店向け手数料・給与計算システム）

## 概要

詳細要件は [docs/requirements.md](docs/requirements.md) を参照。本ファイルでは要点のみ記載する。

## 最重要コンセプト

**ANDO Engine**（計算式・ルールエンジン）が本システムの心臓部。  
属人化した手数料計算ロジックを、コードを書かずに設定・検証できることが最優先。  
プロアルファ様（導入第一号）を皮切りに、他の保険代理店へのマルチテナントSaaS展開を前提として設計する。

## 技術スタック

- Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- DB: PostgreSQL + Prisma（プロトタイプ: Neon/Supabase、本番: Amazon RDS Multi-AZ）
- 認証: Auth.js → AWS Cognito（段階移行）
- ホスティング: Phase1=Vercel、Phase3=AWS（ECS Fargate + VPC + KMS）

## 開発ルール

- 計算ロジックは「条件分岐ルーティング層」と「数式計算層」を必ず分離する（[docs/requirements.md 10.2節](docs/requirements.md)）
- 給与計算ロジックを変更する際は、必ず docs/requirements.md 付録Aのテストケースで検証する
- 確定済み給与計算期間（PayrollRun）のデータは変更不可（ロック）とする

## ⚠️ IMPORTANT: マルチテナント必須ルール

**新しいテーブル・モデルを追加する際は、`Tenant` を除く全てに `tenant_id` を必ず含めること。**  
複数代理店への展開が確定方針のため、これを忘れると後で大規模な手戻りが発生する。  
PostgreSQLのRow Level Security（RLS）の活用も検討すること（[docs/requirements.md 第7.10章・第9章](docs/requirements.md)）。

## フェーズ概要

| Phase | 期間目安 | 内容 |
|---|---|---|
| 0 | 〜7月 | 安東さんヒアリング・計算ロジック形式知化 |
| 1 | 7〜8月 | Vercelプロトタイプ（ANDO Engine + モックデータ） |
| 2 | 8〜9月 | 実データ突合・検証（誤差ゼロが合格ライン） |
| 3 | 9〜10月 | AWS本番移行・セキュリティ強化 |
| 4 | 10〜11月 | プロアルファ様で本番運用開始 |
| 5 | 11〜12月 | 第二号代理店へ展開 |
