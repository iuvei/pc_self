import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../../Utils';
import { Modal } from 'antd';
import { stateVar } from '../../../State';
import CM_transfer from '../CM_transfer/CM_transfer';

import './EA.scss';

import ea from './Img/ea.png';

let LOGIN_FLAG = true;
let MONEY_FLAG = true;
@observer
export default class EA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginFlag: true,
            visible: false, //模态框默认关闭
        };
        this.hideModal = this.hideModal.bind(this);
        this.onTransfer = this.onTransfer.bind(this);
    };
    /*转账*/
    onTransfer(type, intoMoney, outMoney) {
        if(MONEY_FLAG){
            MONEY_FLAG = false;
            let postData = {};
            if(type == 'into') {
                postData = {
                    tran_from: 's',
                    tran_to: 2,
                    money: intoMoney,
                    doFunToEa: 'ok'
                }
            }else{
                postData = {
                    tran_from: 2,
                    tran_to: 's',
                    money: outMoney,
                    doFunToEa: 'ok'
                }
            }
            Fetch.eagame({
                method: 'POST',
                body: JSON.stringify(postData),
            }).then((res)=>{
                MONEY_FLAG = true;
                if(res.status == 200){
                    Modal.success({
                        title: res.shortMessage,
                    });
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            })
        }

    };
    /*关闭模态框*/
    hideModal() {
        this.setState({visible: false})
    };

    /*开始游戏*/
    onLogin() {
        if(LOGIN_FLAG){
            LOGIN_FLAG = false;
            Fetch.eagame({
                method: 'POST',
                body: JSON.stringify({do: 'login'})
            }).then((res)=>{
                LOGIN_FLAG = true;
                if(res.status == 200){
                    let data = res.repsoneContent;
                    window.open (data[0]);
                }
            })
        }
    };

    render() {
        return (
            <div className="ea">
                <div className="ea_content">
                    <img className="ea_img" src={ea} alt=""/>
                    <i className="ea_transfer" onClick={()=>this.setState({visible: true})}></i>
                    <p className="ea_balance">账号余额：{stateVar.allBalance.eabalance}元</p>
                    <i className="ea_start" onClick={()=>this.onLogin()}></i>
                </div>
                <CM_transfer title="EA"
                             visible={this.state.visible}
                             hideModal={this.hideModal}
                             onTransfer={this.onTransfer}
                />
            </div>
        )
    }
}
