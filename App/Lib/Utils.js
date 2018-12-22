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

export function runGenerator001() {
    console.log('============runGenerator001========================');
}
