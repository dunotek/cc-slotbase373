import { _decorator, error, log, tween } from 'cc';
import { SlotDirector } from '../../../../cc-common/cc-slotbase/scripts/core/SlotDirector';
import { script } from '../../../../cc-common/cc-slotbase/scripts/core/BaseDirector';
import { TutorialTriggerType } from '../../../../cc-common/cc-slotbase/scripts/component/CustomEnum';

const { ccclass } = _decorator;

@ccclass('MainGameDirector8000')
export class MainGameDirector8000 extends SlotDirector {

    timeWinAmount = 0;
    tweenCountWin = null;

    isDisplayBigWild = false;
    expandWildComplete: any = null;

    extendInit() {
        this.node.on('8000_START_SPIN_TUTO', this.startSpinTuto, this);
    }

    _playAnimIdleScatter(script = []) {
        this.table.emit('PLAY_ANIM_SCATTER_IDLE');
        this.executeNextScript(script);
    }

    _playWinScatter(script = [], data) {
        this.table.emit('PLAY_WIN_SCATTER', data);
        this.executeNextScript(script);
    }

    _triggerShowBigWild(script = []) {
        this.isDisplayBigWild = true;
        this.executeNextScript(script);
    }

    completeExpandBigWild() {
        if (this.expandWildComplete) {
            this.expandWildComplete();
        } else {
            this.isDisplayBigWild = false;
        }
    }

    _waitCompleteShowBigWild(script = []) {
        if (!this.isDisplayBigWild) {
            this.executeNextScript(script);
        } else {
            this.expandWildComplete = () => {
                this.isDisplayBigWild = false;
                this.expandWildComplete = null;
                this.executeNextScript(script);
            }
        }
    }

    _setUpPaylineCol(script = []) {
        const { NORMAL_TABLE_FORMAT } = this.config;
        for (let col = 0; col < NORMAL_TABLE_FORMAT.length; col++) {
            this.table.emit('SET_UP_PAYLINE_COLUM', col);
        }
        this.executeNextScript(script);
    }

    startSpinTuto() {
        this.slotButton.emit('8000_START_SPIN_TUTO');
    }

    _fadeInWinAmount(script = []) {
        // this.guiMgr.fadeInWinAmount();
        this.executeNextScript(script);
    }

    _waitingCountWinAmount(script = [], time = 0) {
        const callback = (isAsync = true) => {
            const { GAME_SPEED } = this.config;
            const { dataWinAmount } = this.dataStore.playSession

            const timeCountingWinAmount = dataWinAmount ? dataWinAmount.timeCountingWinAmount : 0;
            const isF2R = this.dataStore.gameSpeed == GAME_SPEED.INSTANTLY;
            if (isF2R) {
                time = timeCountingWinAmount;
            }

            this.tweenCountWin && this.tweenCountWin.stop();
            this.tweenCountWin = tween(this.node)
                .delay(time)
                .call(() => {
                    isAsync ? this.runAsyncScript() : this.executeNextScript(script);
                })
                .start();
        };

        if (this.canStoreAsyncScript()) {
            this.storeAsyncScript(script, { callback, name: "_waitingCountWinAmount", isSkippable: false });
        } else {
            callback(false);
        }
    }

    _resumeGameMode(script: script[] = [], { name, data }) {
        this.resetGameSpeed();
        if (!this.hasTable) {
            this.hasTable = true;
        }
        this.mainDirector.guiMgr.onIngameEvent(TutorialTriggerType.AnyAction, 'READY_NEW_SPIN');
        this.mainDirector.resumeGameMode({ name }, () => {
            if (this.soundPlayer) this.soundPlayer.stopAllAudio();
            if (this.soundPlayer) this.soundPlayer.playMainBGM(name);
            this.executeNextScript(script);
        });
        if (!this._autoSpin && this.slotButton && this.dataStore.playSession.isFinished == true) {
            this.slotButton.emit('SPIN_SHOW');
            this.slotButton.emit('SPIN_ENABLE');
            this.slotButton.emit('FAST_TO_RESULT_HIDE');
            this.slotButton.emit('STOP_AUTO_SPIN_HIDE', true);
        }
        this.guiMgr.setQuestPosition(this.questDummy);
    }
    _updateLastestWinAmount(script) {
        const winAmountPS = this.dataStore.playSession.winAmountPS;
        this.guiMgr.node.emit('UPDATE_LASEST_WINAMOUNT', winAmountPS);
        this.executeNextScript(script);
    }

    _showBigWin_2(script, data: any = null) {
        this._showBigWin(script, data);
    }

