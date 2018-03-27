
export const login = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Login/Login').default);
    }, 'login');
};
// 防劫持教程
export const dns = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Dns/Dns').default);
    }, 'dns');
};
//自动登录
export const autoLogin = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/AutoLogin/AutoLogin').default);
    }, 'autoLogin');
};
export const main = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Main/Main').default);
    }, 'main');
};
// 首页
export const home = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Home/Home').default);
    }, 'home');
};
// 彩票游戏
export const lottery = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Lottery/Lottery').default);
    }, 'lottery');
};
// 优惠活动
export const activity = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Activity/Activity').default);
    }, 'activity');
};
// 优惠活动/活动详情
export const activityDetails = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Activity/ActivityDetails/ActivityDetails').default);
    }, 'activityDetails');
};
// 优惠活动/活动详情-周返水
export const fanshui = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Activity/ActivityDetails/Fanshui').default);
    }, 'fanshui');
};
// 个人信息
export const selfInfo = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/SelfInfo/SelfInfo').default);
    }, 'selfInfo');
};
// 个人信息/个人中心
export const selfCenter = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/SelfInfo/SelfCenter/SelfCenter').default);
    }, 'selfCenter');
};
// 个人信息/银行卡管理
export const bankCardManage = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/SelfInfo/BankCardManage/BankCardManage').default);
    }, 'bankCardManage');
};
// 个人信息/安全中心
export const security = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/SelfInfo/Security/Security').default);
    }, 'security');
};
// 个人信息/站内信
export const message = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/SelfInfo/Message/Message').default);
    }, 'message');
};
// 团队管理
export const teamManage = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/TeamManage/TeamManage').default);
    }, 'teamManage');
};
// 团队管理/团队列表
export const teamList = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/TeamManage/TeamList/TeamList').default);
    }, 'teamList');
};
// 报表管理/团队统计
export const teamStatistics = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/TeamManage/TeamStatistics/TeamStatistics').default);
    }, 'teamStatistics');
};
// 团队管理/市场推广
export const marketing = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/TeamManage/Marketing/Marketing').default);
    }, 'marketing');
};
// 团队管理/契约系统
export const contract = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/TeamManage/Contract/Contract').default);
    }, 'contract');
};
// 游戏记录
export const gameRecord = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/GameRecord/GameRecord').default);
    }, 'gameRecord');
};
// 彩票投注
export const lotteryBet = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/GameRecord/LotteryBet/LotteryBet').default);
    }, 'lotteryBet');
};
// 真人投注
export const person = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/GameRecord/Person/Person').default);
    }, 'person');
};
// 体育投注
export const sports = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/GameRecord/Sports/Sports').default);
    }, 'sports');
};
// 追号记录
export const afterRecord = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/GameRecord/AfterRecord/AfterRecord').default);
    }, 'afterRecord');
};
// 追号记录/追号详情
export const aRdetails = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/GameRecord/AfterRecord/ARdetails/ARdetails').default);
    }, 'aRdetails');
};
// PT投注
export const ptRecord = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/GameRecord/PtRecord/PtRecord').default);
    }, 'ptRecord');
};
// 博饼投注
export const bobingRecord = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/GameRecord/BobingRecord/BobingRecord').default);
    }, 'bobingRecord');
};

// 报表管理
export const report = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Report/Report').default);
    }, 'report');
};
// 报表管理/个人总表
export const selfTable = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Report/SelfTable/SelfTable').default);
    }, 'selfTable');
};
// 报表管理/盈亏总表
export const teamTable = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Report/TeamTable/TeamTable').default);
    }, 'teamTable');
};
// 报表管理/分红
export const dividend = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Report/Dividend/Dividend').default);
    }, 'dividend');
};
// 报表管理/日工资
export const dayRate = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Report/DayRate/DayRate').default);
    }, 'dayRate');
};
// 报表管理/日工资
export const lotteryReport = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Report/LotteryReport/LotteryReport').default);
    }, 'lotteryReport');
};
// 报表管理/日亏损佣金
export const losesalary = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Report/Losesalary/Losesalary').default);
    }, 'losesalary');
};
// 报表管理/游戏帐变
export const gameBill = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Report/GameBill/GameBill').default);
    }, 'gameBill');
};

