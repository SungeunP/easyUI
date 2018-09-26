function QuestionList() {
  this.index = 0;

  this.addQuestion = function () {
    console.log(this.index);
    $("#questionList").datalist('appendRow',
      new Question(
        "Question" + this.index,
        "",
        "",
        false,
        {},
        this.index,
        this.index
      ))
    this.index++;
  }

}

function Question(title, question, previous, accessModifier, data, index, id) {
  this.title = title;
  this.question = question;
  this.previous = previous;
  this.accessModifier = accessModifier;
  this.data = data;
  this.index = index;
  this.id = id;
}

function EntityList() {
  this.index = 0;

  this.addEntity = function (name, value) {
    console.log(this.index);
    $("#entityList").datalist('appendRow',
      new Entity(
        name,
        value,
        this.index,
        this.index
      ))
    this.index++;
  }
}

function Entity(name, value, index, id) {
  this.name = name;
  this.value = value;
  this.index = index;
  this.id = id;
}

function EntityNameInput() {
  this.name = "";

  this.setName = function (name) {
    this.name = name;
  }
}

function EntityValueInput() {
  this.value = "";

  this.setValue = function (value) {
    this.value = value;
  }
}

function Topic() {
  this.createTopic = (TopicInfo, QuestionList, EntityList) => {
    var topic = new Object();

    // Topic Info //
    topic.topicName = TopicInfo.name;
    topic.topicPublic = TopicInfo.public;
    topic.topicDescription = TopicInfo.description;
    // Topic Info //

    // Entitiy List //
    topic.EntityList = new Array();
    for (i = 0; i < EntityList.length; i++) {
      topic.EntityList.push({
        name: EntityList[i].name,
        value: EntityList[i].value
      });
    }
    // Entitiy List //

    // Question List //
    topic.QuestionList = new Array();
    for (i = 0; i < QuestionList.length; i++) {
      topic.QuestionList.push({

      });
    }
    // Question List //


    console.log(topic);
    console.log(JSON.stringify(topic));
    return topic;
  }
}

function TopicInfo() {
  this.name = "";
  this.public = false;
  this.description = "";

  this.setName = (name) => {
    this.name = name;
  }
  this.setpublic = (public) => {
    this.public = public;
  }
  this.setdescription = (description) => {
    this.description = description;
  }
}

// ROOT 답변 리스트 
function Response() {
  this.responses = new Array();

  this.initResponse = () => {
    this.responses.push(new Answer());
  }
}

// 답변
// -> 답변은 질문이 id값
function Answer() {
  this.condition = "";
  this.layout = "default";
  this.body = new Array();

  this.addComponent = (type) => {
    var component = new Object();
    switch (type) {
      case "text":
        component = new Response_text("");
        break;
      case "button":
        component = new Response_button("", "", "");
        break;
      case "image":
        component = new Response_image("");
        break;
      case "group":
        component = new Response_group();
        break;
      default:
        console.log("'" + type + "' is undefined (text, button, image, group)");
        return true;
    }
    this.body.push(component);
  }
}

function Response_group(id) {
  this.id = 0;
  this.elementId = id;
  // default(기본), HS(수평 스크롤), HP(수평 배치), VS(수직스크롤), VP(수직배치)
  this.layout = "default";
  this.body = new Array();

  this.addComponent = (type) => {
    var component = new Object();
    switch (type) {
      case "text":
        component = new Response_text(this.id);
        break;
      case "button":
        component = new Response_button("", "", "");
        break;
      case "image":
        component = new Response_image("");
        break;
      case "group":
        component = new Response_group();
        break;
      default:
        console.log("'" + type + "' is undefined (text, button, image, group)");
        return true;
    }
    this.body.push(component);
    this.id++;
  }
}

function Response_text(id) {
  this.type = "text";
  this.elementId = id;
  this.value = "";

  this.setValue = (value) => {
    this.value = value;
  }
}

function Response_image(id) {
  this.type = "image";
  this.elementId = id;
  this.path = "";
  this.value = "";

  this.setPath = (path) => {
    this.path = path;
  }

  this.setValue = (value) => {
    this.value = value;
  }
}

function Response_button(id) {
  this.type = "button";
  this.elementId = id;
  this.name = "";
  this.resource = "";
  this.value = "";

  this.setName = (name) => {
    this.name = name;
  }
  this.setResource = (resource) => {
    this.resource = resource;
  }
  this.setValue = (value) => {
    this.value = value;
  }
}