function getFormValue(e) {
  //元となるデータ
  const rows = last_row - 1;
  const datas = sheet_userlist.getRange(2, 1, rows, last_column).getValues();

  //登録情報を連想配列に変換
  const userData = [];
  for (let i = 0; i < datas.length; i++) {
    let userId = datas[i][0];
    userData.push({ "userId": userId, "names": [] });
    for (let j = 1; j < datas[i].length; j++) {
      if (datas[i][j] != "") {
        userData[i]["names"].push(datas[i][j]);
      }
    }
  }

  const timeStamp = e.values[0];  //送信日時
  const submitName = e.values[1]; //送信した名前        
  const access = e.values[2]; //入退室
  for (let i = 0; i < userData.length; i++) {
    const userId = userData[i].userId;
    const userNames = userData[i].names;

    userNames.forEach(userName => {
      if (submitName == userName) {
        const formatedTime = dayjs.dayjs(timeStamp).locale("ja").format("YYYY/MM/DD(dd) HH:mm");
        const messages = [`${formatedTime}\n${submitName} さんが${access}しました。`];
        // ｄ       
        if (access == "退室" && stayTime(e) != "") {
          messages.push(stayTime(e));
        }
        pushMessage(userId, messages);
      }
    });
  }
}

//滞在時間を返す関数
function stayTime(e) {
  //フォームのスプレッドシートを連想配列に変換
  const form_rows = sheet_form.getLastRow() - 1;
  const form_column = sheet_form.getLastColumn();
  const datas = sheet_form.getRange(2, 1, form_rows, form_column).getValues();
  const formData = [];
  for (let i = 0; i < datas.length; i++) {
    formData.push({ "timeStamp": datas[i][0], "name": datas[i][1], "access": datas[i][2] });
  }

  const timeStamp = e.values[0];  //フォームの送信日時
  const submitName = e.values[1]; //送信した名前    
  const len = formData.length;
  for (let i = len - 2; i >= 0; i--) {
    if (submitName == formData[i].name) {
      const baseDate = dayjs.dayjs(formData[i].timeStamp);  
      const endDate = dayjs.dayjs(timeStamp); 
      //同じ日に入室していたとき
      if (formData[i].access == "入室" && baseDate.date() == endDate.date()) {
        const diff = dayjs.dayjs(endDate).diff(baseDate, "minutes");  //滞在時間
        const hours = Math.floor(diff / 60);  //時間
        const minutes = diff % 60;  //分
        //1分以上滞在していれば滞在時間を返す
        if (hours > 0)
          return `滞在時間は${hours}時間${minutes}分です。`;
        else if (minutes > 0)
          return `滞在時間は${minutes}分です。`;
      }
      break;
    }
  }

  return "";
}