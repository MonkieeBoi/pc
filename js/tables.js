const offsets = [
    [],
    // T
    [
        [[0, 1], [-1, 0], [0, 0], [1, 0]],
        //   []
        // []<>[]
        [[0, 1], [0, 0], [1, 0], [0, -1]],
        // []
        // <>[]
        // []
        [[-1, 0], [0, 0], [1, 0], [0, -1]],
        // []<>[]
        //   []
        [[0, 1], [-1, 0], [0, 0], [0, -1]],
        //   []
        // []<>
        //   []
    ],
    // I
    [
        [[-1, 0], [0, 0], [1, 0], [2, 0]],
        // []<>[][]
        [[0, 1], [0, 0], [0, -1], [0, -2]],
        // []
        // <>
        // []
        // []
        [[-2, 0], [-1, 0], [0, 0], [1, 0]],
        // [][]<>[]
        [[0, 2], [0, 1], [0, 0], [0, -1]],
        // []
        // []
        // <>
        // []
    ],
    // J
    [
        [[-1, 1], [-1, 0], [0, 0], [1, 0]],
        // []
        // []<>[]
        [[0, 1], [1, 1], [0, 0], [0, -1]],
        // [][]
        // <>
        // []
        [[-1, 0], [0, 0], [1, 0], [1, -1]],
        // []<>[]
        //     []
        [[0, 1], [0, 0], [-1, -1], [0, -1]],
        //   []
        //   <>
        // [][]
    ],
    // L
    [
        [[1, 1], [-1, 0], [0, 0], [1, 0]],
        //     []
        // []<>[]
        [[0, 1], [0, 0], [0, -1], [1, -1]],
        // []
        // <>
        // [][]
        [[-1, 0], [0, 0], [1, 0], [-1, -1]],
        // []<>[]
        // []
        [[-1, 1], [0, 1], [0, 0], [0, -1]],
        // [][]
        //   <>
        //   []
    ],
    // O
    [
        [[0, 1], [1, 1], [0, 0], [1, 0]],
        // [][]
        // <>[]
        [[0, 0], [1, 0], [0, -1], [1, -1]],
        // <>[]
        // [][]
        [[-1, 0], [0, 0], [-1, -1], [0, -1]],
        // []<>
        // [][]
        [[-1, 1], [0, 1], [-1, 0], [0, 0]],
        // [][]
        // []<>
    ],
    // S
    [
        [[0, 1], [1, 1], [-1, 0], [0, 0]],
        //   [][]
        // []<>
        [[0, 1], [0, 0], [1, 0], [1, -1]],
        // []
        // <>[]
        //   []
        [[0, 0], [1, 0], [-1, -1], [0, -1]],
        //   <>[]
        // [][]
        [[-1, 1], [-1, 0], [0, 0], [0, -1]],
        // []
        // []<>
        //   []
    ],
    // Z
    [
        [[-1, 1], [0, 1], [0, 0], [1, 0]],
        // [][]
        //   <>[]
        [[1, 1], [0, 0], [1, 0], [0, -1]],
        //   []
        // <>[]
        // []
        [[-1, 0], [0, 0], [0, -1], [1, -1]],
        // []<>
        //   [][]
        [[0, 1], [-1, 0], [0, 0], [-1, -1]],
        //   []
        // []<>
        // []
    ],
];

const kick_offset_2x3 = [
    // Spawn
    [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
    // CW
    [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    // 180
    [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
    // CCW
    [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
];

const kick_offset_1x4 = [
    // Spawn
    [[0, 0], [-1, 0], [2, 0], [-1, 0], [2, 0]],
    // CW
    [[-1, 0], [0, 0], [0, 0], [0, 1], [0, -2]],
    // 180
    [[-1, 1], [1, 1], [-2, 1], [1, 0], [-2, 0]],
    // CCW
    [[0, 1], [0, 1], [0, 1], [0, -1], [0, 2]],
];

const kick_offset_2x2 = [
    // Spawn
    [[0, 0]],
    // CW
    [[0, -1]],
    // 180
    [[-1, -1]],
    // CCW
    [[-1, 0]],
];

const kick_offset_180_2x3 = [
    // Spawn
    [[0, 0], [0, 1]],
    // CW
    [[0, 0], [1, 0]],
    // 180
    [[0, 0], [0, 0]],
    // CCW
    [[0, 0], [0, 0]],
];

const kick_offset_180_1x4 = [
    // Spawn
    [[1, -1], [1, 0]],
    // CW
    [[-1, -1], [0, -1]],
    // 180
    [[0, 0], [0, 0]],
    // CCW
    [[0, 0], [0, 0]],
];

const kick_offset_180_2x2 = [
    // Spawn
    [[1, 1]],
    // CW
    [[1, -1]],
    // 180
    [[0, 0]],
    // CCW
    [[0, 0]],
];

function gen_kick_table(offsets, offsets_180) {
    let table = new Array(4);
    for (let a = 0; a < 4; a++) {
        table[a] = new Array(4);
        // None
        table[a][a] = [[0, 0]];
        // CW
        let b = spin_cw(a);
        table[a][b] = offsets[a].map((e, i) =>
            e.map((f, j) => f - offsets[b][i][j])
        );
        // CCW
        b = spin_ccw(a);
        table[a][b] = offsets[a].map((e, i) =>
            e.map((f, j) => f - offsets[b][i][j])
        );
        // 180
        b = spin_180(a);
        table[a][b] = offsets_180[a].map((e, i) =>
            e.map((f, j) => f - offsets_180[b][i][j])
        );
    }
    return table;
}

const kicks_2x3 = gen_kick_table(kick_offset_2x3, kick_offset_180_2x3);
const kicks_1x4 = gen_kick_table(kick_offset_1x4, kick_offset_180_1x4);
const kicks_2x2 = gen_kick_table(kick_offset_2x2, kick_offset_180_2x2);

// TIJLOSZ order
const kick_map = [
    null,
    kicks_2x3,
    kicks_1x4,
    kicks_2x3,
    kicks_2x3,
    kicks_2x2,
    kicks_2x3,
    kicks_2x3,
];

const colour_table = [
    "#2e3440",
    "#b48ead",
    "#88C0D0",
    "#5e81ac",
    "#d08770",
    "#ebcb8b",
    "#a3be8c",
    "#bf616a",
];

const piece_to_name = [null, "T", "I", "J", "L", "O", "S", "Z"];

const name_to_piece = {
    "T": 1,
    "I": 2,
    "J": 3,
    "L": 4,
    "O": 5,
    "S": 6,
    "Z": 7,
};

function get_colour(piece) {
    return colour_table[piece];
}

function spin_cw(rotation) {
    return (rotation + 1) % 4;
}

function spin_180(rotation) {
    return (rotation + 2) % 4;
}

function spin_ccw(rotation) {
    return (rotation + 3) % 4;
}

function get_offsets(piece, rotation) {
    return offsets[piece][rotation];
}

function get_kicks(piece, init_rot, target_rot) {
    return kick_map[piece][init_rot][target_rot];
}

function get_piece_name(piece) {
    return piece_to_name[piece];
}

function get_piece_number(piece) {
    return name_to_piece[piece];
}
