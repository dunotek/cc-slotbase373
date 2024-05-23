import { _decorator, Component, Node } from 'cc';
import { SlotBetHistory } from '../../../../cc-common/cc-slotbase/scripts/component/BetHistory/SlotBetHistory';
const { ccclass, property } = _decorator;

@ccclass('SlotBetHistory8000')
export class SlotBetHistory8000 extends SlotBetHistory {
    openBetDetail(event) {
        if (this.historyTableTitle) this.historyTableTitle.active = false;
        if (this.historyDetailTitle) this.historyDetailTitle.active = true;
        super.openBetDetail(event);
    }
    onDisable() {
        this.onHideBetDetail();
    }

    onHideBetDetail() {
        if (this.historyTableTitle) this.historyTableTitle.active = true;
        if (this.historyDetailTitle) this.historyDetailTitle.active = false;
        super.onHideBetDetail();
    }

}

