//固定値
const channel_token = "**********"; //Lineのアクセストークン
const spreadsheet = SpreadsheetApp.openById("**********"); //スプレッドシートのID
const sheet_userlist = spreadsheet.getSheetByName('userlist');

function doPost(e) {
  const events = JSON.parse(e.postData.contents).events;
  const cache = CacheService.getScriptCache();
  const registerId = cache.get("registerId");//登録先を保持するキャッシュ
  const registerState = cache.get("registerState");//登録状態
  const removeState = cache.get("removeState");//削除状態

  events.forEach(event => {
    const eventType = event.type;
    Logger.log(eventType)
    //友達追加時にuserIdを登録する。
    if (eventType == "follow") {
      const userId = event.source.userId;
      sheet_userlist.appendRow([userId]);
      sheet_userlist.getDataRange().removeDuplicates([1]);
    }

    //メッセージが送信されたときの処理
    if (eventType == "message") {
      if (registerState && registerId) {
        //空白・改行の削除       
        const name = event.message.text.replace(/(\s|\n)+/g, "");
        if (name.match(/(\d|[０-９])+/)) {
          replyMessage(event, "数字を含まない形で入力してください。");
        } else {
          registerConfirm(event, registerId, name);
        }
        cache.remove("registerId");
        return;
      }

      //メニューボタンのメッセージが送信されたときの処理
      switch (event.message.text) {
        case "新規登録":
          selectRegisterName(event);
          cache.remove("registerId");
          cache.remove("removeState");
          cache.put("registerState", 1);
          break;
        case "登録情報の確認":
          checkName(event);
          cache.remove("registerId");
          cache.remove("registerId");
          cache.remove("removeState");
          break;
        case "登録情報の削除":
          selectRemoveName(event);
          cache.remove("registerId");
          cache.remove("registerId");
          cache.put("removeState",1);
          break;
      }
      return;
    }

    //ボタンが押されたときの処理
    if (eventType == "postback") {
      const action = event.postback.data.split("&")[0].replace("action=", "");
      const type = event.postback.data.split("&")[1].replace("type=", "");

      if (action == "signup" && registerState) {
        switch (type) {
          case "select":
            const itemId = event.postback.data.split("&")[2].replace("itemid=", "");
            replyMessage(event, "名前を入力してください。");
            cache.put("registerId",itemId);
            break;
          case "yes":
            register(event);
            cache.remove("registerId");
            cache.remove("registerState");
            break;
          case "no":
            replyMessage(event, "名前の登録をキャンセルしました。")
            cache.remove("registerId");
            cache.remove("registerState");
            break;
        }
      }

      if (action == "remove" && removeState) {
        switch (type) {
          case "select":
            removeConfirm(event);
            break;
          case "yes":
            remove(event);
            cache.remove("removeState");
            break;
          case "no":
            replyMessage(event, "名前の削除をキャンセルしました。");
            cache.remove("removeState");
            break;
        }
      }
      return;
    }
  });
}

//登録名一覧を表示する
function checkName(event) {
  const userId = event.source.userId;
  const last_row = sheet_userlist.getLastRow();
  const last_column = sheet_userlist.getLastColumn();
  const datas = sheet_userlist.getRange(2, 1, last_row, last_column).getValues();
  for (let i = 0; i < datas.length; i++) {
    if (userId == datas[i][0]) {
      let message = "";
      for (let j = 1; j < datas[i].length; j++) {
        let name = datas[i][j];
        if (name != "") {
          message += `・${name} さん\n`;
        }
      }

      if (message == "") {
        replyMessage(event, "まだ名前が登録されていません。");
      } else {
        replyMessage(event, message + "が登録されています。");
      }
      return;
    }
  }
}

//名前を登録をする
function register(event) {
  const userId = event.source.userId;
  const itemId = event.postback.data.split("&")[3].replace("itemid=", "");
  const name = event.postback.data.split("&")[2].replace("data=", "");
  const last_row = sheet_userlist.getLastRow();
  const last_column = sheet_userlist.getLastColumn();
  const datas = sheet_userlist.getRange(1, 1, last_row, last_column).getValues();

  for (let i = 1; i < datas.length; i++) {
    if (datas[i][0] == userId) {
      //名前の重複があれば終了
      for (let j = 1; j < datas[i].length; j++) {
        if (datas[i][j] == name) {
          replyMessage(event, `${name}さんは既に登録されています。`);
          return;
        }
      }

      //登録メッセージ
      if (datas[i][itemId] == '') {
        replyMessage(event, `${name} さんを登録しました。`);
      } else {
        replyMessage(event, `${name} さんに再登録しました。`);
      }

      const rows = i + 1;
      const column = Number(itemId) + 1;
      sheet_userlist.getRange(rows, column).setValue(name);
      return;
    }
  }
}

//登録名を削除する
function remove(event) {
  const userId = event.source.userId;
  const last_row = sheet_userlist.getLastRow();
  const last_column = sheet_userlist.getLastColumn();
  const datas = sheet_userlist.getRange(1, 1, last_row, last_column).getValues();
  const itemId = event.postback.data.split("&")[3].replace("itemid=", "");
  for (let i = 1; i < datas.length; i++) {
    if (datas[i][0] == userId) {
      const rows = i + 1;
      const column = Number(itemId) + 1;
      const delRange = sheet_userlist.getRange(rows, column);
      delRange.deleteCells(SpreadsheetApp.Dimension.COLUMNS);
      replyMessage(event, "削除しました。");
      return;
    }
  }
}
