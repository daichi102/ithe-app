const regions = ["関東", "関西", "九州", "東北・信越", "北海道", "中部", "四国"];
const constructionTypes = ["弱電", "エアコン", "リフォーム"];
const localDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const todayDate = localDateKey(new Date());

const cases = [
  {
    id: "AIZA-01143698",
    caseType: "配送",
    deliveryType: "ハイアール",
    workType: "配送設置",
    region: "関東",
    status: "要確認",
    processState: "要確認",
    requesterName: "ハイアールジャパンセールス 横浜中央ST",
    sender: "ハイアールジャパンセールス 横浜中央ST",
    requesterPhone: "045-000-1100",
    requesterAddress: "神奈川県横浜市中区物流センター1-1",
    customerKana: "ヤマグチ ヤヨイ",
    customerName: "山口 弥生",
    customerPhone: "080-3550-3763",
    customerAddress: "東京都港区南麻布2-16-10",
    siteName: "デュプレベース南麻布 305",
    visitDate: "2026-06-09",
    receivedAt: "2026-06-07 09:12",
    sourceType: "mail_excel",
    sourceMailId: "AAMkADk4Y2Jk-01143698",
    sourceFileName: "作業依頼書_01143698.xlsx",
    sourceMailbox: "kanto-shared@example.jp",
    companyInquiryNumber: "YS-01143698",
    importError: "訪問設置日の形式が想定外です",
    product: "ドラム式洗濯機 / AQW-DM10R-L(W) / W / 1",
    worker: "横浜中央ST 中谷",
    estimateAmount: 22600,
    history: ["2026-06-07 09:13 Excel取り込み", "2026-06-07 09:14 要確認を登録"],
  },
  {
    id: "KOJI-000219",
    caseType: "工事",
    workType: "弱電",
    region: "中部",
    status: "作業中",
    processState: "処理済み",
    requesterName: "株式会社サンプル設備",
    requesterPhone: "052-111-2200",
    requesterAddress: "愛知県名古屋市中区設備町1-8",
    customerKana: "ナゴヤテン",
    customerName: "名古屋店",
    customerPhone: "052-000-0000",
    customerAddress: "愛知県名古屋市中村区1-2-3",
    siteName: "名古屋店 店舗改修",
    visitDate: "2026-06-08",
    receivedAt: "2026-06-06 16:22",
    sourceType: "manual",
    sourceMailId: "-",
    sourceFileName: "-",
    sourceMailbox: "-",
    importError: "",
    product: "弱電ラック移設、LAN配線、動作確認",
    worker: "佐藤",
    estimateAmount: 158000,
    constructionMemo: "夜間作業。分電盤付近の養生と入退館申請が必要。",
    history: ["2026-06-06 16:22 手入力登録", "2026-06-08 09:00 作業中に更新"],
  },
  {
    id: "KOJI-000220",
    caseType: "工事",
    workType: "エアコン",
    region: "関東",
    status: "確認中",
    processState: "要確認",
    requesterName: "東京住宅管理株式会社",
    requesterPhone: "03-5555-7800",
    requesterAddress: "東京都新宿区西新宿2-1-1",
    customerKana: "サクラハイツ",
    customerName: "さくらハイツ管理室",
    customerPhone: "03-5555-7811",
    customerAddress: "東京都世田谷区桜丘4-8-2",
    siteName: "さくらハイツ 201",
    visitDate: "2026-06-11",
    receivedAt: "2026-06-08 10:05",
    sourceType: "manual",
    sourceMailId: "-",
    sourceFileName: "-",
    sourceMailbox: "-",
    importError: "室外機置場と配管穴の位置確認が未完了",
    product: "エアコン入替、既設撤去、配管カバー再利用可否確認",
    worker: "小川",
    estimateAmount: 68200,
    constructionMemo: "現地写真待ち。高所作業の可能性あり。",
    history: ["2026-06-08 10:05 工事案件を登録", "2026-06-08 10:10 現地確認待ちに更新"],
  },
  {
    id: "KOJI-000221",
    caseType: "工事",
    workType: "リフォーム",
    region: "関西",
    status: "見積作成中",
    processState: "処理済み",
    requesterName: "大阪リフォームサービス",
    requesterPhone: "06-2222-1188",
    requesterAddress: "大阪府大阪市中央区本町1-5-2",
    customerKana: "タナカ ミホ",
    customerName: "田中 美穂",
    customerPhone: "090-2141-9920",
    customerAddress: "大阪府大阪市北区中之島3-1-1",
    siteName: "中之島レジデンス キッチン改修",
    visitDate: "2026-06-12",
    receivedAt: "2026-06-07 15:30",
    sourceType: "manual",
    sourceMailId: "-",
    sourceFileName: "-",
    sourceMailbox: "-",
    importError: "",
    product: "キッチン水栓交換、収納扉調整、床補修",
    worker: "山本",
    estimateAmount: 124000,
    constructionMemo: "材料手配中。管理組合への作業届提出済み。",
    history: ["2026-06-07 15:30 手入力登録", "2026-06-08 11:20 見積作成中に更新"],
  },
  {
    id: "KOJI-000222",
    caseType: "工事",
    workType: "弱電",
    region: "関東",
    status: "作業中",
    processState: "処理済み",
    requesterName: "首都圏ビルメンテナンス",
    requesterPhone: "03-4444-1100",
    requesterAddress: "東京都港区赤坂3-2-1",
    customerKana: "アオヤマオフィス",
    customerName: "青山オフィス",
    customerPhone: "03-4444-1190",
    customerAddress: "東京都渋谷区渋谷2-9-8",
    siteName: "青山オフィス 4F 会議室",
    visitDate: "2026-06-08",
    receivedAt: "2026-06-08 08:20",
    sourceType: "manual",
    sourceMailId: "-",
    sourceFileName: "-",
    sourceMailbox: "-",
    importError: "",
    product: "会議室モニター配線、HDMI延長、通線確認",
    worker: "佐藤",
    estimateAmount: 42000,
    constructionMemo: "午前枠。既設配管の空き確認が必要。",
    history: ["2026-06-08 08:20 工事案件を登録", "2026-06-08 08:30 担当者を割当"],
  },
  {
    id: "AIZA-01143722",
    caseType: "配送",
    deliveryType: "ハイアール",
    workType: "配送設置",
    region: "九州",
    status: "連携済み",
    processState: "処理済み",
    requesterName: "福岡物流センター",
    sender: "九州配送用共有メールボックス",
    requesterPhone: "092-555-1000",
    requesterAddress: "福岡県福岡市博多区物流1-3-8",
    customerKana: "イトウ ケン",
    customerName: "伊藤 健",
    customerPhone: "092-555-1122",
    customerAddress: "福岡県福岡市中央区薬院4-2-8",
    siteName: "薬院マンション",
    visitDate: "2026-06-07",
    receivedAt: "2026-06-06 14:03",
    sourceType: "mail_excel",
    sourceMailId: "AAMkADk4Y2Jk-01143722",
    sourceFileName: "AIZA01143722.xlsx",
    sourceMailbox: "kyushu-shared@example.jp",
    companyInquiryNumber: "YS-01143722",
    importError: "",
    product: "テレビ / 65U7N / 黒 / 1",
    worker: "福岡ST 伊藤",
    estimateAmount: 13200,
    history: ["2026-06-06 14:04 Excel取り込み", "2026-06-07 18:20 売上管理へ連携"],
  },
  {
    id: "AIZA-01143741",
    caseType: "配送",
    deliveryType: "ハイアール",
    workType: "配送設置",
    region: "関東",
    status: "取り込み済み",
    processState: "処理済み",
    requesterName: "関東配送センター",
    sender: "関東配送センター",
    requesterPhone: "03-3333-8000",
    requesterAddress: "東京都江東区新木場1-2-3",
    customerKana: "スズキ ハルカ",
    customerName: "鈴木 遥",
    customerPhone: "080-7000-2451",
    customerAddress: "東京都品川区大崎1-3-5",
    siteName: "大崎タワー 1202",
    visitDate: "2026-06-08",
    receivedAt: "2026-06-08 07:45",
    sourceType: "mail_excel",
    sourceMailId: "AAMkADk4Y2Jk-01143741",
    sourceFileName: "AIZA01143741.xlsx",
    sourceMailbox: "kanto-shared@example.jp",
    companyInquiryNumber: "YS-01143741",
    importError: "",
    product: "冷蔵庫 / JR-NF326B / 白 / 1",
    worker: "横浜中央ST 中谷",
    estimateAmount: 16500,
    history: ["2026-06-08 07:46 Excel取り込み", "2026-06-08 07:47 処理済みに更新"],
  },
  {
    id: "AIZA-01143742",
    caseType: "配送",
    deliveryType: "ハイアール",
    workType: "配送設置",
    region: "関東",
    status: "作業中",
    processState: "処理済み",
    requesterName: "関東配送センター",
    sender: "関東配送センター",
    requesterPhone: "03-3333-8000",
    requesterAddress: "東京都江東区新木場1-2-3",
    customerKana: "コバヤシ マコト",
    customerName: "小林 誠",
    customerPhone: "090-3310-8842",
    customerAddress: "神奈川県川崎市中原区小杉町3-1-4",
    siteName: "武蔵小杉レジデンス 802",
    visitDate: "2026-06-08",
    receivedAt: "2026-06-08 08:05",
    sourceType: "mail_excel",
    sourceMailId: "AAMkADk4Y2Jk-01143742",
    sourceFileName: "AIZA01143742.xlsx",
    sourceMailbox: "kanto-shared@example.jp",
    companyInquiryNumber: "YS-01143742",
    importError: "",
    product: "洗濯機 / AQW-VX14R / シルバー / 1",
    worker: "川崎ST 田辺",
    estimateAmount: 19800,
    history: ["2026-06-08 08:06 Excel取り込み", "2026-06-08 09:10 作業中に更新"],
  },
  {
    id: "AIZA-01143735",
    caseType: "配送",
    deliveryType: "ハイアール",
    workType: "配送設置",
    region: "東北・信越",
    status: "確認中",
    processState: "要確認",
    requesterName: "東北配送センター",
    sender: "東北配送センター",
    requesterPhone: "022-111-2000",
    requesterAddress: "宮城県仙台市宮城野区物流2-4-6",
    customerKana: "ササキ リナ",
    customerName: "佐々木 里奈",
    customerPhone: "022-111-2222",
    customerAddress: "宮城県仙台市青葉区上杉2-4-6",
    siteName: "上杉ハイツ",
    visitDate: "未確定",
    receivedAt: "2026-06-06 12:35",
    sourceType: "mail_excel",
    sourceMailId: "AAMkADk4Y2Jk-01143735",
    sourceFileName: "delivery_unknown.xlsx",
    sourceMailbox: "tohoku-shared@example.jp",
    companyInquiryNumber: "",
    importError: "アイザシートが見つかりません",
    product: "読み取り不可",
    worker: "未割当",
    estimateAmount: 0,
    history: ["2026-06-06 12:36 Excel取り込み失敗", "2026-06-06 12:37 要確認を登録"],
  },
  {
    id: "AIZA-TEST-001",
    caseType: "配送",
    deliveryType: "ハイアール",
    workType: "配送設置",
    region: "関東",
    status: "取り込み済み",
    processState: "処理済み",
    requesterName: "関東配送テストセンター",
    sender: "関東配送テストセンター",
    requesterPhone: "03-3333-9001",
    requesterAddress: "東京都江東区新木場2-10-1",
    customerKana: "テスト タロウ",
    customerName: "テスト 太郎",
    customerPhone: "090-1000-0001",
    customerAddress: "東京都大田区蒲田1-1-1",
    siteName: "蒲田テストマンション 301",
    visitDate: "2026-06-10",
    receivedAt: "2026-06-10 08:10",
    sourceType: "mail_excel",
    sourceMailId: "TEST-MAIL-001",
    sourceFileName: "AIZA_TEST_001.xlsx",
    sourceMailbox: "kanto-test@example.jp",
    companyInquiryNumber: "YS-TEST-001",
    importError: "",
    product: "冷蔵庫 / JR-NF340A / 白 / 1",
    worker: "横浜中央ST 中谷",
    estimateAmount: 17200,
    history: ["2026-06-10 08:10 テスト取込", "2026-06-10 08:11 処理済みに更新"],
  },
  {
    id: "AIZA-TEST-002",
    caseType: "配送",
    deliveryType: "ハイアール",
    workType: "配送設置",
    region: "関西",
    status: "作業中",
    processState: "処理済み",
    requesterName: "関西配送テストセンター",
    sender: "関西配送テストセンター",
    requesterPhone: "06-2222-9002",
    requesterAddress: "大阪府大阪市住之江区物流3-2-1",
    customerKana: "テスト ハナコ",
    customerName: "テスト 花子",
    customerPhone: "090-1000-0002",
    customerAddress: "大阪府吹田市江坂町2-2-2",
    siteName: "江坂テストレジデンス 805",
    visitDate: "2026-06-10",
    receivedAt: "2026-06-10 08:20",
    sourceType: "mail_excel",
    sourceMailId: "TEST-MAIL-002",
    sourceFileName: "AIZA_TEST_002.xlsx",
    sourceMailbox: "kansai-test@example.jp",
    companyInquiryNumber: "YS-TEST-002",
    importError: "",
    product: "洗濯機 / AQW-VX10R / シルバー / 1",
    worker: "大阪ST 山本",
    estimateAmount: 20500,
    history: ["2026-06-10 08:20 テスト取込", "2026-06-10 09:00 作業中に更新"],
  },
  {
    id: "AIZA-TEST-003",
    caseType: "配送",
    deliveryType: "販売店",
    workType: "販売店案件",
    region: "中部",
    status: "取り込み済み",
    processState: "処理済み",
    requesterName: "名古屋テスト販売店",
    sender: "手入力配送依頼",
    requesterPhone: "052-333-9003",
    requesterAddress: "愛知県名古屋市中区テスト町3-3",
    customerKana: "テスト イチロウ",
    customerName: "テスト 一郎",
    customerPhone: "090-1000-0003",
    customerAddress: "愛知県名古屋市千種区今池3-3-3",
    siteName: "名古屋テスト販売店 / テスト 一郎",
    visitDate: "2026-06-10",
    receivedAt: "2026-06-10 08:30",
    sourceType: "manual",
    sourceMailId: "-",
    sourceFileName: "-",
    sourceMailbox: "-",
    companyInquiryNumber: "YS-TEST-003",
    importError: "",
    product: "販売店配送メモ: テレビ設置、既設回収あり",
    worker: "名古屋ST 佐藤",
    estimateAmount: 14800,
    dealerNote: "完了報告連動確認用の販売店案件",
    history: ["2026-06-10 08:30 テスト取込", "2026-06-10 08:31 処理済みに更新"],
  },
];

