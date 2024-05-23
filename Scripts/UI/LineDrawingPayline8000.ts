import { _decorator, Component, Node, sp } from 'cc';
import { GameObject } from '../../../../cc-common/cc-slotbase/scripts/core/GameObject';
import { PoolFactory } from '../../../../cc-common/cc-slotbase/scripts/component/PoolFactory';
import EventNames from '../../../../cc-common/cc-slotbase/scripts/core/EventNames';
const { ccclass, property } = _decorator;

@ccclass('LineDrawingPayline8000')
export class LineDrawingPayline8000 extends GameObject {
    @property(Node)
    lineHolder: Node = null;

    @property linePrefabName: string = "";

    _poolFactory: PoolFactory = null;
    _usingObj = [];

    onLoad(): void {
        super.onLoad();

        if (!this._poolFactory) {
            this._poolFactory = this.mainDirector.poolFactory;
        }

        this.eventManager.on(EventNames.DRAWING_LINE_ADD, this.drawingLine, this);
        this.eventManager.on(EventNames.DRAWING_LINE_CLEAR, this.clearLine, this);
    }

    onDestroy(): void {
        this.eventManager.off(EventNames.DRAWING_LINE_ADD, this.drawingLine, this);
        this.eventManager.off(EventNames.DRAWING_LINE_CLEAR, this.clearLine, this);
    }

    // onEnable(): void {
    //     this.eventManager.on("DRAWING_LINE", this.drawingLine, this);
    // }

    // protected onDisable(): void {
    //     this.eventManager.off("DRAWING_LINE", this.drawingLine, this);
    // }

    drawingLine(paylineInfo) {
        let line: Node;
        if (this._poolFactory) {
            line = this._poolFactory.getObject(this.linePrefabName);
            line && (line.active = true);
        }
        if (!line) return;
        line.parent = this.lineHolder;

        const { payLineID } = paylineInfo;
        let animation = line.getComponent(sp.Skeleton);
        animation.setAnimation(0, payLineID, false);

        this._usingObj.push(line);
    }

    clearLine() {
        this._usingObj.forEach((line) => {
            this._poolFactory.removeObject(line);
        });

        this._usingObj = [];
    }
}

