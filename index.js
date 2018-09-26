// QuestionList Class (싱글톤 패턴으로 구현해야함 아직 미구현)
var QL = new QuestionList();
var EL = new EntityList();
var EntityNameInput = new EntityNameInput();
var EntityValueInput = new EntityValueInput();
var TopicInfo = new TopicInfo();
var Topic = new Topic();

// refresh Questionlist
_loadQuestionList = (list) => {
  const _textField = "title";
  const _dataField = "data";
  const _title = "질문 리스트";
  $("#questionList").datalist({
    title: _title,
    data: list,
    textField: _textField,
    dataField: _dataField,
    width: 400,
    height: 500,
    // Custom TextField
    textFormatter: function (value, row) {
      console.log(value)
      console.log(row)
      return '<span>' + value + '</span>';
    },
    // Question onSelected event
    onSelect: function (index, row) {
      if (Object.keys(row.data).length == 0) { // 질문이 만들어 진 후 init 상태
        _loadResponse(row.data);
      }
    }
  })
}

// 현재 선택된 행 삭제 (questionList)
// success: false , failed(no selection): true
_deleteQuestionListCurrentRow = () => {
  var selected_row = $("#questionList").datalist('getSelected');
  if (selected_row == null) {
    alert("선택된 질문이 없습니다.")
    return true;
  }
  $("#questionList").datalist('deleteRow', selected_row.index);
  return false;
}

// refresh EntityList
_loadEntityList = (list) => {
  const _textField = "name";
  const _dataField = "data";
  $("#entityList").datalist({
    data: list,
    textField: _textField,
    dataField: _dataField,
    width: 400,
    height: 500,
    // Custom TextField
    textFormatter: function (value, row) {
      console.log(value)
      console.log(row)
      return '<span>' + value + '</span>';
    },
    // Question onSelected event
    onSelect: function (index, row) {
      console.log(index)
      console.log(row)
    }
  })
}

_loadResponse = (response) => {
  var source = document.getElementById("response-template").innerHTML;
  var template = Handlebars.compile(source);
  var context = { title: "My New Post", body: "This is my first post!" };
  var html = template(context);
  console.log(html);
  document.getElementById("QuestionResponse").innerHTML = html;
}

// 현재 선택된 행 삭제 (entityList)
// success: false , failed(no selection): true
_deleteEntityListCurrentRow = () => {
  var selected_row = $("#entityList").datalist('getSelected');
  if (selected_row == null) {
    alert("선택된 엔티티가 없습니다.")
    return true;
  }
  $("#entityList").datalist('deleteRow', selected_row.index);
  return false;
}

// 모든 Question들의 index를 정렬
_sort2All = (list) => {
  for (var i = 0; i < list.length; i++) {
    list[i].index = i;
  }
  console.log("List sorted : ", list);
  return list;
}

// 현재 인덱스보다 큰 Question들의 index를 정렬 (현재 미구현)
// -> 현재 index밑은 정렬 범위에 들어가지 않아서 속도가 더 빨라질수도 있음
_sort2BiggerThanThis = (index) => {

}

/* ========== */

_createResponseDOM_test = () => {

}

/* ========== */


/* ========== */

// Questionlist formatter
_questionListFormatter = (value, row) => {
  console.log(value);
  console.log(row);
}

