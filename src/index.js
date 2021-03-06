const playPanel = document.getElementById("playPanel");
const countPanel = document.getElementById("countPanel");
const scorePanel = document.getElementById("scorePanel");
const gameTime = 120;
let firstRun = true;
let problem = "Type Numbers";
let answer = "123";
let catCounter = 0;
let solveCount = 0;
let totalCount = 0;
let englishVoices = [];
let endAudio, errorAudio, incorrectAudio, correctAudio;
loadAudios();
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
loadConfig();

function loadConfig() {
  if (localStorage.getItem("darkMode") == 1) {
    document.documentElement.dataset.theme = "dark";
  }
}

function toggleDarkMode() {
  if (localStorage.getItem("darkMode") == 1) {
    localStorage.setItem("darkMode", 0);
    delete document.documentElement.dataset.theme;
  } else {
    localStorage.setItem("darkMode", 1);
    document.documentElement.dataset.theme = "dark";
  }
}

function playAudio(audioBuffer, volume) {
  const audioSource = audioContext.createBufferSource();
  audioSource.buffer = audioBuffer;
  if (volume) {
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(audioContext.destination);
    audioSource.connect(gainNode);
    audioSource.start();
  } else {
    audioSource.connect(audioContext.destination);
    audioSource.start();
  }
}

function unlockAudio() {
  audioContext.resume();
}

function loadAudio(url) {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => {
      return new Promise((resolve, reject) => {
        audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
          resolve(audioBuffer);
        }, (err) => {
          reject(err);
        });
      });
    });
}

function loadAudios() {
  promises = [
    loadAudio("mp3/end.mp3"),
    loadAudio("mp3/cat.mp3"),
    loadAudio("mp3/incorrect1.mp3"),
    loadAudio("mp3/correct3.mp3"),
  ];
  Promise.all(promises).then((audioBuffers) => {
    endAudio = audioBuffers[0];
    errorAudio = audioBuffers[1];
    incorrectAudio = audioBuffers[2];
    correctAudio = audioBuffers[3];
  });
}

function loadVoices() {
  // https://stackoverflow.com/questions/21513706/
  const allVoicesObtained = new Promise((resolve) => {
    let voices = speechSynthesis.getVoices();
    if (voices.length !== 0) {
      resolve(voices);
    } else {
      let supported = false;
      speechSynthesis.addEventListener("voiceschanged", () => {
        supported = true;
        voices = speechSynthesis.getVoices();
        resolve(voices);
      });
      setTimeout(() => {
        if (!supported) {
          document.getElementById("noTTS").classList.remove("d-none");
        }
      }, 1000);
    }
  });
  allVoicesObtained.then((voices) => {
    englishVoices = voices.filter((voice) => voice.lang == "en-US");
  });
}
loadVoices();

