let url = "./questionsDataBase.json";
let questions = [];
let offset = 0;
let duration = 10;
let setDuration = duration;
let arrayDuplication = [];

let answersDiv = document.querySelector(".answers");
let answers = document.querySelectorAll(".answer");
let progress = document.querySelector(".progress");
let info = document.querySelector(".info");
let time = document.querySelector(".time");
time.innerHTML = `${Math.floor(duration / 60)}:${duration % 60}`;

function getJson(url) {
  let req = new XMLHttpRequest();

  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let jsonData = JSON.parse(this.responseText);

      questions = generateRandomQuestions(jsonData);

      appendQuestions(questions, offset);
    }
  };

  req.open("GET", url);
  req.send();
}

function generateRandomQuestions(jsonData) {
  let randomCategory;
  let categoriesArray = [];
  let randomQuestion;
  let question = {};
  let questionsArray = [];

  for (let i = 0; i < 10; i++) {
    // Generate Random Category
    randomCategory =
      jsonData.categories[
        Math.floor(Math.random() * jsonData.categories.length)
      ];

    // Generate Random Question
    randomQuestion = Math.floor(
      Math.random() * jsonData[randomCategory].length
    );
    question = Object.values(jsonData[randomCategory][randomQuestion]);

    // Check For Duplications
    if (arrayDuplication.includes(question[0]))
      while (
        questionsArray.includes(question[0]) ||
        arrayDuplication.includes(question[0])
      ) {
        randomQuestion = Math.floor(
          Math.random() * jsonData[randomCategory].length
        );
        question = Object.values(jsonData[randomCategory][randomQuestion]);
      }

    if (arrayDuplication.length == 11) {
      arrayDuplication.shifth();
    } else {
      arrayDuplication.push(question[0]);
    }

    // Push To Array
    for (let i = 0; i < 6; i++) {
      i == 0
        ? questionsArray.push(randomCategory)
        : questionsArray.push(question[i - 1]);
    }
  }
  categoriesArray = [];
  return questionsArray;
}

function appendQuestions(questions, startingIndex) {
  // Select Category
  document.querySelectorAll(".category").forEach((category) => {
    category.classList.remove("selected");
  });
  document
    .querySelector(`#${questions[startingIndex]}`)
    .classList.add("selected");
  // Clear Content
  document.querySelector(".question").innerHTML = "";
  document.querySelectorAll(".answer").forEach((div) => {
    div.innerHTML = "";
  });

  // Add Question Title
  let questionsTitle = document.createElement("h3");
  questionsTitle.innerHTML = questions[startingIndex + 1];
  document.querySelector(".question").append(questionsTitle);

  // Add Answers
  for (let i = startingIndex; i < startingIndex + 4; i++) {
    let answer = document.createElement("p");
    answer.innerHTML = Object.getOwnPropertyNames(questions[i + 2]);
    document.querySelectorAll(".answer")[i - startingIndex].append(answer);
  }

  progress.innerHTML = `${++offset}/10`;
  addAnswers(questions, startingIndex);
}

function addAnswers(questions, startingIndex) {
  document.querySelectorAll("input[type=radio]").forEach((radio, index) => {
    radio.value = Object.values(questions[startingIndex + 2 + index]);
  });
}

getJson(url);

const checkedElement = (input) => (input.checked = true);

document.querySelector("button").addEventListener("click", (e) => {
  e.preventDefault();
  if (document.querySelector("input[type=radio]:checked").value == "true") {
    document.querySelector(
      "input[type=radio]:checked+label .answer"
    ).style.backgroundColor = "#0f0c";
  } else {
    document.querySelectorAll("input").forEach((input, index) => {
      console.log(typeof input.value);
      if (input.value === "true") {
        document.querySelectorAll("input[type=radio]+label .answer")[
          index
        ].style.backgroundColor = "#0f0c";
      }
    });
    document.querySelector(
      "input[type=radio]:checked+label .answer"
    ).style.backgroundColor = "#f00c";
  }
  if (offset != 10) {
    setTimeout(() => {
      document.querySelectorAll("input[type=radio]").forEach((radio) => {
        if (radio.checked) {
          radio.checked = false;
        }
      });
      document
        .querySelectorAll("input[type=radio]+label .answer")
        .forEach((radio) => {
          radio.style.backgroundColor = "#f2f7f8";
        });
      appendQuestions(questions, offset * 6);
      duration = setDuration;
      updateTime();
      progress.innerHTML = `${offset}/10`;
      info.style.setProperty("--percent", `${offset * 10}%`);
    }, 1000);
  } else {
    setTimeout(() => {
      location.reload();
    }, 1000);
  }
});

function updateTime() {
  let minutes = Math.floor(duration / 60);
  let seconds = duration % 60;

  time.innerHTML = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  time.style.color = seconds < 4 ? "#f00c" : "#2f2f2f";
}

let timer = setInterval(() => {
  updateTime(duration--);
  if (duration == 0) {
    clearInterval(timer, 0);
    // add pop-Up when time runs out
  }
}, 1000);

// Show the Correct Answer on Confirm
