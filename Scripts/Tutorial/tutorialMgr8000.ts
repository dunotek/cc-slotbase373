import { _decorator, Button, Component, JsonAsset, Node, tween, UIOpacity } from 'cc';
import { TutorialMgr } from '../../../../cc-common/cc-slotbase/scripts/component/TutorialMgr';
import { SlotGameMode, TutorialTriggerType } from '../../../../cc-common/cc-slotbase/scripts/component/CustomEnum';
import xorCipher from '../../../../cc-common/cc-share/shareServices/XOCypher';
import EventNames from '../../../../cc-common/cc-slotbase/scripts/core/EventNames';
const { ccclass, property } = _decorator;

@ccclass('tutorialMgr8000')
export class tutorialMgr8000 extends TutorialMgr {
    @property({ type: JsonAsset }) tutorialDataFree = null;
    @property({ type: JsonAsset }) tutorialDataBonus = null;
    @property(Node) gameModeSelection: Node = null;
    @property(Node)
    TutorialPopup: Node = null;

    trialButtonComp: any = null;
    count = 0;
    tutorialLimitSpinAmount = 21;
    init() {
        //this.mainDirector.gameStateManager.bindTutorialData(this.tutorialData.json);
        this.inited = true;
        this.flags = [];
        this.unlockAll();
        this.slotButtons = this.mainDirector.getComponentsInChildren("SlotButton");
        this.jackpotReset = false;

        if (this.config.IS_SUPPORT_MULTI_CURRENCY && this.tutorialDataConfigs.length) {
            const currencyCode = this.mainDirector.currencyCode.toUpperCase();
            const dataConfig = this.tutorialDataConfigs.find(config => config.currencyCode.toUpperCase() == currencyCode) || {};
            this.tutorialData = dataConfig.tutorialData?.json || null;
            this.tutorialSteps = dataConfig.tutorialSteps || this.tutorialSteps;
            this.tutorialText = dataConfig.tutorialText || this.tutorialText;
            if (this.tutorialData || this.tutorialData.json) {
                this.mainDirector.gameStateManager.bindTutorialData(this.tutorialData);
            } else {
                this.forceSkipTutorial = true;
            }
        }

        if (this.tutorialData) {
            const { data: encryptData, isEncrypted } = this.tutorialData;
            if (isEncrypted) {
                const decryptData = xorCipher.decode_tutorial(encryptData);
                this.tutorialData = JSON.parse(decryptData);
                this.mainDirector.gameStateManager._spinTutorialData = this.tutorialData;
            }
        }
    }

    onEnable() {
    }

    onLoad() {
        super.onLoad();
        this.node.on('SELECT_MODE_TUTORIAL', this.setTutorialMode, this);
        this.node.on("RESET_UI_TUTORIAL_MODE", this.resetUITuto, this);
    }
    resetUITuto() {
        this.gameModeSelection.emit("RESET_UI_TUTORIAL_MODE");
    }
    // onSwitchModeReal() {
    //     this.guiMgr.node.emit("SWITCH_MODE_TUTORIAL");
    //     this.guiMgr.node.emit("SKIP_TUTORIAL");
    //     this.guiMgr.trialButton.emit("ON_CLICK_REAL_BUTTON");
    // }

    _openGameModeSelection() {
        this.initJackpot();
        if (this.gameModeSelection) {
            this.gameModeSelection.active = true;
            this.setOpacity(this.gameModeSelection, 255);
        }
        this._unlockTouch();
    }

    startTrialMode() {
        this.dataStore.lastEvent.isTutorial = false;
        this.count = 0;
        this.skipTutorial();
        this.exitTutorial();
    }

    updateTutorialCounter() {
        if (this.count <= this.tutorialLimitSpinAmount) {
            this.count = this.count + 1;
        } else {
            this.count = 1;
        }
    }

    isLimited() {
        if (this.count == this.tutorialLimitSpinAmount + 1) {
            return true;
        }
        return false;
    }

    exitTutorial() {
        this.initJackpot();
        this.hideGameModeSelection();
    };

    hideGameModeSelection() {
        if (this.gameModeSelection) {
            this.gameModeSelection.active = false;
        }
    }
    setTutorialMode(customEventData) {
        let tutorialModeSelection;
        tutorialModeSelection = parseInt(customEventData);
        if (tutorialModeSelection === 1) {
            this.tutorialData = this.tutorialDataFree.json;
        } else if (tutorialModeSelection === 2) {
            this.tutorialData = this.tutorialDataBonus.json;
        }
        this.mainDirector.gameStateManager._spinTutorialData = this.tutorialData;
        this.mainDirector.gameStateManager._spinTutorialIndex = 0;
        this.guiMgr.onIngameEvent(TutorialTriggerType.AnyAction, 'SELECTED_GAME_MODE');
        this.hideGameModeSelection();
        this.buttonSkip.active = false;
        this.buttonSkip.getComponent(Button).interactable = false;
    }

    _onShowButtonBack() {
        // this.buttonSkip.active = true;
        // tween(this.buttonSkip).delay(1).call(() => {
        //     this.buttonSkip.getComponent(Button).interactable = true;
        // }).start();

        // const trialButtonComp = this.guiMgr.trialButton.mainComponent;
        // if (trialButtonComp) trialButtonComp.playRealButton.active = true;

    }
    _startSpinning() {
        this.mainDirector.showTrialButtons(false);
        this.mainDirector.node.emit('8000_START_SPIN_TUTO');
    }
    _showPopupFinishTutorial() {
        this.startTrialMode();
        const finishTutorialString = `${this.config.GAME_TEXT.FINISH_TUTORIAL_STRING}`;
        this.showPopupTutorial(finishTutorialString);
        this.trigger("GAME_RESET_SESSION");
    }
    _onFinishedTutorial() {
        //this.resetTrialWallet();
        this.initJackpot();
    }
    startTutorial() {
        if (!this.trialButtonComp) {
            this.trialButtonComp = this.guiMgr.trialButton.mainComponent;
        }

        this.unscheduleAllCallbacks();
        super.startTutorial();
    };

    showPopup21spins() {
        const TutorialString21 = `${this.config.GAME_TEXT.TUTORIAL_STRING_21_SPINS}`;
        this.showPopupTutorial(TutorialString21);
    }
    showPopupTutorial(finishTutorialString) {
        this.TutorialPopup.emit("SHOW_POPUP_TUTORIAL", finishTutorialString);
    }
}