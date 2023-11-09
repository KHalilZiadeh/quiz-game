let url = "./questionsDataBase.json";

let questions = [];
let lastSet = [];
let step = 0;
let score = 0;
let duration = 7;
let setDuration = duration;

let timeDiv = document.querySelector(".time");
let burger = document.querySelector(".burger");

function getQuestions(url) {
  let req = new XMLHttpRequest();

  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      questions = randomQuestions(JSON.parse(this.responseText));

      addQuestionsToPage(questions, step);
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

  return categoryQA;
}

function addQuestionsToPage(questions, step) {
  // Set Progress
  document
    .querySelector(".progress")
    .style.setProperty("--widi", `${(step + 1) * 10}%`);

  // Clear Content
  document.querySelector(".question-content").innerHTML = "";
  document.querySelectorAll(".answer-content").forEach((asn) => {
    asn.innerHTML = "";
  });

  // Clear&Set Selection
  document.querySelector(".category.selected")
    ? document.querySelector(".category.selected").classList.remove("selected")
    : document
        .querySelector(`#${questions[step * 6]}`)
        .classList.add("selected");
  document.querySelector(`#${questions[step * 6]}`).classList.add("selected");
  document.querySelector(".question-content").innerHTML = `${
    questions[step * 6 + 1]
  }`;

  // Add Answers
  document.querySelectorAll(".answer-content").forEach((ans, index) => {
    ans.innerHTML = `${Object.getOwnPropertyNames(
      questions[step * 6 + 2 + index]
    )}`;
    ans.parentElement.parentElement.style.backgroundColor = "#f0f3ff";
  });

  // Add Answers Values
  document.querySelectorAll("input[type=radio]").forEach((radio, index) => {
    radio.value = Object.values(questions[step * 6 + 2 + index]);
  });
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

function setTime(duration) {
  timeDiv.innerHTML = `${
    Math.floor(duration / 60) < 10
      ? "0" + Math.floor(duration / 60)
      : Math.floor(duration / 60)
  }:${duration % 60 < 10 ? "0" + (duration % 60) : Math.floor(duration % 60)}`;
}

clearChecked();

setTime(duration);

getQuestions(url);

document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (btn.id == "selected") {
      btn.style.backgroundColor = "red";
    } else if (btn.id == "random") {
      btn.style.backgroundColor = "red";
    } else if (btn.classList.contains("confirm-btn")) {
      location.reload();
    }
    if (document.querySelector("input[type=radio]:checked")) {
      if (btn.classList.contains("next") && step != 9) {
        checkAnswer();
        step += 1;

        setTimeout(() => {
          addQuestionsToPage(questions, step);

          duration = setDuration;
          setTime(duration);

          if (step == 9) btn.innerHTML = "النتيجة";

          blockClick();
        }, 700);
      } else if (btn.classList.contains("next") && step == 9) {
        document.querySelector(
          ".game-ended p"
        ).innerHTML = `نتيجتك هي ${score}`;
        document.querySelector(".game-ended").style.visibility = "visible";
      }
    }
  });
});

burger.addEventListener("click", (e) => {
  console.log(e.currentTarget);
  e.currentTarget.classList.toggle("clicked");
  e.currentTarget.parentElement.classList.toggle("clicked");
});

let countDown = setInterval(() => {
  updateTime(--duration);
  if (duration == 0) {
    clearInterval(countDown, 0);
    document.querySelector(
      ".game-ended p"
    ).innerHTML = `للأسف انتهى الوقت\nنتيجتك هي ${score}`;
    document.querySelector(".game-ended").style.visibility = "visible";
  }
}, 1000);

// Add Choose Mode
