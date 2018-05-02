import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Modal} from 'antd';
import {hashHistory} from 'react-router';
import Fetch from '../../../Utils';
import {stateVar} from '../../../State';
import common from '../../../CommonJs/common';
import emitter from '../../../Utils/events';
import lotteryTypeList from '../../../CommonJs/common.json';
import HeaderTop from './HeaderTop';
import './headerNav.scss';

@observer
export default class HeaderNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLottery: false,
            navList: [],
            showOtherGames: false,
            otherGamesArr: [
                {
                    name: '博饼',
                    link: '/otherGames/bobing',
                    id: 'bb',
                    disabled: true,
                }, {
                    name: 'EA娱乐城',
                    link: '/otherGames/ea',
                    id: 'ea',
                    disabled: true,
                }, {
                    name: 'PT游戏',
                    link: '/otherGames/pt',
                    id: 'pt',
                    disabled: true,
                }, {
                    name: 'KGAME游戏',
                    link: '/otherGames/kgame',
                    id: 'gt',
                    disabled: true,
                }, {
                    name: '体育竞技',
                    link: '/otherGames/sport',
                    id: 'sport',
                    disabled: true,
                }
            ],
        };
    };

    componentDidMount() {
        this._ismount = true;
        stateVar.navIndex = 'lottery';
        this.onChangeNav();
        this.onLotteryType();
        this.changeDailysalary();
    };

    componentWillUnmount() {
        this._ismount = false;
    };

    /*是否有日工资 分红 日亏损*/
    changeDailysalary() {
        Fetch.dailysalary({
            method: 'POST',
            body: JSON.stringify({check: 1}),
        }).then((res) => {
            if (this._ismount && res.status == 200) {
                let data = res.repsoneContent;
                stateVar.dailysalaryStatus = data;
            }
        })
    };

    onChangeNav() {
        let navListFlag = [];
        const {userInfo} = stateVar;
        /*判断代理会员*/
        if (userInfo.userType == 0) { //是会员
            navListFlag = [
                {
                    name: '首页',
                    link: '/home',
                    id: 'home',
                },
                {
                    name: '彩票大厅',
                    link: '/lottery',
                    id: 'lottery',
                },
                {
                    name: '走势图',
                    link: '/tendList',
                    id: 'tendList',
                },
                {
                    name: '综合游戏',
                    link: '/otherGames',
                    id: 'otherGames',
                },
                {
                    name: '优惠活动',
                    link: '/activity',
                    id: 'activity',
                },
                {
                    name: '投注记录',
                    link: '/gameRecord',
                    id: 'gameRecord',
                },
                {
                    name: '报表管理',
                    link: '/report',
                    id: 'report',
                },
                {
                    name: '财务中心',
                    link: '/financial/recharge',
                    id: 'financial',
                },
                {
                    name: '个人信息',
                    link: '/selfInfo',
                    id: 'selfInfo',
                }
            ];
        } else {
            navListFlag = [
                {
                    name: '首页',
                    link: '/home',
                    id: 'home',
                },
                {
                    name: '彩票大厅',
                    link: '/lottery',
                    id: 'lottery',
                },
                {
                    name: '走势图',
                    link: '/tendList',
                    id: 'tendList',
                },
                {
                    name: '综合游戏',
                    link: '/otherGames',
                    id: 'otherGames',
                },
                {
                    name: '优惠活动',
                    link: '/activity',
                    id: 'activity',
                },
                {
                    name: '投注记录',
                    link: '/gameRecord',
                    id: 'gameRecord',
                },
                {
                    name: '报表管理',
                    link: '/report',
                    id: 'report',
                },
                {
                    name: '财务中心',
                    link: '/financial/recharge',
                    id: 'financial',
                },
                {
                    name: '个人信息',
                    link: '/selfInfo',
                    id: 'selfInfo',
                },
                {
                    name: '团队管理',
                    link: '/teamManage',
                    id: 'teamManage',
                },
            ];
        }
        this.setState({navList: navListFlag})
    };

    onLotteryType() {
        let typeSsc = [], selectFive = [], second = [], rests = [], diping = [];
        for (let i = 0, lottery = lotteryTypeList.lotteryType; i < lottery.length; i++) {
            if (lottery[i].lotterytype === 1) { // 高频
                rests.push(lottery[i])
            }
            if (lottery[i].lotterytype === 2) { // 时时彩
                typeSsc.push(lottery[i])
            }
            if (lottery[i].lotterytype === 3) { // 11选5
                selectFive.push(lottery[i])
            }
            if (lottery[i].lotterytype === 4) { // 24小时
                second.push(lottery[i])
            }
            if (lottery[i].lotterytype === 5) { // 低频
                diping.push(lottery[i])
            }
        }
        let lotteryTypeFlag = [
            {
                typeName: '24小时',
                lotteryList: second,
            },
            {
                typeName: '时时彩',
                lotteryList: typeSsc,
            },
            {
                typeName: '11选5',
                lotteryList: selectFive,
            },
            {
                typeName: '低频',
                lotteryList: diping,
            },
            {
                typeName: '高频',
                lotteryList: rests,
            },
        ];
        stateVar.lotteryType = lotteryTypeFlag;
    };

    onHashHistory(item) {
        if (stateVar.userInfo.sType == 'demo' &&
            (item.id == 'financial' || item.id == 'teamManage')
        ) {
            Modal.warning({
                title: '试玩用户，没有访问权限',
            });
            return
        }
        if (item.id == 'gameRecord') {
            stateVar.afterDetails = false;
        }
        stateVar.navIndex = item.id;
        hashHistory.push(item.link);
        stateVar.childNavIndex = 0;
    };

    onLotteryOver(id) {
        if (id === 'lottery' && !this.state.showLottery) {
            this.setState({showLottery: true})
        }
        if (id === 'otherGames' && !this.state.showOtherGames) {
            this.setState({showOtherGames: true})
        }
    };

    onLotteryOut(id) {
        if (id === 'lottery') {
            this.setState({showLottery: false})
        }
        if (id === 'otherGames') {
            this.setState({showOtherGames: false})
        }
    };

    /*切换彩种*/
    onChangeLottery(nav) {
        let tempId = nav;
        let tempMethod = common.getStore(common.getStore('userId'));
        let thisUrl = window.location.href.indexOf('lottery') > -1 ? true : false;
        if (thisUrl) {
            if (tempMethod == undefined || stateVar.nowlottery.lotteryId == tempId) {
                return;
            } else {
                let tempFlag = true;
                if (tempId == 'mmc' && tempMethod['mmc'] == undefined) {
                    tempFlag = false;
                } else {
                    if (tempMethod[tempId] == undefined) {
                        tempFlag = false;
                    } else {
                        for (let val in tempMethod) {
                            if (val == tempId) {
                                if (tempMethod[val].msg == undefined) {
                                    tempFlag = false;
                                } else {
                                    const modal = Modal.error({
                                        title: '温馨提示',
                                        content: tempMethod[val].msg,
                                    });
                                    setTimeout(() => modal.destroy(), 3000);
                                    return;
                                }
                                break;
                            }
                        }
                    }
                }
                if (!tempFlag) {
                    this._ismount = false;
                    stateVar.todayAndTomorrow = [];
                    stateVar.tomorrowIssue = [];
                    stateVar.issueIndex = '?????';
                    stateVar.BetContent.lt_same_code = [];
                    stateVar.BetContent.totalDan = 0;
                    stateVar.BetContent.totalNum = 0;
                    stateVar.BetContent.totalMoney = 0;
                    stateVar.BetContent.lt_trace_base = 0;
                    stateVar.kjNumberList = [];
                    stateVar.mmCkjNumberList = [];
                    clearInterval(window.interval);
                    stateVar.checkLotteryId = false;
                    stateVar.nowlottery.lotteryId = tempId;
                    stateVar.BetContent = {
                        lt_same_code: [], totalDan: 0, totalNum: 0, totalMoney: 0, lt_trace_base: 0
                    };
                    emitter.emit('initData');
                    stateVar.isload = false;
                }
            }
        } else {
            stateVar.navIndex = 'lottery';
            stateVar.kjNumberList = [];
            if (tempId == 'mmc' && tempMethod != undefined && tempMethod['mmc'] == undefined) {
                stateVar.nowlottery.lotteryId = tempId;
                hashHistory.push('/lottery');
            } else {
                if (tempMethod != undefined) {
                    if (tempMethod[tempId] == undefined) {
                        stateVar.nowlottery.lotteryId = tempId;
                        hashHistory.push('/lottery');
                    } else {
                        for (let val in tempMethod) {
                            if (val == tempId) {
                                if (tempMethod[val].msg == undefined) {
                                    stateVar.nowlottery.lotteryId = tempId;
                                    hashHistory.push('/lottery');
                                } else {
                                    const modal = Modal.error({
                                        title: '温馨提示',
                                        content: tempMethod[val].msg,
                                    });
                                    setTimeout(() => modal.destroy(), 3000);
                                    stateVar.nowlottery.lotteryId = 'ssc';
                                    hashHistory.push('/lottery');
                                    return;
                                }
                            }
                        }
                    }
                } else {
                    stateVar.nowlottery.lotteryId = tempId;
                    hashHistory.push('/lottery');
                }
            }
        }
        this.setState({showLottery: false});
    };

    onOtherGames(item) {
        hashHistory.push(item.link);
        stateVar.navIndex = 'otherGames';
    };

    render() {
        const {navIndex, lotteryType} = stateVar;
        const {showLottery, navList, showOtherGames, otherGamesArr} = this.state;

        return (
            <header>
                <div className="header_main">
                    <HeaderTop/>
                    <nav className="nav">
                        <div className="nav-content clear">
                            <ul className="nav_list clear">
                                {
                                    navList.map((item) => {
                                        return (
                                            <li key={item.id}>
                                                <div className={
                                                    (navIndex == item.id ? 'nav_active' : '') + ' ' +
                                                    (item.id == 'lottery' && showLottery ? ' hover_lottery' : '') + ' ' +
                                                    (item.id == 'otherGames' && showOtherGames ? 'hover_lottery' : '')
                                                }
                                                     onClick={() => this.onHashHistory(item)}
                                                     onMouseOver={item.id == 'lottery' || item.id == 'otherGames' ? () => this.onLotteryOver(item.id) : null}
                                                     onMouseOut={item.id == 'lottery' || item.id == 'otherGames' ? () => this.onLotteryOut(item.id) : null}>
                                                    {item.name}
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                                <li key="-1"
                                    className={showOtherGames ? 'otherGames_down otherGames_down_show' : 'otherGames_down'}
                                    onMouseOver={() => this.onLotteryOver('otherGames')}
                                    onMouseOut={() => this.onLotteryOut('otherGames')}>
                                    <ul className="o_down_list">
                                        {
                                            otherGamesArr.map((item) => {
                                                return <li onClick={() => this.onOtherGames(item)}
                                                           key={item.id}>{item.name}</li>
                                            })
                                        }
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <div className={showLottery ? 't_m_select_lottery t_m_select_lottery_show' : 't_m_select_lottery'}
                         onMouseOver={() => this.onLotteryOver('lottery')}
                         onMouseOut={() => this.onLotteryOut('lottery')}
                    >
                        <ul className="lottery_type_list clear">
                            {
                                lotteryType.map((items) => {
                                        return (
                                            <li className="lottery_type" key={items.typeName}>
                                                <p>{items.typeName}</p>
                                                <ul className="lottery_list">
                                                    {
                                                        items.lotteryList.map((item) => {
                                                            return (
                                                                <li className={item.disabled ? 'disabled_style' : ''}
                                                                    onClick={item.disabled ? () => {
                                                                    } : () => this.onChangeLottery(item.nav)} key={item.nav}>
                                                                    {item.cnname}
                                                                    {
                                                                        item.imgSrc ?
                                                                            <img className="h_n_icon" src={require('../../../Images/' + item.imgSrc + '.png')}/> :
                                                                            null
                                                                    }
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </li>
                                        )
                                    }
                                )
                            }
                        </ul>
                    </div>
                </div>
            </header>
        );
    }
}

