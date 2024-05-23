import { _decorator, Node } from 'cc';
import { SlotTablePayline } from '../../../../cc-common/cc-slotbase/scripts/table/SlotTablePayline';
import { PoolFactory } from '../../../../cc-common/cc-slotbase/scripts/component/PoolFactory';
import { PerformanceLevel, SlotGameMode } from '../../../../cc-common/cc-slotbase/scripts/component/CustomEnum';
import EventNames from '../../../../cc-common/cc-slotbase/scripts/core/EventNames';
const { ccclass } = _decorator;
@ccclass('SlotTablePayline8000')
export class SlotTablePayline8000 extends SlotTablePayline {
    validPaylines = {};
    validPaylinesScatter = {};
    isShowHighPayline: boolean = false;
    numberHighPayline: number = 1;

    onLoad() {
        super.onLoad();
        this.node.on("ON_REEL_STOP", this.onReelStop, this);
        this.node.on("PLAY_NEAR_WIN", this.playNearWin, this);
        this.node.on("PLAY_WIN_SCATTER", this.playWinScatter, this);
        this.node.on("PLAY_ANIM_SCATTER_IDLE", this.playScatterIdle, this);
        this.node.on("PLAY_ANIM_BONUS_IDLE", this.playBonusIdle, this);
        this.node.on("PLAY_WIN_BONUS", this.playWinBonus, this);
        this.node.on("PLAY_LOSE_JACKPOT", this.playJackpotLose, this);

        this.node.on('SET_UP_PAYLINE_COLUM', this.setUpPaylineCol, this);
        this.node.on("ENABLE_HIGHLIGHT_SPECIAL_SYMBOLS", this.enableHighlightSpecialSymbols, this);
        this.node.on("PLAY_COMPLETE_FEATURE_SYMBOLS", this.playCompleteFeatureSymbols, this);
    }

    onReelStop(col, matrix) {
        this.setUpPaylineCol(col)
        this.playAnimAppearAtCol(col, matrix);
    }

    playAnimAppearAtCol(col, matrix) {
        const indexScatter = matrix.indexOf("A");
        const indexBonus = matrix.indexOf("R");
        const indexK3 = matrix.indexOf("K3");

        if (indexScatter >= 0) {
            this.playAnimAppear(col, indexScatter);
        }

        if (indexBonus >= 0) {
            this.playAnimAppear(col, indexBonus);
        }

        if (indexK3 >= 0) {
            this.playAnimAppear(col, indexK3);
        }
    }

    playAnimAppear(col, row) {
        if (!this.paylinesMatrix) return;

        const payline = this.paylinesMatrix[col][row];
        if (payline) {
            const { symbol, paylineSymbol } = payline;
            if (paylineSymbol && paylineSymbol.havingAnim) {
                paylineSymbol.emit('PLAY_ANIM_APPEAR');
                symbol.emit('HIDE_STATIC_SYMBOL');
            }
        }
    }

    playNearWin({ isNearWinScatter, isNearWinBonus, isNearWinJackpot }) {
        let holder = null;

        if (isNearWinScatter)
            holder = this.scatterHolderNode;

        if (isNearWinBonus)
            holder = this.bonusHolderNode;

        if (isNearWinJackpot)
            holder = this.jackpotHolderNode;

        if (holder)
            holder.forEach((child) => {
                const { paylineSymbol } = child;
                if (paylineSymbol) {
                    paylineSymbol.emit('PLAY_SPECIFIC_ANIMATION', "NearWin");
                }
            });
    }

    playWinScatter() {
        this.scatterHolderNode.forEach((child) => {
            const { paylineSymbol } = child;
            if (paylineSymbol) {
                paylineSymbol.emit('PLAY_SPECIFIC_ANIMATION', "Win");
            }
        });
    }

    playWinBonus() {
        this.scatterHolderNode.forEach((child) => {
            const { paylineSymbol } = child;
            if (paylineSymbol) {
                paylineSymbol.emit('PLAY_ANIM_WIN_BONUS');
            }
        });
    }

    playScatterIdle() {
        this.scatterHolderNode.forEach((child) => {
            const { paylineSymbol } = child;
            if (paylineSymbol) {
                paylineSymbol.emit('PLAY_SPECIFIC_ANIMATION', "Idle");
            }
        });
    }

