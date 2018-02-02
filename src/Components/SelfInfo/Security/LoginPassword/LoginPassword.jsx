/*修改登录密码*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Input,Button,Modal } from 'antd';
import Fetch from '../../../../Utils';
import { onValidate } from '../../../../CommonJs/common';
import md5 from 'md5';

@observer
export default class LoginPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amendLoading: false,
            amendPostData: {
                flag: 'changepass',// 修改密码的时候传
                changetype: 'loginpass', // sepass:修改资金密码
                oldpass: '',// 原密码 Md5(确认要设置的密码)
                newpass: '',//新密码 Md5(确认要设置的密码)
                confirm_newpass: '',//确认新密码 Md5(确认要设置的密码)
            },
            validate: {
                oldpass: 2, // 0: 对， 1：错
                newpass: 2,
                confirm_newpass: 2,
            },
        };
    };
    componentDidMount() {
        this._ismount = true;
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    /*修改登录密码*/
    onChangeLoginPass() {
        let validate = this.state.validate,
            amendPostData = this.state.amendPostData;
        if(validate.oldpass != 0) {
            validate.oldpass = 1
        }
        if(validate.newpass != 0) {
            validate.newpass = 1
        }
        if(validate.confirm_newpass != 0) {
            validate.confirm_newpass = 1
        }
        this.setState({validate: validate});
        if(validate.oldpass != 0 ||
            validate.newpass != 0 ||
            validate.confirm_newpass != 0){
            return
        }else{
            let postDataFlag = JSON.parse(JSON.stringify(amendPostData));
            postDataFlag.oldpass = md5(postDataFlag.oldpass);
            postDataFlag.newpass = md5(postDataFlag.newpass);
            postDataFlag.confirm_newpass = md5(postDataFlag.confirm_newpass);

            this.setState({amendLoading: true});
            Fetch.resetPwd({
                method: 'POST',
                body: JSON.stringify(postDataFlag)
            }).then((res)=>{
                if(this._ismount) {
                    this.setState({amendLoading: false});
                    if(res.status == 200){
                        let _this = this,
                            amendPostData = this.state.amendPostData;
                        Modal.success({
                            title: res.shortMessage,
                            onOk() {
                                validate.oldpass = 2;
                                validate.newpass = 2;
                                validate.confirm_newpass = 2;
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

    /*旧登录密码*/
    onChangeOldpass(e) {
        let value = e.target.value,
            amendPostData = this.state.amendPostData,
            validate = this.state.validate;
        amendPostData.oldpass = value;
        if(value != ''){
            validate.oldpass = 0
        }else {
            validate.oldpass = 1
        }
        this.setState({
            validate: validate,
            amendPostData: amendPostData,
        });
    };
    /*新登录密码*/
    onChangeNewpass(e) {
        let value = e.target.value,
            amendPostData = this.state.amendPostData,
            validate = this.state.validate;
        amendPostData.newpass = value;
        if (value != '') {
            let reg = /^(?![^a-zA-Z]+$)(?!\D+$).{6,16}$/,
                r = reg.test(value);
            if (r) {
                validate.newpass = 0;
            } else {
                validate.newpass = 1;
            }
        }else{
            validate.newpass = 1;
        }
        this.setState({
            validate: validate,
            amendPostData: amendPostData,
        });
    };
    /*新登录密码确认*/
    onChangeConfirmNewpass(e) {
        let value = e.target.value,
            amendPostData = this.state.amendPostData,
            validate = this.state.validate;
        amendPostData.confirm_newpass = value;
        if(value === amendPostData.newpass){
            validate.confirm_newpass = 0;
        }else{
            validate.confirm_newpass = 1;
        }
        this.setState({
            validate: validate,
            amendPostData: amendPostData,
        });
    };

    render() {
        const amendPostData = this.state.amendPostData;
        return (
            <div  className="sec_k_main clear">
                <ul className="sec_k_list" style={{paddingBottom:226}}>
                    <li >
                        <span className="sec_k_left">输入旧登陆密码：</span>
                        <Input value={amendPostData.oldpass}
                               type="password"
                               onChange={(e)=>this.onChangeOldpass(e)} size="large" placeholder="请输入旧登录密码"
                               className={onValidate('oldpass', this.state.validate)}
                        />
                    </li>
                    <li>
                        <span className="sec_k_left">输入新登陆密码：</span>
                        <Input value={amendPostData.newpass}
                               type="password"
                               onChange={(e)=>this.onChangeNewpass(e)} size="large" placeholder="请输入新登录密码"
                               className={onValidate('newpass', this.state.validate)}
                        />
                    </li>
                    <li>
                        <span className="sec_k_left">确定新登陆密码：</span>
                        <Input value={amendPostData.confirm_newpass}
                               type="password"
                               onChange={(e)=>this.onChangeConfirmNewpass(e)} size="large" placeholder="请输入新登录密码"
                               className={onValidate('confirm_newpass', this.state.validate)}
                        />
                    </li>
                    <li className='s_advice'>
                        <span className="sec_k_left"></span>
                        由字母和数字组成6-16个字符
                    </li>
                    <li className="s_m_primary_btn">
                        <span className="sec_k_left"></span>
                        <Button type="primary" size="large" loading={this.state.amendLoading} onClick={()=>{this.onChangeLoginPass()}}>
                            确认修改
                        </Button>
                    </li>
                </ul>
            </div>
        )
    }
}
