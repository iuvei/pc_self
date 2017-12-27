import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { Row, Col } from 'antd';
import HeaderNav from '../Common/HeaderNav/headerNav'
import Footer from '../Common/Footer/Footer'
import LeftSider from '../Lottery/LeftSider/LeftSider';
import RightPlug from '../Common/RightPlug/RightPlug'
import './Main.scss';



var _t;
window.onbeforeunload = function(){
    event.preventDefault();
    /*setTimeout(function(){_t = setTimeout(onload, 0)}, 0);
    return "真的离开?";*/
}
window.onload = function(){
    clearTimeout(_t);
   // event.preventDefault();
   // window.location.assign("/#/autoLogin");
    alert("取消离开");
}

/*window.onhashchange = function (){
    alert("eartha1");
}*/
/*
window.onbeforeunload=function (e){
    e = e || window.event;

    // 兼容IE8和Firefox 4之前的版本
    if (e) {
        e.returnValue = '关闭提示';
    }

    // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
    return '关闭提示';
}
*/

@observer
export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    };

    /*主界面刷新弹出是否重新加载
    * 点击确定进入自动登录界面
    * */
    keyBoard(){

        alert("a");
        return '555555';
        /*F5 or ctrl+r 刷新 */
       // if(e.keyCode==116||(e.ctrlKey && (e.keyCode==78||e.keyCode==82)))
       //  {
       //      e.preventDefault();
       //      e.stopPropagation();

           // if(confirm("系统可能不会保存您所做的更改")){
           //     window.location.assign("/#/autoLogin");
           //   //  hashHistory.push('/autoLogin');
           // };
        // }
        // console.log("keyBoard")

    }
        componentDidMount() {
            /*捕捉键盘事件以及浏览器离开主界面行为*/
          /* window.addEventListener("beforeunload",function (e) {
               return '您正在编辑的 issue 还没有提交，确定要离开？';
           });*/
          /*  this.props.router.setRouteLeaveHook(
                this.props.route,
                this.routerWillLeave
            )*/
        }
        /*捕获到URL改变行为后弹出确认框*/
      /*  routerWillLeave(nextLocation) {
            if(confirm("系统可能不会保存您所做的更改")){
                location.reload();
                hashHistory.push('/autoLogin');
            };

        }*/

    componentWillUnmount(){
        // window.removeEventListener("keydown",(e)=>this.keyBoard(e))
    };

    showLeftSider() {
        if (hashHistory.getCurrentLocation().pathname === '/home' ||
            hashHistory.getCurrentLocation().pathname === '/activity' ||
            hashHistory.getCurrentLocation().pathname === '/activity/activityDetails' ||
            hashHistory.getCurrentLocation().pathname === '/bobing' ||
            hashHistory.getCurrentLocation().pathname === '/tendency' ||
            hashHistory.getCurrentLocation().pathname === '/ea' ||
            hashHistory.getCurrentLocation().pathname === '/pt'||
            hashHistory.getCurrentLocation().pathname === '/gt'||
            hashHistory.getCurrentLocation().pathname === '/sport'
        ) {
            return true
        } else {
            return false
        }
    };
    /*隐藏帮助中心下的左边导航条*/
    hideLeft(){
        if (hashHistory.getCurrentLocation().pathname === '/helpInfo'||
            hashHistory.getCurrentLocation().pathname === '/helpInfo/playMethodIntroduce'||
            hashHistory.getCurrentLocation().pathname === '/helpInfo/howDeposit'||
            hashHistory.getCurrentLocation().pathname === '/helpInfo/commonProblems'||
            hashHistory.getCurrentLocation().pathname === '/helpInfo/aboutHengCai') {
            return true
        } else {
            return false
        }
    }
    showFooter() {
        if (hashHistory.getCurrentLocation().pathname === '/tendency') {
            return true
        } else {
            return false
        }
    };

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
                <header>
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


