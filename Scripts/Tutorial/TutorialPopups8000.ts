import { _decorator, Component, Label, Node, tween, UIOpacity } from 'cc';
import { GameObject } from '../../../../cc-common/cc-slotbase/scripts/core/GameObject';
const { ccclass, property } = _decorator;

@ccclass('TutorialPopups')
export class TutorialPopups extends GameObject {
    @property({ type: Node })
    gradient = null;

    @property({ type: Label })
    message = null;

    @property({ type: Node })
    btnOK = null;

    @property({ type: Node })
    btnCancel = null;

    @property({ type: Node })
    btnHolder = null;

    onLoad() {
        super.onLoad();
        this.hidePopups();
        this.node.on("SHOW_POPUP_TUTORIAL", this.showPopups, this);
    }

    showPopups(tutorialString) {
        this.gradient.active = true;
        this.setOpacity(this.node, 255);
        this.message.string = tutorialString;
        this.node.active = true;
    }

    hidePopups() {
        this.gradient.active = false;
        this.setOpacity(this.node, 0);
        this.node.active = false;
    }
    onBackRealMode() {
        this.guiMgr.trialButton.emit("ON_CLICK_REAL_BUTTON");
        this.hidePopups();
        this.guiMgr.node.emit("SWITCH_MODE_TUTORIAL");
    }
}

