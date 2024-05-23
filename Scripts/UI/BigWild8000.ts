import { _decorator, color, Component, Node, sp, UITransform, warn } from 'cc';
import { GameObject } from '../../../../cc-common/cc-slotbase/scripts/core/GameObject';
import { MainGameDirector8000 } from '../GameMode/MainGameDirector8000';
const { ccclass, property } = _decorator;

export const AnimationsWild = {
    Idle: 'Idle',
    Expand: 'Expand',
    Win: 'Win',
    Antic: 'Antic',
    Antic_Loop: 'Antic_Loop',
    Antic_JP: 'Antic_JP',
    Antic_JP_Loop: 'Antic_JP_Loop',
    Lose_JP: 'Lose_JP',
    Attack_JP: 'Attack_JP',
    Attack: 'Attack'
}

@ccclass('BigWild8000')
export class BigWild8000 extends GameObject {
    @property(sp.Skeleton) animLeft: sp.Skeleton = null;
    @property(sp.Skeleton) animRight: sp.Skeleton = null;

    callbackBigWild: any = null;

    onLoad(): void {
        super.onLoad();
        this.node.on("ON_REEL_STOP", this.onReelStop, this);
        this.node.on("RESET_BIG_WILD", this.reset, this);

        this.node.on("ENABLE_BIG_WILD", this.enableBigWild, this);
        this.node.on("DISABLE_BIG_WILD", this.disableBigWild, this);

        this.node.on("SHOW_BIG_WILD", this.showBigWild, this);

        this.node.on("SHOW_BIG_WILD_WIN_JACKPOT", this.showBigWildWinJackpot, this);
        this.node.on("SHOW_BIG_WILD_LOSE_JACKPOT", this.showBigWildLoseJackpot, this);
    }

    showBigWild(matrix, isResume) {
        let hasWildLeft = matrix.some((reel) => reel.indexOf('K1') != -1);
        let hasWildRight = matrix.some((reel) => reel.indexOf('K2') != -1);

        if (hasWildLeft) {
            this.animLeft.node.active = true;
            this.animLeft.setAnimation(0, AnimationsWild.Idle, true);
        }
        if (hasWildRight) {
            this.animRight.node.active = true;
            this.animRight.setAnimation(0, AnimationsWild.Idle, true);
        }
    }

    reset() {
        this.animLeft.clearAnimation();
        this.animRight.clearAnimation();

        this.animLeft.node.active = false;
        this.animRight.node.active = false;

        this.animLeft.setCompleteListener(null);
        this.animRight.setCompleteListener(null);
    }

    onCompleteExpandWild() {
        let slotDirector: MainGameDirector8000 = (this.mainDirector.currentGameMode as any).director;
        if (slotDirector) slotDirector.completeExpandBigWild();
    }

