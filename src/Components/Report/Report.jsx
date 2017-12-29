import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Row, Col  } from 'antd';
import QueueAnim from 'rc-queue-anim';
import ChildNav from '../Common/ChildNav/ChildNav'
import './Report.scss'

@observer
export default class Report extends Component {
    constructor(props){
        super(props);
        this.state = {
            navIndex: 0,
        }
    };
    onChangeNavIndex(index) {
        this.setState({navIndex: index});
    };
    render() {
        const navList = [
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
                                    <ChildNav navList={navList} onChangeNavIndex={this.onChangeNavIndex.bind(this)}/>
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
