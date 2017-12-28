/**
 * 获取当前日期的前后val日期
 */
export const setDateTime = (n) => {
    let s, d, t, t2;
    t = new Date().getTime();
    t2 = n * 1000 * 3600 * 24;
    t += t2;
    d = new Date(t);
    s = d.getUTCFullYear() + '-';
    s += ('00' + (d.getUTCMonth() + 1)).slice(-2) + '-';
    s += ('00' + d.getUTCDate()).slice(-2);
    return s;
};

/**
 * 获取毫秒数
 */
export const setNewDateTime = (n) => {
    let s, d, t, t2;
    t = new Date().getTime();
    t2 = n * 1000 * 3600 * 24;
    t += t2;
    d = new Date(t).getTime();
    return d;
};

/**
 * current: 时间选择器穿过来的参数
 * n：天数,
 * lt: 小于
 * gt: 大于
 */
export const disabledDate = (current, type, n) => {
    if(type == 'lt'){
        return current && current.valueOf() < setNewDateTime(n);
    }else{
        return current && current.valueOf() > setNewDateTime(n);
    }
};

/**
 * 字金额转换为大写人民币汉字
 */
export const changeMoneyToChinese = (money) => {
    let cnNums = new Array("零","壹","贰","叁","肆","伍","陆","柒","捌","玖"); //汉字的数字
    let cnIntRadice = new Array("","拾","佰","仟"); //基本单位
    let cnIntUnits = new Array("","万","亿","兆"); //对应整数部分扩展单位
    let cnDecUnits = new Array("角","分","毫","厘"); //对应小数部分单位
    //var cnInteger = "整"; //整数金额时后面跟的字符
    let cnIntLast = "元"; //整型完以后的单位
    let maxNum = 999999999999999.9999; //最大处理的数字

    let IntegerNum; //金额整数部分
    let DecimalNum; //金额小数部分
    let ChineseStr=""; //输出的中文金额字符串
    let parts; //分离金额后用的数组，预定义
    if( money == "" ){
        return "";
    }
    money = parseFloat(money);
    if( money >= maxNum ){
        alert('超出最大处理数字');
        return "";
    }
    if( money == 0 ){
        ChineseStr = cnNums[0]+cnIntLast
        return ChineseStr;
    }
    money = money.toString(); //转换为字符串
    if( money.indexOf(".") == -1 ){
        IntegerNum = money;
        DecimalNum = '';
    }else{
        parts = money.split(".");
        IntegerNum = parts[0];
        DecimalNum = parts[1].substr(0,4);
    }
    if( parseInt(IntegerNum,10) > 0 ){//获取整型部分转换
        let zeroCount = 0;
        let IntLen = IntegerNum.length;
        for( let i=0;i<IntLen;i++ ){
            let n = IntegerNum.substr(i,1),
                p = IntLen - i - 1,
                q = p / 4,
                m = p % 4;
            if( n == "0" ){
                zeroCount++;
            }else{
                if( zeroCount > 0 ){
                    ChineseStr += cnNums[0];
                }
                zeroCount = 0; //归零
                ChineseStr += cnNums[parseInt(n)]+cnIntRadice[m];
            }
            if( m==0 && zeroCount<4 ){
                ChineseStr += cnIntUnits[q];
            }
        }
        ChineseStr += cnIntLast;
        //整型部分处理完毕
    }
    if( DecimalNum!= '' ){//小数部分
        let decLen = DecimalNum.length;
        for( let i=0; i<decLen; i++ ){
            n = DecimalNum.substr(i,1);
            if( n != '0' ){
                ChineseStr += cnNums[Number(n)]+cnDecUnits[i];
            }
        }
    }
    if( ChineseStr == '' ){
        //ChineseStr += cnNums[0]+cnIntLast+cnInteger;
        ChineseStr += cnNums[0]+cnIntLast;
    }/* else if( DecimalNum == '' ){
     ChineseStr += cnInteger;
     ChineseStr += cnInteger;
     } */
    return ChineseStr;
};

/**
* 获取localStorage
*/
export const getStore = name => {
    if (!name) return;
    let contentBody = window.localStorage.getItem(name);
    if (typeof contentBody != 'string') {
        contentBody = JSON.parse(window.localStorage.getItem(name))
    }
    return contentBody;
};

/**
* 存储localStorage
*/
export const setStore = (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content)
    }
    window.localStorage.setItem(name, content)
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
    if (!name) return;
    window.localStorage.removeItem(name)
};
export default {
    setDateTime,
    setNewDateTime,
    disabledDate,
    changeMoneyToChinese,
    getStore,
    removeStore,
    setStore,

}