const confirmations = [
  { id: "CNF-001", caseId: "AIZA-01143698", source: "Excel取り込み", reason: "訪問設置日の形式が想定外です", rawValue: "6/9 AM 希望", correctedValue: "2026-06-09", status: "unchecked" },
  { id: "CNF-TEST-001", caseId: "AIZA-TEST-001", source: "テスト配送メール", reason: "テスト用メール取込", rawValue: "AIZA_TEST_001.xlsx", correctedValue: "案件確定待ち", status: "unchecked" },
  { id: "CNF-TEST-002", caseId: "AIZA-TEST-002", source: "テスト配送メール", reason: "テスト用メール取込", rawValue: "AIZA_TEST_002.xlsx", correctedValue: "案件確定待ち", status: "unchecked" },
  { id: "CNF-TEST-003", caseId: "AIZA-TEST-003", source: "テスト配送メール", reason: "テスト用メール取込", rawValue: "AIZA_TEST_003.xlsx", correctedValue: "案件確定待ち", status: "unchecked" },
];

let activeRegion = "all";
let activeConstructionRegion = "all";
let stateFilter = "all";
let constructionStateFilter = "all";
let typeFilter = "all";
let confirmFilter = "all";
let deliveryTypeFilter = "all";
let calendarRange = "today";
let currentRole = "admin";
let currentDetailId = cases[0].id;
let currentReportCaseId = null;
let lastListView = "deliveryCases";
let newCaseMode = "delivery";
let signatureLocked = false;
let activeChecklistRecord = null;
let activeConfirmEditId = null;
let confirmSubmitMessage = "";
const checklistStoragePrefix = "ithe_delivery_checklist:";
const vehicleRunStorageKey = "ithe_vehicle_runs";
let pendingSignatureReportCaseId = null;

const deliveryRuns = [];

const carryInCheckLabels = [
  "開梱時、商品のキズ確認（キズがある場合、写真）",
  "お客様立会いのもと、商品のキズ確認",
  "商品搬入前ルート確認 床",
  "商品搬入前ルート確認 壁",
  "商品搬入前ルート確認 その他",
  "商品設置場所周囲のキズ確認（キズがある場合、写真）",
];

const afterWorkCheckLabels = [
  "お客様による商品の設置状況確認",
  "設置後、商品のキズの確認（キズがある場合、写真）",
  "試運転をお客様立会いのもとで実施",
  "給水栓の水漏れ、排水ホースの立上り確認",
  "設置場所周辺、搬入ルート等の清掃（ゴミ、戸締り等）",
  "商品搬入後ルート確認 床",
  "商品搬入後ルート確認 壁",
  "商品搬入後ルート確認 その他",
  "商品設置状況の説明・商品の簡易取り扱い説明",
];

const checklistFieldIds = [
  "checkInquiryNumber",
  "checkWorker",
  "checkStore",
  "checkProduct",
  "checkSerialNumber",
  "checkElevator",
  "checkIndoorStairs",
  "checkOutdoorStairs",
  "checkWarranty",
  "checkInstallFloor",
  "checkCarryOut",
  "checkSpecialWorkNote",
  "checkNotes",
  "checkInstallDate",
  "checkStartTime",
  "checkEndTime",
  "checkPartnerCompany",
  "checkCustomerName",
];

const checklistOptionIds = [
  "checkFridge400",
  "checkFridge500",
  "checkWasherVertical",
  "checkWasherDrum",
  "checkUnic",
  "checkDoorRemoval",
  "checkCounterCarry",
  "checkHighPlace",
  "checkSpecialWork",
  "checkRecycle",
];

const checklistOptionLabels = {
  checkFridge400: "冷蔵庫 400Lクラス以下",
  checkFridge500: "冷蔵庫 500Lクラス以上",
  checkWasherVertical: "洗濯機 縦型",
  checkWasherDrum: "洗濯機 ドラム式",
  checkUnic: "ユニック作業",
  checkDoorRemoval: "ドア・窓・手すり外し",
  checkCounterCarry: "カウンター越え",
  checkHighPlace: "高所作業",
  checkSpecialWork: "特殊作業",
  checkRecycle: "リサイクル 有",
};

const deliveryCaseType = cases.find((item) => item.id.startsWith("AIZA"))?.caseType || "配送";
const constructionCaseType = cases.find((item) => item.id.startsWith("KOJI"))?.caseType || "工事";

const titles = {
  dashboard: "ダッシュボード",
  deliveryCases: "案件管理",
  constructionCases: "案件管理",
  caseDetail: "案件詳細",
  newCase: "新規登録",
  confirmations: "配送メール受信",
  dispatchManagement: "配車管理",
  reports: "報告書",
  checklists: "作業管理",
  customers: "顧客管理",
  workers: "作業員",
  vehicles: "車両",
  settings: "設定",
};

const roleLabels = {
  admin: "管理者",
  operator: "一般ユーザー",
  viewer: "閲覧ユーザー",
};

const statusColor = {
  要確認: "red",
  未確認: "red",
  確認済み: "green",
  確認中: "yellow",
  見積作成中: "yellow",
  案件確定済み: "green",
  取り込み済み: "orange",
  作業確定: "blue",
  作業中: "yellow",
  作業完了: "green",
  チェック表サイン済み: "green",
  連携済み: "green",
  売上連携済み: "green",
};

function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return [...document.querySelectorAll(selector)];
}

function badge(status) {
  return `<span class="badge ${statusColor[status] || "blue"}">${status}</span>`;
}

function yen(value) {
  return `${Number(value || 0).toLocaleString("ja-JP")}円`;
}

function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(date) {
  return localDateKey(date);
}

function formatCalendarLabel(date) {
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${weekdays[date.getDay()]}）`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function nextCaseNumber(prefix) {
  const numbers = cases
    .filter((item) => item.id.startsWith(prefix))
    .map((item) => Number(item.id.replace(`${prefix}-`, "")) || 0);
  return Math.max(0, ...numbers) + 1;
}

function createDeliveryCase() {
  const number = nextCaseNumber("STORE");
  const id = `STORE-${String(number).padStart(6, "0")}`;
  const item = {
    id,
    caseType: "配送",
    deliveryType: "販売店",
    workType: "販売店案件",
    region: "関東",
    status: "案件確定済み",
    processState: "処理済み",
    requesterName: "販売店名未入力",
    sender: "手入力配送依頼",
    requesterPhone: "",
    requesterAddress: "",
    customerKana: "ミニュウリョク",
    customerName: "未入力",
    customerPhone: "000-0000-0000",
    customerAddress: "住所未入力",
    siteName: "新規販売店案件",
    visitDate: "2026-06-08",
    receivedAt: "2026-06-08 21:30",
    sourceType: "manual",
    sourceMailId: "-",
    sourceFileName: "-",
    sourceMailbox: "-",
    companyInquiryNumber: "",
    importError: "",
    product: "",
    dealerNote: "備考未入力",
    worker: "未割当",
    history: ["2026-06-08 21:30 販売店案件を画面から登録"],
  };
  cases.unshift(item);
  activeRegion = "all";
  lastListView = "deliveryCases";
  renderAll();
  renderDetail(id);
}

function createConstructionCase() {
  const number = nextCaseNumber("KOJI");
  const id = `KOJI-${String(number).padStart(6, "0")}`;
  const item = {
    id,
    caseType: "工事",
    workType: "弱電",
    region: "関東",
    status: "案件確定済み",
    processState: "要確認",
    requesterName: "手入力工事依頼",
    requesterPhone: "",
    requesterAddress: "",
    customerKana: "ミニュウリョク",
    customerName: "未入力",
    customerPhone: "000-0000-0000",
    customerAddress: "住所未入力",
    siteName: "新規工事案件",
    visitDate: "2026-06-08",
    receivedAt: "2026-06-08 21:30",
    sourceType: "manual",
    sourceMailId: "-",
    sourceFileName: "-",
    sourceMailbox: "-",
    importError: "工事内容と現地条件を確認してください",
    product: "工事内容未入力",
    worker: "未割当",
    constructionMemo: "新規登録。工事種別、予定日、担当、工事内容を入力してください。",
    history: ["2026-06-08 21:30 工事案件を画面から登録"],
  };
  cases.unshift(item);
  activeConstructionRegion = "all";
  lastListView = "constructionCases";
  renderAll();
  renderDetail(id);
}

function openNewCaseForm(mode) {
  newCaseMode = mode;
  lastListView = mode === "construction" ? "constructionCases" : "deliveryCases";
  renderNewCaseForm();
  switchView("newCase");
}

function newCaseField(id) {
  const element = $(`#${id}`);
  return element ? element.value.trim() : "";
}

function renderNewCaseForm() {
  const isConstruction = newCaseMode === "construction";
  const heading = isConstruction ? "工事案件 新規登録" : "配送案件 新規登録";
  const scheduledLabel = isConstruction ? "作業予定日" : "訪問設置日";
  const workLabel = isConstruction ? "工事種別" : "作業種別";
  const workOptions = isConstruction ? constructionTypes : ["配送設置", "引取", "納品", "販売店案件"];

  $("#newCaseContent").innerHTML = `
    <section class="panel new-case-panel">
      <div class="panel-head">
        <div>
          <p class="eyebrow">${isConstruction ? "Construction" : "Delivery"}</p>
          <h3>${heading}</h3>
        </div>
        <span class="badge blue">案件詳細とは別画面</span>
      </div>
      <form id="newCaseForm" class="new-case-form">
        <div class="form-section">
          <h4>案件情報</h4>
          <div class="form-grid two">
            ${
              isConstruction
                ? ""
                : `<label>配送区分<select id="newDeliveryType"><option>ハイアール</option><option>販売店</option></select></label>`
            }
            <label>${workLabel}<select id="newWorkType">${workOptions.map((item) => `<option>${item}</option>`).join("")}</select></label>
            <label>地域<select id="newRegion">${regions.map((item) => `<option>${item}</option>`).join("")}</select></label>
            <label>${scheduledLabel}<input id="newVisitDate" type="date" value="${formatDate(new Date())}" required /></label>
            <label>担当者<input id="newWorker" placeholder="担当者名" /></label>
            <label>ステータス<select id="newStatus"><option>案件確定済み</option><option>確認中</option><option>要確認</option></select></label>
          </div>
        </div>
        <div class="form-section">
          <h4>依頼主</h4>
          <div class="form-grid two">
            <label>依頼主<input id="newRequester" required /></label>
            <label>依頼主電話番号<input id="newRequesterPhone" /></label>
            <label class="wide-field">依頼主住所<input id="newRequesterAddress" /></label>
          </div>
        </div>
        <div class="form-section">
          <h4>お客様・現場</h4>
          <div class="form-grid two">
            <label>現場名<input id="newSiteName" required /></label>
            <label>お客様カナ<input id="newCustomerKana" /></label>
            <label>お客様名<input id="newCustomerName" required /></label>
            <label>電話番号<input id="newCustomerPhone" /></label>
            <label class="wide-field">住所<input id="newCustomerAddress" /></label>
          </div>
        </div>
        <div class="form-section">
          <h4>${isConstruction ? "工事内容" : "商品情報"}</h4>
          <label>${isConstruction ? "工事内容" : "商品情報"}<textarea id="newProduct"></textarea></label>
          <label>${isConstruction ? "工事メモ・注意事項" : "注意事項・確認理由"}<textarea id="newNote"></textarea></label>
        </div>
        <div class="button-row">
          <button class="secondary" type="button" id="cancelNewCase">キャンセル</button>
          <button class="primary operator-action" type="submit">登録</button>
        </div>
      </form>
    </section>
  `;
  applyRole();
}

