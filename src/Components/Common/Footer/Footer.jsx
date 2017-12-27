import React, {Component} from 'react';
import {observer} from 'mobx-react';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import QueueAnim from 'rc-queue-anim';
import { Link} from 'react-router';
import './Footer.scss'
import footer_1 from './Img/footer_1.png'
import footer_2 from './Img/footer_2.png'
import footer_bottom from './Img/footer_bottom.png'

@observer
export default class Footer extends Component {
    render() {
        return (
            <div className="footer">
                <div className="f_partner">
                    <ul className="f_partner_list clear">
                        <li key="footerLi01">
                            <div className="f_partner_text">合作伙伴</div>
                            <div><img src={footer_1} alt=""/></div>
                        </li>
                        <li className="f_warm_prompt" key="footerLi02">
                            <ul className="f_warm_prompt_list clear">
                                <li>
                                    <Link to={`/helpInfo/aboutHengCai?navIndex=3`}>
                                        <span>关于恒彩</span><span>|</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={`/helpInfo`}>
                                        <span>帮助中心</span><span>|</span>
                                    </Link>
                                </li>
                                <li>
                                    <a href="#">手机客户端</a><span>|</span>
                                </li>
                                <li>
                                    <a href="#">PC客户端</a><span>|</span>
                                </li>
                                <li>
                                    <a href="#">放劫持教程</a>
                                </li>
                            </ul>
                            <p>恒彩郑重提示：彩票有风险，投注需谨慎，未满18周岁的青少年禁止购彩</p>
                            <p>建议最佳分辨率1366*768以上</p>
                        </li>
                        <li key="footerLi03">
                            <img src={footer_2} alt=""/>
                        </li>
                    </ul>
                </div>
                <ul className="f_bottom clear">
                    <li className="left" key="footerLi04">Copyright&nbsp;&copy;&nbsp;2014-2017&nbsp;恒彩在线版权所有&nbsp;菲律宾政府合法博彩牌照认证</li>
                    <li className="footer_bottom right" key="footerLi05"><img src={footer_bottom} alt=""/></li>
                </ul>
            </div>
        );
    }
}
