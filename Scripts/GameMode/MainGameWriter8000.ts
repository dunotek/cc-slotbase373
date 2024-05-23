import { _decorator } from 'cc';
import { SlotGameWriter } from '../../../../cc-common/cc-slotbase/scripts/core/SlotGameWriter';
import { SlotGameMode, SlotSceneType } from '../../../../cc-common/cc-slotbase/scripts/component/CustomEnum';
const { ccclass } = _decorator;

@ccclass('MainGameWriter8000')
export class MainGameWriter8000 extends SlotGameWriter {
    makeScriptResume(): any {

        const dataStore = (this.node as any).dataStore;
        const { promotion } = dataStore;
        const { bonusGameMatrix, normalGameMatrix, normalPayLines, bonusGameRemain, freeGameRemain,
            freeGameMatrix, winAmountPS, betId, walletType } = dataStore.playSession;

        const isBonusGameInNormal = (bonusGameRemain && bonusGameRemain > 0 && !freeGameMatrix);
        const isBonusGameInFree = (bonusGameRemain && bonusGameRemain > 0 && !isBonusGameInNormal);
        const isFreeGame = ((freeGameRemain && freeGameRemain > 0) || isBonusGameInFree);

        let completeFeatureSymbols = [];
        if (isBonusGameInNormal) completeFeatureSymbols.push('R');
        if (isFreeGame) completeFeatureSymbols.push('A');

        let listScript = [];
        let promotionRemain, promotionTotal;

        if (promotion) {
            promotionRemain = promotion.promotionRemain;
            promotionTotal = promotion.promotionTotal;
        }

        listScript.push({
            command: "_updateBetId",
            data: betId
        });
        listScript.push({
            command: "_loadWallet",
            data: walletType
        })
        listScript.push({
            command: "_disableBet",
        });
        listScript.push({
            command: "_showTrialButtons",
            data: false
        });
        listScript.push({
            command: "_updateMatrix",
            data: { matrix: normalGameMatrix },
        });
        listScript.push({
            command: "_setUpPaylines",
            data: { matrix: normalGameMatrix, payLines: normalPayLines },
        });

        listScript.push({
            command: "_setUpPaylineCol"
        });

        listScript.push({
            command: "_showBigWild",
            data: {
                matrix: normalGameMatrix,
                isResume: true
            }
        })
        // const updatedWinAmount = winAmount - (betValue * currentBonusCredits);
        if (winAmountPS && winAmountPS > 0) {
            listScript.push({
                command: "_updateWinningAmount",
                data: { winAmount: winAmountPS, time: 0 }
            });
        }
        if (isBonusGameInNormal) {
            listScript.push({
                command: "_showBonusPayLine",
            });

            listScript.push({
                command: "_newGameMode",
                data: {
                    name: SlotGameMode.BonusGame,
                    data: bonusGameMatrix
                },
            });

            listScript.push({
                command: "_resumeGameMode",
                data: { name: SlotGameMode.NormalGame, },
            });
        }

        if (isFreeGame) {
            listScript.push({
                command: "_showScatterPayLine",
            });
            if (freeGameRemain && freeGameRemain > 0) {
                listScript.push({
                    command: "_newGameMode",
                    data: {
                        name: SlotGameMode.FreeGame,
                        data: {
                            matrix: freeGameMatrix || normalGameMatrix,
                            isResume: true
                        }
                    },
                });
            }

            listScript.push({
                command: "_resumeGameMode",
                data: { name: SlotGameMode.NormalGame },
            });
        }

        listScript.push({
            command: "_playCompleteFeatureSymbols",
            data: {
                completeFeatureSymbols: completeFeatureSymbols,
                isHighlight: true,
            }
        });

        // if (isBonusGameInNormal || isFreeGame) {
        //     listScript.push({
        //         command: "_playIdleSpecialSymbol",
        //         data: {
        //             isDimOtherSymbol: true
        //         }
        //     });
        // } else if (normalPayLines && normalPayLines.length > 0) {
        //     listScript.push({
        //         command: "_playIdleSpecialSymbol",
        //         data: {
        //             isDimOtherSymbol: false
        //         }
        //     });
        //     listScript.push({
        //         command: "_showNormalPayline",
        //     });
        // }

        listScript.push({
            command: "_gameFinish"
        });

        listScript.push({
            command: "_gameRestart"
        });

        if (promotion && promotionRemain && promotionTotal && promotionRemain > 0) {
            listScript.push({
                command: "_showPromotionPopup",
            });
        }

        return listScript;
    }

