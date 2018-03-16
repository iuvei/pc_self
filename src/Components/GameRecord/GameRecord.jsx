/*游戏记录*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Link} from 'react-router';
import { Row, Col } from 'antd';
import { stateVar } from '../../State';
import ChildNav from '../Common/ChildNav/ChildNav';
import QueueAnim from 'rc-queue-anim';

import './GameRecord.scss'

const navList = [
    {
        link: '/gameRecord/lotteryBet',
        text: '彩票投注'
    },{
        link: '/gameRecord/afterRecord',
        text: '追号记录'
    },{
        link: '/gameRecord/person',
        text: '真人投注'
    },{
        link: '/gameRecord/sports',
        text: '体育投注'
    },{
        link: '/gameRecord/ptRecord',
        text: 'PT投注'
    },{
        link: '/gameRecord/bobingRecord',
        text: '博饼投注'
    }
];
@observer
export default class GameRecord extends Component {
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
                                    <div style={{display: stateVar.afterDetails ? 'none' : ''}}>
                                        <div className="a_m_title">
                                            <span>投注记录</span>
                                            <span> > </span>
                                            <span>{navList[this.state.navIndex].text}</span>
                                        </div>
                                        <ChildNav navList={navList} onChangeNavIndex={this.onChangeNavIndex.bind(this)}/>
                                    </div>
                                    {this.props.children}
                                </div>
                            </Col>
                        </Row>
                    </div>
                </QueueAnim>
            </div>
        );
    }
}