function saveNewCase() {
  const isConstruction = newCaseMode === "construction";
  const prefix = isConstruction ? "KOJI" : "AIZA";
  const id = `${prefix}-${String(nextCaseNumber(prefix)).padStart(isConstruction ? 6 : 8, "0")}`;
  const now = new Date();
  const registeredAt = `${formatDate(now)} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const note = newCaseField("newNote");
  const item = {
    id,
    caseType: isConstruction ? constructionCaseType : deliveryCaseType,
    deliveryType: isConstruction ? undefined : newCaseField("newDeliveryType"),
    workType: newCaseField("newWorkType"),
    region: newCaseField("newRegion"),
    status: newCaseField("newStatus"),
    processState: newCaseField("newStatus") === "要確認" ? "要確認" : "処理済み",
    requesterName: newCaseField("newRequester"),
    sender: newCaseField("newRequester"),
    requesterPhone: newCaseField("newRequesterPhone"),
    requesterAddress: newCaseField("newRequesterAddress"),
    customerKana: newCaseField("newCustomerKana"),
    customerName: newCaseField("newCustomerName"),
    customerPhone: newCaseField("newCustomerPhone"),
    customerAddress: newCaseField("newCustomerAddress"),
    siteName: newCaseField("newSiteName"),
    visitDate: newCaseField("newVisitDate"),
    receivedAt: registeredAt,
    sourceType: "manual",
    sourceMailId: "-",
    sourceFileName: "-",
    sourceMailbox: "-",
    companyInquiryNumber: "",
    importError: isConstruction ? "" : note,
    product: newCaseField("newProduct"),
    worker: newCaseField("newWorker"),
    estimateAmount: 0,
    history: [`${registeredAt} 新規登録画面から登録`],
  };

  if (isConstruction) item.constructionMemo = note;
  cases.unshift(item);
  if (isConstruction) activeConstructionRegion = "all";
  else activeRegion = "all";
  renderAll();
  switchView(lastListView);
}

function applyRole() {
  $("#currentRoleLabel").textContent = roleLabels[currentRole];
  $all(".admin-only").forEach((item) => item.classList.toggle("hidden", currentRole !== "admin"));
  $all(".operator-action").forEach((item) => {
    item.disabled = currentRole === "viewer";
    item.title = currentRole === "viewer" ? "閲覧ユーザーは操作できません" : "";
  });
}

function showApp() {
  $("#loginView").classList.add("hidden");
  $("#appView").classList.remove("hidden");
  applyRole();
  renderAll();
}

function toggleSidebar() {
  const app = $("#appView");
  const button = $("#sidebarToggle");
  if (!app || !button) return;
  const collapsed = app.classList.toggle("sidebar-collapsed");
  button.setAttribute("aria-expanded", String(!collapsed));
  button.title = collapsed ? "サイドバーを表示" : "サイドバーを隠す";
}

function switchView(viewName) {
  if (viewName === "settings" && currentRole !== "admin") return;
  $all(".view").forEach((view) => view.classList.remove("active-view"));
  const view = $(`#${viewName}`);
  if (!view) return;
  view.classList.add("active-view");
  $("#pageTitle").textContent = titles[viewName] || "業務管理";
  $all(".nav-item").forEach((item) => {
    const isDeliveryChild = item.dataset.view === "deliveryCases" && viewName === "deliveryCases" && item.dataset.deliveryTypeFilter === deliveryTypeFilter;
    const isDirect = item.dataset.view === viewName && item.dataset.view !== "deliveryCases";
    item.classList.toggle("active", isDeliveryChild || isDirect);
  });
  $all(".nav-group").forEach((group) => {
    const hasActive = Boolean(group.querySelector(".nav-subitem.active"));
    group.classList.toggle("has-active", hasActive);
    if (hasActive) group.classList.add("open");
    group.querySelector(".nav-parent")?.setAttribute("aria-expanded", String(group.classList.contains("open")));
  });
}

function openTypeList(caseType) {
  if (caseType === "工事") {
    lastListView = "constructionCases";
    switchView("constructionCases");
  } else {
    lastListView = "deliveryCases";
    deliveryTypeFilter = "all";
    switchView("deliveryCases");
  }
}

function renderSummary() {
  const today = todayDate;
  const monthPrefix = "2026-06";
  const construction = cases.filter((item) => item.caseType === "工事");
  const delivery = cases.filter((item) => item.caseType === "配送" && isConfirmedForCaseManagement(item));
  const haierDelivery = delivery.filter((item) => item.deliveryType !== "販売店");
  const dealerDelivery = delivery.filter((item) => item.deliveryType === "販売店");
  const reportReady = getReportReadyCases();
  const summary = [
    ["今月のハイアール配送案件", haierDelivery.filter((item) => item.visitDate.startsWith(monthPrefix)).length, "orange"],
    ["今月の販売店案件", dealerDelivery.filter((item) => item.visitDate.startsWith(monthPrefix)).length, "blue"],
    ["今月の工事案件", construction.filter((item) => item.visitDate.startsWith(monthPrefix)).length, "blue"],
    ["本日のハイアール配送案件", haierDelivery.filter((item) => item.visitDate === today).length, "orange"],
    ["本日の販売店案件", dealerDelivery.filter((item) => item.visitDate === today).length, "blue"],
    ["本日の工事案件", construction.filter((item) => item.visitDate === today).length, "green"],
    ["完了報告", reportReady.length, "green"],
  ];
  $("#summaryGrid").innerHTML = summary
    .map(
      ([label, value, color]) => {
        const openType = label.includes("工事") ? "工事" : "配送";
        return `
        <button class="metric tappable-card" type="button" data-open-type="${openType}">
          <span class="status-dot ${color}"></span>
          <p>${label}</p>
          <strong>${value}</strong>
        </button>
      `;
      },
    )
    .join("");
}

function getReportReadyCases() {
  return cases.filter((item) => item.caseType === "配送" && isConfirmedForCaseManagement(item) && item.status === "作業完了");
}

function renderReportQueue() {
  const reportReady = getReportReadyCases();
  const count = $("#reportQueueCount");
  const queue = $("#reportQueue");
  if (!count || !queue) return;
  count.textContent = `${reportReady.length}件`;
  queue.innerHTML =
    reportReady
      .map(
        (item) => `
          <article class="case-card report-ready-card">
            <div>
              <strong>${item.id} ${badge(item.status)}</strong>
              <p>${item.region} / ${item.visitDate} / ${item.siteName}</p>
            </div>
            <div class="case-card-actions">
              <button class="primary operator-action" type="button" data-report-case="${item.id}">報告書を作る</button>
              <button class="secondary" type="button" data-detail="${item.id}" data-source-view="deliveryCases">詳細</button>
            </div>
          </article>
        `,
      )
      .join("") || `<p class="empty-state">作業完了になった配送案件はまだありません</p>`;
}

function loadVehicleRunState() {
  try {
    const stored = JSON.parse(localStorage.getItem(vehicleRunStorageKey) || "{}");
    deliveryRuns.forEach((run) => {
      const saved = stored[run.id];
      if (!saved) return;
      Object.assign(run, {
        status: saved.status || run.status,
        companyDepartedAt: saved.companyDepartedAt || "",
        companyReturnedAt: saved.companyReturnedAt || "",
      });
      run.stops.forEach((stop) => {
        const savedStop = saved.stops?.find((item) => item.caseId === stop.caseId);
        if (savedStop) Object.assign(stop, savedStop);
      });
    });
  } catch (error) {
    localStorage.removeItem(vehicleRunStorageKey);
  }
}

function saveVehicleRunState() {
  const state = Object.fromEntries(deliveryRuns.map((run) => [run.id, run]));
  localStorage.setItem(vehicleRunStorageKey, JSON.stringify(state));
}

function nowTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function minutesFromTime(value) {
  if (!/^\d{2}:\d{2}$/.test(value || "")) return null;
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function diffMinutes(start, end) {
  const startMinutes = minutesFromTime(start);
  const endMinutes = minutesFromTime(end);
  if (startMinutes === null || endMinutes === null || endMinutes < startMinutes) return 0;
  return endMinutes - startMinutes;
}

function formatDuration(minutes) {
  if (!minutes) return "0分";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours ? `${hours}時間${rest ? `${rest}分` : ""}` : `${rest}分`;
}

function getRunTotals(run) {
  let driving = 0;
  let work = 0;
  let previousDeparture = run.companyDepartedAt;
  run.stops.forEach((stop) => {
    driving += diffMinutes(previousDeparture, stop.arrivedAt);
    work += diffMinutes(stop.workStartedAt || stop.arrivedAt, stop.workFinishedAt || stop.departedAt);
    previousDeparture = stop.departedAt || previousDeparture;
  });
  driving += diffMinutes(previousDeparture, run.companyReturnedAt);
  return { driving, work };
}

function getRunStep(run) {
  if (!run.companyDepartedAt) return { action: "companyDeparted", label: "会社出発", status: "未出発" };
  const activeStop = run.stops.find((stop) => !stop.departedAt);
  if (!activeStop) {
    if (!run.companyReturnedAt) return { action: "companyReturned", label: "会社帰着", status: "帰社中" };
    return { action: "", label: "", status: "完了" };
  }
  const item = cases.find((entry) => entry.id === activeStop.caseId);
  if (!activeStop.arrivedAt) return { action: "arrived", label: "到着", status: `${activeStop.caseId}へ移動中`, stop: activeStop, item };
  if (!activeStop.workStartedAt) return { action: "workStarted", label: "作業開始", status: `${activeStop.caseId}到着済み`, stop: activeStop, item };
  if (!activeStop.workFinishedAt) return { action: "workFinished", label: "作業終了", status: `${activeStop.caseId}作業中`, stop: activeStop, item };
  return { action: "departed", label: "出発", status: `${activeStop.caseId}作業終了`, stop: activeStop, item };
}

function getRunCaseAssignment(caseId) {
  for (const run of deliveryRuns) {
    const stop = run.stops.find((item) => item.caseId === caseId);
    if (stop) return { run, stop };
  }
  return null;
}

function getStopStatus(stop) {
  if (!stop.arrivedAt) return "未着手";
  if (!stop.workStartedAt) return "到着済み";
  if (!stop.workFinishedAt) return "作業中";
  if (!stop.departedAt) return "作業終了";
  return "完了";
}

function renderDispatchChip(caseId) {
  const assignment = getRunCaseAssignment(caseId);
  if (!assignment) return `<span class="dispatch-chip empty">未配車</span>`;
  const { run, stop } = assignment;
  return `
    <button class="dispatch-chip" type="button" data-open-run="${run.id}" data-stop-case="${caseId}">
      <strong>${run.vehicleName}</strong>
      <span>${run.plateNo}</span>
      <small>${stop.plannedTime} / ${getStopStatus(stop)}</small>
    </button>
  `;
}

function syncCaseStatusFromRunAction(action, caseId) {
  const item = cases.find((entry) => entry.id === caseId);
  if (!item) return;
  if (action === "arrived" || action === "workStarted") setDeliveryStatus(item, "\u4f5c\u696d\u4e2d", "\u8eca\u4e21\u65e5\u5831");
  if (action === "departed") setDeliveryStatus(item, "\u4f5c\u696d\u5b8c\u4e86", "\u8eca\u4e21\u65e5\u5831");
}

function renderVehicleRuns() {
  const target = $("#todayVehicleRuns");
  if (!target) return;
  const runs = deliveryRuns.filter((run) => run.deliveryDate === todayDate);
  $("#vehicleRunCount").textContent = `${runs.length}台`;
  target.innerHTML = runs
    .map((run) => {
      const step = getRunStep(run);
      const totals = getRunTotals(run);
      const nextStop = run.stops.find((stop) => !stop.departedAt);
      const nextCase = nextStop ? cases.find((item) => item.id === nextStop.caseId) : null;
      const doneCount = run.stops.filter((stop) => stop.departedAt).length;
      return `
        <button class="vehicle-run-card tappable-card" type="button" data-open-run="${run.id}">
          <div class="vehicle-run-head">
            <div>
              <strong>${run.plateNo}</strong>
              <span>${run.vehicleName} / ${run.runName}</span>
            </div>
            ${badge(step.status)}
          </div>
          <div class="vehicle-run-meta">
            <span>担当: ${run.driverName}</span>
            <span>案件: ${doneCount}/${run.stops.length}</span>
          </div>
          <p class="workflow-site">次: ${nextCase ? `${nextCase.id} ${nextCase.siteName}` : "帰社または完了"}</p>
          <div class="vehicle-run-totals">
            <span>運転 ${formatDuration(totals.driving)}</span>
            <span>作業 ${formatDuration(totals.work)}</span>
          </div>
        </button>
      `;
    })
    .join("") || `<p class="empty-state">本日の配送便はありません</p>`;
}

function renderDispatchManagement() {
  const target = $("#dispatchRunList");
  if (!target) return;
  const runs = deliveryRuns.filter((run) => run.deliveryDate === todayDate);
  $("#dispatchRunCount").textContent = `${runs.length}台`;
  target.innerHTML =
    runs
      .map((run) => {
        const step = getRunStep(run);
        const doneCount = run.stops.filter((stop) => stop.departedAt).length;
        const nextStop = run.stops.find((stop) => !stop.departedAt);
        const nextCase = nextStop ? cases.find((item) => item.id === nextStop.caseId) : null;
        return `
          <button class="vehicle-run-card tappable-card" type="button" data-open-run="${run.id}">
            <div class="vehicle-run-head">
              <div>
                <strong>${run.plateNo}</strong>
                <span>${run.vehicleName} / ${run.runName}</span>
              </div>
              ${badge(step.status)}
            </div>
            <div class="vehicle-run-meta">
              <span>担当: ${run.driverName}</span>
              <span>案件: ${doneCount}/${run.stops.length}</span>
            </div>
            <p class="workflow-site">次: ${nextCase ? `${nextCase.id} ${nextCase.siteName}` : "帰社または完了"}</p>
          </button>
        `;
      })
      .join("") || `<p class="empty-state">本日の稼働車両はありません</p>`;
}

function renderMasterViews() {
  const customerMap = new Map();
  cases.forEach((item) => {
    if (item.caseType === "配送" && !isConfirmedForCaseManagement(item)) return;
    if (!customerMap.has(item.customerName)) customerMap.set(item.customerName, []);
    customerMap.get(item.customerName).push(item);
  });
  const customers = [...customerMap.entries()];
  const customerCount = $("#customerCount");
  if (customerCount) customerCount.textContent = `${customers.length}件`;
  const customerList = $("#customerList");
  if (customerList) {
    customerList.innerHTML = customers
      .map(([name, items]) => {
        const latest = items[0];
        return `
          <article class="management-card">
            <strong>${name}</strong>
            <span>${latest.customerPhone || "電話番号未登録"}</span>
            <p>${latest.customerAddress || latest.siteName} / 案件${items.length}件</p>
          </article>
        `;
      })
      .join("");
  }

  const workerMap = new Map();
  cases.forEach((item) => {
    if (item.caseType === "配送" && !isConfirmedForCaseManagement(item)) return;
    const name = item.worker || "担当未設定";
    if (!workerMap.has(name)) workerMap.set(name, []);
    workerMap.get(name).push(item);
  });
  const workers = [...workerMap.entries()];
  const workerCount = $("#workerCount");
  if (workerCount) workerCount.textContent = `${workers.length}名`;
  const workerList = $("#workerList");
  if (workerList) {
    workerList.innerHTML = workers
      .map(
        ([name, items]) => `
          <article class="management-card">
            <strong>${name}</strong>
            <span>担当案件 ${items.length}件</span>
            <p>${items.map((item) => item.region).filter(Boolean)[0] || "地域未設定"}</p>
          </article>
        `,
      )
      .join("");
  }

  const vehicleCount = $("#vehicleCount");
  if (vehicleCount) vehicleCount.textContent = `${deliveryRuns.length}台`;
  const vehicleList = $("#vehicleList");
  if (vehicleList) {
    vehicleList.innerHTML = deliveryRuns
      .map(
        (run) => `
          <article class="management-card">
            <strong>${run.vehicleName}</strong>
            <span>${run.plateNo}</span>
            <p>${run.driverName} / ${run.runName} / 案件${run.stops.length}件</p>
          </article>
        `,
      )
      .join("");
  }
}

function renderVehicleRunDialog(runId) {
  const run = deliveryRuns.find((item) => item.id === runId);
  const dialog = $("#vehicleRunDialog");
  const content = $("#vehicleRunContent");
  if (!run || !dialog || !content) return;
  const step = getRunStep(run);
  const totals = getRunTotals(run);
  content.innerHTML = `
    <div class="vehicle-run-modal-head">
      <div>
        <p class="eyebrow">${run.vehicleName} / ${run.runName}</p>
        <h3 id="vehicleRunTitle">${run.plateNo}</h3>
        <p>担当: ${run.driverName}</p>
      </div>
      <button class="icon-button" type="button" data-close-run>×</button>
    </div>
    <div class="vehicle-run-current">
      <strong>現在: ${step.status}</strong>
      ${step.action && currentRole !== "viewer" ? `<button class="primary" type="button" data-run-action="${step.action}" data-run-id="${run.id}" data-case-id="${step.stop?.caseId || ""}">${step.label}</button>` : ""}
    </div>
    <div class="vehicle-run-totals large">
      <span>運転時間 ${formatDuration(totals.driving)}</span>
      <span>作業時間 ${formatDuration(totals.work)}</span>
    </div>
    <div class="vehicle-run-log">
      <div class="vehicle-run-log-row"><span>会社出発</span><strong>${run.companyDepartedAt || "-"}</strong></div>
      ${run.stops
        .map((stop) => {
          const item = cases.find((entry) => entry.id === stop.caseId);
          return `
            <article class="vehicle-stop">
              <div>
                <strong>${stop.plannedTime} ${stop.caseId}</strong>
                <p>${item?.siteName || ""}</p>
              </div>
              <dl>
                <div><dt>到着</dt><dd>${stop.arrivedAt || "-"}</dd></div>
                <div><dt>作業開始</dt><dd>${stop.workStartedAt || "-"}</dd></div>
                <div><dt>作業終了</dt><dd>${stop.workFinishedAt || "-"}</dd></div>
                <div><dt>出発</dt><dd>${stop.departedAt || "-"}</dd></div>
              </dl>
            </article>
          `;
        })
        .join("")}
      <div class="vehicle-run-log-row"><span>会社帰着</span><strong>${run.companyReturnedAt || "-"}</strong></div>
    </div>
  `;
  dialog.classList.remove("hidden");
}

function closeVehicleRunDialog() {
  $("#vehicleRunDialog")?.classList.add("hidden");
}

function recordRunAction(runId, action, caseId) {
  const run = deliveryRuns.find((item) => item.id === runId);
  if (!run) return;
  const time = nowTime();
  const stop = run.stops.find((item) => item.caseId === caseId);
  if (action === "companyDeparted") run.companyDepartedAt = time;
  if (action === "companyReturned") run.companyReturnedAt = time;
  if (stop && action === "arrived") stop.arrivedAt = time;
  if (stop && action === "workStarted") stop.workStartedAt = time;
  if (stop && action === "workFinished") stop.workFinishedAt = time;
  if (stop && action === "departed") stop.departedAt = time;
  syncCaseStatusFromRunAction(action, caseId);
  run.status = getRunStep(run).status;
  saveVehicleRunState();
  renderCases();
  renderDashboard();
  renderVehicleRunDialog(runId);
}

function renderDashboard() {
  renderSummary();
  $("#todayConstructionCases").innerHTML = cases
    .filter((item) => item.caseType === "工事" && item.visitDate === todayDate)
    .map(
      (item) => `
        <article class="case-card construction-card">
          <div>
            <strong>${item.id} ${badge(item.status)}</strong>
            <p>${item.workType} / ${item.visitDate} / ${item.siteName}</p>
          </div>
          <button class="secondary" type="button" data-detail="${item.id}" data-source-view="constructionCases">詳細</button>
        </article>
      `,
    )
    .join("") || `<p class="empty-state">本日の工事案件はありません</p>`;

  $("#todayDeliveryCases").innerHTML = cases
    .filter((item) => item.caseType === "配送" && isConfirmedForCaseManagement(item) && item.visitDate === todayDate)
    .map(
      (item) => `
        <article class="case-card">
          <div>
            <strong>${item.id} ${badge(item.status)}</strong>
            <p>${item.deliveryType || "ハイアール"} / ${item.workType} / ${item.siteName}</p>
          </div>
          <button class="secondary" type="button" data-detail="${item.id}" data-source-view="deliveryCases">詳細</button>
        </article>
      `,
    )
    .join("") || `<p class="empty-state">本日の配送案件はありません</p>`;

  const reportReady = getReportReadyCases();
  $("#reportReadyCount").textContent = `${reportReady.length}件`;
  $("#reportReadyCases").innerHTML =
    reportReady
      .map(
        (item) => `
          <article class="case-card report-ready-card">
            <div>
              <strong>${item.id} ${badge(item.status)}</strong>
              <p>${item.region} / ${item.visitDate} / ${item.siteName}</p>
            </div>
            <div class="case-card-actions">
              <button class="primary operator-action" type="button" data-report-case="${item.id}">完了報告書作成</button>
              <button class="secondary" type="button" data-detail="${item.id}" data-source-view="deliveryCases">詳細</button>
            </div>
          </article>
        `,
      )
      .join("") || `<p class="empty-state">チェック表のサイン保存後、作業完了としてここに表示されます</p>`;

  renderScheduleCalendar();
  renderReportQueue();
  renderVehicleRuns();
}

function getCalendarDays() {
  const start = parseDate(todayDate);
  const length = calendarRange === "today" ? 1 : calendarRange === "week" ? 7 : 30;
  return Array.from({ length }, (_, index) => addDays(start, index));
}

function renderScheduleCalendar() {
  const days = getCalendarDays();
  const keys = days.map(formatDate);
  const periodItems = cases.filter((item) => keys.includes(item.visitDate) && (item.caseType !== "配送" || isConfirmedForCaseManagement(item)));
  const periodRuns = deliveryRuns.filter((run) => keys.includes(run.deliveryDate));
  const summary = $("#dashboardCalendarSummary");
  if (summary) {
    const firstDay = days[0];
    const lastDay = days[days.length - 1];
    summary.textContent =
      calendarRange === "today"
        ? `${formatCalendarLabel(firstDay)} / 案件${periodItems.length}件・車両${periodRuns.length}台`
        : `${formatCalendarLabel(firstDay)} - ${formatCalendarLabel(lastDay)} / 案件${periodItems.length}件・車両${periodRuns.length}台`;
  }
  $("#scheduleCalendar").className = `schedule-calendar ${calendarRange}`;
  $("#scheduleCalendar").innerHTML = days
    .map((date) => {
      const key = formatDate(date);
      const items = cases.filter((item) => item.visitDate === key && (item.caseType !== "配送" || isConfirmedForCaseManagement(item)));
      const runs = deliveryRuns.filter((run) => run.deliveryDate === key);
      return `
        <article class="schedule-day">
          <div class="schedule-date">
            <strong>${date.getMonth() + 1}/${date.getDate()}</strong>
            <span>${["日", "月", "火", "水", "木", "金", "土"][date.getDay()]}・${items.length}件・${runs.length}台</span>
          </div>
          <div class="schedule-items">
            ${runs
              .map((run) => {
                const step = getRunStep(run);
                const doneCount = run.stops.filter((stop) => stop.departedAt).length;
                return `
                  <button class="schedule-item vehicle" type="button" data-open-run="${run.id}">
                    <span>稼働車両 ${badge(step.status)}</span>
                    <strong>${run.vehicleName} / ${run.runName}</strong>
                    <small>${run.plateNo} / ${run.driverName} / 案件${doneCount}/${run.stops.length}</small>
                  </button>
                `;
              })
              .join("")}
            ${
              items
                .map(
                  (item) => `
                    <button class="schedule-item ${item.caseType === "工事" ? "construction" : "delivery"}" type="button" data-detail="${item.id}">
                      <span>${item.caseType}</span>
                      <strong>${item.workType}</strong>
                      <small>${item.siteName}</small>
                    </button>
                  `,
                )
                .join("") || (runs.length ? "" : `<p class="empty-state small">予定なし</p>`)
            }
          </div>
        </article>
      `;
    })
    .join("");
}

function renderRegionTabs() {
  $("#regionTabs").innerHTML = [
    `<button class="${activeRegion === "all" ? "active" : ""}" type="button" data-region="all">全地域</button>`,
    ...regions.map((region) => `<button class="${region === activeRegion ? "active" : ""}" type="button" data-region="${region}">${region}</button>`),
  ].join("");
}

function renderConstructionRegionTabs() {
  $("#constructionRegionTabs").innerHTML = [
    `<button class="${activeConstructionRegion === "all" ? "active" : ""}" type="button" data-construction-region="all">全地域</button>`,
    ...regions.map((region) => `<button class="${region === activeConstructionRegion ? "active" : ""}" type="button" data-construction-region="${region}">${region}</button>`),
  ].join("");
}

function getFilteredCases(caseType) {
  const query = $("#globalSearch").value.trim();
  const region = caseType === "工事" ? activeConstructionRegion : activeRegion;
  const state = caseType === "工事" ? constructionStateFilter : stateFilter;
  let rows = cases.filter((item) => item.caseType === caseType);
  if (caseType === "配送") rows = rows.filter(isConfirmedForCaseManagement);
  if (region !== "all") rows = rows.filter((item) => item.region === region);
  if (caseType === "配送" && deliveryTypeFilter !== "all") rows = rows.filter((item) => (item.deliveryType || "ハイアール") === deliveryTypeFilter);
  if (caseType === "配送" && state !== "all") rows = rows.filter((item) => item.status === state);
  if (caseType === "工事" && state === "処理済み") rows = rows.filter((item) => item.processState === "処理済み");
  if (caseType === "工事" && state === "要確認") rows = rows.filter((item) => item.processState === "要確認");
  if (query) rows = rows.filter((item) => `${item.id}${item.requesterName}${item.siteName}${item.customerName}${item.workType}`.includes(query));
  return rows;
}

function setDeliveryStatus(item, status, reason) {
  if (!item || item.caseType !== "配送" || item.status === status) return;
  const before = item.status;
  item.status = status;
  item.processState = status === "要確認" ? "要確認" : "処理済み";
  item.history.unshift(`2026-06-10 ${reason}: ${before} → ${status}`);
}

function buildDeliveryTimePreference(type, start, end) {
  if (type === "AM希望" || type === "PM希望") return type;
  if (type !== "時間指定") return "";
  if (start && end) return `${start}時～${end}時`;
  if (end) return `${end}時まで`;
  if (start) return `${start}時以降`;
  return "";
}

function confirmDeliveryMail(confirmationId, payload = {}) {
  const confirmation = confirmations.find((item) => item.id === confirmationId);
  if (!confirmation) return;
  const target = cases.find((item) => item.id === confirmation.caseId);
  if (!target || target.caseType !== "配送") return;
  confirmation.status = "confirmed";
  target.deliveryType = "ハイアール";
  if (target.workType === "販売店案件") target.workType = "配送設置";
  target.customerName = payload.customerName?.trim() || target.customerName;
  target.customerPhone = payload.customerPhone?.trim() || target.customerPhone;
  target.customerAddress = payload.customerAddress?.trim() || target.customerAddress;
  target.visitDate = payload.visitDate || target.visitDate;
  target.deliveryTimePreference = buildDeliveryTimePreference(payload.timeType, payload.timeStart, payload.timeEnd);
  target.siteName = target.siteName || `${target.deliveryType} / ${target.customerName}`;
  confirmation.correctedValue = target.visitDate;
  target.processState = "処理済み";
  setDeliveryStatus(target, "作業確定", "配送メール案件確定");
  if (!target.history.some((entry) => entry.includes("配送メール案件確定"))) {
    target.history.unshift(`2026-06-10 配送メール案件確定: ${confirmation.reason}`);
  }
  deliveryTypeFilter = "ハイアール";
  activeRegion = "all";
  activeConfirmEditId = null;
  confirmSubmitMessage = "案件管理に送信しました";
  renderDashboard();
  renderConfirmations();
  renderCases();
}

function getDeliveryPrimaryAction(item) {
  if (item.processState === "要確認" || item.status === "要確認" || item.status === "確認中") {
    return `<button class="secondary" type="button" data-detail="${item.id}" data-source-view="deliveryCases">確認</button>`;
  }
  if (item.status === "取り込み済み") {
    return `<button class="primary operator-action" type="button" data-confirm-delivery-case="${item.id}">案件確定</button>`;
  }
  if (item.status === "作業確定") {
    return "";
  }
  if (item.status === "作業中") {
    return "";
  }
  if (item.status === "作業完了") {
    return "";
  }
  return "";
}

function isDeliveryComplete(item) {
  return ["作業完了", "連携済み"].includes(item.status);
}

function getDeliveryLane(item) {
  if (item.processState === "要確認" || item.status === "要確認" || item.status === "確認中") return "confirm";
  if (isDeliveryComplete(item)) return "done";
  return "working";
}

function deliveryWorkflowCard(item, lane) {
  let primaryAction = `<button class="primary operator-action" type="button" data-checklist-case="${item.id}">チェック表</button>`;
  if (item.status === "作業確定") {
    primaryAction = `<button class="primary operator-action" type="button" data-start-work-case="${item.id}">作業開始</button>`;
  }
  if (lane === "done") {
    primaryAction = `<button class="primary operator-action" type="button" data-report-case="${item.id}">完了報告書</button>`;
  }
  return `
    <article class="workflow-card" data-detail="${item.id}" data-source-view="deliveryCases" tabindex="0">
      <div class="workflow-card-head">
        <div>
          <strong>${item.id}</strong>
          <span>${item.deliveryType || "ハイアール"} / ${item.workType}</span>
        </div>
        ${badge(item.status)}
      </div>
      <div class="workflow-site">${item.siteName}</div>
      <div class="workflow-meta">
        <span>${item.visitDate}</span>
        <span>${item.worker || "担当未設定"}</span>
      </div>
      <div class="workflow-card-actions">
        ${primaryAction}
        <button class="secondary" type="button" data-detail="${item.id}" data-source-view="deliveryCases">詳細</button>
      </div>
    </article>
  `;
}

function renderCases() {
  renderRegionTabs();
  const rows = getFilteredCases("配送");
  const heading = $("#deliveryCaseHeading");
  if (heading) heading.textContent = deliveryTypeFilter === "all" ? "配送案件一覧" : `${deliveryTypeFilter}案件一覧`;
  $("#deliveryCaseCount").textContent = `${rows.length}件`;
  $("#deliveryCaseRows").innerHTML =
    rows
      .map(
        (item) => {
          return `
        <tr class="clickable-row" data-detail="${item.id}" data-source-view="deliveryCases" tabindex="0">
          <td>${badge(item.status)}</td>
          <td>${item.deliveryType || "ハイアール"}</td>
          <td>${item.workType}</td>
          <td>${item.region}</td>
          <td><strong>${item.id}</strong></td>
          <td>${item.siteName}</td>
          <td>${item.visitDate}</td>
          <td>${item.worker}</td>
          <td>${renderDispatchChip(item.id)}</td>
          <td>
            <div class="table-actions">
              ${getDeliveryPrimaryAction(item)}
              <button class="secondary" type="button" data-detail="${item.id}" data-source-view="deliveryCases">詳細</button>
            </div>
          </td>
        </tr>
      `;
        },
      )
      .join("") || `<tr><td colspan="10"><p class="empty-state">条件に一致する配送案件はありません</p></td></tr>`;
}

function renderConstructionCases() {
  renderConstructionRegionTabs();
  const rows = getFilteredCases("工事");
  $("#constructionCaseCount").textContent = `${rows.length}件`;
  $("#constructionCaseRows").innerHTML = rows
    .map(
      (item) => `
        <tr class="clickable-row" data-detail="${item.id}" data-source-view="constructionCases" tabindex="0">
          <td>${badge(item.status)}</td>
          <td>${item.workType}</td>
          <td>${item.region}</td>
          <td><strong>${item.id}</strong></td>
          <td>${item.siteName}</td>
          <td>${item.visitDate}</td>
          <td>${item.worker}</td>
          <td><button class="secondary" type="button" data-detail="${item.id}" data-source-view="constructionCases">詳細</button></td>
        </tr>
      `,
    )
    .join("");
}

function renderDetail(caseId) {
  const item = cases.find((entry) => entry.id === caseId) || cases[0];
  currentDetailId = item.id;
  lastListView = item.caseType === "工事" ? "constructionCases" : "deliveryCases";
  const isConstruction = item.caseType === "工事";
  const isDealer = item.deliveryType === "販売店";
  const detailFields = isConstruction ? renderConstructionFields(item) : isDealer ? renderDealerFields(item) : renderDeliveryFields(item);
  const editFields = isConstruction ? renderConstructionEditFields(item) : isDealer ? renderDealerEditFields(item) : renderDeliveryEditFields(item);
  $("#detailContent").innerHTML = `
    <div class="detail-grid">
      <section class="detail-block">
        <div class="panel-head">
          <h3>${item.id}</h3>
          ${badge(item.status)}
        </div>
        <div class="field-grid">${detailFields}</div>
      </section>
      <section class="detail-block">
        <h3>${isConstruction ? "工事案件登録・更新" : isDealer ? "販売店案件登録・更新" : "ハイアール配送案件登録・更新"}</h3>
        <label>登録用テキスト
          <textarea id="formatText" class="format-text" placeholder="${formatPlaceholder(isConstruction, isDealer)}"></textarea>
        </label>
        <div class="button-row">
          <button class="secondary operator-action" type="button" id="applyFormatText">フォーマットに反映</button>
        </div>
        <div class="form-grid two">
          <label>ステータス<select id="detailStatus" ${isConstruction ? "" : "disabled"}>
            ${(isConstruction ? ["案件確定済み", "確認中", "要確認", "見積作成中", "作業中", "作業完了"] : ["取り込み済み", "作業確定", "作業中", "作業完了", "連携済み", "要確認"])
              .map((status) => `<option ${status === item.status ? "selected" : ""}>${status}</option>`)
              .join("")}
          </select></label>
          ${isDealer ? "" : `<label>${isConstruction ? "工事種別" : "作業種別"}<input id="detailWorkType" value="${item.workType}" /></label>`}
          ${editFields}
          <label>地域<input id="detailRegion" value="${item.region}" /></label>
          <label>${isConstruction ? "作業予定日" : "訪問設置日"}<input id="detailVisitDate" value="${item.visitDate}" /></label>
          <label>依頼主<input id="detailRequester" value="${item.requesterName}" /></label>
          <label>依頼主電話番号<input id="detailRequesterPhone" value="${item.requesterPhone || ""}" /></label>
          <label>依頼主住所<input id="detailRequesterAddress" value="${item.requesterAddress || ""}" /></label>
          ${isDealer ? "" : `<label>現場名<input id="detailSiteName" value="${item.siteName}" /></label>`}
          <label>お客様カナ<input id="detailCustomerKana" value="${item.customerKana}" /></label>
          <label>お客様名<input id="detailCustomerName" value="${item.customerName}" /></label>
          <label>住所<input id="detailCustomerAddress" value="${item.customerAddress}" /></label>
          ${isDealer ? "" : `<label>電話番号<input id="detailCustomerPhone" value="${item.customerPhone}" /></label><label>担当者<input id="detailWorker" value="${item.worker}" /></label>`}
        </div>
        ${isDealer ? "" : `<label>${isConstruction ? "工事内容" : "商品情報"}<textarea id="detailProduct">${item.product}</textarea></label>`}
        <label>${isDealer ? "備考欄" : isConstruction ? "工事メモ・注意事項" : "注意事項・確認理由"}<textarea id="detailNote" class="${isDealer ? "large-note" : ""}">${isDealer ? item.dealerNote || "" : isConstruction ? item.constructionMemo || item.importError : item.importError}</textarea></label>
        <div class="button-row">
          <button class="primary operator-action" type="button" id="saveDetail">保存</button>
        </div>
        <h3>編集履歴</h3>
        <ul class="timeline">${item.history.map((entry) => `<li>${entry}</li>`).join("")}</ul>
      </section>
    </div>
  `;
  applyRole();
  switchView("caseDetail");
}

function field(label, value) {
  return `<div class="field"><span>${label}</span><strong>${value || "-"}</strong></div>`;
}

function renderDeliveryFields(item) {
  return [
    field("案件番号", item.id),
    field("配送区分", item.deliveryType || "ハイアール"),
    field("案件種別", item.caseType),
    field("地域", item.region),
    field("ステータス", item.status),
    field("処理状態", item.processState),
    field("差出人", item.sender || item.requesterName),
    field("受信日時", item.receivedAt),
    field("メール ID", item.sourceMailId),
    field("添付ファイル名", item.sourceFileName),
    field("共有メールボックス", item.sourceMailbox),
    field("依頼主", item.requesterName),
    field("依頼主電話番号", maskPhone(item.requesterPhone || "")),
    field("依頼主住所", maskAddress(item.requesterAddress || "")),
    field("設置先/現場名", item.siteName),
    field("お客様カナ名", item.customerKana),
    field("お客様名", item.customerName),
    field("電話番号", maskPhone(item.customerPhone)),
    field("住所", maskAddress(item.customerAddress)),
    field("設置商品情報", item.product),
    field("訪問設置日", item.visitDate),
    field("時間希望", item.deliveryTimePreference),
    field("弊社問い合わせ番号", item.companyInquiryNumber),
    field("注意事項・要確認理由", item.importError),
    field("編集履歴", `${item.history.length}件`),
  ].join("");
}

function renderDealerFields(item) {
  return [
    field("案件番号", item.id),
    field("案件種別", "販売店案件"),
    field("ステータス", item.status),
    field("依頼主", item.requesterName),
    field("依頼主電話番号", maskPhone(item.requesterPhone || "")),
    field("依頼主住所", maskAddress(item.requesterAddress || "")),
    field("お客様名", item.customerName),
    field("お客様カナ名", item.customerKana),
    field("住所", maskAddress(item.customerAddress)),
    field("備考欄", item.dealerNote || ""),
    field("編集履歴", `${item.history.length}件`),
  ].join("");
}

function renderConstructionFields(item) {
  return [
    field("案件番号", item.id),
    field("案件種別", item.caseType),
    field("地域", item.region),
    field("ステータス", item.status),
    field("処理状態", item.processState),
    field("依頼主", item.requesterName),
    field("依頼主電話番号", maskPhone(item.requesterPhone || "")),
    field("依頼主住所", maskAddress(item.requesterAddress || "")),
    field("お客様カナ名", item.customerKana),
    field("お客様名", item.customerName),
    field("電話番号", maskPhone(item.customerPhone)),
    field("住所", maskAddress(item.customerAddress)),
    field("工事名または工事種別", item.workType),
    field("工事内容", item.product),
    field("作業予定日", item.visitDate),
    field("作業担当者", item.worker),
    field("注意事項", item.constructionMemo || item.importError),
    field("編集履歴", `${item.history.length}件`),
  ].join("");
}

function renderDeliveryEditFields(item) {
  return `
    <label>受信日時<input id="detailReceivedAt" value="${item.receivedAt || ""}" /></label>
    <label>差出人<input id="detailSender" value="${item.sender || item.requesterName || ""}" /></label>
    <label>メール ID<input id="detailSourceMailId" value="${item.sourceMailId || ""}" /></label>
    <label>添付ファイル名<input id="detailSourceFileName" value="${item.sourceFileName || ""}" /></label>
    <label>共有メールボックス<input id="detailSourceMailbox" value="${item.sourceMailbox || ""}" /></label>
    <label>弊社問い合わせ番号<input id="detailCompanyInquiryNumber" value="${item.companyInquiryNumber || ""}" /></label>
  `;
}

function renderDealerEditFields() {
  return "";
}

function renderConstructionEditFields() {
  return "";
}

function formatPlaceholder(isConstruction, isDealer = false) {
  if (isDealer) {
    return `依頼主: 販売店サンプル
依頼主電話番号: 03-0000-0000
依頼主住所: 東京都千代田区丸の内1-1-1
お客様名: 山田 太郎
お客様カナ: ヤマダ タロウ
住所: 東京都品川区大崎1-3-5
備考欄: エアコンの取り外しと搬入経路確認。午後希望。`;
  }
  return isConstruction
    ? `工事種別: エアコン
地域: 関東
依頼主: 東京住宅管理株式会社
依頼主電話番号: 03-5555-7800
依頼主住所: 東京都新宿区西新宿2-1-1
現場名: さくらハイツ 201
お客様カナ: サクラハイツ
お客様名: さくらハイツ管理室
電話番号: 03-5555-7811
住所: 東京都世田谷区桜丘4-8-2
作業予定日: 2026-06-11
担当者: 小川
工事内容: エアコン入替、既設撤去
注意事項: 室外機置場を確認`
    : `作業種別: 配送設置
地域: 関東
差出人: 関東配送センター
受信日時: 2026-06-08 07:45
メール ID: AAMkADk4Y2Jk-01143741
添付ファイル名: AIZA01143741.xlsx
共有メールボックス: kanto-shared@example.jp
依頼主: 関東配送センター
依頼主電話番号: 03-3333-8000
依頼主住所: 東京都江東区新木場1-2-3
現場名: 大崎タワー 1202
お客様カナ: スズキ ハルカ
お客様名: 鈴木 遥
電話番号: 080-7000-2451
住所: 東京都品川区大崎1-3-5
訪問設置日: 2026-06-08
担当者: 横浜中央ST 中谷
商品情報: 冷蔵庫 / JR-NF326B / 白 / 1
弊社問い合わせ番号: YS-01143741
注意事項: 搬入経路確認`;
}

function normalizeKey(key) {
  return key.replace(/\s/g, "").replace(/[:：]$/, "");
}

function applyFormattedText() {
  const text = $("#formatText").value.trim();
  if (!text) return;
  const fieldMap = {
    作業種別: "#detailWorkType",
    工事種別: "#detailWorkType",
    地域: "#detailRegion",
    差出人: "#detailSender",
    受信日時: "#detailReceivedAt",
    受信日: "#detailReceivedAt",
    メールID: "#detailSourceMailId",
    添付ファイル名: "#detailSourceFileName",
    共有メールボックス: "#detailSourceMailbox",
    依頼主: "#detailRequester",
    依頼主電話番号: "#detailRequesterPhone",
    依頼主住所: "#detailRequesterAddress",
    現場名: "#detailSiteName",
    設置先: "#detailSiteName",
    お客様カナ: "#detailCustomerKana",
    お客様カナ名: "#detailCustomerKana",
    お客様名: "#detailCustomerName",
    顧客名: "#detailCustomerName",
    電話番号: "#detailCustomerPhone",
    住所: "#detailCustomerAddress",
    訪問設置日: "#detailVisitDate",
    作業予定日: "#detailVisitDate",
    担当: "#detailWorker",
    担当者: "#detailWorker",
    作業担当: "#detailWorker",
    商品情報: "#detailProduct",
    設置商品情報: "#detailProduct",
    工事内容: "#detailProduct",
    弊社問い合わせ番号: "#detailCompanyInquiryNumber",
    注意事項: "#detailNote",
    確認理由: "#detailNote",
    工事メモ: "#detailNote",
    備考欄: "#detailNote",
    備考: "#detailNote",
    ステータス: "#detailStatus",
  };

  text.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^([^:：]+)[:：]\s*(.+)$/);
    if (!match) return;
    const selector = fieldMap[normalizeKey(match[1])];
    if (!selector || !$(selector)) return;
    $(selector).value = match[2].trim();
  });
}

