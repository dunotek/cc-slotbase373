import { _decorator, Animation, Node, sp } from 'cc';
import { IntroBonus } from '../../../../cc-common/cc-slotbase/scripts/component/IntroBonus';
const { ccclass, property } = _decorator;

@ccclass('IntroBonus8000')
export class IntroBonus8000 extends IntroBonus {
    @property(sp.Skeleton)
    animationTitle: sp.Skeleton = null;

    @property(Animation)
    animation: Animation = null;

    // onLoad(): void {
    //     super.onLoad();
    //     // this.animationTitle.setCompleteListener(this.);
    // }

    show() {
        super.show();
        // this.animation.play();
        // this.animationTitle.setAnimation(0, 'animation', false);
    }

    exit(callBack?: any): void {
        super.exit(callBack);
    }
}

