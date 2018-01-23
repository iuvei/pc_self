/*充值*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { hashHistory } from 'react-router';
import { stateVar } from '../../../State';

import OnlineTopUp from './OnlineTopUp/OnlineTopUp';
import AliPay from './AliPay/AliPay';

import './Recharge.scss'

@observer
export default class Recharge extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
        stateVar.navListIndex = 0;
    }
    onChangeRecharge(index) {
        stateVar.navListIndex = index;
        switch (index) {
            case 0:
                return hashHistory.push('/financial/recharge/onlineTopUp');
                break;
            case 1:
                return hashHistory.push('/financial/recharge/qqWallet');
                break;
            case 2:
                return hashHistory.push('/financial/recharge/weChat');
                break;
            case 3:
                return hashHistory.push('/financial/recharge/aliPay');
                break;
            case 4:
                return hashHistory.push('/financial/recharge/eBank');
                break;
            default:
                return hashHistory.push('/financial/recharge/onlineTopUp');
        }
    };
    render() {
        const navList = ['在线充值', 'QQ钱包', '微信', '支付宝' ,'网银转账'];
        return (
            <div className="recharge_main">
                <ul className="r_m_select_list">
                    {
                        navList.map((value, index)=>{
                            return <li className={stateVar.navListIndex == index ? 'r_m_select_list_active' : ''}
                                        onClick={() => {this.onChangeRecharge(index)}} key={index}>{value}</li>
                        })
                    }
                </ul>
                {
                    stateVar.navListIndex == 0? <OnlineTopUp/>:this.props.children
                }
            </div>
        );
    }
}