function maskPhone(value) {
  return currentRole === "viewer" ? value.replace(/\d(?=\d{4})/g, "*") : value;
}

function maskAddress(value) {
  return currentRole === "viewer" ? value.replace(/(.{8}).+/, "$1...") : value;
}

function getConfirmationForCase(caseId) {
  return confirmations.find((item) => item.caseId === caseId);
}

function isConfirmedForCaseManagement(item) {
  const confirmation = getConfirmationForCase(item.id);
  return !confirmation || confirmation.status === "confirmed";
}

function renderConfirmEditRow(confirmation) {
  const target = cases.find((item) => item.id === confirmation.caseId);
  if (!target) return "";
  const hourOptions = Array.from({ length: 13 }, (_, index) => index + 8)
    .map((hour) => `<option value="${hour}">${hour}時</option>`)
    .join("");
  return `
    <tr class="confirm-edit-row">
      <td colspan="7">
        <div class="confirm-edit-panel">
          <div class="form-grid">
            <label>お客様名<input id="confirmCustomerName" value="${escapeHtml(target.customerName || "")}" /></label>
            <label>電話番号<input id="confirmCustomerPhone" value="${escapeHtml(target.customerPhone || "")}" /></label>
            <label>住所<input id="confirmCustomerAddress" value="${escapeHtml(target.customerAddress || "")}" /></label>
            <label>配送日<input id="confirmVisitDate" type="date" value="${escapeHtml(/^\d{4}-\d{2}-\d{2}$/.test(target.visitDate || "") ? target.visitDate : "")}" /></label>
            <label>時間希望<select id="confirmTimeType">
              <option value="">未選択</option>
              <option value="AM希望">AM希望</option>
              <option value="PM希望">PM希望</option>
              <option value="時間指定">時間指定</option>
            </select></label>
            <div id="confirmTimeRange" class="time-range-fields hidden">
              <label>開始時刻<select id="confirmTimeStart"><option value="">未選択</option>${hourOptions}</select></label>
              <label>終了時刻<select id="confirmTimeEnd"><option value="">指定なし</option>${hourOptions}</select></label>
            </div>
          </div>
          <div class="button-row">
            <button class="secondary" type="button" id="cancelConfirmEdit">キャンセル</button>
            <button class="primary operator-action" type="button" data-submit-confirm-case="${confirmation.id}">送信</button>
          </div>
        </div>
      </td>
    </tr>
  `;
}

