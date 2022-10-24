const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let eyes = [];
let theta;
let gameFrame = 1;

const jetRight = new Image();
const back = new Image();
const jetLeft = new Image();
jetRight.src = "whiteRight.png";
jetLeft.src = "whiteLeft.png";
back.src = "b.jpg";
let isClicked = false;

const spites = {
  jet: {
    fullWidth: 3460,
    fullHeight: 1797,
    spriteWidth: 692,
    spriteHeight: 599,
    x_images: 5,
    y_images: 3,
    total: 15,
  },
};

const selectedSpite = "jet";

const mouse = {
  x: undefined,
  y: undefined,
};

window.addEventListener("mousemove", function (e) {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener("mouseup", function (e) {
  isClicked = false;
});

window.addEventListener("mousedown", function (e) {
  isClicked = true;
});

class Eye {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
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
    grd.addColorStop(0, "#000");
    grd.addColorStop(0.5, "#f00");
    grd.addColorStop(1, "#f00");
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.closePath();

    // draw iris
    ctx.beginPath();
    ctx.arc(iris_x, iris_y, iris_radius, 0, Math.PI * 2, true);
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
      ctx.strokeStyle = "#fff";
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
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fill();
    ctx.closePath();
  }
}

function spiteCalculation(gFrame, numberOfImages, maxX, maxY) {
  const nowFrame = ((gFrame - 1) % numberOfImages) + 1;
  const divider = Math.floor(numberOfImages / maxY);
  const x = (nowFrame - 1) % maxX;
  let y = Math.floor(nowFrame / divider);
  if (nowFrame % divider === 0) y--;
  return { x: x, y: y };
}

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
  requestAnimationFrame(animate);
  ctx.fillStyle = "#fff";
  gameFrame++;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    back,
    0,
    0,
    canvas.width,
    canvas.height,
    0,
    0,
    canvas.width,
    canvas.height
  );
  for (let i = 0; i < eyes.length; i++) {
    eyes[i].draw();
  }
  const xy = spiteCalculation(
    gameFrame,
    spites[selectedSpite].total,
    spites[selectedSpite].x_images,
    spites[selectedSpite].y_images
  );
  const spiteDisplayWidth = spites[selectedSpite].spriteWidth;
  const spiteDisplayHeight = spites[selectedSpite].spriteHeight;

  ctx.drawImage(
    mouse.x > canvas.width / 2 ? jetRight : jetLeft,
    // red,
    isClicked ? 0 : xy.x * spites[selectedSpite].spriteWidth,
    isClicked ? 0 : xy.y * spites[selectedSpite].spriteHeight,
    spiteDisplayWidth,
    spiteDisplayHeight,
    mouse.x - spiteDisplayWidth / 2,
    mouse.y - spiteDisplayHeight / 2,
    spiteDisplayWidth,
    spiteDisplayHeight
  );
}

init();
animate();

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});
