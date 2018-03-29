import {observable, action} from 'mobx';
import _code from '../CommonJs/common'

// useStrict(true);
class State {
    // @observable httpUrl = window.location.origin || (window.location.protocol +'//' + window.location.host); // 域名
    @observable httpUrl = 'http://10.63.15.242'; // 域名

    @observable httpService = ''; // 联系客服url
    @observable httpCS = ''; // 域名测速
    @observable userInfo = {// 用户信息
        userName: '请先登录',
        userId: '',
        userType: '', //用户类型0：会员，1：代理
        accGroup: '', //奖金组
        lastIp: '', //上次登录地点ip
        sType: '', //正式或者试玩
        address: '', // 上次登录地点
        lastTime: '', //上次登录时间
        issetbank: '', //是否绑定过银行卡 0：已绑定
        setquestion: '', //是否设置过密保问题 no：设置过
        setsecurity: '', //是否设置过资金密码 no：设置过
        email: '',
    };
    @observable dailysalaryStatus = {}; // 获得日工资，亏损，分红签订状态
    @observable allBalance = {// 各平台余额
        cpbalance: '0.00', // 恒彩主账户
        eabalance: '0.00', // EA真人娱乐
        ptbalance: '0.00', // PT娱乐
        kgbalance: '0.00', // KGAME游戏
        bobingBalance: '0.00', // 博饼账户
        sbbalance: '0.00', // 体育
    };
    @observable afterDetails = false; // 追号详情时更换nav
    @observable securityIndex = 3; // 安全中心 3：默认选择设置密保问题
    @observable pageSizeOptions = ['10', '25', '50']; // 表格分页时 指定每页可以显示多少条
    @observable bankWithdrawInfo = {}; // 提款信息
    @observable unread = 0; // 站内信未读条数
    @observable navIndex = 'lottery'; // 顶部导航选择状态
    @observable aliPayInfo = {}; // 支付宝充值相关信息
    @observable navListIndex = 0; // 充值页面下的充值方式
    @observable lotteryType = []; // 彩种分类

    @observable auth = false;

    @observable sess = null;
    @observable childNavIndex = 0;
    @observable todoList = [];
    @observable homeMainLeftActive = true;
    @observable allLottery = [];
    @observable alllotteryType = {};
    @observable nowlottery = {
        'lotteryId': 'ssc',
        'cuimId': '',
        defaultMethodId: 0,
        lotteryBetId: 1,
        cnname: '重庆时时彩',
        imgUrl: 'cqssc'
    };
    @observable defaultMethod = 0;
    @observable openLotteryFlag = true;
    @observable todayAndTomorrow = [];
    @observable tomorrowIssue = [];
    @observable issueIndex = '?????';
    @observable nextIssue = '?????';
    @observable savePkInput = {};
    @observable aboutGame = {
        data_sel: [],
        methodID: '',
        max_place: 0,
        minchosen: [],
        otype: '',
        maxcodecount: 0,
        noBigIndex: 0,
        random_bets: false,
        title: '',
        name: '',
        str: '',
        menuid: '',
        sp: '',
        prize: 0
    };
    @observable BetContent = {
        lt_same_code: [], totalDan: 0, totalNum: 0, totalMoney: 0, lt_trace_base: 0
    };
    @observable issueItem = [];
    @observable kjNumberList = [];
    @observable mmCkjNumberList = [];
    @observable mmccode = ['-', '-', '-', '-', '-'];
    @observable methodIdItem = [];
    @observable shapeObj = {type: '', content: []};
    @observable checkLotteryId = true;
    @observable paused = true;
    @observable betVisible = false;
    @observable activeTheme = _code.getStore('webTheme') || 'white';
    @action('修改网站主题 换肤') changeTheme = (color) => {
        _code.setStore('webTheme', color)
        this.activeTheme = color
    }
}

export const stateVar = new State();
