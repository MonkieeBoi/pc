let CELL_SIZE = 20;
let BOARD_HEIGHT = 20;
let BOARD_WIDTH = 10;

function main() {
    let board_canvas = document.getElementById("board");
    let queue_canvas = document.getElementById("queue");
    let hold_canvas = document.getElementById("hold");

    board_canvas.width = BOARD_WIDTH * CELL_SIZE;
    board_canvas.height = BOARD_HEIGHT * CELL_SIZE;
    queue_canvas.width = 4 * CELL_SIZE;
    queue_canvas.height = 14 * CELL_SIZE;
    hold_canvas.width = 4 * CELL_SIZE;
    hold_canvas.height = 2 * CELL_SIZE;

    let board_context = board_canvas.getContext("2d");
    let queue_context = queue_canvas.getContext("2d");
    let hold_context = hold_canvas.getContext("2d");

    // Set origin to bottom left
    hold_context.setTransform(CELL_SIZE, 0, 0, -CELL_SIZE, 0, 2 * CELL_SIZE);
    board_context.setTransform(CELL_SIZE, 0, 0, -CELL_SIZE, 0, 20 * CELL_SIZE);
    queue_context.setTransform(CELL_SIZE, 0, 0, -CELL_SIZE, 0, 14 * CELL_SIZE);

    const game = new Game();

    draw_hold(hold_context, game.hold);
    draw_queue(queue_context, game.queue);
    draw_game(board_context, game);
}

function draw_game(context, game) {
    draw_board(context, game.board);
}

function draw_board(context, board) {
    context.fillStyle = get_color(0);
    context.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

    // Grid
    context.beginPath();
    for (let x = 1; x < BOARD_WIDTH; x++) {
        context.moveTo(x, 0);
        context.lineTo(x, 20);
    }
    for (let y = 1; y < BOARD_HEIGHT; y++) {
        context.moveTo(0, y);
        context.lineTo(10, y);
    }
    let transform = context.getTransform();
    context.resetTransform();
    context.strokeStyle = "#ffffff0E";
    context.lineWidth = 1;
    context.stroke();
    context.setTransform(transform);

    // Minos
    for (let y = 0; y < Math.min(board.cells.length, BOARD_HEIGHT); y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (board.cells[y][x] !== 0) {
                context.fillStyle = get_color(board.cells[y][x]);
                context.fillRect(x, y, 1, 1);
            }
        }
    }
}

function draw_queue(context, queue) {
}

function draw_hold(context, hold) {
}

function draw_piece(context, piece) {
}