function toggleConfirmTimeRange() {
  const range = $("#confirmTimeRange");
  const type = $("#confirmTimeType")?.value;
  if (range) range.classList.toggle("hidden", type !== "時間指定");
}

function renderConfirmations() {
  const query = $("#confirmSearch").value.trim();
  let rows = confirmations.filter((item) => item.caseId.startsWith("AIZA"));
  if (confirmFilter !== "all") rows = rows.filter((item) => item.status === confirmFilter);
  if (query) rows = rows.filter((item) => `${item.caseId}${item.reason}${item.source}`.includes(query));
  const count = $("#confirmCaseCount");
  if (count) count.textContent = `${rows.length}件`;
  const submitStatus = $("#confirmSubmitStatus");
  if (submitStatus) {
    submitStatus.innerHTML = confirmSubmitMessage
      ? `
        <div class="confirm-submit-card">
          <strong>${escapeHtml(confirmSubmitMessage)}</strong>
          <button class="secondary" type="button" id="closeConfirmSubmitMessage">閉じる</button>
        </div>
      `
      : "";
    submitStatus.classList.toggle("hidden", !confirmSubmitMessage);
  }
  $("#confirmRows").innerHTML =
    rows
      .map((item) => {
        const confirmed = item.status === "confirmed";
        return `
          <tr class="clickable-row" data-detail="${item.caseId}" data-source-view="confirmations" tabindex="0">
            <td>${badge(confirmed ? "確認済み" : "未確認")}</td>
            <td><strong>${item.caseId}</strong></td>
            <td>${item.source}</td>
            <td>${item.reason}</td>
            <td>${item.rawValue}</td>
            <td>${item.correctedValue}</td>
            <td>
              <div class="table-actions">
                <button class="secondary" type="button" data-detail="${item.caseId}" data-source-view="confirmations">詳細</button>
                ${confirmed ? "" : `<button class="primary operator-action" type="button" data-confirm-case="${item.id}" ${currentRole === "viewer" ? "disabled" : ""}>案件確定</button>`}
              </div>
            </td>
          </tr>
          ${activeConfirmEditId === item.id ? renderConfirmEditRow(item) : ""}
        `;
      })
      .join("") || `<tr><td colspan="7"><p class="empty-state">対象の配送メールはありません</p></td></tr>`;
}

function renderChecklist() {
  $("#checklistCaseSelect").innerHTML = cases.map((item) => `<option>${item.id} ${item.siteName}</option>`).join("");
  const labels = ["搬入・作業経路を確認", "養生範囲を確認", "既設設備を確認", "作業後の動作確認を実施", "お客様へ説明"];
  $("#checkItems").innerHTML = labels
    .map((label, index) => `<label class="check-row"><input type="checkbox" ${index < 2 ? "checked" : ""} />${label}</label>`)
    .join("");
}

