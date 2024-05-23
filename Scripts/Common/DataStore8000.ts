import { _decorator, warn } from 'cc';
import { DataStore } from '../../../../cc-common/cc-slotbase/scripts/core/DataStore';
import { StateGameMode } from '../../../../cc-common/cc-slotbase/scripts/component/CustomEnum';
const { ccclass } = _decorator;
@ccclass('DataStore8000')
export class DataStore8000 extends DataStore {
    formatData(playSession) {
        const { NORMAL_TABLE_FORMAT, FREE_TABLE_FORMAT } = this.config;
        const { matrix0, normalGameMatrix, freeGameMatrix, payLines, state, jackpotInfo, normalGamePaylines,
            bonusGameMatrix, eventData, winAmountQuest, winAmountEvent, isTrialMode } = playSession;
        let tableFormat = NORMAL_TABLE_FORMAT;

        if (state == StateGameMode.FreeGame) {
            tableFormat = FREE_TABLE_FORMAT;
        }

        if (matrix0) {
            playSession.matrix = this.convertMatrix(matrix0, tableFormat);
            playSession.matrix = this.transformSymbol(playSession.matrix);
        }

        if (freeGameMatrix) {
            playSession.freeGameMatrix = this.convertMatrix(freeGameMatrix, tableFormat);
            playSession.freeGameMatrix = this.transformSymbol(playSession.freeGameMatrix);
        }

        if (normalGameMatrix) {
            playSession.normalGameMatrix = this.convertMatrix(normalGameMatrix, tableFormat);
            playSession.normalGameMatrix = this.transformSymbol(playSession.normalGameMatrix);
        }

        if (playSession.payLines) {
            playSession.payLines = this.convertPayLine(payLines);
        }

        if (bonusGameMatrix) {
            playSession.bonusGameMatrix = this.formatBonusMatrix(bonusGameMatrix);
        }
        if (normalGamePaylines) {
            playSession.normalPayLines = normalGamePaylines ? this.convertPayLine(normalGamePaylines) : null;
        }

        if (!isTrialMode) {
            if (eventData) {
                this.questData.updateQuestData(eventData);
            }
            if (winAmountQuest || winAmountEvent) {
                this.questData.setWinAmount(winAmountQuest, winAmountEvent);
            }
            else if (playSession.version == 1) {
                this.questData.resetWinAmount();
            }
        }

        if (matrix0) {
            playSession.hasScatter = matrix0.filter((it, index) => (it == 'A' && index <= 2)).length > 0;
            playSession.hasBonus = matrix0.filter((it, index) => (it == 'R' && index <= 2)).length > 0;
        }

        if (playSession.matrix) {
            playSession.hasWildLeft = playSession.matrix.some((reel) => reel.indexOf('K1') != -1);
            playSession.hasWildRight = playSession.matrix.some((reel) => reel.indexOf('K2') != -1);
            playSession.hasBigWild = playSession.hasWildLeft || playSession.hasWildRight;
            playSession.nearWinJackpot = this.isNearWinJackpot(playSession.matrix);
        }

        if (jackpotInfo) {
            let infoJP = jackpotInfo[jackpotInfo.length - 1];
            let arrayJP = infoJP.split(';');
            playSession.jackpotData = {
                jpType: arrayJP[0].includes("GRAND") ? "GRAND" : "MAJOR",
                jackpotAmount: Number(arrayJP[1]),
                jpPayLineID: arrayJP[2],
            }
        }

        this.playSession = playSession;

        this.playSession.dataWinAmount = this.getDataWinAmount();

        warn("%c run data-update ", "color: red", this.playSession);
        return playSession;
    }

    isNearWinJackpot(matrix) {
        if (!matrix[0].some((it) => it.includes('K'))) return false;
        let countSymbol = matrix.filter(mx => mx.some(it => it.includes('K'))).length;
        return countSymbol >= 4;
    }

    transformSymbol(matrix) {
        let newMatrix = matrix;
        for (let col = 0; col < matrix.length; ++col) {
            for (let row = 0; row < matrix[col].length; ++row) {
                if (newMatrix[col][row] == "K") {
                    if (col == 1)
                        newMatrix[col][row] = 'K1';
                    else if (col == 3)
                        newMatrix[col][row] = 'K2';
                    // else
                    //     newMatrix[col][row] = 'K3';
                }
            }
        }

        return newMatrix;
    }

