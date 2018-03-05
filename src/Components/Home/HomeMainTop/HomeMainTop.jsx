import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import {observer} from 'mobx-react';
import { hashHistory } from 'react-router';
import { stateVar } from '../../../State';
import TweenOne from 'rc-tween-one';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import QueueAnim from 'rc-queue-anim';

import './HomeMainTop.scss'

@observer
export default class HomeMainTop extends Component {
    constructor(props) {
        super(props);
    };
    componentDidMount() {
        /*动态定义首页背景图父元素的高度*/
        let _this = this;
        window.onload = function() {
            let homeBanner = ReactDOM.findDOMNode(_this.refs.homeBanner);
            homeBanner.style.height = document.documentElement.clientHeight - 120 + 'px';
        }
    };
    onHashHistory() {
        hashHistory.push({
            pathname: '/downLoadClient',
            query: {
                id: 1
            }
        });
        stateVar.navIndex = null;
    };

    render() {
        const oneAnim = { y: '+=0', opacity: 0, type: 'from', ease: 'easeOutQuad' };
        return (
            <OverPack
                replay
                playScale={[0.3, 0.1]}
                className="home_m_top"
            >
                <QueueAnim
                    type={['bottom', 'top']}
                    delay={200}
                    className="home_m_banner"
                    key="text"
                    ref="homeBanner"
                >
                    <div className="home_m_top_text" key="OverPack01">
                        <TweenOne
                            key="h4"
                            animation={oneAnim}
                            component="h4"
                            reverseDelay={100}
                        >
                            MOBILE PHONE CLIENT
                        </TweenOne>
                        <TweenOne
                            key="h1"
                            animation={{ ...oneAnim, delay: 100 }}
                            component="h1"
                        >
                            恒彩手机客户端
                        </TweenOne>
                        <TweenOne
                            key="h3"
                            animation={{ ...oneAnim, delay: 200 }}
                            component="h3"
                        >
                            随 时 随 地 随 心， 从 此 财 富 只 在 指 尖 流 动
                        </TweenOne>
                        <TweenOne
                            key="download"
                            animation={{ ...oneAnim, delay: 300 }}
                        >
                            {/*<a href="https://m.h88c05.com/" className="home_m_top_download" target="_blank">立即下载</a>*/}
                            <span onClick={()=>this.onHashHistory()} className="home_m_top_download">立即下载</span>
                        </TweenOne>
                    </div>
                </QueueAnim>
                <TweenOne
                    animation={{ y: '-=20', yoyo: true, repeat: -1, duration: 1000 }}
                    className="home_m_top_down_icon"
                    key="icon"
                >
                </TweenOne>
            </OverPack>
        )
    }
}
