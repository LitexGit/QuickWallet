
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

export function isValidUrl(str_url){
    const strRegex = '^((https|http|ftp|rtsp|mms)?://)'
      + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@
      + '(([0-9]{1,3}\.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
      + '|' // 允许IP和DOMAIN（域名）
      + '([0-9a-z_!~*\'()-]+\.)*' // 域名- www.
      + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.' // 二级域名
      + '[a-z]{2,6})' // first level domain- .com or .museum
      + '(:[0-9]{1,4})?' // 端口- :80
      + '((/?)|' // 如果没有文件名，则不需要斜杠
      + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
    const re=new RegExp(strRegex);
    if (re.test(str_url)){
        return (true);
    }
    return (false);
}
