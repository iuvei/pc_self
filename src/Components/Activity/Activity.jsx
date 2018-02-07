import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../Utils';
import { Row, Col, Button, Pagination  } from 'antd';
import { timestampToTime } from '../../CommonJs/common';
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
        this.state = {
            activityArr: [], //活动列表
            postData: {
                p: 1,
            }
        };
    };
    componentDidMount(){
        this._ismount = true;
        this.getData();
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    getData(){
        Fetch.acitveLists({
            method: 'GET',
            body: JSON.stringify(this.state.postData)
        }).then((res)=>{
            if(this._ismount && res.status == 200){
                let data = res.repsoneContent;
                this.setState({activityArr: data.datas})
            }
        })
    }
    /*切换页面时*/
    onChangePagination(page) {
        console.log(page);
        let postData = this.state.postData;
        postData.p = page;
        this.setState({postData: postData},()=>this.getData());
    };
    activityDetails() {
        hashHistory.push('/activity/activityDetails');
    };

    render() {
        const activityArrs = [
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
        const { activityArr } = this.state;
        return (
            <div className="activity_main">
                <Row type="flex" justify="center" align="top" className="main_width" >
                    <Col span={24}>
                        <ul className="activity_list clear">
                            {
                                activityArr.map((item)=>{
                                    return (
                                        <li key={item.activity_id}>
                                            <img src={activity01} alt="活动"/>
                                            {/*<img className="activity_apply" src={ activity_apply } alt=""/>*/}
                                            <div className="activity_participation clear">
                                                <div className="left">
                                                    <p>
                                                        {item.activity_title}
                                                        <span className="active_bonus">最高奖金: {item.plan_award_amount == undefined ? '0' : item.plan_award_amount} 元</span>
                                                    </p>
                                                    <i>活动时间：{timestampToTime(item.add_time)}-{timestampToTime(item.end_time)}</i>
                                                </div>
                                                <a href="#/activity/activityDetails">
                                                    <Button className="right" type="primary" size="large">
                                                        立即参与
                                                    </Button>
                                                </a>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        <div className="active_pagination">
                            <Pagination defaultCurrent={1} pageSize={4} total={8} onChange={(page)=>this.onChangePagination(page)}/>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}
