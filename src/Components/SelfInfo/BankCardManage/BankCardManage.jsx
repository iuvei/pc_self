/*账户管理 > 银行卡管理*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { hashHistory } from 'react-router';
import Fetch from '../../../Utils';
import { Table, Button, Modal, Select, Input, message, Spin } from 'antd';
const Option = Select.Option;
import { onValidate } from '../../../CommonJs/common';
import { stateVar } from '../../../State';
import ForgetFundPw from '../Security/ForgetFundPw/ForgetFundPw';
import md5 from 'md5';

import './BankCardManage.scss'

@observer
export default class BankCardManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            ModalTitle: true,
            tableLoading: false,
            response: {
                bankList: [], //绑定银行卡列表
                binded: 0, //已绑定的银行卡数量
                num: 0, //最大绑定的银行卡数量
                withdrawLimit: 0,
            },
            adduserbank: {
                banklist: [],//开户行
                provincelist: [],//开户银行区域
                city: [],// 城市
            },
            addPostData: {
                account_name: null,//旧的银行卡账户名称或者新的银行卡账号名称
                bank: null,//银行名称（如果是确认提交只有后面的农业银行名称）
                bank_id: '-1',//银行卡id(确认提交是才有次参数)
                province_id: '-1',//省份id确认时才有
                province: '',//省份（确认时只提交#号后面）
                city_id: '-1',//确认时才有此参数
                city: '',//城市（确认时只提交#号后面）
                branch: '', //支行名称
                account: '', //输入的修改银行卡账号或者新绑定的银行卡账号
                account_again: '',//确认账号
                flag: 'confirm',
                security_pass: '', //md5(资金密码)
            },
            validate: {
                branch: 2, // 0: 对， 1：错
                account_name: 2,
                account: 2,
                account_again: 2,
                security_pass: 2,
            },

            childVisible: false,
            spinLoading: false,
        }
    };
    componentDidMount() {
        this._ismount = true;
        this.getData();
    };
    componentWillUnmount() {
        this._ismount = false;
        window.clearTimeout(this.clearTimeouts);
    };
    /*获取银行卡列表*/
    getData() {
        this.setState({tableLoading: true});
        Fetch.userbankinfo({
            method: 'POST'
        }).then((res)=>{
            if(this._ismount) {
                this.setState({tableLoading: false});
                if(res.status == 200){
                    let data = res.repsoneContent;
                    this.setState({
                        response: data,
                    });
                }
            }

        })
    };
    /*获取开户行和省份*/
    onAdduserbank() {
        Fetch.adduserbank({
            method: 'POST',
            body: JSON.stringify({flag: 'page'}),
        }).then((res)=>{
            if(this._ismount && res.status == 200){
                let data = res.repsoneContent,
                    adduserbank = this.state.adduserbank;
                    adduserbank.banklist = data.banklist;
                    adduserbank.provincelist = data.provincelist;
                this.setState({adduserbank: adduserbank});
            }
        })
    };
    // 增加修改银行卡号
    showModal(value, record) {
        this.onAdduserbank();
        let {addPostData} = this.state;
        if (value == 'add') {
            addPostData.flag = 'confirm';
            this.setState({
                visible: true,
                ModalTitle: true,
                addPostData
            });
        } else {
            this.onProvince(record.province_id);
            addPostData.bank_id = record.bank_id;
            addPostData.bank = record.bank_name;
            addPostData.province_id = record.province_id;
            addPostData.province = record.province;
            addPostData.city_id = record.city_id;
            addPostData.city = record.city;
            addPostData.id = record.id;
            addPostData.account_name = record.account_name;
            addPostData.branch = record.branch;
            addPostData.account = record.realaccount;
            addPostData.account_again = record.realaccount;
            addPostData.flag = 'confirmset';
            this.setState({
                visible: true,
                ModalTitle: false,
                addPostData: addPostData,
            });
        }
    };

    /*选择开户银行*/
    onSelectBank(items) {
        let addPostData = this.state.addPostData,
            adduserbank = this.state.adduserbank;
        addPostData.bank_id = items.key;
        addPostData.bank = items.key != '-1' && adduserbank.provincelist.length != 0 ? items.label : '';
        this.setState({
            addPostData: addPostData,
        });
    };
    /*选择省份获取城市*/
    onProvince(val) {
        let addPostData = this.state.addPostData,
            adduserbank = this.state.adduserbank;
        addPostData.province_id = val;
        addPostData.city_id = '-1';
        addPostData.province = val != '-1' && adduserbank.provincelist.length != 0 ? adduserbank.provincelist.filter(item => item.id == val)[0].name : '';
        this.setState({
            addPostData: addPostData,
        });
        Fetch.adduserbank({
            method: 'POST',
            body: JSON.stringify({flag: 'getCity', province: val}),
        }).then((res)=>{
            if(this._ismount && res.status == 200) {
                adduserbank.city = res.repsoneContent;
                this.setState({
                    adduserbank: adduserbank,
                });
            }
        })
    };
    /*选择城市*/
    onCity(val) {
        let addPostData = this.state.addPostData,
            adduserbank = this.state.adduserbank;
        addPostData.city_id = val;
        addPostData.city = val != '-1' ? adduserbank.city.filter(item => item.id == val)[0].name : '';
        this.setState({
            addPostData: addPostData,
        });
    }

    /*支行名称*/
    onBranch(e){
        let {validate, addPostData} = this.state;
        if(e != undefined){
            addPostData.branch = e.target.value;
        }
        if (addPostData.branch != '') {
            let reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,20}$/;
            let r = reg.test(addPostData.branch);
            if (r) {
                validate.branch = 0;
            } else {
                validate.branch = 1;
            }
        }else{
            validate.branch = 1;
        }
        this.setState({
            addPostData: addPostData,
            validate: validate,
        })
    };
    /*开户人姓名*/
    onAccountName(e){
        let {validate, addPostData} = this.state;
        if(e != undefined){
            addPostData.account_name = e.target.value;
        }
        let reg = /^[.。·\u4e00-\u9fa5]{2,15}$/;
        let r = reg.test(addPostData.account_name);
        if (r) {
            validate.account_name = 0;
        } else {
            validate.account_name = 1;
        }
        this.setState({
            addPostData: addPostData,
            validate: validate,
        })
    };
    /*银行卡号*/
    onAccount(e) {
        let val = e.target.value,
            validate = this.state.validate,
            addPostData = this.state.addPostData;
        addPostData.account = val;
        if (val != '') {
            let reg = /^[\d]{16,19}$/;
            let r = reg.test(val);
            if (r) {
                validate.account = 0;
            } else {
                validate.account = 1;
            }
        }else{
            validate.account = 1;
        }
        this.setState({
            addPostData: addPostData,
            validate: validate,
        })
    };
    /*确认卡号*/
    onAccountAgain(e) {
        let val = e.target.value,
            validate = this.state.validate,
            addPostData = this.state.addPostData;
        addPostData.account_again = val;
        if(validate.account == 0){
            if (val != '' && val == addPostData.account) {
                validate.account_again = 0;
            }else{
                validate.account_again = 1;
            }
        }else{
            validate.account_again = 1;
        }

        this.setState({
            addPostData: addPostData,
            validate: validate,
        })
    };
    /*验证资金密码*/
    onSecurityPass(e) {
        let val = e.target.value,
            validate = this.state.validate,
            addPostData = this.state.addPostData;
        addPostData.security_pass = val;
        if (val == '') {
            validate.security_pass = 1;
        }else{
            validate.security_pass = 0;
        }
        this.setState({
            addPostData: addPostData,
            validate: validate,
        })
    };
    /*下一步*/
    onStep(){
        let { validate, ModalTitle, addPostData } = this.state;
        if(addPostData.bank_id == '-1') {
            Modal.error({
                title: '开户银行不能为空！',
            });
            return
        }
        if(addPostData.city_id == '-1') {
            Modal.error({
                title: '开户银行省份不能为空！',
            });
            return
        }
        if(addPostData.province_id == '-1') {
            Modal.error({
                title: '开户银行城市不能为空！',
            });
            return
        }

        if(!ModalTitle){
            this.onBranch();
            this.onAccountName();
            validate.account = 0;
        }
        if(ModalTitle){
            if(validate.branch != 0) {
                validate.branch = 1
            }
            if(validate.account_name != 0) {
                validate.account_name = 1
            }
            if(validate.account != 0) {
                validate.account = 1
            }
            if(validate.account_again != 0) {
                validate.account_again = 1
            }
            if(validate.security_pass != 0) {
                validate.security_pass = 1
            }
        }else{
            validate.account_again = 0;
            if(validate.security_pass != 0) {
                validate.security_pass = 1
            }
        }
        this.setState({validate: validate});
        if(validate.branch != 0 ||
            validate.account_name != 0 ||
            validate.account != 0 ||
            validate.account_again != 0 ||
            validate.security_pass != 0){
            return
        }else{
            this.setState({ loading: true });
            let addPostDataFlag = JSON.parse(JSON.stringify(addPostData));
            addPostDataFlag.security_pass = md5(addPostDataFlag.security_pass);
            Fetch.adduserbank({
                method: 'POST',
                body: JSON.stringify(addPostDataFlag),
            }).then((res)=>{
                if(this._ismount){
                    this.setState({ loading: false });
                    if(res.status == 200){
                        Modal.success({
                            title: res.shortMessage,
                            content: '银行卡列表更新最晚 1 分钟更新！',
                        });
                        this.clearTimeouts = setTimeout(()=>{
                            this.getData()
                        }, 60000);
                        this.setState({
                            addPostData: {},
                            validate: {},
                            visible: false,
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
    /*关闭模态框*/
    onHideModal() {
        this.setState({
            visible: false,
            addPostData: {},
            validate: {},
        })
    };
    /*子组件调用关闭模态框*/
    onHideChildModal() {
        this.setState({childVisible: false})
    };
    /*设置资金密码*/
    onClickCapital(){
        stateVar.navIndex = 'selfInfo';
        stateVar.securityIndex = 1;
        hashHistory.push({
            pathname: '/selfInfo/security',
            query: {
                navIndex: 2
            }
        });
    };
    render() {
        const { response, adduserbank, addPostData, ModalTitle, spinLoading } = this.state;
        const { userInfo } = stateVar;
        const columns = [
            {
                title: '姓名',
                dataIndex: 'account_name',
            }, {
                title: '银行名',
                dataIndex: 'bank_name',
            }, {
                title: '开户行',
                dataIndex: 'branch',
            },{
                title: '卡号',
                dataIndex: 'account',
            },{
                title: '绑定时间',
                dataIndex: 'atime',
            }, {
                title: '操作',
                dataIndex: 'action',
                render: (text, record) => (
                    <span>
                        <a href="javascript:void(0)" onClick={()=>{this.showModal('amend', record)}} style={{color: '#CB1313'}}>修改</a>
                        <span className="ant-divider" />
                        <a href={stateVar.httpService} target="_blank" style={{color: '#3C77CB'}}>申请删除</a>
                    </span>
                ),
            }
        ];
        return (
            <div className="b_cm_main">
                <Spin spinning={spinLoading}>
                    {
                        userInfo.setsecurity == 'yes' ?
                            <div className="w_m_nopassword">
                                您尚未
                                <span onClick={()=>this.onClickCapital()}>设置资金密码</span>
                                ，请先设置资金密码
                            </div> :
                            <div>
                                <div className="b_cm_text_explain">
                                    <p>1、一个账户最多只能绑定5张银行卡，你当前绑定<i> ({response.binded == undefined ? '0' : response.binded}) </i>张，还能绑定<i> ({response.num == undefined ? '5' : response.num - response.binded}) </i>张。</p>
                                    <p>2、如需删除已绑定的银行卡，请点击“申请删除”，之后会有客服人员主动与您连续进行确认。</p>
                                    <p>3、为了您的账户资金安全，银行卡“新增”和“修改”将在操作完成 {response.withdrawLimit == undefined ? 0 : response.withdrawLimit/3600} 小时后，新卡才能发起“向平台提现”。</p>
                                </div>
                                <div className="b_cm_table">
                                    <Table columns={columns}
                                           rowKey={record => record.id}
                                           dataSource={response.bankList}
                                           loading={this.state.tableLoading}
                                           pagination={false}
                                    />
                                </div>
                                <Button className="b_cm_btn" type="primary" size="large" icon="plus" onClick={()=>{this.showModal('add')}}>
                                    增加绑定
                                </Button>
                                <Modal
                                    width='865px'
                                    visible={this.state.visible}
                                    title={ModalTitle === true ? '新增银行卡' : '修改银行卡'}
                                    onCancel={()=>this.onHideModal()}
                                    maskClosable={false}
                                    footer={null}
                                >
                                    <div className="a_aa_main">
                                        <div className="a_aa_form">
                                            <ul className="a_aa_list">
                                                {
                                                    !ModalTitle ?
                                                        <li>
                                                            <span className="a_aa_left_text">银行卡号：</span>
                                                            <Input value={addPostData.account}
                                                                   onChange={(e)=>this.onAccount(e)}
                                                                   className={onValidate('account', this.state.validate)}
                                                                   size="large" style={{width: 280}} placeholder="请输入银行卡号"
                                                                   disabled={!ModalTitle}
                                                            />
                                                            <span className="a_aa_right_text">卡号错误请联系客服删除</span>
                                                        </li> :
                                                        null
                                                }
                                                <li id="select_p1">
                                                    <span className="a_aa_left_text">开户银行：</span>
                                                    <Select value={{key: addPostData.bank_id ? ''+addPostData.bank_id : '-1'}} size="large" labelInValue
                                                            style={{ width: 280 }}
                                                            onChange={(value)=>{this.onSelectBank(value)}}
                                                            placeholder="请选择开户银行"
                                                            getPopupContainer={() => document.getElementById('select_p1')}
                                                    >
                                                        <Option value='-1'>请选择开户银行</Option>
                                                        {
                                                            adduserbank.banklist.map((item, i)=>{
                                                                return <Option value={item.bank_id} key={item.bank_id}>{item.bank_name}</Option>
                                                            })
                                                        }
                                                    </Select>
                                                </li>
                                                <li id="select_p2">
                                                    <span className="a_aa_left_text">开户银行区域：</span>
                                                    <Select value={addPostData.province_id ? addPostData.province_id : '-1'} className="a_aa_marg" size="large"
                                                            style={{ width: 280 }}
                                                            onChange={(value)=>{this.onProvince(value)}}
                                                            placeholder="请选择省份"
                                                            getPopupContainer={() => document.getElementById('select_p2')}
                                                    >
                                                        <Option value='-1'>请选择省份</Option>
                                                        {
                                                            adduserbank.provincelist.map((item, i)=>{
                                                                return <Option value={item.id} key={item.id}>{item.name}</Option>
                                                            })
                                                        }
                                                    </Select>
                                                    <Select value={addPostData.city_id ? addPostData.city_id : '-1'} size="large" style={{ width: 280 }}
                                                            onChange={(value)=>{this.onCity(value)}} placeholder="请选择城市"
                                                            getPopupContainer={() => document.getElementById('select_p2')}
                                                    >
                                                        <Option value='-1'>请选择城市</Option>
                                                        {
                                                            adduserbank.city.map((item, i)=>{
                                                                return <Option value={item.id} key={item.id}>{item.name}</Option>
                                                            })
                                                        }
                                                    </Select>
                                                </li>
                                                <li>
                                                    <span className="a_aa_left_text">支行名称：</span>
                                                    <Input value={addPostData.branch}
                                                           onChange={(e)=>this.onBranch(e)}
                                                           className={onValidate('branch', this.state.validate)}
                                                           size="large" style={{width: 280}} placeholder="请输入支行名称"
                                                    />
                                                    <span className="a_aa_right_text">由1至20个字符或汉字组成，不能使用特殊字符</span>
                                                </li>
                                                <li>
                                                    <span className="a_aa_left_text">开户人姓名：</span>
                                                    <Input value={addPostData.account_name}
                                                           onChange={(e)=>this.onAccountName(e)}
                                                           className={onValidate('account_name', this.state.validate)}
                                                           size="large" style={{width: 280}} placeholder="请输入开户人姓名"
                                                    />
                                                    <span className="a_aa_right_text" style={{verticalAlign: 'bottom'}}>请填写您的真实姓名，只能是中文字符，支持以 下姓名分隔符"·"".""。"</span>
                                                </li>
                                                {
                                                    ModalTitle ?
                                                        <li>
                                                            <span className="a_aa_left_text">银行卡号：</span>
                                                            <Input value={addPostData.account}
                                                                   onChange={(e)=>this.onAccount(e)}
                                                                   className={onValidate('account', this.state.validate)}
                                                                   size="large" style={{width: 280}} placeholder="请输入银行卡号"
                                                                   disabled={!ModalTitle}
                                                            />
                                                            <span className="a_aa_right_text">银行卡卡号由16位至19位数字组成</span>
                                                        </li> :
                                                        null
                                                }
                                                {
                                                    ModalTitle ?
                                                        <li className="disabled_copy">
                                                            <span className="a_aa_left_text">确认卡号：</span>
                                                            <Input value={addPostData.account_again}
                                                                   onChange={(e)=>this.onAccountAgain(e)}
                                                                // onPressEnter={()=>{alert(789)}}
                                                                   className={onValidate('account_again', this.state.validate)}
                                                                   size="large" style={{width: 280}} placeholder="请输入确认卡号" />
                                                            <span className="a_aa_right_text">银行账号请手动输入，不要粘贴</span>
                                                        </li> :
                                                        null
                                                }
                                                <li>
                                                    <span className="a_aa_left_text">验证资金密码：</span>
                                                    <Input value={addPostData.security_pass}
                                                           onChange={(e)=>this.onSecurityPass(e)}
                                                           className={onValidate('security_pass', this.state.validate)}
                                                           type="password" size="large" style={{width: 280}} placeholder="请输入验证资金密码"
                                                    />
                                                    <a onClick={()=>this.setState({childVisible: true})} href="javascript:void(0)" style={{textDecoration:'underline', color:'#0393EF'}}>忘记资金密码？</a>
                                                </li>
                                            </ul>
                                            <Button className="a_aa_btn" type="primary" loading={this.state.loading} onClick={()=>{this.onStep()}}>
                                                下一步
                                            </Button>
                                        </div>

                                        <ForgetFundPw visible={this.state.childVisible}
                                                      onHideModal={this.onHideChildModal.bind(this)}
                                        />
                                    </div>
                                </Modal>
                            </div>
                    }
                </Spin>
            </div>
        );
    }
}