    playBonusIdle() {
        this.bonusHolderNode.forEach((child) => {
            const { paylineSymbol } = child;
            if (paylineSymbol) {
                paylineSymbol.emit('PLAY_SPECIFIC_ANIMATION', "Idle");
            }
        });
    }

    setupPaylines(matrix = [], payLines = []) {
        const isTurbo = (this.dataStore && this.dataStore.modeTurbo) || false;
        const performanceLvl = (this.dataStore && this.dataStore.performanceLevel) || 'HIGH_PERFORMANCE_LV';
        this.curentConfig = this.config[isTurbo ? 'TABLE_TURBO' : 'TABLE_NORMAL'];
        this.animationLevel = this.config[performanceLvl].PAYLINE_ANIMATION;
        this.paylineHolder.active = true;
        this.payLineNormals = payLines;
        this.matrix = matrix;
        this.resetPaylineHolder();
    };

    setUpPaylineCol(col) {
        if (!this.matrix || (this.matrix && this.matrix.length < 1)) return;
        const tableFormat = (this.node as any).tableFormat;
        this.paylinesMatrix[col] = [];
        for (let row = 0; row < tableFormat[col]; ++row) {
            this.createPaylineObject(col, row);
        }
    }

    createPaylineObject(col: number, row: number): any {
        const reels = (this.node as any).reels;
        const showSymbols: Node[] = reels[col].getShowSymbols();
        const symbol = showSymbols[row];
        if (!symbol) return null;

        const symbolName = symbol['symbol'];
        const spineData = this.getSymbolSpineData(symbolName as string);
        if (!this.poolFactory) this.poolFactory = this.mainDirector.poolFactory as PoolFactory;
        const isSymbolAnimated = (this.animationLevel >= Number(PerformanceLevel.Medium)) && spineData != null;
        symbol.emit("INIT_FOR_PAYLINE", this.staticPaylineHolder, this.poolFactory.node, isSymbolAnimated);
        const paylineSymbol = this.createPaylineSymbol(symbolName, col, row, isSymbolAnimated ? spineData : null);
        const payline = { symbol, paylineSymbol };
        if (this.showWinLineFrame) {
            const winLineFrame = this.createWinLineFrame(col, row);
            payline['winLineFrame'] = winLineFrame;
        }
        payline['isShowing'] = true;
        this.paylinesMatrix[col][row] = payline;

        if (symbolName == "A") {
            this.scatterHolderNode.push(payline);
        }

        if (symbolName == "R") {
            this.bonusHolderNode.push(payline);
        }

        if (symbolName.includes("K")) {
            this.wildHolderNode.push(payline);
            this.jackpotHolderNode.push(payline);
        }

        return payline;
    }

    showBigWild(currentGameMode: SlotGameMode, isResume: boolean = false) {
        console.log('showBigWild', currentGameMode, isResume);
    }

    showNormalPaylinePerline({ payLineID, payLineWinNumbers, symbolName }) {
        this.disableHighlightNormalPaylines();
        let payline = this.config.PAY_LINE_MATRIX[payLineID];
        let wildWinLine = [];
        if (payline && payline.length > 0 && this.paylinesMatrix && this.paylinesMatrix.length > 0) {
            for (let paylinePos = 0; paylinePos < payLineWinNumbers; ++paylinePos) {
                const row = payline[paylinePos];
                const col = paylinePos;
                const { symbol, paylineSymbol, winLineFrame, isShowing } = this.paylinesMatrix[col][row];

                if (symbol && paylineSymbol && isShowing) {
                    if (symbol.symbol === symbolName || symbol.symbol.includes(this.config.WILD_SYMBOL)) {
                        symbol.emit('ENABLE_HIGHLIGHT');

                        if (paylineSymbol.havingAnim) {
                            paylineSymbol.emit('PLAY_ANIMATION');
                            paylineSymbol.emit('ENABLE_HIGHLIGHT');
                        }
                       
                    }
                }

                if (this.matrix[col].includes("K1") || this.matrix[col].includes("K2"))
                    wildWinLine.push(col);

                if (winLineFrame) winLineFrame.active = true;
            }

            if (wildWinLine.length > 0) {
                this.node.emit("ENABLE_BIG_WILD", wildWinLine);
            }
        }
    }

