import p5 from "p5"
import { Obstacle, CircleObstacle, RectangleObstacle } from "./obstacles"
console.log("Hello via Bun!")

const sketch = (p: p5) => {
  const circle = new CircleObstacle([100, 200], 50)
  const rect = new RectangleObstacle([300, 50], 10, 20)
  p.setup = () => {
    p.createCanvas(400, 400)
    p.frameRate(10)
  }

  p.draw = () => {
    const mousePosition = [p.mouseX, p.mouseY]
    const isCircleActive = circle.constraint_func([mousePosition])[0]! < 0
    const isRectActive = rect.constraint_func([mousePosition])[0]! < 0

    let bgcolor = "white"
    if (isCircleActive) bgcolor = "red"
    if (isRectActive) bgcolor = "mediumblue"
    p.background(bgcolor)
    circle.draw(p)
    rect.draw(p)
  }
}
new p5(sketch);