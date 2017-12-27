import React, {Component} from 'react';
import {observer} from 'mobx-react';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import QueueAnim from 'rc-queue-anim';

import './HomeMainBottom.scss'

import hzyh_icon from '../Img/hzyh_icon.png'

@observer
export default class HomeMainBottom extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    };

    render() {
        return (
            <OverPack playScale={0.2}
                      className="home_m_bottom"
            >
                    <QueueAnim type="bottom"
                               component="ul"
                               className="home_m_bottom_list clear"
                               key="ul"
                               leaveReverse
                    >
                        <li key="01">
                            <div className="home_m_recharge_top clear">
                                <div className="home_m_top_left left">
                                    <h3>充值</h3>
                                    <h4>到账时间</h4>
                                </div>
                                <div className="home_m_top_right left">
                                    <span className="home_m_time">0.3</span>
                                    <span>秒</span>
                                </div>
                            </div>
                            <p>平台支持超过28家银行充值，可24小时在线充值。充值平均每笔到账时间为0.3秒，充值贴心不收手续费。</p>
                        </li>
                        <li key="02">
                            <div className="home_m_recharge_top clear">
                                <div className="home_m_top_left left">
                                    <h3>提款</h3>
                                    <h4>到账时间</h4>
                                </div>
                                <div className="home_m_top_right left">
                                    <span className="home_m_time">30</span>
                                    <span>秒</span>
                                </div>
                            </div>
                            <p>平台拥有自主研发全自动审核及付款系统，提款平均每笔到账时间为30秒，提款极速到账，无需更多等待。</p>
                        </li>
                        <li key="03">
                            <div className="home_m_recharge_top clear">
                                <div className="home_m_top_left left">
                                    <h3>平台</h3>
                                    <h4>最新加密技术</h4>
                                </div>
                                <div className="home_m_top_right left">
                                    <span className="home_m_time">1024</span>
                                </div>
                            </div>
                            <p>采用最先进的数据加密技术。交易信息以非明文方式传输和存储，即使外部入侵，数据也不可读，万无一失，固若金汤。</p>
                        </li>
                        <li key="04">
                            <div className="home_m_recharge_top clear">
                                <div className="home_m_top_left left">
                                    <h3>合作</h3>
                                    <h4>提供安全保障</h4>
                                </div>
                                <div className="home_m_top_right left">
                                    <span className="home_m_time">28</span>
                                    <span>家</span>
                                </div>
                            </div>
                            <img style={{marginLeft: 10}} src={hzyh_icon} alt=""/>
                        </li>
                    </QueueAnim>
            </OverPack>
        )
    }
}
