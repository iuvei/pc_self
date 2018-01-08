/*财务中心*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { stateVar } from '../../State';
import { Row, Col } from 'antd';
import QueueAnim from 'rc-queue-anim';
import ChildNav from '../Common/ChildNav/ChildNav';

import './Financial.scss';
@observer
export default class Financial extends Component {
    constructor(props){
        super(props);
        this.state = {
            navIndex: 0,
        };
        this.onChangeNavIndex = this.onChangeNavIndex.bind(this)
    };
    onChangeNavIndex(index) {
        stateVar.navListIndex = index;
        this.setState({navIndex: index});
    };
    componentDidMount() {
        this._ismount = true;
    };

    render() {
        const navList = [
            {
                link: '/financial/recharge',
                text: '充值'
            },{
                link: '/financial/withdraw',
                text: '提现'
            },{
                link: '/financial/mentionFillingRecord',
                text: '充提记录'
            },{
                link: '/financial/transfer',
                text: '转账'
            },{
                link: '/financial/transferRecord',
                text: '转账记录'
            },{
                link: '/financial/accountChange',
                text: '资金账变'
            }
        ];
        return (
            <div className="financing_c_main">
                <QueueAnim duration={1000}
                           animConfig={[
                               { opacity: [1, 0] }
                           ]}>
                    <Row type="flex" justify="center" align="top" key="financingCenter">
                        <Col span={24}>
                            <div className="a_m_controler">
                                <div className="a_m_title">
                                    <span>财务中心</span>
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
