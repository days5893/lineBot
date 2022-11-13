function myFunction() {
  //フォームのスプレッドシートを連想配列に変換
  const sheet_form = spreadsheet.getSheetByName('form');
  const form_rows = sheet_form.getLastRow() - 1;
  const form_column = sheet_form.getLastColumn();
  const datas = sheet_form.getRange(2, 1, form_rows, form_column).getValues();
  const submitName = "野中大地";
  const formData = [];
  //退室以外のフォームデータを連想配列に変換
  for (let i = datas.length - 1; i > 0; i--) {
    if (datas[i][1] == "退室") {
      continue;
    }
    if (datas[i][1] == submitName) {
      formData.push({ "timeStamp": datas[i][0], "name": datas[i][1], "access": datas[i][2] });
    }
  }
  Logger.log(datas);
  Logger.log(formData);
}
