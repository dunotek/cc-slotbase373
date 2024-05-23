import { _decorator, Button, Component, Node, Sprite, SpriteFrame, tween } from 'cc';
import { GameObject } from '../../../../cc-common/cc-slotbase/scripts/core/GameObject';
import { UIManager8000 } from '../UI/UIManager8000';
const { ccclass, property } = _decorator;

@ccclass('gameModeSelection8000')
export class gameModeSelection8000 extends GameObject {
    @property(Node)
    btnReal: Node = null;
    @property(Node)
    btnSkip: Node = null;
    @property(Node)
    freeGameOption: Node = null;
    @property(Node)
    bonusOption: Node = null;
    @property(SpriteFrame)
    listSpriteFrameBonus: SpriteFrame[] = [];
    @property(SpriteFrame)
    listSpriteFrameFree: SpriteFrame[] = [];
    onLoad() {
        super.onLoad();
        this.node.on("RESET_UI_TUTORIAL_MODE", this.resetButton, this);
    }
    onClickReal() {
        // this.onSkipTutorial();
        this.guiMgr.trialButton.emit("ON_CLICK_REAL_BUTTON");
    }

    onSkipTutorial() {
        (this.guiMgr as UIManager8000).startTrialMode();
        this.resetButton();
    }

    onClickBonus(event: Event, CustomEventData) {
        // this.guiMgr.tutorialMgr.node.emit("SELECT_MODE_TUTORIAL", CustomEventData);
        this.guiMgr.tutorialMgr.setTutorialMode(CustomEventData);
        if (this.bonusOption) {
            this.onStatusButton(CustomEventData, false);
        }

    }
    onClickFree(event: Event, CustomEventData) {
        // this.guiMgr.tutorialMgr.node.emit("SELECT_MODE_TUTORIAL", CustomEventData);
        this.guiMgr.tutorialMgr.setTutorialMode(CustomEventData);
        if (this.freeGameOption) {
            this.onStatusButton(CustomEventData, false);
        }
    }
    onStatusButton(CustomEventData, onActive) {
        let indexMode = parseInt(CustomEventData);
        if (indexMode === 1) {
            if (this.freeGameOption) {
                if (onActive) {
                    this.freeGameOption.getComponent(Sprite).spriteFrame = this.listSpriteFrameFree[0]
                } else {
                    this.freeGameOption.getComponent(Sprite).spriteFrame = this.listSpriteFrameFree[1]
                }
                this.freeGameOption.children.forEach(child => {
                    child.getComponent(Button).interactable = onActive;
                })
            }
        } else {
            if (this.bonusOption) {
                if (onActive) {
                    this.bonusOption.getComponent(Sprite).spriteFrame = this.listSpriteFrameBonus[0]
                } else {
                    this.bonusOption.getComponent(Sprite).spriteFrame = this.listSpriteFrameBonus[1]
                }
                this.bonusOption.children.forEach(child => {
                    child.getComponent(Button).interactable = onActive;
                })
            }
        }
    }

    resetButton() {
        this.onStatusButton(1, true)//1 is Mode Free
        this.onStatusButton(2, true)//2 is Mode Bonus
    }

}

