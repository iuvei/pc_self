import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { hashHistory } from 'react-router';
import { stateVar } from '../../State';
import {getStore } from "../../CommonJs/common";
import './AutoLogin.scss';
import logoAuto from '../../Images/logo.png';
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
            <div className="l_nav_top">
                <img className="l_n_t_lt" src={logoAuto} />
            </div>
            <div className='al_progress' ref="progress"></div>
            <p className='al_text'>自动登录中...</p>
        </div>);
    }
}
