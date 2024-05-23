import { _decorator } from 'cc';
import { MiniWriter } from '../../../../cc-common/cc-slotbase/scripts/component/MiniGame/MiniWriter';
import { SlotSceneType } from '../../../../cc-common/cc-slotbase/scripts/component/CustomEnum';
const { ccclass, property } = _decorator;

@ccclass('MiniGameWriter8000')
export class MiniGameWriter8000 extends MiniWriter {

    makeScriptShowResult() {
        const listScript = [];
        const { winAmountPS, bonusPlayRemain, bonusGameMatrix, bonusValue,
            bonusGameWinAmount, bgWinAmtCurrent } = this.dataStore.playSession;

        listScript.push({
            command: "_openPickedItem",
            data: { index: this.currentPick, value: bonusValue }
        });

        if (winAmountPS && winAmountPS > 0) {
            listScript.push({
                command: "_updateWinningAmount",
                data: { winAmount: winAmountPS, time: 0 }
            });
        }

        if (bonusPlayRemain) {
            listScript.push({
                command: "_miniGameRestart"
            });
        } else {
            listScript.push({
                command: "_openAllItems",
                data: bonusGameMatrix
            });

            listScript.push({
                command: "_showCutscene",
                data: {
                    name: SlotSceneType.TotalWinBonus,
                    content: {
                        winAmount: bgWinAmtCurrent ? bgWinAmtCurrent : bonusGameWinAmount,
                    }
                }
            });
            listScript.push({
                command: "_updateWinningAmount",
                data: { winAmount: winAmountPS, time: 0, levelWinAmount: 2 }
            });

            listScript.push({
                command: "_gameExit",
            });
        }
        return listScript;
    }
}