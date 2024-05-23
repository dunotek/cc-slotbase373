import { _decorator, Component, instantiate, Label, Node, NodePool, Prefab, Sprite, SpriteFrame, tween, TweenAction, Vec3 } from 'cc';
import { SlotBetTableHistoryDetail } from '../../../../cc-common/cc-slotbase/scripts/component/BetHistory/SlotBetTableHistoryDetail';
import { SlotGameMode } from '../../../../cc-common/cc-slotbase/scripts/component/CustomEnum';
import { formatMoney, formatWalletMoney } from '../../../../cc-common/cc-share/common/utils';
const { ccclass, property } = _decorator;

@ccclass('SlotBetTableHistoryDetail8000')
export class SlotBetTableHistoryDetail8000 extends SlotBetTableHistoryDetail {
    @property({ type: Node })
    LabelBonus: Node = null;

    @property({ type: Prefab })
    LabelBonusPrefab = new Prefab;
    labelItem = null;
    @property({ type: Sprite })
    K1Expand: Sprite = null;
    @property({ type: Sprite })
    K2Expand: Sprite = null;
    onEnable() {
        if (this.LabelBonus) {
            this.LabelBonus.removeAllChildren();
        }
    }
    renderTable(matrix, format, subSym) {
        this.setPoolLabelBonus();
        if (!matrix) return;
        if (this.dimBackground) this.dimBackground.active = false;
        let symbolWidth = this.sceneType === SlotGameMode.FreeGame && this.config.SYMBOL_WIDTH_FREE_GAME ? this.config.SYMBOL_WIDTH_FREE_GAME : this.config.SYMBOL_WIDTH;
        let symbolHeight = this.sceneType === SlotGameMode.FreeGame && this.config.SYMBOL_HEIGHT_FREE_GAME ? this.config.SYMBOL_HEIGHT_FREE_GAME : this.config.SYMBOL_HEIGHT;
        symbolWidth = this.customSymbolWidth || symbolWidth;
        symbolHeight = this.customSymbolHeight || symbolHeight;

        let startX = (-format.length / 2 + 0.5) * symbolWidth;
        let count = 0;
        let bonusPositions = [];
        let winAmountBonus = [];
        for (let col = 0; col < format.length; col++) {
            this.symbols[col] = [];
            let startY = (format[col] / 2 - 0.5) * symbolHeight;
            for (let row = 0; row < format[col]; row++) {
                let symbol = this.getSymbol();
                this.resetBox(symbol);
                symbol.parent = this.slotTable;
                symbol.setScale(new Vec3(this.symbolScaleX, this.symbolScaleY, 1));
                symbol.setPosition(startX + col * symbolWidth, startY - row * symbolHeight);
                symbol.emit("INIT_FOR_PAYLINE", this.enableHighlightHolder, null, false);
                symbol.col = col;
                symbol.row = row;
                let symbolValue = matrix[count];
                if (this.data.mode === "bonus") {
                    if (symbolValue > -1) {
                        bonusPositions.push(symbol.position);
                        winAmountBonus.push(formatWalletMoney(symbolValue * this.data.betDenom));
                        symbol.children.forEach(child => {
                            if (child.name === "staticNode") {
                                child.active = false;
                            } else if (child.name === "symbolNode") {
                                let parseValue = parseInt(symbolValue);
                                if (parseValue === 100) {
                                    child.getComponent(Sprite).spriteFrame = symbol.getComponent("MiniBox8000").spriteSymbols[0];
                                } else if (parseValue === 200) {
                                    child.getComponent(Sprite).spriteFrame = symbol.getComponent("MiniBox8000").spriteSymbols[1];
                                } else if (parseValue === 400) {
                                    child.getComponent(Sprite).spriteFrame = symbol.getComponent("MiniBox8000").spriteSymbols[2];
                                }
                                child.active = true;
                            }
                        });
                    }
                }
                if (this.hasBigWild) {
                    let res = this.bigWildCols.indexOf(col);
                    if (res >= 0 && symbolValue === "K") {
                        symbolValue = "";
                        if (row === 1) {
                            symbolValue = this.bigWildSymbols[col];
                            if (symbolValue.includes("K1")) {
                                this.K1Expand.node.active = true;
                            } else {
                                this.K2Expand.node.active = true;
                            }
                            //symbol.emit('CHANGE_TO_BIG_WILD', symbolValue);
                        }
                    }
                }
                if (symbolValue === '' || symbolValue === matrix[count]) {
                    if (symbolValue === 'K' && (col === 0 || col === 2 || col === 4)) {
                        symbolValue = "K3"
                    }

                    symbol.emit('CHANGE_TO_SYMBOL', symbolValue);
                }
                symbol.symbolName = matrix[count];
                if (subSym && subSym.length && subSym.indexOf(count) > -1) {
                    this.showSubSymbol(symbol, true);
                }
                this.symbols[col][row] = symbol;
                count++;
            }
        }
        if (this.data.mode === "bonus") {
            this.showLabelBonusesAtPositions(bonusPositions, winAmountBonus);
        }
        if (this.hasPayline) {
            this.showPaylines();
        }
    }

