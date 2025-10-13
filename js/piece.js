class Piece {
    constructor(type) {
        this.x = Math.floor(BOARD_WIDTH / 2) - 1;
        this.y = BOARD_HEIGHT - 1;
        this.rotation = 0;
        this.type = type;
    }

    get_minos() {
        let minos = [];
        for (let [off_x, off_y] of get_offsets(this.type, this.rotation)) {
            minos.push([this.x + off_x, this.y + off_y]);
        }
        return minos;
    }

    get_colour() {
        return get_colour(this.type);
    }

    get_cells() {
        return get_offsets(this.type, this.rotation).map((
            [x, y],
        ) => [x + this.x, y + this.y]);
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
}
