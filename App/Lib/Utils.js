
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
export function getTxDirection({address, from, to}) {
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

export const isValidAddress = (address) => /^0x[0-9a-fA-F]{40}$/.test(address);

export const isArray = (data) => Object.prototype.toString.call(data) === '[object Array]';

