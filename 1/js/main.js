const piece_name = ["I", "J", "L", "O", "S", "T", "Z"];
const pconv = [2, 3, 4, 5, 6, 1, 7, 0, 8];

function load_data(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = url;
        script.type = "text/javascript";

        script.onload = () => {
            resolve({
                init_hash: window.init_hash,
                data: window.data,
            });
        };

        script.onerror = () => {
            reject(new Error(`Failed to load: ${url}`));
        };

        document.head.appendChild(script);
    });
}

function interpolate(prev, cur, piece) {
    const pf = new Field(prev);
    const p = new Piece(piece);
    cur = BigInt(cur);
    for (let x = 0; x < BOARD_WIDTH; x++) {
        p.x = x;
        for (let y = 0; y < 4; y++) {
            p.y = y;
            for (let r = 0; r < 4; r++) {
                p.rotation = r;
                if (pf.collides(p)) {
                    continue;
                }
                let f = new Field(prev);
                f.place(p);
                f.clear_lines();
                // console.log(f.cells);
                // console.log(f.get_hash(), cur);
                if (f.get_hash() == cur) {
                    return p;
                }
            }
        }
    }
    return null;
}

function add_content(container, rev, prev_hash, hash, piece, score) {
    if (hash == -1) {
        container.innerText = "💀";
        return;
    }
    if (rev != -1) {
        container.innerText = `rev: ${piece_name[rev]}\n`;
    }
    let p = interpolate(prev_hash, hash, pconv[piece]);
    let field = new Field(prev_hash);
    if (p != null) {
        field.place(p);
    }
    container.insertAdjacentHTML(
        "beforeend",
        field.html(),
    );
    if (score != undefined) {
        container.append("\n" + -score);
    }
}

function add_solve(parent, rev, prev_hash, data) {
    for (let i = 1; i < 7; i++) {
        let hash = data[i][0];
        let piece = data[i][1];
        const node_li = document.createElement("li");

        const node_div = document.createElement("button");
        const next_ul = document.createElement("ul");

        node_div.classList.add("node");
        add_content(node_div, rev, prev_hash, hash, piece);

        node_li.appendChild(node_div);
        parent.appendChild(node_li);

        if (i < 6) node_li.appendChild(next_ul);
        parent = next_ul;
        prev_hash = hash;
        if (i == 1) {
            rev = -1;
        }
    }
}

function add(parent, rev, prev_hash, data) {
    if (data == null) {
        return false;
    }
    if (data.length == 7) {
        add_solve(parent, rev, prev_hash, data);
        return true;
    }
    let [hash, piece, score, next] = data;
    const node_li = document.createElement("li");

    const node_content = document.createElement("button");
    const next_ul = document.createElement("ul");
    if (prev_hash != 0) {
        next_ul.classList.add("hidden");
    }

    node_content.classList.add("node");
    add_content(node_content, rev, prev_hash, hash, piece, score);

    node_content.onclick = (e) => {
        next_ul.classList.toggle("hidden");
        const elem = e.currentTarget;

        elem.scrollIntoView({
            inline: "center",
            block: "nearest",
            behavior: "smooth",
        });
    };

    node_li.appendChild(node_content);
    parent.appendChild(node_li);

    if (hash == -1) {
        return false;
    }

    let not_leaf = false;
    for (let i = 0; i < 7; i++) {
        not_leaf = add(next_ul, i, hash, next[i]) || not_leaf;
    }
    if (not_leaf) {
        node_li.appendChild(next_ul);
    }
    return true;
}

async function main() {
    const queue = location.hash.substring(1);
    const root = document.querySelector(".tree");
    try {
        const { init_hash, data } = await load_data(`./data/${queue}.js`);
        add(root, -1, init_hash, data);
    } catch (error) {
        console.log(error);
        for (let i = 0; i < 100; i++) {
            try {
                const { init_hash, data } = await load_data(
                    `./data/${prompt("queue", "TIJLOSZ")}.js`,
                );
                add(root, -1, init_hash, data);
                break;
            } catch (error) {
                console.log(error);
            }
        }
    }
}

window.addEventListener("load", main);
