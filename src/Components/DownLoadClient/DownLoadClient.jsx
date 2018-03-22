import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { stateVar } from '../../State';
import { _code } from '../../CommonJs/common';
import { Popover } from 'antd';
import './DownLoadClient.scss';

@observer
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navListIndex:0,
            visibleIphone: false,
            visibleAndriod: false,
        };
    };

    componentDidMount() {
        _code('qrcode', stateVar.httpUrl + '/m/index.html?' + (new Date).getTime(), 250, 220);
    };
    handleVisibleIphone = (visibleIphone) =>{
        this.setState({ visibleIphone }, ()=>{
            if(visibleIphone){
                _code('qrcode_iphone', stateVar.httpUrl + '/feed/downH5/mobileh5vue.html?' + (new Date).getTime(), 210, 185)
            }
        });
    };
    handleVisibleAndriod = (visibleAndriod) => {
        this.setState({ visibleAndriod }, ()=>{
            if(visibleAndriod){
                _code('qrcode_andriod', stateVar.httpUrl + '/feed/downH5/mobileh5vue.html?' + (new Date).getTime(), 210, 185)
            }
        });
    };

    render() {
        const navList = ['PC客户端', '手机客户端','真人娱乐城','PT娱乐城','M站二维码'];
        const {navListIndex} = this.state;

        return (
            <div className={'download_main'+ this.state.navListIndex}>
                <div className={'download_contain'+ this.state.navListIndex}>
                    <div className='download_for_title'>
                        <ul className="download_title">
                            {
                                navList.map((value, index)=>{
                                    return <li className={navListIndex === index ? 'download_title_active' : ''}
                                               onClick={() => this.setState({navListIndex: index})} key={index}>
                                                {value}
                                            </li>
                                })
                            }

                        </ul>
                        <div className='pc_contain' style={{display: navListIndex == 0 ? 'block' : 'none'}}>
                            <a href="https://dn-scmobile.qbox.me/setuphc.msi" target="_blank">
                                <p className='pc_btn'>PC客户端下载</p>
                            </a>
                        </div>
                        <div className='phone_contain' style={{display: navListIndex == 1 ? 'block' : 'none'}}>
                            <Popover content={
                                <div id="qrcode_iphone" style={{width: 210}}></div>
                            }
                                     placement="bottom"
                                     visible={this.state.visibleIphone}
                                     onVisibleChange={this.handleVisibleIphone}
                            >
                                <a href={stateVar.httpUrl + '/feed/downH5/ioshc.ipa?' + (new Date).getTime()} target='_blank'>
                                    <p className='phone_btn1'>
                                        iPhone下载
                                    </p>
                                </a>
                            </Popover>
                            <Popover content={
                                <div id="qrcode_andriod" style={{width: 210}}></div>
                            }
                                     placement="bottom"
                                     visible={this.state.visibleAndriod}
                                     onVisibleChange={this.handleVisibleAndriod}
                            >
                                <a href={stateVar.httpUrl + '/feed/downH5/andriod_hc_1_2.apk?' + (new Date).getTime()}  target='_blank'>
                                    <p className='phone_btn2'>
                                        安卓版下载
                                    </p>
                                </a>
                            </Popover>
                        </div>
                        <div className='people_contain' style={{display: navListIndex == 2 ? 'block' : 'none'}}>
                            <a href="http://download.gr-mission.com/hcgame.exe" target="_blank"><p className='people_btn'>真人娱乐城下载</p></a>
                        </div>
                        <div className='pt_contain' style={{display: navListIndex == 3 ? 'block' : 'none'}}>
                            <a href="http://link.vbet.club/happyslots" target="_blank"><p className='pt_btn1'>PT客户端下载</p></a>
                            <a href="http://m.ld176888.com/live/download.html" target="_blank"><p className='pt_btn2'>PT真人下载</p></a>
                            <a href="http://m.ld176888.com/download.html" target="_blank"><p className='pt_btn3'>PT老虎机下载</p></a>

                        </div>
                        <div className='m_contain' style={{display: navListIndex == 4 ? 'block' : 'none'}}>
                            <div id="qrcode"></div>
                        </div>
                    </div>
                </div>

            </div>

        );

    }
}
