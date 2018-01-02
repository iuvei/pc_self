/*转账*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Select, InputNumber, Input, Button } from 'antd';
const Option = Select.Option;
import { stateVar } from '../../../State';

import './Transfer.scss'
import trade_icon from './Img/trade_icon.png'

const accoutArr = [
    {
        name: '彩票账户',
        id: '0'
    },
    {
        name: '体育账户',
        id: '1'
    },
    {
        name: 'EA账户',
        id: '2'
    },
    {
        name: 'PT账户',
        id: '3'
    },
    {
        name: '博饼账户',
        id: '4'
    }
];
@observer
export default class Transfer extends Component {
    constructor(props){
      super(props);
      this.state = {
          confirmTransferLoading: false,
          outAccout: accoutArr, //转出账户
          inAccout: accoutArr, //转入账户
          selectOut: null,
          selectIn: null,
      }
    };
    /*选择 转出转入 账户*/
    onAccountOutIn(value, type) {
        let { selectOut, selectIn } = this.state;
        if(type === 'out'){
            if(value == 0){
                this.setState({
                    selectOut: value,
                    selectIn: null,
                    inAccout: accoutArr.filter(item => item.id !== ''+ value)
                })
            }else{
                this.setState({
                    selectOut: value,
                    selectIn: null,
                    inAccout: accoutArr.filter(item => item.id === ''+ 0)
                })
            }
        }else{
            this.setState({selectIn: value})
        }
    }
    /*调换转入转出*/
    onTrade() {
        let { selectOut, selectIn } = this.state;
        if(selectIn == 0){
            this.setState({
                selectOut: selectIn,
                selectIn: selectOut,
                inAccout: accoutArr.filter(item => item.id !== ''+ 0),
            })
        }else{
            this.setState({
                selectOut: selectIn,
                selectIn: selectOut,
                inAccout: accoutArr.filter(item => item.id === ''+ 0),
            })
        }

    };
    // 转账金额
    onTransferAmount(value) {
        console.log('changed', value);
    }
    // 确认转账
    onConfirmTransfer() {
        this.setState({ confirmTransferLoading: true });
    };
    render() {
        const allBalance = stateVar.allBalance;
        const { outAccout, inAccout } = this.state;

        return (
            <div className="transfer_main">
                <ul className="tf_m_balance_list clear">
                    <li>
                        <div className="tf_m_account_b">
                            <p>账户余额</p>
                            <p>￥{allBalance.cpbalance}</p>
                        </div>
                    </li>
                    <li>
                        <div className="tf_m_acount icon_top_02">
                            <p>体育余额</p>
                            <p>￥{allBalance.sbbalance}</p>
                        </div>
                    </li>
                    <li>
                        <div className="tf_m_acount icon_top_03">
                            <p>EA余额</p>
                            <p>￥{allBalance.eabalance}</p>
                        </div>
                    </li>
                    <li>
                        <div className="tf_m_acount icon_top_04">
                            <p>博饼余额</p>
                            <p>￥{allBalance.bobingBalance}</p>
                        </div>
                    </li>
                    <li>
                        <div className="tf_m_acount icon_top_05">
                            <p>PT余额</p>
                            <p>￥{allBalance.ptbalance}</p>
                        </div>
                    </li>
                </ul>
                <div className="tr_m_account_info clear">
                    <div className="tr_m_form left">
                        <div className="tr_m_trade">
                            <Button onClick={()=>this.onTrade()}>
                                <img src={ trade_icon } alt="调换"/>
                            </Button>
                        </div>
                        <ul>
                            <li>
                                <span className="tr_m_f_type">转出账户：</span>
                                <Select size="large" style={{ width: 297 }}
                                        value={this.state.selectOut}
                                        onChange={(value)=>{this.onAccountOutIn(value, 'out')}}
                                >
                                    <Option value={null}>请选择转出账户</Option>
                                    {
                                        outAccout.map((item)=>{
                                            return <Option value={item.id} key={item.id}>{item.name}</Option>
                                        })
                                    }
                                </Select>
                            </li>
                            <li>
                                <span className="tr_m_f_type">转入账户：</span>
                                <Select size="large" style={{ width: 297 }}
                                        value={this.state.selectIn}
                                        onChange={(value)=>{this.onAccountOutIn(value, 'in')}}
                                >
                                    <Option value={null}>请选择转入账户</Option>
                                    {
                                        inAccout.map((item)=>{
                                            return <Option value={item.id} key={item.id}>{item.name}</Option>
                                        })
                                    }
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
