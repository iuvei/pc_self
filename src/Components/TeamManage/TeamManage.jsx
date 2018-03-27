/*团队管理*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Row, Col  } from 'antd';
import QueueAnim from 'rc-queue-anim';
import ChildNav from '../Common/ChildNav/ChildNav';

const navList = [
    {
        link: '/teamManage/teamStatistics',
        text: '团队统计'
    },{
        link: '/teamManage/teamList',
        text: '团队列表'
    },{
        link: '/teamManage/marketing',
        text: '市场推广'
    },{
        link: '/teamManage/contract',
        text: '契约系统'
    }
];

@observer
export default class Account extends Component {
    constructor(props){
        super(props);
        this.state = {
            navIndex: 0,
        };
        this.onChangeNavIndex = this.onChangeNavIndex.bind(this);
    };
    onChangeNavIndex(index) {
        this.setState({navIndex: index});
    };
    render() {
        return (
            <div className="a_m_main">
                <QueueAnim duration={1000}
                           animConfig={[
                               { opacity: [1, 0] }
                           ]}>
                    <Row type="flex" justify="center" align="top" key="account">
                        <Col span={24}>
                            <div className="a_m_controler">
                                <div className="a_m_title">
                                    <span>团队管理</span>
                                    <span> > </span>
                                    <span>{navList[this.state.navIndex].text}</span>
                                </div>
                                <ChildNav navList={navList}
                                          defaultIndex={this.props.location.query.navIndex}
                                          onChangeNavIndex={this.onChangeNavIndex}
                                />
                                <div>
                                    {this.props.children}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </QueueAnim>
            </div>
        );
    }
}
