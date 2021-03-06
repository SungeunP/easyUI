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
    console.log("Topic.createTopic",TopicInfo);
    console.log("Topic.createTopic",QuestionList);
    console.log("Topic.createTopic",EntityList);

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
      console.log(QuestionList[i]);
      topic.QuestionList.push({
        name: QuestionList[i].question,
        previous: QuestionList[i].previous,
        accessModifier: QuestionList[i].accessModifier,
        data: QuestionList[i].data
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
  this.setPublic = (public) => {
    this.public = public;
  }
  this.setDescription = (description) => {
    this.description = description;
  }
}

