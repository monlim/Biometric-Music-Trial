//Reset audio context
document.documentElement.addEventListener('mousedown', () => {
  if (Tone.context.state !== 'running') Tone.context.resume();
});

//Get HTML elements and create global variables
const videoElement = document.getElementsByClassName('input_video')[0];
const videoSelect = document.querySelector('select#videoSource');
const selectors = [videoSelect];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const device = document.getElementById('device');
const sendMidi = document.getElementById("sendMidi");
const analysis = document.getElementById("analysis");
const intelligence = document.getElementById("intelligence");
const charisma = document.getElementById("charisma");
const kindness = document.getElementById("kindness");
const energy = document.getElementById("energy");
const courage = document.getElementById("courage");
const patience = document.getElementById("patience");
const predictedZodiac = document.getElementById("predictedZodiac");
const gain = new Tone.Gain().toDestination();
const piano = new Tone.Sampler({
  urls: {
    "C4": "C4.mp3",
    "D#4": "Ds4.mp3",
    "F#4": "Fs4.mp3",
    "A4": "A4.mp3",
  },
  baseUrl: "https://tonejs.github.io/audio/salamander/",
}).connect(gain);

let leftIndex, leftWrist, leftThumb, leftPinky, rightIndex, rightWrist, rightThumb, rightPinky, distance;
let output, midiControlValue=0.5, midiVelLeft=1, midiVelRight=1, scaleIndex=0, minVel=0.3, maxVel=1, noteIndexLeft=0.5, noteIndexRight=0.5;
let noteValue="16n", noteDuration=1;

const dragonScales = {0: {0: "A0", 1: "D1", 2: "F1", 3: "A1", 4: "D2", 5: "F2", 6: "A2", 7: "D3", 8: "F3", 9: "A3", 10: "D4",
11: "F4", 12: "A4", 13: "D5", 14: "F5", 15: "A5", 16: "D6", 17: "F6", 18: "A6", 19: "D7", 20: "F7", 21: "A7"}, 
1: {0: "A#0", 1: "D1", 2: "F1", 3: "A#1", 4: "D2", 5: "F2", 6: "A#2", 7: "D3", 8: "F3", 9: "A#3", 10: "D4",
11: "F4", 12: "A#4", 13: "D5", 14: "F5", 15: "A#5", 16: "D6", 17: "F6", 18: "A#6", 19: "D7", 20: "F7", 21: "A#7"}, 
2: {0: "A0", 1: "D1", 2: "E1", 3: "A1", 4: "D2", 5: "E2", 6: "A2", 7: "D3", 8: "E3", 9: "A3", 10: "D4",
11: "E4", 12: "A4", 13: "D5", 14: "E5", 15: "A5", 16: "D6", 17: "E6", 18: "A6", 19: "D7", 20: "E7", 21: "A7"},
3: {0: "A0", 1: "C#1", 2: "E1", 3: "A1", 4: "C#2", 5: "E2", 6: "A2", 7: "C#3", 8: "E3", 9: "A3", 10: "C#4",
11: "E4", 12: "A4", 13: "C#5", 14: "E5", 15: "A5", 16: "C#6", 17: "E6", 18: "A6", 19: "C#7", 20: "E7", 21: "A7"}};

