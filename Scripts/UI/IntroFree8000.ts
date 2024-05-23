import { _decorator, Node, sp, Tween, tween } from 'cc';
import { IntroFree } from '../../../../cc-common/cc-slotbase/scripts/component/IntroFree';
import { fadeIn, setOpacity } from '../../../../cc-common/cc-share/common/utils';
const { ccclass, property } = _decorator;

@ccclass('IntroFree8000')
export class IntroFree8000 extends IntroFree {
    @property(Node) nodeTotalNo: Node = null;
    @property(sp.Skeleton) animation: sp.Skeleton = null;

    // onLoad(): void {
    //     super.onLoad();
    //     // this.animation.setCompleteListener(this.exit.bind(this));
    // }

    enter() {
        const freeSpinTimes = [5, 10, 20];
        const { freeGameTotal } = this.content;
        if (freeGameTotal) {
            let indexSpinTimes = freeSpinTimes.indexOf(freeGameTotal);
            if (indexSpinTimes >=0) {
                this.nodeTotalNo.children[indexSpinTimes].active = true;
            }
        }

        if (this.animation) {
            this.animation.setAnimation(0, 'animation', false);
        }
    }

    show() {
        this.node.active = true;
        setOpacity(this.node, 0);
        fadeIn(this.node, 0.2);
        this.scheduleOnce(this.exit, this.timeShow);
    }

    exit(callBack: any = null) {
        this.nodeTotalNo.children.forEach(node => node.active = false);
        this.nodeTotalNo.active = false;
        Tween.stopAllByTarget(this.node);
        super.exit(callBack);
    }
}

