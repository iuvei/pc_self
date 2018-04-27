import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Button, Modal, Input } from 'antd';
import emitter from '../../../Utils/events';
import Fetch from '../../../Utils';
import {stateVar} from '../../../State';
import { onValidate } from '../../../CommonJs/common';
import CM_transfer from '../CM_transfer/CM_transfer';
import './Sport.scss';

@observer
export default class Sport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            spinLoading: false,
            btnLoading: false,
            selfVisible: false,
            eaPostData: {
                userName: '',
                email: '',
                phone: '',
                navname: '', // 真人娱乐, 体彩中心
            },
            validate: {
                userName: 2,// 0: 对， 1：错
                email: 2,
                phone: 2,
            }
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
    getThirdAddress() {
        let tempwindow
        if (!stateVar.isApp) {
            tempwindow = window.open();
        }
        Fetch.sport({
            method: "POST",
            body: JSON.stringify({"do": "login"}),
        }).then((res) => {
            if (this._ismount) {
                this.setState({btnLoading: false});
                if (res.status == 200) {
                    if (stateVar.isApp) {
                        // 客户端
                        window.open(res.repsoneContent[0])
                    } else {
                        // web
                        tempwindow.location.href = res.repsoneContent[0]
                    }
                } else {
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
        if (type == 'into') {
            postData = {
                tran_from: "s",
                tran_to: "1",
                money: intoMoney,
                doFunToPe: "ok",
            }
        } else {
            postData = {
                tran_from: '1',
                tran_to: 's',
                money: outMoney,
                doFunToPe: "ok",
            }
        }
        Fetch.sport({
            method: 'POST',
            body: JSON.stringify(postData),
        }).then((res) => {
            if (this._ismount) {
                this.setState({spinLoading: false});
                if (res.status == 200) {
                    Modal.success({
                        title: res.shortMessage,
                    });
                    this.setState({visible: false});
                    emitter.emit('changeMoney', 'sport');
                } else {
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
    /*是否有权限进入体育竞技*/
    onSport(){
        this.setState({btnLoading: true});
        Fetch.sport({
            method: 'POST',
            body: JSON.stringify({"do":"login"})
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200){
                    this.getThirdAddress()
                }else{
                    this.setState({btnLoading: false});
                    let {eaPostData} = this.state;
                    eaPostData.navname = '体彩中心';
                    if(res.shortMessage == '请填个人写资料'){
                        this.setState({
                            selfVisible: true,
                            eaPostData
                        })
                    }else{
                        Modal.warning({
                            title: res.shortMessage,
                        });
                    }
                }
            }
        })
    };
    getAddUserInfo() {
        let {validate} = this.state,
            _this = this;
        if(validate.userName != 0 || validate.email != 0 || validate.phone != 0){
            if(validate.userName != 0){
                validate.userName = 1
            }
            if(validate.email != 0){
                validate.email = 1
            }
            if(validate.phone != 0){
                validate.phone = 1
            }
            this.setState({validate});
            return
        }

        this.setState({btnLoading: true});
        Fetch.addUserInfo({
            method: 'POST',
            body: JSON.stringify(this.state.eaPostData)
        }).then((res)=> {
            if (this._ismount) {
                this.setState({btnLoading: false});
                if(res.status == 200){
                    Modal.success({
                        title: res.shortMessage,
                        okText: "进入游戏",
                        onOk() {
                            _this.onSport()
                        },
                    });
                    this.onCancel();
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    onChangeUserName(e){
        let {eaPostData, validate} = this.state,
            val = e.target.value;
        eaPostData.userName = val;
        let reg = /^[\u4e00-\u9fa5]+$/,
            r = reg.test(val);
        if(!r){
            validate.userName = 1
        }else{
            validate.userName = 0
        }
        this.setState({eaPostData});
    };
    onChangeEmail(e){
        let {eaPostData, validate} = this.state,
            val = e.target.value;
        eaPostData.email = val;
        let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        let r = reg.test(val);
        if (r) {
            validate.email = 0;
        } else {
            validate.email = 1;
        }
        this.setState({eaPostData});
    };
    onChangePhone(e){
        let {eaPostData, validate} = this.state,
            val = e.target.value;
        eaPostData.phone = val;
        let reg = /^[0-9]{7,13}$/;
        let r = reg.test(val);
        if (r) {
            validate.phone = 0;
        } else {
            validate.phone = 1;
        }
        this.setState({eaPostData});
    };
    onCancel(){
        let {eaPostData, validate} = this.state;
        eaPostData.userName = '';
        eaPostData.phone = '';
        eaPostData.email = '';
        validate.userName = 2;
        validate.phone = 2;
        validate.email = 2;
        this.setState({
            selfVisible: false,
            eaPostData,
            validate
        });
    };

    render() {
        const {selfVisible, eaPostData} = this.state;
        return (
            <div className="sport">
                <div className="sport_content">
                    <p className='sport_remain'>账户余额：{stateVar.allBalance.sbbalance}元</p>
                    <div>
                        <Button className='sport_transfer' size="large"
                                onClick={() => this.setState({visible: true})}>转账</Button>
                        <Button type="primary" size="large" loading={this.state.btnLoading}
                                onClick={() => this.onSport()}>开始游戏</Button>
                    </div>

                </div>
                <CM_transfer title="体育竞技"
                             visible={this.state.visible}
                             spinLoading={this.state.spinLoading}
                             hideModal={this.hideModal}
                             onTransfer={this.onTransfer}
                />
                <Modal
                    title="完善个人资料"
                    width={480}
                    wrapClassName="vertical-center-modal ea_content"
                    visible={selfVisible}
                    onCancel={()=>this.onCancel()}
                    footer={null}
                    maskClosable={false}
                >
                    <ul className="info_list">
                        <li>
                            <span>会员姓名：</span>
                            <Input placeholder="请输入会员姓名"
                                   value={eaPostData.userName}
                                   onChange={(e)=>this.onChangeUserName(e)}
                                   size="large"
                                   className={onValidate('userName', this.state.validate)}
                            />
                            <p>（由汉字组成，例如：张三）</p>
                        </li>
                        <li>
                            <span>邮件地址：</span>
                            <Input placeholder="请输入您的邮箱"
                                   value={eaPostData.email}
                                   onChange={(e)=>this.onChangeEmail(e)}
                                   size="large"
                                   className={onValidate('email', this.state.validate)}
                            />
                            <p>（例如：example@example.com）</p>
                        </li>
                        <li>
                            <span>联系电话：</span>
                            <Input placeholder="请输入您的电话"
                                   value={eaPostData.phone}
                                   onChange={(e)=>this.onChangePhone(e)}
                                   size="large"
                                   className={onValidate('phone', this.state.validate)}
                            />
                            <p>（7-13位数字，例如：8613800000000）</p>
                        </li>
                    </ul>
                    <div className="btn">
                        <Button type="primary"
                                onClick={()=>this.getAddUserInfo()}
                                loading={this.state.btnLoading}
                        >
                            提交
                        </Button>
                    </div>
                </Modal>
            </div>
        )
    }
}
