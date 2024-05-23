import { _decorator } from 'cc';
import { SlotSymbol } from '../../../../cc-common/cc-slotbase/scripts/table/SlotSymbol';
import { setOpacity } from '../../../../cc-common/cc-share/common/utils';
const { ccclass } = _decorator;
const PREFIX_GAME_ID = '8000_';
@ccclass('SlotSymbol8000')
export class SlotSymbol8000 extends SlotSymbol {
    onLoad() {
        super.onLoad();
        this.node.on('HIDE_STATIC_SYMBOL', this.hideStaticSymbol, this);
        this.node.on('SHOW_STATIC_SYMBOL', this.showStaticSymbol, this);

    }

    changeToRealSymbol(symbolName = '2') {
        if (this.assets[PREFIX_GAME_ID + symbolName]) {
            this.node['symbol'] = symbolName;
            setOpacity(this.node, 255);
            setOpacity(this.staticSymbol, 255);
            if (this.symbolSpriteFrame) this.symbolSpriteFrame.spriteFrame = this.assets[PREFIX_GAME_ID + symbolName];
        } else {
            if (this.symbolSpriteFrame) this.symbolSpriteFrame.spriteFrame = null;
        }
    };

    changeToBlurSymbol(symbolName = '2') {
        const blurSymblName = PREFIX_GAME_ID + this.blurNamePrefix + symbolName;
        const blurAsset = this.blurAssets[blurSymblName];
        if (blurAsset) {
            this.node['symbol'] = symbolName;
            setOpacity(this.staticSymbol, 255);
            setOpacity(this.node, 255);
            if (this.symbolSpriteFrame) this.symbolSpriteFrame.spriteFrame = blurAsset;
        } else {
            this.changeToRealSymbol(symbolName);
        }
    };

    hideStaticSymbol(): void {
        this.staticSymbol.active = false;
    }

    showStaticSymbol(): void {
        this.staticSymbol.active = true;
    }
}