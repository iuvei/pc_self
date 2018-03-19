/*修改资金密码*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Input,Button,Modal } from 'antd';
import Fetch from '../../../../Utils';
import { stateVar } from '../../../../State';
import { hashHistory } from 'react-router';
import ForgetFundPw from '../ForgetFundPw/ForgetFundPw';
import { onValidate } from '../../../../CommonJs/common';
import md5 from 'md5';

@observer
export default class CapitalPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            setCapitalLoading: false, // 设置资金密码loading
            amendLoading: false, // 修改资金密码
            resetLoading: false, // 重置资金密码
            postData: {
                secpass: '', //Md5(要设置的密码)
                secpass_confirm: '', //Md5(确认要设置的密码)
            },
            validate: {
                secpass: 2, // 0: 对， 1：错
                secpass_confirm: 2,
                old: 2,
            },
            amendPostData: {
                flag: 'changepass',// 修改密码的时候传
                changetype: 'secpass', // secpass:修改资金密码
                oldpass: '',// 原密码 Md5(确认要设置的密码)
                newpass: '',//新密码 Md5(确认要设置的密码)
                confirm_newpass: '',//确认新密码 Md5(确认要设置的密码)
            },
        };
    };
    componentDidMount() {
        this._ismount = true;
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    /*确认设置*/
    onSetCapitalPw() {
        let validate = this.state.validate,
            postData = this.state.postData;
        if(validate.secpass === 0 &&
            validate.secpass_confirm === 0) {
            this.setState({setCapitalLoading: true});
            Fetch.setsecurity({
                method: 'POST',
                body: JSON.stringify({secpass: md5(postData.secpass), secpass_confirm: md5(postData.secpass_confirm)})
            }).then((res) => {
                if(this._ismount){
                    this.setState({setCapitalLoading: false});
                    let _this = this;
                    if(res.status == 200){
                        Modal.success({
                            title: res.repsoneContent,
                            content: '资金密码需重新登录才能生效，马上重新登录 ?',
                            onOk() {
                                validate.secpass = 2;
                                validate.secpass_confirm = 2;
                                postData.secpass = '';
                                postData.secpass_confirm = '';
                                _this.setState({
                                    validate: validate,
                                    postData,
                                },()=>stateVar.userInfo.setsecurity = 'no');
                                hashHistory.push('/login');
                            },
                        });
                    }else{
                        Modal.warning({
                            title: res.shortMessage,
                        });
                    }
                }
            })
        }
    };
    /*设置资金密码*/
    onChangeSecpass(e){
        let value = e.target.value,
            postData = this.state.postData,
            validate = this.state.validate;
        postData.secpass = value;
        if (value != '') {
            let reg = /^(?![^a-zA-Z]+$)(?!\D+$).{6,16}$/,
                r = reg.test(value);
            if (r) {
                validate.secpass = 0;
            } else {
                validate.secpass = 1;
            }
        }else{
            validate.secpass = 1;
        }
        this.setState({
            validate: validate,
            postData: postData,
        });
    };
    /*确认设置资金密码*/
    onChangeSecpassConfirm(e){
        let value = e.target.value,
            postData = this.state.postData,
            validate = this.state.validate;
        postData.secpass_confirm = value;
        if(postData.secpass !== value) {
            validate.secpass_confirm = 1;
        }else {
            validate.secpass_confirm = 0;
        }
        this.setState({
            validate: validate,
            postData: postData,
        });
    };
    /*修改资金密码*/
    onChangeCapitaPass() {
        let validate = this.state.validate,
            amendPostData = this.state.amendPostData;
        if(validate.secpass != 0) {
            validate.secpass = 1
        }
        if(validate.old != 0) {
            validate.old = 1
        }
        if(validate.secpass_confirm != 0) {
            validate.secpass_confirm = 1
        }
        this.setState({validate: validate});
        if(validate.secpass != 0 ||
            validate.old != 0 ||
            validate.secpass_confirm != 0){
            return
        }else{
            amendPostData.oldpass = md5(amendPostData.oldpass);
            amendPostData.newpass = md5(amendPostData.newpass);
            amendPostData.confirm_newpass = md5(amendPostData.confirm_newpass);

            this.setState({amendLoading: true});
            Fetch.resetPwd({
                method: 'POST',
                body: JSON.stringify(amendPostData)
            }).then((res)=>{
                if(this._ismount){
                    this.setState({amendLoading: false});
                    if(res.status == 200){
                        let _this = this,
                            amendPostData = this.state.amendPostData;
                        Modal.success({
                            title: res.longMessage,
                            onOk() {
                                validate.secpass = 2;
                                validate.old = 2;
                                validate.secpass_confirm = 2;
                                amendPostData.oldpass = null;
                                amendPostData.newpass = null;
                                amendPostData.confirm_newpass = null;
                                _this.setState({
                                    validate: validate,
                                    amendPostData: amendPostData,
                                });
                            },
                        });
                    }else{
                        Modal.warning({
                            title: res.shortMessage,
                        });
                    }
                }
            })
        }
    };
    /*旧资金密码*/
    onChangeOldpass(e) {
        let value = e.target.value,
            amendPostData = this.state.amendPostData,
            validate = this.state.validate;
        amendPostData.oldpass = value;
        if(value != ''){
            validate.old = 0
        }else {
            validate.old = 1
        }
        this.setState({
            validate: validate,
            amendPostData: amendPostData,
        });
    };
    /*新资金密码*/
    onChangeNewpass(e) {
        let value = e.target.value,
            amendPostData = this.state.amendPostData,
            validate = this.state.validate;
        amendPostData.newpass = value;
        if (value != '') {
            let reg = /^(?![^a-zA-Z]+$)(?!\D+$).{6,16}$/,
                r = reg.test(value);
            if (r) {
                validate.secpass = 0;
            } else {
                validate.secpass = 1;
            }
        }else{
            validate.secpass = 1;
        }
        this.setState({
            validate: validate,
            amendPostData: amendPostData,
        });
    };
    /*确定新资金密码*/
    onChangeConfirmNewpass(e) {
        let value = e.target.value,
            amendPostData = this.state.amendPostData,
            validate = this.state.validate;
        amendPostData.confirm_newpass = value;
        if(amendPostData.newpass !== value) {
            validate.secpass_confirm = 1;
        }else {
            validate.secpass_confirm = 0;
        }
        this.setState({
            validate: validate,
            amendPostData: amendPostData,
        });
    };

    /*子组件调用关闭模态框*/
    onHideModal() {
        this.setState({visible: false})
    }
    /*enter键提交*/
    onSubmit(e){
        if(e.keyCode == 13){
            if(stateVar.userInfo.setsecurity == 'yes'){
                this.onSetCapitalPw()
            }else{
                this.onChangeCapitaPass()
            }
        }
    }
    /*设置密保*/
    onClickCapital(){
        stateVar.securityIndex = 3;
    };
    render() {
        const postData = this.state.postData;
        const amendPostData = this.state.amendPostData;
        const userInfo = stateVar.userInfo;

        return (
            <div  className="sec_k_main clear" onKeyDown={(e)=>this.onSubmit(e)}>
                {
                    userInfo.setsecurity == 'yes' ?
                        <ul className="sec_k_list">
                            <li>
                                <span className="sec_k_left">设置资金密码：</span>
                                <Input
                                    value={postData.secpass}
                                    type="password"
                                    onChange={(e)=>this.onChangeSecpass(e)} size="large" placeholder="请输入资金密码"
                                    className={onValidate('secpass', this.state.validate)}
                                />
                            </li>
                            <li>
                                <span className="sec_k_left">确认资金密码：</span>
                                <Input
                                    value={postData.secpass_confirm}
                                       type="password"
                                       onChange={(e)=>this.onChangeSecpassConfirm(e)} size="large" placeholder="确认资金密码"
                                       className={onValidate('secpass_confirm', this.state.validate)}
                                />
                            </li>
                            <li className='s_advice' style={{textAlign: 'center'}}>
                                由字母和数字组成6-16个字符,资金密码不能与登录密码相同
                            </li>
                            <li>
                                <span className="sec_k_left"></span>
                                <Button type="primary" size="large" loading={this.state.setCapitalLoading} onClick={()=>{this.onSetCapitalPw()}}>
                                    确认
                                </Button>
                            </li>
                            <li>
                                <p>备注：</p>
                                <p>1、请妥善保管好您的资金密码，如遗忘请使用密保功能找回或联系在线客服处理</p>
                                <p className="w_m_nopassword">
                                    2、通过
                                    <span onClick={()=>this.onClickCapital()}>设定密保问题</span>
                                    可以用来找回资金密码
                                </p>
                            </li>
                        </ul> :
                        <ul className="sec_k_list">
                            <li>
                                <span className="sec_k_left">输入旧资金密码：</span>
                                <Input
                                    // value={amendPostData.oldpass}
                                       type="password"
                                       onChange={(e)=>this.onChangeOldpass(e)} size="large" placeholder="请输入旧资金密码"
                                       className={onValidate('old', this.state.validate)}
                                />
                                <a className='forget_m_pwd'  onClick={()=>this.setState({visible: true})}>忘记资金密码？</a>
                            </li>
                            <li>
                                <span className="sec_k_left">输入新资金密码：</span>
                                <Input
                                    // value={amendPostData.newpass}
                                       type="password"
                                       onChange={(e)=>this.onChangeNewpass(e)} size="large" placeholder="请输入新资金密码"
                                       className={onValidate('secpass', this.state.validate)}
                                />
                            </li>
                            <li>
                                <span className="sec_k_left">确定新资金密码：</span>
                                <Input
                                    // value={amendPostData.confirm_newpass}
                                       type="password"
                                       onChange={(e)=>this.onChangeConfirmNewpass(e)} size="large" placeholder="请输入确定新资金密码"
                                       className={onValidate('secpass_confirm', this.state.validate)}
                                />
                            </li>
                            <li className='s_advice' style={{color:'#85888D', textAlign: 'center'}}>
                                由字母和数字组成6-16个字符,资金密码不能与登录密码相同
                            </li>
                            <li className="s_m_primary_btn">
                                <span className="sec_k_left"></span>
                                <Button type="primary" size="large" loading={this.state.amendLoading} onClick={()=>{this.onChangeCapitaPass()}}>
                                    确认修改
                                </Button>
                            </li>
                        </ul>
                }
                <ForgetFundPw visible={this.state.visible}
                              onHideModal={this.onHideModal.bind(this)}
                />
            </div>
        )
    }
}
