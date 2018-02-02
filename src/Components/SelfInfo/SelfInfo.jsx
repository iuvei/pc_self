/*个人信息*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Row, Col  } from 'antd';
import QueueAnim from 'rc-queue-anim';
import ChildNav from '../Common/ChildNav/ChildNav';

const navList = [
    {
        link: '/selfInfo/selfCenter',
        text: '个人中心'
    },{
        link: '/selfInfo/bankCardManage',
        text: '银行卡管理'
    },{
        link: '/selfInfo/security',
        text: '安全中心'
    },{
        link: '/selfInfo/message',
        text: '站内信'
    },
];

@observer
export default class SelfInfo extends Component {
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
                                    <span>个人信息</span>
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
