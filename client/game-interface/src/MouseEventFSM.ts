import "phaser";

export class MouseEventFSM {
  constructor() {
    this.state = MouseEventFSMState.Base;
  }

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
          this.state = MouseEventFSMState.DragEnd;
        }
        break;
      case MouseEventFSMState.DragEnd:
      case MouseEventFSMState.PointerUp:
        if (event == PhaserEvent.DragThreshold) {
          this.state = MouseEventFSMState.DragStart;
        } else if (event == PhaserEvent.PointerDown) {
          this.state = MouseEventFSMState.PointerDown;
        }
        break;
      case MouseEventFSMState.PointerDown:
        if (event == PhaserEvent.PointerUp) {
          this.state = MouseEventFSMState.PointerUp;
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
        let startX = pointer.downX;
        let startY = pointer.downY;
        let x = pointer.x;
        let y = pointer.y;
        let tx = x - startX;
        let ty = y - startY;
        let dist = Math.sqrt(Math.pow(tx, 2) + Math.pow(ty, 2));
        if (dist > 5 * window.devicePixelRatio) {
          this.reactTo(PhaserEvent.DragThreshold);
        }
        this.reactTo(PhaserEvent.Drag);
        if (this.state == MouseEventFSMState.DragStart) {
          this.dragStart(pointer, dragX, dragY);
        } else if (this.state == MouseEventFSMState.Drag) {
          this.drag(pointer, dragX, dragY);
        }
      }
    );

    gameObject.on(
      "dragend",
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        this.reactTo(PhaserEvent.DragEnd);
        if (this.state == MouseEventFSMState.DragEnd) {
          this.dragStart(pointer, dragX, dragY);
        }
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
        this.reactTo(PhaserEvent.PointerUp);
        this.pointerUp(pointer, localX, localY, event);
      }
    );
  }
}

enum MouseEventFSMState {
  Base = "base",
  DragStart = "dragstart",
  Drag = "drag",
  DragEnd = "dragend",
  PointerDown = "pointerdown",
  PointerUp = "pointerup"
}

enum PhaserEvent {
  DragThreshold = "dragthreshold",
  Drag = "drag",
  DragEnd = "dragend",
  PointerDown = "pointerdown",
  PointerUp = "pointerup"
}
