// QuestionList Class (싱글톤 패턴으로 구현해야함 아직 미구현)
var QL = new QuestionList();
var EL = new EntityList();
var EntityNameInput = new EntityNameInput();
var EntityValueInput = new EntityValueInput();
var TopicInfo = new TopicInfo();
var Topic = new Topic();

// refresh Questionlist
_loadQuestionList = (list,selectIndex) => {
  const _textField = "title";
  const _dataField = "data";
  const _title = "질문 리스트";
  console.log(list);
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
    // 질문 선택 전처리
    onBeforeSelect: function (index,row) {
      console.log("EasyUI.datalist.onBeforeSelect");
      console.log($("#questionList").datalist("getRows"));
      var before_rows = $("#questionList").datalist("getRows");
      // 이전에 선택되어있던 질문
      var beforeQuestion = $(this).datalist("getSelected");
      if (beforeQuestion != null) { // !init (맨 처음 이외)
        console.log("EasyUI.datalist.onBeforeSelect not NULL");
        before_rows[index].data = _parsingResponseDOM($("#QuestionResponse"));
        // 변경한 row.data 갱신
        $("#questionList").datalist({
          data : before_rows
        })
      }
      console.log();
    },
    // Question onSelected event
    onSelect: function (index, row) {
      // Note : 전처리기에서 한 번 파싱해서 저장하기때문에 그냥 _loadResponse하면 됨
      // 09-27 10:00 Note : 선택해놓고 addQuestion하면 ResponseView가 초기화되는데 이는 아직 BeofreSelect에서
      // json파싱 후 data에 저장을 안해줘서 그냥 빈 오브젝트({}) 가 넘어가 초기화되는것
      // addQuestion에서 임의select => beforeSelectEvent (저장 미구현) => selectEvent에서 그냥 빈 데이터 load
      _loadResponse(row.data);
    },
    getSelected: function () {
      console.log("first selected====");
    }
  })
  // 이전에 선택됐던 Question이 있을 시 선택 유지
  if (selectIndex != null) {
    $("#questionList").datalist("selectRow",selectIndex);
  }
}

// 받은 DOM을 json으로 파싱
_parsingResponseDOM = (rootElem) => {
  var response_arr = new Array();
  var Response_DOM = rootElem.children(".response");
  
  var response_json = null;
  for (i = 0 ; i < Response_DOM.length ; i++) {
    var responseDOM = Response_DOM[i];
    response_json = new Object();
    var body = null;
    var obj_area = $(responseDOM).children(".obj-area");

    // 레이아웃 옵션 Selector
    var e = $(responseDOM).children(".layoutOptions");
    var layout_option = e[0].options[e[0].selectedIndex].value;
    // 레이아웃 옵션 put
    console.log(layout_option);
    response_json.layout = layout_option;
    
    // 조건문 put
    response_json.condition = $(responseDOM).children(".condition").val();
    console.log($(obj_area));
    response_json.body = _parsingResponseDOM_sub($(obj_area));
  }

  return JSON.stringify(response_json); // stringify?
}

// obj-area 파싱 함수 (재귀)
_parsingResponseDOM_sub = (subDOM) => {
  var components = $(subDOM).children(".obj");
  console.log($(components)[0]);
  var body_arr = new Array();

  for (i= 0 ; i < $(components).length ; i++) {
    var component = $(components)[i];
    var className = $(component).attr("class").split(' ')[1];
    switch(className){
      case "obj-text":
      // console.log("obj-text");
      console.log("obj-text:" + $(components).children(".obj_text_message").val());
      var temp =  $(components).children("p");
      temp =  $(temp).children(".obj_text_message");
      console.log();
      body_arr.push({
        "type" : "text",
        "value" :$(temp).val()
      });
      break;
      case "obj-image":
      console.log("obj-image"); 
      body_arr.push({
        "type": "image",
        "path": "/test.jpg",
        "value": "<넘길 값:str>"
      });
      break;
      case "obj-button":
      console.log("obj-button");
      body_arr.push({
        "type": "button",
        "name": "buttonName",
        "resource": "?",
        "value": "value"
      });
      break;
      case "obj-group":
      console.log("obj-group");
      body_arr.push({});
      break;
      default:

    }
  }
}

// JSON을 DOM으로 파싱
_parsingResponseJSON = (json) => {

}

// JSON을 DOM으로 파싱 (재귀)
_parsingResponseJSON_sub = (json_sub) => {

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

_loadQuestionView = () => {

}

_loadResponse = (response) => {
  var source = document.getElementById("response-template").innerHTML;
  var template = Handlebars.compile(source);
  var context = { title: "My New Post", body: "This is my first post!" };
  var html = template(context);
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
  _loadQuestionList([],null);

  // 선택된 행 삭제 후 질문 리스트 index 정렬 후 다시 로드
  // EasyUI에서 제공하는 deleteRow가 index값을 맞춰주기 위해 정렬하는 과정이 들어감
  $("#deleteQuestionCurrentRow").on("click", function () {
    // deleted : false , not deleted(no selection) : true 
    if (_deleteQuestionListCurrentRow()) {
      // If not deleted then no sort datalist
      return true;
    }
    
    // Response Div empty
    $("#QuestionResponse").empty();
    
    // Sort and reload questionList
    _loadQuestionList(_sort2All($("#questionList").datalist('getRows')),null);
  });
  
  // 선택된 행 삭제 후 질문 리스트 index 정렬 후 다시 로드
  // EasyUI에서 제공하는 deleteRow가 index값을 맞춰주기 위해 정렬하는 과정이 들어감
  $("#deleteQuestionCurrentRow").on("click", function () {
    // deleted : false , not deleted(no selection) : true 
    if (_deleteQuestionListCurrentRow()) {
      // If not deleted then no sort datalist
      return true;
    }
    
    // Response Div empty
    $("#QuestionResponse").empty();
    
    // Sort and reload questionList
    _loadQuestionList(_sort2All($("#questionList").datalist('getRows')),null);
  });

  // Question객체 생성 후 EasyUI.datalist.appendRow
  // 생성되는 객체는 title만 temp값 accessModifier는 기본값 (false)
  $("#appendQuestionRow").on("click", function () {
    var selected_row = $("#questionList").datalist('getSelected');
    // 추가될 때 이전에 선택되있는 row가 있으면
    // -> 추가할때 questionList를 refresh하는데 그러면 selection도 없어짐
    if (selected_row != null) {
      selected_row = selected_row.index;
    }
    console.log(selected_row);
    QL.addQuestion();
    // Sort and reload questionList
    _loadQuestionList(_sort2All($("#questionList").datalist('getRows')),selected_row);
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

  // 이 리스폰스 삭제
  $(document).on("click",".delete-response-btn", function() {
    $(this).parent().remove();
  })

  $("#AddResponse").on("click", function() {
    var source = document.getElementById("response-template").innerHTML;
    var template = Handlebars.compile(source);
    var context = {};
    var html = template(context);
    console.log(html);
    $(this).siblings("#QuestionResponse").append(html);
  })
}

// 진입점 (After loaded dom)
document.addEventListener("DOMContentLoaded", _DOMLoaded);