function renderChecklist() {
  const select = $("#checklistCaseSelect");
  if (!select) return;

  const checklistCases = cases.filter((item) => item.caseType === "配送" && isConfirmedForCaseManagement(item));
  const selectedCaseId = select.value || checklistCases[0]?.id || "";
  select.innerHTML = cases
    .filter((item) => item.caseType === "配送" && isConfirmedForCaseManagement(item))
    .map((item) => `<option value="${item.id}">${item.id} ${item.siteName}</option>`)
    .join("");
  select.value = checklistCases.some((item) => item.id === selectedCaseId) ? selectedCaseId : select.options[0]?.value || "";

  $("#carryInChecks").innerHTML = carryInCheckLabels
    .map((label, index) => `<label class="check-row"><input type="checkbox" data-check-group="carryIn" data-check-index="${index}" /><span>${label}</span></label>`)
    .join("");
  $("#afterWorkChecks").innerHTML = afterWorkCheckLabels
    .map((label, index) => `<label class="check-row"><input type="checkbox" data-check-group="afterWork" data-check-index="${index}" /><span>${label}</span></label>`)
    .join("");

  fillChecklistDefaults(select.value);
  renderChecklistPreview();
  loadChecklist(select.value);
}

function setChecklistStatus(message, color = "yellow") {
  const status = $("#checklistSaveStatus");
  if (!status) return;
  status.textContent = message;
  status.className = `badge ${color}`;
}

function fillChecklistDefaults(caseId) {
  const item = cases.find((target) => target.id === caseId);
  if (!item) return;
  const values = {
    checkInquiryNumber: item.companyInquiryNumber || item.id,
    checkWorker: item.worker || "",
    checkStore: item.requesterName || item.sender || "",
    checkProduct: item.product || "",
    checkSerialNumber: "",
    checkInstallDate: /^\d{4}-\d{2}-\d{2}$/.test(item.visitDate || "") ? item.visitDate : "",
    checkCustomerName: item.customerName || "",
  };
  checklistFieldIds.forEach((id) => {
    const field = $(`#${id}`);
    if (field) field.value = values[id] || "";
  });
  checklistOptionIds.forEach((id) => {
    const field = $(`#${id}`);
    if (field) field.checked = false;
  });
  $all("[data-check-group]").forEach((field) => {
    field.checked = false;
  });
  clearSignatureCanvas();
  signatureLocked = false;
  const lockButton = $("#lockSignature");
  if (lockButton) lockButton.textContent = "完了";
  activeChecklistRecord = null;
  setChecklistStatus("未保存", "yellow");
  renderChecklistPreview();
}

function clearSignatureCanvas() {
  const canvas = $("#signaturePad");
  if (!canvas) return;
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
}