    showLabelBonusesAtPositions(positions, winAmounts) {
        for (let i = 0; i < positions.length; i++) {
            const position = positions[i];
            const winAmount = winAmounts[i];
            this.showLabelBonus(position, winAmount);
        }
    }

    setPoolLabelBonus() {
        if (this.data.mode === "bonus") {
            this.labelItem = new NodePool();
            for (let i = 0; i < 10; i++) {
                this.labelItem.put(instantiate(this.LabelBonusPrefab));
            }
        }
    }

    getPoolLabelBonus() {
        let item = this.labelItem.get();
        if (!item) {
            item = instantiate(this.LabelBonusPrefab);
        }
        return item;
    }
    clearTable() {
        if (this.data.mode === "bonus") {
            this.LabelBonus.removeAllChildren();
        }
        if (this.K1Expand) this.K1Expand.node.active = false;
        if (this.K2Expand) this.K2Expand.node.active = false;
        super.clearTable();
    }

    resetBox(symbol) {
        symbol.children.forEach(child => {
            if (child.name === "staticNode") {
                child.active = true;
            } else if (child.name === "symbolNode") {
                child.active = false;
            }
        });
    }
    updateTotalWinAmount(data: any) {
        this.totalWinAmount.string = '0';
        if (this.sceneType === SlotGameMode.FreeGame && data.totalFreeWinAmount !== undefined) {
            if (data.latestWinJackpotInfo && data.latestWinJackpotInfo.length) {
                this.totalWinAmount.string = formatMoney(parseInt(data.winAmount)) + "+Jackpot" + parseInt(data.latestWinJackpotInfo[0].jackpotAmount);
            } else {
                this.totalWinAmount.string = formatMoney(parseInt(data.winAmount));
            }
        } else if (this.sceneType === SlotGameMode.BonusGame && data.totalBonusWinAmount !== undefined) {
            this.totalWinAmount.string = formatMoney(parseInt(data.totalBonusWinAmount));
        } else if (this.sceneType === SlotGameMode.NormalGame && data.winAmount !== undefined) {
            if (data.latestWinJackpotInfo && data.latestWinJackpotInfo.length) {
                this.totalWinAmount.string = formatMoney(parseInt(data.winAmount)) + "+Jackpot" + parseInt(data.latestWinJackpotInfo[0].jackpotAmount);
            } else {
                this.totalWinAmount.string = formatMoney(parseInt(data.winAmount));
            }
        }
    }

    showLabelBonus(position, winAmount) {
        let item = this.getPoolLabelBonus();
        item.position = position;
        item.getComponent(Label).string = winAmount;
        item.parent = this.LabelBonus;
    }

    showPaylines() {
        let { paylines } = this.data;

        if (paylines && paylines.length > 0) {
            let convertPaylines = this.convertPayLineAlways(paylines);
            for (let i = 0; i < convertPaylines.length; i++) {
                this.showNextPayline(convertPaylines[i]);
            }
            if (this.dimBackground) this.dimBackground.active = true;
        } else {
            if (this.enableHighlightHolder.children.length > 0) {
                this.enableHighlightHolder.children[0].setScale(new Vec3(1, 0.86, 1))
                this.enableHighlightHolder.children[0].setPosition(144, 6);
            }
            if (this.dimBackground) this.dimBackground.active = false;
        }
    }

    convertPayLineAlways(payLines: any[]): any[] {
        if (!payLines) return null;
        const listNewPL = [];
        for (let i = 0; i < payLines.length; i++) {
            const dataSplit = payLines[i].split(';');
            if (dataSplit.length !== 0) {
                listNewPL.push({
                    symbolName: dataSplit[3],
                    totalWinAmount: dataSplit[2],
                    symbolCount: dataSplit[1],
                });
            }
        }
        return listNewPL;
    }

    showNextPayline(paylineInfo: any) {
        if (this.config.PAY_LINE_ALLWAYS) {
            const { symbolName, symbolCount } = paylineInfo;
            this.slotTable.children.forEach((symbol) => {
                if (((symbol as any).symbolName === symbolName.trim() || (symbol as any).symbolName === "K") && (symbol as any).col < symbolCount) {
                    this.showSymbolHightlight(symbol);
                }
            });
        } else {
            const { symbolName, symbolCount } = paylineInfo;
            const totalRow = 3;

            for (let col = 0; col < symbolCount; col++) {
                for (let row = 0; row < totalRow; row++) {
                    let symbol = this.symbols[col][row];
                    let symbolValue = (symbol as any)['symbol'];
                    if ((symbolValue == symbolName)) {
                        // this.showSymbolHightlight(symbol);
                        symbol.parent = this.enableHighlightHolder;
                        symbol.setSiblingIndex(1);
                        this.enableHighlightHolder.setScale(new Vec3(0.85, 0.85, 1))
                        this.enableHighlightHolder.setPosition(5, 0);
                    }
                }
            }
        }
    }
}

