/*博饼*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Button, Modal } from 'antd';
import Fetch from '../../../Utils';
import { stateVar } from '../../../State';
import { getStore } from "../../../CommonJs/common";
import emitter from '../../../Utils/events';
import CM_transfer from '../CM_transfer/CM_transfer';

import bobing_01 from './Img/bobing_01.png'
import './Bobing.scss'

@observer
export default class Bobing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false, //模态框默认关闭
            spinLoading: false,
            modalVisible: false, // 开始游戏模态框
            bonusPool: 0, // 奖金池
        };
        this.hideModal = this.hideModal.bind(this);
        this.onTransfer = this.onTransfer.bind(this);
    };
    componentDidMount() {
        this._ismount = true;
        this.onGetprizepool();
    }
    componentWillUnmount() {
        this._ismount = false;
    };
    /*转账*/
    onTransfer(type, intoMoney, outMoney) {
        this.setState({spinLoading: true});
            let postData = {};
            if(type == 'into') {
                postData = {
                    from: 'ssc',
                    target: 'bb',
                    money: intoMoney,
                    tag: 'transfer'
                }
            }else{
                postData = {
                    from: 'bb',
                    target: 'ssc',
                    money: outMoney,
                    tag: 'transfer'
                }
            }
            Fetch.bobingtransfer({
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
    /*奖金池*/
    onGetprizepool() {
        Fetch.newGetprizepool({
            method: 'POST',
        }).then((res)=>{
            if(this._ismount && res.status == 200) {
                this.setState({bonusPool: res.repsoneContent.data.bonus})
            }
        })
    };


    render() {
        return (
            <div className="bo_bing">
                <div className="b_b_content">
                    <img src={bobing_01} alt=""/>
                    <p className="b_b_bonus_pool">￥{this.state.bonusPool}</p>
                    <i className="bobing_btn" onClick={()=>this.setState({modalVisible: true})}></i>
                    <p className="account_money">账号金额：{stateVar.allBalance.bobingBalance}元</p>
                    <Button className="transfer_btn" type="primary" onClick={()=>this.setState({visible: true})}>转账</Button>
                </div>
                <CM_transfer title="博饼"
                             visible={this.state.visible}
                             spinLoading = {this.state.spinLoading}
                             hideModal={this.hideModal}
                             onTransfer={this.onTransfer}
                />
                <Modal visible={this.state.modalVisible}
                        closable={false}
                        footer={null}
                        width={807}
                        className="bobing_modal"
                >
                    <Button className="modal_close" onClick={()=>this.setState({modalVisible: false})} type="primary" icon="close"></Button>
                    <iframe scrolling="no"
                            id="main" name="main"
                            // allowtransparency={true}
                            src={stateVar.httpUrl + '?controller=bobing&action=play&absecs=True&sess=' + getStore('session')}
                            className="bobing_iframe"
                    >

                    </iframe>
                </Modal>
            </div>
        )
    }
}
