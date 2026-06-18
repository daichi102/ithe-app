# Power Automate / Render / Neon 構成メモ

## 推奨構成

```text
GitHub
  ↓
Render
  ↓
Neon Postgres
```

メール取込は以下の流れにする。

```text
Outlook
  ↓
Power Automate
  ↓
Render の API
  ↓
Neon Postgres
  ↓
アプリ画面
```

## 各サービスの役割

### GitHub

- アプリのコード置き場
- 修正後に `git push` する
- Render は GitHub の変更を検知して自動デプロイする

### Render

- アプリ本体を公開する場所
- API を動かす場所
- Power Automate から送られた案件データを受け取る
- Neon Postgres に案件データを保存する

### Neon Postgres

- 案件データの保存先
- 配送メール受信データを保存する
- 案件管理ステータスを保存する
- 将来的にチェック表や完了報告状態も保存できる

### Power Automate

- `info_order@ithe.co.jp` の Outlook メールを監視する
- 本文に `[商品交換依頼]` または `[商品回収依頼]` が含まれるか判定する
- 添付 Excel の `アイザ` シートを読む
- Render の受け取り API へ案件データを送信する
- メールを既読にはしない

## 全体フロー

```text
1. info_order@ithe.co.jp にメールが届く
2. Power Automate が起動する
3. 本文に [商品交換依頼] または [商品回収依頼] があるか確認する
4. 添付 Excel の アイザ シートを読む
5. Render API に POST する
6. Render API が秘密キーを確認する
7. Render API が Neon Postgres に保存する
8. アプリの配送メール受信画面に未確認案件として表示する
9. 画面で案件確定する
10. 案件管理のハイアール案件として管理する
```

## Render に設定する環境変数

```text
DATABASE_URL=Neonの接続文字列
POWER_AUTOMATE_SECRET=長い秘密キー
```

`DATABASE_URL` は Neon の接続文字列。

例:

```text
postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

`POWER_AUTOMATE_SECRET` は Power Automate からの送信を認証するための秘密キー。
Git には入れない。

## Power Automate 側の HTTP 設定

送信先:

```text
POST https://あなたのrender-url/api/power-automate/delivery-import
```

Headers:

```text
Content-Type: application/json
Authorization: Bearer POWER_AUTOMATE_SECRETの値
```

Body 例:

```json
{
  "caseId": "AIZA-01143799",
  "customerName": "山田 太郎",
  "customerPhone": "090-1234-5678",
  "customerAddress": "東京都港区...",
  "visitDate": "2026-06-20",
  "deliveryTimePreference": "AM希望",
  "product": "冷蔵庫 / JR-NF326B",
  "sourceFileName": "AIZA01143799.xlsx",
  "mailSubject": "[商品交換依頼] 配送依頼",
  "mailFrom": "sender@example.com"
}
```

## 次に実装するもの

1. Neon にテーブルを作成する
2. Render でアプリを動かす
3. Render に `DATABASE_URL` と `POWER_AUTOMATE_SECRET` を設定する
4. アプリに Power Automate 受け取り API を追加する
5. 配送メール受信画面を DB 読み込みに変更する
6. 案件確定時のステータス更新も DB 保存に変更する
7. Power Automate フローを作成してテストする

## 推奨する最終構成

```text
アプリ公開: Render
コード管理: GitHub
DB保存: Neon Postgres
メール監視: Power Automate
```
