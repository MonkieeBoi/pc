function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function boardToHash(board){
    return [...board.cells].reverse().flat().reduce((h, t) => h*2 + (t ? 1:0), 0);
}

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