# Power Automate フロー作成手順

> 方針変更により、現在の推奨は `docs/microsoft-graph-outlook-import-setup.md` の Microsoft Graph API 方式。
> この手順はPower Automate方式に戻す場合の予備として残す。

## 目的

`info_order@ithe.co.jp` に届いた配送依頼メールを検知し、添付Excelを Render API に送る。
Render API 側でExcel帳票を解析し、Supabaseに保存する。

```text
Outlook
  -> Power Automate
  -> Render API
  -> Supabase
  -> アプリ画面
```

## 事前に用意するもの

Render URL:

```text
https://あなたのサービス名.onrender.com
```

Power Automate secret:

```text
05dc999bd1014ef3bd7050834dc601f768f56062a8cc405184f67a3be87bd7c1
```

Render API URL:

```text
https://あなたのサービス名.onrender.com/api/power-automate/delivery-import
```

## フロー作成

### 1. 新しいフローを作る

Power Automate を開く。

```text
作成
  -> 自動化したクラウド フロー
```

フロー名:

```text
配送依頼メール取込
```

トリガー:

共有メールボックスの場合:

```text
When a new email arrives in a shared mailbox (V2)
```

自分のメールボックスの場合:

```text
When a new email arrives (V3)
```

`info_order@ithe.co.jp` が共有メールボックスなら、共有メールボックス用を使う。

## 2. Outlookトリガー設定

共有メールボックス用の場合:

```text
Original Mailbox Address: info_order@ithe.co.jp
Folder: Inbox
Include Attachments: Yes
Only with Attachments: Yes
Importance: Any
```

自分のメールボックス用の場合:

```text
Folder: Inbox
Include Attachments: Yes
Only with Attachments: Yes
Importance: Any
```

## 3. キーワード判定を追加

新しいステップ:

```text
Condition
```

条件は「件名または本文に対象キーワードが入っているか」。

Power Automate の条件カードで作りにくい場合は、左側の値に `Expression` で以下を入れる。

```text
or(
  contains(coalesce(triggerOutputs()?['body/subject'], ''), '[商品交換依頼]'),
  contains(coalesce(triggerOutputs()?['body/subject'], ''), '[商品回収依頼]'),
  contains(coalesce(triggerOutputs()?['body/body'], ''), '[商品交換依頼]'),
  contains(coalesce(triggerOutputs()?['body/body'], ''), '[商品回収依頼]')
)
```

比較:

```text
is equal to
```

右側:

```text
true
```

以降の処理は `Yes` 側に入れる。

## 4. 添付ファイルを1件ずつ処理

`Yes` 側で新しいステップ:

```text
Apply to each
```

対象:

```text
Attachments
```

## 5. Excelだけ通す

`Apply to each` の中で新しいステップ:

```text
Condition
```

左側に `Expression`:

```text
endsWith(toLower(items('Apply_to_each')?['Name']), '.xlsx')
```

比較:

```text
is equal to
```

右側:

```text
true
```

以降のHTTP送信はこの条件の `Yes` 側に入れる。

もし `Apply_to_each` という名前でエラーになる場合は、Power Automate が自動で付けたループ名に合わせる。
例: `Apply_to_each_2` なら式も `items('Apply_to_each_2')?['Name']` にする。

## 6. HTTPでRender APIへ送る

Excel判定の `Yes` 側で新しいステップ:

```text
HTTP
```

Method:

```text
POST
```

URI:

```text
https://あなたのサービス名.onrender.com/api/power-automate/delivery-import
```

Headers:

```text
Content-Type
application/json
```

```text
Authorization
Bearer 05dc999bd1014ef3bd7050834dc601f768f56062a8cc405184f67a3be87bd7c1
```

Body:

```json
{
  "attachmentName": "@{items('Apply_to_each')?['Name']}",
  "attachmentContentBytes": "@{items('Apply_to_each')?['ContentBytes']}",
  "mailSubject": "@{triggerOutputs()?['body/subject']}",
  "mailFrom": "@{triggerOutputs()?['body/from']}",
  "receivedAt": "@{triggerOutputs()?['body/receivedDateTime']}",
  "sourceMailbox": "info_order@ithe.co.jp",
  "sourceMailId": "@{triggerOutputs()?['body/id']}"
}
```

ループ名が `Apply_to_each` でない場合は、Body内の2か所も実際のループ名に合わせる。

## 7. ContentBytes が選べない場合

Outlookトリガーの添付ファイルに `ContentBytes` が出ない場合は、HTTPの前にアクションを1つ追加する。

追加するアクション:

```text
Get attachment (V2)
```

設定:

```text
Message Id: トリガーの Message Id
Attachment Id: Apply to each 内の Attachment Id
```

その場合、HTTP Body の `attachmentContentBytes` は `Get attachment (V2)` の `ContentBytes` を使う。

```json
{
  "attachmentName": "@{items('Apply_to_each')?['Name']}",
  "attachmentContentBytes": "@{body('Get_attachment_(V2)')?['contentBytes']}",
  "mailSubject": "@{triggerOutputs()?['body/subject']}",
  "mailFrom": "@{triggerOutputs()?['body/from']}",
  "receivedAt": "@{triggerOutputs()?['body/receivedDateTime']}",
  "sourceMailbox": "info_order@ithe.co.jp",
  "sourceMailId": "@{triggerOutputs()?['body/id']}"
}
```

## 8. 保存してテスト

フローを保存する。

テスト方法:

1. `info_order@ithe.co.jp` に対象メールを送る
2. 件名または本文に `[商品交換依頼]` か `[商品回収依頼]` を入れる
3. アイザ帳票Excelを添付する
4. Power Automate の実行履歴を見る
5. HTTP が `200` になっていることを確認する
6. アプリの配送メール受信画面を開く

成功時のHTTP応答例:

```json
{
  "caseId": "AIZA-01175142",
  "updatedAt": "2026-06-19 10:30:00"
}
```

## よくあるエラー

### 401 Unauthorized

`Authorization` ヘッダーが間違っている。

正:

```text
Bearer 05dc999bd1014ef3bd7050834dc601f768f56062a8cc405184f67a3be87bd7c1
```

`Bearer` の後ろに半角スペースが必要。

### 500 POWER_AUTOMATE_SECRET is not configured

Render の Environment に `POWER_AUTOMATE_SECRET` が入っていないか、再デプロイされていない。

### caseId is required

Excelから `弊社問合番号` が読めていない。
添付ファイルが対象のアイザ帳票か確認する。

### attachmentContentBytes が空

Power Automate 側で添付ファイル本体を送れていない。
`Get attachment (V2)` を追加して、その `ContentBytes` をHTTP Bodyに入れる。
