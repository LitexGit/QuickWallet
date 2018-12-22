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
    const address = '0xb5538753F2641A83409D2786790b42aC857C5340';
    if (address === to && address !== from) {
        return 1;
    }
    return 0;
}
