/*转账*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../../Utils';
import { Select, InputNumber, Modal, Button, message } from 'antd';
const Option = Select.Option;
import { stateVar } from '../../../State';
import { onValidate } from '../../../CommonJs/common';
import emitter from '../../../Utils/events';

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
          money: '', //转账金额
          validate: {
              money: 2, // 0: 对， 1：错
          }
      }
    };
    componentDidMount() {
        this._ismount = true;
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    /*选择 转出转入 账户*/
    onAccountOutIn(value, type) {
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
    };

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
        let validate = this.state.validate;
        let reg = /^[0-9]*$/;
        let r = reg.test(value);
        if(!r || value < 10){
            validate.money = 1;
        }else{
            validate.money = 0;
        }
        this.setState({validate, money: value});
    };
    /*体育转账*/
    transferSport(postData){
        Fetch.sport({
            method: 'POST',
            body: JSON.stringify(postData),
        }).then((res)=>{
            if(this._ismount) {
                this.setState({confirmTransferLoading: false});
                if(res.status == 200){
                    Modal.success({
                        title: res.shortMessage,
                    });
                    this.onEmitter();
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*EA转账*/
    transferEagame(postData){
        Fetch.eagame({
            method: 'POST',
            body: JSON.stringify(postData),
        }).then((res)=>{
            if(this._ismount){
                this.setState({confirmTransferLoading: false});
                if(res.status == 200){
                    Modal.success({
                        title: res.shortMessage,
                    });
                    this.onEmitter();
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*PT转账*/
    transferPttranfer(postData){
        Fetch.pttranfer({
            method: 'POST',
            body: JSON.stringify(postData),
        }).then((res)=>{
            if(this._ismount){
                this.setState({confirmTransferLoading: false});
                if(res.status == 200){
                    Modal.success({
                        title: res.shortMessage,
                    });
                    this.onEmitter();
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*博饼转账*/
    transferBobing(postData){
        Fetch.bobingtransfer({
            method: 'POST',
            body: JSON.stringify(postData),
        }).then((res)=>{
            if(this._ismount){
                this.setState({confirmTransferLoading: false});
                if(res.status == 1003){
                    Modal.warning({
                        title: res.data,
                    });
                }else{
                    if(res.status == 200){
                        Modal.success({
                            title: res.shortMessage,
                        });
                        this.onEmitter();
                    }else{
                        Modal.warning({
                            title: res.shortMessage,
                        });
                    }
                }
            }
        })
    };

    onEmitter(){
        emitter.emit('changeMoney');
        let { validate } = this.state;
        validate.money = 2;
        this.setState({
            validate,
            money: ''
        })
    };
    // 确认转账
    onConfirmTransfer() {
        let { selectOut, selectIn } = this.state,
            postData = {};
        if(selectOut == null){
            message.warning('请先选择转出账户！');
            return
        }
        if(selectIn == null){
            message.warning('请先选择转入账户！');
            return
        }
        if(this.state.validate.money != 0){
            let validate = this.state.validate;
            validate.money = 1;
            this.setState({validate});
            return
        }
        this.setState({ confirmTransferLoading: true });
        if(selectOut == 0){//0：彩票账户转入第三方，其他第三方转入彩票账户
            if(selectIn == 1){ // 转入体育账户
                postData = {
                    tran_from: "s",
                    tran_to: "1",
                    money: this.state.money,
                    doFunToPe:"ok",
                };
                this.transferSport(postData);
            }else if(selectIn == 2){ // 转入EA账户
                postData = {
                    tran_from: 's',
                    tran_to: 2,
                    money: this.state.money,
                    doFunToEa: 'ok'
                };
                this.transferEagame(postData);
            }else if(selectIn == 3){ //转入pt账户
                postData = {
                    targetpt: 2,
                    frompt: 's',
                    money: this.state.money,
                    tag: 'transfer',
                };
                this.transferPttranfer(postData);
            }else if(selectIn == 4) {
                postData = {
                    from: 'ssc',
                    target: 'bb',
                    money: this.state.money,
                    tag: 'transfer'
                };
                this.transferBobing(postData);
            }else{

            }
        }else if(selectOut == 1){
            postData = {
                tran_from: '1',
                tran_to: 's',
                money: this.state.money,
                doFunToPe:"ok",
            };
            this.transferSport(postData);
        }else if(selectOut == 2){
            postData = {
                tran_from: 2,
                tran_to: 's',
                money: this.state.money,
                doFunToEa: 'ok'
            };
            this.transferEagame(postData);
        }else if(selectOut == 3){
            postData = {
                targetpt: 's',
                frompt: 2,
                money: this.state.money,
                tag: 'transfer',
            };
            this.transferPttranfer(postData);
        }else if(selectOut == 4){
            postData = {
                from: 'bb',
                target: 'ssc',
                money: this.state.money,
                tag: 'transfer'
            };
            this.transferBobing(postData);
        }else{ }

    };
    /*enter键提交*/
    onSubmit(e){
        if(e.keyCode == 13){
            this.onConfirmTransfer()
        }
    };
    render() {
        const allBalance = stateVar.allBalance;
        const { outAccout, inAccout, money } = this.state;

        return (
            <div className="transfer_main" onKeyDown={(e)=>this.onSubmit(e)}>
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
                                <InputNumber min={0}
                                             value={money}
                                             formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                             parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                             onChange={(value)=>{this.onTransferAmount(value)}}
                                             className={onValidate('money', this.state.validate)}
                                /> 元
                                <p className="tr_m_f_text">转账金额至少10元以上</p>

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
