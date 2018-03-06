import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Link} from 'react-router';
import './Footer.scss';
import footer_1 from './Img/footer_1.png';
import footer_2 from './Img/footer_2.png';

@observer
export default class Footer extends Component {
    render() {
        return (
            <div className="footer">
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
                                <Link to={`/helpInfo/howDeposit?navIndex=0`}>
                                    <span>帮助中心</span><span>|</span>
                                </Link>
                            </li>
                            <li>
                            	<Link to={`/downLoadClient`}>
                                    <span>手机客户端</span><span>|</span>
                                </Link>
                            </li>
                            <li>
                            	<Link to={`/downLoadClient`}>
                                    <span>PC客户端</span><span>|</span>
                                </Link>
                            </li>
                            <li>
                                <a href="#/dns" target="_blank">防劫持教程</a>
                            </li>
                        </ul>
                        <p>恒彩郑重提示：彩票有风险，投注需谨慎，未满18周岁的青少年禁止购彩</p>
                        <p>建议最佳分辨率1366*768以上</p>
                        <p className="copyright_text">Copyright&nbsp;&copy;&nbsp;2014-2018&nbsp;恒彩在线版权所有</p>
                    </li>
                    <li key="footerLi03">
                        <img src={footer_2} alt=""/>
                    </li>
                </ul>
            </div>
        );
    }
}