function speak(text) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.voice = englishVoices[Math.floor(Math.random() * englishVoices.length)];
  msg.lang = "en";
  speechSynthesis.speak(msg);
  return msg;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function hideAnswer() {
  document.getElementById("reply").textContent = "";
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function showAnswer() {
  const msg = speak(problem + " " + answer);
  if (!firstRun) {
    msg.onend = async () => {
      await sleep(2000);
      nextProblem();
    };
  }
  document.getElementById("reply").textContent = problem + " [ " + answer +
    " ]";
}

function nextProblem() {
  hideAnswer();
  totalCount += 1;
  const [a, x, b, c] = generateData();
  const grade = document.getElementById("gradeOption").selectedIndex;
  switch (grade) {
    case 0:
      problem = toEnglish1(x, a, b);
      break;
    case 1:
      problem = toEnglish2(x, a, b);
      break;
    case 2:
      if (getRandomInt(0, 1) == 0) {
        problem = toEnglish1(x, a, b);
      } else {
        problem = toEnglish2(x, a, b);
      }
      break;
    default:
      problem = toEnglish1(x, a, b);
      break;
  }
  answer = c.toString();
  speak(problem);
}

function catNyan() {
  playAudio(errorAudio);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

function loadCatImage(url) {
  const imgSize = 128;
  return new Promise((resolve) => {
    loadImage(url).then((originalImg) => {
      const canvas = document.createElement("canvas");
      canvas.width = imgSize;
      canvas.height = imgSize;
      canvas.style.position = "absolute";
      // drawImage() faster than putImageData()
      canvas.getContext("2d").drawImage(originalImg, 0, 0);
      resolve(canvas);
    }).catch((e) => {
      console.log(e);
    });
  });
}
loadCatImage("kohacu.webp").then((catCanvas) => {
  catsWalk(catCanvas);
});

function catWalk(freq, catCanvas) {
  const area = document.getElementById("catsWalk");
  const width = area.offsetWidth;
  const height = area.offsetHeight;
  const canvas = catCanvas.cloneNode(true);
  canvas.getContext("2d").drawImage(catCanvas, 0, 0);
  const size = 128;
  canvas.style.top = getRandomInt(0, height - size) + "px";
  canvas.style.left = width - size + "px";
  canvas.addEventListener("click", () => {
    catCounter += 1;
    speak(catCounter);
    canvas.remove();
  }, { once: true });
  area.appendChild(canvas);
  const timer = setInterval(() => {
    const x = parseInt(canvas.style.left) - 1;
    if (x > -size) {
      canvas.style.left = x + "px";
    } else {
      clearInterval(timer);
      canvas.remove();
    }
  }, freq);
}

function catsWalk(catCanvas) {
  setInterval(() => {
    if (Math.random() > 0.995) {
      catWalk(getRandomInt(5, 20), catCanvas);
    }
  }, 10);
}

let gameTimer;
function startGameTimer() {
  clearInterval(gameTimer);
  const timeNode = document.getElementById("time");
  gameTimer = setInterval(() => {
    const t = parseInt(timeNode.textContent);
    if (t > 0) {
      timeNode.textContent = t - 1;
    } else {
      clearInterval(gameTimer);
      playAudio(endAudio);
      scoring();
    }
  }, 1000);
}

let countdownTimer;
function countdown() {
  firstRun = false;
  initTime();
  solveCount = totalCount = 0;
  clearTimeout(countdownTimer);
  countPanel.classList.remove("d-none");
  playPanel.classList.add("d-none");
  scorePanel.classList.add("d-none");
  const counter = document.getElementById("counter");
  counter.textContent = 3;
  countdownTimer = setInterval(() => {
    const colors = ["skyblue", "greenyellow", "violet", "tomato"];
    if (parseInt(counter.textContent) > 1) {
      const t = parseInt(counter.textContent) - 1;
      counter.style.backgroundColor = colors[t];
      counter.textContent = t;
    } else {
      clearTimeout(countdownTimer);
      countPanel.classList.add("d-none");
      playPanel.classList.remove("d-none");
      document.getElementById("score").textContent = 0;
      nextProblem();
      startGameTimer();
    }
  }, 1000);
}

function scoring() {
  playPanel.classList.add("d-none");
  scorePanel.classList.remove("d-none");
  document.getElementById("score").textContent = solveCount;
  document.getElementById("total").textContent = totalCount;
}

function initCalc() {
  const replyObj = document.getElementById("reply");
  const scoreObj = document.getElementById("score");
  document.getElementById("be").onclick = () => {
    speak(problem);
  };
  document.getElementById("bc").onclick = () => {
    replyObj.textContent = "";
  };
  for (let i = 0; i < 10; i++) {
    const obj = document.getElementById("b" + i);
    obj.onclick = () => {
      let reply = replyObj.textContent;
      reply += obj.getAttribute("id").slice(-1);
      replyObj.textContent = reply.slice(0, 8);
      if (answer == reply) {
        solveCount += 1;
        playAudio(correctAudio);
        replyObj.textContent = "";
        scoreObj.textContent = parseInt(scoreObj.textContent) + 1;
        nextProblem();
      } else if (answer.slice(0, reply.length) != reply) {
        playAudio(incorrectAudio);
      }
    };
  }
}

function toEnglish1(type, a, b) {
  const sentences = [
    [
      "[a] plus [b] is",
      "[a] plus [b] equals",
    ],
    [
      "[a] minus [b] is",
      "[a] minus [b] equals",
      "[a] take away [b] is",
      "[a] take away [b] equals",
      "[b] from [a] is",
      "[b] from [a] equals",
    ],
    [
      "[a] times [b] is",
      "[a] times [b] equals",
      "[a] multiplied by [b] is",
      "[a] multiplied by [b] equals",
    ],
    [
      "[a] divided by [b] is",
      "[a] divided by [b] equals",
    ],
  ];
  const patterns = sentences[type];
  const pattern = patterns[getRandomInt(0, patterns.length)];
  return pattern.replace("[a]", a).replace("[b]", b);
}

function toEnglish2(type, a, b) {
  const sentences = [
    [
      "When you add [a] and [b], you get",
      "What do you get if you add [a] and [b]?",
    ],
    [
      "When we substract [a] from [b], we get",
      "When you take [a] away from [b], you get",
      "What do you get if you substract [a] and [b]?",
      "What do you get if you take [a] away from [b]?",
    ],
    [
      "When we multiply [a] by [b], we get",
      "What do you get if you multiply [a] by [b]?",
    ],
    [
      "When you divide [a] by [b], you get",
      "What do you get if you divide [a] by [b]?",
    ],
  ];
  const patterns = sentences[type];
  const pattern = patterns[getRandomInt(0, patterns.length)];
  return pattern.replace("[a]", a).replace("[b]", b);
}

function generateData() {
  const course = document.getElementById("courseOption").selectedIndex;
  const range = [8, 2, 8, 2, 9, 0, 8, 2];
  let a, b, c, x, s;
  switch (course) {
    case 0:
      s = Math.floor(Math.random() * 4);
      break;
    case 1:
      s = Math.floor(Math.random() * 1);
      break;
    case 2:
      s = Math.floor(Math.random() * 1);
      break;
    default:
      s = course - 3;
  }
  switch (s) {
    case 0:
      a = Math.floor(Math.random() * range[0] + range[1]);
      b = Math.floor(Math.random() * range[0] + range[1]);
      c = a + b;
      x = "???";
      break;
    case 1:
      b = Math.floor(Math.random() * range[2] + range[3]);
      c = Math.floor(Math.random() * range[2] + range[3]);
      a = b + c;
      x = "???";
      break;
    case 2:
      a = Math.floor(Math.random() * range[4] + range[5]);
      b = Math.floor(Math.random() * range[4] + range[5]);
      c = a * b;
      x = "??";
      break;
    case 3:
      b = Math.floor(Math.random() * range[6] + range[7]);
      c = Math.floor(Math.random() * range[6] + range[7]);
      a = b * c;
      x = "??";
      break;
    default:
      console.log("error");
  }
  const operation = "??????????";
  return [a, operation.indexOf(x), b, c];
}

function initTime() {
  document.getElementById("time").textContent = gameTime;
}

initCalc();
document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
document.getElementById("startButton").onclick = countdown;
document.getElementById("restartButton").onclick = countdown;
document.getElementById("showAnswer").onclick = showAnswer;
document.getElementById("kohacu").onclick = catNyan;
[...document.getElementsByTagName("table")].forEach((table) => {
  [...table.getElementsByTagName("tr")].forEach((tr) => {
    tr.onclick = () => {
      speak(tr.innerText);
    };
  });
});
document.addEventListener("click", unlockAudio, {
  once: true,
  useCapture: true,
});
