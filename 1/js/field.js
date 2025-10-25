const BOARD_WIDTH = 10;

class Field {
    constructor(hash = 0n) {
        hash = BigInt(hash);
        this.cells = [];
        let x = BOARD_WIDTH - 1;
        let y = 0;
        this.cleared = 0;
        while (hash != 0n) {
            if (hash & 1n) {
                this.set(x, y, 8);
            }

            x--;
            if (x == -1) {
                x = BOARD_WIDTH - 1;
                y++;
            }
            hash >>= 1n;
        }
    }

    clear_lines() {
        const orig_len = this.cells.length;
        this.cells = this.cells.filter((row) => row.some((cell) => cell === 0));
        this.cleared += orig_len - this.cells.length;
    }

    is_set(x, y) {
        if (this.cells.length <= y) {
            return false;
        }
        return this.cells[y][x] != 0;
    }

    set(x, y, piece) {
        while (this.cells.length <= y) {
            this.cells.push(Array(BOARD_WIDTH).fill(0));
        }
        if (x < 0 || x >= BOARD_WIDTH || y < 0) {
            return;
        }
        this.cells[y][x] = piece;
    }

    collides(piece) {
        for (const [x, y] of piece.get_cells()) {
            if (x < 0 || x >= BOARD_WIDTH || y < 0 || y >= 4) {
                return true;
            }
            if (this.is_set(x, y)) {
                return true;
            }
        }
        return false;
    }

    place(piece) {
        for (const [x, y] of piece.get_cells()) {
            this.set(x, y, piece.type);
        }
    }

    html() {
        let cells = Array(4).fill().map(
            () => Array(BOARD_WIDTH).fill(0),
        );
        for (let y = 0; y < this.cells.length; y++) {
            cells[y] = this.cells[y];
        }

        cells.reverse();
        return `<table class="field" cellspacing="0">` +
            cells.map(
                (row) =>
                    `<tr>` + row.map(
                        (cell) =>
                            `<td style="background:${get_colour(cell)}"></td>`,
                    ).join("") + `</tr>`,
            ).join("") +
            `</table>`;
    }

    get_hash() {
        let h = 0n;
        for (let y = this.cells.length - 1; y >= 0; y--) {
            for (let x = 0; x < BOARD_WIDTH; x++) {
                h <<= 1n;
                h += this.is_set(x, y) ? 1n : 0n;
            }
        }
        h *= BigInt(Math.pow(2, BOARD_WIDTH * this.cleared));
        h += BigInt(Math.pow(2, BOARD_WIDTH * this.cleared) - 1);
        return h;
    }
}
