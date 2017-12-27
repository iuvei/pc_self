/*转账*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Select, InputNumber, Input, Button } from 'antd';

import './Transfer.scss'
import trade_icon from './Img/trade_icon.png'

@observer
export default class Transfer extends Component {
    constructor(props){
      super(props);
      this.state = {
          confirmTransferLoading: false,
      }
    };
    // 转出账户
    onAccountOut(value) {
        console.log(`selected ${value}`);
    }
    // 转账金额
    onTransferAmount(value) {
        console.log('changed', value);
    }
    // 确认转账
    onConfirmTransfer() {
        this.setState({ confirmTransferLoading: true });
    };
    render() {
        const Option = Select.Option;
        return (
            <div className="transfer_main">
                <ul className="tf_m_balance_list clear">
                    <li>
                        <div className="tf_m_account_b">
                            <p>账户余额</p>
                            <p>￥888.00</p>
                        </div>
                    </li>
                    <li>
                        <div className="tf_m_acount icon_top_02">
                            <p>体育余额</p>
                            <p>￥0.00</p>
                        </div>
                    </li>
                    <li>
                        <div className="tf_m_acount icon_top_03">
                            <p>体育余额</p>
                            <p>￥0.00</p>
                        </div>
                    </li>
                    <li>
                        <div className="tf_m_acount icon_top_04">
                            <p>体育余额</p>
                            <p>￥0.00</p>
                        </div>
                    </li>
                    <li>
                        <div className="tf_m_acount icon_top_05">
                            <p>体育余额</p>
                            <p>￥0.00</p>
                        </div>
                    </li>
                </ul>
                <div className="tr_m_account_info clear">
                    <div className="tr_m_form left">
                        <div className="tr_m_trade">
                            <Button>
                                <img src={ trade_icon } alt="调换"/>
                            </Button>
                        </div>
                        <ul>
                            <li>
                                <span className="tr_m_f_type">转出账户：</span>
                                <Select size="large" style={{ width: 297 }} onChange={(value)=>{this.onAccountOut(value)}} placeholder="请输入转出账户">
                                    <Option value="jack">Jack</Option>
                                    <Option value="lucy">Lucy</Option>
                                    <Option value="disabled" disabled>Disabled</Option>
                                    <Option value="Yiminghe">yiminghe</Option>
                                </Select>
                            </li>
                            <li>
                                <span className="tr_m_f_type">转入账户：</span>
                                <Select size="large" style={{ width: 297 }} onChange={(value)=>{this.onAccountOut(value)}} placeholder="请输入转入账户">
                                    <Option value="jack">Jack</Option>
                                    <Option value="lucy">Lucy</Option>
                                    <Option value="disabled" disabled>Disabled</Option>
                                    <Option value="Yiminghe">yiminghe</Option>
                                </Select>
                            </li>
                            <li>
                                <span className="tr_m_f_type">转账金额：</span>
                                <InputNumber min={10} max={5000} defaultValue={10}
                                             formatter={value => `${value}元`}
                                             parser={value => value.replace('元', '')}
                                             onChange={(value)=>{this.onTransferAmount(value)}} />
                                <p className="tr_m_f_text">转账金额至少10元以上</p>

                            </li>
                            <li>
                                <span className="tr_m_f_type">资金密码：</span>
                                <Input size="large" style={{ width: 297, height: 35 }} placeholder="请输入资金密码" />
                            </li>
                            <li>
                                <span className="tr_m_f_type"></span>
                                <Button type="primary" size="large" loading={this.state.confirmTransferLoading} onClick={()=>{this.onConfirmTransfer()}}>
                                    确认转账
                                </Button>
                            </li>
                        </ul>
                    </div>
                    <div className="tr_m_text right">
                        <h4>温馨提示</h4>
                        <p>1. 每分钟限制转账一次</p>
                        <p>2. 当第三方平台处于【维护时间】时，将无法提供相应平台的【额度转换】功能！</p>
                        <p>3. 当【额度转换】失败是请留意【账户余额】是否出现相应的增减，如若没有请联系客服查证！</p>
                        <p>4. 主账户余额默认为彩票账户余额</p>
                    </div>
                </div>
            </div>
        );
    }
}
