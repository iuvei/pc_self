/*右边快捷方式组件*/
import {observer} from 'mobx-react';
import React, {Component} from 'react';
import {Icon, Popover, Modal, Input, Button} from 'antd';
import {Link} from 'react-router';
import Fetch from '../../../Utils';
import './Rightplug.scss'
import {stateVar} from '../../../State';
import md5 from 'md5';
import {setStore, getStore, onValidate} from "../../../CommonJs/common";
import ComplainAndSuggests from "../ComplainAndSuggests/ComplainAndSuggests";
import Chat from '../../Chat/Chat';
import notice_icon from './Img/notice_icon.png';
const lotteryType = require('../../../CommonJs/common.json').lotteryType;
/*当前浏览器url地址*/
@observer
export default class RightPlug extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,      //控制投诉建议模态框的显示
            modalVisible: false,
            visibleApp: false,
            showMsg: false,
            capitalVisible: false,
            capitalPass: '', // 资金密码
            validate: {
                capitalPass: 2
            },
            btnLoading: false,
            hintText: '',
            winningList: [], //中奖信息列表
        };
        this.hideChat = this.hideChat.bind(this);
        this.hideTousuModal = this.hideTousuModal.bind(this);
    };

    componentDidMount() {
        this._ismount = true;
        let cw = document.body.clientWidth;
        if (cw < 1340) {
            this.hideRight()
        }
        this.onGetIframe();
        this.getWinningList();
        /*添加全局方法，给后台调用*/
        let _this = this;
        window.onShowMsg = function (type) {
            if (type == 1) {
                _this.setState({showMsg: true});
            } else {
                _this.setState({showMsg: false});
            }
        };
    };

    componentWillUnmount() {
        this._ismount = false;
        if(this.noticeIntervals){
            clearInterval(this.noticeIntervals)
        }
    };

    onGetIframe() {
        return (
            <iframe scrolling="no"
                    id="lt_main" name="lt_main"
                    style={{display: 'none'}}
                    src={stateVar.httpUrl + '/pcservice/?controller=user&action=UserTeam&tag=html&sess=' + getStore('session')}
            >
            </iframe>
        )
    };

    /* 换肤选项卡 */
    getThemeSelect() {
        return (
            <div className='theme-select'>
                <ul>
                    <li
                        className={`left  ${stateVar.activeTheme === 'white' ? 'active' : ''}`}
                        onClick={() => {
                            stateVar.changeTheme('white')
                        }}>
                        <p>白色</p>
                    </li>
                    <li className={`left  ${stateVar.activeTheme === 'gray' ? 'active' : ''}`}
                        onClick={() => {
                            stateVar.changeTheme('gray')
                        }}>
                        <p>灰色</p>
                    </li>
                    <li className={`left  ${stateVar.activeTheme === 'black' ? 'active' : ''}`}
                        onClick={() => {
                            stateVar.changeTheme('black')
                        }}>
                        <p>黑色</p>
                    </li>
                </ul>
            </div>
        )
    };

    updateLine() {
        let Img = new Image,
            startTime = new Date().getTime(),
            _this = this;
        Img.src = stateVar.httpUrl + '/speed/img/Login.png?' + startTime;
        Img.onload = function () {
            let speed = Math.round(43.8 * 1000 /(new Date().getTime() - startTime));
            setStore('speed', speed);
            _this.setState({});
        }
    };

    /*域名测速*/
    getSpeed() {
        return (
            <div className="r_p_speed">
                <p>
                    当前速度：
                    <span className="col_color_shu">{getStore('speed')}KB/S</span>
                </p>
                <p>
                    <Button className="btn_cesu" onClick={()=>this.updateLine()}>
                        重新测速
                    </Button>
                    <Button>
                        <Link to="/login">
                            更换路线
                        </Link>
                    </Button>
                </p>
            </div>
        )
    }

    transferMsg(visible) {
        this.setState({
            visible
        });
    };

    hideRight() {
        $(".right_plug").animate({right: '-140px'}, 500, () => {
            $(".right_plug_open").animate({right: '0'}, 200);
            stateVar.paused = false;
        });
    };

    openRight() {
        $(".right_plug_open").animate({right: '-20px'}, 200, () => {
            $(".right_plug").animate({right: '0'}, 500);
            stateVar.paused = true;
        });
    };

    switchOld() {
        window.location.href = '/?controller=default&action=switch&_v=3.0';
    };

    /*关闭上下级聊天*/
    hideChat() {
        this.setState({modalVisible: false})
    };

    /*关闭投诉模态框*/
    hideTousuModal() {
        this.setState({visible: false})
    };

    onCancelCapital() {
        let {validate} = this.state;
        validate.capitalPass = 2;
        this.setState({
            capitalVisible: false,
            validate,
            capitalPass: null,
            btnLoading: false,
            hintText: null
        })
    };

    onChangeCapitalPass(e) {
        let val = e.target.value,
            {validate} = this.state;
        if (val) {
            validate.capitalPass = 0
        } else {
            validate.capitalPass = 1
        }
        this.setState({
            validate,
            capitalPass: val,
        })
    };

    /*验证资金密码*/
    getCapitalPass() {
        let {validate, capitalPass} = this.state;
        if (validate.capitalPass == 0) {
            this.setState({btnLoading: true});
            Fetch.checkpass({
                method: 'POST',
                body: JSON.stringify({
                    secpass: md5(capitalPass),
                    flag: 'check'
                })
            }).then((res) => {
                if (this._ismount) {
                    this.setState({btnLoading: false});
                    if (res.status == 200) {
                        this.onCancelCapital();
                        this.setState({
                            modalVisible: true,
                            capitalVisible: false,
                        });
                        setStore('kefuStatus', true)
                    } else {
                        validate.capitalPass = 1;
                        this.setState({
                            hintText: res.shortMessage,
                            validate,
                        });
                    }
                }
            })
        } else {
            validate.capitalPass = 1;
            this.setState({validate});
        }
    };

    getWinningList(){
        let winningListFlag = [];
        for(let i = 0; i < 20; i++){
            let nameFlag = Math.random().toString(36).substr(2);
            let object = {
                name: nameFlag.slice(1, 2) + '******' + nameFlag.slice(-1),
                lottery: lotteryType[Math.floor(Math.random()*lotteryType.length)].cnname,
                money: Math.floor(Math.random() * 99999 + 100)
            };
            winningListFlag.push(object);
        }
        this.setState({
                winningList: winningListFlag
            },
            ()=>this.getDestinations()
        )
    };
    getDestinations() {
        let times = 1,
            duration = 40,
            noticeListFlag = this.state.winningList;
        $(".winning_list").css('height',duration*noticeListFlag.length);
        $(".winning_list").css('top',0);
        $(".winning_list").stop();
        if(noticeListFlag.length <= 1){
            return;
        }
        if(this.noticeIntervals){
            clearInterval(this.noticeIntervals);
        }
        this.noticeIntervals = setInterval(()=>{
            if(noticeListFlag.length <= 1){
                return;
            }
            if(times >= noticeListFlag.length){
                times = 0;
                $(".winning_list").css('top',0);
            }
            $(".winning_list").animate({top:'-'+duration*times},500,()=>{
                times++;
            });
        },2000);
    };
    closeWinning() {
        if(this.noticeIntervals){
            clearInterval(this.noticeIntervals)
        }
        $(".winning_content").animate({bottom: '-40'},500,()=>{
            stateVar.visibleWinning = false;
        });
    };

    render() {
        const {modalVisible, capitalVisible, hintText, winningList} = this.state;
        const {userInfo, visibleWinning} = stateVar;
        return (
            <div>
                {
                    modalVisible ?
                        <Chat
                            visible={modalVisible}
                            hideChat={this.hideChat}
                        />
                        :
                        null
                }
                <div className="box-shape right_plug" style={{right: stateVar.paused ? 0 : '-140px'}}>
                    <ul className="right_list">
                        {
                            userInfo.sType == 'demo' ?
                                null :
                                <li>
                                    <p className="r_p_goOld r_p_common" onClick={() => this.switchOld()}>
                                        返回旧版
                                    </p>
                                </li>
                        }
                        <li>
                            <p className="r_p_kehuzx r_p_common">
                                <a href={stateVar.httpService} target="_blank">
                                    客户咨询
                                </a>
                            </p>
                        </li>
                        {
                            userInfo.sType == 'demo' ?
                                null :
                                <li className="lianxi_p">
                                    {
                                        this.state.showMsg ? <b className="r_p_common_extent"></b> : null
                                    }
                                    <p className="r_p_kefu r_p_common" onClick={() => this.setState({modalVisible: true})}>上下级聊天</p>
                                </li>
                        }
                        <li>
                            <Popover placement="left" content={
                                this.getThemeSelect()
                            }>
                                <p className="r_p_theme r_p_common">
                                    背景换肤
                                </p>
                            </Popover>
                        </li>
                        <li>
                            <p className="r_p_tousu r_p_common" onClick={() => this.setState({visible: true})}>
                                投诉建议
                            </p>
                            {
                                this.state.visible ?
                                    <ComplainAndSuggests visible={this.state.visible}
                                                         title="投诉建议"
                                                         transferMsg={visible => this.transferMsg(visible)}
                                                         hideTousuModal={() => this.hideTousuModal()}
                                    /> :
                                    null
                            }
                        </li>
                        <li>
                            <Popover placement="left" content={
                                this.getSpeed()
                            }>
                                <p className="r_p_cesu r_p_common">
                                    域名测速
                                </p>
                            </Popover>
                        </li>
                    </ul>
                    <div className='r_caret-right' onClick={() => this.hideRight()}>
                        <Icon type="double-right"/>
                    </div>
                </div>
                {
                    visibleWinning ?
                        <div className="winning_content">
                            <div className="show_winning">
                                <ul className="winning_list">
                                    {
                                        winningList.map((item, ind)=>{
                                            return (
                                                <li key={ind}>
                                                    <img src={notice_icon}/>
                                                    恭喜：
                                                    {item.name}
                                                    , 在【
                                                    {item.lottery}
                                                    】&nbsp;中奖：
                                                    {item.money}
                                                    元
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                                <Icon className="close_winning hover right" onClick={()=>this.closeWinning()} type="close" />
                            </div>
                        </div>
                        :
                        null
                }

                <div className="box-shape right_plug_open" style={{right: stateVar.paused ? '-20px' : '0'}}>
                    <div className='openRight' onClick={() => {
                        this.openRight()
                    }}>
                        <Icon type="double-left"/>
                    </div>
                </div>

                <Modal
                    title="验证资金密码"
                    width={400}
                    wrapClassName="vertical-center-modal capitalPass_modal"
                    visible={capitalVisible}
                    onCancel={() => this.onCancelCapital()}
                    footer={null}
                    maskClosable={false}
                >
                    <ul className="info_list">
                        <li>
                            <span>资金密码：</span>
                            <Input placeholder="请输入您的资金密码"
                                   type="password"
                                   value={this.state.capitalPass}
                                   onChange={(e) => this.onChangeCapitalPass(e)}
                                   size="large"
                                   className={onValidate('capitalPass', this.state.validate)}
                            />
                            <p className="hint_text">{hintText}</p>
                        </li>
                        <li className="btn">
                            <Button type="primary"
                                    onClick={() => this.getCapitalPass()}
                                    loading={this.state.btnLoading}
                            >
                                提交
                            </Button>
                        </li>
                    </ul>
                </Modal>
            </div>
        );
    }
}

