import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { hashHistory } from 'react-router';
import { stateVar } from '../../State';
import onCanvas from '../Login/canvas';
import {getStore, setStore } from "../../CommonJs/common";
import './AutoLogin.scss';
import logoAuto from '../../Images/logo.png';
import speedSrc from './Img/speed.png'
import dnsSrc from './Img/dns.png'
import serviceSrc from './Img/service.png'
@observer
export default class AutoLogin extends Component {
    constructor(props) {
        super(props);
        this.state={
            count:0,
        }
    }

    tick(){
        if(parseInt(this.state.count)<103){
            this.refs.progress.style.width=parseInt(this.refs.progress.style.width)+0.01*document.body.clientWidth+'px';
            this.setState(preState => (
                preState.count++
            ))
        }else{
            clearInterval(this.interval);
            stateVar.auth=true;
            hashHistory.push('/lottery');
        }
    }
    componentDidMount() {
        onCanvas[0]();
        /*将本地存储变量获取到全局*/
        stateVar.userInfo = {
            userId:getStore("userId"),
            userName: getStore("userName"),
            userType: getStore("userType"),
            accGroup: getStore("accGroup"),
            lastIp: getStore("lastIp"),
            sType: getStore("sType"),
            lastTime: getStore("lastTime"),
            issetbank: getStore("issetbank"),
            setquestion: getStore("setquestion"),
            setsecurity: getStore("setsecurity"),
            email: getStore("email"),
        };
        if(getStore('kefu') != undefined){
            stateVar.httpService = getStore('kefu').kefulink;
            stateVar.httpCS = getStore('kefu').domain;
        }
        this.refs.progress.style.width=0;
        this.interval = setInterval(() => this.tick(), 10);
    };
    componentWillUnmount(){
        clearInterval(this.interval);
        window.removeEventListener('resize', function (event) {
            event.preventDefault();
        });
        if(window._closeAnimationFrame){
            window.cancelAnimationFrame(window._closeAnimationFrame);
        }
    };
    render() {
        return(<div className='autologin_main'>
            <canvas id="canvas"></canvas>
            <div className="l_nav_top">
                <div className="l_nav_top_content">
                    <div className="l_n_t_lt left">
                        <img className="logo" src={logoAuto} />
                    </div>
                    <ul className="l_n_t_list right">
                        <li className='l_speed'>
                            <img  src={speedSrc}  /><span>域名测速</span></li>
                        <li className='l_dns'>
                            <img  src={dnsSrc}  /><span>防劫持教程</span></li>
                        <li className='l_sevice'>
                            <img  src={serviceSrc} /><span>在线客服</span></li>
                    </ul>
                </div>
            </div>
            <div className='al_progress' ref="progress"></div>
            <p className='al_text'>自动登录中...</p>
        </div>);
    }
}
