/*设置密保问题*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Select,Input,Button,Modal } from 'antd';
const Option = Select.Option;
import { stateVar } from '../../../../State';
import Fetch from '../../../../Utils';
import { onValidate } from '../../../../CommonJs/common';
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

@observer
export default class Setsecurity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            issueOne: issueFlag,
            issueTwo: issueFlag,
            securityLoading: false,
            postData: {
                dna_ques_1: null, //问题id 1
                ans1: '', //问题答案 1
                dna_ques_2: null, // 问题id 2
                ans2: '', //问题答案 2
                flag: 'postdata', //提交数据标志
                security_pass: '', //Md5(密码)
            },
            validate: {
                ans1: 2, // 0: 对， 1：错
                ans2: 2,
                security_pass: 2,
            }
        };
    };
    componentDidMount() {
        this._ismount = true;
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    /*确定设置密保*/
    getData() {
        let postData = this.state.postData,
            validate = this.state.validate;
        if(postData.dna_ques_1 == null) {
            Modal.error({
                title: '密保问题1，不能为空！',
                content: '请选择密保问题1',
            });
            return
        }
        if(validate.ans1 != 0){
            validate.ans1 = 1;
            this.setState({validate: validate});
            return
        }
        if(postData.dna_ques_2 == null) {
            Modal.error({
                title: '密保问题2，不能为空！',
                content: '请选择密保问题2',
            });
            return
        }
        if(validate.ans2 != 0){
            validate.ans2 = 1;
            this.setState({validate: validate});
            return
        }
        if(validate.security_pass != 0){
            validate.security_pass = 1;
            this.setState({validate: validate});
            return
        }

        postData.security_pass = md5(postData.security_pass);
        Fetch.bindsequestion({
            method: 'POST',
            body: JSON.stringify(postData)
        }).then((res)=>{
            if(this._ismount && res.status == 200){
                let _this = this;
                Modal.success({
                    title: res.shortMessage,
                    onOk() {
                        validate.ans1 = 2;
                        validate.ans2 = 2;
                        validate.security_pass = 2;
                        postData.ans1 = '';
                        postData.ans2 = '';
                        postData.security_pass = '';
                        stateVar.userInfo.setquestion = 'no';
                        _this.setState({
                            validate: validate,
                            postData: postData,
                        })
                    }
                });
            }else {
                Modal.warning({
                    title: res.shortMessage,
                });
            }
        })
    }
    /*问题1*/
    handleChangeIssueOne(val) {
        let postData = this.state.postData;
        postData.dna_ques_1 = val;
        this.setState({
            postData: postData,
            issueTwo: issueFlag.filter(item => item.id != val),
        });
    };
    /*问题2*/
    handleChangeIssueTwo(val) {
        let postData = this.state.postData;
        postData.dna_ques_2 = val;
        this.setState({
            postData: postData,
            issueOne: issueFlag.filter(item => item.id != val),
        });
    };
    /*没有设置资金密码时点击跳转到设置资金密码*/
    onClickCapital() {
        this.props.onChangeIndex(1);
    };
    /*答案1*/
    onChangeAns1(e) {
        let value = e.target.value,
            postData = this.state.postData,
            validate = this.state.validate;
        postData.ans1 = value;
        if(value == ''){
            validate.ans1 = 1
        }else{
            validate.ans1 = 0
        }
        this.setState({postData: postData})
    }
    /*答案2*/
    onChangeAns2(e) {
        let value = e.target.value,
            postData = this.state.postData,
            validate = this.state.validate;
        postData.ans2 = value;
        if(value == ''){
            validate.ans2 = 1
        }else{
            validate.ans2 = 0
        }
        this.setState({postData: postData})
    }
    /*验证资金密码*/
    onChangeCapitalPw(e) {
        let value = e.target.value,
            postData = this.state.postData,
            validate = this.state.validate;
        postData.security_pass = value;
        if(value == ''){
            validate.security_pass = 1
        }else{
            validate.security_pass = 0
        }
        this.setState({postData: postData})
    }

    render() {
        const { issueOne, issueTwo, postData } = this.state;
        return (
            <div  className="sec_k_main clear">
                {
                    stateVar.userInfo.setsecurity == 'yes' ?
                        <div style={{ marginTop: 180,fontSize: 14}}>
                            <p style={{textAlign: 'center'}}>您尚未<a href="javascript:void(0)" onClick={()=>this.onClickCapital()} style={{color: '#0309ff',textDecoration: 'underline'}}>设置资金密码</a>,无法设置密保问题</p>
                        </div> :
                        <ul className="sec_k_list">
                            <li>
                                <span className="sec_k_left">安全问题1：</span>
                                <Select placeholder="请选择密保问题" style={{ width: 320 }}
                                        onChange={(value)=>{this.handleChangeIssueOne(value)}}
                                >
                                    {
                                        issueOne.map((item,i)=>{
                                            return <Option value={''+item.id} key={item.id}>{item.text}</Option>
                                        })
                                    }
                                </Select>
                            </li>
                            <li>
                                <span className="sec_k_left">输入答案1：</span>
                                <Input size="large" placeholder="请输入答案1"
                                       value={postData.ans1}
                                       onChange={(e)=>this.onChangeAns1(e)}
                                       className={onValidate('ans1', this.state.validate)}
                                />
                            </li>
                            <li>
                                <span className="sec_k_left">安全问题2：</span>
                                <Select placeholder="请选择密保问题" style={{ width: 320}} onChange={(value)=>{this.handleChangeIssueTwo(value)}}>
                                    {
                                        issueTwo.map((item,i)=>{
                                            return <Option value={''+item.id} key={item.id}>{item.text}</Option>
                                        })
                                    }
                                </Select>
                            </li>
                            <li>
                                <span className="sec_k_left">输入答案2：</span>
                                <Input size="large" placeholder="请输入答案2"
                                       value={postData.ans2}
                                       onChange={(e)=>this.onChangeAns2(e)}
                                       className={onValidate('ans2', this.state.validate)}
                                />
                            </li>
                            <li>
                                <span className="sec_k_left">验证资金密码：</span>
                                <Input size="large" placeholder="请资金密码"
                                       type="password"
                                       value={postData.security_pass}
                                       onChange={(e)=>this.onChangeCapitalPw(e)}
                                       className={onValidate('security_pass', this.state.validate)}
                                />
                            </li>
                            <li className="s_m_primary_btn">
                                <span className="sec_k_left"></span>
                                <Button type="primary" size="large" loading={this.state.securityLoading} onClick={()=>{this.getData()}}>
                                    确认修改
                                </Button>
                            </li>
                        </ul>
                }

            </div>
        )
    }
}
