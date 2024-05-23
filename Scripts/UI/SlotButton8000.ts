import { _decorator, Button, EventKeyboard, KeyCode, sp } from 'cc';
import { SlotButton } from '../../../../cc-common/cc-slotbase/scripts/component/SlotButon/SlotButton';
import EventNames from '../../../../cc-common/cc-slotbase/scripts/core/EventNames';
const { ccclass, property } = _decorator;

@ccclass('SlotButton8000')
export class SlotButton8000 extends SlotButton {
    @property(sp.Skeleton)
    animSpinRotate: sp.Skeleton = null;

    onLoad(): void {
        super.onLoad();
        this.eventManager.on(EventNames.SPIN_CLICK_ACTION, this.onSpinClick, this);
        this.node.on('8000_START_SPIN_TUTO', this.startSpinTuto, this);

    }

    onDestroy(): void {
        this.eventManager.off(EventNames.SPIN_CLICK_ACTION, this.onSpinClick, this);
    }

    spinClick() {
        super.spinClick();
        this.spineBtnSpin?.setAnimation(0, 'Spin_To_Stop', false);
    }

    onSpinClick() {
        this.spineBtnSpin?.setAnimation(0, 'Spin_To_Stop', false);
    }

    onHover() {
        super.onHover();
        if (this.animSpinRotate)
            this.animSpinRotate.timeScale = 2;
    }

    onMouseLeave() {
        super.onMouseLeave();
        if (this.animSpinRotate)
            this.animSpinRotate.timeScale = 1;
    }
    startSpinTuto() {
        //this.soundPlayer.playSfx('SPIN');
        this.eventManager.emit(EventNames.SPIN_CLICK);
        this.node.emit('SPIN_CLICK');
        this.btnSpin.node.emit('BUTTON_SPIN_HIDE');
    }
}