    onReelStop(reel, reelMatrix) {
        // if (reel == 1) {
        //     const { hasWildRight } = this.dataStore.playSession;
        //     let row = reelMatrix.indexOf('K1');
        //     if (row == -1) return;

        //     this.hideSymbolStatic(reel, row);

        //     this.animLeft.node.active = true;
        //     this.animLeft.setAnimation(0, `${AnimationsWild.Expand}_${row + 1}`, false);
        //     this.animLeft.setCompleteListener(() => {
        //         this.animLeft.setAnimation(0, AnimationsWild.Idle, true);
        //         this.animLeft.setCompleteListener(null);
        //         !hasWildRight && this.onCompleteExpandWild();
        //     });
        // }

        // if (reel == 3) {
        //     const { matrix, hasWildLeft } = this.dataStore.playSession;
        //     let row = reelMatrix.indexOf('K2');s
        //     if (row == -1) return;

        //     this.hideSymbolStatic(reel, row);

        //     this.animRight.node.active = true;
        //     if (!hasWildLeft) {
        //         this.animRight.setAnimation(0, `${AnimationsWild.Expand}_${row + 1}`, false);
        //         this.animRight.setCompleteListener(() => {
        //             this.animRight.setAnimation(0, AnimationsWild.Idle, true);
        //             this.animRight.setCompleteListener(null);
        //             this.onCompleteExpandWild();
        //         });
        //     } else {
        //         const nearJackpot = matrix[0].indexOf('K3') != -1 && matrix[2].indexOf('K3') != -1;
        //         const nearScatter = matrix.filter((reel) => reel.indexOf('A') != -1).length >= 2;
        //         const nearBonus = matrix.filter((reel) => reel.indexOf('R') != -1).length >= 2;
        //         if (nearJackpot) {
        //             this.animRight.setAnimation(0, `${AnimationsWild.Expand}_${row + 1}`, false);
        //             this.animRight.setCompleteListener(() => {
        //                 this.animRight.setAnimation(0, AnimationsWild.Antic_JP, false);
        //                 this.animRight.addAnimation(0, AnimationsWild.Antic_JP_Loop, true);

        //                 this.animLeft.setAnimation(0, AnimationsWild.Antic_JP, false);
        //                 this.animLeft.addAnimation(0, AnimationsWild.Antic_JP_Loop, true);

        //                 this.animRight.setCompleteListener(null);
        //                 this.onCompleteExpandWild();
        //             });


        //         } else if (nearScatter || nearBonus) {
        //             this.animRight.setAnimation(0, `${AnimationsWild.Expand}_${row + 1}`, false);
        //             this.animRight.setCompleteListener(() => {
        //                 this.animRight.addAnimation(0, AnimationsWild.Idle, true);
        //                 this.animRight.setCompleteListener(null);
        //                 this.onCompleteExpandWild();
        //             });
        //         } else {
        //             this.animRight.setAnimation(0, `${AnimationsWild.Expand}_${row + 1}`, false);
        //             this.animRight.setCompleteListener(() => {
        //                 this.animRight.setAnimation(0, AnimationsWild.Antic, false);
        //                 this.animRight.addAnimation(0, AnimationsWild.Antic_Loop, true);

        //                 this.animLeft.setAnimation(0, AnimationsWild.Antic, false);
        //                 this.animLeft.addAnimation(0, AnimationsWild.Antic_Loop, true);

        //                 this.animRight.setCompleteListener(null);
        //                 this.onCompleteExpandWild();
        //             });
        //         }
        //     }
        // }

        const { hasWildLeft, hasWildRight } = this.dataStore.playSession;

        if (hasWildLeft) {
            this.animLeft.node.active = true;
        }
        if (hasWildRight) {
            this.animRight.node.active = true;
        }

        if (hasWildLeft || hasWildRight) {
            warn("onCompleteExpandWild");
            this.onCompleteExpandWild();
        }
    }

    enableBigWild(reels) {
        if (reels.length == 0) return;

        if (reels.length == 2) {
            this.animLeft.setAnimation(0, AnimationsWild.Attack, false);
            this.animLeft.addAnimation(0, AnimationsWild.Antic_Loop, true);

            this.animRight.setAnimation(0, AnimationsWild.Attack, false);
            this.animRight.addAnimation(0, AnimationsWild.Antic_Loop, true);
        }

        if (reels.length == 1) {
            let reel = reels[0];

            if (reel == 1) {
                this.animLeft.setAnimation(0, AnimationsWild.Win, true);
            }

            if (reel == 3) {
                this.animRight.setAnimation(0, AnimationsWild.Win, true);
            }
        }
    }

    disableBigWild() {
        if (this.animLeft.animation != AnimationsWild.Idle) {
            this.animLeft.setAnimation(0, AnimationsWild.Idle, true);
        }

        if (this.animRight.animation != AnimationsWild.Idle) {
            this.animRight.setAnimation(0, AnimationsWild.Idle, true);
        }
    }

    hideSymbolStatic(col, row) {
        const reels = (this.node as any).reels;
        const showSymbols: Node[] = reels[col].getShowSymbols();
        showSymbols[row].active = false;
        showSymbols[row]['isHidden'] = true;
    }

    showBigWildWinJackpot() {
        this.animRight.setAnimation(0, AnimationsWild.Attack_JP, false);
        this.animRight.addAnimation(0, AnimationsWild.Idle, true);

        this.animLeft.setAnimation(0, AnimationsWild.Attack_JP, false);
        this.animLeft.addAnimation(0, AnimationsWild.Idle, true);
    }

    showBigWildLoseJackpot() {
        this.animRight.setAnimation(0, AnimationsWild.Lose_JP, true);
        // this.animRight.addAnimation(0, AnimationsWild.Idle, true);

        this.animLeft.setAnimation(0, AnimationsWild.Lose_JP, true);
        // this.animLeft.addAnimation(0, AnimationsWild.Idle, true);
    }
}

