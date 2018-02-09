import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { hashHistory } from 'react-router';
import { Modal } from 'antd';
import { stateVar } from '../../../State';
import emitter from '../../../Utils/events';
import lotteryTypeList from '../../../CommonJs/common.json';
import HeaderTop from './HeaderTop';
import './headerNav.scss';

import nav_h from './Img/nav_h.png';
import nav_n from './Img/nav_n.png';

@observer
export default class HeaderNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLottery: false,
        };
    };
    componentDidMount() {
        this._ismount = true;
        stateVar.navIndex = 'lottery';
        this.onLotteryType();
    };
    onLotteryType() {
        let typeSsc = [], selectFive = [], second = [], rests = [], diping =[];
        for(let i = 0, lottery = lotteryTypeList.lotteryType; i < lottery.length; i++){
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
    componentWillUnmount() {
        this._ismount = false;
    };
    onHashHistory(item) {
        if(stateVar.userInfo.sType == 'demo' &&
            (item.id == 'financial' || item.id == 'teamManage')
        ){
            Modal.warning({
                title: '试玩用户，没有访问权限',
            });
            return
        }
        if(item.id == 'gameRecord'){
            stateVar.afterDetails = false;
        }
        stateVar.navIndex = item.id;
        hashHistory.push(item.link);
        stateVar.childNavIndex = 0;
    };
    onLotteryOver(){
        if(!this.state.showLottery){
            this.setState({showLottery: true})
        }
    };
    onLotteryOut(){
        this.setState({showLottery: false})
    };
    /*切换彩种*/
    onChangeLottery(nav){
        let key = {
            key: nav
        };
        emitter.emit('changeLottery', key);
    };
    render() {
        const navList = [
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
                name: '综合游戏',
                link: '/otherGames',
                id: '/otherGames',
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
                link: stateVar.userInfo.userType == 0 ? '/report/lotteryReport' : '/report/teamStatistics',
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
        const { navIndex, lotteryType } = stateVar;
        const { showLottery } = this.state;

        return (
            <div className="header_main">
                <HeaderTop/>
                <nav className="nav">
                    <div className="nav-content clear">
                            <ul className="nav_list clear">
                                {
                                    navList.map((item)=>{
                                        return (
                                            <li
                                                className={(navIndex == item.id ? 'nav_active' : '') +' '+ (item.id == 'lottery' && showLottery ? 'hover_lottery' : '')}
                                                onClick={()=>this.onHashHistory(item)}
                                                onMouseOver={item.id == 'lottery' ? ()=>this.onLotteryOver() : ''}
                                                onMouseOut={item.id == 'lottery' ? ()=>this.onLotteryOut() : ''}
                                                key={item.id}
                                            >
                                                {item.name}
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                    </div>
                </nav>
                <div className={showLottery ? 't_m_select_lottery t_m_select_lottery_show' : 't_m_select_lottery'}
                     onMouseOver={()=>this.onLotteryOver()}
                     onMouseOut={()=>this.onLotteryOut()}
                >
                    <ul className="lottery_type_list clear">
                        {
                            lotteryType.map((items)=>{
                                    return (
                                        <li className="lottery_type" key={items.typeName}>
                                            <p>{items.typeName}</p>
                                            <ul className="lottery_list">
                                                {
                                                    items.lotteryList.map((item)=>{
                                                        return (
                                                            <li className={item.disabled ? 'disabled_style' : ''} onClick={item.disabled ? ()=>{} : ()=>this.onChangeLottery(item.nav)} key={item.nav}>
                                                                {item.cnname}
                                                                {
                                                                    item.imgSrc ?
                                                                        <img className="h_n_icon" src={item.imgSrc == 'nav_h' ? nav_h : item.imgSrc == 'nav_n' ? nav_n : ''}/> :
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
        );
    }
}

