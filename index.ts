import p5 from "p5";
console.log("Hello via Bun!");

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(400, 400);
    p.background(220);
  };

  p.draw = () => {
    p.fill(255, 0, 0);
    p.ellipse(p.mouseX, p.mouseY, 50, 50);
  };
};
new p5(sketch);