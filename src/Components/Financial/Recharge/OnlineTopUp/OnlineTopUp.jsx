/*在线充值*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../../../Utils';
import { hashHistory } from 'react-router';
import { InputNumber, Button } from 'antd';
import { changeMoneyToChinese } from '../../../../CommonJs/common';

import './OnlineTopUp.scss'

@observer
export default class OnlineTopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgUrlIndex: 0,
            backList: [], // 可选择银行
            money: 0,
            loadmax: 0, //渠道限额最多
            loadmin: 0, //渠道限额最少
        };
    };
    componentDidMount() {
        this._ismount = true;
        this.onLinePayment()
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    onLinePayment(){
        Fetch.payment({
            method: 'POST',
            body:JSON.stringify({type: 'paymentBank', cateid: 1})
        }).then((res)=>{
            if(this._ismount && res.status == 200){
                this.setState({
                    backList: res.repsoneContent,
                })
            }
        })
    }
    // 立即充值
    onRecharge() {
        this.setState({ iconLoadingRecharge: true });
        hashHistory.push('/financial/recharge/promptlyRecharge');
    };
    // 充值金额
    onRechargeAmount(value) {
        console.log('changed', value);
        this.setState({money: value})
    };
    /*选择银行*/
    selectActive(rid){
        this.setState({imgUrlIndex: rid});
        let backList = this.state.backList;

    };
    render() {

        return (
            <div className="online_top_up">
                <div className="r_m_hint">
                    <p>平台填写金额应当与网银汇款金额完全一致，否则将无法即使到账！</p>
                </div>
                <ul className="r_m_list">
                    <li className="clear">
                        <span className="r_m_li_w left" style={{marginTop: '10px'}}>选择充值银行：</span>
                        <ul className="r_m_select_yhk left">
                            {
                                this.state.backList.map((item, index)=>{
                                    return (
                                        <li className={ this.state.imgUrlIndex === item.rid ? 'r_m_active' : '' } onClick={()=>{this.selectActive(item.rid)}} key={item.code}>
                                            <img src={require('./Img/yinhang/'+item.code+'.jpg')} alt="选择银行"/>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </li>
                    <li>
                        <span className="r_m_li_w">充值金额：</span>
                        <InputNumber min={1} max={100000} defaultValue={1} size="large" onChange={(value)=>{this.onRechargeAmount(value)}} />
                        <span style={{margin: '0 15px 0 3px'}}>元</span>
                        <span className="r_m_recharge_text">
                                    单笔充值限额：最低
                                    <strong style={{color: '#CB1313',fontWeight: 'normal'}}>10</strong>
                                    ，最高
                                    <strong style={{color: '#CB1313',fontWeight: 'normal'}}>50000</strong>
                                    ，单日充值总额无上限
                                </span>
                        <p className="r_m_dx">{changeMoneyToChinese(this.state.money)}</p>
                    </li>
                    <li className="r_m_primary_btn">
                        <span className="r_m_li_w"></span>
                        <Button type="primary" size="large" loading={this.state.iconLoadingRecharge} onClick={()=>{this.onRecharge()}}>
                            立即充值
                        </Button>
                    </li>
                </ul>
            </div>
        )
    }
}
