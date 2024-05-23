import { _decorator, Component, Node } from 'cc';
import { Info } from '../../../../cc-common/cc-slotbase/scripts/component/Info';
const { ccclass, property } = _decorator;

@ccclass('info8000')
export class info8000 extends Info {

    @property({ type: Node }) playTutorialButton = null;

    onEnable() {
        super.onEnable();
        this.playTutorialButton.active = !this.dataStore.isTrialMode;
    }

    onClickTrialButton() {
        this.node.active = false;
        this.playTutorialButton.active = false;
        this.guiMgr.trialButton.emit("ON_CLICK_TRIAL_BUTTON");
    }
}

