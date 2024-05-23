import { _decorator, Button, Node } from 'cc';
import { MiniDirector } from '../../../../cc-common/cc-slotbase/scripts/component/MiniGame/MiniDirector';
import { SlotGameMode } from '../../../../cc-common/cc-slotbase/scripts/component/CustomEnum';
const { ccclass, property } = _decorator;

@ccclass('MiniGameDirector8000')
export class MiniGameDirector8000 extends MiniDirector {
    @property(Node)
    nodeEffect: Node = null;

    ready(data) {
        //this.delayTrialButton();
        if (!data) {
            data = this.config.DEFAULT_BONUS_MATRIX;
        }

        super.ready(data);

        this.setOpacity(this.nodeEffect, 0);
        this.fadeIn(this.nodeEffect, 1);
    }

    delayTrialButton(delayTime = 2) {
        const { isTrialMode } = this.dataStore;
        if (isTrialMode) {
            let trialComp = this.guiMgr.trialButton.mainComponent;
            if (trialComp) {
                trialComp.playRealButton.active = true;
            }

            this._showTrialButtons([], false);
            this.scheduleOnce(() => {
                this._showTrialButtons([], true);
            }, delayTime);
        }
    }

    _clearTrialGame(script) {
        if (this.forceToExitMode) {
            this.dataStore.playSession = {};
            this.forceToExitMode = false;
        }
        this.executeNextScript(script);
    }

    _showTrialButtons(script, isOn: boolean = false) {
        let isAutoSpin = this.dataStore.isAutoSpin;
        let spinTimes = this.dataStore.spinTimes;
        let isNormalGame = this.dataStore.currentGameMode === SlotGameMode.NormalGame;
        let isTrialMode = this.dataStore.isTrialMode;
        if (isTrialMode && !isNormalGame && !this.forceToExitMode) {
            this.mainDirector.showTrialButtons(isOn && spinTimes > 0);
        } else {
            this.mainDirector.showTrialButtons(isOn && !isAutoSpin);
        }

        this.executeNextScript(script);
    }

    _updateWinningAmount(scripts, data) {
        (this.guiMgr as any).updateWinAmount(data);
        this.executeNextScript(scripts);
    }

}