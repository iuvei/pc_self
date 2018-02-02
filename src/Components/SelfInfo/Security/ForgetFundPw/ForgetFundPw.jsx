/*忘记资金密码*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { hashHistory } from 'react-router';
import { Input,Button,Modal } from 'antd';
import { stateVar } from '../../../../State';
import Fetch from '../../../../Utils';
import md5 from 'md5';
const issueFlag = [
    {
        text: '您小学班主任的名字是？',
        id: 10,
    },{
        text: '对您影响最大的人名字是？',
        id: 18,
    },{
        text: '您母亲的姓名是？',
        id: 4,
    },{
        text: '您配偶的生日是？',
        id: 8,
    },{
        text: '您的学号（或工号）是？',
        id: 13,
    },{
        text: '您母亲的生日是？',
        id: 5,
    },{
        text: '您高中班主任的名字是？',
        id: 12,
    },{
        text: '您父亲的姓名是？',
        id: 1,
    },{
        text: '您父亲的生日是？',
        id: 2,
    },{
        text: '您配偶的姓名是？',
        id: 7,
    },{
        text: '您初中班主任的名字是？',
        id: 11,
    },{
        text: '您最熟悉的童年好友名字是？',
        id: 16,
    }
]; // 安全问题

import './ForgetFundPw.scss';

@observer
export default class ForgetFundPw extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resetLoading: false,
            modalValidate: {
                ans: 2,
                ans1: 2,
                security_pass: 2,
            },

            modalIssue: {
                issue_1: '', //密保问题1
                issue_2: '', //密保问题2
            },
            resetPostData: {
                dna_ques: null, // 问题id 1
                ans: '', // 问题答案 1
                dna_ques1: null, // 问题id 2
                ans1: '', // 问题答案 2
                security_pass: '', // md5(要重置的资金密码)
                nextcon: 'user', // 用户
                nextact: 'bindsequestion', //绑定的问题
                flag: 'check', // 传这个是验证是否设置过密保
                ques_num: 1,
                ques_num1: 2,
            },
        };
    };
    componentDidMount() {
        this._ismount = true;
        this.onForgetPw()
    }
    componentWillUnmount() {
        this._ismount = false;
    };

    /*忘记资金密码*/
    onForgetPw() {
        this.setState({childVisible: true});
        Fetch.bindsequestion({
            method: 'POST',
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200) {
                    let data = res.repsoneContent,
                        modalIssue = this.state.modalIssue,
                        resetPostData = this.state.resetPostData;
                    resetPostData.dna_ques = data.dna_ques_1;
                    resetPostData.dna_ques1 = data.dna_ques_2;
                    issueFlag.forEach((item,i)=>{
                        if(item.id == data.dna_ques_1){
                            modalIssue.issue_1 = item.text;
                        }
                        if(item.id == data.dna_ques_2){
                            modalIssue.issue_2 = item.text;
                        }
                    });
                    this.setState({
                        modalIssue: modalIssue,
                        resetPostData: resetPostData,
                    });
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })


    };

    onChangeModalAns(e) {
        let value = e.target.value,
            modalValidate = this.state.modalValidate,
            resetPostData = this.state.resetPostData;
        resetPostData.ans = value;
        if(value == ''){
            modalValidate.ans = 1
        }else{
            modalValidate.ans = 0
        }
        this.setState({
            modalValidate: modalValidate,
            resetPostData: resetPostData,
        });
    };
    onChangeModalAns1(e) {
        let value = e.target.value,
            modalValidate = this.state.modalValidate,
            resetPostData = this.state.resetPostData;
        resetPostData.ans1 = value;
        if(value == ''){
            modalValidate.ans1 = 1
        }else{
            modalValidate.ans1 = 0
        }
        this.setState({
            modalValidate: modalValidate,
            resetPostData: resetPostData,
        });
    };
    onChangeModalSecurityPw(e) {
        let value = e.target.value,
            modalValidate = this.state.modalValidate,
            resetPostData = this.state.resetPostData;
        resetPostData.security_pass = value;
        if(value == ''){
            modalValidate.security_pass = 1
        }else{
            modalValidate.security_pass = 0
        }
        this.setState({
            modalValidate: modalValidate,
            resetPostData: resetPostData,
        });
    };
    /*验证显示不同class*/
    onModalValidate(val) {
        let classNames,
            validate = this.state.modalValidate;
        if(validate[val] == 0) {
            classNames = 'correct'
        } else if(validate[val] == 1) {
            classNames = 'wrong'
        } else {
            classNames = ''
        }
        return classNames
    };
    /*忘记资金密码，重置*/
    onResetCapitalPw() {
        let modalValidate = this.state.modalValidate,
            resetPostData = this.state.resetPostData;
        if(modalValidate.ans != 0) {
            modalValidate.ans = 1
        }
        if(modalValidate.ans1 != 0) {
            modalValidate.ans1 = 1
        }
        if(modalValidate.security_pass != 0) {
            modalValidate.security_pass = 1
        }
        this.setState({modalValidate: modalValidate});
        if(modalValidate.ans != 0 ||
            modalValidate.ans1 != 0 ||
            modalValidate.security_pass != 0){
            return
        }else{
            let resetPostDataFlag = JSON.parse(JSON.stringify(resetPostData));
            resetPostDataFlag.security_pass = md5(resetPostDataFlag.security_pass);
            this.setState({resetLoading: true});
            Fetch.checkquestion(({
                method: 'POST',
                body: JSON.stringify(resetPostDataFlag)
            })).then((res)=>{
                if(this._ismount){
                    this.setState({resetLoading: false});
                    if(res.status == 200) {
                        let _this = this;
                        Modal.success({
                            title: res.shortMessage,
                            onOk() {
                                modalValidate.ans = 2;
                                modalValidate.ans1 = 2;
                                modalValidate.security_pass = 2;
                                resetPostData.ans = '';
                                resetPostData.ans1 = '';
                                resetPostData.security_pass = '';
                                _this.setState({
                                    modalValidate: modalValidate,
                                    resetPostData: resetPostData,
                                })
                            }
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

    /*设置密保*/
    onSetEncrypted() {
        hashHistory.push({
            pathname: '/selfInfo/security',
            query: {
                navIndex: 2
            }
        });
        stateVar.securityIndex = 3;
    };

    render() {
        const { userInfo } = stateVar;
        const { visible } = this.props;
        const { resetPostData, modalIssue } = this.state;

        return (
            <Modal
                title="忘记资金密码"
                width={480}
                wrapClassName="center-modal-sec"
                visible={visible}
                onCancel={()=>{this.props.onHideModal()}}
                footer={null}
                maskClosable={false}
            >
                <div className="sec_k_main clear">
                    {
                        userInfo.setquestion == 'yes' ?
                            <div style={{height: 170, marginTop: 20}}>
                                <p style={{fontSize: 14, marginBottom: 100}}>您尚未设置密保问题，无法找回资金密码请联系客服处理</p>
                                <Button type="primary" size="large" onClick={()=>this.onSetEncrypted()}>
                                    设置密保
                                </Button>
                            </div> :
                            <ul className="sec_k_list">
                                <li>
                                    <span className="sec_k_left">安全问题1：</span>
                                    <Input size="large" value={modalIssue.issue_1} disabled/>
                                </li>
                                <li>
                                    <span className="sec_k_left">输入答案1：</span>
                                    <Input size="large" placeholder="请输入答案1"
                                           value={resetPostData.ans}
                                           onChange={(e)=>this.onChangeModalAns(e)}
                                           className={this.onModalValidate('ans')}
                                    />
                                </li>
                                <li>
                                    <span className="sec_k_left">安全问题2：</span>
                                    <Input size="large" value={modalIssue.issue_2} disabled/>
                                </li>
                                <li>
                                    <span className="sec_k_left">输入答案2：</span>
                                    <Input size="large" placeholder="请输入答案2"
                                           value={resetPostData.ans1}
                                           onChange={(e)=>this.onChangeModalAns1(e)}
                                           className={this.onModalValidate('ans1')}
                                    />
                                </li>
                                <li>
                                    <span className="sec_k_left">重置资金密码：</span>
                                    <Input size="large" placeholder="请输入新资金密码"
                                           type="password"
                                           value={resetPostData.security_pass}
                                           onChange={(e)=>this.onChangeModalSecurityPw(e)}
                                           className={this.onModalValidate('security_pass')}
                                    />
                                </li>
                                <li className="s_m_primary_btn">
                                    <Button type="primary" size="large" loading={this.state.resetLoading} onClick={()=>{this.onResetCapitalPw()}}>
                                        确定
                                    </Button>
                                </li>
                            </ul>
                    }
                </div>
            </Modal>
        )
    }
}
