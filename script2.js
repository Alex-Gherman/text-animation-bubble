const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
let particlesArray = [];
let ajustX = 15;
let ajustY = 5;
ctx.lineWidth = 3;
//handle mouse
const mouse = {
  x: null,
  y: null,
  radius: 150,
};
window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});
ctx.fillStyle = "white";
ctx.font = "30px Verdana";
ctx.fillText("Alex", 0, 30);

const textCoordinates = ctx.getImageData(0, 0, 100, 100);

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 10;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = Math.random() * 5 + 1;
    this.distance;
  }
  draw() {
    ctx.fillStyle = "rgb(255,255,255,0.8)";
    ctx.strokeStyle = "rgb(34,147,214,1)";
    ctx.beginPath();

    if (this.distance < mouse.radius - 5) {
      this.size = 13;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.arc(this.x - 3, this.y - 3, this.size / 2.5, 0, Math.PI * 2);
      ctx.arc(this.x + 7, this.y - 2, this.size / 3.5, 0, Math.PI * 2);
    } else if (this.radius <= mouse.radius) {
      this.size = 10;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.arc(this.x - 2, this.y - 2, this.size / 3, 0, Math.PI * 2);
    } else {
      this.size = 8;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.arc(this.x - 1, this.y - 1, this.size / 3, 0, Math.PI * 2);
    }
    ctx.closePath();
    ctx.fill();
  }
  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    this.distance = distance;
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance; //slow the particles if they away from the mouse position
    let directionX = forceDirectionX * force * this.density; //slow the particles random nott all have the same speed
    let directionY = forceDirectionY * force * this.density;

    if (distance < mouse.radius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
    }
  }
}
const init = (e) => {
  particlesArray = [];
  for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
    for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
      if (
        textCoordinates.data[y * 4 * textCoordinates.width + x * 4 + 3] > 128
      ) {
        let positionX = x + ajustX;
        let positionY = y + ajustY;
        particlesArray.push(new Particle(positionX * 20, positionY * 20));
      }
    }
  }
};

init();
const animate = (e) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].draw();
    particlesArray[i].update();
  }

  requestAnimationFrame(animate);
};
animate();
