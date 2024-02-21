
class StringTools {
    static getUrlParam (name) {
        const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); // 构造一个含有目标参数的正则表达式对象
        const r = window.location.search.substr(1).match(reg); // 匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; // 返回参数值
    }

    static getRandomCode (length = 8) {
        const data = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        let nums = '';
        for (let i = 0; i < length; i++) {
            const r = parseInt(Math.random() * 61);
            nums += data[r];
        }
        return nums;
    }
}

export default StringTools;
