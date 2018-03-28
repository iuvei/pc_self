/*综合游戏*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Row, Col, Button, Modal, Input } from 'antd';
import { stateVar } from '../../State';
import { hashHistory } from 'react-router';
import Fetch from '../../Utils';
import { onValidate } from '../../CommonJs/common';
import './OtherGames.scss'

const allBalance = stateVar.allBalance;
const otherGamesArr = [
    {
        name: '博饼',
        link: '/otherGames/bobing',
        id: 'bb',
        disabled: true,
        money: allBalance.bobingBalance,
    },{
        name: 'EA娱乐城',
        link: '/otherGames/ea',
        id: 'ea',
        disabled: true,
        money: allBalance.eabalance,
    },{
        name: 'PT游戏',
        link: '/otherGames/pt',
        id: 'pt',
        disabled: true,
        money: allBalance.ptbalance,
    },{
        name: 'KGAME游戏',
        link: '/otherGames/gt',
        id: 'gt',
        disabled: true,
        money: allBalance.kgbalance,
    },{
        name: '体育竞技',
        link: '/otherGames/sport',
        id: 'sport',
        disabled: true,
        money: allBalance.sbbalance,
    }
];
@observer
export default class OtherGames extends Component {
    constructor(props) {
        super(props);
        this.state = {
            otherGamesArr: otherGamesArr,
            visible: false,
            eaPostData: {
                userName: '',
                email: '',
                phone: '',
                navname: '', // 真人娱乐, 体彩中心
            },
            btnLoading: false,
            activeItem: {},
            validate: {
                userName: 2,// 0: 对， 1：错
                email: 2,
                phone: 2,
            }
        };
    };
    componentDidMount(){
        this._ismount = true;
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    onHashHistory(item) {
        let {otherGamesArr} = this.state;
        otherGamesArr.forEach(function(items){
            if(items['id']==item.id){
                items['disabled'] = false;
            }
        });

        this.setState({activeItem: item, otherGamesArr});
        if(item.id == 'bb'){
            this.onBobing(item);
        }else if(item.id == 'ea'){
            this.onEa(item);
        }else if(item.id == 'pt'){
            this.onPt(item);
        }else if(item.id == 'gt'){
            this.onGt(item);
        }else if(item.id == 'sport'){
            this.onSport(item);
        }else{}
    };

    onForEach(item){
        let {otherGamesArr} = this.state;
        otherGamesArr.forEach(function(items){
            if(items['id']==item.id){
                items['disabled'] = true;
            }
        });
        this.setState({otherGamesArr});
    };
    /*是否有权限进入Ea*/
    onEa(item) {
        Fetch.eagame({
            method: 'POST'
        }).then((res)=>{
            if(this._ismount){
                this.onForEach(item);
                if(res.status == 200){
                    hashHistory.push(item.link);
                }else{
                    let {eaPostData} = this.state;
                    eaPostData.navname = '真人娱乐';
                    if(res.shortMessage == '请填个人写资料'){
                        this.setState({
                            visible: true,
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
    /*是否有权限进入pt*/
    onPt(item) {
        Fetch.ptindex({
            method: 'POST',
        }).then((res)=>{
            if(this._ismount){
                this.onForEach(item);
                if(res.status == 200){
                    hashHistory.push(item.link);
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*是否有权限进入体育竞技*/
    onSport(item){
        Fetch.sport({
            method: 'POST',
            body: JSON.stringify({"do":"login"})
        }).then((res)=>{
            if(this._ismount){
                this.onForEach(item);
                if(res.status == 200){
                    hashHistory.push(item.link);
                }else{
                    let {eaPostData} = this.state;
                    eaPostData.navname = '体彩中心';
                    if(res.shortMessage == '请填个人写资料'){
                        this.setState({
                            visible: true,
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
    /*是否有权限进入GT娱乐*/
    onGt(item){
        Fetch.gtLogin({
            method: 'POST'
        }).then((res)=>{
            if(this._ismount){
                this.onForEach(item);
                if(res.status == 200){
                    hashHistory.push(item.link);
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*是否有权限进入博饼*/
    onBobing(item) {
        Fetch.newGetprizepool({
            method: 'POST'
        }).then((res)=>{
            if(this._ismount){
                this.onForEach(item);
                if(res.status == 200){
                    hashHistory.push(item.link);
                }else{
                    Modal.warning({
                        title: res.data,
                    });
                }
            }
        })
    };
    getAddUserInfo() {
        let {validate} = this.state;
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
                    this.onCancel();
                    this.onHashHistory(this.state.activeItem);
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
            visible: false,
            eaPostData,
            validate
        });
    };
    render() {
        const { otherGamesArr, visible, eaPostData } = this.state;
        return (
            <div className={`otherGames_main theme-${stateVar.activeTheme}`}>
                <Row type="flex" justify="center" align="top" className="main_width" >
                    <Col span={24}>
                        <ul className="activity_list clear">
                            {
                                otherGamesArr.map((item)=>{
                                    return (
                                        <li key={item.name}>
                                            <img src={require('./Img/'+item.id+'.jpg')}/>
                                            <div className="activity_participation clear">
                                                <div className="left">
                                                    <p>{item.name}</p>
                                                    <p className="active_bonus">账户余额：{item.money} 元</p>
                                                </div>
                                                <Button className="right"
                                                        onClick={()=>this.onHashHistory(item)} type="primary" size="large"
                                                        loading={!item.disabled}
                                                >
                                                    立即游戏
                                                </Button>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </Col>
                </Row>

                <Modal
                    title="完善个人资料"
                    width={480}
                    wrapClassName="ea_content"
                    visible={visible}
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