    _showBigWild(script, data) {
        const { matrix, isResume } = data;
        this.table.emit("SHOW_BIG_WILD", matrix, isResume);
        this.executeNextScript(script);
    }

    _clearTrialGame(script) {
        if (this.forceToExitMode) {
            this.dataStore.playSession = {};
            this.dataStore.spinTimes = 0;
            this.dataStore.isAutoSpin = false;
            this.fsm.actionTrigger();
            this.fsm.resultReceive();
            this.forceToExitMode = false;
        }
        this.executeNextScript(script);
    }

    _playCompleteFeatureSymbols(script, data) {
        const { completeFeatureSymbols, isHighlight } = data;
        this.table.emit("PLAY_COMPLETE_FEATURE_SYMBOLS", completeFeatureSymbols, isHighlight);
        this.executeNextScript(script);
    }

    _playIdleSpecialSymbol(script, data) {
        // const { isDimOtherSymbol = false } = data
        // if (isDimOtherSymbol) {
        //     this.table.emit("ENABLE_HIGHLIGHT_SPECIAL_SYMBOLS");
        // }

        this.table.emit("PLAY_ANIM_SCATTER_IDLE");
        this.table.emit("PLAY_ANIM_BONUS_IDLE");

        this.executeNextScript(script);
    }

    _updateWinningAmount(script = [], data) {
        const isFTR = this.dataStore.gameSpeed === this.config.GAME_SPEED.INSTANTLY;
        const { winAmount } = data;

        if (this.canStoreAsyncScript()) {
            const callback = () => {
                if (winAmount > 0 && !isFTR) {
                    const rate = winAmount / this.dataStore.getTotalBet();
                    this.playSoundWin(rate);
                }
                (this.guiMgr as any).updateWinAmount(data);
                this.runAsyncScript();
            };
            this.storeAsyncScript(script, { callback, name: "_updateWinningAmount", isSkippable: false });
        } else {
            if (winAmount > 0 && !isFTR) {
                const rate = winAmount / this.dataStore.getTotalBet();
                this.playSoundWin(rate);
            }
            (this.guiMgr as any).updateWinAmount(data);
            this.executeNextScript(script);
        }
    }

    executeNextScript(scripts: script[] = []) {
        if (!this.writer || !scripts || scripts.length == 0) return;
        this.scripts = scripts;
        if (this.forceToExitMode && this.exitScript && this.exitScript.length > 0) {
            this.scripts = this.exitScript;
        }
        const nextScript: script = this.scripts.shift();
        let { command, data } = nextScript;
        let executeFunc: any = this.getCommandName(command)
        if (typeof this[executeFunc] === 'function') {
            if (command != "_updateWallet") {
                log(this.name + " run command", executeFunc, data);
            }
            this[executeFunc](this.scripts, data);
        } else {
            error(`No command ${executeFunc} in ${this.name}`);
            this.executeNextScript(this.scripts);
        }
    }

    _showLoseJackpot(script = []) {
        this.table.emit("PLAY_LOSE_JACKPOT", () => {
            this.executeNextScript(script);
        });
    }

    spinClick() {
        if (this.dataStore.isTrialMode) {
            this.guiMgr.tutorialMgr.updateTutorialCounter();
            if (this.guiMgr.tutorialMgr.isLimited()) {
                this.scheduleOnce(() => {
                    this.stopAutoSpinClick();
                    this._resetSpinButton();
                    this._showTrialButtons(null, true);
                    this.guiMgr.enableBet()
                    this.slotButton.emit('FAST_TO_RESULT_HIDE');
                    this.slotButton.emit('FAST_TO_RESULT_DISABLE');

                }, 0.5);
                this.guiMgr.tutorialMgr.showPopup21spins();
                return;
            }
        }
        super.spinClick();
    }

    _runAutoSpin(script: script[]) {
        if (this.dataStore.isTrialMode) {
            this.guiMgr.tutorialMgr.updateTutorialCounter();
            if (this.guiMgr.tutorialMgr.isLimited()) {
                this.scheduleOnce(() => {
                    this.stopAutoSpinClick();
                    this._resetSpinButton();
                    this._showTrialButtons(null, true);
                    this.guiMgr.enableBet()
                    this.slotButton.emit('FAST_TO_RESULT_HIDE');
                    this.slotButton.emit('FAST_TO_RESULT_DISABLE');

                }, 0.5);
                this.guiMgr.tutorialMgr.showPopup21spins();
                return;
            }
        }
        super._runAutoSpin(script);
    }
}