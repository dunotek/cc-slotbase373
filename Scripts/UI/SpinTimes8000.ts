import { _decorator, Component, Node, tween } from 'cc';
import { SpinTimes } from '../../../../cc-common/cc-slotbase/scripts/component/SpinTimes';
const { ccclass, property } = _decorator;

@ccclass('SpinTimes8000')
export class SpinTimes8000 extends SpinTimes {
    @property(Node)
    nodeIncreaseTimes: Node = null;

    showIncreaseTimes(increaseTimes) {
        const index = Math.floor(increaseTimes / 5) - 1;
        this.nodeIncreaseTimes.children.map((node, i) => node.active = i == index);
        tween(this.nodeIncreaseTimes)
            .call(() => this.nodeIncreaseTimes.active = true)
            .delay(1)
            .call(() => this.nodeIncreaseTimes.active = false)
            .start();
    }

    addSpinTimesAnimation(value: number, isFast: boolean = false, callback: Function = null) {
        this.showIncreaseTimes(value);
        super.addSpinTimesAnimation(value, isFast, callback);
    }
}