    disableHighlightNormalPaylines() {
        for (let col = 0; col < this.paylinesMatrix.length; ++col) {
            for (let row = 0; row < this.paylinesMatrix[col].length; ++row) {
                const { symbol, paylineSymbol, winLineFrame } = this.paylinesMatrix[col][row];
                if (symbol && paylineSymbol) {
                    symbol.emit('DISABLE_HIGHLIGHT');
                    paylineSymbol.emit('DISABLE_HIGHLIGHT');
                }
                if (winLineFrame) winLineFrame.active = false;
            }
        }
        if (this.dimBackground) this.dimBackground.active = true;
        this.node.emit("DISABLE_BIG_WILD");
    }

    enableHighlightSpecialSymbols() {
        let specialSymbol = ["A", "R"];
        for (let col = 0; col < this.paylinesMatrix.length; ++col) {
            for (let row = 0; row < this.paylinesMatrix[col].length; ++row) {
                const { symbol, paylineSymbol } = this.paylinesMatrix[col][row];
                if (symbol && specialSymbol.indexOf(symbol.symbol) >= 0) {
                    symbol.emit('ENABLE_HIGHLIGHT');
                    if (paylineSymbol) paylineSymbol.emit('ENABLE_HIGHLIGHT');
                }
            }
        }
    }

    playCompleteFeatureSymbols(completeFeatureSymbols, isHighlight) {
        for (let col = 0; col < this.paylinesMatrix.length; ++col) {
            for (let row = 0; row < this.paylinesMatrix[col].length; ++row) {
                const { symbol, paylineSymbol } = this.paylinesMatrix[col][row];
                if (!symbol || !paylineSymbol) continue;

                if (completeFeatureSymbols.indexOf(symbol.symbol) >= 0) {
                    if (isHighlight) {
                        symbol.emit('ENABLE_HIGHLIGHT');
                        paylineSymbol.emit('ENABLE_HIGHLIGHT');
                    }

                    if (completeFeatureSymbols == 'R')
                        paylineSymbol.emit('PLAY_SPECIFIC_ANIMATION', "Idle2", true);

                    if (completeFeatureSymbols == 'A')
                        paylineSymbol.emit('PLAY_SPECIFIC_ANIMATION', "Win", true);
                }
            }
        }
    }

    blinkNormalPaylinePerline({ payLineID, payLineWinNumbers }) {
        let payline = this.config.PAY_LINE_MATRIX[payLineID];
        for (let paylinePos = 0; paylinePos < payLineWinNumbers; ++paylinePos) {
            const row = payline[paylinePos];
            const col = paylinePos;

            let paylineObject = (this.paylinesMatrix[col] && this.paylinesMatrix[col][row]) ? this.paylinesMatrix[col][row] : this.createPaylineObject(col, row);
            if (!paylineObject) return;
            const { symbol, winLineFrame, paylineSymbol } = paylineObject;
            if (symbol) {
                symbol.emit('BLINK_HIGHLIGHT', this.curentConfig.BLINK_DURATION, this.curentConfig.BLINKS);

                paylineSymbol.emit('PLAY_ANIMATION');
                paylineSymbol.emit('ENABLE_HIGHLIGHT');

                if (paylineSymbol.active && paylineSymbol.isShowingAnim) {
                    symbol.emit('HIDE_STATIC_SYMBOL');
                }
            }

            if (winLineFrame) winLineFrame.active = true;
        }
    }

    blinkHighlightPaylines(callback = () => { }) {
        if (!this.payLineNormals) {
            callback && callback();
            return;
        }
        this._blinkingCallback = () => {
            callback && callback();
            this._blinkingCallback = null;
        };
        const dataStore = (this.node as any).dataStore;
        const { timeBlinkAllLines } = dataStore.playSession.dataWinAmount;

        this.setOpacity(this.paylineHolder, 255);
        this.disableHighlightNormalPaylines();
        if (this.showDrawingLine && this.eventManager) this.eventManager.emit(EventNames.DRAWING_LINE_CLEAR);
        for (let i = 0; i < this.payLineNormals.length; ++i) {
            this.blinkNormalPayline(this.payLineNormals[i]);
            if (this.showDrawingLine && this.eventManager) this.drawPayline(this.payLineNormals[i]);
        }
        this.node.emit('BLINK_ALL_PAYLINE');

        let wildWinLine = [];

        for (let i = 0; i < this.payLineNormals.length; ++i) {
            const { payLineWinNumbers } = this.payLineNormals[i];
            for (let paylinePos = 0; paylinePos < payLineWinNumbers; paylinePos++) {
                const col = paylinePos;
                if (this.matrix[col].includes("K1") || this.matrix[col].includes("K2")) {
                    if (wildWinLine.indexOf(col) == -1)
                        wildWinLine.push(col);
                }
            }
        }

        this.node.emit("ENABLE_BIG_WILD", wildWinLine);

        this.scheduleOnce(this._blinkingCallback, timeBlinkAllLines);
    }

