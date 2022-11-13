// /*//固定値
// const channel_token = "zMfYzSXDHGF4ZM4+qE4TB+XTXNoGZzl5Mk/XK8sVNO2hmu3QzdnN+CCDJFn0xWUJg82mrUJhRiiHupQYN9MG/4UWOwbmvX8Xz16kUbqV3pGI7FhwLMPzOlKXeI2myH+WBHUNgiyiyazKA5ZvyrntIgdB04t89/1O/w1cDnyilFU=";
// const spreadsheet = SpreadsheetApp.openById("1hpgirjjOWjPF5e93nOX9-SyXSAJLadxRKyYIp4UyVfs");
// const sheet_userlist = spreadsheet.getSheetByName('userlist');
// const sheet_form = spreadsheet.getSheetByName('form');

// function doPost(e) {
//   //ポストで送られてきたJSONをパース
//   const events = JSON.parse(e.postData.contents).events;

//   events.forEach(event => {
//     const eventType = event.type;
//     if (eventType == "message") {
//         let name = event.message.text;
//         quickReply(event, name);
//     }

//     //友達追加時にuserIdを登録する。
//     if (eventType == "follow") {
//       const userId = event.source.userId;
//       sheet_userlist.appendRow([userId]);
//       sheet_userlist.getDataRange().removeDuplicates([1]);
//     }

//     if (eventType == "postback") {
//       const action = event.postback.data.split("&")[0].replace("action=", "");
//       //actionがyesであればユーザー登録
//       if (action == "signup") {
//         nameMessage(event);
//       }

//       if (action == "yes") {
//         register(event);
//       } else {
//         cancelRegiter(event);
//       }
//     }
//   });
// }

// //ユーザー登録をする関数
// function register(event) {
//   const userId = event.source.userId;
//   const id = event.postback.data.split("&")[2].replace("itemid=", "");
//   const name = event.postback.data.split("&")[1].replace("data=", "");
//   const column = Number(id) + 1;
//   const last_row = sheet_userlist.getLastRow();
//   const last_column = sheet_userlist.getLastColumn();

//   for (let i = 2; i <= last_row; i++) {
//     for (let j = 2; j <= last_column; j++) {
//       if (name == sheet_userlist.getRange(i, j).getValue()) {
//         reply(event, [{ type: "text", text: "その名前は既に登録済みです。" }]);
//         break;
//       }
//     }

//     if (sheet_userlist.getRange(i, 1).getValue() == userId) {
//       if (sheet_userlist.getRange(i, column).getValue() == '') {
//         reply(event, [{ type: "text", text: "生徒名" + (id - 1) + "を" + name + "に登録しました。" }]);
//       } else {
//         reply(event, [{ type: "text", text: "生徒名" + (id - 1) + "を" + name + "に再登録しました。" }]);
//       }

//       sheet_userlist.getRange(i, column).setValue(name);
//       break;
//     }
//   }
// }

// //登録をキャンセルする関数
// function cancelRegiter(event) {
//   const userId = event.source.userId;
//   const id = event.postback.data.split("&")[2].replace("itemid=", "");
//   const column = Number(id) + 1;
//   const name = event.postback.data.split("&")[1].replace("data=", "");
//   const last_row = sheet_userlist.getLastRow();

//   for (let i = 2; i <= last_row; i++) {
//     if (sheet_userlist.getRange(i, 1).getValue() == userId) {
//       //生徒名が未登録の場合
//       if (name != '') {
//         reply(event, [{ type: "text", text: "生徒名" + id + "の登録をキャンセルしました。\n■現在の生徒名\n未登録" }]);
//       } else {
//         reply(event, [{ type: "text", text: "生徒名" + id + "の登録をキャンセルしました。\n■現在の生徒名\n" + name }]);
//       }
//       sheet_userlist.getRange(i, column).setValue(name);
//       break;
//     }
//   }
// }

// //lineのpush通知
// function push(to, text) {
//   const url = "https://api.line.me/v2/bot/message/push";
//   //自動返信メッセージの内容
//   const message = {
//     "to": to,
//     "messages": [{ "type": "text", "text": text }]
//   };
//   //メッセージに添えなければならない情報
//   const options = {
//     "method": "post",
//     "headers": {
//       "Content-Type": "application/json",
//       "Authorization": "Bearer " + channel_token
//     },
//     "payload": JSON.stringify(message)
//   };

//   //自動返信メッセージを送信する
//   return UrlFetchApp.fetch(url, options);
// }

// //lineの返信
// function reply(event, messages) {
//   const url = "https://api.line.me/v2/bot/message/reply";
//   //自動返信メッセージの内容
//   const message = {
//     "replyToken": event.replyToken,
//     "messages": messages
//   };
//   //メッセージに添えなければならない情報
//   const options = {
//     "method": "post",
//     "headers": {
//       "Content-Type": "application/json",
//       "Authorization": "Bearer " + channel_token
//     },
//     "payload": JSON.stringify(message)
//   };

//   //自動返信メッセージを送信する
//   return UrlFetchApp.fetch(url, options);
// }

// //生徒名の登録メッセージ
// function nameMessage(event) {
//   const newData = event.postback.data.split("&")[1].replace("data=", "");
//   const id = event.postback.data.split("&")[2].replace("itemid=", "");
//   const column = Numbe(id) + 1;
//   const last_row = sheet_userlist.getLastRow();
//   const userId = event.source.userId;
//   let preData = "";

//   for (let i = 2; i <= last_row; i++) {
//     //既にuseridがある場合は生徒名を上書き
//     if (sheet_userlist.getRange(i, 1).getValue() == userId) {
//       if (sheet_userlist.getRange(i, column).getValue() != '') {
//         preData = sheet_userlist.getRange(i, column).getValue();
//       }
//       break;
//     }
//   }

//   const QuestionMessage = {
//     "type": "template",
//     "altText": "生徒名登録の確認",
//     "template": {
//       "type": "confirm",
//       "text": "生徒名" + id + "を" + newData + "で登録しますか？",
//       "actions": [
//         {
//           "type": "postback", //「押した」というイベントを取得できる
//           "label": "はい",
//           "data": "action=yes&" + "data=" + newData + "&itemid=" + id,
//           "text": "登録する"
//         },
//         {
//           "type": "postback", //メッセージが送られるだけ
//           "label": "いいえ",
//           "data": "action=no&" + "data=" + preData + "&itemid=" + id,
//           "text": "キャンセル"
//         }
//       ]
//     }
//   };

//   const QuestionMessageData = {
//     "replyToken": event.replyToken,
//     "messages": [QuestionMessage]
//   };

//   const Qoptions = {
//     "method": "post",
//     "headers": {
//       "Content-Type": "application/json",
//       "Authorization": "Bearer " + channel_token
//     },
//     "payload": JSON.stringify(QuestionMessageData)
//   };
//   UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", Qoptions);
// }
// */

