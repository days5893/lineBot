function getFormValue(e) {
  //元となるデータ
  const rows = sheet_userlist.getLastRow() - 1;
  const last_column = sheet_userlist.getLastColumn();
  const datas = sheet_userlist.getRange(2, 1, rows, last_column).getValues();

  //登録情報を連想配列に変換
  const userDatas = [];
  for (let i = 0; i < datas.length; i++) {
    let userId = datas[i][0];
    userDatas.push({ "userId": userId, "names": [] });
    for (let j = 1; j < datas[i].length; j++) {
      if (datas[i][j] != "") {
        userDatas[i]["names"].push(datas[i][j]);
      }
    }
  }
  const timeStamp = e.values[0];  //送信日時
  const submitName = e.values[1]; //送信した名前        
  const access = e.values[2]; //入退室
  for (userData of userDatas) {
    const userId = userData.userId;
    const userNames = userData.names;
    for (userName of userNames) {
      if (submitName == userName) {
        const formatedTime = dayjs.dayjs(timeStamp).locale("ja").format("YYYY/MM/DD(dd) HH:mm");
        const messages = [`${formatedTime}\n${submitName} さんが${access}しました。`];
        //送信するメッセージに滞在時間を追加する
        if (stayTime(e)) messages.push(stayTime(e));
        pushMessage(userId, messages);
      }
    }
  }
}

//滞在時間を返す
function stayTime(e) {
  if (e.values[2] == "入室") {
    return false;
  }
  const sheet_form = spreadsheet.getSheetByName('form');
  //フォームのスプレッドシートを連想配列に変換
  const form_rows = sheet_form.getLastRow() - 1;
  const form_column = sheet_form.getLastColumn();
  const datas = sheet_form.getRange(2, 1, form_rows, form_column).getValues();
  const formData = [];
  const submitName = e.values[1];
  //退室以外のフォームデータを連想配列に変換
  for (let i = 0; i < datas.length; i++) {
    formData.push({ "timeStamp": datas[i][0], "name": datas[i][1], "access": datas[i][2] });
  }

  for (let i = formData.length - 2; i >= 0; i--) {
    if (formData[i].name != submitName) {
      continue;
    }
    if (formData[i].access == "退室") {
      return false;
    }
    const timeStamp = e.values[0];
    const baseDate = dayjs.dayjs(formData[i].timeStamp);
    const endDate = dayjs.dayjs(timeStamp);
    //同じ日に1分以上滞在していれば滞在時間を返す
    if (baseDate.date() == endDate.date()) {
      const diff = dayjs.dayjs(endDate).diff(baseDate, "minutes");
      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;
      if (hours > 0)
        return `${hours}時間${minutes}分滞在しました。`;
      else if (minutes > 0)
        return `${minutes}分滞在しました。`;
      break;
    }
  }
  return false;
}