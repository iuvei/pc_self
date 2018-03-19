/*个人中心*/
import React, {PureComponent} from 'react';
import {observer} from 'mobx-react';
import { Button, Table, Input, Modal } from 'antd';
import Fetch from '../../../Utils';
import { stateVar } from '../../../State';
import { hashHistory } from 'react-router';
import { onValidate } from '../../../CommonJs/common';

import './SelfCenter.scss'
import info_logo from './Img/info_logo.png';
import qq from './Img/qq.png';
import wechat from './Img/wechat.png';
import email from './Img/email.png';
import phone from './Img/phone.png';

@observer
export default class SelfInfo extends PureComponent {
    constructor(porps) {
        super(porps);
        this.state = {
            disabled: true,
            tableLoading: false,
            logs: [],
            postData: {
                flag: '', // 这个没传就是查看用户基本信息
                tencent: '', //要修改的qq号
                wechat: '', //微信号
                phonenumber: '', //正确格式的电话号码
                email: '', //用户邮箱
            },
            validate: {
                tencent: 2, // 0: 对， 1：错
                wechat: 2,
                email: 2,
                phonenumber: 2,
            }
        }
    };
    componentDidMount() {
        this._ismount = true;
        this.getData()
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    getData(flag) {
        this.setState({tableLoading: true});
        Fetch.changename({
            method: 'POST',
            body: JSON.stringify(this.state.postData)
        }).then((res)=>{
            if(this._ismount){
                this.setState({tableLoading: false});
                if(res.status == 200) {
                    if(flag == 'affirm') {
                        let _this = this;
                        Modal.success({
                            title: res.shortMessage,
                            onOk() {
                                _this.setState({disabled: true});
                            }
                        });
                    } else {
                        let data = res.repsoneContent,
                            postData = this.state.postData;
                        postData.tencent = data.tencent;
                        postData.email = data.email;
                        postData.phonenumber = data.phonenumber;
                        postData.wechat = data.wechat;
                        this.setState({
                            postData: postData,
                            logs: data.logs,
                        });
                    }
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*修改*/
    onAmend() {
        this.setState({disabled: false})
    };
    /*确认*/
    onAffirm() {
        let postData = this.state.postData,
            validate = {
                tencent: 2,
                wechat: 2,
                email: 2,
                phonenumber: 2,
            };
        postData.flag = 'update'; // 确定修改
        this.setState({
            postData: postData,
            validate: validate,
        }, ()=>this.getData('affirm'))

    };
    /*取消*/
    onCancel() {
        let validate = {
            tencent: 2,
            wechat: 2,
            email: 2,
            phonenumber: 2,
        };
        this.setState({
            disabled: true,
            validate: validate,
        })
    };
    /*修改qq*/
    onChangeTencent(e){
        let value = e.target.value,
            validate = this.state.validate,
            postData = this.state.postData;
        postData.tencent = value;
        if (value != '') {
            let reg = /^[\d]{5,11}$/;
            let r = reg.test(value);
            if (r) {
                validate.tencent = 0;
            } else {
                validate.tencent = 1;
            }
        }else{
            validate.tencent = 0;
        }
        this.setState({
            validate: validate,
            postData: postData,
        });
    };
    onChangeWechat(e){
        let value = e.target.value,
            postData = this.state.postData,
            validate = this.state.validate;
        postData.wechat = value;
        if (value != '') {
            let reg = /^[^\u4e00-\u9fa5]{6,20}$/;
            let r = reg.test(value);
            if (r) {
                validate.wechat = 0;
            } else {
                validate.wechat = 1;
            }
        }else{
            validate.wechat = 0;
        }
        this.setState({
            postData: postData,
            validate: validate,
        });
    };
    onChangeEmail(e){
        let value = e.target.value,
            postData = this.state.postData,
            validate = this.state.validate;
        postData.email = value;
        if (value != '') {
            let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            let r = reg.test(value);
            if (r) {
                validate.email = 0;
            } else {
                validate.email = 1;
            }
        }else{
            validate.email = 0;
        }
        this.setState({
            validate: validate,
            postData: postData,
        });
    };
    onChangePhone(e){
        let value = e.target.value,
            postData = this.state.postData,
            validate = this.state.validate;
        postData.phonenumber = e.target.value;
        if (value != '') {
            let reg = /^[0-9]{11}$/;
            let r = reg.test(value);
            if (r) {
                validate.phonenumber = 0;
            } else {
                validate.phonenumber = 1;
            }
        }else{
            validate.phonenumber = 0;
        }
        this.setState({
            validate: validate,
            postData: postData,
        });
    };
    /*转账*/
    onHashHistory(router, nav, childNav) {
        if(stateVar.userInfo.sType == 'demo'){
            Modal.warning({
                title: '试玩用户，没有访问权限',
            });
            return
        }
        hashHistory.push({
            pathname: router,
            query: {navIndex: childNav}
        });
        stateVar.navIndex = nav;
    }
    render() {
        const { userInfo, allBalance } = stateVar;
        const { postData, validate, disabled, logs } = this.state;
        const columns = [
            {
                title: '序号',
                dataIndex: 'no',
                render: (text, record, index)=>{
                    return index+1;
                },
                width: '10%',
            },{
                title: '登录时间',
                dataIndex: 'times',
                width: '45%',
            }, {
                title: '登录IP',
                dataIndex: 'proxyip',
                render: (text, record)=> text+' '+record.ip_address,
                width: '45%',
            }
        ];
        return (
            <div className="self_i_main">
                <div className="self_i_top clear">
                    <div className="s_i_content left">
                        <div className="s_i_c_top clear">
                            <div className="s_i_logo left">
                                <img src={info_logo} alt=""/>
                                <p>当前IP：{ logs[0] != undefined ? logs[0].proxyip + ' ' + logs[0].ip_address : '暂未获取到当前IP' }</p>
                            </div>
                            <div className="s_i_info right">
                                <h3>
                                    欢迎您！
                                    <span className="ellipsis">{userInfo.userName}</span>
                                </h3>
                                <p>用户类型：{userInfo.userType == 0 ? '会员' : '代理'}</p>
                                <p>奖金组：{userInfo.accGroup}</p>
                            </div>
                        </div>
                        <ul className="self_info_type clear">
                            <li>
                                <Input addonBefore={<img style={{verticalAlign: 'middle'}} src={qq} alt=""/>}
                                       value={postData.tencent}
                                       className={onValidate('tencent', this.state.validate)}
                                       onChange={(e)=>this.onChangeTencent(e)}
                                       placeholder="点击修改按钮填写"
                                       disabled={this.state.disabled}
                                />
                                <p className="prompt" style={{display: validate.tencent == 1 ? '' : 'none'}}>QQ必须为纯数字且5-11位</p>
                            </li>
                            <li>
                                <Input addonBefore={<img style={{verticalAlign: 'middle'}} src={wechat} alt=""/>}
                                       placeholder="点击修改按钮填写"
                                       value={postData.wechat}
                                       className={onValidate('wechat', this.state.validate)}
                                       onChange={(e)=>this.onChangeWechat(e)}
                                       disabled={disabled}
                                />
                                <p className="prompt" style={{display: validate.wechat == 1 ? '' : 'none'}}>微信号不能有汉字且6-20个字符</p>
                            </li>
                            <li>
                                <Input addonBefore={<img style={{verticalAlign: 'middle'}} src={email} alt=""/>}
                                       placeholder="点击修改按钮填写"
                                       value={postData.email}
                                       className={onValidate('email', this.state.validate)}
                                       onChange={(e)=>this.onChangeEmail(e)}
                                       disabled={disabled}
                                />
                                <p className="prompt" style={{display: validate.email == 1 ? '' : 'none'}}>请输入正确的邮箱地址</p>
                            </li>
                            <li>
                                <Input addonBefore={<img style={{verticalAlign: 'middle'}} src={phone} alt=""/>}
                                       placeholder="点击修改按钮填写"
                                       value={postData.phonenumber}
                                       className={onValidate('phonenumber', this.state.validate)}
                                       onChange={(e)=>this.onChangePhone(e)}
                                       disabled={disabled}
                                />
                                <p className="prompt" style={{display: validate.phonenumber == 1 ? '' : 'none'}}>手机号仅为数字且必须为11位</p>
                            </li>
                        </ul>
                        <div className="s_i_btn">
                            <Button type="primary" onClick={()=>this.onAmend()} style={{display: disabled ? '' : 'none'}}>修改</Button>
                            <Button type="primary" onClick={()=>this.onAffirm()} style={{display: !disabled ? '' : 'none'}}>确认</Button>
                            <Button onClick={()=>this.onCancel()} style={{display: !disabled ? '' : 'none'}}>取消</Button>

                        </div>
                    </div>
                    <div className="s_i_account_money right">
                        <div className="s_i_a_top">
                            <span className="account_money">
                                <h3>账户余额：</h3>
                                <em>￥{allBalance.cpbalance}</em>
                            </span>
                            <Button className="recharge_btn right" type="primary"
                                    icon="pay-circle-o"
                                    onClick={()=>this.onHashHistory('/financial/recharge', 'financial', 0)}>
                                立即充值
                            </Button>
                        </div>
                        <ul className="rests_money clear">
                            <li>
                                <div className="left">
                                    <p>EA余额</p>
                                    <p>￥{allBalance.eabalance}</p>
                                </div>
                                <Button className="transfer_btn right" onClick={()=>this.onHashHistory('/financial/transfer', 'financial',3)}>转账</Button>
                            </li>
                            <li>
                                <div className="left">
                                    <p>PT余额</p>
                                    <p>￥{allBalance.ptbalance}</p>
                                </div>
                                <Button className="transfer_btn right" onClick={()=>this.onHashHistory('/financial/transfer', 'financial',3)}>转账</Button>
                            </li>
                            <li>
                                <div className="left">
                                    <p>GT余额</p>
                                    <p>￥{allBalance.kgbalance}</p>
                                </div>
                                <Button className="transfer_btn right" onClick={()=>this.onHashHistory('/financial/transfer', 'financial',3)}>转账</Button>
                            </li>
                            <li>
                                <div className="left">
                                    <p>博饼余额</p>
                                    <p>￥{allBalance.bobingBalance}</p>
                                </div>
                                <Button className="transfer_btn right" onClick={()=>this.onHashHistory('/financial/transfer', 'financial',3)}>转账</Button>
                            </li>
                            <li>
                                <div className="left">
                                    <p>体育余额</p>
                                    <p>￥{allBalance.sbbalance}</p>
                                </div>
                                <Button className="transfer_btn right" onClick={()=>this.onHashHistory('/financial/transfer', 'financial',3)}>转账</Button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="log_text">
                    最近{logs.length}条登录日志
                </div>
                <div className="self_i_bottom">
                    <Table rowKey={record => record.times}
                           columns={columns}
                           dataSource={logs}
                           loading={this.state.tableLoading}
                           pagination={false}
                           scroll={{ y: 200 }}
                    />
                </div>
            </div>
        );
    }
}
