import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Row, Col, Button, Pagination  } from 'antd';
import { hashHistory, Link } from 'react-router';

import './Activity.scss'

import activity01 from './Img/activity01.png';
import activity02 from './Img/activity02.png';
import activity03 from './Img/activity03.png';
import activity04 from './Img/activity04.png';
import activity_apply from './Img/activity_apply.png';
import activity_conduct from './Img/activity_conduct.png';

@observer
export default class Activity extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    activityDetails() {
        hashHistory.push('/activity/activityDetails');
    };
    getActivityRender(item, index) {
        return (
            <li key={index}>
                <img src={item.imgUrl} alt="活动"/>
                <img className="activity_apply" src={ activity_apply } alt=""/>
                <div className="activity_participation clear">
                    <div className="left">
                        <p>
                            {item.name}
                            <span className="active_bonus">{item.activeBonus}</span>
                        </p>
                        <i>{item.activityTime}</i>
                    </div>
                    <a href="#/activity/activityDetails">
                        <Button className="right" type="primary" size="large">
                            立即参与
                        </Button>
                    </a>
                </div>
            </li>
        )
    };
    render() {
        const activityArr = [
            {
                name: '日本圣诞奢恋游',
                imgUrl: activity01,
                activityTime: '活动时间：2017年11月01日02:00:00 - 12月01日02:00:00',
                activeBonus: '最高奖金：10000元',
            },{
                name: '日本圣诞奢恋游',
                imgUrl: activity02,
                activityTime: '活动时间：2017年11月01日02:00:00 - 12月01日02:00:00',
                activeBonus: '最高奖金：10000元',
            },{
                name: '日本圣诞奢恋游',
                imgUrl: activity03,
                activityTime: '活动时间：2017年11月01日02:00:00 - 12月01日02:00:00',
                activeBonus: '最高奖金：10000元',
            },{
                name: '日本圣诞奢恋游',
                imgUrl: activity04,
                activityTime: '活动时间：2017年11月01日02:00:00 - 12月01日02:00:00',
                activeBonus: '最高奖金：10000元',
            }
        ];
        const activityRender = activityArr.map(this.getActivityRender);
        return (
            <div className="activity_main">
                <Row type="flex" justify="center" align="top" className="main_width" >
                    <Col span={24}>
                        <ul className="activity_list clear">
                            {activityRender}
                        </ul>
                        <div className="active_pagination">
                            <Pagination defaultCurrent={1} pageSize={4} total={8} />
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}
