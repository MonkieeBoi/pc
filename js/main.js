let CELL_SIZE = 25;
let BOARD_HEIGHT = 20;
let BOARD_WIDTH = 10;

function main() {
    let board_canvas = document.getElementById("board");
    let queue_canvas = document.getElementById("queue");
    let hold_canvas = document.getElementById("hold");
    let game_div = document.getElementById("game");
    let patterns = document.getElementById("patterns");
    patterns.innerText =
        location.hash.substring(1).replaceAll(",", "\n").replaceAll("~", "^") ||
        "";
    window.history.replaceState(
        null,
        "",
        location.href.replace(location.hash, ""),
    );

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

    let game = new Game(patterns.innerText.toUpperCase());
    const input = new Input(game_div);

    patterns.addEventListener("beforeinput", function (event) {
        if (event.data && !/[toiljszpc\^\[\]!*0-9\n\r]/ig.test(event.data)) {
            event.preventDefault();
        }
    });

    init_input(input, game);

    document.getElementById("generate_button").onclick = () => {
        game = new Game(patterns.innerText.toUpperCase());
    };

    requestAnimationFrame(frame);
    function frame(timestamp) {
        game.tick(timestamp, input.read());
        draw_hold(hold_context, game.hold_piece);
        draw_queue(queue_context, game.queue);
        draw_game(board_context, game);
        requestAnimationFrame(frame);
    }
}

function init_input(input, game) {
    let tunings = document.getElementById("tunings");
    let keybinds = document.getElementById("keybinds");

    for (let action in input.rev_keymap) {
        let tr = keybinds.insertRow();

        let label_td = tr.insertCell();
        label_td.innerText = action;

        let value_td = tr.insertCell();
        let value_input = document.createElement("input");

        value_td.appendChild(value_input);
        value_input.value = input.rev_keymap[action];

        value_input.onkeydown = function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (input.rebind(action, event.code)) {
                value_input.value = event.code;
            }
        };
    }

    for (let tuning of ["das", "arr", "sd_arr"]) {
        let tr = tunings.insertRow();

        let label_td = tr.insertCell();
        label_td.innerText = tuning;

        let value_td = tr.insertCell();
        let value_input = document.createElement("input");

        value_td.appendChild(value_input);
        value_input.value = game[tuning];
        value_input.type = "number";
        value_input.min = 0;

        value_input.onchange = function (event) {
            game[tuning] = event.target.value;
        };
    }
    window.addEventListener("keydown", (event) => {
        let url = new URL(location.href.replace(location.hash, ""));
        url.hash = document.getElementById("patterns").innerText.replaceAll(
            "\n",
            ",",
        ).replaceAll("^", "~");
        if (event.key == "y") {
            navigator.clipboard.writeText(url.href);
        }
    });
}

function draw_game(context, game) {
    draw_board(context, game.board);
    draw_piece(
        context,
        game.active.type,
        game.active.x,
        game.active.y,
        game.active.rotation,
    );
    // Ghost
    draw_piece(
        context,
        game.active.type,
        game.active.x,
        game.get_ghost_y(),
        game.active.rotation,
        "4D",
    );
}

function draw_board(context, board) {
    context.fillStyle = get_colour(0);
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
                context.fillStyle = get_colour(board.cells[y][x]);
                context.fillRect(x, y, 1, 1);
            }
        }
    }
    let game_div = document.getElementById("game");
    if (!(document.activeElement === game_div)) {
        draw_oof(context);
    }
}

function draw_queue(context, queue) {
    context.fillStyle = get_colour(0);
    context.fillRect(0, 0, 4, 14);
    let preview = queue.preview();
    for (let i = 0; i < Math.min(preview.length, 5); i++) {
        draw_piece(context, preview[i], 1, 12 - 3 * i, 0);
    }
}

function draw_hold(context, hold) {
    context.fillStyle = get_colour(0);
    context.fillRect(0, 0, 4, 2);

    if (!get_piece_name(hold)) {
        return;
    }

    context.fillStyle = get_colour(hold);
    draw_piece(context, hold, 1, 0, 0);
}

function draw_piece(context, piece, x, y, rotation, opacity) {
    if (opacity === undefined) {
        opacity = "";
    }
    for (let [off_x, off_y] of get_offsets(piece, rotation)) {
        context.fillStyle = get_colour(piece) + opacity;
        context.fillRect(x + off_x, y + off_y, 1, 1);
    }
}

function draw_oof(context) {
    transform = context.getTransform();
    context.resetTransform();
    context.font = `bold ${CELL_SIZE + 5}px Arial`;
    context.fillStyle = "rgba(235, 203, 139, 0.7)";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(
        "OUT OF FOCUS",
        context.canvas.width / 2,
        context.canvas.height / 2,
    );
    context.setTransform(transform);
}
