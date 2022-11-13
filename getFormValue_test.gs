// /*function getFormValue(e) {
//   //元となるデータを取得
//   const rows = sheet_userlist.getLastRow() - 1;
//   const datas = sheet_userlist.getRange(2, 1, rows, 7).getValues();
//   //連想配列に変換
//   const userData = [];

//   for (let i = 0; i < datas.length; i++) {
//     let userId = datas[i][0];
//     userData.push({ "userId": userId, "name": [] });
//     for (let j = 1; j < 7; j++) {
//       userData[i]["name"].push(datas[i][j]);
//     }
//   }
//   Logger.log(userData);

//   const last_row = sheet_form.getLastRow(); //行数
//   const last_column = sheet_form.getLastColumn(); //列数
//   const range = sheet_form.getDataRange(); //sheetから範囲指定するための準備
//   const name = e.values[1];
//   // const name = e.values[1];

//   for (let i = 0; i < datas.length; i++) {
//     userData[i]["name"].forEach(userName => {
//       if (userName == name) {
//         const userId = userData[i]["userId"];
//         let message = "";
//         for (let j = 1; j <= last_column; j++) {
//           let item = range.getCell(1, j).getValue(); //1行目
//           let value = range.getCell(last_row, j).getValue(); //最終行
//           if (item == "タイムスタンプ") {
//             value = Utilities.formatDate(value, "JST", "yyyy/MM/dd(E) HH:mm");
//           }

//           message += "■" + item + "\n" + value;
//           if (j < last_column) message += "\n";
//         }
//         push(userId, message);
//       }
//     });

//   }
// }

// function test() {
//   const last_column = sheet_userlist.getLastColumn();
//   Logger.log(last_column);
//   const name = "野中大地";
//   for (let i = 2; i <= last_column; i++) {
//     if (sheet_userlist.getRange(2, i).getValue() == name) {
//       sheet_userlist.getRange(2, i).setValue("");
//     }
//   }
// }

// /*
// var CHANNEL_ACCESS_TOKEN = "zMfYzSXDHGF4ZM4+qE4TB+XTXNoGZzl5Mk/XK8sVNO2hmu3QzdnN+CCDJFn0xWUJg82mrUJhRiiHupQYN9MG/4UWOwbmvX8Xz16kUbqV3pGI7FhwLMPzOlKXeI2myH+WBHUNgiyiyazKA5ZvyrntIgdB04t89/1O/w1cDnyilFU=";

// function doPost(e) {
//   var contents = e.postData.contents;
//   var obj = JSON.parse(contents)
//   var events = obj["events"];
//   for (var i = 0; i < events.length; i++) {
//     if (events[i].type == "message") {
//       reply_message(events[i]);
//     }
//   }
// }
// */

// function quickReply(e, name) {
//   if (e.message.type == "text") {
//     var postData = {
//       "replyToken": e.replyToken,
//       "messages": [{
//         "type": "text",
//         "text": "下のボタンから登録先を選択。",
//         "quickReply": {
//           "items": [{
//             "type": "action",
//             "action": {
//               "type": "postback",
//               "label": "生徒名1",
//               "data": "action=signup&data=" + name + "&itemid=1",
//               "text": "生徒名1"
//             }
//           },
//           {
//             "type": "action",
//             "action": {
//               "type": "postback",
//               "label": "生徒名2",
//               "data": "action=signup&data=" + name + "&itemid=2",
//               "text": "生徒名2"
//             }
//           },
//           {
//             "type": "action",
//             "action": {
//               "type": "postback",
//               "label": "生徒名3",
//               "data": "action=signup&data=" + name + "&itemid=3",
//               "text": "生徒名3"
//             }
//           },
//           {
//             "type": "action",
//             "action": {
//               "type": "postback",
//               "label": "生徒名4",
//               "data": "action=signup&data=" + name + "&itemid=4",
//               "text": "生徒名4"
//             }
//           }, {
//             "type": "action",
//             "action": {
//               "type": "postback",
//               "label": "生徒名5",
//               "data": "action=signup&data=" + name + "&itemid=5",
//               "text": "生徒名5"
//             }
//           }, {
//             "type": "action",
//             "action": {
//               "type": "postback",
//               "label": "生徒名6",
//               "data": "action=signup&data=" + name + "&itemid=6",
//               "text": "生徒名6"
//             }
//           }, {
//             "type": "action",
//             "action": {
//               "type": "message",
//               "label": "キャンセル",
//               "text": "キャンセル"
//             }
//           }
//           ]
//         }
//       }

//       ]
//     };
//   }
//   var options = {
//     "method": "post",
//     "headers": {
//       "Content-Type": "application/json",
//       "Authorization": "Bearer " + channel_token
//     },
//     "payload": JSON.stringify(postData)
//   };
//   UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", options);
// }





