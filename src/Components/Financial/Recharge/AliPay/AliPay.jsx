/*支付宝*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { hashHistory } from 'react-router';
import { InputNumber, Button,Input } from 'antd';

import './AliPay.scss'

import ali_scan from './Img/ali_scan.png'
import ali_transfer from './Img/ali_transfer.png'

@observer
export default class AliPay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgUrlIndex: 0,
        };
    };
    // 立即充值
    onRecharge() {
        this.setState({ iconLoadingRecharge: true });
        hashHistory.push('/financial/recharge/promptlyRecharge');
    };
    // 充值金额
    onRechargeAmount(value) {
        console.log('changed', value);

    };
    //输入用户真实姓名
    trueName(value){
        console.log('name', value);
    }
    render() {
        const imgUrl = [ali_scan,ali_transfer];
        return (
            <div className="ali_main">
                <div className="ali_m_hint">
                    <p>平台填写金额应当与网银汇款金额完全一致，否则将无法即使到账！</p>
                </div>
                <ul className="ali_m_list">
                    <li className="clear">
                        <span className="ali_m_li_w left" style={{marginTop: '10px'}}>选择充值银行：</span>
                        <ul className="ali_m_select_yhk left">
                            {
                                imgUrl.map((value, index)=>{
                                    return <li className={ this.state.imgUrlIndex === index ? 'ali_m_active' : '' } onClick={()=>{this.setState({imgUrlIndex: index})}} key={index}><img src={value} alt="选择银行"/></li>
                                })
                            }
                        </ul>
                    </li>
                    <li>
                        <span className="ali_m_li_w">支付宝真实姓名：</span>
                        <Input  size="large" onChange={(value)=>{this.trueName(value)}} />
                    </li>
                    <li>
                        <span className="ali_m_li_w">充值金额：</span>
                        <InputNumber min={1} max={100000} defaultValue={1} size="large" onChange={(value)=>{this.onRechargeAmount(value)}} />
                        <span style={{margin: '0 15px 0 3px'}}>元</span>
                        <span className="ali_m_recharge_text">
                                    单笔充值限额：最低
                                    <strong style={{color: '#CB1313',fontWeight: 'normal'}}>10</strong>
                                    ，最高
                                    <strong style={{color: '#CB1313',fontWeight: 'normal'}}>50000</strong>
                                    ，单日充值总额无上限
                                </span>
                        <p className="ali_m_dx">壹百元整</p>
                    </li>
                    <li className="ali_m_primary_btn">
                        <span className="ali_m_li_w"></span>
                        <Button type="primary" size="large" loading={this.state.iconLoadingRecharge} onClick={()=>{this.onRecharge()}}>
                            立即充值
                        </Button>
                    </li>
                </ul>
            </div>
        )
    }
}
