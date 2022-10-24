const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let eyes = [];
let theta;
let gameFrame = 1;

const jetMan = new Image();
const jumpLeft = new Image();
const jumpRight = new Image();
jetMan.src = "jet.png";
jumpLeft.src = "jumpLeft.png";
jumpRight.src = "jumpRight.png";

const mouse = {
  x: undefined,
  y: undefined,
};

window.addEventListener("mousemove", function (e) {
  mouse.x = e.x;
  mouse.y = e.y;
});

class Eye {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.spriteWidth = 512;
    this.spriteHeight = 512;
    this.spriteFullWidth = 2048; // 512 * 4
    this.spriteFullHeight = 1536; // 512 * 3
    this.frameX = 2;
    this.frameY = 2;
    this.frame = 0;
  }
  draw() {
    // mouse_angle_calculation
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    theta = Math.atan2(dy, dx);

    // iris_calculations
    let iris_x = this.x + (Math.cos(theta) * this.radius) / 2.2; // center + Math.cos(angle) + offset
    let iris_y = this.y + (Math.sin(theta) * this.radius) / 2.2; // center + Math.sin(angle) + offset
    let iris_radius = this.radius / 3;

    // pupil_calculations
    let pupil_x = this.x + (Math.cos(theta) * this.radius) / 2.2; // center + Math.cos(angle) + offset
    let pupil_y = this.y + (Math.sin(theta) * this.radius) / 2.2; // center + Math.sin(angle) + offset
    let pupil_radius = this.radius / 6;

    // draw eye ball
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    var grd = ctx.createRadialGradient(
      this.x,
      this.y,
      this.radius,
      pupil_x,
      pupil_y,
      pupil_radius
    );
    grd.addColorStop(0, "#ccc");
    grd.addColorStop(0.2, "#fff");
    grd.addColorStop(1, "#fff");
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.closePath();

    // draw iris
    ctx.beginPath();
    ctx.arc(iris_x, iris_y, iris_radius, 0, Math.PI * 2, true);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();

    // draw iris lines
    for (let i = 0; i < 360; i += 6) {
      ctx.beginPath();
      ctx.moveTo(iris_x, iris_y);
      ctx.lineTo(
        iris_x - Math.sin(i) * iris_radius,
        iris_y - Math.cos(i) * iris_radius
      );
      ctx.stroke();
      ctx.closePath();
    }

    // draw pupil
    ctx.beginPath();
    ctx.arc(pupil_x, pupil_y, pupil_radius, 0, Math.PI * 2, true);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.closePath();

    // draw pupil reflection
    ctx.beginPath();
    ctx.arc(
      pupil_x - pupil_radius / 3,
      pupil_y - pupil_radius / 3,
      pupil_radius / 2,
      0,
      Math.PI * 2,
      true
    );
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fill();
    ctx.closePath();

    const xy = spiteCalculation(gameFrame, 12, 4, 3);
    ctx.drawImage(
      jetMan,
      xy.x * this.spriteWidth,
      xy.y * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      mouse.x - this.spriteWidth / 4,
      mouse.y - this.spriteWidth / 4,
      this.spriteWidth / 2,
      this.spriteHeight / 2
    );
  }
}

function spiteCalculation(gFrame, numberOfImages, maxX, maxY) {
  const nowFrame = ((gFrame - 1) % numberOfImages) + 1;
  let fact = 0;
  if (nowFrame >= 9) {
    fact = 2;
  } else if (nowFrame >= 5) {
    fact = 1;
  } else {
    fact = 0;
  }
  const x = (nowFrame - 1) % 4;
  const y = fact;
  return { x: x, y: y };
}

function drawCircle() {
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 20, 0, Math.PI * 2, true);
  ctx.fillStyle = "#f00";
  ctx.fill();
  ctx.closePath();
}

canvas.addEventListener("mousemove", function (e) {
  drawCircle();
});

function init() {
  eyes = [];
  let overlapping = false;
  let numberOfEyes = 300;
  let protection = 10000;
  let counter = 0;

  while (eyes.length < numberOfEyes && counter < protection) {
    let eye = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.floor(Math.random() * 160) + 1,
    };
    overlapping = false;
    for (let i = 0; i < eyes.length; i++) {
      let previousEye = eyes[i];
      let dx = eye.x - previousEye.x;
      let dy = eye.y - previousEye.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < eye.radius + previousEye.radius) {
        overlapping = true;
        break;
      }
    }
    if (!overlapping) {
      eyes.push(new Eye(eye.x, eye.y, eye.radius));
    }
    counter++;
  }
}

function animate() {
  // ctx.clearReact(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(animate);
  ctx.fillStyle = "#000";
  gameFrame++;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < eyes.length; i++) {
    eyes[i].draw();
  }
}

init();
animate();

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
  // animate();
});