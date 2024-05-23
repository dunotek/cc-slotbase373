import { _decorator, sp, Node } from 'cc';
import { SlotSymbolPayline } from '../../../../cc-common/cc-slotbase/scripts/table/SlotSymbolPayline';
import { AnimationsWild } from '../UI/BigWild8000';
const { ccclass } = _decorator;

@ccclass('SlotSymbolPayline8000')
export class SlotSymbolPayline8000 extends SlotSymbolPayline {

    init(symbolName: string, skeletonData: sp.SkeletonData, disableHighlightHolder: Node) {
        super.init(symbolName, skeletonData, disableHighlightHolder);
        this.node['havingAnim'] = this._havingAnim;
        this.node['isShowingAnim'] = false;
    }

    onLoad() {
        super.onLoad();
        this.node.on("PLAY_ANIM_APPEAR", this.playAnimAppear, this);
        this.node.on("PLAY_ANIMATION_JACKPOT", this.playAnimationJackpot, this);
        this.node.on("PLAY_SPECIFIC_ANIMATION", this.playSpecificAnimation, this);
    }

    playAnimAppear() {
        if (this._animation && this._havingAnim) {
            this._animation.node.active = true;
            this._animation.setAnimation(0, 'Appear', false);
            this._animation.addAnimation(0, 'Idle', true);
            this.node['isShowingAnim'] = true;
        }
    }

    playSpecificAnimation(animName = "", isPlaying = false) {
        if (animName == "") return;
        if (this._animation && this._havingAnim) {
            this._animation.node.active = true;
            this._animation.setAnimation(0, animName, true);
            this.node['isShowingAnim'] = true;
        }

        this._isPlaying = isPlaying;
    }

    playAnimation(duration: number = 2) {
        if (this._havingAnim && this._animation) {
            this.spineNode.active = true;
            this._isPlaying = true;

            let animName = 'animation';
            switch (this._symbolName) {
                case 'A':
                case 'R':
                case 'K3':
                    animName = 'Win'
                    break;
            }

            this._animation.setAnimation(0, animName, true);
            this._animation.timeScale = this.ANIM_DURATION / duration;
            this.node['isShowingAnim'] = true;
        }
    }

    playAnimationJackpot(duration: number = 2) {
        if (this._havingAnim && this._animation && this._symbolName.includes('K')) {
            this.spineNode.active = true;
            this._isPlaying = true;

            this._animation.setAnimation(0, AnimationsWild.Antic_JP, false);
            this._animation.addAnimation(0, AnimationsWild.Antic_JP_Loop, true);

            this._animation.timeScale = this.ANIM_DURATION / duration;
            this.node['isShowingAnim'] = true;
        }
    }

    reset() {
        super.reset();

        this.node['isShowingAnim'] = false;
    }
}