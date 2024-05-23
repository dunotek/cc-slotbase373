import { _decorator, Button, Node, tween, Tween } from 'cc';
import { UIManager } from '../../../../cc-common/cc-slotbase/scripts/core/UIManager';
import { SlotGameMode, SlotSceneType } from '../../../../cc-common/cc-slotbase/scripts/component/CustomEnum';
const { ccclass, property } = _decorator;

@ccclass('UIManager8000')
export class UIManager8000 extends UIManager {
    @property(Node)
    botUI: Node = null;

    @property([Node])
    jackpots: Node[] = [];

    onLoad() {
        super.onLoad();
        this.node.on('SWITCH_MODE_TUTORIAL', this.switchToRealMode, this);
        this.node.on('START_TRIAL_MODE', this.startTrialMode, this);
    }

    setupUI() {
        this.sceneHolder.active = true;
        for (let i = 0; i < this.sceneHolder.children.length; i++) {
            const child = this.sceneHolder.children[i];
            if (child) {
                child.active = true;
            }
        }
        this.popups = [SlotSceneType.Setting, SlotSceneType.BetHistory, SlotSceneType.JackpotHistory, SlotSceneType.GameInfo];
        this.enableTrialBtn(false);
        this.trialButton.on("SWITCH_MODE", this.switchMode, this);
        this.buttons = this.controllerHolder.getComponentsInChildren(Button);
        this.buttons.forEach(it => {
            it.interactable = false;
        })
    }

    switchToRealMode() {
        const gameMode = this.dataStore.currentGameMode;
        super.switchToRealMode();
        if (this.mainDirector) {
            if (gameMode !== SlotGameMode.BonusGame) {
                (this.mainDirector.currentGameMode as any).director.fastToResultClick();
                (this.mainDirector.currentGameMode as any).director.enableSpin();
            }
            this.mainDirector.leaveGameTrialPlaysession();
        }

        this.jackpot.emit("RESUME_JACKPOT");

        this.hideCutScene(SlotSceneType.TotalWinPanel);
        this.hideCutScene(SlotSceneType.BigWin);
        this.hideCutScene(SlotSceneType.JackpotWin);

        this.forceToExitNormal();
        if (gameMode == SlotGameMode.NormalGame) {
            return;
        }

        if (gameMode === SlotGameMode.FreeGame) {
            this.forceToExitFree();
        }

        if (gameMode === SlotGameMode.BonusGame) {
            this.forceToExitBonus();
            this.forceToExitFree(true);
        }


    }

    forceToExitNormal() {
        const exitScriptNormal = [];
        const gameMode = this.dataStore.currentGameMode;
        if (gameMode != SlotGameMode.NormalGame) {
            exitScriptNormal.push({
                command: "_resumeGameMode",
                data: {
                    name: SlotGameMode.NormalGame,
                },
            });
        }

        exitScriptNormal.push({
            command: "_resumeUpdateJP",
        });
        exitScriptNormal.push({
            command: "_clearTrialGame"
        });
        exitScriptNormal.push({
            command: "_clearWinAmount"
        });
        exitScriptNormal.push({
            command: "_enableBet"
        });
        exitScriptNormal.push({
            command: "_resetSpinButton"
        });
        exitScriptNormal.push({
            command: "_stopAutoSpin"
        });
        exitScriptNormal.push({
            command: "_clearPaylines",
        });
        exitScriptNormal.push({
            command: "_gameFinish"
        });
        exitScriptNormal.push({
            command: "_gameRestart"
        });
        this.mainDirector.gameModes[SlotGameMode.NormalGame].emit('FORCE_TO_EXIT', exitScriptNormal);
    }

    forceToExitFree(isForce = false) {
        const exitScriptFree = [];
        exitScriptFree.push({
            command: "_delayTimeScript",
            data: 0.1,
        });
        exitScriptFree.push({
            command: "_clearPaylines",
        });
        exitScriptFree.push({
            command: "_clearTrialGame",
        });
        exitScriptFree.push({
            command: "_gameExit",
        });

        let freeDirector = this.mainDirector.gameModes[SlotGameMode.FreeGame]

        this.scheduleOnce(() => {
            freeDirector.emit('FORCE_TO_EXIT', exitScriptFree);
            if (isForce) freeDirector["director"].executeNextScript(exitScriptFree);
        }, isForce ? 0 : 0.3);

    }

