import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { Row, Col } from 'antd';
import HeaderNav from '../Common/HeaderNav/headerNav';
import Footer from '../Common/Footer/Footer';
import LeftSider from '../Lottery/LeftSider/LeftSider';
import RightPlug from '../Common/RightPlug/RightPlug';
import './Main.scss';

/*检测界面是否刷新*/
window.onbeforeunload = function(){
    return "真的离开?";
};

@observer
export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    };

    showLeftSider() {
        if (hashHistory.getCurrentLocation().pathname == '/home' ||
            hashHistory.getCurrentLocation().pathname == '/activity' ||
            hashHistory.getCurrentLocation().pathname == '/activity/activityDetails' ||
            hashHistory.getCurrentLocation().pathname == '/bobing' ||
            hashHistory.getCurrentLocation().pathname == '/tendency' ||
            hashHistory.getCurrentLocation().pathname == '/ea' ||
            hashHistory.getCurrentLocation().pathname == '/pt'||
            hashHistory.getCurrentLocation().pathname == '/gt'||
            hashHistory.getCurrentLocation().pathname == '/sport'||
            hashHistory.getCurrentLocation().pathname == '/downLoadClient'
        ) {
            return true
        } else {
            return false
        }
    };
    /*隐藏帮助中心下的右边导航条*/
    hideLeft(){
        if (hashHistory.getCurrentLocation().pathname == '/helpInfo'||
            hashHistory.getCurrentLocation().pathname == '/helpInfo/playMethodIntroduce'||
            hashHistory.getCurrentLocation().pathname == '/helpInfo/howDeposit'||
            hashHistory.getCurrentLocation().pathname == '/helpInfo/commonProblems'||
            hashHistory.getCurrentLocation().pathname == '/helpInfo/aboutHengCai'
            ) {
            return true
        } else {
            return false
        }
    }
    /*隐藏帮助中心下的底部导航条*/
    showFooter() {
        if (hashHistory.getCurrentLocation().pathname === '/tendency') {
            return true
        } else {
            return false
        }
    };
    /*隐藏帮助中心下的头部导航条*/
    showHeader(){
        if (hashHistory.getCurrentLocation().pathname === '/tendency') {
            return true
        } else {
            return false
        }
    };
    shouldComponentUpdate(){
    //     /*使用了react-router低于4.x版本中的hashHistory，因为router中进行了一次push和一次pop，所以出现两次渲染，需要在shouldComponentUpdate()做一个判断： return (this.props.router.location.action === 'PUSH')或者 return (this.props.router.location.action === 'POP')；可解决渲染两次的问题*/
        return this.props.router.location.action === 'POP';
    }
    
    render() {
        const contain = <div>
            <div className="berCenter_bg">
                <Row type="flex" justify="center" align="top" className="main_width" >
                    <Col span={1} style={{zIndex: '1',display: this.hideLeft() ? 'none' : ''}}>
                        <LeftSider />
                    </Col>
                    <Col span={23}>
                        {this.props.children}
                    </Col>
                </Row>
            </div>
            <RightPlug/>
        </div>;
        return (
            <div>
                <header style={{display: this.showHeader() ? 'none' : ''}}>
                    <HeaderNav/>
                </header>
                {
                    this.showLeftSider() ? this.props.children : contain
                }
                <footer style={{display: this.showFooter() ? 'none' : ''}}>
                    <Footer/>
                </footer>
            </div>
        );
    }
}


