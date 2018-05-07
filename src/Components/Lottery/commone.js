//组合数计算
const Combination = (n, m) => {
	let i;
	m = parseInt(m);
	n = parseInt(n);
	if( m<0 || n<0 )
	{
		return false;
	}
	if( m==0 || n == 0 )
	{
		return 1;
	}
	if( m > n )
	{
		return 0;
	}
	if( m > n/2.0)
	{
		m = n - m;
	}
	var result = 0.0;
	for(i=n; i>=(n-m+1);i--) {
		result += Math.log(i);
	}
	for(i=m; i >= 1; i--) {
		result -= Math.log(i);
	}
	result = Math.exp(result);
	return Math.round(result);
};
const getLotteryId = (a)=>{
	let tempId;
	switch(a){
		case 'ssc': tempId = 1;break;
		case 'mmc': tempId = 23;break;
		case '24xsc': tempId = 14;break;
		case 'ffc': tempId = 19;break;
		case 'XJSSC': tempId = 6;break;
		case 'TJSSC': tempId = 13;break;
		case 'pk10': tempId = 26;break;
		case 'SD11Y': tempId = 5;break;
		case 'GD11-5': tempId = 8;break;
		case 'JX11-5': tempId = 7;break;
		case 'TG11-5': tempId = 21;break;
		case 'SH11-5': tempId = 30;break;
		case 'fucaip3': tempId = 11;break;
		case 'ticaip3': tempId = 12;break;
		case 'txffc': tempId = 29;break;
		default:tempId = 1;break;
	}
	return tempId
};
const fftime = (n) => {
    return Number(n)<10 ? ""+0+Number(n) : Number(n);
};
const format = (dateStr) => {//格式化时间
    return new Date(dateStr.replace(/[\-\u4e00-\u9fa5]/g, "/"));
};
const diff = (t) => {//根据时间差返回相隔时间
    return t>0 ? {
		day : fftime(Math.floor(t/86400)),
		hour : fftime(Math.floor(t%86400/3600)),
		minute : fftime(Math.floor(t%3600/60)),
		second : fftime(Math.floor(t%60))
	} : {day:'00',hour:'00',minute:'00',second:'00'};
};
Array.prototype.each = function(fn){
    fn = fn || Function.K;
    var a = [];
    var args = Array.prototype.slice.call(arguments, 1);
    for(var i = 0; i < this.length; i++){
        var res = fn.apply(this,[this[i],i].concat(args));
        if(res != null) a.push(res);
    }
    return a;
};

/**
 * 得到一个数组不重复的元素集合<br/>
 * 唯一化一个数组
 * @returns {Array} 由不重复元素构成的数组
 */
Array.prototype.uniquelize = function(){
    var ra = new Array();
    for(var i = 0; i < this.length; i ++){
        if(!ra.contains(this[i])){
            ra.push(this[i]);
        }
    }
    return ra;
};

/**
 * 求两个集合的补集
{%example
<script>
    var a = [1,2,3,4];
    var b = [3,4,5,6];
    alert(Array.complement(a,b));
</script>
 %}
 * @param {Array} a 集合A
 * @param {Array} b 集合B
 * @returns {Array} 两个集合的补集
 */
Array.complement = (a, b) => {
    return Array.minus(Array.union(a, b),Array.intersect(a, b));
};

/**
 * 求两个集合的交集
{%example
<script>
    var a = [1,2,3,4];
    var b = [3,4,5,6];
    alert(Array.intersect(a,b));
</script>
 %}
 * @param {Array} a 集合A
 * @param {Array} b 集合B
 * @returns {Array} 两个集合的交集
 */
Array.intersect = (a, b) => {
    return a.uniquelize().each(function(o){return b.contains(o) ? o : null});
};

/**
 * 求两个集合的差集
{%example
<script>
    var a = [1,2,3,4];
    var b = [3,4,5,6];
    alert(Array.minus(a,b));
</script>
 %}
 * @param {Array} a 集合A
 * @param {Array} b 集合B
 * @returns {Array} 两个集合的差集
 */
Array.minus = (a, b) => {
    return a.uniquelize().each(function(o){return b.contains(o) ? null : o});
};

/**
 * 求两个集合的并集
{%example
<script>
    var a = [1,2,3,4];
    var b = [3,4,5,6];
    alert(Array.union(a,b));
</script>
 %}
 * @param {Array} a 集合A
 * @param {Array} b 集合B
 * @returns {Array} 两个集合的并集
 */
Array.union = (a, b) => {
    return a.concat(b).uniquelize();
};

