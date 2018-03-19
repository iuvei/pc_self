import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Link} from 'react-router';
import { Row, Col } from 'antd';
import QueueAnim from 'rc-queue-anim';
import ChildNav from '../Common/ChildNav/ChildNav'

import './HelpInfo.scss';
@observer
export default class HelpInfo extends Component {
    constructor(props){
        super(props);
        this.state = {
            navIndex: 0,
        }
    }
    onChangeNavIndex(index) {
        this.setState({navIndex: index});
    };
    componentDidMount() {
        let tempUrl = window.location.href.split("navIndex=")[1];
        this.setState({navIndex : tempUrl||0});


    };

    render() {
        const navList = [
            {
                link: '/helpInfo/howDeposit',
                text: '如何存款'
            },{
                link: '/helpInfo/playMethodIntroduce',
                text: '玩法介绍'
            },{
                link: '/helpInfo/commonProblems',
                text: '常见问题'
            },{
                link: '/helpInfo/aboutHengCai',
                text: '关于恒彩'
            }
        ];
        return (
            <div className="helpInfo_main">
                <QueueAnim duration={1000}
                           animConfig={[
                               { opacity: [1, 0] }
                           ]}>
                    <Row type="flex" justify="center" align="top" key="helpInfoCenter">
                        <Col span={24}>
                            <div className="a_m_controler">
                            	<div className='leftHelp'>
	                                <div className="a_m_title">
	                                    <span>帮助中心</span>
	                                </div>
	                                <ChildNav navList={navList} defaultIndex={this.state.navIndex}  onChangeNavIndex={this.onChangeNavIndex.bind(this)}/>
                                </div>
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
