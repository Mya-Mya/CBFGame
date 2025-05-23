import p5 from "p5";
import { Obstacle } from "./obstacles";
import { FRAME_RATE } from "./config";

export class Agent {
    /**
     * CBF制約による介入制御付きエージェント．
     * 基本的には，自己位置からマウスに向かう速度ベクトルで移動しようとしているのだが，
     * 障害物回避に関するCBF制約によって介入が行われ，その速度ベクトルの長さが変更される．
     */
    private alpha: number
    private oneMinusAlpha: number
    private color: string
    private x: number
    private y: number
    constructor(alpha: number, color: string, x: number, y: number) {
        this.alpha = alpha
        this.oneMinusAlpha = 1. - alpha
        this.color = color
        this.x = x
        this.y = y
    }
    /**
     * 自己位置が(x, y)から(x+dx, y+dy)に移動することになっても，全てのCBF制約を満たしているかを調べる．
     * @param dx 自己位置からX方向にずれる量
     * @param dy 自己位置からY方向にずれる量
     * @param obstacles 回避対象にある障害物
     * @returns 
     */
    doesSatisfyAllConstraints(dx: number, dy: number, obstacles: Obstacle[]) {
        const x_and_nextx = [
            [this.x, this.y],
            [this.x + dx, this.y + dy]
        ]
        for (const obstacle of obstacles) {
            const h_and_nexth = obstacle.constraintFunc(x_and_nextx)
            const h = h_and_nexth[0]!
            const nexth = h_and_nexth[1]!
            if (!(nexth >= this.oneMinusAlpha * h)) return false
        }
        return true
    }
    /**
     * 
     * @param p p5jsインスタンス
     * @param obstacles 回避対象にある障害物
     */
    tick(p: p5, obstacles: Obstacle[]) {
        // もし障害物や制約が無いのなら，次の自己位置は(x+nominal_dx, y+nominal_dy)になる．
        const nominal_dx = (p.mouseX - this.x) / FRAME_RATE
        const nominal_dy = (p.mouseY - this.y) / FRAME_RATE

        let intervened = false
        let deltaRatio = 0
        let deltaRatioSign = +1
        if (!this.doesSatisfyAllConstraints(nominal_dx, nominal_dy, obstacles)) {
            // ノミナル入力では違反してしまう障害物がある
            for (deltaRatio = 0.01; deltaRatio <= 1.0; deltaRatio += 0.01) {
                deltaRatioSign = -1
                // deltaRatioはなるべく小さく留めたい
                if (this.doesSatisfyAllConstraints(
                    nominal_dx * (1 - deltaRatio),
                    nominal_dy * (1 - deltaRatio),
                    obstacles
                )) break
            }
            intervened = true
        }
        // 自己位置を移動
        const optimalRatio = 1 + deltaRatio * deltaRatioSign
        const optimal_dx = nominal_dx * optimalRatio
        const optimal_dy = nominal_dy * optimalRatio
        this.x += optimal_dx
        this.y += optimal_dy

        // 描画
        p.noFill()
        p.stroke(this.color)
        p.strokeWeight(2.0)
        p.line(this.x, this.y, this.x + optimal_dx * FRAME_RATE, this.y + optimal_dy * FRAME_RATE)

        p.fill(this.color)
        if (intervened) {
            p.stroke("orangered")
            p.strokeWeight(5.0)
        } else {
            p.noStroke()
        }

        p.circle(this.x, this.y, 30)

        p.fill("white")
        p.textAlign("center", "center")
        p.text(this.alpha, this.x, this.y)
    }
}