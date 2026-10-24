// さくらクエストを、Google Apps Script のウェブアプリとして出すための入り口。
// 同じプロジェクトに、HTMLファイル「index」（中身は、リポジトリの index.html をそのまま貼る）を作っておく。
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('さくらクエスト')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