    forceToExitBonus() {
        const exitScriptBonus = [];
        exitScriptBonus.push({
            command: "_delayTimeScript",
            data: 0.1,
        });
        exitScriptBonus.push({
            command: "_clearTrialGame",
        });
        exitScriptBonus.push({
            command: "_gameExit",
        });

        let bonusDirector = this.mainDirector.gameModes[SlotGameMode.BonusGame];
        Tween.stopAllByTarget((bonusDirector as any).director.table)
        bonusDirector.emit('FORCE_TO_EXIT', exitScriptBonus);
        bonusDirector["director"].executeNextScript(exitScriptBonus);
    }

    isSpinVisible() {
        let cutsceneDisplay = this.sceneComp.filter(it => it.node.active == true).length > 0;
        let isTutorial = !this.isTutorialFinished();
        let result = !cutsceneDisplay && !isTutorial && !this.tutorialMgr.TutorialPopup && this.extraSpinCheck();
        return result;
    }

    hideAllUI() {
        super.hideAllUI();
        this.topUI.active = false;
        this.botUI.active = false;
    }

    showUIBonus() {
        super.showUIBonus();
        if (this.dataStore.isTrialMode) {
            this.botUI.active = true;
            this.winAmount.active = false;
            this.trialButton.active = true;
            this.trialButton.emit("ENABLE_BUTTONS", true);
        }
    }

    showUIFree() {
        super.showUIFree();
        this.topUI.active = true;
        this.botUI.active = true;
        if (this.dataStore.isTrialMode) {
            this.trialButton.active = true;
        }
        this.bet.active = true;
        this.wallet.active = true;
    }

    showUIMain() {
        super.showUIMain();
        this.topUI.active = true;
        this.botUI.active = true;
    }

    fadeOutWinAmount() {
        this.winAmount.emit("FADE_OUT_NUMBER", !this.dataStore.isAutoSpin ? 0.2 : 0.8);
    }

    fadeInWinAmount() {
        this.winAmount.emit("FADE_OUT_NUMBER", 0.2);
    }

    switchToTrialMode() {

        this.hideCutScene(SlotSceneType.BigWin);
        this.hideCutScene(SlotSceneType.JackpotWin);

        super.switchToTrialMode();
        //this.showGameModeSelection();
    };

    skipTutorial() {
        if (!this.tutorialMgr) return;
        this.tutorialMgr.skipTutorial();
        this.tutorialMgr.exitTutorial();
    }
    startTrialMode() {
        if (!this.tutorialMgr) return;
        if (this.soundPlayer) {
            this.soundPlayer.playSFXClick();
        }
        this.tutorialMgr.startTrialMode();
    }

    updateWinAmount(data, callback: any = null) {
        this.winAmount.emit("UPDATE_WIN_AMOUNT", data, () => {
            callback && callback();
        });
    }

    // -------------- Jackpot -------------
    initJackpot(data) {
        this.jackpot.emit("INIT_JACKPOT", data);
        // this.jackpots.forEach(jackpot => {
        //     jackpot.emit("INIT_JACKPOT", data);
        // });
    };

    updateJackpot(data) {
        this.jackpot.emit("UPDATE_JACKPOT", data);
        // this.jackpots.forEach(jackpot => {
        //     jackpot.emit("UPDATE_JACKPOT", data);
        // });
    };

    /**@Jackpot */
    updateValueJP(data) {
        const {jpType, jpValue} = data;
        this.jackpot.emit('UPDATE_VALUE_JACKPOT', jpType, jpValue);
        // const { jpType, jpValue } = data;
        // this.jackpots.forEach(jackpot => {
        //     jackpot.emit('UPDATE_VALUE_JACKPOT', jpType, jpValue);
        // });
    }

    pauseJackpot() {
        this.jackpot.emit('PAUSE_JACKPOT');
        // this.jackpots.forEach(jackpot => {
        //     jackpot.emit("PAUSE_JACKPOT");
        // });
    }

    resumeJackpot() {
        this.jackpot.emit('RESUME_JACKPOT');
        // this.jackpots.forEach(jackpot => {
        //     jackpot.emit("RESUME_JACKPOT");
        // });
    }
}