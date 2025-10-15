class Input {
    constructor(focus_element) {
        this.keymap = {
            "ShiftLeft": "hold",
            "KeyA": "ccw",
            "KeyS": "cw",
            "KeyD": "180",
            "ArrowLeft": "l",
            "ArrowRight": "r",
            "ArrowDown": "sd",
            "Space": "hd",
            "KeyR": "reset",
        };
        let keybinds =
            (JSON.parse(localStorage.getItem("settings")) || {})["keybinds"] ||
            {};
        for (let keybind in keybinds) {
            this.keymap[keybind] = keybinds[keybind];
        }
        this.rev_keymap = {};
        this.buffer = {};
        this.sustain = {
            "l": true,
            "r": true,
            "sd": true,
        };
        for (let key in this.keymap) {
            this.rev_keymap[this.keymap[key]] = key;
            this.buffer[this.keymap[key]] = false;
        }
        focus_element.addEventListener(
            "keydown",
            this.handle_key_down.bind(this),
        );
        focus_element.addEventListener("keyup", this.handle_key_up.bind(this));
    }

    rebind(action, key) {
        if (this.keymap[key] != undefined) {
            return false;
        }
        let settings = JSON.parse(localStorage.getItem("settings")) || {};
        settings["keybinds"] = settings["keybinds"] || {};

        delete settings["keybinds"][this.rev_keymap[action]];

        settings["keybinds"][key] = action;
        localStorage.setItem("settings", JSON.stringify(settings));

        delete this.keymap[this.rev_keymap[action]];
        this.keymap[key] = action;
        this.rev_keymap[action] = key;
        return true;
    }

    handle_key_down(event) {
        if (event.repeat) {
            return;
        }
        const action = this.keymap[event.code];
        if (action === undefined) {
            return;
        }
        if (action in this.buffer) {
            this.buffer[action] = true;
        }
        event.preventDefault();
    }

    handle_key_up(event) {
        const action = this.keymap[event.key];
        if (action === undefined) {
            return;
        }
        if (action in this.buffer) {
            this.buffer[action] = false;
        }
        event.preventDefault();
    }

    read() {
        let res = [];
        for (let key in this.buffer) {
            if (!this.buffer[key]) {
                continue;
            }
            res.push(key);
            if (!(key in this.sustain)) {
                this.buffer[key] = false;
            }
        }
        return res;
    }
}
