// taken from https://github.com/mkjlong/bestsaves
const PIECES = "TIJLOSZ";

function extractBracketedBlock(input, start) {
    let depth = 0;
    let i = start;
    let block = "";

    for (; i < input.length; i++) {
        const char = input[i];
        block += char;
        if (char === "[") {
            depth++;
        } else if (char === "]") {
            depth--;
        }

        if (depth === 0) {
            return [block.slice(1, -1), i + 1];
        }
    }
    throw new Error("Unmatched brackets");
}

function normalizedSort(input) {
    const counts = { T: 0, I: 0, J: 0, L: 0, O: 0, S: 0, Z: 0 };
    for (const char of input) {
        if (char in counts) {
            counts[char]++;
        }
    }
    return Object.entries(counts)
        .sort(([pieceA, countA], [pieceB, countB]) =>
            (countB - countA) || PIECES.indexOf(pieceA) - PIECES.indexOf(pieceB)
        )
        .flatMap(([piece, count]) => Array(count).fill(piece))
        .join("");
}

function normalizeInput(input) {
    // Precompile regex patterns for better performance
    const invalidSyntaxRegex = /[^TIJLOSZ\[\]\^\!\*\dpc]/g;
    const inversionRegex = /\[\^([A-Z]+)\]/g;
    const wildcardRegex = /\*/g;
    const bagWithExclamationRegex = /\[([A-Z]+)\]!/g;
    const bagWithNumberRegex = /\[([A-Z]+)\](\d)/g;
    const bareBagRegex = /\[([A-Z]+)\](?![pc]\d)/g;

    // 1. Remove invalid syntax
    let cleaned = input.replace(invalidSyntaxRegex, "");

    // 2. Inversion: [^TIJ] → [LOSZ]
    cleaned = cleaned.replace(
        inversionRegex,
        (_, negated) =>
            `[${
                PIECES.split("").filter((c) => !negated.includes(c)).join("")
            }]`,
    );

    // 3. Replace * with [TIJLOSZ]
    cleaned = cleaned.replace(wildcardRegex, `[${PIECES}]`);

    // 4. Replace [XYZ]! → [XYZ]pN
    cleaned = cleaned.replace(
        bagWithExclamationRegex,
        (_, bag) => `[${bag}]p${bag.length}`,
    );

    // 5. Replace [XYZ]N → [XYZ]pN
    cleaned = cleaned.replace(
        bagWithNumberRegex,
        (_, bag, n) => `[${bag}]p${n}`,
    );

    // 6. Replace bare [XYZ] → [XYZ]p1
    cleaned = cleaned.replace(bareBagRegex, (_, bag) => `[${bag}]p1`);

    return cleaned;
}

function getPermutations(str, length) {
    if (typeof str !== "string") {
        const result = new Set();
        for (const s of str) {
            for (const perm of getPermutations(s, length)) {
                result.add(perm);
            }
        }
        return result;
    }

    const results = new Set();
    const chars = normalizedSort(str);

    function backtrack(path, used) {
        if (path.length === length) {
            results.add(path.join(""));
            return;
        }

        for (let i = 0; i < chars.length; i++) {
            if (used[i]) continue;
            // Skip duplicates
            if (i > 0 && chars[i] === chars[i - 1] && !used[i - 1]) continue;

            used[i] = true;
            path.push(chars[i]);
            backtrack(path, used);
            path.pop();
            used[i] = false;
        }
    }

    backtrack([], Array(chars.length).fill(false));
    return results;
}

function getCombinations(str, length) {
    if (typeof str !== "string") {
        const result = new Set();
        for (const s of str) {
            for (const comb of getCombinations(s, length)) {
                result.add(comb);
            }
        }
        return result;
    }

    const results = new Set();
    const chars = normalizedSort(str); // Pre-sorted input

    const stack = [{ start: 0, path: [] }];

    while (stack.length > 0) {
        const { start, path } = stack.pop();

        if (path.length === length) {
            results.add(normalizedSort(path.join(""))); // Ensure normalizedSort order
            continue;
        }

        for (let i = start; i < chars.length; i++) {
            // Skip duplicates
            if (i > start && chars[i] === chars[i - 1]) continue;

            stack.push({ start: i + 1, path: [...path, chars[i]] });
        }
    }

    return results;
}

function pieces(input) {
    input = normalizeInput(input);
    const parts = [];

    if (input.split("").every((c) => PIECES.includes(c))) {
        return new Set([input]);
    }

    let i = 0;
    while (i < input.length) {
        const char = input[i];
        if (char === "[") {
            const [bagContent, nextIndex] = extractBracketedBlock(input, i);
            i = nextIndex;

            const mode = input[i];
            i++;

            let numStr = "";
            while (/\d/.test(input[i])) {
                numStr += input[i++];
            }
            const num = Number(numStr);

            const expandedBag = pieces(bagContent);
            if (mode === "p") {
                parts.push(getPermutations(expandedBag, num));
            } else if (mode === "c") {
                parts.push(getCombinations(expandedBag, num));
            }
        } else if (PIECES.includes(char)) {
            parts.push(new Set([char]));
            i++;
        } else {
            i++;
        }
    }

    return cartesianProduct(parts);
}

function cartesianProduct(arrays) {
    return arrays.reduce((acc, curr) => {
        const result = new Set();
        for (const a of acc) {
            for (const b of curr) {
                result.add(a + b);
            }
        }
        return result;
    }, new Set([""]));
}
