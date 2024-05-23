import { _decorator, Component, log, Node, sp, tween } from 'cc';
import { WinAmount } from '../../../../cc-common/cc-slotbase/scripts/component/WinAmount';
import { fadeIn, fadeOut } from '../../../../cc-common/cc-share/common/utils';
const { ccclass, property } = _decorator;

@ccclass('WinAmount8000')
export class WinAmount8000 extends WinAmount {
    @property([Node])
    listBackground: Node[] = [];

    @property(sp.Skeleton)
    winAmountAnim: sp.Skeleton = null;

    onLoad(): void {
        super.onLoad();
        this.node.on('FADE_IN_NUMBER', this.fadeInNumber, this);
    }

    updateWinAmount(data, callback?: Function) {
        const { levelWinAmount, time, winAmount, isLastest } = data;

        if (!winAmount || winAmount <= 0) return;

        if (levelWinAmount && levelWinAmount > 0) {
            this.setOpacity(this.winAmountAnim.node, 255);
            this.winAmountAnim.setAnimation(0, `LV${levelWinAmount}`, false);
        }

        super.updateWinAmount({ value: winAmount, time, isLastest }, callback);
    }

    fadeOutNumber(time: number = 1) {
        super.fadeOutNumber(time);

        fadeOut(this.winAmountAnim.node, time);
    }

    clearWinAmount() {
        super.clearWinAmount();
        // this.listBackground.map((node) => node.active = false);
    }

    fadeInNumber(time: number = 1) {
        this.fadeIn(this.winAmountAnim.node, time);
    }
}