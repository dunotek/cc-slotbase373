import { _decorator, Button, Component, Node, tween } from 'cc';
import { TrialButton } from '../../../../cc-common/cc-slotbase/scripts/component/TrialButton';
import { UIManager8000 } from '../UI/UIManager8000';
const { ccclass, property } = _decorator;

@ccclass('TrialButton8000')
export class TrialButton8000 extends TrialButton {
    onLoad() {
        super.onLoad();
        this.node.on("ON_CLICK_TRIAL_BUTTON", this.onPlayTrialButtonClicked, this);
        this.node.on("ON_CLICK_REAL_BUTTON", this.onPlayRealButtonClicked, this);

        this.node['mainComponent'] = this;
    }

    setPlayRealButton(isActive = true) {
        this.playRealButton.active = isActive;
    }

    setPlayTrialButton(isActive = true) {
        this.playTrialButton.active = isActive;
    }
    

    onPlayRealButtonClicked() {
        if (!(this.node as any).canClick) return;
        this.node.emit('SWITCH_MODE');
        
        // if (this.playRealButton) {
        //     this.playRealButton.active = false;
        // }

        this.setPlayRealButton(false);

        this.guiMgr.activeQuest(true);
        if (this.trialLabel) {
            this.trialLabel.active = false;
        }
        this.playSoundClick();
        // if (this.playTrialButton) {
        //     this.playTrialButton.getComponent(Button).interactable = false;
        //     this.scheduleOnce(() => {
        //         this.playTrialButton.getComponent(Button).interactable = true;
        //     }, 2);
        // }

        this.completeTrialSessionCount++;
        this.playAnimRealButton();
        (this.guiMgr as UIManager8000).skipTutorial();
        this.guiMgr.tutorialMgr.node.emit("RESET_UI_TUTORIAL_MODE");
    }

    onPlayTrialButtonClicked() {
        if (!(this.node as any).canClick) return;
        this.node.emit('SWITCH_MODE');
        // if (this.playRealButton) {
        //     this.playRealButton.active = true;
        // }

        // if (this.playTrialButton) {
        //     this.playTrialButton.active = false;
        // }

        this.setPlayRealButton(true);
        this.setPlayTrialButton(false);

        if (this.trialLabel) {
            this.trialLabel.active = true;
        }
        this.guiMgr.activeQuest(false);
        this.playSoundClick();
        if (this.completeTrialSessionCount < 2) {
            this.trialLabel.active = true;
            this.setOpacity(this.trialLabel, 0.01);
            this.fadeIn(this.trialLabel, 0.5);
            let dur = 0.8;
            this.tweenFade = tween(this.trialLabel).repeatForever(
                tween()
                    .delay(0.5)
                    .call(() => { this.fadeTo(this.trialLabel, dur, 190) })
                    .delay(dur)
                    .call(() => { this.fadeTo(this.trialLabel, dur, 255) })
                    .delay(dur)
            )
            this.tweenFade.start();
        } else {
            if (this.tweenFade) {
                this.tweenFade.stop();
                this.tweenFade = null;
            }
            this.setOpacity(this.trialLabel, 255);
        }
        this.playAnimTrialButton();
    }

}

