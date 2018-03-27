import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Button} from 'antd';
import emitter from '../../../Utils/events';
import Fetch from '../../../Utils';
import { stateVar } from '../../../State';
import CM_transfer from '../CM_transfer/CM_transfer';
import './Sport.scss';
import { Modal  } from 'antd';

@observer
export default class Sport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            spinLoading: false,
            btnLoading: false,
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
    /*获取第三方网址*/
    getThirdAddress(){
        this.setState({btnLoading: true});
        let tempwindow = window.open();
        Fetch.sport({
            method: "POST",
            body: JSON.stringify({"do":"login"}),
        }).then((res)=> {
            if(this._ismount){
                this.setState({btnLoading: false});
                if(res.status == 200) {
                    tempwindow.location.href = res.repsoneContent[0]
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    }
    /*转账*/
    onTransfer(type, intoMoney, outMoney) {
        this.setState({spinLoading: true});
        let postData = {};
        if(type == 'into') {
            postData = {
                tran_from: "s",
                tran_to: "1",
                money: intoMoney,
                doFunToPe:"ok",
            }
        }else{
            postData = {
                tran_from: '1',
                tran_to: 's',
                money: outMoney,
                doFunToPe:"ok",
            }
        }
        Fetch.sport({
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

    render() {
        return (
            <div className="sport">
                <div className="sport_content">
                    <p className='sport_remain'>账户余额：{stateVar.allBalance.sbbalance}元</p>
                    <div>
                        <Button className='sport_transfer' size="large" onClick={()=>this.setState({visible: true})}>转账</Button>
                        <Button type="primary" size="large" loading={this.state.btnLoading} onClick={()=>this.getThirdAddress()}>开始游戏</Button>
                    </div>

                </div>
                <CM_transfer title="体育竞技"
                             visible={this.state.visible}
                             spinLoading = {this.state.spinLoading}
                             hideModal={this.hideModal}
                             onTransfer={this.onTransfer}
                />
            </div>
        )
    }
}
