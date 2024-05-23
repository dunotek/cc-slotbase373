import { _decorator, sp } from 'cc';
import { JackpotWin } from '../../../../cc-common/cc-slotbase/scripts/component/JackpotWin';
import { formatMoney } from '../../../../cc-common/cc-share/common/utils';
const { ccclass, property } = _decorator;
@ccclass('JackpotWin8000')
export class JackpotWin8000 extends JackpotWin {
    @property(sp.Skeleton)
    animation: sp.Skeleton = null;

    enter() {
        super.enter();
        // this.animation.setAnimation(0, "Appear", false);
        // this.animation.addAnimation(0, "Idle", true);
    }

    // finish() {
    //     this.isUpdating = false;
    //     this.label.string = formatMoney(this.content.winAmount);
    //     this.stopParticle();

    //     this.animation.setCompleteListener(() => {
    //         this.label.string = '';
    //         this.exit();
    //         this.soundPlayer && this.soundPlayer.stopAllAudio();
    //         this.soundPlayer && this.soundPlayer.playMainBGM();

    //         this.animation.setCompleteListener(null)
    //     });

    //     this.animation.setAnimation(0, "Disappear", false);
    // }
}