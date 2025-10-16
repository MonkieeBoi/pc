const BAG_SIZE = 7;

class Queue {
    constructor() {
        this.reset();
    }

    #gen_bag() {
        return Array.from(Array(BAG_SIZE), (_, i) => (i + 1) % 8);
    }

    reset() {
        this.bag = this.#gen_bag();
        this.queue = Array(BAG_SIZE);
        for (let i = BAG_SIZE - 1; i > 0; i--) {
            const rand = randInt(0, i);
            this.queue[BAG_SIZE - 1 - i] = this.bag[rand];
            this.bag[rand] = this.bag[i];
        }
        this.queue[BAG_SIZE - 1] = this.bag[0];
        this.bag = this.#gen_bag();
        this.pos = 0;
    }

    pop() {
        let piece = new Piece(this.queue[this.pos]);

        let bag_len = BAG_SIZE - this.pos;
        let rand = randInt(0, bag_len - 1);

        this.queue[this.pos] = this.bag[rand];
        this.bag[rand] = this.bag[bag_len - 1];

        if (bag_len == 1) {
            this.bag = this.#gen_bag();
        }

        this.pos = (this.pos + 1) % BAG_SIZE;
        return piece;
    }

    preview() {
        let pos = this.pos;
        let res = [];
        for (let i = 0; i < BAG_SIZE; i++) {
            res.push(this.queue[pos]);
            pos = (pos + 1) % BAG_SIZE;
        }
        return res;
    }
}

class PQueue {
    constructor(queue) {
        this.init_queue = queue;
        this.reset();
    }

    reset() {
        this.queue = Array.from(this.init_queue).map((x) =>
            get_piece_number(x)
        );
    }

    pop() {
        return new Piece(this.queue.shift());
    }

    preview() {
        let res = [];
        for (let i = 0; i < Math.min(this.queue.length, BAG_SIZE); i++) {
            res.push(this.queue[i]);
        }
        return res;
    }
}