Array.prototype.contains =  function(element) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == element) {
			return true;
		}
	}
	return false;
};
/**
* 计算排列组合的个数
*
* @author mark
*
* @param integer $iBaseNumber   基数
* @param integer $iSelectNumber 选择数
*
* @return mixed
*
*/
const GetCombinCount = ( iBaseNumber, iSelectNumber ) => {
    if(iSelectNumber > iBaseNumber){
        return 0;
    }
    if( iBaseNumber == iSelectNumber || iSelectNumber == 0 ){
        return 1;//全选
    }
    if( iSelectNumber == 1 ){
        return iBaseNumber;//选一个数
    }
    var iNumerator = 1;//分子
    var iDenominator = 1;//分母
    for(var i = 0; i < iSelectNumber; i++){
        iNumerator *= iBaseNumber - i;//n*(n-1)...(n-m+1)
        iDenominator *= iSelectNumber - i;//(n-m)....*2*1
    }
    return iNumerator / iDenominator;
}


//移动字符串
const movestring = (sString) => {
    var top = '';//开始符串
    var middle = '01'//中间字符串
    var bottom = '';//结束符串
    var tmpone = '';
    var tmptwo = '';
    var find = false;//是否找到分隔字符串
    var findfirst = false;//找到第一个字符
    for (var m=0;m<sString.length;m++){
        if(find == false){
           top += sString.substr(m,1);
        }
        if( find == false && sString.substr(m,1) == '1'){
            findfirst = true;
        }else if(find == false && findfirst == true && sString.substr(m,1) == '0'){
            find = true;
        }else if(find == true){
           bottom += sString.substr(m,1);
        }
    }
    top = top.substr(0,top.length-2);
    for (var n=0;n<top.length;n++){
        if(top.substr(n,1) == '1'){
            tmpone += top.substr(n,1);
        }else if(top.substr(n,1) == '0'){
            tmptwo += top.substr(n,1);
        }
    }
    top = tmpone+tmptwo;
    return top+middle+bottom;
}


/**
* 获取指定组合的所有可能性
*
* 例子：5选3
* $aBaseArray = array('01','02','03','04','05');
* ----getCombination($aBaseArray,3)
* 1.初始化一个字符串：11100;--------1的个数表示需要选出的组合
* 2.将1依次向后移动造成不同的01字符串，构成不同的组合，1全部移动到最后面，移动完成：00111.
* 3.移动方法：每次遇到第一个10字符串时，将其变成01,在此子字符串前面的字符串进行倒序排列,后面的不变：形成一个不同的组合.
*            如：11100->11010->10110->01110->11001->10101->01101->10011->01011->00111
*            一共形成十个不同的组合:每一个01字符串对应一个组合---如11100对应组合01 02 03;01101对应组合02 03 05
*
*
* @param  array aBaseArray 基数数组
* @param  int   iSelectNum 选数
* @author mark
*
*/
const getCombination = ( aBaseArray, iSelectNum ) => {
    var iBaseNum = aBaseArray.length;
    var aResult = new Array();
    var aString = new Array();
    if(iSelectNum > iBaseNum){
        return aResult;
    }
    if( iSelectNum == 1 ){
        return aBaseArray;
    }
    if( iBaseNum == iSelectNum ){
        aResult[0] = aBaseArray.join(",");
        return aResult;
    }
    var sString = '';
    var sLastString = '';
    var sTempStr = '';
    for (var i=0; i<iSelectNum; i++){
        sString +='1';
        sLastString +='1';
    }
    for (var j=0; j<iBaseNum-iSelectNum; j++){
        sString +='0';
    }
    for (var k=0; k<iSelectNum; k++){
        sTempStr += aBaseArray[k]+',';
    }
    aResult[0] = sTempStr.substr(0,sTempStr.length-1);
    var count = 1;
    sTempStr = '';
    while (sString.substr(sString.length-iSelectNum,iSelectNum) != sLastString){
        sString = movestring(sString);
        for (var k=0; k<iBaseNum; k++){
            if( sString.substr(k,1) == '1' ){
                sTempStr += aBaseArray[k]+',';
            }
        }
        aResult[count] = sTempStr.substr(0, sTempStr.length-1);
        sTempStr = '';
        count++;
    }
    return aResult;
}

//转换HTML标签为标准代码(类似PHP的htmlspecialchars函数)
const replaceHTML = ( str ) => {
	str = str.replace(/[&]/g,'&amp;');
	str = str.replace(/[\"]/g,'&quot;');
	str = str.replace(/[\']/g,'&#039;');
	str = str.replace(/[<]/g,'&lt;');
	str = str.replace(/[>]/g,'&gt;');
	str = str.replace(/[ ]/g,'&nbsp;');
	return str;
}

//转换HTML标准代码为显示代码（类似PHP的htmlspecialchars_decode函数）
const replaceHTML_DECODE = ( str ) => {
	str = str.replace(/&amp;/g,'&');
	str = str.replace(/&quot;/g,'"');
	str = str.replace(/&#039;/g,'\'');
	str = str.replace(/&lt;/g,'<');
	str = str.replace(/&gt;/g,'>');
	str = str.replace(/&nbsp;/g,' ');
	return str;
};

export default {
    Combination,
    getCombination,
    fftime,
    format,
    diff,
    replaceHTML_DECODE
}
