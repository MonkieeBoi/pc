class Game {
    constructor() {
        this.board = new Board();
        this.queue = new Queue();
        this.active = this.queue.pop();
        this.hold = 0;
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
}
