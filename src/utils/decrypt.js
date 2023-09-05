const KEY = 'yL/M=zNa0bcPQdReSfTgUhViWjXkYIZmnpo+qArOBslCt2D3uE4Fv5G6wH178xJ9K';

function jx(keys, code) {
    // common.js?v=210817:858
    const k = Array(4);
    let o = [];

    for (let c = 0; c < keys.length;) {
        for (let i = 0; i < k.length; i++)
            k[i] =
                KEY.indexOf(
                    keys.charAt(c++)
                );

        o.push((k[0] << 2) | (k[1] >> 4));
        if (k[2] != 64) o.push(((15 & k[1]) << 4) | (k[2] >> 2));
        if (k[3] != 64) o.push(((3 & k[2]) << 6) | k[3]);
    }

    keys = o.map((v) => String.fromCharCode(v)).join('');

    // common.js?v=210817:862
    const fi = parseInt(keys.charAt());
    keys = fi + (fi > 5 ? -5 : 4) + keys.slice(1);

    // common.js?v=210817:859
    o = [code.slice(0, -10)];

    keys.split(',').map((v, idx) => {
        const key = parseFloat(v);
        o.push(String.fromCharCode((2 * (key - idx - 1)) / (13 - idx - 1)));
    });

    return o.join('');
}

module.exports = {
    jx
}