const tigerScales = {0: {0: ["A0", "A1", "A#2", "A#3"], 1: ["C1", "C#2", "C3", "B3"], 2: ["A1", "F#2", "D3", "B3"], 
3: ["C2", "G#2", "E3", "C4"], 4: ["E2", "B2", "F3", "C4"], 5: ["A#2", "D#3", "G#3", "C#4"], 6: ["C#3", "F3", "A3", "C#4"], 
7: ["E3", "G3", "A#3", "C#4"], 8: ["G3", "A3", "C4", "D4"], 9: ["A#3", "C4", "C#4", "D#4"], 10: ["C#4", "D4", "D#4", "E4"], 
11: ["D#4", "F4", "F#4", "G#4"], 12: ["D#4", "F#4", "A4", "C5"], 13: ["E4", "G#4", "B4", "D#5"], 14: ["E4", "A4", "C#5", "F#5"], 
15: ["E4", "A#4", "E5", "A#5"], 16: ["F4", "C5", "G5", "D6"], 17: ["F4", "C#5", "A5", "F6"], 18: ["F4", "E6", "C#6", "A#6"], 
19: ["F#4", "F5", "F6", "E7"], 20: ["G4", "G5", "G#6", "G#7"], 21: ["G4", "A5", "A#6", "C8"]},

1: {1: ["A0", "A1", "A#2", "A#3"], 1: ["C1", "C#2", "C3", "B3"], 2: ["A1", "F#2", "D3", "B3"], 
3: ["C2", "G#2", "E3", "C4"], 4: ["E2", "B2", "F3", "C4"], 5: ["A#2", "D#3", "G#3", "C#4"], 6: ["C#3", "F3", "A3", "C#4"], 
7: ["E3", "G3", "A#3", "C#4"], 8: ["G3", "A3", "C4", "D4"], 9: ["A#3", "C4", "C#4", "D#4"], 10: ["C#4", "D4", "D#4", "E4"], 
11: ["D#4", "F4", "F#4", "G#4"], 12: ["D#4", "F#4", "A4", "C5"], 13: ["E4", "G#4", "B4", "D#5"], 14: ["E4", "A4", "C#5", "F#5"], 
15: ["E4", "A#4", "E5", "A#5"], 16: ["F4", "C5", "G5", "D6"], 17: ["F4", "C#5", "A5", "F6"], 18: ["F4", "E6", "C#6", "A#6"], 
19: ["F#4", "F5", "F6", "E7"], 20: ["G4", "G5", "G#6", "G#7"], 21: ["G4", "A5", "A#6", "C8"]},

2: {1: ["A0", "A1", "A#2", "A#3"], 1: ["C1", "C#2", "C3", "B3"], 2: ["A1", "F#2", "D3", "B3"], 
3: ["C2", "G#2", "E3", "C4"], 4: ["E2", "B2", "F3", "C4"], 5: ["A#2", "D#3", "G#3", "C#4"], 6: ["C#3", "F3", "A3", "C#4"], 
7: ["E3", "G3", "A#3", "C#4"], 8: ["G3", "A3", "C4", "D4"], 9: ["A#3", "C4", "C#4", "D#4"], 10: ["C#4", "D4", "D#4", "E4"], 
11: ["D#4", "F4", "F#4", "G#4"], 12: ["D#4", "F#4", "A4", "C5"], 13: ["E4", "G#4", "B4", "D#5"], 14: ["E4", "A4", "C#5", "F#5"], 
15: ["E4", "A#4", "E5", "A#5"], 16: ["F4", "C5", "G5", "D6"], 17: ["F4", "C#5", "A5", "F6"], 18: ["F4", "E6", "C#6", "A#6"], 
19: ["F#4", "F5", "F6", "E7"], 20: ["G4", "G5", "G#6", "G#7"], 21: ["G4", "A5", "A#6", "C8"]},

3: {1: ["A0", "A1", "A#2", "A#3"], 1: ["C1", "C#2", "C3", "B3"], 2: ["A1", "F#2", "D3", "B3"], 
3: ["C2", "G#2", "E3", "C4"], 4: ["E2", "B2", "F3", "C4"], 5: ["A#2", "D#3", "G#3", "C#4"], 6: ["C#3", "F3", "A3", "C#4"], 
7: ["E3", "G3", "A#3", "C#4"], 8: ["G3", "A3", "C4", "D4"], 9: ["A#3", "C4", "C#4", "D#4"], 10: ["C#4", "D4", "D#4", "E4"], 
11: ["D#4", "F4", "F#4", "G#4"], 12: ["D#4", "F#4", "A4", "C5"], 13: ["E4", "G#4", "B4", "D#5"], 14: ["E4", "A4", "C#5", "F#5"], 
15: ["E4", "A#4", "E5", "A#5"], 16: ["F4", "C5", "G5", "D6"], 17: ["F4", "C#5", "A5", "F6"], 18: ["F4", "E6", "C#6", "A#6"], 
19: ["F#4", "F5", "F6", "E7"], 20: ["G4", "G5", "G#6", "G#7"], 21: ["G4", "A5", "A#6", "C8"]}

};

const rabbitScales = {0: {13:"C#5", 6:"D#5", 3: "F#5", 12: "G#5", 2: "A#5", 8: "C#6", 7: "D#6", 
14:"F#6", 1: "G#6", 10: "A#6", 4:"C#7", 9: "D#7", 11: "F#7", 5:"G#7", 15: "F#5", 16: "D#6", 17: "C#5",
18: "F#5", 19: "D#7", 20: "G#6", 21: "C#5"},
1: {13:"C#5", 6:"D#5", 3: "F#5", 12: "G#5", 2: "A#5", 8: "C#6", 7: "D#6", 
14:"F#6", 1: "G#6", 10: "A#6", 4:"C#7", 9: "D#7", 11: "F#7", 5:"G#7", 15: "F#5", 16: "D#6", 17: "C#5",
18: "F#5", 19: "D#7", 20: "G#6", 21: "C#5"},
2: {13:"C#5", 6:"D#5", 3: "F#5", 12: "G#5", 2: "A#5", 8: "C#6", 7: "D#6", 
14:"F#6", 1: "G#6", 10: "A#6", 4:"C#7", 9: "D#7", 11: "F#7", 5:"G#7", 15: "F#5", 16: "D#6", 17: "C#5",
18: "F#5", 19: "D#7", 20: "G#6", 21: "C#5"},
3: {13:"C#5", 6:"D#5", 3: "F#5", 12: "G#5", 2: "A#5", 8: "C#6", 7: "D#6", 
14:"F#6", 1: "G#6", 10: "A#6", 4:"C#7", 9: "D#7", 11: "F#7", 5:"G#7", 15: "F#5", 16: "D#6", 17: "C#5",
18: "F#5", 19: "D#7", 20: "G#6", 21: "C#5"}};

