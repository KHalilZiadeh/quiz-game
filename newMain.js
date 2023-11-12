let url = "./questionsDataBase.json";

let jsonData;
let questions = [];
let lastSet = [];
let score = 0;
let duration = 15;
let setDuration = duration;
let countDown;
let mode = "random";
let = firstPass = true;

let timeDiv = document.querySelector(".time");
let burgerParent = document.body.querySelector("header");
let categories = document.querySelectorAll(".category");

function getQuestions(url) {
  let req = new XMLHttpRequest();

  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      jsonData = JSON.parse(this.responseText);
      questions = randomQuestions(JSON.parse(this.responseText));

      addQuestionsToPage(questions);
    }
  };

  req.open("GET", url);
  req.send();
}

function randomQuestions(jsonFile) {
  let category;
  let categoryA = [];
  let categoryQ;
  let categoryQA = [];

  switch (mode) {
    case "random":
      for (let i = 0; i < 10; i++) {
        category = Math.floor(Math.random() * jsonFile.categories.length);
        categoryA.push(jsonFile.categories[category]);
      }

      categoryA.forEach((cat) => {
        categoryQ = Math.floor(Math.random() * jsonFile[cat].length);

        while (
          categoryQA.includes(Object.values(jsonFile[cat][categoryQ])[0]) ||
          lastSet.includes(Object.values(jsonFile[cat][categoryQ])[0])
        ) {
          categoryQ = Math.floor(Math.random() * jsonFile[cat].length);
        }

        categoryQA.push(cat);
        for (let value of Object.values(jsonFile[cat][categoryQ])) {
          categoryQA.push(value);
        }
      });
      lastSet = categoryQA;
      break;

    case "selected":
      category = document.querySelector(".category.selected").id;
      categoryQA.push(category);

      console.log(category);
      console.log(jsonFile[category].length);
      for (let i = 0; i < jsonFile[category].length; i++) {
        categoryQ = Math.floor(Math.random() * jsonFile[category].length);

        while (categoryQA.includes(jsonFile[category][categoryQ])[0]) {
          categoryQ = Math.floor(Math.random() * jsonFile[category].length);
        }

        for (let value of Object.values(jsonFile[category][categoryQ])) {
          categoryQA.push(value);
        }
      }
      break;
    default:
      break;
  }
  return categoryQA;
}

function addQuestionsToPage(questions) {
  // Clear&Set Selection
  switch (mode) {
    case "random":
      document.querySelector(".category.selected")
        ? document
            .querySelector(".category.selected")
            .classList.remove("selected")
        : document.querySelector(`#${questions[0]}`).classList.add("selected");
      document.querySelector(`#${questions[0]}`).classList.add("selected");
      questions.shift();
      break;

    case "selected":
      if (firstPass) {
        document
          .querySelector(".category.selected")
          .classList.remove("selected");
        document.querySelector("#messanger").classList.add("selected");
        questions.shift();
        firstPass = false;
      } else if (questions.length % 5 != 0) {
        questions.shift();
      }
      break;
    default:
      break;
  }

  // Clear Content
  document.querySelector(".question-content").innerHTML = "";
  document.querySelectorAll(".answer-content").forEach((ans) => {
    ans.innerHTML = "";
  });

  // Add Question
  document.querySelector(".question-content").innerHTML = `${questions[0]}`;
  questions.shift();

  // Add Answers
  document.querySelectorAll(".answer").forEach((ans) => {
    ans.querySelector("input[type=radio]").value = Object.values(questions[0]);
    ans.querySelector(
      ".answer-content"
    ).innerHTML = `${Object.getOwnPropertyNames(questions[0])}`;
    questions.shift();

    ans.style.backgroundColor = "#f0f3ff";
  });

  // Set Progress
  switch (mode) {
    case "random":
      document
        .querySelector(".progress")
        .style.setProperty("--widi", `${(1 - questions.length / 60) * 100}%`);
      break;

    case "selected":
      document
        .querySelector(".progress")
        .style.setProperty(
          "--widi",
          `${
            (1 -
              questions.length /
                (jsonData[document.querySelector(".category.selected").id]
                  .length *
                  5)) *
            100
          }%`
        );
    default:
      break;
  }
}