    showAllNormalPayLines(callback, index = 0) {
        if (!this.payLineNormals) {
            callback && callback();
            return;
        }
        this.paylineIndex = index;
        this.showingPayline = true;
        this.paylineType = 'normal';
        this._callbackShowPayline = callback;
        const dataStore = (this.node as any).dataStore;
        const { isShowHighPayline, numberHighPayline, timePerPaylines } = dataStore.playSession.dataWinAmount;

        if (isShowHighPayline) {
            this.isShowHighPayline = isShowHighPayline;
            this.nextPaylineTime = timePerPaylines;
            this.numberHighPayline = numberHighPayline;
        } else {
            if (dataStore && !dataStore.isAutoSpin) {
                this.nextPaylineTime = this.curentConfig.EXPECT_PAYLINE_ALLWAYS_TIME;
            } else {
                this.nextPaylineTime = Math.max(this.curentConfig.EXPECT_PAYLINE_TIME / this.payLineNormals.length, this.curentConfig.MIN_TIME_EACH_PAYLINE);
            }
        }

        this.showNextPayline();
    };

    update(dt: number) {
        if (this.paylineTime > 0 && this.showingPayline) {
            this.paylineTime -= dt;
            if (this.paylineTime <= 0) {
                if (this.isShowHighPayline && this.paylineIndex >= this.numberHighPayline) {
                    this.showingPayline = false;
                }
                this.showNextPayline();
            }
        }
    }

    showJackpotPayLine(jpPayLineID, callback) {
        this.drawPayline({ payLineID: jpPayLineID });
        this.playJackpotPayline(callback);
    };

    playJackpotPayline(callback) {
        this.hideShowingPayline();
        this.setOpacity(this.paylineHolder, 255);
        this.disableHighlightNormalPaylines();
        this.jackpotHolderNode.forEach((child) => {
            const { symbol, paylineSymbol } = child;
            if (symbol) symbol.emit('ENABLE_HIGHLIGHT');
            if (paylineSymbol) {
                paylineSymbol.emit('PLAY_ANIMATION_JACKPOT');
                paylineSymbol.emit('ENABLE_HIGHLIGHT');
            }
        });

        this._callbackSpecialPayline = () => {
            if (callback && typeof callback == "function") {
                callback();
            }
        }

        this.node.emit("SHOW_BIG_WILD_WIN_JACKPOT");
        this.scheduleOnce(this._callbackSpecialPayline, this.curentConfig.ANIMATION_DURATION);
    }

    playJackpotLose(callback) {
        // this.unscheduleAllCallbacks();
        let callbackSLose = () => {
            if (callback && typeof callback == "function") {
                callback();
            }
        }

        this.node.emit("SHOW_BIG_WILD_LOSE_JACKPOT");
        this.scheduleOnce(callbackSLose, this.curentConfig.ANIMATION_DURATION);
    }

    drawPayline(paylineInfo) {
        this.eventManager && this.eventManager.emit(EventNames.DRAWING_LINE_ADD, paylineInfo);

        // let col = i;
        // let row = payline[i];
        // if (col == 0) {
        //     // add first line
        //     if (this.eventManager) {
        //         this.eventManager.emit(EventNames.DRAWING_LINE_ADD_FIRST, row);
        //     }
        // }
        // if (i < payline.length - 1) {
        //     let val = payline[i] - payline[i + 1];

        //     let type = 0;
        //     if (val == 0) type = 0; // di ngang
        //     else if (val == 1) type = 1; // cheo len 1 o
        //     else if (val == 2) type = 3; // cheo len 2 o
        //     else if (val == -1) type = 2; // cheo xuong 1 o
        //     else if (val == -2) type = 4; // cheo xuong 2 o
        //     if (this.eventManager) {
        //         this.eventManager.emit(EventNames.DRAWING_LINE_ADD, type, col, row);
        //     }
        // }
        // if (col == payline.length - 1) {
        //     // add last line
        //     if (this.eventManager) {
        //         this.eventManager.emit(EventNames.DRAWING_LINE_ADD_LAST, row);
        //     }
        // }
    }
}