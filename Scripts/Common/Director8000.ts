import { _decorator } from 'cc';
import { Director } from '../../../../cc-common/cc-slotbase/scripts/core/Director';
import { SlotGameMode } from '../../../../cc-common/cc-slotbase/scripts/component/CustomEnum';
const { ccclass } = _decorator;

@ccclass('Director8000')
export class Director8000 extends Director {
    onLoad() {
        super.onLoad();
        this.node.on('8000_START_SPIN_TUTO', this.startSpinTuto, this);

    }
    newGameMode({ name, data }, callback) {
        super.newGameMode({ name, data }, callback);
        // this.guiMgr.hideAllUI();
        switch (name) {
            case SlotGameMode.NormalGame:
                this.guiMgr.showUIMain();
                break;
            case SlotGameMode.FreeGame:
                this.guiMgr.showUIFree();
                break;
            case SlotGameMode.BonusGame:
                this.guiMgr.showUIBonus();
                break;
        }
    }

    resumeGameMode({ name }, callback) {
        switch (name) {
            case SlotGameMode.NormalGame:
                this.guiMgr.showUIMain();
                break;
            case SlotGameMode.FreeGame:
                this.guiMgr.showUIFree();
                break;
            case SlotGameMode.BonusGame:
                this.guiMgr.showUIBonus();
                break;
        }

        super.resumeGameMode({ name }, callback);
    }
    startSpinTuto() {
        this.gameModes[SlotGameMode.NormalGame].emit('8000_START_SPIN_TUTO');
    }
}