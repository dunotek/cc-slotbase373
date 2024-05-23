import { _decorator, Component, Node } from 'cc';
import { Turbo } from '../../../../cc-common/cc-slotbase/scripts/component/Turbo';
const { ccclass, property } = _decorator;

@ccclass('Turbo8000')
export class Turbo8000 extends Turbo {
    @property(Node)
    nodeBtnTurboOn: Node = null;

    @property(Node)
    nodeBtnTurboOff: Node = null;

    loadTurboConfig() {
        super.loadTurboConfig();
        this.setButtonTurbo();
    }


    turnOnTurbo() {
        this.turboToggle();
        super.turnOnTurbo();
        this.setButtonTurbo();
    }

    turnOffTurbo() {
        this.turboToggle();
        super.turnOffTurbo();
        this.setButtonTurbo();
    }

    setButtonTurbo() {
        this.nodeBtnTurboOn.active = this.dataStore.modeTurbo;
        this.nodeBtnTurboOff.active = !this.dataStore.modeTurbo;
    }
}

