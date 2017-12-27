import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import {observer} from 'mobx-react';
import TweenOne from 'rc-tween-one';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import QueueAnim from 'rc-queue-anim';

import './HomeMainTop.scss'

@observer
export default class HomeMainTop extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    };
    componentDidMount() {
        /*动态定义首页背景图父元素的高度*/
        let _this = this;
        window.onload = function() {
            let homeBanner = ReactDOM.findDOMNode(_this.refs.homeBanner);
            homeBanner.style.height = document.documentElement.clientHeight - 120 + 'px';
        }
    };
    componentDidUpdate() {

    }
    render() {
        const oneAnim = { y: '+=30', opacity: 0, type: 'from', ease: 'easeOutQuad' };
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
                            key="h3"
                            animation={oneAnim}
                            component="h3"
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
                            key="h3_v2"
                            animation={{ ...oneAnim, delay: 200 }}
                            component="h3"
                        >
                            随时随地随心，从此财富只在指尖流动
                        </TweenOne>
                        <TweenOne
                            key="download"
                            animation={{ ...oneAnim, delay: 300 }}
                        >
                            <a href="#" className="home_m_top_download">立即下载</a>
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
