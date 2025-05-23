import p5 from "p5"
type Vector = [number, number]

export abstract class Obstacle {
    /**
     * 障害物を表す抽象クラス．
     */

    /**
     * 障害物を描画する．
     * @param p 
     */
    abstract draw(p: p5): void

    /**
     * 障害物に対する制約関数を返す．
     * positionsはN x 2のサイズの行列，戻り値はNサイズのベクトル（Nはサンプルサイズ）．
     * positions[n]はサンプルnにおける(x,y)を表す．
     * この関数は連続であることが好ましい．
     * @param positions {number[][]}
     */
    abstract constraintFunc(positions: number[][]): number[]
}

const OBSTACLE_COLOR = "black"
const OBSTACLE_ALPHA_COLOR = "rgba(0,0,0,0.2)"


export class CircleObstacle extends Obstacle {
    centerPosition: Vector
    radius: number
    radius2: number

    constructor(center_position: Vector, radius: number) {
        super()
        this.centerPosition = center_position
        this.radius = radius
        this.radius2 = radius * radius
    }

    draw(p: p5): void {
        p.noStroke(); // No outline for the inner circle
        p.fill(OBSTACLE_ALPHA_COLOR); 
        p.circle(this.centerPosition[0], this.centerPosition[1], this.radius * 2); // p5.js circle uses diameter

        p.noFill(); // No fill for the outer circle
        p.stroke(OBSTACLE_COLOR); // Outline color
        p.strokeWeight(3.0)
        p.circle(this.centerPosition[0], this.centerPosition[1], this.radius * 2)
    }

    constraintFunc(positions: number[][]): number[] {
        const constraintVals: number[] = []
        for (let i = 0; i < positions.length; i++) {
            const pos = positions[i]!
            // Calculate squared distance from center to the position
            const dx = pos[0]! - this.centerPosition[0]
            const dy = pos[1]! - this.centerPosition[1]
            const centerToDistance2 = dx * dx + dy * dy

            // Subtract radius squared. Negative if inside, positive if outside.
            const distance2 = centerToDistance2 - this.radius2
            constraintVals.push(distance2)
        }
        return constraintVals
    }
}

export class RectangleObstacle extends Obstacle {
    bottomLeftPosition: Vector
    width: number
    height: number
    topRightPosition: Vector

    constructor(bottom_left_position: Vector, width: number, height: number) {
        super()
        this.bottomLeftPosition = bottom_left_position
        this.width = width
        this.height = height
        this.topRightPosition = [
            bottom_left_position[0] + width,
            bottom_left_position[1] + height
        ]
    }

    draw(p: p5): void {
        p.noStroke()
        p.fill(OBSTACLE_ALPHA_COLOR)
        p.rect(this.bottomLeftPosition[0], this.bottomLeftPosition[1], this.width, this.height)

        p.noFill()
        p.stroke(OBSTACLE_COLOR)
        p.strokeWeight(3.0)
        p.rect(this.bottomLeftPosition[0], this.bottomLeftPosition[1], this.width, this.height)
    }

    constraintFunc(positions: number[][]): number[] {
        const constraintVals: number[] = []
        for (let i = 0; i < positions.length; i++) {
            const pos = positions[i]!
            const x = pos[0]!
            const y = pos[1]!

            const xMinDist = this.bottomLeftPosition[0] - x
            const xMaxDist = x - this.topRightPosition[0]
            const yMinDist = this.bottomLeftPosition[1] - y
            const yMaxDist = y - this.topRightPosition[1]
            const maxDist = Math.max(xMinDist, xMaxDist, yMinDist, yMaxDist)
            constraintVals.push(maxDist)
        }
        return constraintVals
    }
}
