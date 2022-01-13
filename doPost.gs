//固定値
const channel_token = "********************"; //チャネルアクセストークン
const spreadsheet = SpreadsheetApp.openById("********************");  //スプレッドシートのID
const sheet_userlist = spreadsheet.getSheetByName('userlist');
const sheet_form = spreadsheet.getSheetByName('form');
const last_row = sheet_userlist.getLastRow();
const last_column = sheet_userlist.getLastColumn();

function doPost(e) {
  const events = JSON.parse(e.postData.contents).events;
  let cache = CacheService.getScriptCache();
  let registerId = cache.get("id");//登録先を保持するキャッシュ
  let registerState = cache.get("register"); //登録状態
  let removeState = cache.get("remove");//削除状態

  events.forEach(event => {
    const eventType = event.type;
    //友達追加時にuserIdを登録する。
    if (eventType == "follow") {
      const userId = event.source.userId;
      sheet_userlist.appendRow([userId]);
      sheet_userlist.getDataRange().removeDuplicates([1]);
    }

    //メッセージが送信されたときの処理
    if (eventType == "message") {
      if (registerState == 1 && registerId > 0) {
        const name = event.message.text.replace(/(\s|\n)+/g, ""); //空白・改行の削除       
        if (name.match(/(\d|[０-９])+/)) {
          replyMessage(event, "数字を含まない形で入力してください。");
        } else if (name.match(/^(?!.*(キャンセル|登録|削除)).*$/)) {
          registerConfirm(event, registerId, name);
        }
      }

      //メニューボタンのメッセージが送信されたときの処理
      switch (event.message.text) {
        case "新規登録":
          selectRegisterName(event);
          cache.remove("id");
          cache.remove("remove");
          cache.put("register", 1);
          break;
        case "登録情報の確認":
          checkName(event);
          cache.remove("id");
          cache.remove("register");
          cache.remove("remove");
          break;
        case "登録情報の削除":
          selectRemoveName(event);
          cache.remove("id");
          cache.remove("register");
          cache.put("remove", 1);
          break;
      }
    }

    //ボタンが押されたときの処理
    if (eventType == "postback") {
      const action = event.postback.data.split("&")[0].replace("action=", "");
      const type = event.postback.data.split("&")[1].replace("type=", "");
      if (action == "signup" && registerState == 1) {
        switch (type) {
          case "select":
            const itemId = event.postback.data.split("&")[2].replace("itemid=", "");
            replyMessage(event, "名前を入力してください。");
            cache.put("id", itemId);
            break;
          case "yes":
            register(event);
            cache.remove("id");
            cache.remove("register");
            break;
          case "no":
            replyMessage(event, "名前の登録をキャンセルしました。")
            cache.remove("id");
            cache.remove("register");
            break;
        }
      }

      if (action == "remove" && removeState == 1) {
        switch (type) {
          case "select":
            removeConfirm(event);
            break;
          case "yes":
            remove(event);
            cache.remove("remove");
            break;
          case "no":
            replyMessage(event, "名前の削除をキャンセルしました。");
            cache.remove("remove");
            break;
        }
      }
    }
  });
}

//登録名一覧を表示する
function checkName(event) {
  const userId = event.source.userId;
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

      if (message != "") {
        message += "が登録されています。";
        replyMessage(event, message);
      } else {
        replyMessage(event, "まだ名前が登録されていません。");
        return;
      }
    }
  }
}

//名前を登録をする
function register(event) {
  const userId = event.source.userId;
  const itemId = event.postback.data.split("&")[3].replace("itemid=", "");
  const name = event.postback.data.split("&")[2].replace("data=", "");
  const datas = sheet_userlist.getRange(1, 1, last_row, last_column).getValues();

  for (let i = 1; i < datas.length; i++) {
    if (datas[i][0] == userId) {
      //名前の重複があれば終了
      for (let j = 1; j < datas[i].length; j++) {
        if (datas[i][j] == name) {
          replyMessage(event, "その名前は既に登録されています。");
          return;
        }
      }

      if (datas[i][itemId] == '') {
        replyMessage(event, `${name} さんを登録しました。`);
      } else {
        replyMessage(event, `${name} さんに再登録しました。`);
      }

      const rows = i + 1; //登録する行
      const column = Number(itemId) + 1;  //登録する列
      sheet_userlist.getRange(rows, column).setValue(name);
    }
  }
}

//登録名を削除する
function remove(event) {
  const userId = event.source.userId;
  const datas = sheet_userlist.getRange(1, 1, last_row, last_column).getValues();
  const itemId = event.postback.data.split("&")[3].replace("itemid=", "");

  for (let i = 1; i < datas.length; i++) {
    if (datas[i][0] == userId) {
      const rows = i + 1;
      const column = Number(itemId) + 1;
      const delRange = sheet_userlist.getRange(rows, column);
      delRange.deleteCells(SpreadsheetApp.Dimension.COLUMNS);
      replyMessage(event, "削除しました。");
    }
  }
}