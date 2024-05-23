import { _decorator, Node, Sprite, SpriteFrame } from 'cc';
import { SlotReelv2 } from '../../../../cc-common/cc-slotbase/scripts/portrait/table/SlotReelv2';
const { ccclass, property } = _decorator;

@ccclass('SlotReel8000')
export class SlotReel8000 extends SlotReelv2 {
    @property(Node)
    nodeBigWild: Node = null;

    @property(SpriteFrame)
    bigWildSpriteFrames: SpriteFrame[] = [];

    lastResult = [];

    public init(tableFormat = [], gameConfig: any = {}, col = 0, symbolPrefab = null, isFreeMode = false) {
        super.init(tableFormat, gameConfig, col, symbolPrefab, isFreeMode);
        this.nodeBigWild.setSiblingIndex(100);
    }

    public startSpinning(reelIndex: number, reelConfig = {}) {
        super.startSpinning(reelIndex, reelConfig);

        if (reelIndex == 1 && this.lastResult.length > 0 && this.lastResult.indexOf('K1') != -1) {
            this.nodeBigWild.getComponent(Sprite).spriteFrame = this.bigWildSpriteFrames[0];
            this.nodeBigWild.active = true;
            this.node.setSiblingIndex(100);
        }

        if (reelIndex == 3 && this.lastResult.length > 0 && this.lastResult.indexOf('K2') != -1) {
            this.nodeBigWild.getComponent(Sprite).spriteFrame = this.bigWildSpriteFrames[1];
            this.nodeBigWild.active = true;
            this.node.setSiblingIndex(100);
        }

        this.lastResult = [];
    };

    public stopSpinningWithDelay(data: string[], callbackStop) {
        super.stopSpinningWithDelay(data, callbackStop);
    };

    reset() {
        this.lastResult = this.result;
        super.reset();
        this.nodeBigWild.active = false;
    }
}

