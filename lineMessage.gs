// lineのpushメッセージ
function pushMessage(to, texts) {
  //texts配列をメッセージの形式に直す
  let messages = [];
  for (let i = 0; i < texts.length; i++) {
    messages.push({ type: "text", "text": texts[i] });
  }

  const url = "https://api.line.me/v2/bot/message/push";
  //メッセージの内容
  const message = {
    "to": to,
    "messages": messages
  };

  //メッセージに添えなければならない情報
  const options = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + channel_token
    },
    "payload": JSON.stringify(message)
  };

  return UrlFetchApp.fetch(url, options);
}

// lineのreplyメッセージ
function replyMessage(event, text) {
  const url = "https://api.line.me/v2/bot/message/reply";
  //自動返信メッセージの内容
  const message = {
    "replyToken": event.replyToken,
    "messages": [{ "type": "text", "text": text }]
  };
  //メッセージに添えなければならない情報
  const options = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + channel_token
    },
    "payload": JSON.stringify(message)
  };

  //自動返信メッセージを送信する
  return UrlFetchApp.fetch(url, options);
}

// 選択肢を表示する（登録）
function selectRegisterName(event) {
  const userId = event.source.userId;
  //登録名を配列に変換
  const rows = sheet_userlist.getLastRow() - 1;
  const last_column = sheet_userlist.getLastColumn();
  const datas = sheet_userlist.getRange(2, 1, rows, last_column).getValues();
  const nameList = [];
  for (let i = 0; i < datas.length; i++) {
    if (datas[i][0] == userId) {
      for (let j = 1; j < datas[i].length; j++) {
        if (datas[i][j] != "") {
          nameList.push(datas[i][j]);
        }
      }
    }
  }

  //選択肢の配列
  const items = [];
  for (let i = 0; i < nameList.length; i++) {
    items.push({
      "type": "action",
      "action": {
        "type": "postback",
        "label": nameList[i],
        "data": `action=signup&type=select&itemid=${i + 1}`,
        "text": "登録する"
      }
    });
  }

  //登録名の数が11以下のとき新規登録を表示する。
  if (nameList.length <= 11) {
    items.push({
      "type": "action",
      "action": {
        "type": "postback",
        "label": "[新規登録]",
        "data": `action=signup&type=select&itemid=${items.length + 1}`,
        "text": "登録する"
      }
    });
  }

  items.push(
    {
      "type": "action",
      "action": {
        "type": "postback",
        "label": "キャンセル",
        "data": "action=signup&type=no",
        "text": "キャンセル"
      }
    });

  var postData = {
    "replyToken": event.replyToken,
    "messages": [{
      "type": "text",
      "text": "下のボタンから登録先を選択。",
      "quickReply": {
        "items": items
      }
    }]
  };

  var options = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + channel_token
    },
    "payload": JSON.stringify(postData)
  };
  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", options);
}

// 登録確認メッセージ
function registerConfirm(event, id, name) {
  const QuestionMessage = {
    "type": "template",
    "altText": "名前登録の確認",
    "template": {
      "type": "confirm",
      "text": `${name} さんを登録しますか？`,
      "actions": [
        {
          "type": "postback", //新しい登録データを送るボタン
          "label": "はい",
          "data": `action=signup&type=yes&data=${name}&itemid=${id}`,
          "text": "登録する"
        },
        {
          "type": "postback",
          "label": "いいえ",
          "data": "action=signup&type=no",
          "text": "キャンセル"
        }]
    }
  };

  const QuestionMessageData = {
    "replyToken": event.replyToken,
    "messages": [QuestionMessage]
  };

  const Qoptions = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + channel_token
    },
    "payload": JSON.stringify(QuestionMessageData)
  };
  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", Qoptions);
}

// 選択肢を表示する（削除）
function selectRemoveName(event) {
  const userId = event.source.userId;
  const rows = sheet_userlist.getLastRow() - 1;
  const last_column = sheet_userlist.getLastColumn();
  const datas = sheet_userlist.getRange(2, 1, rows, last_column).getValues();
  //登録名を配列に変換
  const nameList = [];
  for (let i = 0; i < datas.length; i++) {
    if (datas[i][0] == userId) {
      for (let j = 1; j < datas[i].length; j++) {
        if (datas[i][j] != "") {
          nameList.push(datas[i][j]);
        }
      }
    }
  }

  if (nameList.length == 0) {
    replyMessage(event, "まだ名前が登録されていません。");
    return;
  }

  //選択肢の配列
  const items = [];
  for (let i = 0; i < nameList.length; i++) {
    items.push(
      {
        "type": "action",
        "action": {
          "type": "postback",
          "label": nameList[i],
          "data": `action=remove&type=select&data=${nameList[i]}&itemid=${i + 1}`,
          "text": "削除する"
        }
      });
  }

  items.push({
    "type": "action",
    "action": {
      "type": "postback",
      "label": "キャンセル",
      "data": "action=remove&type=no",
      "text": "キャンセル"
    }
  });

  //削除する名前の選択肢
  var postData = {
    "replyToken": event.replyToken,
    "messages": [{
      "type": "text",
      "text": "下のボタンから削除する名前を選択。",
      "quickReply": {
        "items": items
      }
    }
    ]
  };

  var options = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + channel_token
    },
    "payload": JSON.stringify(postData)
  };
  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", options);
}

// 削除確認メッセージ
function removeConfirm(event) {
  const id = event.postback.data.split("&")[3].replace("itemid=", "");
  const name = event.postback.data.split("&")[2].replace("data=", "");

  const QuestionMessage = {
    "type": "template",
    "altText": "登録名削除の確認",
    "template": {
      "type": "confirm",
      "text": `${name} さんを削除しますか？`,
      "actions": [
        {
          "type": "postback",
          "label": "はい",
          "data": `action=remove&type=yes&data=${name}&itemid=${id}`,
          "text": "削除する"
        },
        {
          "type": "postback",
          "label": "いいえ",
          "data": "action=remove&type=no",
          "text": "キャンセル"
        }
      ]
    }
  };

  const QuestionMessageData = {
    "replyToken": event.replyToken,
    "messages": [QuestionMessage]
  };

  const Qoptions = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + channel_token
    },
    "payload": JSON.stringify(QuestionMessageData)
  };
  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", Qoptions);
}