function checkAnswer() {
  blockClick();
  document.querySelectorAll("input[type=radio]").forEach((radio) => {
    if (radio.checked && radio.value == "true") {
      score += 1;
    }
    if (radio.value == "true") {
      radio.parentElement.style.backgroundColor = "#0f0c";
    } else if (radio.checked) {
      radio.parentElement.style.backgroundColor = "#f00c";
    }
  });
  clearChecked();
}

// Clear Checked
function clearChecked() {
  document.querySelectorAll("input[type=radio]").forEach((radio) => {
    radio.checked = false;
  });
}

function blockClick() {
  document.querySelectorAll("label").forEach((label) => {
    label.classList.toggle("no-click");
  });
}

function updateTime(duration) {
  let minutes = Math.floor(duration / 60);
  let seconds = duration % 60;

  timeDiv.innerHTML = `${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;

  timeDiv.style.color = duration < 4 ? "#f00c" : "#2f2f2f";
}

function updateTimeDiv() {
  updateTime(--duration);
  if (duration == 0) {
    clearInterval(countDown, 0);
    document.querySelector(
      ".game-ended p"
    ).innerHTML = `للأسف انتهى الوقت\nنتيجتك هي ${score}`;
    document.querySelector(".game-ended").style.visibility = "visible";
  }
}

function setTime(duration) {
  timeDiv.innerHTML = `${
    Math.floor(duration / 60) < 10
      ? "0" + Math.floor(duration / 60)
      : Math.floor(duration / 60)
  }:${duration % 60 < 10 ? "0" + (duration % 60) : Math.floor(duration % 60)}`;
}

function toggleClicked(e) {
  e.currentTarget.lastElementChild.classList.toggle("clicked");
  e.currentTarget.classList.toggle("clicked");
}

clearChecked();

if (mode == "random") setTime(duration);

getQuestions(url);

document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (btn.id == "selected" && mode != "selected") {
      mode = "selected";
      clearInterval(countDown);
      timeDiv.innerHTML = "";
      document.querySelector(".category.selected").classList.remove("selected");
      document.querySelector(".category").classList.add("selected");
      addQuestionsToPage((questions = randomQuestions(jsonData)));
      categories.forEach((cat) => {
        cat.addEventListener("click", (e) => {
          categories.forEach((cat) => {
            if (!e.target.classList.contains("selected")) {
              document
                .querySelector(".category.selected")
                .classList.remove("selected");
              e.target.classList.add("selected");
              addQuestionsToPage((questions = randomQuestions(jsonData)));
            }
          });
        });
      });
    } else if (btn.id == "random" && mode != "random") {
      mode = "random";
      addQuestionsToPage((questions = randomQuestions(jsonData)));
      setTime((duration = setDuration));
      countDown = setInterval(updateTimeDiv, 1000);
    } else if (btn.classList.contains("confirm-btn")) {
      location.reload();
    } else if (document.querySelector("input[type=radio]:checked")) {
      checkAnswer();

      setTimeout(() => {
        if (questions.length != 0) {
          console.log(questions);
          addQuestionsToPage(questions);

          if (mode == "random") {
            countDown = clearInterval(countDown);
            timeDiv.style.color = "#2f2f2f";
            countDown = setInterval(updateTimeDiv, 1000);
            setTime((duration = setDuration));

            if (duration == 0) {
              clearInterval(countDown);
            }
            if (questions.length == 0) btn.innerHTML = "النتيجة";
          }
        } else {
          switch (mode) {
            case "random":
              if (questions.length == 0) {
                clearInterval(countDown);
                document.querySelector(
                  ".game-ended p"
                ).innerHTML = `نتيجتك هي ${score}`;
                document.querySelector(".game-ended").style.visibility =
                  "visible";
              }
              break;

            default:
              if (questions.length == 0) {
                // Add Result
                console.log("yes");
              }
          }
        }

        blockClick();
      }, 700);
    }
  });
});

burgerParent.addEventListener("click", (e) => {
  toggleClicked(e);
});

if (mode == "random") {
  countDown = setInterval(updateTimeDiv, 1000);
}
// Add Choose Mode
