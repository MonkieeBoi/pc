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

	draw_hold(hold_context);
	draw_queue(queue_context);
	draw_game(board_context);
}

function draw_game(context, game) {
}

function draw_board(context, board) {
}

function draw_queue(context, queue) {
}

function draw_hold(context, hold) {
}

function draw_piece(context, piece) {
}
