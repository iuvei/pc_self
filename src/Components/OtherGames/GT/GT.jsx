import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../../Utils';
import { stateVar } from '../../../State';
import CM_transfer from '../CM_transfer/CM_transfer';
import { Modal  } from 'antd';
import emitter from '../../../Utils/events';

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
            spinLoading: false,
        };
        this.hideModal = this.hideModal.bind(this);
        this.onTransfer = this.onTransfer.bind(this);
    };
    componentDidMount() {
        this._ismount = true;
        this.getThirdAddress();
    }
    componentWillUnmount() {
        this._ismount = false;
    };
    /*转账*/
    onTransfer(type, intoMoney, outMoney) {
        this.setState({spinLoading: true});
        if(MONEY_FLAG){
            MONEY_FLAG = false;
            let postData = {};
            if(type == 'into') {
                postData = {
                    frompt: "s",
                    targetpt: "2",
                    money: intoMoney,
                    tag:"transfer",
                }
            }else{
                postData = {
                    frompt: '2',
                    targetpt: 's',
                    money: outMoney,
                    tag:"transfer",
                }
            }
            Fetch.gtTransfer({
                method: 'POST',
                body: JSON.stringify(postData),
            }).then((res)=>{
                MONEY_FLAG = true;
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
                             spinLoading = {this.state.spinLoading}
                             hideModal={this.hideModal}
                             onTransfer={this.onTransfer}
                />
            </div>
        )
    }
}
