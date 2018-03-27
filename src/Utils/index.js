import request from './Request'
import http from './http'

/* 登录前获取sess */
const getSess = (body) => request(http.interFace('SESS'),body);
/* 登录,找回密码 */
const login = (body) =>  request(http.interFace('LOGIN'),body);
/* 客服，域名测速 */
const kefu = (body) =>  request(http.interFace('KEFU'),body);
/* 退出登录*/
const logout = (body) =>  request(http.interFace('LOGINOUT'),body);

/*获取投注玩法接口*/
const lotteryBets = (body) =>  request(http.interFace('LOTTERYBET'),body);

const aboutMmc = (body) => request(http.interFace('MMCLOTERYBET'),body);

const aboutBet = (body) => request(http.interFace('ABOUTBET'),body);

const gameInfo = (body) => request(http.interFace('GAMEINFO'),body);

const ksHistoery = (body) => request(http.interFace('KJHISTOERY'),body);

// 上次登录地点ip=>地址
const ipaddress = (body) => request(http.interFace('IPADDRESS'),body);
//重置密码
const resetPwd = (body) =>  request(http.interFace('RESETPWD'),body);
/* 日工资*/
const dailysalary = (body) =>  request(http.interFace('DAILYSALARY'),body);
/* 历史日工资*/
const salarypersonalsalary = (body) =>  request(http.interFace('SALARYPERSONAMSALARY'),body);
/* 日工资修改协议*/
const dailysalaryupdate = (body) =>  request(http.interFace('DAILYSALARYUPDATE'),body);
/* 日工资自身协议*/
const dailysalaryself = (body) =>  request(http.interFace('DAILYSALARYSELF'),body);
/* 本平台余额*/
const menu = (body) =>  request(http.interFace('MENU'),body);
/* 各平台余额*/
const balance = (body) =>  request(http.interFace('BALANCE'),body);
/* 平台公告*/
const noticeList = (body) =>  request(http.interFace('NOTICELIST'),body);
/* 查看公告是否被阅读*/
const helpNotice = (body) =>  request(http.interFace('HELPNOTICE'),body);
/* 团队列表*/
const usreList = (body) =>  request(http.interFace('USERLIST'),body);
/* 游戏记录-彩票投注*/
const newGameList = (body) =>  request(http.interFace('NEWGAMELIST'),body);
/* 撤单*/
const cancelgameAjax = (body) =>  request(http.interFace('CANCELGAMEAJAX'),body);
/* 注册下级*/
const adduser = (body) =>  request(http.interFace('ADDUSER'),body);
/* 追号记录*/
const traceInfo = (body) =>  request(http.interFace('TRACEINFO'),body);
/* 体育投注*/
const sportsRecordSearch = (body) =>  request(http.interFace('SPORTSRECORDSEARCH'),body);
/* 追号详情*/
const newtaskdetail = (body) =>  request(http.interFace('NEWTASKDETAIL'),body);
/* 终止追号*/
const cancelTaskAjax = (body) =>  request(http.interFace('CANCELTASKAJAX'),body);
/* 真人投注*/
const EagameRecordSearch = (body) =>  request(http.interFace('WAGAMERECORDSEARCH'),body);
/* 博饼投注*/
const bbbetting = (body) =>  request(http.interFace('BBBETTING'),body);
/* 博饼投注*/
const doubledetails = (body) =>  request(http.interFace('DOUBLEDETAILS'),body);
/* pt投注*/
const ptbets = (body) =>  request(http.interFace('PTBETS'),body);
/* 修改用户信息*/
const changename = (body) =>  request(http.interFace('CHANGENAME'),body);
/* 团队统计*/
const UpUserTeam = (body) =>  request(http.interFace('UPUSERTEAM'),body);
/* 修改或删除生成的推广链接地址*/
const main = (body) =>  request(http.interFace('MAIN'),body);
/* 分红列表*/
const dividendsalary = (body) =>  request(http.interFace('DIVIDENDSALAY'),body);
/* 历史分红*/
const personalsalary = (body) =>  request(http.interFace('PERSONALSALARY'),body);
/* 发放分红*/
const sendDividendSalary = (body) =>  request(http.interFace('SENDDIVIDENDSALARY'),body);
/* 修改分红比例*/
const diviratio = (body) =>  request(http.interFace('DIVIRATIO'),body);
/* 日亏损佣金列表*/
const losesalary = (body) =>  request(http.interFace('LOSESALARY'),body);
/* 日亏损佣金详情*/
const detail = (body) =>  request(http.interFace('DETAIL'),body);
/* 提交或修改密保问题*/
const bindsequestion = (body) =>  request(http.interFace('BINDSEQUESTION'),body);
/* 设置资金密码*/
const setsecurity = (body) =>  request(http.interFace('SETSECURITY'),body);
/*忘记资金密码 问题回答验证*/
const checkquestion = (body) =>  request(http.interFace('CHECKQUESTION'),body);
/* pt游戏列表*/
const ptindex = (body) =>  request(http.interFace('PTINDEX'),body);
/* pt-进入游戏*/
const ptplay = (body) =>  request(http.interFace('PTPLAY'),body);
/* pt-登陆游戏跳转第三方*/
const ptlogin_new = (body) =>  request(http.interFace('PTLOGINNEW'),body);
/* pt-重置密码获取用户名*/
const showsetpwd = (body) =>  request(http.interFace('SHOWSETPWD'),body);
/* pt-确认重置密码*/
const setpwdcommit = (body) =>  request(http.interFace('SETPWDCOMMIT'),body);
/* pt-转账*/
const pttranfer = (body) =>  request(http.interFace('TRANFER'),body);
/* EA-娱乐城*/
const eagame = (body) =>  request(http.interFace('EAGAME'),body);
/* 博饼游戏-转账*/
const bobingtransfer = (body) =>  request(http.interFace('BOBINGTRANSFER'),body);
/* 奖金池*/
const newGetprizepool = (body) =>  request(http.interFace('NEWGETPRIZEPOOL'),body);
/* 博饼游戏-登录*/
const bobinglogin = (body) =>  request(http.interFace('BOBINLOGIN'),body);
/* 获得绑定银行卡列表*/
const userbankinfo = (body) =>  request(http.interFace('USERBANKINFO'),body);
/* 获得省份列表和银行卡列表*/
const adduserbank = (body) =>  request(http.interFace('ADDUSERBANK'),body);
/* 站内信*/
const messages = (body) =>  request(http.interFace('MESSAGES'),body);
/*走势图*/
const trend = (body) =>  request(http.interFace('TREND'),body);
/*自身协议*/
const selfproto= (body) =>  request(http.interFace('SELFPROTO'),body);
/*用户列表*/
const childrenList= (body) =>  request(http.interFace('CHILDRENUSERLIST'),body);
//契约列表
const contractList= (body) =>  request(http.interFace('CONTRACTLIST'),body);
//配额契约
const quota= (body) =>  request(http.interFace('QUOTA'),body);
/*奖金组契约*/
const awardTeam= (body) =>  request(http.interFace('AWARDTEAM'),body);
/*配额管理*/
const applyPrizeQuota= (body) =>  request(http.interFace('APPLYPRIZEQUOTA'),body);
/*如何存款*/
const howDeposit= (body) =>  request(http.interFace('HOWDEPOSIT'),body);
/*常见问题*/
const commonProblems= (body) =>  request(http.interFace('COMMONPROBLEMS'),body);
/*玩法介绍*/
const playMethod= (body) =>  request(http.interFace('PLAYMETHOD'),body);
/*体育竞技*/
const sport= (body) =>  request(http.interFace('SPORT'),body);
/*提款*/
const withdrawel= (body) =>  request(http.interFace('WITHDRAWEL'),body);
/*充提记录*/
const getrwrecord= (body) =>  request(http.interFace('GETRWRECORD'),body);
/*转账记录*/
const fundreport= (body) =>  request(http.interFace('FUNDREPORT'),body);
/*充提*/
const payment= (body) =>  request(http.interFace('PAYMENT'),body);
/*游戏账变*/
const lotteryAccountChanged= (body) =>  request(http.interFace('LOTTERYACCOUNTCHANGED'),body);
/*彩票明细*/
const historyteamlottery= (body) =>  request(http.interFace('HISTORYTEAMLOTTERY'),body);
/*个人总表*/
const profitLossLotteryBySelf= (body) =>  request(http.interFace('PROFITLOSSLOTTERYBYSELF'),body);
/*个人总表-EA娱乐城*/
const historyea= (body) =>  request(http.interFace('HISTORYEA'),body);
/*个人总表-PT*/
const ptdaily= (body) =>  request(http.interFace('PTDAILY'),body);
/*个人总表-体育*/
const historysports= (body) =>  request(http.interFace('HISTORYSPORTS'),body);
/*个人总表-体育*/
const bbdailybyself= (body) =>  request(http.interFace('BBDAIYSELF'),body);
/*盈亏总表*/
const teammain= (body) =>  request(http.interFace('TEAMMAIN'),body);
/*GT娱乐-登录*/
const gtLogin= (body) =>  request(http.interFace('GTLOGIN'),body);
/*GT娱乐-转账*/
const gtTransfer= (body) =>  request(http.interFace('GTTRANSFER'),body);
//投诉建议
const complainAndSuggests= (body) =>  request(http.interFace('COMPLAINANDSUGGESTS'),body);
//返回旧版
const switchold= (body) =>  request(http.interFace('SWITCHOLD'),body);
//得到版本号
const getVersion = (body) =>  request(http.interFace('GETVERSION'),body);
//活动列表
const acitveLists = (body) =>  request(http.interFace('ACTIVELISTS'),body);
//活动详情
const activityData = (body, get) =>  request(http.interFace('ACTIVITYDATA')+get,body);
//个人进度
const userSignDatas = (body, get) =>  request(http.interFace('USERSIGNDATAS')+get,body);
//活动报名
const postEnrolls = (body) =>  request(http.interFace('POSTENROLLS'),body);
//活动签到领奖
const signTheAward = (body) =>  request(http.interFace('SIGNTHEAWARD'),body);
//充值达标领奖
const rechargeAmountAward = (body) =>  request(http.interFace('RECHARGEAMOUNTAWARD'),body);
//流水达标领奖
const wateAmountAward = (body) =>  request(http.interFace('WATEAMOUNAWARD'),body);
//拉新领奖
const pullNewAward = (body) =>  request(http.interFace('PULLNEWAWARD'),body);
//新人注册领奖
const registerAward = (body) =>  request(http.interFace('REGISTERAWARD'),body);
//微信绑定
const wechatbind = (body) =>  request(http.interFace('WECHATBIND'),body);
//EA填写个人资料
const addUserInfo = (body) =>  request(http.interFace('ADDUSERINFO'),body);
//判断是否输入过资金密码和密码验证
const checkpass = (body) =>  request(http.interFace('CHECKPASS'),body);
//上下级转账
const transfer = (body) =>  request(http.interFace('TRANSFER'),body);

