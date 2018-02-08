/*第三方转账*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Modal, InputNumber, Spin} from 'antd';

import './CM_transfer.scss';
import close from './Img/close.png';
import into_btn from './Img/into_btn.png';
import out_btn from './Img/out_btn.png';

@observer
export default class CM_transfer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validate: {
                into: 2, // 0: 对， 1：错
                out: 2,
            },
            intoMoney: '', //转入金额
            outMoney: '', //转出金额
        };
    };

    /*关闭转账模态框*/
    onCloseTranfer() {
        this.props.hideModal();
        let validate = {
            into: 2,
            out: 2,
        };
        this.setState({
            validate: validate,
            intoMoney: '',
            outMoney: '',
        })
    };
    /*验证显示不同class*/
    onValidate(val) {
        let classNames,
            validate = this.state.validate;
        if(validate[val] == 0) {
            classNames = 'correct_transparent'
        } else if(validate[val] == 1) {
            classNames = 'wrong_transparent'
        } else {
            classNames = ''
        }
        return classNames
    };
    /*转入资金*/
    onIntoMoney(val){
        let validate = this.state.validate;
        if(val == ''){
            validate.into = 1
        }else if(val == undefined){
            validate.into = 2
        }else{
            validate.into = 0
        }
        this.setState({
            validate: validate,
            intoMoney: val,
        })
    };
    /*转出资金*/
    onOutMoney(val){
        let validate = this.state.validate;
        if(val == ''){
            validate.out = 1
        }else if(val == undefined){
            validate.out = 2
        }else{
            validate.out = 0
        }
        this.setState({
            validate: validate,
            outMoney: val,
        })
    };
    /*转账*/
    onTransfer(type) {
        let validate = this.state.validate,
            intoMoney = this.state.intoMoney,
            outMoney = this.state.outMoney;
        if(type == 'into') {
            if(intoMoney == '' || intoMoney == undefined){
                validate.into = 1;
            }
            this.setState({validate: validate});
            if(validate.into == 0) {
                this.props.onTransfer(type, intoMoney, outMoney)
            }
        }else{
            if(outMoney == '' || outMoney == undefined){
                validate.out = 1;
            }
            this.setState({validate: validate});
            if(validate.out == 0){
                this.props.onTransfer(type, intoMoney, outMoney)
            }
        }
    };

    render() {
        return (
            <Modal
                visible={this.props.visible}
                maskClosable={false}
                closable={false}
                footer={null}
                width={479}
                className="og_transferModal"
            >
                <Spin spinning={this.props.spinLoading} tip="正在充值，请稍后...">
                <img className="og_transfer_close right" onClick={()=>this.onCloseTranfer()} src={close} alt="关闭"/>
                <p className="og_title">{this.props.title}游戏转账</p>

                <ul className="og_transfer_money">
                    <li>
                        <span>转入金额：</span>
                        <InputNumber value={this.state.intoMoney} min={0} size="large"
                                     onChange={(value)=>this.onIntoMoney(value)}
                                     className={this.onValidate('into')}
                        />
                        <em>至{this.props.title}游戏账户</em>
                    </li>
                    <li>
                        <span>转出金额：</span>
                        <InputNumber value={this.state.outMoney} min={0} size="large"
                                     onChange={(value)=>this.onOutMoney(value)}
                                     className={this.onValidate('out')}
                        />
                        <em>至彩票账户</em>
                    </li>
                </ul>
                <p className="hint_text">转账金额至少10元以上</p>
                <p className="transferPw_btn">
                    <img src={into_btn} onClick={()=>this.onTransfer('into')} alt="转入"/>
                    <img src={out_btn} onClick={()=>this.onTransfer('out')} alt="转出"/>
                </p>
                </Spin>

            </Modal>
        )
    }
}
