/*市场推广*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { InputNumber,Input, Slider, Button, Table, Radio, Modal, Switch, Popconfirm, message, Popover } from 'antd';
import {CopyToClipboard} from 'react-copy-to-clipboard';
let QRCode = require('qrcode.react');

import Fetch from '../../../Utils';
import AlterModal from '../../Common/AlertModal/AlertModal';

import './Marketing.scss'

@observer
export default class Marketing extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            registerLink: 0, // 默认选中注册下级
            list: {},
            selfPoint: 0,// 自身返点

            iconLoadingRegister: false,
            registerSlider:{ // 注册奖金组
                disabledMinus: false,
                sliderMax:1956,
            },
            registerPost: { // 注册请求数据
                flag: 'insert', // 表示提交新用户的数据
                usertype: 1, //1：为代理 0:为普通用户, 默认选中代理
                username: '', // 用户名
                userpass: '', //密码
                nickname: '', //昵称
                keeppoint: 0, //自身保留返点
                groupLevel: 1800, //奖金组级别
            },
            validateUserName: 2, // 验证注册用户名 0：正确；1：错误；2：不显示
            validateUserPass: 2,
            validateNickName: 2,
            registerAccountNum: 0,

            reneralizeAccountNum: 0,
            generalizeIconLoading: false,
            generalizeSlider:{
                disabledMinus: false,
                sliderMax:1956,
            },
            generalizeData: [], // 推广注册地址列表
            generalizePost: {// 推广链接
                flag: 'onekey', // grow表示生成推广链接
                keeppoint: 7.8, //自身保留返点
                groupLevel: 1800, // 奖金组级别
                usertype: 1, //1：为代理 0:为普通用户
                remark: '', //有备注或者为空
            },
        }
    };
    componentDidMount() {
        this._ismount = true;
        this.getData();
    };

    componentWillUnmount() {
        this._ismount = false;
    };
    getData(){
        Fetch.adduser({
            method:'POST',
        }).then((res)=>{
            if(this._ismount && res.status === 200){
                let repsone = res.repsoneContent,
                    { registerSlider, generalizeSlider } = this.state;
                registerSlider.sliderMax = repsone.groupLevel;
                generalizeSlider.sliderMax = repsone.groupLevel;
                this.setState({
                    registerSlider: registerSlider,
                    generalizeSlider: generalizeSlider,
                    list: repsone.list,
                    selfPoint: repsone.selfPoint,
                }, ()=>{
                    let registerPost = this.state.registerPost,
                        generalizePost = this.state.generalizePost;
                    this.setState({
                        registerAccountNum: this.state.list[registerPost.groupLevel].accnum,
                        reneralizeAccountNum: this.state.list[generalizePost.groupLevel].accnum,
                    })
                })
            }else{
                Modal.warning({
                    title: res.shortMessage,
                });
            }
        })
    };
    /*注册-用户类型*/
    onRegisterMember(e) {
        let registerPost = this.state.registerPost;
            registerPost.usertype = e.target.value;
        this.setState({registerPost: registerPost});
    };
    /*注册-用户名*/
    onRegisteruserName(e) {
        let val = e.target.value,
            reg = /^(?=.*[\da-zA-Z]+)(?!.*?([a-zA-Z0-9]+?)\1\1\1).{6,16}$/,
            r = reg.test(val);
        if(r) {
            this.setState({validateUserName: 0})
        }else {
            this.setState({validateUserName: 1})
        }
        let registerPost = this.state.registerPost;
        registerPost.username = e.target.value;
        this.setState({registerPost: registerPost});

    };
    /*注册-密码*/
    onRegisteruserPass(e) {
        let val = e.target.value,
            reg = /^(?![^a-zA-Z]+$)(?!\D+$).{6,16}$/,
            r = reg.test(val);
        if(r) {
            this.setState({validateUserPass: 0})
        }else {
            this.setState({validateUserPass: 1})
        }
        let registerPost = this.state.registerPost;
        registerPost.userpass = e.target.value;
        this.setState({registerPost: registerPost});

    };
    /*注册-昵称*/
    onRegisternickName(e){
        let val = e.target.value,
            reg = /^.{2,6}$/,
            r = reg.test(val);
        if(r) {
            this.setState({validateNickName: 0})
        }else {
            this.setState({validateNickName: 1})
        }
        let registerPost = this.state.registerPost;
        registerPost.nickname = e.target.value;
        this.setState({registerPost: registerPost});
    }
    validateUserName() {
        let classNames;
        if(this.state.validateUserName === 2) {
            classNames = ''
        } else if(this.state.validateUserName === 1) {
            classNames = 'input_p wrong'
        } else {
            classNames = 'input_p correct'
        }
        return classNames
    };
    validateUserPass() {
        let classNames;
        if(this.state.validateUserPass === 2) {
            classNames = ''
        } else if(this.state.validateUserPass === 1) {
            classNames = 'input_p wrong'
        } else {
            classNames = 'input_p correct'
        }
        return classNames
    };
    validateNickName() {
        let classNames;
        if(this.state.validateNickName === 2) {
            classNames = ''
        } else if(this.state.validateNickName === 1) {
            classNames = 'input_p wrong'
        } else {
            classNames = 'input_p correct'
        }
        return classNames
    };
    /*注册-奖金组设置， 注册-滑动条*/
    onRegisterSetBonus(value) {
        let registerPost = this.state.registerPost;
        let reg = /^[0-9]*$/;
        let r = reg.test(value);
        if (!r) {
            this.forceUpdate();
            return
        }
        let listValue = this.state.list[value];
        if (listValue == undefined) {
            return
        }
        registerPost.groupLevel = value;
        registerPost.keeppoint = parseFloat(((this.state.selfPoint - listValue.high)*100).toFixed(1));
        this.state.registerAccountNum = this.state.list[value].accnum;
        this.forceUpdate();
    };
    /*注册-提交用户*/
    enterIconLoadingRegister() {
        let {validateUserName, validateUserPass, validateNickName, registerPost, registerAccountNum } = this.state;
        if(validateUserName === 0 &&
            validateUserPass === 0 &&
            validateNickName === 0) {
            this.setState({ iconLoadingRegister: true });
            Fetch.adduser({
                method:'POST',
                body: JSON.stringify(registerPost),
            }).then((res)=>{
                if(this._ismount){
                    this.setState({
                        iconLoadingRegister: false,
                    });
                    if(res.status == 200){
                        let _this = this;
                        if(registerAccountNum > 0){
                            this.getData();
                        }

                        Modal.success({
                            title: res.shortMessage,
                            content: res.repsoneContent,
                            onOk() {
                                let registerPost = _this.state.registerPost;
                                registerPost.username = '';
                                registerPost.userpass = '';
                                registerPost.nickname = '';
                                _this.setState({
                                    validateUserName: 2,
                                    validateUserPass: 2,
                                    validateNickName: 2,
                                    registerPost: registerPost,
                                });
                            },
                        });
                    } else {
                        Modal.warning({
                            title: res.shortMessage,
                        });
                    }
                }
            })
        }else{
            this.setState({
                validateUserName: 1,
                validateUserPass: 1,
                validateNickName: 1,
            });
        }
    };

    /*点击推广链接时*/
    onReneralize() {
        if(this.state.registerLink != 1) {
            this.setState({registerLink: 1});
        }
        Fetch.adduser({
            method: 'POST',
            body: JSON.stringify({flag: 'getlink'}),
        }).then((res)=>{
            if(this._ismount && res.status == 200){
                this.setState({generalizeData: res.repsoneContent})
            }else{
                Modal.warning({
                    title: res.shortMessage,
                });
            }
        })
    };
    /*推广-用户类型*/
    onReneralizeMember(e) {
        let generalizePost = this.state.generalizePost;
        generalizePost.usertype = e.target.value;
        this.setState({generalizePost: generalizePost});
    };
    /*推广-滑动条, 设置奖金组*/
    onReneralizeSlider(value) {
        let generalizePost = this.state.generalizePost;
        let reg = /^[0-9]*$/;
        let r = reg.test(value);
        if (!r) {
            this.forceUpdate();
            return
        }
        let listValue = this.state.list[value];
        if (listValue == undefined) {
            return
        }
        generalizePost.groupLevel = value;
        generalizePost.keeppoint = parseFloat(((this.state.selfPoint - listValue.high)*100).toFixed(1));
        this.state.reneralizeAccountNum = this.state.list[value].accnum;
        this.forceUpdate();
    };
    /*推广-备注*/
    onReneralizeRemark(e) {
        let reg =/^.{0,6}$/,
            val = e.target.value,
            r = reg.test(val);
        if(r){
            let generalizePost = this.state.generalizePost;
            generalizePost.remark = val;
            this.setState({generalizePost: generalizePost});
        }
    };
    /*推广-生成推广链接*/
    enterIconLoadingLink() {
        this.setState({ generalizeIconLoading: true });
        Fetch.adduser({
            method: 'POST',
            body: JSON.stringify(this.state.generalizePost),
        }).then((res)=>{
            if(this._ismount){
                this.setState({ generalizeIconLoading: false });
                if(res.status == 200) {
                    message.success(res.shortMessage);
                    this.onReneralize();
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*推广-加btn*/
    onGeneralizePlus() {
        let generalizePost = this.state.generalizePost,
            list = this.state.list,
            selfPoint = this.state.selfPoint;
        generalizePost.groupLevel = parseInt(generalizePost.groupLevel) + 2;
        generalizePost.keeppoint = parseFloat(((selfPoint - list[generalizePost.groupLevel].high)*100).toFixed(1));
        this.setState({
            generalizePost: generalizePost,
            reneralizeAccountNum: list[generalizePost.groupLevel].accnum,
        })
    }
    /*推广-减btn*/
    onGeneralizeMinus() {
        let generalizePost = this.state.generalizePost,
            list = this.state.list,
            selfPoint = this.state.selfPoint;
        generalizePost.groupLevel = parseInt(generalizePost.groupLevel) - 2;
        generalizePost.keeppoint = parseFloat(((selfPoint - list[generalizePost.groupLevel].high)*100).toFixed(1));
        this.setState({
            generalizePost: generalizePost,
            reneralizeAccountNum: list[generalizePost.groupLevel].accnum,
        })
    }
    /*启用/禁止*/
    onChangeSwitch(checked,record) {
        let postData = {
            tag: 'changelinkstatus', //修改链接地址的状态必传此参数
            status: null, //-1:删除 0:禁用 1启用
            id: record.id,//要修改的记录id
        };
        if(checked == true){
            postData.status = 1;
        } else {
            postData.status = 0;
        }
        Fetch.main({
            method:'POST',
            body: JSON.stringify(postData)
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200) {

                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*删除*/
    onDelete(record) {
        let postData = {
            tag: 'changelinkstatus', //修改链接地址的状态必传此参数
            status: -1, //-1:删除 0:禁用 1启用
            id: record.id,//要修改的记录id
        };
        Fetch.main({
            method:'POST',
            body: JSON.stringify(postData),
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200){
                    message.success(res.shortMessage);
                    let generalizeData = this.state.generalizeData;
                    this.setState({ generalizeData: generalizeData.filter(item => item.id !== record.id) });
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };

    render() {
        const columns = [
            {
                title: '链接地址',
                dataIndex: 'linkaddress',
                render: (text, record, index)=><div className="clear">
                                                    <a className="url_style ellipsis" href={text} target="_blank">{text}</a>
                                                    <span className="qrcode right">
                                                        <Popover content={
                                                                            <QRCode value={text}
                                                                                    size={200}
                                                                                    bgColor="#FFFFFF"
                                                                                    fgColor="#000000"
                                                                            />
                                                                        }
                                                                 title="手机扫描二维码"
                                                                 trigger="click">
                                                            <Button type="primary" size="small" style={{marginRight:'3px'}}>手机二维码</Button>
                                                        </Popover>
                                                        <Popover content={
                                                                            <QRCode value={record.qrLink}
                                                                                    size={200}
                                                                                    bgColor="#FFFFFF"
                                                                                    fgColor="#000000"
                                                                            />
                                                                        }
                                                                 title="微信注册二维码"
                                                                 trigger="click">
                                                            <Button type="primary" size="small">微信二维码</Button>
                                                        </Popover>
                                                    </span>
                                                    <section className="copy right">
                                                        <CopyToClipboard text={text} onCopy={() => message.success('复制成功')}>
                                                            <Button type="primary" size="small">复制</Button>
                                                        </CopyToClipboard>
                                                    </section>
                                                </div>,
                width: 340,
            }, {
                title: '用户类型',
                dataIndex: 'user_type',
                render: (text) => text == 1 ? '代理' : '会员',
                width: 80,
            }, {
                title: '返点级别',
                dataIndex: 'group_level',
                width: 80,
            }, {
                title: '时间',
                dataIndex: 'gmt_create',
                width: 140,
            }, {
                title: '注册数',
                dataIndex: 'register_count',
                width: 70,
            }, {
                title: '备注',
                dataIndex: 'remark',
                width: 100,
            }, {
                title: '启用/禁止',
                dataIndex: 'status',
                render: (text,record)=> <span className="switch">
                                    <Switch checkedChildren="开" unCheckedChildren="关"
                                            defaultChecked={text == 0 ? false : true}
                                            onChange={(checked)=>this.onChangeSwitch(checked, record)}
                                    />
                                </span>,
                width: 90,
            }, {
                title: '操作',
                dataIndex: 'delete',
                render: (text, record)=> <Popconfirm title="确定要删除?" onConfirm={() => this.onDelete(record)}>
                                <a href="javascript:void(0)" style={{color: '#3C77CB'}}>删除</a>
                            </Popconfirm>,
                width: 80,
            }];
        const RadioGroup = Radio.Group;
        const { registerPost, generalizePost, registerSlider, generalizeSlider, list } = this.state;
        return (
            <div className="marke_k_main">
                {
                    this.state.registerLink === 0 ?
                        <ul className="marke_k_list">
                            <li>
                                <span className="marke_k_left left">推广方式：</span>
                                <ul className="marke_k_register_link left">
                                    <li className={this.state.registerLink === 0 ? 'register_link_active' : ''} onClick={()=>{this.setState({registerLink: 0})}}>注册下级</li>
                                    <li className={this.state.registerLink === 1 ? 'register_link_active' : ''} onClick={()=>this.onReneralize()}>推广链接</li>
                                </ul>
                            </li>
                            <li>
                                <span className="marke_k_left">用户类型：</span>
                                <span>
                                    <RadioGroup onChange={(e)=>{this.onRegisterMember(e)}} value={registerPost.usertype}>
                                        <Radio value={1}>代理</Radio>
                                        <Radio value={0}>会员</Radio>
                                      </RadioGroup>
                                </span>
                            </li>
                            <li>
                                <span className="marke_k_left">用户名：</span>
                                <Input className={this.validateUserName()} size="large" placeholder="请输入您的用户名" value={registerPost.username} onChange={(e)=>this.onRegisteruserName(e)}/>
                                <span className="inputText">由字母或数字组成的6-16个字符,不能连续四位相同的字符,首字不能以0或者o开头</span>
                            </li>
                            <li>
                                <span className="marke_k_left">密码：</span>
                                <Input className={this.validateUserPass()} type="password" size="large" placeholder="请输入您的密码"  value={registerPost.userpass} onChange={(e)=>this.onRegisteruserPass(e)}/>
                                <span className="inputText">由字母和数字组成6-16个字符,且必须包含数字和字母</span>
                            </li>
                            <li>
                                <span className="marke_k_left">昵称：</span>
                                <Input className={this.validateNickName()} size="large" placeholder="请输入您的昵称" value={registerPost.nickname} onChange={(e)=>this.onRegisternickName(e)}/>
                                <span className="inputText">由2-6个字符组成</span>
                            </li>
                            <li>
                                <span className="marke_k_left">奖金组：</span>
                                <InputNumber min={1800} max={registerSlider.sliderMax}
                                             step={2}
                                             value={registerPost.groupLevel} size="large"
                                             onChange={(value)=>{this.onRegisterSetBonus(value)}}
                                />
                                <span className="inputText" style={{color: '#444'}}>
                                    自身返点：{((registerSlider.sliderMax - 1800)/20).toFixed(1)}% &nbsp;&nbsp;
                                    用户返点：{((registerPost.groupLevel - 1800)/20).toFixed(1)}% &nbsp;&nbsp;
                                    <strong>保留返点：{(((registerSlider.sliderMax - 1800)/20) - ((registerPost.groupLevel - 1800)/20)).toFixed(1)}%</strong>
                                </span>
                            </li>
                            <li>
                                <span className="marke_k_left"></span>
                                <span>该奖金组剩余配额：{this.state.registerAccountNum < 0 ? '无限' : this.state.registerAccountNum}</span>
                            </li>
                            <li>
                                <span className="marke_k_left"></span>
                                <ul className="m_k_slider">
                                    <li>1800</li>
                                    <li>
                                        <Button disabled={registerPost.groupLevel <= 1800}
                                                icon="minus"
                                                onClick={()=>{
                                                            registerPost.groupLevel = parseInt(registerPost.groupLevel) - 2;
                                                            registerPost.keeppoint = parseFloat(((this.state.selfPoint - this.state.list[registerPost.groupLevel].high)*100).toFixed(1));
                                                            this.setState({
                                                                registerPost: registerPost,
                                                                registerAccountNum: list[registerPost.groupLevel].accnum
                                                            });
                                                        }}
                                        >

                                        </Button>
                                    </li>
                                    <li style={{width: '400px'}}>
                                        <Slider min={1800}
                                                max={registerSlider.sliderMax}
                                                step={2}
                                                onChange={(value)=>{this.onRegisterSetBonus(value)}}
                                                value={registerPost.groupLevel} />
                                    </li>
                                    <li>
                                        <Button disabled={registerPost.groupLevel >= registerSlider.sliderMax}
                                                icon="plus"
                                                onClick={()=>{
                                                    registerPost.groupLevel = parseInt(registerPost.groupLevel) + 2;
                                                    registerPost.keeppoint = parseFloat(((this.state.selfPoint - this.state.list[registerPost.groupLevel].high)*100).toFixed(1));
                                                    this.setState({
                                                        registerPost: registerPost,
                                                        registerAccountNum: list[registerPost.groupLevel].accnum
                                                    });
                                                }}>
                                        </Button>
                                    </li>
                                    <li>{registerSlider.sliderMax}</li>
                                </ul>
                            </li>
                            <li>
                                <span className="marke_k_left"></span>
                                <Button type="primary" size="large" loading={this.state.iconLoadingRegister} onClick={()=>{this.enterIconLoadingRegister()}}>
                                    提交用户
                                </Button>
                            </li>
                        </ul>:
                        <div>
                            <ul className="marke_k_list">
                                <li>
                                    <span className="marke_k_left left">推广方式：</span>
                                    <ul className="marke_k_register_link left">
                                        <li className={this.state.registerLink === 0 ? 'register_link_active' : ''} onClick={()=>{this.setState({registerLink: 0})}}>注册下级</li>
                                        <li className={this.state.registerLink === 1 ? 'register_link_active' : ''} onClick={()=>{this.setState({registerLink: 1})}}>推广链接</li>
                                    </ul>
                                </li>
                                <li>
                                    <span className="marke_k_left">用户类型：</span>
                                    <span>
                                    <RadioGroup onChange={(e)=>{this.onReneralizeMember(e)}} value={generalizePost.usertype}>
                                        <Radio value={1}>代理</Radio>
                                        <Radio value={0}>会员</Radio>
                                      </RadioGroup>
                                </span>
                                </li>
                                <li>
                                    <span className="marke_k_left">奖金组设置：</span>
                                    <span>
                                        <InputNumber min={1800} max={generalizeSlider.sliderMax}
                                                     step={2}
                                                     value={generalizePost.groupLevel} size="large"
                                                     onChange={(value)=>{this.onReneralizeSlider(value)}}
                                        />
                                    </span>
                                </li>
                                <li>
                                    <span className="marke_k_left"></span>
                                    <span>该奖金组剩余配额：{this.state.reneralizeAccountNum < 0 ? '无限' : this.state.reneralizeAccountNum}</span>
                                </li>
                                <li>
                                    <span className="marke_k_left"></span>
                                    <ul className="m_k_slider">
                                        <li>1800</li>
                                        <li>
                                            <Button disabled={generalizePost.groupLevel <= 1800}
                                                    icon="minus"
                                                    onClick={()=>this.onGeneralizeMinus()}>
                                            </Button>
                                        </li>
                                        <li style={{width: '400px'}}>
                                            <Slider min={1800}
                                                    max={generalizeSlider.sliderMax}
                                                    step={2}
                                                    onChange={(value)=>{this.onReneralizeSlider(value)}}
                                                    value={generalizePost.groupLevel} />
                                        </li>
                                        <li>
                                            <Button disabled={generalizePost.groupLevel >= registerSlider.sliderMax}
                                                    icon="plus"
                                                    onClick={()=>this.onGeneralizePlus()}
                                            >
                                            </Button>
                                        </li>
                                        <li>{generalizeSlider.sliderMax}</li>
                                    </ul>
                                </li>
                                <li>
                                    <span className="marke_k_left">备注：</span>
                                    <Input size="large" placeholder="备注" value={generalizePost.remark} onChange={(e)=>this.onReneralizeRemark(e)}/>
                                    <span className="inputText">最多可输入六个文字</span>
                                </li>
                                <li>
                                    <span className="marke_k_left"></span>
                                    <Button type="primary" size="large" icon="plus" loading={this.state.generalizeIconLoading} onClick={()=>{this.enterIconLoadingLink()}}>
                                        生成推广链接
                                    </Button>
                                </li>
                            </ul>
                            <p className="marke_k_register_site">您的推广注册地址</p>
                            <div className="t_l_table_list">
                                <Table columns={columns}
                                       rowKey={record => record.md5_key}
                                       dataSource={this.state.generalizeData}
                                       pagination={false}
                                       loading={this.state.loading}
                                       scroll={{y: 200}}
                                />
                            </div>
                        </div>
                }
            </div>
        );
    }
}
