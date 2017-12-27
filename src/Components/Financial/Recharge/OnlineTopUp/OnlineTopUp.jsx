/*在线充值*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { hashHistory } from 'react-router';
import { InputNumber, Button } from 'antd';

import './OnlineTopUp.scss'

import nongye from './Img/nongye.png'
import jianshe from './Img/jianshe.png'
import zhongxin from './Img/zhongxin.png'
import guangda from './Img/guangda.png'
import beijing from './Img/beijing.png'
import gongshang from './Img/gongshang.png'
import guangfa from './Img/guangfa.png'
import pufa from './Img/pufa.png'
import youzheng from './Img/youzheng.png'
import shanghai from './Img/shanghai.png'
import pingan from './Img/pingan.png'
import xingye from './Img/xingye.png'

@observer
export default class OnlineTopUp extends Component {
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
    render() {
        const imgUrl = [nongye, jianshe, zhongxin, guangda, beijing, gongshang, guangfa, pufa, youzheng, shanghai, pingan, xingye];
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
                                imgUrl.map((value, index)=>{
                                    return <li className={ this.state.imgUrlIndex === index ? 'r_m_active' : '' } onClick={()=>{this.setState({imgUrlIndex: index})}} key={index}><img src={value} alt="选择银行"/></li>
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
