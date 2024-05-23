import { _decorator, Button, Component, Node, Sprite, SpriteFrame } from 'cc';
import { SlotBetHistoryDetail } from '../../../../cc-common/cc-slotbase/scripts/component/BetHistory/SlotBetHistoryDetail';
const { ccclass, property } = _decorator;

@ccclass('SlotBetHistoryDetail8000')
export class SlotBetHistoryDetail8000 extends SlotBetHistoryDetail {
    setButtonProperties(button, isActive, isInteractable) {
        button.getComponentInChildren(Sprite).node.active = isActive;
        button.getComponent(Button).interactable = isInteractable;
    }
    onDisable() {
        this.node.active = false;
    }
    resetUI() {
        super.resetUI();
        this.bonusGameBtn.getComponentInChildren(Sprite).spriteFrame = null;
        this.freeGameBtn.getComponentInChildren(Sprite).spriteFrame = null;
        this.normalGameBtn.getComponentInChildren(Sprite).spriteFrame = null;
    }
    onShowGameMode(event, mode) {
        this.hideAllView();
        this.enableGameModeButtons(true);
        if (this.soundPlayer) this.soundPlayer.playSFXClick();
        this.gameMode = Number(mode);
        if (this.normalGameView) this.normalGameView.emit('CLEAR_TABLE');
        if (this.freeGameView) this.freeGameView.emit('CLEAR_TABLE');
        if (this.bonusView) this.bonusView.emit('CLEAR_TABLE');
        if (this.topUpView) this.topUpView.emit('CLEAR_TABLE');

        if (this.jackpotView) this.jackpotView.emit('CLEAR_TABLE');
        this.indexGameMode = this.gameModes.indexOf(this.gameMode);

        switch (this.gameMode) {
            case 0:
                this.summaryBtn.getComponentInChildren(Sprite).node.active = true;
                this.bonusGameBtn.getComponentInChildren(Sprite).node.active = false;
                this.freeGameBtn.getComponentInChildren(Sprite).node.active = false;
                this.normalGameBtn.getComponentInChildren(Sprite).node.active = false;
                this.summaryBtn.getComponent(Button).interactable = false;
                this.summaryView.active = true;
                break;
            case 1:
                this.summaryBtn.getComponentInChildren(Sprite).node.active = false;
                this.normalGameBtn.getComponentInChildren(Sprite).node.active = true;
                this.bonusGameBtn.getComponentInChildren(Sprite).node.active = false;
                this.freeGameBtn.getComponentInChildren(Sprite).node.active = false;
                this.normalGameBtn.getComponent(Button).interactable = false;
                this.normalGameView.active = true;
                if (this.normalGameData) this.updateGameMode(this.normalGameData);
                else if (this.normalIndex >= 0) this.requestDetail(this.normalIndex);
                break;
            case 2:
                this.summaryBtn.getComponentInChildren(Sprite).node.active = false;
                this.normalGameBtn.getComponentInChildren(Sprite).node.active = false;
                this.freeGameBtn.getComponentInChildren(Sprite).node.active = true;
                this.bonusGameBtn.getComponentInChildren(Sprite).node.active = false;
                this.freeGameBtn.getComponent(Button).interactable = false;
                this.freeGameView.active = true;
                if (this.freeGameData[this.currentFreeGamePage]) this.updateGameMode(this.freeGameData[this.currentFreeGamePage]);
                else if (this.freeIndexes.length && this.freeIndexes[this.currentFreeGamePage] >= 1) this.requestDetail(this.freeIndexes[this.currentFreeGamePage]);
                break;
            case 3:
                if (this.jackpotBtn) this.jackpotBtn.getComponent(Button).interactable = false;
                if (this.jackpotView) this.jackpotView.active = true;
                if (this.jackpotData[this.currentJackpotPage]) this.updateGameMode(this.jackpotData[this.currentJackpotPage]);
                else if (this.jackpotIndexes.length && this.jackpotIndexes[this.currentJackpotPage] >= 0) this.requestDetail(this.jackpotIndexes[this.currentJackpotPage]);
                break;
            case 4:
                this.summaryBtn.getComponentInChildren(Sprite).node.active = false;
                this.normalGameBtn.getComponentInChildren(Sprite).node.active = false;
                this.freeGameBtn.getComponentInChildren(Sprite).node.active = false;
                this.bonusGameBtn.getComponentInChildren(Sprite).node.active = true;
                if (this.bonusGameBtn) this.bonusGameBtn.getComponent(Button).interactable = false;
                if (this.bonusView) this.bonusView.active = true;
                if (this.bonusGameData[this.currentBonusGamePage]) this.updateGameMode(this.bonusGameData[this.currentBonusGamePage]);
                else if (this.bonusIndexes.length && this.bonusIndexes[this.currentBonusGamePage] >= 1) this.requestDetail(this.bonusIndexes[this.currentBonusGamePage]);
                break;
            default:
                break;
        }
    }
}

