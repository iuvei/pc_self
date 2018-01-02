/*报表管理*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../Utils';
import { stateVar } from '../../State';
import { Row, Col  } from 'antd';
import QueueAnim from 'rc-queue-anim';
import ChildNav from '../Common/ChildNav/ChildNav'
import './Report.scss'

const navListFlag = [
    {
        link: '/report/teamStatistics',
        text: '团队统计'
    },{
        link: '/report/lotteryReport',
        text: '彩票报表'
    },{
        link: '/report/selfTable',
        text: '个人总表'
    },{
        link: '/report/teamTable',
        text: '团队总表'
    },{
        link: '/report/gameBill',
        text: '游戏帐变'
    },{
        link: '/report/dividend',
        text: '分红'
    },{
        link: '/report/dayRate',
        text: '日工资'
    },{
        link: '/report/losesalary',
        text: '日亏损佣金'
    }
];
@observer
export default class Report extends Component {
    constructor(props){
        super(props);
        this.state = {
            navIndex: 0,
            navList: [
                {
                    link: '/report/teamStatistics',
                    text: '团队统计'
                },{
                    link: '/report/lotteryReport',
                    text: '彩票报表'
                },{
                    link: '/report/selfTable',
                    text: '个人总表'
                },{
                    link: '/report/teamTable',
                    text: '团队总表'
                },{
                    link: '/report/gameBill',
                    text: '游戏帐变'
                },{
                    link: '/report/dividend',
                    text: '分红'
                },{
                    link: '/report/dayRate',
                    text: '日工资'
                },{
                    link: '/report/losesalary',
                    text: '日亏损佣金'
                }
            ],
        }
    };
    componentDidMount(){
        this._ismount = true;
        this.getData();
    }
    componentWillUnmount() {
        this._ismount = false;
    };
    /*获得日工资，亏损，分红签订状态*/
    getData() {
        Fetch.dailysalary({
            method: 'POST',
            body: JSON.stringify({check: 1}),
        }).then((res)=>{
            if(this._ismount && res.status == 200){
                let data = res.repsoneContent,
                    navList = this.state.navList;
                stateVar.dailysalaryStatus = data;
                if(data.isDividend != 1){
                    for(let i = 0; i < navList.length; i++){
                        if(navList[i].link == '/report/dividend') {
                            navList.splice(i, 1);
                        }
                    }
                }
                if(data.isLose != 1){
                    for(let i = 0; i < navList.length; i++){
                        if(navList[i].link == '/report/dayRate') {
                            navList.splice(i, 1);
                        }
                    }
                }
                if(data.isSalary != 1){
                    for(let i = 0; i < navList.length; i++){
                        if(navList[i].link == '/report/losesalary') {
                            navList.splice(i, 1);
                        }
                    }
                }
                this.setState({navList: navList})
            }
        })
    };
    onChangeNavIndex(index) {
        this.setState({navIndex: index});
    };
    render() {
        const { navList } = this.state;
        return (
            <div className="s_m_main">
                <QueueAnim duration={2000}
                           animConfig={[
                               { opacity: [1, 0] }
                           ]}>
                    <div className="g_r_main" key="report">
                        <Row type="flex" justify="center" align="top">
                            <Col span={24}>
                                <div className="a_m_controler">
                                    <div className="a_m_title">
                                        <span>报表管理</span>
                                        <span> > </span>
                                        <span>{navList[this.state.navIndex].text}</span>
                                    </div>
                                    <ChildNav navList={navList}
                                              onChangeNavIndex={this.onChangeNavIndex.bind(this)}
                                    />
                                    <div>
                                        {this.props.children}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </QueueAnim>
            </div>
        );
    }
}
