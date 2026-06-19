# Microsoft Graph Outlook 取込設定手順

## 目的

Power Automateを使わず、RenderのサーバからMicrosoft Graph APIでOutlookメールを読む。

```text
Microsoft 365 / Outlook
  -> Microsoft Graph API
  -> Render
  -> Supabase
  -> アプリ画面
```

## Renderに追加する環境変数

既存:

```text
DATABASE_URL
POWER_AUTOMATE_SECRET
```

追加:

```text
OUTLOOK_MONITOR_MAILBOX=info_order@ithe.co.jp
MS_TENANT_ID=
MS_CLIENT_ID=
MS_CLIENT_SECRET=
```

`POWER_AUTOMATE_SECRET` は名前はそのままだが、Graph取込APIの保護にも使う。

## 1. Microsoft Entra 管理センターを開く

Microsoft Entra 管理センターを開く。

```text
https://entra.microsoft.com/
```

左メニュー:

```text
Applications
  -> App registrations
```

## 2. アプリ登録を作る

```text
New registration
```

入力:

```text
Name: ithe-outlook-import
Supported account types: Accounts in this organizational directory only
Redirect URI: 空欄
```

作成後、概要ページで以下を控える。

```text
Application (client) ID -> MS_CLIENT_ID
Directory (tenant) ID   -> MS_TENANT_ID
```

## 3. Client Secretを作る

アプリ登録の左メニュー:

```text
Certificates & secrets
  -> Client secrets
  -> New client secret
```

入力:

```text
Description: render-outlook-import
Expires: 6 months or 12 months
```

作成後に表示される `Value` を控える。

```text
MS_CLIENT_SECRET=表示されたValue
```

注意:

作成直後しかValueは見えない。後で見返せない。

## 4. Microsoft Graphの権限を付ける

アプリ登録の左メニュー:

```text
API permissions
  -> Add a permission
  -> Microsoft Graph
  -> Application permissions
```

追加する権限:

```text
Mail.Read
```

追加後:

```text
Grant admin consent
```

管理者同意が必要。自分に権限がない場合はMicrosoft 365管理者に依頼する。

## 5. 監視メールボックスを確認する

Render環境変数:

```text
OUTLOOK_MONITOR_MAILBOX=info_order@ithe.co.jp
```

Graph APIのApplication permissionでは、原則として組織内のメールボックスを読める。
本番では必要に応じてApplication Access Policyで読めるメールボックスを制限する。

## 6. Renderに環境変数を入れる

Renderの対象サービス:

```text
Environment
  -> Add Environment Variable
```

追加:

```text
MS_TENANT_ID=<Directory tenant ID>
MS_CLIENT_ID=<Application client ID>
MS_CLIENT_SECRET=<Client secret value>
OUTLOOK_MONITOR_MAILBOX=info_order@ithe.co.jp
```

保存後:

```text
Manual Deploy
  -> Deploy latest commit
```

## 7. Graph取込APIをテストする

PowerShell:

```powershell
$secret = "05dc999bd1014ef3bd7050834dc601f768f56062a8cc405184f67a3be87bd7c1"
$body = @{ limit = 25 } | ConvertTo-Json

Invoke-RestMethod `
  -Uri "https://あなたのサービス名.onrender.com/api/graph/outlook-import" `
  -Method Post `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $secret" } `
  -Body $body
```

成功例:

```json
{
  "mailbox": "info_order@ithe.co.jp",
  "imports": [
    {
      "caseId": "AIZA-01175142",
      "updatedAt": "2026-06-19 10:30:00"
    }
  ],
  "skipped": []
}
```

## 8. 対象メール条件

Render APIは直近メールを読み、以下の条件に合うものだけ取り込む。

```text
添付あり
件名または本文に [商品交換依頼] または [商品回収依頼]
.xlsx 添付あり
```

メールは既読にしない。

## 9. 定期実行

最初は手動実行で確認する。

本番運用では以下のどちらかにする。

```text
Render Cron Job
  -> /api/graph/outlook-import を5分または10分ごとにPOST
```

または

```text
外部監視サービス
  -> /api/graph/outlook-import を定期POST
```

## よくあるエラー

### 401 Unauthorized

Render APIへの `Authorization` ヘッダーが間違っている。

正:

```text
Authorization: Bearer <POWER_AUTOMATE_SECRETの値>
```

### 500 MS_TENANT_ID / MS_CLIENT_ID / MS_CLIENT_SECRET are not configured

RenderにGraph用環境変数が入っていない。

### 403 Forbidden

Microsoft Graphの権限不足。

確認するもの:

```text
API permissions
Mail.Read
Application permissions
Grant admin consent 済み
```

### 404 mailbox not found

`OUTLOOK_MONITOR_MAILBOX` が間違っているか、アプリ権限でそのメールボックスにアクセスできない。

### imports が空

対象メールが見つかっていない。

確認するもの:

```text
直近25件以内に対象メールがあるか
件名または本文に [商品交換依頼] / [商品回収依頼] があるか
.xlsx 添付があるか
```
