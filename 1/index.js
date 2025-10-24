const piece_name = ["I", "J", "L", "O", "S", "T", "Z"];

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

function display_hash(hash) {
    hash = BigInt(hash);
    const field = Array.from(
        { length: 4 },
        () => Array.from({ length: 10 }, () => []).fill(0),
    );
    let x = 9;
    let y = 3;
    while (hash != 0n) {
        if (hash & 1n) {
            field[y][x] = 1;
        }

        x--;
        if (x == -1) {
            x = 10 - 1;
            y--;
        }
        hash >>= 1n;
    }
    return field.map((row) => row.join("")).join("\n").replaceAll("0", "⬛")
        .replaceAll("1", "⬜");
}

function add_solve(parent, rev, prev_hash, data) {
    for (let i = 1; i < 6; i++) {
        hash = data[i][0];
        const node_li = document.createElement("li");

        const node_div = document.createElement("button");
        const next_ul = document.createElement("ul");

        node_div.classList.add("node");
        if (i == 1) {
            node_div.innerText = `rev: ${piece_name[rev]}\n` +
                display_hash(hash);
        } else {
            node_div.innerText = display_hash(hash);
        }

        node_li.appendChild(node_div);
        parent.appendChild(node_li);

        if (i < 5) node_li.appendChild(next_ul);
        parent = next_ul;
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

    const node_div = document.createElement("button");
    const next_ul = document.createElement("ul");
    if (prev_hash != 0) {
        next_ul.classList.add("hidden");
    }

    node_div.onclick = (e) => {
        next_ul.classList.toggle("hidden");
        const elem = e.currentTarget;

        elem.scrollIntoView({
            inline: "center",
            block: "nearest",
            behavior: "smooth",
        });
    };

    node_div.classList.add("node");
    if (hash == -1) {
        node_div.innerText = "💀";
    } else if (rev == -1) {
        node_div.innerText = display_hash(hash) + "\n" + -score;
    } else {
        node_div.innerText = `rev: ${piece_name[rev]}\n${
            display_hash(hash)
        }\n${-score}`;
    }

    node_li.appendChild(node_div);
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
        while (true) {
            try {
                const { init_hash, data } = await load_data(
                    `./data/${prompt("queue", "TIJLOSZ")}.js`,
                );
                add(root, -1, init_hash, data);
                break;
            } catch (error) {
            }
        }
    }
}

window.addEventListener("load", main);
