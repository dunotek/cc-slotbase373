import { _decorator, sp, Event, tween, Node } from 'cc';
import { MiniBox } from '../../../../cc-common/cc-slotbase/scripts/component/MiniGame/MiniBox';
const { ccclass, property } = _decorator;

const ChestAnim = {
    Idle: 'BonusG_Idle',
    Open: 'BonusG_Open',
    Select: 'BonusG_Select',
};

@ccclass('MiniBox8000')
export class MiniBox8000 extends MiniBox {
    @property(sp.Skeleton) animation: sp.Skeleton = null;
    @property(Node) bgLabelWin: Node = null;

    onClickItem(e: any, isAutoTrigger: boolean = false) {
        if ((this.node as any).isOpen) return;
        this.node["isAutoTrigger"] = isAutoTrigger;
        let event = new Event('CLICK_ITEM', true);
        this.node.dispatchEvent(event);
    };

    // playAnimClick() {
    //     this.soundBoxClick && this.soundPlayer && this.soundPlayer.playSfx(this.soundBoxClick);

    //     this.staticNode.active = false;
    //     this.animation.node.active = true;

    //     this.animation.setAnimation(0, ChestAnim.Select, true);
    // };

    // playAnimOpen(value: number, isFast: boolean, isSelected: boolean, callback?: any) {
    //     (this.node as any).isOpen = true;
    //     this.isSelected = isSelected;
    //     this.disableClick();
    //     this.soundBoxOpen && this.soundPlayer && this.soundPlayer.playSfx(this.soundBoxOpen);

    //     this.animation.node.active = true;
    //     this.staticNode.active = false;

    //     this.animation.setSkin(this.mapValue[value]);
    //     this.animation.setAnimation(0, ChestAnim.Open, false);
    //     this.animation.setCompleteListener(() => {
    //         this.showScore(value, isFast);
    //         if (!isFast)
    //             tween(this.node)
    //                 .delay(isFast ? 0 : 1)
    //                 .call(() => this.bgLabelWin.active = true)
    //                 .start();

    //         if (callback && typeof callback === 'function') {
    //             callback();
    //         }

    //         this.animation.setCompleteListener(null);
    //         this.animation.setAnimation(0, ChestAnim.Idle, true);
    //     });
    // };

    // resetBox() {
    //     this.animation.node.active = false;
    //     this.animation.setSkin("1");
    //     this.staticNode.active = true;
    //     this.bgLabelWin.active = false;

    //     this.boxPosition && this.node.setPosition(this.boxPosition);
    //     this.setOpacity(this.staticNode, 255);
    //     this.setOpacity(this.node, 255);
    //     (this.node as any).isOpen = false;
    //     this.enableClick();
    //     this.isSelected = false;
    // }


}

