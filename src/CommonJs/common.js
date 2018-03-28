/**
 * 获取当前日期的前后n天日期
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
 * 获取时间data（2018-02）下月年月
 */
export const getNextMonth = (date) =>{
    let arr = date.split('-');
    let year = arr[0]; //获取当前日期的年份
    let month = arr[1]; //获取当前日期的月份
    let days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中的月的天数
    let year2 = year;
    let month2 = parseInt(month) + 1;
    if (month2 == 13) {
        year2 = parseInt(year2) + 1;
        month2 = 1;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }
    return year2 + '-' + month2;
};
/**
 * 获取毫秒数
 */
export const setNewDateTime = (n) => {
    let d, t, t2;
    t = new Date().getTime();
    t2 = n * 1000 * 3600 * 24;
    t += t2;
    d = new Date(t).getTime();
    return d;
};

/**
 * 倒计时
 */
export const genCountdown = (sec) => {
    let h = parseInt(sec / 3600);
    let m = parseInt((sec - h * 3600) / 60);
    let s = sec - h * 3600 - m * 60;
    if (h < 10) {
        h = '0' + h;
    };
    if (m < 10) {
        m = '0' + m;
    };
    if (s < 10) {
        s = '0' + s;
    };
    return h + ':' + m + ':' + s;
};

/**
 * timestamp: 时间戳
 */
export const timestampToTime = (timestamp) => {
    let date = new Date(timestamp * 1000),//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-',
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
    D = (date.getDate() < 10 ? '0'+ date.getDate() : date.getDate()) + ' ',
    h = (date.getHours() < 10 ? '0'+ date.getHours() : date.getHours()) + ':',
    m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':',
    s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
    return Y+M+D+h+m+s;
};

/**
 * current: 时间选择器穿过来的参数
 * min: 最小
 * max: 最大
 */
export const disabledDate = (current, min, max) => {
    return !(current && current.valueOf() < setNewDateTime(max) && current.valueOf() > setNewDateTime(min));
};
export const datedifference = (sDate1, sDate2) => {    //sDate1和sDate2是2006-12-18格式
    let dateSpan,
        iDays;
    sDate1 = Date.parse(sDate1);
    sDate2 = Date.parse(sDate2);
    dateSpan = sDate2 - sDate1;
    dateSpan = Math.abs(dateSpan);
    iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
    return iDays
};

/***参数都是以周一为基准的***/
/**
 * n = 7:上周的开始时间
 * n = 1:上周的结束时间
 * n = 0:本周的开始时间
 * n = -6:本周的结束时间
 */
export const getTime = (n) => {
    let now=new Date();
    let year=now.getFullYear();
    //因为月份是从0开始的,所以获取这个月的月份数要加1才行
    let month=now.getMonth()+1;
    let date=now.getDate();
    let day=now.getDay();
    //判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
    if(day!==0){
        n=n+(day-1);
    }
    else{
        n=n+day;
    }
    if(day){
        //这个判断是为了解决跨年的问题
        if(month>1){
            month=month;
        }
        //这个判断是为了解决跨年的问题,月份是从0开始的
        else{
            year=year-1;
            month=12;
        }
    }
    now.setDate(now.getDate()-n);
    year=now.getFullYear();
    month=now.getMonth()+1;
    date=now.getDate();
    return year+"-"+(month<10?('0'+month):month)+"-"+(date<10?('0'+date):date);
};
/**
 * 获得本月的结束日期
 */
export const getMonthEndDate = () => {
    let now = new Date(); //当前日期
    let nowMonth = now.getMonth(); //当前月
    let nowYear = now.getFullYear(); //当前年
    let monthStartDate = new Date(nowYear, nowMonth, 1);
    let monthEndDate = new Date(nowYear, nowMonth + 1, 1);
    let days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24);
    let date = new Date(nowYear, nowMonth, days);
    return formatDate(date);
};
/**
 * 格式化日期：yyyy-MM-dd
 */
export const formatDate = (date) => {
    let myyear = date.getFullYear();
    let mymonth = date.getMonth()+1;
    let myweekday = date.getDate();

    if(mymonth < 10){
        mymonth = "0" + mymonth;
    }
    if(myweekday < 10){
        myweekday = "0" + myweekday;
    }
    return (myyear+"-"+mymonth + "-" + myweekday);
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
    if( money == "" || money == undefined || money == null){
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
            let n = DecimalNum.substr(i,1);
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
 * 读取cookie
 * */
export const getCookie = name => {
	let arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg)){
		return unescape(arr[2]);
	}else{
		return null;
	}
}
/**
 * 删除cookie
 * */
export const  delCookie = name =>{
	let exp = new Date();
	exp.setTime(exp.getTime() - 1);
	let cval=getCookie(name);
	if(cval!=null)
	document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}
/**
* 获取localStorage
*/
export const getStore = name => {
    if(window.localStorage.getItem(name) == null){
        return
    }
    return JSON.parse(window.localStorage.getItem(name));
};

/**
* 存储localStorage
*/
export const setStore = (name, content) => {

	if(content == undefined){
		content = '';
	}
    let tempContent = JSON.stringify(content);
    window.localStorage.setItem(name, tempContent)
};

/**
 * 删除localStorage
 */
export const removeStore = name => {
    if (!name) return;
    window.localStorage.removeItem(name)
};

/**
 * 输入框格式验证显示不同样式
 */
export const onValidate = (val, validate) => {
    let classNames;
    if(validate[val] == 0) {
        classNames = 'correct' //正确
    } else if(validate[val] == 1) {
        classNames = 'wrong' // 错误
    } else {
        classNames = ''
    }
    return classNames
};

/**
 * 生成二维码
 */
export const _code = (id, url, w, h) => {
    let qrcode = document.getElementById(id);
    if(!qrcode){
        return
    }
    let childs = qrcode.childNodes;
    if(childs.length === 0){
        $('#'+ id).qrcode({
            render : "canvas",
            text : url,
            width : w,
            height : h,
            background : "#ffffff",
            foreground : "#000000",
            src: require('../Images/icon.png')
        });
    }
};

export default {
    setDateTime,
    setNewDateTime,
    getNextMonth,
    getTime,
    genCountdown,
    disabledDate,
    getMonthEndDate,
    changeMoneyToChinese,
    getStore,
    removeStore,
    setStore,
    onValidate,
    getCookie,
    delCookie,
    timestampToTime,
    _code,
    datedifference
}

