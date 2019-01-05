export function runGenerator(generatorFUN, initialValue) {
    const generator = generatorFUN(initialValue);
    iterate(generator);
    function iterate(generator) {
        step();
        function step(arg, isError) {
            const {value: express, done} = isError ? generator.throw(arg) : generator.next(arg);
            let response;
            if (!done) {
                if (typeof express === 'function') {
                    response = express();
                } else {
                    response = express;
                }
                Promise.resolve(response).then(step, err => step(err, true));
            }
        }
    }
}

/**
 * 判断    转入/支出
 * @param {*} from
 * @param {*} to
 *
 * return 1 转入
 * return 0 支出
 */
export function getTxDirection({from, to}) {
    // TODO 获取 address
    const address = '0xb5538753f2641a83409d2786790b42ac857c5340';
    if (address === to && address !== from) {
        return 1;
    }
    return 0;
}

export function getPasspraseStrength(passprase) {
    let modes = 0;
    if (passprase.length < 1) return modes;
    if (/\d/.test(passprase)) modes++;
    if (/[a-z]/.test(passprase)) modes++;
    if (/[A-Z]/.test(passprase)) modes++;
    if (/\W/.test(passprase)) modes++;
    switch (modes) {
    case 1:
        return 1;
    case 2:
        return 2;
    case 3:
    case 4:
        return passprase.length < 8 ? 3 : 4;
    }
}
