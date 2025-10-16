class Game {
    constructor(patterns) {
        this.arr = 0;
        this.sd_arr = 0;
        this.das = 69;
        if (patterns != undefined) {
            this.calc_queues(patterns);
        }
        this.reset();
    }

    calc_queues(patterns) {
        let queues = new Set();
        for (
            const pattern of patterns.split("\n").filter((x) => x.trim())
        ) {
            for (const q of pieces(pattern)) {
                queues.add(q);
            }
        }
        this.queues = [...queues];
    }

    reset() {
        this.board = new Board();
        this.held = false;
        this.hold_piece = 0;
        this.timers = {
            "l": -1,
            "r": -1,
            "sd": -1,
        };
        if (this.queues === undefined || this.queues.length == 0) {
            this.queue = new Queue();
        } else {
            this.queue = new PQueue(
                this.queues[randInt(0, this.queues.length - 1)],
            );
            this.hold_piece = this.queue.pop().type;
        }
        this.active = this.queue.pop();
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
        let moved = false;
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
            moved = true;
        }
        return moved;
    }

    move_piece_y(step, amount) {
        let moved = false;
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
            moved = true;
        }
        return moved;
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

    lock() {
        this.move_piece_y(-1, BOARD_HEIGHT * 2);
        this.held = false;
        for (let [x, y] of this.active.get_cells()) {
            this.board.set(x, y, this.active.type);
        }
        this.board.clear_lines();
        this.active = this.queue.pop();
        if (this.active.type != undefined) {
            return;
        }
        if (this.hold_piece != 0) {
            this.active = new Piece(this.hold_piece);
            this.hold_piece = 0;
        }
    }

    tick(time, actions) {
        let buf = {
            "l": false,
            "r": false,
            "sd": false,
        };
        for (let action of actions) {
            switch (action) {
                case "hold":
                    this.hold();
                    break;
                case "ccw":
                    this.spin_ccw();
                    break;
                case "cw":
                    this.spin_cw();
                    break;
                case "180":
                    this.spin_180();
                    break;
                case "hd":
                    this.lock();
                    break;
                case "reset":
                    this.reset();
                    break;
                case "l":
                case "r":
                case "sd":
                    buf[action] = true;
                    break;
            }
        }
        if (buf["sd"]) {
            this.move_piece_y(-1, BOARD_HEIGHT * 2);
            // if (this.timers["sd"] == -1) {
            //     this.timers["sd"] = time;
            //     this.move_piece_y(-1, 1);
            // } else if (time - this.timers["sd"] >= this.das) {
            //     let sddas = this.timers["sd"];
            //     while (sddas < time) {
            //         if (!this.move_piece_y(-1, 1)) {
            //             break;
            //         }
            //         sddas += this.sd_arr;
            //     }
            //     this.timers["sd"] = sddas;
            // }
        } else {
            this.timers["sd"] = -1;
        }
        let ldas = -1;
        let rdas = -1;

        if (!buf["l"]) {
            this.timers["l"] = -1;
        } else if (
            this.timers["l"] != -1 && time - this.timers["l"] >= this.das
        ) {
            ldas = this.timers["l"];
        }

        if (!buf["r"]) {
            this.timers["r"] = -1;
        } else if (
            this.timers["r"] != -1 && time - this.timers["r"] >= this.das
        ) {
            rdas = this.timers["r"];
        }

        // replace with arr later
        if (buf["l"] && buf["r"] && (ldas == -1 || rdas == -1)) {
        } else if (ldas != -1 && (rdas == -1 || ldas > rdas)) {
            while (ldas < time) {
                if (!this.move_piece_x(-1, 1)) {
                    break;
                }
                ldas += this.arr;
            }
            this.timers["l"] = ldas;
        } else if (rdas != -1) {
            while (rdas < time) {
                if (!this.move_piece_x(1, 1)) {
                    break;
                }
                rdas += this.arr;
            }
            this.timers["r"] = rdas;
        }
        if (buf["l"] && this.timers["l"] == -1) {
            this.move_piece_x(-1, 1);
            this.timers["l"] = time;
        }
        if (buf["r"] && this.timers["r"] == -1) {
            this.move_piece_x(1, 1);
            this.timers["r"] = time;
        }
    }
}
