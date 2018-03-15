import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { stateVar } from '../../../State';
import Fetch from '../../../Utils';
import { Button, Input, Modal, Pagination, message, Spin, Icon } from 'antd';
const Search = Input.Search;
import emitter from '../../../Utils/events';
import TweenOne from 'rc-tween-one';
import ChildNav from '../../Common/ChildNav/ChildNav';
import CM_transfer from '../CM_transfer/CM_transfer';

import './PT.scss'

import ranking0 from './Img/ranking0.png';
import ranking1 from './Img/ranking1.png';
import ranking2 from './Img/ranking2.png';
import close from './Img/close.png';
import resetPw_btn from './Img/resetPw_btn.png';

@observer
export default class PT extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navIndex: 0,
            visible: false,
            spinLoading: false,
            resetVisible: false, //重置密码弹出框
            startLoading: false, //开始游戏
            demoLoading: false, //免费试玩
            total: 0,
            listPostData: {
                cate_id: 0, // 0全部游戏
                ptname: null, // 搜索游戏名
                p: 1,
                pn: 12, //每页显示条数
            },
            navList: [], //游戏分类
            gameList: [], // 游戏列表
            topRanking: [], //top游戏排行榜
            ptName: '', // 重置密码 获取的用户名
            resetPw: '',

            startVisible: false,
            ptUrl: '',
            ptLoading: false,

            paused: true,
            step: 0,
        };
        this.hideModal = this.hideModal.bind(this);
        this.onTransfer = this.onTransfer.bind(this);
    };
    componentDidMount() {
        this._ismount = true;
        this.listGetData();
        this.onRankingList();
    }
    componentWillUnmount() {
        this._ismount = false;
        // 清除定时器与暂停动画
    };
    /*获取游戏列表*/
    listGetData() {
        Fetch.ptindex({
            method: 'POST',
            body: JSON.stringify(this.state.listPostData)
        }).then((res)=>{
            if(this._ismount && res.status == 200){
                let data = res.repsoneContent,
                    allGame = {
                        id: '0',
                        name: '全部游戏',
                    };
                data.usecatesrs.unshift(allGame);
                this.setState({
                    navList: data.usecatesrs,
                    gameList: data.aList,
                    total: parseInt(data.offects)
                });
            }
        })
    };
    /*切换游戏类型*/
    onChangeNavIndex(index, item) {
        this.setState({navIndex: index});
        let listPostData = this.state.listPostData;
        listPostData.cate_id = item.id;
        listPostData.ptname = null;
        listPostData.p = 1;
        this.setState({listPostData: listPostData},()=>this.listGetData());
    };

    /*切换页面时*/
    onChangePagination(page) {
        let listPostData = this.state.listPostData;
        listPostData.p = page;
        this.setState({listPostData: listPostData},()=>this.listGetData());
    };
    /*游戏名称搜索*/
    onSearchName(val) {
        let listPostData = this.state.listPostData;
        listPostData.ptname = val;
        this.listGetData();
    };
    /*TOP游戏排行榜*/
    onRankingList() {
        Fetch.ptindex({
            method: 'POST',
            body: JSON.stringify({cate_id: 0, ishot: 1, pn: 10})
        }).then((res)=>{
            if(this._ismount && res.status == 200){
                this.setState({topRanking: res.repsoneContent.aList},
                )
            }
        })
    };
    /*开始游戏或免费试玩*/
    onStartGame(id, isdemo, type) {
        if(type == 'start'){
            this.setState({
                startVisible: true,
                startLoading: true,
                ptLoading: true,
            })
        }
        if(type == 'demo'){
            this.setState({
                startVisible: true,
                demoLoading: true,
                ptLoading: true,
            })
        }
        this.onptplay(id, isdemo);
    };
    /*开始游戏*/
    onptplay(id, isdemo){
        Fetch.ptplay({
            method: 'POST',
            body: JSON.stringify({id: id, isclick: 1, isdemo: isdemo}),
        }).then((res)=>{
            if(this._ismount && res.status == 200) {
                this.setState({
                    demoLoading: false,
                    startLoading: false,
                });
                let data = res.repsoneContent;
                let formData = new FormData();
                formData.append("userinfo",data.sUserinfostr);
                formData.append("token",data.token);
                Fetch.ptlogin_new({
                    method: 'POST',
                    body: formData,
                }).then((res)=>{
                    // let ress = JSON.parse(res);
                    if(res.status == 200) {
                        this.setState({
                            ptLoading: false,
                            ptUrl: res.repsoneContent.aUserinfo.returnurl,
                        });
                        // let datas = ress.repsoneContent;
                        // window.open (datas.aUserinfo.returnurl);
                    }
                })
            }
        })
    };
    /*重置密码获取用户名*/
    onResetPw() {
        this.setState({resetVisible: true});
        if(this.state.ptName != ''){
            return
        }
        Fetch.showsetpwd({
            method: 'POST',
        }).then((res)=>{
            if(this._ismount && res.status == 200) {
                this.setState({ptName: res.repsoneContent.ptname})
            }
        })
    }
    /*确认重置密码*/
    onAffirmReset(){
        let resetPw = this.state.resetPw;
        if(resetPw == '') {
            return
        }
        Fetch.setpwdcommit({
            method: 'POST',
            body: JSON.stringify({pwd: resetPw})
        }).then((res)=>{
            if(this._ismount && res.status == 200){
                message.success(res.shortMessage);
            }else{
                Modal.warning({
                    title: res.shortMessage,
                });
            }
        })
    };
    /*转账*/
    onTransfer(type, intoMoney, outMoney) {
        this.setState({spinLoading: true});
        let postData = {};
        if(type == 'into') {
            postData = {
                targetpt: 2,
                frompt: 's',
                money: intoMoney,
                tag: 'transfer',
            }
        }else{
            postData = {
                targetpt: 's',
                frompt: 2,
                money: outMoney,
                tag: 'transfer',
            }
        }
        Fetch.pttranfer({
            method: 'POST',
            body: JSON.stringify(postData),
        }).then((res)=>{
            if(this._ismount){
                this.setState({spinLoading: false});
                if(res.status == 200){
                    Modal.success({
                        title: res.shortMessage,
                    });
                    this.setState({visible: false});
                    emitter.emit('changeMoney');
                }else{
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
    /*向左滑动*/
    onClickLeft() {
        let { step } = this.state;
        if(step >= 0){
            return
        }
        this.setState({
            step: step + 170,
            paused: false,
        });
    };
    /*向右滑动*/
    onClickRight() {
        let { step, topRanking } = this.state;
        if(topRanking.length * 170 + step > 1100){
            this.setState({
                step: step - 170,
                paused: false,
            });
        }
    };
    /*关闭游戏*/
    onCloseGames(){
        this.setState({
            startVisible: false,
            step: 0,
        })
    };
    render() {
        const { startVisible, navList, gameList, topRanking, total, ptName, resetPw } = this.state;

        return (
            <div className="pt">
                <div className="pt_content">
                    <ChildNav navList={navList} onChangeNavIndex={this.onChangeNavIndex.bind(this)}/>
                    <div className="pt_content_games clear">
                        <div className="left">
                            <ul className="games_list clear">
                                {
                                    gameList.map((item, i)=>{
                                        return (
                                            <li key={item.id}>
                                                <img src={stateVar.httpUrl + item.pic} width={'100%'} className="games_type" alt=""/>
                                                <p className="games_name">{item.cn_name}</p>
                                                <div className="games_hover">
                                                    <Button type="primary" loading={this.state.startLoading} onClick={()=>this.onStartGame(item.id, '0', 'start')}>开始游戏</Button>
                                                    <div className="demo_btn" style={{display: item.isdemo == 1 ? '' : 'none'}}>
                                                        <Button type="primary" loading={this.state.demoLoading} onClick={()=>this.onStartGame(item.id, '1', 'demo')}>免费试玩</Button>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                            <Pagination style={{display: total <= 0 ? 'none' : ''}}
                                        onChange={(page)=>this.onChangePagination(page)}
                                        defaultCurrent={1}
                                        total={total}
                                        className="right"
                            />
                        </div>
                        <div className="pt_right_content right">
                            <Search
                                placeholder="游戏名称搜索"
                                style={{ width: 220 }}
                                onSearch={value => this.onSearchName(value)}
                            />
                            <div className="pt_balance_content">
                                <p>PT娱乐城</p>
                                <div className="balance_text">
                                    <h3>账号余额： </h3>
                                    <h3>￥{stateVar.allBalance.ptbalance}元</h3>
                                    <Button type="primary" onClick={()=>this.setState({visible: true})}>转账</Button>
                                    <Button type="primary" onClick={()=>this.onResetPw()}>重置密码</Button>
                                </div>
                            </div>
                            <div className="pt_balance_content">
                                <p>
                                    <b>TOP游戏排行榜</b>
                                </p>
                                <div className="pt_top_content">
                                    <ul className="ranking_list">
                                        {
                                            topRanking.slice(0, 3).map((item, i)=>{
                                                return (
                                                    <li key={item.id}>
                                                        <img src={stateVar.httpUrl + '/pcservice/' + item.pic} alt=""/>
                                                        <div className="ranking_info">
                                                            <img src={ranking0} style={{display: i == 0 ? '' : 'none'}} alt=""/>
                                                            <img src={ranking1} style={{display: i == 1 ? '' : 'none'}} alt=""/>
                                                            <img src={ranking2} style={{display: i == 2 ? '' : 'none'}} alt=""/>
                                                            <h4 className="ellipsis">{item.cn_name}</h4>
                                                            <h5 className="ellipsis">{item.name}</h5>
                                                        </div>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal
                    visible={this.state.resetVisible}
                    maskClosable={false}
                    closable={false}
                    footer={null}
                    width={479}
                    className="pt_resetModal"
                >
                    <img className="pt_reset_close right" onClick={()=>this.setState({resetVisible: false})} src={close} alt="关闭"/>
                    <div className="pt_title">
                        <h1>请重置您的PT登录密码</h1>
                        <h2>（PC端和手机端）</h2>
                        <h3>用户名：{ptName}</h3>
                    </div>
                    <ul className="pt_reset_money">
                        <li>
                            <span>密码：</span>
                            <Input type="password"
                                   value={resetPw}
                                   onChange={(e)=>this.setState({resetPw: e.target.value})}
                                   size="large" placeholder="请输入重置密码"
                            />
                        </li>
                        <li className="pt_prompt">
                            温馨提示：首次下载客户端的用户需要在恒彩官网PT游戏页面重置密码才可登录！
                        </li>
                    </ul>
                    <p className="resetPw_btn">
                        <img src={resetPw_btn} onClick={()=>this.onAffirmReset()} alt=""/>
                    </p>
                </Modal>
                <Modal visible={startVisible}
                       closable={false}
                       // mask={false}
                       style={{ top: 110 }}
                       footer={null}
                       width='100%'
                       loading={this.state.ptLoading}
                       className="pt_modal"
                >
                    <div className="pt_m_content">
                        <Button className="modal_close" onClick={()=>this.onCloseGames()} type="primary" icon="close"></Button>
                        <Spin className="pt_loading" spinning={this.state.ptLoading} tip="加载中..."/>
                        {
                            startVisible ? <iframe scrolling="no"
                                                   id="main" name="main"
                                                   src={this.state.ptUrl}
                                                   className="pt_iframe"
                            >
                            </iframe> : null
                        }

                        <div className="icon_p">
                            <Icon type="left-circle" className="ic_left-circle"
                                  onClick={()=>this.onClickLeft()}
                            />
                            <div className="pt_m_gameList">
                                <TweenOne
                                            animation={{left: this.state.step + 'px', duration: 300}}
                                            paused={this.state.paused}
                                            className="box-shape"
                                >
                                <ul className="games_list clear" style={{width: topRanking.length * 170}}>
                                    {
                                        topRanking.map((item, i)=>{
                                            return (
                                                <li key={item.id} onClick={()=>this.onptplay(item.id, item.isdemo)}>
                                                    <img src={stateVar.httpUrl + '/pcservice/' + item.pic} alt=""/>
                                                    <p className="games_name">{item.cn_name}</p>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                                </TweenOne>
                            </div>
                            <Icon type="right-circle" className="ic_right-circle"
                                  onClick={()=>this.onClickRight()}
                            />
                        </div>
                    </div>

                </Modal>
                <CM_transfer title="PT"
                             visible={this.state.visible}
                             spinLoading = {this.state.spinLoading}
                             hideModal={this.hideModal}
                             onTransfer={this.onTransfer}
                />
            </div>
        )
    }
}
