function setTrigger() {
  var setTime = new Date();
  setTime.setDate(setTime.getDate() + 1);
  setTime.setHours(0);// 0時
  setTime.setMinutes(0);// 0分
  ScriptApp.newTrigger('updateForm').timeBased().at(setTime).create();
}

function delTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() == "updateForm") {
      ScriptApp.deleteTrigger(trigger);
    }
  }
}

//　登録名をフォームの選択肢に追加する
function updateForm() {
  //トリガーのセット
  delTrigger();
  setTrigger();
  // 処理
  const datas = sheet_userlist.getRange(2, 2, last_row, last_column).getValues();
  let nameList = [];
  for (let i = 0; i < datas.length; i++) {
    for (let j = 0; j < datas[i].length; j++) {
      let name = datas[i][j];
      if (name != "") {
        nameList.push(datas[i][j]);
      }
    }
  }
  nameList = [...new Set(nameList)];  //配列の重複削除

  const form = FormApp.openById("**********"); //フォームのID
  const items = form.getItems(FormApp.ItemType.LIST);
  items.forEach(item => {
    if (item.getTitle().match(/名前.*$/)) {
      const listItemQuestion = item.asListItem();
      const choices = [];
      nameList.forEach(name => {
        choices.push(listItemQuestion.createChoice(name));
      });
      listItemQuestion.setChoices(choices);
    }
  });
}