let chosenScale = dragonScales; //default scale

Tone.Transport.bpm.value = 120;

let updateBpm = (value) => {
  Tone.Transport.bpm.value = value;
};

//Detect and choose camera
function gotDevices(deviceInfos) {
  // Handles being called several times to update labels. Preserve values.
  const values = selectors.map(select => select.value);
  selectors.forEach(select => {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
      videoSelect.appendChild(option);
    } 
  }
  selectors.forEach((select, selectorIndex) => {
    if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
      select.value = values[selectorIndex];
    }
  });
};

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  videoElement.srcObject = stream;
  // Refresh button list in case labels have become available
  return navigator.mediaDevices.enumerateDevices();
};

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
};

//create midi note loop
const leftLoop = new Tone.Loop((time) => {
  piano.triggerAttackRelease(chosenScale[scaleIndex][noteIndexLeft], noteDuration, time, midiVelLeft);
}, noteValue);

//create midi note loop
const rightLoop = new Tone.Loop((time) => {
  piano.triggerAttackRelease(dragonScales[scaleIndex][noteIndexRight], noteDuration, time, midiVelRight);
}, noteValue);


//send Midi notes out when "send Midi" box checked
startSound.addEventListener("change", function(){
  if (this.checked) {
    Tone.Transport.start();
  } else {
    leftLoop.stop();
    rightLoop.stop();
    Tone.Transport.stop();
  }
});

//generate random integer
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
};

//capture screenshot for Biometric analysis
analysis.addEventListener("click", function (){
  intelligence.innerHTML = getRndInteger(0, 100);
  charisma.innerHTML = getRndInteger(0, 100);
  kindness.innerHTML = getRndInteger(0, 100);
  energy.innerHTML = getRndInteger(0, 100);
  courage.innerHTML = getRndInteger(0, 100);
  patience.innerHTML = getRndInteger(0, 100);
  predictedZodiac.value = ["tiger", "rabbit", "dragon"][getRndInteger(0, 3)];
  if (predictedZodiac.value === "dragon") {
    //updateBpm(120);
    noteValue = "16n";
    noteDuration = 1.5;
    chosenScale = dragonScales;
    minVel = 0.3;
    maxVel = 0.95;
  };
  if (predictedZodiac.value === "tiger") {
    //updateBpm(120);
    noteValue = "32n";
    noteDuration = 0.5;
    chosenScale = tigerScales;
    minVel = 0.3;
    maxVel = 1;
  };
  if (predictedZodiac.value === "rabbit") {
    noteValue = "64n";
    noteDuration = 0.25;
    chosenScale = rabbitScales;
    minVel = 0.1;
    maxVel = 0.6;
  };
});

predictedZodiac.addEventListener("change", function () {
  if (predictedZodiac.value === "dragon") {
    //updateBpm(120);
    noteValue = "16n";
    noteDuration = 1.5;
    chosenScale = dragonScales;
    minVel = 0.3;
    maxVel = 0.95;
  };
  if (predictedZodiac.value === "tiger") {
    //updateBpm(120);
    noteValue = "32n";
    noteDuration = 0.5;
    chosenScale = tigerScales;
    minVel = 0.3;
    maxVel = 1;
  };
  if (predictedZodiac.value === "rabbit") {
    noteValue = "64n";
    noteDuration = 0.25;
    chosenScale = rabbitScales;
    minVel = 0.1;
    maxVel = 0.6;
  };
});

//linear scaling function
function scaleValue(value, from, to) {
  let scale = (to[1] - to[0]) / (from[1] - from[0]);
  let capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
  return (capped * scale + to[0]);
};

//exponential scale
let powerScale = d3.scalePow()
  .exponent(1.25).domain([0, 0.8]).range([2, 0.02]).clamp(true);

