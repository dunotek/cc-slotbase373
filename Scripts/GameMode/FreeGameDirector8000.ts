import { _decorator } from 'cc';
import { MainGameDirector8000 } from './MainGameDirector8000';
import { TutorialTriggerType } from '../../../../cc-common/cc-slotbase/scripts/component/CustomEnum';

const { ccclass } = _decorator;

@ccclass('FreeGameDirector8000')
export class FreeGameDirector8000 extends MainGameDirector8000 {
    ready(data) {
        const { isResume, matrix } = data;
        const { isTrialMode, playSession } = this.dataStore;
        const { freeGameRemain, freeGame, bonusGameRemain } = playSession;
        this.isSpinning = false;
        let spinTimes = freeGameRemain > 0 ? freeGameRemain : freeGame;

        if (matrix) {
            this.table.emit("CHANGE_MATRIX", { matrix });
        }

        this.unscheduleAllCallbacks();
        this._showBigWild([], data);
        this._showTrialButtons([], false);

        this.spinTimes.emit("RESET_SPINTIMES");
        this.spinTimes.emit("UPDATE_SPINTIMES", spinTimes);

        if (isResume && bonusGameRemain) {
            this.stateResume();
        } else if (spinTimes) {
            if (this.spinTimes) {
                this.spinTimes.active = this.isAlwaysAutoSpin;
            }
            this.runAction('SpinByTimes', spinTimes);
            this.soundPlayer && this.soundPlayer.playMainBGM();
            this.guiMgr.onIngameEvent(TutorialTriggerType.EnterFreeGame, "ENTER_GAME_MODE");
        }
    }

    // delayTrialButton(delayTime = 2) {
    //     const { isTrialMode } = this.dataStore;
    //     if (isTrialMode) {
    //         let trialComp = this.guiMgr.trialButton.mainComponent;
    //         if (trialComp) trialComp.playRealButton.active = true;

    //        c
    //         this.scheduleOnce(() => {
    //             this._showTrialButtons([], true);
    //         }, delayTime);
    //     }
    // }

    _showBigWin(script, { name, }) {
        const { winType, bigWinConfig, bigwinAmount } = this.dataStore.playSession;
        if (!winType) return this.executeNextScript(script);
        const content = {
            winType, bigWinConfig, winAmount: bigwinAmount,
            currentBetData: this.dataStore.betData.getTotalBet(),
        };
        this.guiMgr.showCutScene(name, content, () => {
            this.executeNextScript(script);
        });
    }
}