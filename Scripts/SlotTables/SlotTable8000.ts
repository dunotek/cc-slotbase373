import { _decorator, math, Node } from 'cc';
import { SlotTable } from '../../../../cc-common/cc-slotbase/scripts/table/SlotTable';
const { ccclass, property } = _decorator;
@ccclass('SlotTable8000')
export class SlotTable8000 extends SlotTable {

    onLoad() {
        super.onLoad();
    }

    init() {
        super.init();
        this.createBeautyMatrix();
    }

    startSpinning() {
        super.startSpinning();
        this.node.emit("RESET_BIG_WILD");
    }

    checkStopSpinningCallback(matrix = []) {
        this.stopSpinningCallbackCount++;
        const reel = this.stopSpinningCallbackCount - 1;
        this.node.emit("ON_REEL_STOP", reel, matrix);

        const count = this.stopSpinningCallbackCount;
        if (count >= this.reels.length) {
            this.onTableStopped();
        }

        this.node.emit('REEL_STOP_NEARWIN', { matrix, count, context: this });
        this.node.emit('REEL_STOP_SOUND', { matrix, count, context: this });

        if (this.stickyWild) {
            this.stickyWild.emit("SHOW_STICKY_WILD", count - 1);
        }
    };

    createBeautyMatrix() {
        const { BEAUTY_MATRIX } = this.config;

        if (BEAUTY_MATRIX) {
            let matrix = [];
            matrix = this.getRandomBeautyMatrix();
            this.changeMatrix({ matrix });
        }
    }

    getRandomBeautyMatrix() {
        const { BEAUTY_MATRIX } = this.config;
        const matrix = BEAUTY_MATRIX[Math.floor(Math.random() * BEAUTY_MATRIX.length)];
        return this.dataStore.convertMatrix(matrix.split(','));
    }

}