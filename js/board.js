class Board {
    constructor() {
        this.cells = [];
    }

    clear_lines() {
        const orig_len = this.cells.length;
        this.cells = this.cells.filter((row) => row.some((cell) => cell === 0));
        return orig_len - this.cells.length;
    }

    is_filled(x, y) {
        if (this.cells.length <= y) {
            return false;
        }
        return this.cells[y][x] != 0;
    }

    set(x, y, piece) {
        while (this.cells.length <= y) {
            this.cells.push(Array(BOARD_WIDTH).fill(0));
        }
        this.cells[y][x] = piece;
    }

    highest() {
        return this.cells.length;
    }

    is_empty() {
        return this.cells.flat().reduce((sum, c) => sum + c, 0) == 0;
    }
}
