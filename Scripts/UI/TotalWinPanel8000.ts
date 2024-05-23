import { _decorator, Component, Label, Node, sp, tween } from 'cc';
import { TotalWinPanel } from '../../../../cc-common/cc-slotbase/scripts/component/TotalWinPanel';
import { formatMoney, tweenMoney } from '../../../../cc-common/cc-share/common/utils';
const { ccclass, property } = _decorator;


@ccclass('TotalWinPanel8000')
export class TotalWinPanel8000 extends TotalWinPanel {
    // @property(sp.Skeleton)
    // animation: sp.Skeleton = null;

    // levelTotalWin: number = 1;

    // enter() {
    //     this.canClose = false;
    //     this.winAmount.string = "";
    //     this.levelTotalWin = 1;

    //     this.playSoundTotalWin();
    //     this.playWinAmount();
    // };

    // playWinAmount() {
    //     if (!this.winAmount) return;

    //     const { winAmount } = this.content;
    //     const betValue = this.dataStore.getTotalBet();
    //     let timeShow = 4.6;

    //     if (winAmount >= betValue * 30 && winAmount < betValue * 70) {
    //         timeShow = 5.6
    //         this.levelTotalWin = 2;
    //     }

    //     if (winAmount >= betValue * 70) {
    //         timeShow = 6.6
    //         this.levelTotalWin = 3;
    //     }

    //     tween(this.node)
    //         .call(() => this.fadeIn(this.node, 0.2))
    //         .delay(0.2)
    //         .call(() => {
    //             this.animation.setCompleteListener(() => {
    //                 this.animation.setCompleteListener(null);
    //                 this.animation.setAnimation(0, `Idle_${this.levelTotalWin}`, true);

    //                 tweenMoney(this.winAmount, this.levelTotalWin == 1 ? 0 : timeShow - 1, winAmount)
    //                 this.canClose = true;
    //                 this.closeBtn.interactable = true;

    //             });
    //         })
    //         .delay(timeShow)
    //         .call(() => this.close())
    //         .start();
    // }

    // close() {
    //     if (!this.canClose) return;
    //     this.canClose = false;
    //     this.closeBtn.interactable = false;

    //     this.animation.setAnimation(0, `Disappear_${this.levelTotalWin}`, false);
    //     this.fadeOut(this.node, 0.2, {
    //         onComplete: () => {
    //             this.callback && this.callback();
    //             this.callback = null;
    //             this.stopSoundTotalWin();
    //             this.exit();
    //         }
    //     });
    // }
}

