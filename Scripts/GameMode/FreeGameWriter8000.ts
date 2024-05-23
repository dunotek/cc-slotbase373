import { _decorator } from 'cc';
import { MainGameWriter8000 } from './MainGameWriter8000';
import { SlotGameMode, SlotSceneType } from '../../../../cc-common/cc-slotbase/scripts/component/CustomEnum';
const { ccclass } = _decorator;

@ccclass('FreeGameWriter8000')
export class FreeGameWriter8000 extends MainGameWriter8000 {
    makeScriptResume(): any {
        let listScript = [];
        const dataStore = (this.node as any).dataStore;
        const { bonusGameRemain, bonusGameMatrix, freeGameMatrix, freeGameRemain,
            winAmountPS, freeGameTotal } = dataStore.playSession;

        if (bonusGameRemain) {
            listScript.push({
                command: "_newGameMode",
                data: {
                    name: SlotGameMode.BonusGame,
                    data: bonusGameMatrix
                },
            });
            listScript.push({
                command: "_resumeGameMode",
                data: { name: SlotGameMode.FreeGame, data: freeGameMatrix },
            });
        }
        if (!freeGameRemain || freeGameRemain <= 0) {
            listScript.push({
                command: "_delayTimeScript",
                data: 1
            });

            listScript.push({
                command: "_showUnskippedCutscene",
                data: {
                    name: SlotSceneType.TotalWinPanel,
                    content: {
                        winAmount: winAmountPS,
                        freeGameTotal: freeGameTotal,
                    }
                }
            });

            listScript.push({
                command: "_clearPaylines",
            });

            listScript.push({
                command: "_gameExit",
            });
        } else {
            dataStore.spinTimes = freeGameRemain;
            listScript.push({
                command: "_updateSpinTimes",
                data: freeGameRemain
            });
            listScript.push({
                command: "_gameRestart"
            });
        }
        return listScript;
    }

    makeScriptShowResults(): any {
        const listScript = [];
        const dataStore = (this.node as any).dataStore;
        const { hasBigWild, jackpotData, payLines, winAmount, winAmountPS, bonusGame,
            bigWinConfig, bigwinAmount, freeGameRemain, freeGameTotal, hasScatter, hasBonus } = dataStore.playSession;
        let { timeCountingWinAmount, timeDelayWinAmount, levelWinAmount, nearWinJackpot } = dataStore.playSession.dataWinAmount;

        const currentBetData = dataStore.betData.getTotalBet();
        const isBonusGame = bonusGame && bonusGame > 0;
        // const isBigWin = bigWinConfig || bigwinAmount;
        const isBigWin = winAmount > currentBetData * 20;

        if (hasBigWild) {
            listScript.push({
                command: "_waitCompleteShowBigWild", screenLeft
            });
        }

        if (hasScatter || hasBonus) {
            listScript.push({
                command: "_playIdleSpecialSymbol",
                data: {
                    isDimOtherSymbol: false
                }
            });
        }

        if (!jackpotData && nearWinJackpot) {
            listScript.push({
                command: "_showLoseJackpot",
            });
        }

        //TODO: jackpot
        if (jackpotData) {
            listScript.push({
                command: "_showJackpotPayLine",
                data: {
                    jpPayLineID: jackpotData.jpPayLineID,
                }
            });

            listScript.push({
                command: "_showCutscene",
                data: {
                    name: SlotSceneType.IntroJackpotGame
                }
            });

            listScript.push({
                command: "_showUnskippedCutscene",
                data: {
                    name: SlotSceneType.JackpotWin,
                    content: {
                        winAmount: jackpotData.jackpotAmount,
                    }
                }
            });

            listScript.push({
                command: "_resumeUpdateJP",
            });
        } else if (isBigWin) {
            listScript.push({
                command: "_blinkAllPaylines",
            });

            listScript.push({
                command: "_showBigWin",
                data: {
                    name: SlotSceneType.BigWin,
                    data: {
                        winAmount: winAmount
                    }
                }
            });
        }

        if (payLines && payLines.length > 0) {
            let winAmountDisplay = winAmountPS || winAmount;
            let level = levelWinAmount;

            if (isBonusGame)
                level = 2;

            if (isBigWin)
                level = 0;

            let time = isBonusGame || isBigWin ? 0 : timeCountingWinAmount;

            listScript.push({
                command: '_updateWinningAmount',
                data: {
                    winAmount: winAmountDisplay,
                    time: time,
                    levelWinAmount: level
                }
            });
        }

        if (!isBigWin) {
            listScript.push({
                command: "_blinkAllPaylines",
            });
        }

        if (isBonusGame) {
            this.scriptShowResultBonusGame(listScript, SlotGameMode.FreeGame);
        }

        // if (winAmountPS && winAmountPS > 0) {
        //     listScript.push({
        //         command: '_updateWinningAmount',
        //         data: {
        //             winAmount: winAmountPS,
        //             time: 0,
        //             levelWinAmount: levelWinAmount
        //         }
        //     });
        // }

        if (freeGameRemain && freeGameRemain > dataStore.spinTimes) {
            listScript.push({
                command: "_showScatterPayLine",
            });
            listScript.push({
                command: "_moveParticles",
            });
            listScript.push({
                command: "_addSpinTimesAnimation",
                data: freeGameRemain - dataStore.spinTimes
            });
        }

        listScript.push({
            command: "_waitingCountWinAmount",
            data: timeDelayWinAmount
        });


        if (freeGameRemain) {
            dataStore.spinTimes = freeGameRemain;
            listScript.push({
                command: "_updateSpinTimes",
                data: freeGameRemain
            });
        }

        if (!freeGameRemain || freeGameRemain <= 0) {
            listScript.push({
                command: "_delayTimeScript",
                data: 1
            });

            listScript.push({
                command: "_showUnskippedCutscene",
                data: {
                    name: SlotSceneType.TotalWinPanel,
                    content: {
                        winAmount: winAmountPS,
                        freeGameTotal: freeGameTotal,
                    }
                }
            });

            listScript.push({
                command: "_clearPaylines",
            });

            listScript.push({
                command: "_gameExit",
            });
        } else {
            listScript.push({
                command: "_gameRestart"
            });
        }
        return listScript;
    }
}