// 财务中心
export const financial = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Financial/Financial').default);
    }, 'financial');
};
// 财务中心/充值
export const recharge = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Financial/Recharge/Recharge').default);
    }, 'recharge');
};
// 财务中心/充值/在线充值
export const onlineTopUp = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Financial/Recharge/OnlineTopUp/OnlineTopUp').default);
    }, 'onlineTopUp');
};
// 财务中心/充值/qq钱包
export const qqWallet = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Financial/Recharge/QQWallet/QQWallet').default);
    }, 'qqWallet');
};
// 财务中心/充值/微信
export const weChat = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Financial/Recharge/WeChat/WeChat').default);
    }, 'weChat');
};
// 财务中心/充值/支付宝
export const aliPay = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Financial/Recharge/AliPay/AliPay').default);
    }, 'aliPay');
};
// 财务中心/充值/支付宝确认
export const promptlyRecharge = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Financial/Recharge/AliPay/promptlyRecharge/promptlyRecharge').default);
    }, 'promptlyRecharge');
};
// 财务中心/充值/网银转账
export const eBank = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Financial/Recharge/EBank/EBank').default);
    }, 'eBank');
};
// 财务中心/提现
export const withdraw = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Financial/Withdraw/Withdraw').default);
    }, 'withdraw');
};
// 财务中心/确认提现
export const affirmWithdraw = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Financial/Withdraw/AffirmWithdraw/AffirmWithdraw').default);
    }, 'affirmWithdraw');
};
// 财务中心/充提记录
export const mentionFillingRecord = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Financial/MentionFillingRecord/MentionFillingRecord').default);
    }, 'mentionFillingRecord');
};
// 财务中心/转账
export const transfer = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Financial/Transfer/Transfer').default);
    }, 'transfer');
};
// 财务中心/转账记录
export const transferRecord = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Financial/TransferRecord/TransferRecord').default);
    }, 'transferRecord');
};
// 财务中心/资金帐变
export const accountChange = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Financial/AccountChange/AccountChange').default);
    }, 'accountChange');
};
// 综合游戏
export const otherGames = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/OtherGames/OtherGames').default);
    }, 'otherGames');
};
// 综合游戏/博饼
export const bobing = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/OtherGames/Bobing/Bobing').default);
    }, 'bobing');
};
// 综合游戏/EA娱乐城
export const ea = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/OtherGames/EA/EA').default);
    }, 'ea');
};
// 综合游戏/体育竞技
export const sport = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/OtherGames/Sport/Sport').default);
    }, 'sport');
};
// 综合游戏/GT娱乐
export const gt = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/OtherGames/GT/GT').default);
    }, 'gt');
};
// 综合游戏/PT游戏
export const pt = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/OtherGames/PT/PT').default);
    }, 'pt');
};
//走势图
export const tendency = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/Tendency/Tendency').default);
    }, 'tendency');
};
// 帮助中心
export const helpInfo = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/HelpInfo/HelpInfo').default);
    }, 'helpInfo');
};
// 帮助中心/如何存款
export const howDeposit = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/HelpInfo/HowDeposit/HowDeposit').default);
    }, 'howDeposit');
};
// 帮助中心/玩法介绍
export const playMethodIntroduce = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/HelpInfo/PlayMethodIntroduce/PlayMethodIntroduce').default);
    }, 'playMethodIntroduce');
};
// 帮助中心/常见问题
export const commonProblems = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/HelpInfo/CommonProblems/CommonProblems').default);
    }, 'commonProblems');
};
// 帮助中心/关于恒彩
export const aboutHengCai = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/HelpInfo/AboutHengCai/AboutHengCai').default);
    }, 'aboutHengCai');
};
// 下载客户端
export const downLoadClient = (location, callback) => {
    require.ensure([], (require) => {
        callback(null, require('../Components/DownLoadClient/DownLoadClient').default);
    }, 'downLoadClient');
};
