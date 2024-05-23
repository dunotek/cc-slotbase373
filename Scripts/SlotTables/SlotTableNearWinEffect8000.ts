import { _decorator, Node, warn } from 'cc';
import { SlotTableNearWinEffect } from '../../../../cc-common/cc-slotbase/scripts/table/SlotTableNearWinEffect';
const { ccclass, property } = _decorator;

@ccclass('SlotTableNearWinEffect8000')
export class SlotTableNearWinEffect8000 extends SlotTableNearWinEffect {
    adjustReelDelay({ reels, matrix }) {
        const tableFormat: any[] = (this.node as any).tableFormat;
        let countScatter = 0;
        let countBonus = 0;
        let countJackpot = 0;
        let foundNearWin = false;
        this.nearWinList = [];

        let isSkipWhenTurbo = this.dataStore && this.dataStore.modeTurbo && this.isSkipNearWinTurbo;
        if (isSkipWhenTurbo) return;

        for (let col = 0; col < matrix.length; col++) {
            const isNearWinScatter = countScatter >= this.startAtScatterCount && countScatter < this.stopAtScatterCount;
            const isNearWinBonus = countBonus >= this.startAtBonusCount && countBonus < this.stopAtBonusCount;
            let isNearWinJackpot = countJackpot >= this.startAtJackpotCount && countJackpot < this.stopAtJackpotCount;
            let isNearWin = (isNearWinScatter || isNearWinBonus || isNearWinJackpot);
            for (let row = 0; row < matrix[col].length; ++row) {
                const symbolValue = matrix[col][row];
                if (symbolValue === this.bonusSymbol) {
                    this.createPaylineSymbol(tableFormat[col], symbolValue, col, row);
                    countBonus++;
                } else if (symbolValue === this.scatterSymbol) {
                    this.createPaylineSymbol(tableFormat[col], symbolValue, col, row);
                    countScatter++;
                } else if (symbolValue.includes(this.jackpotSymbol)) {
                    this.createPaylineSymbol(tableFormat[col], symbolValue, col, row);
                    countJackpot++;
                } else {
                    // row = matrix[col].length - 1;
                }
            }
            isNearWin = isNearWin || isNearWinJackpot;
            foundNearWin = foundNearWin || isNearWin;

            if (foundNearWin) {
                this.nearWinList[col] = { isNearWinScatter, isNearWinBonus, isNearWinJackpot, isNearWin };
                reels[col].emit('EXTEND_TIME_STOP');
            }
        }
    };

    reelStopNearWin({ count, context }) {
        const reels = (this.node as any).reels;
        this.hideAnimNearWin();
        if (!context.isFastToResult) {
            this.runAnimationNearWin(this.jackpotSymbol, count);
            this.runAnimationNearWin(this.scatterSymbol, count);
            this.runAnimationNearWin(this.bonusSymbol, count);
        }

        if (this.nearWinList && this.nearWinList[count] && this.nearWinList[count].isNearWin && !context.isFastToResult) {
            this.showAnimNearWin(count);

            for (let i = count; i < reels.length; i++) {
                if (this.nearWinList && this.nearWinList[i] && this.nearWinList[i].isNearWin)
                    reels[i].emit('UPDATE_NEAR_WIN_SPEED');
            }

            this.node.emit('PLAY_NEAR_WIN', this.nearWinList[count]);
        } else {
            this.stopSoundNearWin();
        }

        if (count >= reels.length) {
            this.clearSymbolPaylines();
            this.hideAnimNearWin();
            this.stopSoundNearWin();
        }
    }

    hideAnimNearWin() {
        this.animNode.active = false;
    }

    runAnimationNearWin(symbolName, currentIndex) {
        if (!this.nearWinHolder) return;

        if (this.nearWinHolder) {
            this.setOpacity(this.nearWinHolder, 255);
            warn("null nearWinHolder");
        }

        if (!this.usingObjs) {
            warn("null usingObjs");
            return;
        }

        this.usingObjs.forEach(paylineSymbol => {
            if (paylineSymbol["symbol"] === symbolName && paylineSymbol["col"] == currentIndex - 1) {
                paylineSymbol.active = true;
                paylineSymbol.emit("ENABLE_HIGHLIGHT");
                paylineSymbol.emit("PLAY_ANIMATION");
                const { col, row, symbol } = (paylineSymbol as any);
                this.node.emit('SHOW_STATIC_SYMBOL', col, row, symbol, false);
            }
        });
    }
}