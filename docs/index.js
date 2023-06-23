const playPanel=document.getElementById("playPanel"),infoPanel=document.getElementById("infoPanel"),countPanel=document.getElementById("countPanel"),scorePanel=document.getElementById("scorePanel"),gameTime=120;let gameTimer,firstRun=!0,problem="Type Numbers",answer="123",catCounter=0,solveCount=0,totalCount=0,englishVoices=[];const audioContext=new AudioContext,audioBufferCache={};loadAudio("end","mp3/end.mp3"),loadAudio("error","mp3/cat.mp3"),loadAudio("correct","mp3/correct3.mp3"),loadAudio("incorrect","mp3/incorrect1.mp3"),loadConfig();function loadConfig(){localStorage.getItem("darkMode")==1&&(document.documentElement.dataset.theme="dark")}function toggleDarkMode(){localStorage.getItem("darkMode")==1?(localStorage.setItem("darkMode",0),delete document.documentElement.dataset.theme):(localStorage.setItem("darkMode",1),document.documentElement.dataset.theme="dark")}async function playAudio(b,c){const d=await loadAudio(b,audioBufferCache[b]),a=audioContext.createBufferSource();if(a.buffer=d,c){const b=audioContext.createGain();b.gain.value=c,b.connect(audioContext.destination),a.connect(b),a.start()}else a.connect(audioContext.destination),a.start()}async function loadAudio(a,c){if(audioBufferCache[a])return audioBufferCache[a];const d=await fetch(c),e=await d.arrayBuffer(),b=await audioContext.decodeAudioData(e);return audioBufferCache[a]=b,b}function unlockAudio(){audioContext.resume()}function loadVoices(){const a=new Promise(b=>{let a=speechSynthesis.getVoices();if(a.length!==0)b(a);else{let c=!1;speechSynthesis.addEventListener("voiceschanged",()=>{c=!0,a=speechSynthesis.getVoices(),b(a)}),setTimeout(()=>{c||document.getElementById("noTTS").classList.remove("d-none")},1e3)}}),b=["com.apple.speech.synthesis.voice.Bahh","com.apple.speech.synthesis.voice.Albert","com.apple.speech.synthesis.voice.Hysterical","com.apple.speech.synthesis.voice.Organ","com.apple.speech.synthesis.voice.Cellos","com.apple.speech.synthesis.voice.Zarvox","com.apple.speech.synthesis.voice.Bells","com.apple.speech.synthesis.voice.Trinoids","com.apple.speech.synthesis.voice.Boing","com.apple.speech.synthesis.voice.Whisper","com.apple.speech.synthesis.voice.Deranged","com.apple.speech.synthesis.voice.GoodNews","com.apple.speech.synthesis.voice.BadNews","com.apple.speech.synthesis.voice.Bubbles"];a.then(a=>{englishVoices=a.filter(a=>a.lang=="en-US").filter(a=>!b.includes(a.voiceURI))})}loadVoices();function speak(b){speechSynthesis.cancel();const a=new SpeechSynthesisUtterance(b);return a.voice=englishVoices[Math.floor(Math.random()*englishVoices.length)],a.lang="en",speechSynthesis.speak(a),a}function getRandomInt(a,b){return a=Math.ceil(a),b=Math.floor(b),Math.floor(Math.random()*(b-a)+a)}function hideAnswer(){document.getElementById("reply").textContent=""}function showAnswer(){const a=speak(problem+" "+answer);firstRun||(a.onend=()=>{setTimeout(nextProblem,2e3)}),document.getElementById("reply").textContent=problem+" [ "+answer+" ]"}function nextProblem(){hideAnswer(),totalCount+=1;const[a,b,c,d]=generateData(),e=document.getElementById("gradeOption").selectedIndex;switch(e){case 0:problem=toEnglish1(b,a,c);break;case 1:problem=toEnglish2(b,a,c);break;case 2:getRandomInt(0,1)==0?problem=toEnglish1(b,a,c):problem=toEnglish2(b,a,c);break;default:problem=toEnglish1(b,a,c);break}answer=d.toString(),speak(problem)}function catNyan(){playAudio("error")}function loadImage(a){return new Promise((c,d)=>{const b=new Image;b.onload=()=>c(b),b.onerror=a=>d(a),b.src=a})}function loadCatImage(b){const a=128;return new Promise(c=>{loadImage(b).then(d=>{const b=document.createElement("canvas");b.setAttribute("role","button"),b.width=a,b.height=a,b.style.position="absolute",b.getContext("2d").drawImage(d,0,0),c(b)}).catch(a=>{console.log(a)})})}loadCatImage("kohacu.webp").then(a=>{catsWalk(a)});function catWalk(g,d){const c=document.getElementById("catsWalk"),e=c.offsetWidth,f=c.offsetHeight,a=d.cloneNode(!0);a.getContext("2d").drawImage(d,0,0);const b=128;a.style.top=getRandomInt(0,f-b)+"px",a.style.left=e-b+"px",a.addEventListener("click",()=>{catCounter+=1,speak(catCounter),a.remove()},{once:!0}),c.appendChild(a);const h=setInterval(()=>{const c=parseInt(a.style.left)-1;c>-b?a.style.left=c+"px":(clearInterval(h),a.remove())},g)}function catsWalk(a){setInterval(()=>{Math.random()>.995&&catWalk(getRandomInt(5,20),a)},10)}function countdown(){firstRun=!1,solveCount=totalCount=0,countPanel.classList.remove("d-none"),infoPanel.classList.add("d-none"),playPanel.classList.add("d-none"),scorePanel.classList.add("d-none");const a=document.getElementById("counter");a.textContent=3;const b=setInterval(()=>{const c=["skyblue","greenyellow","violet","tomato"];if(parseInt(a.textContent)>1){const b=parseInt(a.textContent)-1;a.style.backgroundColor=c[b],a.textContent=b}else clearTimeout(b),countPanel.classList.add("d-none"),infoPanel.classList.remove("d-none"),playPanel.classList.remove("d-none"),nextProblem(),startGameTimer()},1e3)}function startGame(){clearInterval(gameTimer),initTime(),countdown()}function startGameTimer(){clearInterval(gameTimer);const a=document.getElementById("time");gameTimer=setInterval(()=>{const b=parseInt(a.textContent);b>0?a.textContent=b-1:(clearInterval(gameTimer),playAudio("end"),scoring())},1e3)}function initTime(){document.getElementById("time").textContent=gameTime}function scoring(){playPanel.classList.add("d-none"),scorePanel.classList.remove("d-none"),document.getElementById("score").textContent=solveCount,document.getElementById("total").textContent=totalCount}function initCalc(){const a=document.getElementById("reply"),b=document.getElementById("score");document.getElementById("be").onclick=()=>{speak(problem)},document.getElementById("bc").onclick=()=>{a.textContent=""};for(let c=0;c<10;c++){const d=document.getElementById("b"+c);d.onclick=()=>{let c=a.textContent;c+=d.getAttribute("id").slice(-1),a.textContent=c.slice(0,8),answer==c?(solveCount+=1,playAudio("correct"),a.textContent="",b.textContent=parseInt(b.textContent)+1,setTimeout(nextProblem,300)):answer.slice(0,c.length)!=c&&playAudio("incorrect")}}}function toEnglish1(b,c,d){const e=[["[a] plus [b] is","[a] plus [b] equals"],["[a] minus [b] is","[a] minus [b] equals","[a] take away [b] is","[a] take away [b] equals","[b] from [a] is","[b] from [a] equals"],["[a] times [b] is","[a] times [b] equals","[a] multiplied by [b] is","[a] multiplied by [b] equals"],["[a] divided by [b] is","[a] divided by [b] equals"]],a=e[b],f=a[getRandomInt(0,a.length)];return f.replace("[a]",c).replace("[b]",d)}function toEnglish2(b,c,d){const e=[["When you add [a] and [b], you get","What do you get if you add [a] and [b]?"],["When we substract [a] from [b], we get","When you take [a] away from [b], you get","What do you get if you substract [a] and [b]?","What do you get if you take [a] away from [b]?"],["When we multiply [a] by [b], we get","What do you get if you multiply [a] by [b]?"],["When you divide [a] by [b], you get","What do you get if you divide [a] by [b]?"]],a=e[b],f=a[getRandomInt(0,a.length)];return f.replace("[a]",c).replace("[b]",d)}function generateData(){const g=document.getElementById("courseOption").selectedIndex,a=[8,2,8,2,9,0,8,2];let c,b,d,f,e;switch(g){case 0:e=Math.floor(Math.random()*4);break;case 1:e=Math.floor(Math.random()*1);break;case 2:e=Math.floor(Math.random()*1);break;default:e=g-3}switch(e){case 0:c=Math.floor(Math.random()*a[0]+a[1]),b=Math.floor(Math.random()*a[0]+a[1]),d=c+b,f="＋";break;case 1:b=Math.floor(Math.random()*a[2]+a[3]),d=Math.floor(Math.random()*a[2]+a[3]),c=b+d,f="−";break;case 2:c=Math.floor(Math.random()*a[4]+a[5]),b=Math.floor(Math.random()*a[4]+a[5]),d=c*b,f="×";break;case 3:b=Math.floor(Math.random()*a[6]+a[7]),d=Math.floor(Math.random()*a[6]+a[7]),c=b*d,f="÷";break;default:console.log("error")}const h="＋−×÷";return[c,h.indexOf(f),b,d]}initCalc(),document.getElementById("toggleDarkMode").onclick=toggleDarkMode,document.getElementById("startButton").onclick=startGame,document.getElementById("restartButton").onclick=startGame,document.getElementById("showAnswer").onclick=showAnswer,document.getElementById("kohacu").onclick=catNyan,[...document.getElementsByTagName("table")].forEach(a=>{[...a.getElementsByTagName("tr")].forEach(a=>{a.onclick=()=>{speak(a.innerText)}})}),document.addEventListener("click",unlockAudio,{once:!0,useCapture:!0})