    getLevelWinAmount(winAmount) {
        if (!winAmount && winAmount == 0) return 0;

        const rate = winAmount / this.betData.getTotalBet();
        if (rate >= 10) return 4;
        else if (rate >= 5) return 3;
        else if (rate >= 1) return 2;
        else if (rate >= this.betData.getTotalBet()) return 1;

        return 0;
    }

    getTimeCountingWinAmount(winAmount = 0) {
        const { TIME_COUNT_WIN_AMOUNT } = this.config;
        const level = this.getLevelWinAmount(winAmount);
        if (TIME_COUNT_WIN_AMOUNT[level]) return TIME_COUNT_WIN_AMOUNT[level];
        return 0;
    }

    getTimeWin(winAmount = 0) {
        const { TIME_WIN } = this.config;
        const level = this.getLevelWinAmount(winAmount);
        if (TIME_WIN[level]) return TIME_WIN[level];
        return 1;
    }

    getDataWinAmount() {
        const { isAutoSpin, modeTurbo, config } = this;
        const { bigWinConfig, bigwinAmount, winAmount, winAmountPS } = this.playSession;
        const curentConfig = config[modeTurbo ? 'TABLE_TURBO' : 'TABLE_NORMAL'];
        const { EXPECT_PAYLINE_ALLWAYS_TIME } = curentConfig;

        let amountDisplay = winAmountPS && winAmountPS > 0 ? winAmountPS : winAmount;
        const levelWinAmount = this.getLevelWinAmount(amountDisplay);
        const durationWinAmount = this.getTimeWin(winAmount);

        let timePerPaylines = EXPECT_PAYLINE_ALLWAYS_TIME;
        let isShowHighPayline = isAutoSpin;
        let numberHighPayline = 1;
        let timeBlinkAllLines = 2;
        let timeCountingWinAmount = bigWinConfig ? 0 : this.getTimeCountingWinAmount(winAmount);

        if (isAutoSpin) {
            if (bigwinAmount > 0) {
                if (modeTurbo) {
                    timeBlinkAllLines = 2;
                    numberHighPayline = 2;
                    timePerPaylines = 2;
                } else
                    timeBlinkAllLines = 0.5;
            } else {
                switch (levelWinAmount) {
                    case 4:
                        timeBlinkAllLines = 2;
                        numberHighPayline = 2;
                        timePerPaylines = 2;
                        break;
                    case 3:
                        timeBlinkAllLines = 2;
                        numberHighPayline = 2;
                        timePerPaylines = 2;
                        break;
                    case 2:
                        timeBlinkAllLines = 2;
                        numberHighPayline = 0;
                        timePerPaylines = 0;
                        break;
                    case 1:
                        timeBlinkAllLines = 2;
                        numberHighPayline = 0;
                        timePerPaylines = 0;
                        break;
                    case 0:
                        timeBlinkAllLines = 2;
                        numberHighPayline = 0;
                        timePerPaylines = 0;
                        break;
                }
            }
        }

        let timeDelayWinAmount = durationWinAmount - timeBlinkAllLines;
        timeDelayWinAmount = timeDelayWinAmount < 0 ? 0 : timeDelayWinAmount;

        return { isShowHighPayline, durationWinAmount, numberHighPayline, timeBlinkAllLines, timePerPaylines, timeCountingWinAmount, levelWinAmount, timeDelayWinAmount }
    }

    convertPayLine(payLines: any[]): any[] {
        if (!payLines) return null;
        const listNewPL = [];
        for (let i = 0; i < payLines.length; i++) {
            const dataSplit = payLines[i].split(';');
            if (dataSplit.length >= 3) {
                listNewPL.push({
                    payLineID: dataSplit[0],
                    payLineWinNumbers: parseInt(dataSplit[1]),
                    payLineWinAmount: Number(dataSplit[2]),
                    symbolName: dataSplit[3],
                    multiplier: dataSplit[4] ? dataSplit[4] : 1
                });
            }
        }
        listNewPL.sort((a, b) => b.payLineWinAmount - a.payLineWinAmount);
        return listNewPL;
    };

}