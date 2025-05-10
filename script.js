let originX, originY;
let length = 200;
let angle = Math.PI / 4;
let aVelocity = 0;
let aAcceleration = 0;
let gravity = 0.4;
let damping = 0.995;
let bobSize = 40;
let dragging = false;
let massKg = 4;

function setup() {
  createCanvas(600, 400).parent(document.body);
  originX = width / 2;
  originY = 100;
}

function applySettings() {
  const angleDeg = parseFloat(document.getElementById('angleInput').value);
  const lengthCm = parseFloat(document.getElementById('lengthInput').value);
  massKg = parseFloat(document.getElementById('massInput').value);

  if (isNaN(angleDeg) || isNaN(lengthCm) || isNaN(massKg)) return;

  angle = radians(angleDeg);
  length = lengthCm;
  bobSize = 10 + massKg * 3;
  aVelocity = 0;
}

function drawBackground() {
  // Gradient sky
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(135, 206, 250), color(255, 255, 255), inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Floor
  fill(100, 70, 40);
  noStroke();
  rect(0, height - 40, width, 40);

  // Support structure
  fill(120);
  rect(originX - 5, 0, 10, originY);
  fill(100);
  rect(originX - 50, originY - 10, 100, 20);
}

function draw() {
  background(255);
  drawBackground();

  if (!dragging) {
    // Physics
    aAcceleration = (-gravity / length) * sin(angle);
    aVelocity += aAcceleration;
    aVelocity *= damping;
    angle += aVelocity;
  }

  // Position of bob
  let x = originX + length * sin(angle);
  let y = originY + length * cos(angle);

  // Pendulum string
  stroke(0);
  strokeWeight(2);
  line(originX, originY, x, y);

  // Shadow
  noStroke();
  fill(0, 0, 0, 30);
  ellipse(x, height - 20, bobSize * 0.8, 8);

  // Bob
  fill(dragging ? 'orange' : 'blue');
  stroke(0);
  strokeWeight(1);
  ellipse(x, y, bobSize, bobSize);

  // Info Text
  fill(0);
  noStroke();
  textSize(16);
  textAlign(CENTER);
  text(`Angle: ${degrees(angle).toFixed(1)}°`, width / 2, 30);
  text(`Length: ${length.toFixed(1)} cm`, width / 2, 50);
}

function mousePressed() {
  let x = originX + length * sin(angle);
  let y = originY + length * cos(angle);
  let d = dist(mouseX, mouseY, x, y);
  if (d < bobSize / 2) {
    dragging = true;
    aVelocity = 0;
  }
}

function mouseDragged() {
  if (dragging) {
    let dx = mouseX - originX;
    let dy = mouseY - originY;
    angle = atan2(dx, dy);
    length = constrain(dist(originX, originY, mouseX, mouseY), 50, 300);

    // Live update UI fields
    document.getElementById('angleInput').value = degrees(angle).toFixed(1);
    document.getElementById('lengthInput').value = length.toFixed(1);
  }
}

function mouseReleased() {
  if (dragging) {
    dragging = false;
  }
}
