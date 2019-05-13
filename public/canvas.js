class Point3D {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  draw(ctx, plane) {
    const coords = this.project(plane);
    const size = 25/Math.sqrt(Math.abs(coords[2]));
    ctx.fillRect(coords[0] - size/2, coords[1] - size/2, size, size)
  }

  project(plane) {
    const d = this.minus(plane.origin);
    const x = plane.e1.dot(d);
    const y = plane.e2.dot(d);
    const z = plane.n.dot(d);
    return [x, y, z];
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  scalar(s) {
    return new Point3D(this.x * s, this.y * s, this.z * s);
  }

  plus(point) {
    return new Point3D(this.x + point.x, this.y + point.y, this.z + point.z);
  }

  minus(point) {
    return new Point3D(this.x - point.x, this.y - point.y, this.z - point.z);
  }

  dot(point) {
    return this.x * point.x + this.y * point.y + this.z * point.z;
  }

  copy() {
    return new Point3D(this.x, this.y, this.z);
  }
}

class Plane {
  constructor(origin, e1, e2) {
    this.origin = origin;
    this.e1 = e1;
    this.e2 = e2;
    this.n = this.origin.scalar(1 / this.origin.magnitude());
  }
}

class Turtle {
  constructor(speed, head, len, path) {
    this.t = 0;
    this.speed = speed;
    this.head = head;
    this.tail = [];
    this.len = len;
    this.path = path;
  }

  update() {
    this.tail.push(this.head.copy());
    if (this.tail.length > this.len) {
      this.tail.shift();
    }
    this.head = this.head.plus(this.path(this.t).scalar(this.speed))
    this.t = (this.t + 1) % 360;
  }

  draw() {
    let proj = this.tail[0].project(plane);
    ctx.beginPath();
    ctx.moveTo(proj[0], proj[1]);

    let i = 1;
    this.tail.slice(1).concat(this.head).forEach(point => {
      const proj = point.project(plane);
      ctx.lineTo(proj[0], proj[1]);
      ctx.lineWidth = Math.pow(361/Math.abs(proj[2]), 10);
      ctx.strokeStyle = 'hsl(' + 360 * i / this.tail.length + ', 100%, 50%)';
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(proj[0], proj[1]);

      i++;
    });
  }
}

let cvs, ctx, interval, plane, turtles;

function init() {
  clearInterval(interval);

  cvs = document.getElementById('myCanvas');
  cvs.width = window.innerWidth;
  cvs.height = window.innerHeight;
  ctx = cvs.getContext('2d');
  ctx.translate(ctx.canvas.width/2, ctx.canvas.height/2);

  plane = new Plane(new Point3D(-50, -50, -50), new Point3D(-1, 1, 0), new Point3D(-1, -1, 2));

  turtles = [];
  turtles.push(new Turtle(10, new Point3D(250, 0, 125), 175, infinityCube))
  turtles.push(new Turtle(10, new Point3D(0, 250, 125), 175, negativeInfinityCube))

  interval = setInterval(() => {
    update();
    draw();
  }, 16);
}

window.onresize = init;

function infinityCube(t) {
  let dir;
  if (t < 20) {
    dir = new Point3D(1, 0, 0);
  } else if (t < 40) {
    dir = new Point3D(0, 0, 1);
  } else if (t < 60) {
    dir = new Point3D(0, 1, 0);
  } else if (t < 80) {
    dir = new Point3D(0, 0, -1);
  } else if (t < 100) {
    dir = new Point3D(0, -1, 0);
  } else if (t < 120) {
    dir = new Point3D(-1, 0, 0);
  } else if (t < 140) {
    dir = new Point3D(0, 1, 0);
  } else if (t < 160) {
    dir = new Point3D(1, 0, 0);
  } else if (t < 180) {
    dir = new Point3D(0, 0, 1);
  } else if (t < 200) {
    dir = new Point3D(-1, 0, 0);
  } else if (t < 220) {
    dir = new Point3D(0, 0, -1);
  } else if (t < 240) {
    dir = new Point3D(0, -1, 0);
  } else if (t < 260) {
    dir = new Point3D(0, 0, 1);
  } else if (t < 280) {
    dir = new Point3D(0, 1, 0);
  } else if (t < 300) {
    dir = new Point3D(1, 0, 0);
  } else if (t < 320) {
    dir = new Point3D(0, -1, 0);
  } else if (t < 340) {
    dir = new Point3D(-1, 0, 0);
  } else if (t < 360) {
    dir = new Point3D(0, 0, -1);
  }

  if (t % 60 < 20) {
    return dir.scalar(1.1);
  } else {
    return dir;
  }
}

function negativeInfinityCube(t) {
  return infinityCube(359-t).scalar(-1);
}

function update() {
  turtles.forEach(turtle => turtle.update());
}

function draw() {
  ctx.clearRect(-ctx.canvas.width/2, -ctx.canvas.height/2, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = '#000';
  ctx.fillRect(-ctx.canvas.width/2, -ctx.canvas.height/2, ctx.canvas.width, ctx.canvas.height);

  turtles.forEach(turtle => turtle.draw());
}

init();
