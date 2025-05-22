import { Obstacle, CircleObstacle, RectangleObstacle } from "./obstacles"
import { Agent } from "./agent"

export default [
    {
        "obstacles": [
            new CircleObstacle([100, 50], 30),
            new CircleObstacle([100, 200], 50),
            new CircleObstacle([150, 400], 100),
            new RectangleObstacle([250, 50], 100, 200),
            new RectangleObstacle([400, 200], 100, 200),
        ],
        "agents":[
            new Agent(1.0, "royalblue", 0, 0),
            new Agent(0.1, "turquoise", 20, 20),
            new Agent(0.05, "purple", 40, 40),
          ]
    },
    {
        "obstacles": [
            new RectangleObstacle([50, 50], 100, 100),
            new RectangleObstacle([200, 50], 100, 100),
            new RectangleObstacle([50, 200], 100, 100),
            new RectangleObstacle([200, 200], 100, 100),
            new RectangleObstacle([50, 350], 250, 100),
            new CircleObstacle([400, 100], 50),
            new CircleObstacle([400, 200], 50),
            new CircleObstacle([400, 300], 50),
            new CircleObstacle([400, 500], 50),

        ],
        "agents":[
            new Agent(0.1, "turquoise", 25, 175),
            new Agent(0.05, "purple", 25, 250),
            new Agent(0.02, "gold", 25, 250),
          ]
    },
]