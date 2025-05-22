import p5 from "p5"
import { Obstacle, CircleObstacle, RectangleObstacle } from "./obstacles"
import { FRAME_RATE } from "./config"
import { Agent } from "./agent"
import instances from "./instances"
console.log("Hello via Bun!")

const sketch = (p: p5) => {
  let currentInstanceIdx = 0
  let changeInstanceButton: p5.Element
  let obstacles: Obstacle[] = []
  let agents: Agent[] = []

  const updateInstance = () => {
    changeInstanceButton.elt.innerText =
      `${currentInstanceIdx + 1} / ${instances.length}`
    const instance = instances[currentInstanceIdx]!
    obstacles = instance.obstacles
    agents = instance.agents
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.frameRate(FRAME_RATE)

    changeInstanceButton = p.createButton("")
    changeInstanceButton.mousePressed(() => {
      currentInstanceIdx = (currentInstanceIdx + 1) % instances.length
      updateInstance()
    })
    changeInstanceButton.position(10, 10)
    updateInstance()
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }

  p.draw = () => {
    p.background(253)
    obstacles.forEach(obstacle => obstacle.draw(p))
    agents.forEach(agent => agent.tick(p, obstacles))

    p.noStroke()
    p.fill("black")
    p.circle(p.mouseX, p.mouseY, 10)
  }

  p.keyReleased = () => {
    if (p.isLooping()) { p.noLoop() } else { p.loop() }
  }
}
new p5(sketch);
