/*接口*/
import { stateVar } from '../State'
import {getStore } from "../CommonJs/common";

const interFace = (key) => {
    let INTERFACE = {};
    // 获取sess
    INTERFACE['SESS'] = 'sessValid=true';
    // 登录,找回密码

    INTERFACE['LOGIN'] = 'controller=default&action=login';

    //重置密码
    INTERFACE['KEFU'] = 'controller=default&action=index&KefuLink=true';

    //重置密码
    INTERFACE['RESETPWD'] = 'controller=user&action=ChangeLoginPass';

    //返回旧版
    INTERFACE['SWITCHOLD'] = 'controller=default&action=switch&_v=3.0';

    // 退出登录
    INTERFACE['LOGINOUT'] = 'controller=default&action=logout';

    // 投注中心
    INTERFACE['PLAY'] = 'controller=game&action=play';

    INTERFACE['GETVERSION'] = 'controller=default&action=kefu';

    INTERFACE['KJHISTOERY'] = 'controller=game&action=CodeShape';

    //获取投注玩法
    INTERFACE['LOTTERYBET'] = 'controller=game&action=PlayMethods';

    INTERFACE['MMCLOTERYBET'] = 'controller=mmcgamenewapi&action=play';

    INTERFACE['ABOUTBET'] = 'controller=game&action=play';
    INTERFACE['GAMEINFO'] = 'controller=gameinfo&action=CancelgameAjax';
    INTERFACE['WECHATBIND'] = 'controller=user&action=main'

    // 上次登录地点ip=>地址
    INTERFACE['IPADDRESS'] = 'controller=default&action=Ipaddress';
    // 日工资
    INTERFACE['DAILYSALARY'] = 'controller=salarymanage&action=dailysalary';
    // 历史日工资
    INTERFACE['SALARYPERSONAMSALARY'] = 'controller=salarymanage&action=personalsalary';
    // 日工资修改协议
    INTERFACE['DAILYSALARYUPDATE'] = 'controller=salarymanage&action=UpdateProtocol';
    // 日工资自身协议
    INTERFACE['DAILYSALARYSELF'] = 'controller=salarymanage&action=seeProtocol';
    // 本平台余额
    INTERFACE['MENU'] = 'controller=default&action=menu';
    // 各平台余额
    INTERFACE['BALANCE'] = 'controller=wallet&action=Balance';
    // 平台公告
    INTERFACE['NOTICELIST'] = 'controller=help&action=noticelist';
    // 查看公告是否被阅读
    INTERFACE['HELPNOTICE'] = 'controller=help&action=notice';
    // 团队列表
    INTERFACE['USERLIST'] = 'controller=user&action=list';
    // 彩票投注
    INTERFACE['NEWGAMELIST'] = 'controller=gameinfo&action=NewGameList';
    // 撤单
    INTERFACE['CANCELGAMEAJAX'] = 'controller=gameinfo&action=CancelgameAjax';
    // 追号记录
    INTERFACE['TRACEINFO'] = 'controller=report&action=TraceInfo';
    // 体育投注
    INTERFACE['SPORTSRECORDSEARCH'] = 'controller=gameinfo&action=SportsRecordSearch';
    // 追号详情
    INTERFACE['NEWTASKDETAIL'] = 'controller=report&action=newtaskdetail';
    // 终止追号
    INTERFACE['CANCELTASKAJAX'] = 'controller=gameinfo&action=CancelTaskAjax';
    // 注册下级
    INTERFACE['ADDUSER'] = 'controller=user&action=adduser';
    // 真人投注
    INTERFACE['WAGAMERECORDSEARCH'] = 'controller=gameinfo&action=EagameRecordSearch';
    // 博饼投注
    INTERFACE['BBBETTING'] = 'controller=gameinfo&action=bbbetting';
    // 博饼投注详情
    INTERFACE['DOUBLEDETAILS'] = 'controller=report&action=doubledetails';
    // PT投注
    INTERFACE['PTBETS'] = 'controller=gameinfo&action=Ptbets';
    // 修改用户信息
    INTERFACE['CHANGENAME'] = 'controller=user&action=changename';
    // 团队统计
    INTERFACE['UPUSERTEAM'] = 'controller=user&action=UpUserTeam';
    // 修改或删除生成的推广链接地址
    INTERFACE['MAIN'] = 'controller=user&action=Main';
    // 分红列表
    INTERFACE['DIVIDENDSALAY'] = 'controller=dividendsalary&action=dividendsalary';
    // 历史分红
    INTERFACE['PERSONALSALARY'] = 'controller=dividendsalary&action=personalsalary';
    // 发放分红
    INTERFACE['SENDDIVIDENDSALARY'] = 'controller=dividendsalary&action=sendDividendSalary';
    // 修改分红比例
    INTERFACE['DIVIRATIO'] = 'controller=dividendsalary&action=ratio';
    // 日亏损佣金列表
    INTERFACE['LOSESALARY'] = 'controller=losesalary&action=losesalary';
    // 日亏损佣金详情
    INTERFACE['DETAIL'] = 'controller=losesalary&action=detail';
    // 提交或修改密保问题 需要在后台添加对应的用户菜单权限才能访问
    INTERFACE['BINDSEQUESTION'] = 'controller=user&action=Bindsequestion';
    // 设置资金密码
    INTERFACE['SETSECURITY'] = 'controller=security&action=setsecurity';
    // 忘记资金密码 问题回答验证
    INTERFACE['CHECKQUESTION'] = 'controller=user&action=checkquestion';
    // pt游戏列表
    INTERFACE['PTINDEX'] = 'controller=ptgame&action=index';
    // pt-进入游戏
    INTERFACE['PTPLAY'] = 'controller=ptgame&action=play';
    // pt-登陆游戏跳转第三方
    INTERFACE['PTLOGINNEW'] = '_api/ptlogin_new.php';
    // pt-重置密码获取用户名
    INTERFACE['SHOWSETPWD'] = 'controller=ptgame&action=showsetpwd';
    // pt-确认重置密码
    INTERFACE['SETPWDCOMMIT'] = 'controller=ptgame&action=setpwdcommit';
    // pt-转账
    INTERFACE['TRANFER'] = 'controller=ptgame&action=Tranfer';
    // EA-娱乐城
    INTERFACE['EAGAME'] = 'controller=eagame';
    // 博饼游戏-转账
    INTERFACE['BOBINGTRANSFER'] = 'controller=bobing&action=newtransfer';
    // 奖金池
    INTERFACE['NEWGETPRIZEPOOL'] = 'controller=bobing&action=newGetprizepool';
    // 博饼游戏-登录
    INTERFACE['BOBINLOGIN'] = 'controller=bobing&action=play';
    // 获得绑定银行卡列表
    INTERFACE['USERBANKINFO'] = 'controller=user&action=userbankinfo';
    // 获得省份列表和银行卡列表
    INTERFACE['ADDUSERBANK'] = 'controller=security&action=adduserbank';
    // 走势图
    INTERFACE['TREND'] = 'controller=game&action=BonusCode';
    //自身协议
    INTERFACE['SELFPROTO'] = 'controller=salarymanage&action=seeProtocol';
    //用户列表
    INTERFACE['CHILDRENUSERLIST'] = 'controller=user&action=list';
    //契约列表
    INTERFACE['CONTRACTLIST'] = 'controller=user&action=team';
    //配额契约
    INTERFACE['QUOTA'] = 'controller=user&action=useraccnum';
    //奖金组契约
    INTERFACE['AWARDTEAM'] = 'controller=user&action=upedituser';
    //配额管理
    INTERFACE['APPLYPRIZEQUOTA'] = 'controller=user&action=ApplyPrizeQuota';
    //如何存款
    INTERFACE['HOWDEPOSIT'] = 'controller=help&action=Howtosaving';
    //常见问题
    INTERFACE['COMMONPROBLEMS'] = 'controller=help&action=Answer';
    //玩法介绍
    INTERFACE['PLAYMETHOD'] = 'controller=help&action=PlayInfo';
    //体育竞技
    INTERFACE['SPORT'] = 'controller=sportsbook';
    // 站内信
    INTERFACE['MESSAGES'] = 'controller=user&action=messages';
    // 提款
    INTERFACE['WITHDRAWEL'] = 'controller=financial&action=withdrawel';
    // 充提记录
    INTERFACE['GETRWRECORD'] = 'controller=financial&action=getrwrecord';
    // 转账记录
    INTERFACE['FUNDREPORT'] = 'controller=report&action=fundreport';
    // 充值
    INTERFACE['PAYMENT'] = 'controller=financial&action=payment';
    // 游戏账变
    INTERFACE['LOTTERYACCOUNTCHANGED'] = 'controller=gameinfo&action=LotteryAccountChanged';
    // 彩票明细
    INTERFACE['HISTORYTEAMLOTTERY'] = 'controller=gameinfo&action=historyteamlottery';
    // 个人总表
    INTERFACE['PROFITLOSSLOTTERYBYSELF'] = 'controller=report&action=ProfitLossLotteryBySelf';
    // 个人总表-EA娱乐城
    INTERFACE['HISTORYEA'] = 'controller=report&action=historyea';
    // 个人总表-PT
    INTERFACE['PTDAILY'] = 'controller=gameinfo&action=ptdaily';
    // 个人总表-体育
    INTERFACE['HISTORYSPORTS'] = 'controller=report&action=historysports';
    // 个人总表-博饼
    INTERFACE['BBDAIYSELF'] = 'controller=report&action=bbdailybyself';
    // 盈亏总表
    INTERFACE['TEAMMAIN'] = 'controller=gameinfo&action=Main';
    //GT娱乐-登录
    INTERFACE['GTLOGIN'] = 'controller=kgame&action=login';
    //GT娱乐-转账
    INTERFACE['GTTRANSFER'] = 'controller=kgame&action=Transfer';
    //投诉建议
    INTERFACE['COMPLAINANDSUGGESTS'] = 'controller=help&action=AddComplain';
    //活动列表
    INTERFACE['ACTIVELISTS'] = 'controller=onlineactivities&action=GetLists&absecs=True';
    //活动详情
    INTERFACE['ACTIVITYDATA'] = 'controller=onlineactivities&action=GetActivityData&absecs=True';
    //个人进度
    INTERFACE['USERSIGNDATAS'] = 'controller=onlineactivities&action=GetUserSignDatas&absecs=True';
    //活动报名
    INTERFACE['POSTENROLLS'] = 'controller=onlineactivities&action=PostEnrolls&absecs=True';
    //活动签到领奖
    INTERFACE['SIGNTHEAWARD'] = 'controller=onlineactivities&action=PostSignTheAward&absecs=True';
    //充值达标领奖
    INTERFACE['RECHARGEAMOUNTAWARD'] = 'controller=onlineactivities&action=PostRechargeAmountAward&absecs=True';
    //流水达标领奖
    INTERFACE['WATEAMOUNAWARD'] = 'controller=onlineactivities&action=PostWateAmountAward&absecs=True';
    //拉新领奖
    INTERFACE['PULLNEWAWARD'] = 'controller=onlineactivities&action=PostPullNewAward&absecs=True';
    //新人注册领奖
    INTERFACE['REGISTERAWARD'] = 'controller=onlineactivities&action=PostRegisterAward&absecs=True';
    //EA填写个人资料
    INTERFACE['ADDUSERINFO'] = 'controller=sportsbook&action=AddUserInfo';
    //判断是否输入过资金密码和密码验证
    INTERFACE['CHECKPASS'] = 'controller=security&action=checkpass';
    //上下级转账
    INTERFACE['TRANSFER'] = 'controller=financial&action=Transfer';

    let httpUrl = stateVar.httpUrl;
    if(key == 'PTLOGINNEW') {
        httpUrl += '/pcservice/' + INTERFACE[key];
    }else if(key == 'BOBINGTRANSFER' || key == 'NEWGETPRIZEPOOL'){
        httpUrl += '/bobing/?' + INTERFACE[key] + '&sess=' + getStore('session');
    }else if(key == 'BOBINLOGIN') {
        httpUrl += '/?' + INTERFACE[key] + '&sess=' + getStore('session');
    }else{
        httpUrl += '/pcservice/?' + INTERFACE[key] + '&sess=' + getStore('session');
    }
    return httpUrl
};

export default {
    interFace
}

