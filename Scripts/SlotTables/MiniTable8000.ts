import { _decorator, Component, Node, tween, v3 } from 'cc';
import { MiniTable } from '../../../../cc-common/cc-slotbase/scripts/component/MiniGame/MiniTable';
const { ccclass, property } = _decorator;

@ccclass('MiniTable8000')
export class MiniTable8000 extends MiniTable {

    @property({ type: Node, override: true, visible: false }) WIDTH_STEP: number = 250
    @property({ type: Node, override: true, visible: false }) HEIGHT_STEP: number = 250

    onLoad() {
        super.onLoad();

       
        this.WIDTH_STEP = this.config.SYMBOL_BONUS_WIDTH;
        this.HEIGHT_STEP = this.config.SYMBOL_BONUS_HEIGHT;
        this.startX = -this.colNumber / 2 * this.WIDTH_STEP + this.WIDTH_STEP / 2;
        this.startY = this.rowNumber / 2 * this.HEIGHT_STEP - this.HEIGHT_STEP / 2;
    }

    getPosByIndex(index) {

        const posYByRow = [140, 0, -150];

        let x = this.startX + this.WIDTH_STEP * Math.floor(index / this.rowNumber);
        let row = Math.round(index % this.rowNumber);
        let y = posYByRow[row];
        return v3(x, y);
    }

}

