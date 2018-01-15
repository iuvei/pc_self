import React, {Component} from 'react';
import {observer} from 'mobx-react';
import './DownLoadClient.scss'
import QRSrc from './Img/QR.png';
import phoneQRSrc from './Img/phone_QR.png';

@observer
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navListIndex:0,
            displayQR1:false,
            displayQR2:false,
        }
    };

    componentDidMount() {
        console.log("classname",'download_main'+ this.state.navListIndex)

    };
    componentWillUnmount(){
    };

    downloadMain() {

        const ul_0 = <div className='pc_contain'>
            <a href="https://dn-scmobile.qbox.me/setuphc.msi" target="_blank"><p className='pc_btn'>PC客户端下载</p></a>
        </div>;
        const ul_1 = <div className='phone_contain'>
            <a href="https://dn-outwitinc.qbox.me/hcol/ioshc.ipa"><p className='phone_btn1'onMouseEnter={()=>{this.setState({
                displayQR1:true,
            });}} onMouseOut={()=>{this.setState({
                displayQR1:false,
            });}}>iPhone下载</p></a>
            <a href="https://dn-outwitinc.qbox.me/hcol/androidhc.apk"><p className='phone_btn2' onMouseEnter={()=>{this.setState({
                displayQR2:true,
            });}} onMouseOut={()=>{this.setState({
                displayQR2:false,
            });}}>安卓版下载</p></a>
            <img src={phoneQRSrc} className='phone_QR1' style={{display: this.state.displayQR1 ? 'inline-block' : 'none'}}/>
            <img src={phoneQRSrc} className='phone_QR2' style={{display: this.state.displayQR2 ? 'inline-block' : 'none'}}/>
        </div>;
        const ul_2 = <div className='people_contain'>
            <a href="http://download.gr-mission.com/hcgame.exe" target="_blank"><p className='people_btn'>真人娱乐城下载</p></a>
        </div>;
        const ul_3 = <div className='pt_contain'>
            <a href="http://link.vbet.club/happyslots" target="_blank"><p className='pt_btn1'>PT客户端下载</p></a>
            <a href="http://m.ld176888.com/live/download.html" target="_blank"><p className='pt_btn2'>PT真人下载</p></a>
            <a href="http://m.ld176888.com/download.html" target="_blank"><p className='pt_btn3'>PT老虎机下载</p></a>

        </div>;
        const ul_4 = <div className='m_contain'>
            <img src={QRSrc} />
        </div>;


        switch (this.state.navListIndex) {
            case 0:
                return ul_0;
                break;
            case 1:
                return ul_1;
                break;
            case 2:
                return ul_2;
                break;
            case 3:
                return ul_3;
                break;
            case 4:
                return ul_4;
                break;
        }
    }

    render() {

        const navList = ['PC客户端', '手机客户端','真人娱乐城','PT娱乐城','M站二维码'];
        return (
            <div className={'download_main'+ this.state.navListIndex}>
                <div className={'download_contain'+ this.state.navListIndex}>
                    <div className='download_for_title'>
                        <ul className="download_title">
                            {
                                navList.map((value, index)=>{
                                    return <li className={this.state.navListIndex === index ? 'download_title_active' : ''}
                                               onClick={() => {this.setState({navListIndex: index})}} key={index}>{value}</li>
                                })
                            }

                        </ul>
                        { this.downloadMain() }
                    </div>

                </div>

            </div>

        );

    }
}
