import React, {Component} from 'react';
import {observer} from 'mobx-react';
import 'whatwg-fetch'
import Fetch from '../../../Utils';
import { stateVar } from '../../../State';
import CM_transfer from '../CM_transfer/CM_transfer';
import { Modal } from 'antd';

import './GT.scss';

import btn_start from './Img/btn_start.png';
import gt_bef from './Img/gt_bef_bg.png';
let MONEY_FLAG = true;
@observer
export default class GT extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            thirdAddress:null,
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
                    frompt: "2",
                    targetpt: "s",
                    money: intoMoney,
                    tag:"transfer",
                }
            }else{
                postData = {
                    frompt: 's',
                    targetpt: '2',
                    money: outMoney,
                    tag:"transfer",
                }
            }
            Fetch.gtTransfer({
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
    /*获取第三方网络地址*/
    getThirdAddress(){
        Fetch.gtLogin({
            method: 'POST'
        }).then((data)=>{
            if(data.status == 200){
               this.setState({
                   thirdAddress:data.repsoneContent[0],
               })
            }
        })
    };
    /*新窗口打开游戏界面*/
    start(){
        window.open(this.state.thirdAddress,"_blank");
    }
    /*关闭模态框*/
    hideModal() {
        this.setState({visible: false})
    };
    componentDidMount() {
        this._ismount = true;
        this.getThirdAddress();

    };

    render() {
        return (
            <div className="gt">
                <div className="gt_content">
                    <img className="gt_img"  src={gt_bef}  alt=""/>
                    <ul >
                        <li className="gt_transfer" onClick={()=>this.setState({visible: true})}>
                            <span>转账余额：</span><span>{stateVar.allBalance.kgbalance}元</span>
                        </li>
                        <li className="gt_btn_start">
                            <img  src={btn_start}  alt="" onClick={()=>{this.start()}}/>
                        </li>
                    </ul>
                </div>
                <CM_transfer title="GT娱乐"
                             visible={this.state.visible}
                             hideModal={this.hideModal}
                             onTransfer={this.onTransfer}
                />
            </div>
        )
    }
}