function readChecklistForm() {
  const payload = {
    fields: {},
    options: {},
    carryIn: [],
    afterWork: [],
    signatureDataUrl: $("#signaturePad")?.toDataURL("image/png") || "",
  };
  checklistFieldIds.forEach((id) => {
    payload.fields[id] = $(`#${id}`)?.value || "";
  });
  checklistOptionIds.forEach((id) => {
    payload.options[id] = Boolean($(`#${id}`)?.checked);
  });
  $all("[data-check-group='carryIn']").forEach((field) => {
    payload.carryIn[Number(field.dataset.checkIndex)] = field.checked;
  });
  $all("[data-check-group='afterWork']").forEach((field) => {
    payload.afterWork[Number(field.dataset.checkIndex)] = field.checked;
  });
  return payload;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function previewCell(label, value) {
  return `
    <div class="preview-cell">
      <div class="preview-label">${escapeHtml(label)}</div>
      <div class="preview-value">${escapeHtml(value || " ")}</div>
    </div>
  `;
}

function previewCheckRow(label, checked) {
  return `
    <div class="preview-check-row">
      <span>${escapeHtml(label)}</span>
      <div class="preview-mark">${checked ? "✓" : "□"}</div>
    </div>
  `;
}

function renderChecklistPreview() {
  const preview = $("#checklistLivePreview");
  if (!preview || !$("#deliveryChecklistForm")) return;
  const data = readChecklistForm();
  const fields = data.fields;
  const optionRows = checklistOptionIds
    .map((id) => `<div class="preview-option">${data.options[id] ? "✓" : "□"} ${escapeHtml(checklistOptionLabels[id])}</div>`)
    .join("");

  preview.innerHTML = `
    <article class="preview-sheet">
      <h3>作業確認チェック表</h3>
      <p class="preview-note">※全項目が抜け漏れないようチェックをお願い致します。</p>
      <div class="preview-meta">
        ${previewCell("問い合わせ番号", fields.checkInquiryNumber)}
        ${previewCell("作業担当者", fields.checkWorker)}
        ${previewCell("販売店", fields.checkStore)}
        ${previewCell("設置商品(品番)", fields.checkProduct)}
        ${previewCell("製造番号", fields.checkSerialNumber)}
        ${previewCell("お客様名", fields.checkCustomerName)}
      </div>

      <div class="preview-section-title">商品搬入時</div>
      <div class="preview-check-table">
        ${carryInCheckLabels.map((label, index) => previewCheckRow(label, data.carryIn[index])).join("")}
      </div>

      <div class="preview-section-title">作業終了後</div>
      <div class="preview-check-table">
        ${afterWorkCheckLabels.map((label, index) => previewCheckRow(label, data.afterWork[index])).join("")}
      </div>

      <div class="preview-section-title">搬入条件・オプション</div>
      <div class="preview-meta">
        ${previewCell("エレベーター", fields.checkElevator)}
        ${previewCell("屋内階段", fields.checkIndoorStairs ? `${fields.checkIndoorStairs} 段` : "")}
        ${previewCell("屋外階段", fields.checkOutdoorStairs ? `${fields.checkOutdoorStairs} 段` : "")}
        ${previewCell("保証書", fields.checkWarranty)}
        ${previewCell("設置階数", fields.checkInstallFloor ? `${fields.checkInstallFloor} 階` : "")}
        ${previewCell("搬出品", fields.checkCarryOut)}
      </div>
      <div class="preview-options">${optionRows}</div>

      <div class="preview-section-title">特殊作業内容</div>
      <div class="preview-free-area">${escapeHtml(fields.checkSpecialWorkNote || " ")}</div>

      <div class="preview-section-title">変更内容・備考</div>
      <div class="preview-free-area">${escapeHtml(fields.checkNotes || " ")}</div>

      <div class="preview-meta">
        ${previewCell("設置日", fields.checkInstallDate)}
        ${previewCell("設置時間", `${fields.checkStartTime || ""} ～ ${fields.checkEndTime || ""}`)}
        ${previewCell("協力会社", fields.checkPartnerCompany)}
        ${previewCell("報告", "チェック表の項目に不足・誤り・作業内容に変更がないことを報告します。")}
      </div>

      <div class="preview-signature">
        <div>お客様名: ${escapeHtml(fields.checkCustomerName || " ")}</div>
        <div>印</div>
      </div>
    </article>
  `;
}

function applyChecklistPayload(payload) {
  if (!payload) return;
  checklistFieldIds.forEach((id) => {
    const field = $(`#${id}`);
    if (field && payload.fields?.[id] !== undefined) field.value = payload.fields[id];
  });
  checklistOptionIds.forEach((id) => {
    const field = $(`#${id}`);
    if (field) field.checked = Boolean(payload.options?.[id]);
  });
  $all("[data-check-group='carryIn']").forEach((field) => {
    field.checked = Boolean(payload.carryIn?.[Number(field.dataset.checkIndex)]);
  });
  $all("[data-check-group='afterWork']").forEach((field) => {
    field.checked = Boolean(payload.afterWork?.[Number(field.dataset.checkIndex)]);
  });
  clearSignatureCanvas();
  if (payload.signatureDataUrl) {
    const canvas = $("#signaturePad");
    const image = new Image();
    image.onload = () => canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
    image.src = payload.signatureDataUrl;
  }
  renderChecklistPreview();
}

function getLocalChecklist(caseId) {
  try {
    const raw = localStorage.getItem(`${checklistStoragePrefix}${caseId}`);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function saveLocalChecklist(caseId, payload) {
  const updatedAt = new Date().toLocaleString("ja-JP");
  const record = { caseId, payload, updatedAt };
  localStorage.setItem(`${checklistStoragePrefix}${caseId}`, JSON.stringify(record));
  return record;
}

async function loadChecklist(caseId) {
  if (!caseId) return;
  setChecklistStatus("DB読込中", "yellow");
  try {
    const response = await fetch(`/api/delivery-checklists/${encodeURIComponent(caseId)}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    activeChecklistRecord = data;
    if (data.payload) {
      applyChecklistPayload(data.payload);
      setChecklistStatus(`読込済 ${data.updatedAt}`, "green");
    } else {
      setChecklistStatus("未保存", "yellow");
    }
  } catch (error) {
    const localRecord = getLocalChecklist(caseId);
    if (localRecord?.payload) {
      activeChecklistRecord = localRecord;
      applyChecklistPayload(localRecord.payload);
      setChecklistStatus(`端末保存済み ${localRecord.updatedAt}`, "green");
      return;
    }
    setChecklistStatus("公開プレビュー保存", "yellow");
  }
}

async function saveChecklist() {
  const caseId = $("#checklistCaseSelect")?.value;
  if (!caseId || currentRole === "viewer") return false;
  setChecklistStatus("保存中", "yellow");
  try {
    const response = await fetch(`/api/delivery-checklists/${encodeURIComponent(caseId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(readChecklistForm()),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    setChecklistStatus(`保存済 ${data.updatedAt}`, "green");
    return true;
  } catch (error) {
    const localRecord = saveLocalChecklist(caseId, readChecklistForm());
    activeChecklistRecord = localRecord;
    setChecklistStatus(`端末保存済み ${localRecord.updatedAt}`, "green");
    return true;
  }
}

function openChecklistForCase(caseId) {
  switchView("checklists");
  const select = $("#checklistCaseSelect");
  if (!select) return;
  if (![...select.options].some((option) => option.value === caseId)) renderChecklist();
  select.value = caseId;
  fillChecklistDefaults(caseId);
  loadChecklist(caseId);
  renderChecklistPreview();
}

function openReportForCase(caseId) {
  const item = cases.find((entry) => entry.id === caseId);
  if (!item) return;
  currentReportCaseId = caseId;
  setSalesSyncStatus("");
  $("#reportCaseId").value = item.id;
  $("#reportWorkType").value = [...$("#reportWorkType").options].some((option) => option.value === item.workType) ? item.workType : "配送設置";
  $("#reportDoneDate").value = /^\d{4}-\d{2}-\d{2}$/.test(item.visitDate || "") ? item.visitDate : formatDate(new Date());
  const worker = $("#reportWorker");
  if (![...worker.options].some((option) => option.value === item.worker)) {
    worker.add(new Option(item.worker || "担当未設定", item.worker || "担当未設定"));
  }
  worker.value = item.worker || "担当未設定";
  lastListView = "deliveryCases";
  renderCases();
  renderDashboard();
  renderReportQueue();
  switchView("reports");
}

function setSalesSyncStatus(message, type = "success") {
  const status = $("#salesSyncStatus");
  if (!status) return;
  if (!message) {
    status.textContent = "";
    status.className = "sync-status hidden";
    return;
  }
  status.textContent = message;
  status.className = `sync-status ${type}`;
}

function syncSalesForCase(caseId) {
  const item = cases.find((entry) => entry.id === caseId);
  if (!item || item.caseType !== "配送" || item.status !== "作業完了") {
    setSalesSyncStatus("エラーが出ました", "error");
    return false;
  }
  try {
    setDeliveryStatus(item, "連携済み", "完了報告書作成");
    renderCases();
    renderDashboard();
    renderReportQueue();
    setSalesSyncStatus("連携できました", "success");
    if (currentDetailId === item.id) renderDetail(item.id);
    return true;
  } catch (error) {
    setSalesSyncStatus("エラーが出ました", "error");
    return false;
  }
}

function showSignatureReportDialog(caseId) {
  pendingSignatureReportCaseId = caseId;
  $("#signatureReportDialog")?.classList.remove("hidden");
  $("#signatureReportYes")?.focus();
}

function hideSignatureReportDialog() {
  $("#signatureReportDialog")?.classList.add("hidden");
}

function renderAll() {
  renderDashboard();
  renderCases();
  renderConstructionCases();
  renderConfirmations();
  renderChecklist();
  renderDispatchManagement();
  renderMasterViews();
  renderReportQueue();
}

function initSignaturePad() {
  const canvas = $("#signaturePad");
  const context = canvas.getContext("2d");
  let drawing = false;

  function getPoint(event) {
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches?.[0];
    const clientX = touch ? touch.clientX : event.clientX;
    const clientY = touch ? touch.clientY : event.clientY;
    return { x: ((clientX - rect.left) / rect.width) * canvas.width, y: ((clientY - rect.top) / rect.height) * canvas.height };
  }

  function start(event) {
    if (signatureLocked || currentRole === "viewer") return;
    drawing = true;
    const point = getPoint(event);
    context.beginPath();
    context.moveTo(point.x, point.y);
    event.preventDefault();
  }

  function move(event) {
    if (!drawing) return;
    const point = getPoint(event);
    context.lineWidth = 3;
    context.lineCap = "round";
    context.strokeStyle = "#1f2937";
    context.lineTo(point.x, point.y);
    context.stroke();
    event.preventDefault();
  }

  function end() {
    drawing = false;
  }

  canvas.addEventListener("mousedown", start);
  canvas.addEventListener("mousemove", move);
  window.addEventListener("mouseup", end);
  canvas.addEventListener("touchstart", start, { passive: false });
  canvas.addEventListener("touchmove", move, { passive: false });
  window.addEventListener("touchend", end);

  $("#clearSignature").addEventListener("click", () => {
    if (signatureLocked || currentRole === "viewer") return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    renderChecklistPreview();
  });
  $("#lockSignature").addEventListener("click", async () => {
    if (currentRole === "viewer") return;
    signatureLocked = true;
    const caseId = $("#checklistCaseSelect")?.value;
    const target = cases.find((item) => item.id === caseId);
    renderChecklistPreview();
    $("#lockSignature").textContent = "保存中";
    const saved = await saveChecklist();
    if (!saved) {
      signatureLocked = false;
      $("#lockSignature").textContent = "完了";
      return;
    }
    if (target) {
      setDeliveryStatus(target, "作業完了", "チェック表サイン保存");
      $("#lockSignature").textContent = "完了済み";
      renderDashboard();
      renderCases();
      renderReportQueue();
      showSignatureReportDialog(caseId);
      return;
    }
    $("#lockSignature").textContent = "完了済み";
  });
}

document.addEventListener("submit", (event) => {
  if (event.target.id === "loginForm") {
    event.preventDefault();
    currentRole = $("#roleSelect").value;
    showApp();
  }

  if (event.target.id === "newCaseForm") {
    event.preventDefault();
    if (currentRole === "viewer") return;
    saveNewCase();
  }

  if (event.target.id === "deliveryChecklistForm") {
    event.preventDefault();
    saveChecklist();
  }
});

document.addEventListener("change", (event) => {
  if (event.target.id === "confirmTimeType") {
    toggleConfirmTimeRange();
    return;
  }

  if (event.target.id === "checklistCaseSelect") {
    fillChecklistDefaults(event.target.value);
    loadChecklist(event.target.value);
    renderChecklistPreview();
    return;
  }

  if (event.target.closest("#deliveryChecklistForm")) {
    renderChecklistPreview();
  }
});

document.addEventListener("input", (event) => {
  if (event.target.closest("#deliveryChecklistForm")) {
    renderChecklistPreview();
  }
});

document.addEventListener("click", (event) => {
  if (event.target.id === "sidebarToggle") {
    toggleSidebar();
    return;
  }

  if (event.target.id === "signatureReportYes") {
    const caseId = pendingSignatureReportCaseId;
    hideSignatureReportDialog();
    pendingSignatureReportCaseId = null;
    if (caseId) openReportForCase(caseId);
    return;
  }

  if (event.target.id === "signatureReportNo") {
    hideSignatureReportDialog();
    pendingSignatureReportCaseId = null;
    switchView("reports");
    renderReportQueue();
    return;
  }

  const viewLink = event.target.closest("[data-view-link]");
  if (viewLink) switchView(viewLink.dataset.viewLink);

  const navToggle = event.target.closest("[data-nav-toggle]");
  if (navToggle) {
    const group = navToggle.closest(".nav-group");
    group?.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(group?.classList.contains("open")));
    return;
  }

  const navItem = event.target.closest(".nav-item");
  if (navItem?.dataset.view) {
    if (navItem.dataset.deliveryTypeFilter) {
      deliveryTypeFilter = navItem.dataset.deliveryTypeFilter;
      lastListView = "deliveryCases";
      renderCases();
    } else if (navItem.dataset.view === "constructionCases") {
      lastListView = "constructionCases";
    } else if (navItem.dataset.view === "deliveryCases") {
      deliveryTypeFilter = "all";
      lastListView = "deliveryCases";
      renderCases();
    }
    switchView(navItem.dataset.view);
    return;
  }

  const openRunButton = event.target.closest("[data-open-run]");
  if (openRunButton) {
    renderVehicleRunDialog(openRunButton.dataset.openRun);
    return;
  }

  const closeRunButton = event.target.closest("[data-close-run]");
  if (closeRunButton || event.target.id === "vehicleRunDialog") {
    closeVehicleRunDialog();
    return;
  }

  const runActionButton = event.target.closest("[data-run-action]");
  if (runActionButton && currentRole !== "viewer") {
    recordRunAction(runActionButton.dataset.runId, runActionButton.dataset.runAction, runActionButton.dataset.caseId);
    return;
  }

  const checklistCaseButton = event.target.closest("[data-checklist-case]");
  if (checklistCaseButton) {
    event.stopPropagation();
    openChecklistForCase(checklistCaseButton.dataset.checklistCase);
    return;
  }

  const reportCaseButton = event.target.closest("[data-report-case]");
  if (reportCaseButton) {
    event.stopPropagation();
    openReportForCase(reportCaseButton.dataset.reportCase);
    return;
  }

  const confirmDeliveryButton = event.target.closest("[data-confirm-delivery-case]");
  if (confirmDeliveryButton && currentRole !== "viewer") {
    event.stopPropagation();
    const target = cases.find((item) => item.id === confirmDeliveryButton.dataset.confirmDeliveryCase);
    setDeliveryStatus(target, "作業確定", "案件確定");
    renderDashboard();
    renderCases();
    renderReportQueue();
    return;
  }

  const startWorkButton = event.target.closest("[data-start-work-case]");
  if (startWorkButton && currentRole !== "viewer") {
    event.stopPropagation();
    const target = cases.find((item) => item.id === startWorkButton.dataset.startWorkCase);
    setDeliveryStatus(target, "作業中", "作業開始");
    renderDashboard();
    renderCases();
    renderReportQueue();
    return;
  }

  if (event.target.id === "salesSyncButton" && currentRole !== "viewer") {
    syncSalesForCase(currentReportCaseId || $("#reportCaseId")?.value);
    return;
  }

  const confirmCaseButton = event.target.closest("[data-confirm-case]");
  if (confirmCaseButton && currentRole !== "viewer") {
    event.stopPropagation();
    activeConfirmEditId = confirmCaseButton.dataset.confirmCase;
    confirmSubmitMessage = "";
    renderConfirmations();
    return;
  }

  if (event.target.id === "cancelConfirmEdit") {
    event.stopPropagation();
    activeConfirmEditId = null;
    renderConfirmations();
    return;
  }

  if (event.target.id === "closeConfirmSubmitMessage") {
    event.stopPropagation();
    confirmSubmitMessage = "";
    renderConfirmations();
    return;
  }

  const submitConfirmButton = event.target.closest("[data-submit-confirm-case]");
  if (submitConfirmButton && currentRole !== "viewer") {
    event.stopPropagation();
    confirmDeliveryMail(submitConfirmButton.dataset.submitConfirmCase, {
      customerName: $("#confirmCustomerName")?.value,
      customerPhone: $("#confirmCustomerPhone")?.value,
      customerAddress: $("#confirmCustomerAddress")?.value,
      visitDate: $("#confirmVisitDate")?.value,
      timeType: $("#confirmTimeType")?.value,
      timeStart: $("#confirmTimeStart")?.value,
      timeEnd: $("#confirmTimeEnd")?.value,
    });
    return;
  }

  const detailButton = event.target.closest("[data-detail]");
  if (detailButton) {
    if (detailButton.dataset.sourceView) lastListView = detailButton.dataset.sourceView;
    renderDetail(detailButton.dataset.detail);
    return;
  }

  const openType = event.target.closest("[data-open-type]");
  if (openType) openTypeList(openType.dataset.openType);

  if (event.target.id === "detailBackButton") {
    switchView(lastListView);
  }

  if (event.target.id === "newCaseBackButton" || event.target.id === "cancelNewCase") {
    switchView(lastListView);
  }

  const regionButton = event.target.closest("[data-region]");
  if (regionButton) {
    activeRegion = regionButton.dataset.region;
    renderCases();
  }

  const constructionRegionButton = event.target.closest("[data-construction-region]");
  if (constructionRegionButton) {
    activeConstructionRegion = constructionRegionButton.dataset.constructionRegion;
    renderConstructionCases();
  }

  const stateButton = event.target.closest("[data-state-filter]");
  if (stateButton) {
    stateFilter = stateButton.dataset.stateFilter;
    $all("[data-state-filter]").forEach((button) => button.classList.toggle("active", button === stateButton));
    renderCases();
  }

  const constructionStateButton = event.target.closest("[data-construction-state-filter]");
  if (constructionStateButton) {
    constructionStateFilter = constructionStateButton.dataset.constructionStateFilter;
    $all("[data-construction-state-filter]").forEach((button) => button.classList.toggle("active", button === constructionStateButton));
    renderConstructionCases();
  }

  const confirmButton = event.target.closest("[data-confirm-filter]");
  if (confirmButton) {
    confirmFilter = confirmButton.dataset.confirmFilter;
    $all("[data-confirm-filter]").forEach((button) => button.classList.toggle("active", button === confirmButton));
    renderConfirmations();
  }

  const calendarButton = event.target.closest("[data-calendar-range]");
  if (calendarButton) {
    calendarRange = calendarButton.dataset.calendarRange;
    $all("[data-calendar-range]").forEach((button) => button.classList.toggle("active", button === calendarButton));
    renderScheduleCalendar();
  }

  const confirmDone = event.target.closest("[data-confirm]");
  if (confirmDone && currentRole === "admin") {
    const target = confirmations.find((item) => item.id === confirmDone.dataset.confirm);
    target.status = "confirmed";
    renderDashboard();
    renderConfirmations();
  }

  if (event.target.id === "saveDetail" && currentRole !== "viewer") {
    const target = cases.find((item) => item.id === currentDetailId);
    const isDealer = target.deliveryType === "販売店";
    target.status = $("#detailStatus").value;
    if (!isDealer) target.workType = $("#detailWorkType").value;
    target.region = $("#detailRegion").value;
    target.visitDate = $("#detailVisitDate").value;
    target.requesterName = $("#detailRequester").value;
    target.requesterPhone = $("#detailRequesterPhone").value;
    target.requesterAddress = $("#detailRequesterAddress").value;
    if (!isDealer) target.siteName = $("#detailSiteName").value;
    else target.siteName = `${$("#detailRequester").value} / ${$("#detailCustomerName").value}`;
    target.customerKana = $("#detailCustomerKana").value;
    target.customerName = $("#detailCustomerName").value;
    if (!isDealer) target.customerPhone = $("#detailCustomerPhone").value;
    target.customerAddress = $("#detailCustomerAddress").value;
    if (!isDealer) {
      target.worker = $("#detailWorker").value;
      target.product = $("#detailProduct").value;
    }
    if (target.caseType === "工事") {
      target.constructionMemo = $("#detailNote").value;
    } else if (isDealer) {
      target.dealerNote = $("#detailNote").value;
      target.product = $("#detailNote").value;
    } else {
      target.importError = $("#detailNote").value;
      target.sender = $("#detailSender").value;
      target.receivedAt = $("#detailReceivedAt").value;
      target.sourceMailId = $("#detailSourceMailId").value;
      target.sourceFileName = $("#detailSourceFileName").value;
      target.sourceMailbox = $("#detailSourceMailbox").value;
      target.companyInquiryNumber = $("#detailCompanyInquiryNumber").value;
    }
    target.history.unshift("2026-06-08 21:30 画面から更新");
    renderDashboard();
    renderCases();
    renderConstructionCases();
    renderDetail(target.id);
  }

  if (event.target.id === "applyFormatText" && currentRole !== "viewer") {
    applyFormattedText();
  }

  if (event.target.id === "newConstructionButton") {
    openNewCaseForm("construction");
  }

  if (event.target.id === "newDeliveryButton") {
    openNewCaseForm("delivery");
  }
});

$("#globalSearch").addEventListener("input", renderCases);
$("#globalSearch").addEventListener("input", renderConstructionCases);
$("#confirmSearch").addEventListener("input", renderConfirmations);
loadVehicleRunState();
initSignaturePad();
renderAll();
