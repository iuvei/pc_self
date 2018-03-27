import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../../Utils';
import emitter from '../../../Utils/events';
import { Modal } from 'antd';
import { stateVar } from '../../../State';
import CM_transfer from '../CM_transfer/CM_transfer';

import './EA.scss';

import ea from './Img/ea.png';

let LOGIN_FLAG = true;
@observer
export default class EA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinLoading: false,
            loginFlag: true,
            visible: false, //模态框默认关闭
        };
        this.hideModal = this.hideModal.bind(this);
        this.onTransfer = this.onTransfer.bind(this);
    };
    componentDidMount() {
        this._ismount = true;
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    /*转账*/
    onTransfer(type, intoMoney, outMoney) {
        this.setState({spinLoading: true});
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
                if(this._ismount){
                    this.setState({spinLoading: false});
                    if(res.status == 200){
                        Modal.success({
                            title: res.shortMessage,
                        });
                        this.setState({visible: false});
                        emitter.emit('changeMoney');
                    }else{
                        Modal.warning({
                            title: res.shortMessage,
                        });
                    }
                }
            })

    };
    /*关闭模态框*/
    hideModal() {
        this.setState({visible: false})
    };

    /*开始游戏*/
    onLogin() {
        if(LOGIN_FLAG){
            LOGIN_FLAG = false;
            let tempwindow = window.open();
            Fetch.eagame({
                method: 'POST',
                body: JSON.stringify({do: 'login'})
            }).then((res)=>{
                LOGIN_FLAG = true;
                if(this._ismount && res.status == 200){
                    tempwindow.location.href = res.repsoneContent[0];
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
                             spinLoading = {this.state.spinLoading}
                             hideModal={this.hideModal}
                             onTransfer={this.onTransfer}
                />
            </div>
        )
    }
}