// DOMContentLoaded evnet function
_DOMLoaded = () => {
  _loadQuestionList([]);

  // 선택된 행 삭제 후 질문 리스트 index 정렬 후 다시 로드
  // EasyUI에서 제공하는 deleteRow가 index값을 맞춰주기 위해 정렬하는 과정이 들어감
  $("#deleteQuestionCurrentRow").on("click", function () {
    // deleted : false , not deleted(no selection) : true 
    if (_deleteQuestionListCurrentRow()) {
      // If not deleted then no sort datalist
      return true;
    }

    // Sort and reload questionList
    _loadQuestionList(_sort2All($("#questionList").datalist('getRows')));
  });

  // Question객체 생성 후 EasyUI.datalist.appendRow
  // 생성되는 객체는 title만 temp값 accessModifier는 기본값 (false)
  $("#appendQuestionRow").on("click", function () {
    QL.addQuestion();
    // Sort and reload questionList
    _loadQuestionList(_sort2All($("#questionList").datalist('getRows')));
  });

  _loadEntityList([]);

  // 선택된 행 삭제 후 엔티티 리스트 index 정렬 후 다시 로드
  // EasyUI에서 제공하는 deleteRow가 index값을 맞춰주기 위해 정렬하는 과정이 들어감
  $("#deleteEntityCurrentRow").on("click", function () {

    // !! 삭제하기 전 사용되고있는 질문들의 리스트를 보여주고 삭제 재확인 로직 필요 !! //     

    // deleted : false , not deleted(no selection) : true 
    if (_deleteEntityListCurrentRow()) {
      // If not deleted then no sort datalist
      return true;
    }

    // Sort and reload questionList
    _loadEntityList(_sort2All($("#entityList").datalist('getRows')));
  });

  // 엔티티객체 생성 후 EasyUI.datalist.appendRow
  $("#appendEntityRow").on("click", function () {
    EL.addEntity(EntityNameInput.name, EntityValueInput.value);
    // Sort and reload questionList
    _loadEntityList(_sort2All($("#entityList").datalist('getRows')));
  });

  // EntityName Input Textbox
  $('#entityName').textbox({
    value: EntityNameInput.value,
    onChange: function (newValue, oldValue) {
      EntityNameInput.setName(newValue);
    }
  });

  // EntityValue Input Textbox
  $('#entityValue').textbox({
    value: EntityValueInput.value,
    onChange: function (newValue, oldValue) {
      EntityValueInput.setValue(newValue);
    }
  });

  // TopicName Input Textbox
  $('#TopicName').textbox({
    value: TopicInfo.name,
    onChange: function (newValue, oldValue) {
      TopicInfo.setName(newValue);
    }
  });

  $('#TopicPublic').combo({
    required: true,
    editable: false
  });

  // TopicDescription Input Textbox
  $('#TopicDescription').textbox({
    value: TopicInfo.description,
    onChange: function (newValue, oldValue) {
      TopicInfo.setDescription(newValue);
    }
  });

  // 토픽 만들기
  $("#CreateTopic").on("click", function () {
    var QuestionList = $("#questionList").datalist("getRows");
    var EntityList = $("#entityList").datalist("getRows");
    console.log(QuestionList);
    console.log(EntityList);
    Topic.createTopic(TopicInfo, QuestionList, EntityList);
  });

  // Response Text 컴포넌트 추가
  $(document).on("click",".AddTextComponent",function () {
    var source = document.getElementById("text-template").innerHTML;
    var template = Handlebars.compile(source);
    var context = {};
    var html = template(context);
    console.log(html);
    $(this).parent().parent().append(html);
  });

  // Response Button 컴포넌트 추가
  $(document).on("click",".AddButtonComponent", function () {
    var source = document.getElementById("button-template").innerHTML;
    var template = Handlebars.compile(source);
    var context = {};
    var html = template(context);
    console.log(html);
    $(this).parent().parent().append(html);
  });

  // Response Image 컴포넌트 추가
  $(document).on("click",".AddImageComponent", function () {
    var source = document.getElementById("image-template").innerHTML;
    var template = Handlebars.compile(source);
    var context = {};
    var html = template(context);
    console.log(html);
    $(this).parent().parent().append(html);
  });

  // Response Group 컴포넌트 추가
  $(document).on("click",".AddGroupComponent",function () {
    var source = document.getElementById("group-template").innerHTML;
    var template = Handlebars.compile(source);
    var context = {};
    var html = template(context);
    console.log(html);
    $(this).parent().parent().append(html);
  });
  
  // 이 컴포넌트 삭제
  $(document).on("click",".delete-obj-btn", function (){
    $(this).parent().parent().remove();
  })
}

// 진입점 (After loaded dom)
document.addEventListener("DOMContentLoaded", _DOMLoaded);
