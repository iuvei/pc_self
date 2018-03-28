import {observer} from 'mobx-react';
import React, {Component} from 'react';
import Fetch from '../../Utils';
import {hashHistory} from 'react-router';
import {Row, Col} from 'antd';
import {stateVar} from '../../State';
import HeaderNav from '../Common/HeaderNav/headerNav';
import Footer from '../Common/Footer/Footer';
import LeftSider from '../Lottery/LeftSider/LeftSider';
import RightPlug from '../Common/RightPlug/RightPlug';
import './Main.scss';

/*检测界面是否刷新*/
window.onbeforeunload = function () {
    return "真的离开?";
};
window.onunload = function () {
    if (stateVar.userInfo.sType == 'demo') {
        Fetch.logout({
            method: 'POST',
            body: JSON.stringify({sType: stateVar.userInfo.sType})
        }).then((res) => {

        });
    }
}

@observer
export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    };

    showLeftSider() {
        let pathname = hashHistory.getCurrentLocation().pathname;
        if (pathname == '/home' ||
            pathname == '/activity' ||
            pathname == '/activity/activityDetails' ||
            pathname == '/activity/fanshui' ||
            pathname == '/otherGames/bobing' ||
            pathname == '/tendency' ||
            pathname == '/otherGames/ea' ||
            pathname == '/otherGames/pt' ||
            pathname == '/otherGames/gt' ||
            pathname == '/otherGames/sport' ||
            pathname == '/downLoadClient' ||
            pathname == '/otherGames' ||
            pathname == '/helpInfo' ||
            pathname == '/helpInfo/playMethodIntroduce' ||
            pathname == '/helpInfo/howDeposit' ||
            pathname == '/helpInfo/commonProblems' ||
            pathname == '/helpInfo/aboutHengCai'
        ) {
            return true
        } else {
            return false
        }
    };

    hideRight() {
        let pathname = hashHistory.getCurrentLocation().pathname;
        if (pathname == '/home' ||
            pathname == '/tendency'
        ) {
            return true
        } else {
            return false
        }
    }

    /*隐藏帮助中心下的底部导航条*/
    showFooter() {
        if (hashHistory.getCurrentLocation().pathname == '/tendency') {
            return true
        } else {
            return false
        }
    };

    /*隐藏帮助中心下的头部导航条*/
    showHeader() {
        if (hashHistory.getCurrentLocation().pathname == '/tendency') {
            return true
        } else {
            return false
        }
    };

    shouldComponentUpdate() {
        //     /*使用了react-router低于4.x版本中的hashHistory，因为router中进行了一次push和一次pop，所以出现两次渲染，需要在shouldComponentUpdate()做一个判断： return (this.props.router.location.action === 'PUSH')或者 return (this.props.router.location.action === 'POP')；可解决渲染两次的问题*/
        return this.props.router.location.action === 'POP';
    }

    render() {
        const contain = <div className={`berCenter_bg theme-${stateVar.activeTheme}`}>
            <Row type="flex" justify="center" align="top" className="main_width">
                <Col span={2} style={{zIndex: '1'}}>
                    <LeftSider/>
                </Col>
                <Col span={22}>
                    {this.props.children}
                </Col>
            </Row>
        </div>;
        return (
            <div>
                <header style={{display: this.showHeader() ? 'none' : ''}}>
                    <HeaderNav/>
                </header>
                {
                    this.showLeftSider() ? this.props.children : contain
                }
                <div style={{display: this.hideRight() ? 'none' : ''}}>
                    <RightPlug/>
                </div>
                <footer style={{display: this.showFooter() ? 'none' : ''}}>
                    <Footer/>
                </footer>
            </div>
        );
    }
}