export default {
    getSess,
    login,
    kefu,
    logout,
    lotteryBets,
    aboutBet,
    gameInfo,
    ipaddress,
    dailysalary,
    salarypersonalsalary,
    resetPwd,
    menu,
    balance,
    noticeList,
    helpNotice,
    usreList,
    newGameList,
    cancelgameAjax,
    adduser,
    traceInfo,
    sportsRecordSearch,
    newtaskdetail,
    EagameRecordSearch,
    bbbetting,
    doubledetails,
    ptbets,
    changename,
    UpUserTeam,
    main,
    dividendsalary,
    personalsalary,
    sendDividendSalary,
    diviratio,
    losesalary,
    detail,
    bindsequestion,
    setsecurity,
    checkquestion,
    ptindex,
    ptplay,
    setpwdcommit,
    ptlogin_new,
    showsetpwd,
    pttranfer,
    eagame,
    bobingtransfer,
    newGetprizepool,
    // bobinglogin,
    cancelTaskAjax,
    userbankinfo,
    adduserbank,
    ksHistoery,
    aboutMmc,
    messages,
    trend,
    selfproto,
    childrenList,
    quota,
    awardTeam,
    applyPrizeQuota,
    howDeposit,
    commonProblems,
    playMethod,
    sport,
    withdrawel,
    getrwrecord,
    fundreport,
    payment,
    lotteryAccountChanged,
    historyteamlottery,
    profitLossLotteryBySelf,
    historyea,
    ptdaily,
    historysports,
    bbdailybyself,
    teammain,
    gtLogin,
    gtTransfer,
    dailysalaryupdate,
    dailysalaryself,
    complainAndSuggests,
    contractList,
    switchold,
    getVersion,
    acitveLists,
    activityData,
    userSignDatas,
    postEnrolls,
    signTheAward,
    rechargeAmountAward,
    wateAmountAward,
    pullNewAward,
    registerAward,
    wechatbind,
    addUserInfo,
    checkpass,
    transfer
}