    makeScriptResultReceive(): any {
        const dataStore = (this.node as any).dataStore;
        const { matrix, jackpotData, extraVipJackpot, payLines, hasBigWild } = dataStore.playSession;

        let listScript = [];
        if (jackpotData) {
            listScript.push({
                command: "_pauseUpdateJP"
            });

            listScript.push({
                command: "_updateValueJP",
                data: {
                    jpType: jackpotData.jpType,
                    jpValue: jackpotData.jackpotAmount - (extraVipJackpot || 0),
                }
            });
        }

        if (hasBigWild) {
            listScript.push({
                command: "_triggerShowBigWild",
            });
        }

        listScript.push({
            command: "_setUpPaylines",
            data: { matrix, payLines },
        });

        listScript.push({
            command: "_resultReceive",
            data: matrix,
        });

        listScript.push({
            command: "_showResult",
            data: matrix,
        });

        return listScript;
    }

    makeScriptShowResults(): any {
        const listScript = [];
        const dataStore = (this.node as any).dataStore;
        const { winAmount, winAmountPS, payLines, freeGame, bigWinConfig, bigwinAmount, hasScatter, hasBonus,
            bonusGame, hasBigWild, jackpotData, nearWinJackpot } = dataStore.playSession;
        let { timeCountingWinAmount, levelWinAmount, timeDelayWinAmount } = dataStore.playSession.dataWinAmount;
        const isBonusGame = bonusGame && bonusGame > 0;
        const isFreeGame = freeGame && freeGame > 0;
        const isBigWin = bigWinConfig || bigwinAmount;

        let completeFeatureSymbols = [];
        if (isBonusGame) completeFeatureSymbols.push('R');
        if (isFreeGame) completeFeatureSymbols.push('A');

        if (hasBigWild) {
            listScript.push({
                command: "_waitCompleteShowBigWild",
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

        if (jackpotData) {
            listScript.push({
                command: "_delayTimeScript",
                data: 0.5
            });

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

            if (isBonusGame || isFreeGame)
                level = 2;

            if (isBigWin)
                level = 0;

            let time = isBonusGame || isFreeGame || isBigWin ? 0 : timeCountingWinAmount;

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
            if (payLines && payLines.length > 0) {
                listScript.push({
                    command: "_blinkAllPaylines",
                });
            }
        }

        if (isBonusGame) {
            this.scriptShowResultBonusGame(listScript);
        }

        if (isFreeGame) {
            this.scriptShowResultFreeGame(listScript);
        }

        if (isBonusGame || isFreeGame) {
            listScript.push({
                command: "_playCompleteFeatureSymbols",
                data: {
                    completeFeatureSymbols: completeFeatureSymbols,
                    isHighlight: true,
                }
            });
        } else if (payLines && payLines.length > 0) {
            listScript.push({
                command: "_showNormalPayline",
            });
        }

        listScript.push({
            command: "_waitingCountWinAmount",
            data: timeDelayWinAmount
        });

        listScript.push({
            command: "_gameFinish"
        });

        listScript.push({
            command: "_gameRestart"
        });

        return listScript;
    }

    scriptUpdateWinAmount(listScript: {}[]): any {
        const dataStore = (this.node as any).dataStore;
        const { isFinished } = dataStore.playSession;

        if (isFinished) {
            listScript.push({
                command: "_resumeWallets"
            })
        }
    }

    scriptShowResultBonusGame(listScript: any[], resumeGameMode = SlotGameMode.NormalGame) {
        const dataStore = (this.node as any).dataStore;
        const { spinTimes } = dataStore;

        listScript.push({
            command: "_updateLastestWinAmount",
        });
        listScript.push({
            command: "_showBonusPayLine",
        });
        listScript.push({
            command: "_showCutscene",
            data: {
                name: SlotSceneType.IntroBonusGame
            }
        });
        listScript.push({
            command: "_newGameMode",
            data: { name: SlotGameMode.BonusGame },
        });

        listScript.push({
            command: "_resumeGameMode",
            data: { name: resumeGameMode },
        });

        if (spinTimes && spinTimes > 0) {
            listScript.push({
                command: "_resumeSpinTime",
                data: spinTimes,
            });
        }
    }

    scriptShowResultFreeGame(listScript: any[]) {
        const dataStore = (this.node as any).dataStore;
        const { matrix } = dataStore.playSession;
        const { spinTimes } = dataStore;

        listScript.push({
            command: "_updateLastestWinAmount",
        });
        listScript.push({
            command: "_showScatterPayLine",
        });

        listScript.push({
            command: "_showCutscene",
            data: {
                name: SlotSceneType.IntroFreeGame
            }
        });
        listScript.push({
            command: "_newGameMode",
            data: {
                name: SlotGameMode.FreeGame,
                data: {
                    matrix: matrix,
                    isResume: false
                }
            },
        });

        listScript.push({
            command: "_resumeGameMode",
            data: { name: SlotGameMode.NormalGame },
        });

        if (spinTimes && spinTimes > 0) {
            listScript.push({
                command: "_resumeSpinTime",
                data: spinTimes,
            });
        }
    }
}