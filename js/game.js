class Game {
    constructor() {
        this.board = new Board();
        this.queue = new Queue();
        this.active = this.queue.pop();
        this.hold_piece = 0;
        this.held = false;
    }

    check_collide(piece, cx, cy, rotation) {
        for (let [off_x, off_y] of get_offsets(piece, rotation)) {
            let x = cx + off_x;
            let y = cy + off_y;
            if (
                x < 0 || x >= BOARD_WIDTH || y < 0 ||
                this.board.is_filled(x, y)
            ) {
                return true;
            }
        }
        return false;
    }

    get_ghost_y() {
        let y = this.active.y;
        while (
            !this.check_collide(
                this.active.type,
                this.active.x,
                y - 1,
                this.active.rotation,
            )
        ) {
            y--;
        }
        return y;
    }

    hold() {
        if (this.held) {
            return;
        }
        this.held = true;
        if (this.hold_piece === 0) {
            this.hold_piece = this.active.type;
            this.active = this.queue.pop();
        } else {
            let tmp = this.active.type;
            this.active = new Piece(this.hold_piece);
            this.hold_piece = tmp;
        }
    }

    move_piece_x(step, amount) {
        while (
            !this.check_collide(
                this.active.type,
                this.active.x + step,
                this.active.y,
                this.active.rotation,
            ) &&
            amount > 0
        ) {
            this.active.move(step, 0);
            amount--;
        }
    }

    move_piece_y(step, amount) {
        while (
            !this.check_collide(
                this.active.type,
                this.active.x,
                this.active.y + step,
                this.active.rotation,
            ) &&
            amount > 0
        ) {
            this.active.move(0, step);
            amount--;
        }
    }

    spin(goal) {
        const init = this.active.rotation;
        for (let [kick_x, kick_y] of get_kicks(this.active.type, init, goal)) {
            if (
                !this.check_collide(
                    this.active.type,
                    this.active.x + kick_x,
                    this.active.y + kick_y,
                    goal,
                )
            ) {
                this.active.move(kick_x, kick_y);
                this.active.rotation = goal;
                break;
            }
        }
    }

    spin_cw() {
        this.spin(spin_cw(this.active.rotation));
    }

    spin_ccw() {
        this.spin(spin_ccw(this.active.rotation));
    }

    spin_180() {
        this.spin(spin_180(this.active.rotation));
    }
}
