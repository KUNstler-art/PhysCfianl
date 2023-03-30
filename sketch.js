/*
IS71103A: Physical Computing 2 (2022-23)
Shikun Wang
Date: 2023-03-29
Project Name:Warning: Body is connected to the Internet
             -A discussion of human subjectivity in human-computer interaction
Intro.
The work enables remote control of the human body through physical computing modules and TENS/EMS devices.  
This code is the interactive web page for this work.
*/

// First Thing // The URL to which requests are sent, need to chang when ngrok url is updated
let boardURL = "5469-148-252-132-215.eu.ngrok.io"; 
// let lastRequestedURL = ''; //for connecting test 

let particles = [];


function setup() {
  createCanvas(windowWidth, windowHeight);
  createButtons();
  colorMode(HSB, 360, 100, 100, 100);

  // Create 100 particles with random positions and velocities
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function preload() {
  // Load the image
  backgroundImage = loadImage("proprioception.jpg");
}

///////// Draw the background, particles, and text //////////
function draw() {
  background(0, 0, 0, 25);

  // Draw the image with adjusted brightness and transparency
  tint(255, 150); // Set brightness and transparency (0-255)
  filter(INVERT);
  image(backgroundImage, 0, 0, width, height);

  //Create particle
  for (let particle of particles) {
    particle.update();
    particle.display();
  }

  // Draw warning text
  textSize(25);
  fill(0,255,255);
  text("Warning: ", width / 2, 190);

  textSize(20);
  fill(0,255,255);
  text("Body is connected to the Internet, ", width / 2, 220);
  text("control is being requested!", width / 2, 250);
  fill(0,255,255);
  text("身体已接入互联网，请求控制！", width / 2, 290);

  // Draw Introduct text
  textAlign(CENTER);
  textSize(12);
  fill(255,255,0);
  text("1. Please click the 'Ready to Connect' button. 2. Click the corresponding part to control. 3. Frequent clicking may cause physical harm.", width / 2, height / 2 +20);
  text("1. 请点击“准备连接”按钮。2. 点击对应部位进行控制。3. 频繁点击可能会造成生理伤害。", width / 2, height / 2 +64);
}


 
class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.acc = createVector();
    this.size = random(2, 8);
    this.color = color(random(180, 220), random(50, 100), random(50, 100), random(50, 100));
  }

  update() {
  // Update speed and location
    this.vel.add(this.acc);
    this.vel.limit(4);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
  // Boundary detection
    if (this.pos.x < 0 || this.pos.x > width) {
      this.vel.x *= -1;
    }
    if (this.pos.y < 0 || this.pos.y > height) {
      this.vel.y *= -1;
    }
  }
  
  display() {
  // Drawing particles
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

//////////// Create buttons function //////////// 
function createButtons() {
  const buttonConfig = [
    { label: "Move left hand", action: relay(1), y: height / 2 - 225, x: width / 3 },
    { label: "Move right hand", action: relay(2), y: height / 2 - 225, x: 2 * width / 3 },
    { label: "Move left arm", action: relay(3), y: height / 2 - 175, x: width / 3 },
    { label: "Move right arm", action: relay(4), y: height / 2 - 175, x: 2 * width / 3 },
    { label: "Move left shoulder", action: relay(5), y: height / 2 - 125, x: width / 3 },
    { label: "Move right shoulder", action: relay(6), y: height / 2 - 125, x: 2 * width / 3 },
    { label: "Blink left eye", action: relay(7), y: height / 2 - 75, x: width / 3 },
    { label: "Blink right eye", action: relay(8), y: height / 2 - 75, x: 2 * width / 3 },
    { label: "Ready to Connect", action: test, y: height / 2 - 325, x: width / 2 },
    { label: "LEDON", action: ledON, y: height - 50, x: width / 5 },
    { label: "LEDOFF", action: ledOFF, y: height - 50, x: 2 * width / 5 },
    { label: "Servo 0", action: servo0, y: height - 50, x: 3 * width / 5 },
    { label: "Servo 180", action: servo180, y: height - 50, x: 4 * width / 5 },
  ];
////////// Create buttons style ////////// 
  buttonConfig.forEach((config) => {
    const button = createButton(config.label);
    button.mousePressed(config.action);
    button.style('font-size', '14px');

    if (config.y === height - 50) {
      button.style('background-color', 'rgba(128, 128, 128, 0.5)');
      button.style('border-radius', '0');
      button.size(80, 30);
    } else {
      button.style('background-color', 'rgb(0, 200, 255)');
      button.style('border-radius', '50%');
      button.size(150, 50);
    }

    button.style('color', 'white');
    button.position(config.x - button.width / 2, config.y);

  });
}

// sendReques function & skip ngrok‘browser-warning
function sendRequest(url) {
// lastRequestedURL = url;

url += (url.includes('?') ? '&' : '?') + 't=' + new Date().getTime();

// Follow the ngrok instructions to add a skip warning page, 
// it does not work for all browsers. So, it is better to have this code in place than not.
//(ngrok-skip-browser-warning)
fetch(url, {
mode: 'no-cors',
headers: {
'ngrok-skip-browser-warning': '1',
},
})
.then((response) => {
if (response.type === 'opaque') {
console.log('Request sent successfully');
} else {
throw new Error('Network response was not ok');
}
})
.catch((error) => console.error('Error:', error));
}


// open windows The picoW server is accessed by opening a new window,
// which is used to replace the function that requested access.
function openNewWindow(url) {
const newWindow = window.open(url, "_blank", "width=" + window.innerWidth + ", height=" + window.innerHeight);
setTimeout(function () {
newWindow.close();
}, 3000);
}

// This code references the code provided in the Physical computing2 module course, and these functions are reserved for "developer testing"
function ledON() {
openNewWindow("https://" + boardURL + "/ledOn");
}

function ledOFF() {
openNewWindow("https://" + boardURL + "/ledOff");
}

function servo0() {
openNewWindow("https://" + boardURL + "/servo?pos=0");
}

function servo180() {
openNewWindow("https://" + boardURL + "/servo?pos=180");
}

function ledON15s() {
openNewWindow("https://" + boardURL + "/ledOn");
setTimeout(function () {
openNewWindow("https://" + boardURL + "/ledOff");
}, 15000);
}

// Control of electromagnetic relays
function relay(num) {
return function () {
openNewWindow("https://" + boardURL + "/relay" + num);
}
}

// ....More controls can be added here....// 


// This is used to test whether ngrok's extranet access is working, 
// and to wrap it in a 'ready to control' button to allow viewers to manually confirm ngrok's warning page. 
// This is a very unhelpful approach.
function test() {
openNewWindow("https://" + boardURL + "/test");
}

