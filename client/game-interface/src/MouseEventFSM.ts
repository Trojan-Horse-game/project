/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-use-before-define */
import "phaser";

export class MouseEventFSM {
  constructor() {
    this.state = MouseEventFSMState.Base;
  }

  private id: number = Math.floor(Math.random() * 10000);
  private _state: MouseEventFSMState;

  pointerUp: (
    pointer: Phaser.Input.Pointer,
    localX: number,
    localY: number,
    event: Phaser.Types.Input.EventData
  ) => void = () => {};

  dragStart: (
    pointer: Phaser.Input.Pointer,
    dragX: number,
    dragY: number
  ) => void = () => {};

  drag: (
    pointer: Phaser.Input.Pointer,
    dragX: number,
    dragY: number
  ) => void = () => {};

  dragEnd: (
    pointer: Phaser.Input.Pointer,
    dragX: number,
    dragY: number
  ) => void = () => {};

  get state(): MouseEventFSMState {
    return this._state;
  }

  set state(newState: MouseEventFSMState) {
    this._state = newState;
  }

  reactTo(event: PhaserEvent): MouseEventFSMState {
    switch (this.state) {
      case MouseEventFSMState.Base:
        if (event == PhaserEvent.DragThreshold) {
          this.state = MouseEventFSMState.DragStart;
        } else if (event == PhaserEvent.PointerDown) {
          this.state = MouseEventFSMState.PointerDown;
        }
        break;
      case MouseEventFSMState.DragStart:
        if (event == PhaserEvent.Drag) {
          this.state = MouseEventFSMState.Drag;
        }
        break;
      case MouseEventFSMState.Drag:
        if (event == PhaserEvent.Drag) {
          this.state = MouseEventFSMState.Drag;
        } else if (event == PhaserEvent.DragEnd) {
          this.state = MouseEventFSMState.Base;
        }
        break;
      case MouseEventFSMState.PointerDown:
        if (event == PhaserEvent.PointerUp) {
          this.state = MouseEventFSMState.Base;
        } else if (event == PhaserEvent.DragThreshold) {
          this.state = MouseEventFSMState.DragStart;
        }
        break;
    }
    return this.state;
  }

  linkToGameObject(gameObject: Phaser.GameObjects.GameObject) {
    gameObject.on(
      "drag",
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        const startX = pointer.downX;
        const startY = pointer.downY;
        const x = pointer.x;
        const y = pointer.y;
        const tx = x - startX;
        const ty = y - startY;
        const dist = Math.sqrt(Math.pow(tx, 2) + Math.pow(ty, 2));
        if (dist > 5 * window.devicePixelRatio) {
          this.reactTo(PhaserEvent.DragThreshold);
          if (this.state == MouseEventFSMState.DragStart) {
            this.dragStart(pointer, dragX, dragY);
          }
        }
        this.reactTo(PhaserEvent.Drag);
        if (this.state == MouseEventFSMState.Drag) {
          this.drag(pointer, dragX, dragY);
        }
      }
    );

    gameObject.on(
      "dragend",
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        if (this.state == MouseEventFSMState.Drag) {
          this.dragEnd(pointer, dragX, dragY);
        }
        this.reactTo(PhaserEvent.DragEnd);
      }
    );

    gameObject.on("pointerdown", () => {
      this.reactTo(PhaserEvent.PointerDown);
    });

    gameObject.on(
      "pointerup",
      (
        pointer: Phaser.Input.Pointer,
        localX: number,
        localY: number,
        event: Phaser.Types.Input.EventData
      ) => {
        if (this.state == MouseEventFSMState.PointerDown) {
          this.pointerUp(pointer, localX, localY, event);
        }
        this.reactTo(PhaserEvent.PointerUp);
      }
    );
  }
}

enum MouseEventFSMState {
  Base = "base",
  DragStart = "dragstart",
  Drag = "drag",
  PointerDown = "pointerdown"
}

enum PhaserEvent {
  DragThreshold = "dragthreshold",
  Drag = "drag",
  DragEnd = "dragend",
  PointerDown = "pointerdown",
  PointerUp = "pointerup"
}
