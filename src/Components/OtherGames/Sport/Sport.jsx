import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Button} from 'antd';
import 'whatwg-fetch'
import Fetch from '../../../Utils';
import { stateVar } from '../../../State';
import CM_transfer from '../CM_transfer/CM_transfer';
import './Sport.scss';

import sport_top from './Img/sport_top.png';
let MONEY_FLAG = true;
@observer
export default class Sport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            thirdAddress:null,
        };
        this.hideModal = this.hideModal.bind(this);
        this.onTransfer = this.onTransfer.bind(this);
    };



    /*获取第三方网址*/
    getThirdAddress(){
        Fetch.sport({
            method: "POST"
        }).then((data)=> {
            console.log("login",data);
            if(data.status==200){
                this.setState({
                    thirdAddress:data.repsoneContent,
                })

            }
            console.log("thirdAddress",this.state.thirdAddress);

        })
    }
    /*转账*/
    onTransfer(type, intoMoney, outMoney) {
        if(MONEY_FLAG){
            MONEY_FLAG = false;
            let postData = {};
            if(type == 'into') {
                postData = {
                    tran_from: "1",
                    tran_to: "s",
                    money: intoMoney,
                    doFunToPe:"ok",
                }
            }else{
                postData = {
                    tran_from: 's',
                    tran_to: '1',
                    money: outMoney,
                    doFunToPe:"ok",
                }
            }
            Fetch.sport({
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
    componentDidMount() {
        this.getThirdAddress();

    };

    render() {

        return (
            <div className="sport">
                <div className="sport_content">
                    <p className='sport_remain'>账户余额：{stateVar.allBalance.sbbalance}元</p>
                    <Button className='sport_transfer' onClick={()=>this.setState({visible: true})}>转账</Button>
                </div>
                <iframe className="s_iframe" src={this.state.thirdAddress} >
                </iframe>
                <CM_transfer title="体育竞技"
                             visible={this.state.visible}
                             hideModal={this.hideModal}
                             onTransfer={this.onTransfer}
                />
            </div>
        )
    }
}
