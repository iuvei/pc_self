/*QQ钱包*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { hashHistory } from 'react-router';
import { InputNumber, Button } from 'antd';

import './QQWallet.scss'

@observer
export default class QQWallet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iconLoadingRecharge: false,
        };
    };
    // 立即充值
    onRecharge() {
        this.setState({ iconLoadingRecharge: true });
    };
    // 充值金额
    onRechargeAmount(value) {
        console.log('changed', value);
    };
    render() {
        return (
            <div className="qq_wallet">
                <ul className="r_m_list">
                    <li>
                        <span className="r_m_li_w">选择充值银行：</span>
                        <span className="r_m_qq_controler r_m_active">
                                        <span className="r_m_qq">QQ钱包</span>
                                    </span>
                    </li>
                    <li style={{height: '70px'}}>
                        <span className="r_m_li_w">充值金额：</span>
                        <InputNumber min={1} max={100000} defaultValue={1} size="large" onChange={(value)=>{this.onRechargeAmount(value)}} />
                        <span style={{margin: '0 15px 0 3px'}}>元</span>
                        <span className="r_m_recharge_text">
                                        单笔充值限额：最低
                                        <strong style={{color: '#CB1313',fontWeight: 'normal'}}>10</strong>
                                        ，最高
                                        <strong style={{color: '#CB1313',fontWeight: 'normal'}}>50000</strong>
                                    </span>
                        <p className="r_m_dx">壹百元整</p>
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
