/*账户管理*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Row, Col  } from 'antd';
import QueueAnim from 'rc-queue-anim';

import ChildNav from '../Common/ChildNav/ChildNav'

import './Account.scss'

@observer
export default class Account extends Component {
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
                link: '/account/selfInfo',
                text: '个人信息'
            },{
                link: '/account/teamList',
                text: '团队列表'
            },{
                link: '/account/marketing',
                text: '市场推广'
            },{
                link: '/account/contract',
                text: '契约系统'
            },{
                link: '/account/bankCardManage',
                text: '银行卡管理'
            },{
                link: '/account/security',
                text: '安全中心'
            },{
                link: '/account/message',
                text: '站内信'
            },
        ];
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
                                    <span>账户管理</span>
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
                </QueueAnim>
            </div>
        );
    }
}