//function to calculate velocity and set patternDirection
let xNowLeft = 0.4, yNowLeft = 0, stillLeft=0, stillRight=0;// default values to start off distance calculation;
function leftVelocityCounter(leftIndexX, leftIndexY){
  xVelocityLeft = (leftIndexX - xNowLeft)/0.1;
  yVelocityLeft = (leftIndexY - yNowLeft)/0.1;
  stillLeft = (Math.sqrt((leftIndexX - xNowLeft)**2 + (leftIndexY - yNowLeft)**2))/0.1;
  xNowLeft = leftIndexX;
  yNowLeft = leftIndexY;
  if (predictedZodiac.value === "dragon" || predictedZodiac.value === "tiger"){ //play only if LH moving
    if (stillLeft > 0.15) {leftLoop.start()
    } else {leftLoop.stop()};
  };
  midiVelLeft = scaleValue(stillLeft, [0.15, 2], [minVel, maxVel]); //map LH velocity to LH stillness 
};

let xNowRight = 0.6, yNowRight = 0; // default values to start off distance calculation;
function rightVelocityCounter(rightIndexX, rightIndexY){
  xVelocityRight = (rightIndexX - xNowRight)/0.1;
  yVelocityRight = (rightIndexY - yNowRight)/0.1;
  stillRight = (Math.sqrt((rightIndexX - xNowRight)**2 + (rightIndexY - yNowRight)**2))/0.1;
  xNowRight = rightIndexX;
  yNowRight = rightIndexY;
  if (predictedZodiac.value === "dragon" || predictedZodiac.value === "tiger"){ //play only if RH moving
    if (stillRight > 0.15) {rightLoop.start()
    } else {rightLoop.stop()};
  };
  midiVelRight = scaleValue(stillRight, [0.15, 2], [minVel, maxVel]); //map RH velocity to RH stillness
};

//cycle between 4 scales for each zodiac
function changeScale(){
  if (scaleIndex < 3){scaleIndex = scaleIndex + 1}
    else {scaleIndex = 0};
};

//Trigger note if left hand reversed
let t2on = false;
let t2DistanceActivate = -0.15;
let t2DistanceDeactivate = 0;
function Trigger2(leftThumbX, leftPinkyX) {
  if (predictedZodiac.value === "dragon"){
    if ((leftThumbX - leftPinkyX) <= t2DistanceActivate){
      if(t2on)return;
      changeScale();
      t2on = true;
    };
    if((leftThumbX - leftPinkyX) > t2DistanceDeactivate){
      t2on = false;
    };
  };
};

//Draw hand landmarks on screen and output landmark information
function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiHandLandmarks && results.multiHandedness) {
    for (let index = 0; index < results.multiHandLandmarks.length; index++) {
      const classification = results.multiHandedness[index];
      const isRightHand = classification.label === 'Right';
      const landmarks = results.multiHandLandmarks[index]; 
      drawConnectors(
          canvasCtx, landmarks, HAND_CONNECTIONS,
          {color: isRightHand ? '#fff' : '#056df5'}),
      drawLandmarks(canvasCtx, landmarks, {
        color: isRightHand ? '#fff' : '#056df5',
        fillColor: isRightHand ? '#056df5' : '#fff',
        radius: (x) => {
          return lerp(x.from.z, -0.15, .1, 10, 1);
        }
      });
      if (isRightHand === false){
        leftIndex = landmarks[8];
        leftThumb = landmarks[4];
        leftPinky = landmarks[20];
        //leftWrist = landmarks[0];       
        noteIndexLeft = Math.floor(scaleValue(leftIndex.x, [0, 1], [0, 22]));        
        setInterval(leftVelocityCounter(leftIndex.x, leftIndex.y), 100);
        if (leftThumb && leftPinky){Trigger2(leftThumb.x, leftPinky.x)};
        if (predictedZodiac.value === "rabbit"){leftLoop.start()};
      } else {
        rightIndex = landmarks[8];  
        noteIndexRight = Math.floor(scaleValue(rightIndex.x, [0, 1], [0, 22]));
        setInterval(rightVelocityCounter(rightIndex.x, rightIndex.y), 100);
        if (predictedZodiac.value === "rabbit"){rightLoop.start()};
        //rightWrist = landmarks[0];
        //rightThumb = landmarks[4];
        //rightPinky = landmarks[20];
      };
      if(results.multiHandLandmarks.length == 1){
        if(isRightHand === false){ 
          rightLoop.stop();
        } 
        else {
        leftLoop.stop();
        }
      };
    canvasCtx.restore();
    };
    if (results.multiHandLandmarks.length < 1) {
      leftLoop.stop();
      rightLoop.stop();
    };
  };
};

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.3/${file}`;
}});

hands.setOptions({
  selfieMode: true,
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 1280,
  height: 720
});
camera.start();

function start() {
  const videoSource = videoSelect.value;
  const constraints = {
    video: {deviceId: videoSource ? {exact: videoSource} : undefined} 
  };
  navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);
};

videoSelect.onchange = start;
