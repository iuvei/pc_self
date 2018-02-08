import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../Utils';
import { Row, Col, Button, Pagination  } from 'antd';
import { timestampToTime } from '../../CommonJs/common';
import { stateVar } from '../../State';
import { hashHistory, Link } from 'react-router';

import './Activity.scss'

import litimg from './Img/litimg.png';
import activity1 from './Img/active1.png';
import activity200 from './Img/active200.png';
import activity400 from './Img/active400.png';
import activity401 from './Img/active401.png';

@observer
export default class Activity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activityArr: [], //活动列表
            postData: {
                p: 1,
                pn: 10,
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
            method: 'POST',
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
        let postData = this.state.postData;
        postData.p = page;
        this.setState({postData: postData},()=>this.getData());
    };
    /*切换每页条数*/
    onShowSizeChange(current, pageSize) {
        let postData = this.state.postData;
        postData.p = current;
        postData.pn = pageSize;
        this.setState({postData: postData},()=>this.getData())
    };
    activityDetails(item) {
        hashHistory.push({
            pathname: '/activity/activityDetails',
            query: {
                id: item.activity_id
            }
        });
    };

    render() {
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
                                            <div className="activity_img">
                                                {
                                                    item.activity_pics == undefined ?
                                                        <img src={litimg} alt="活动"/> :
                                                        <img src={stateVar.httpUrl+item.activity_pics} alt="活动"/>
                                                }
                                            </div>
                                            {
                                                item.status == '1' ||
                                                item.status == '200' ||
                                                item.status == '400' ||
                                                item.status == '401' ?
                                                    <img className="activity_apply" src={require('./Img/active'+item.status+'.png')}/> :
                                                    null
                                            }

                                            <div className="activity_participation clear">
                                                <div className="left">
                                                    <p>
                                                        {item.activity_title}
                                                        <span className="active_bonus">最高奖金: {item.plan_award_amount == undefined || item.plan_award_amount == '' ? '0' : item.plan_award_amount} 元</span>
                                                    </p>
                                                    <i>活动时间：{timestampToTime(item.start_time)} 至 {timestampToTime(item.end_time)}</i>
                                                </div>
                                                <Button className="right" onClick={()=>this.activityDetails(item)} type="primary" size="large">
                                                    立即参与
                                                </Button>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        <div className="active_pagination">
                            <Pagination showSizeChanger
                                        onShowSizeChange={(current, pageSize)=>{this.onShowSizeChange(current, pageSize)}}
                                        onChange={(page)=>this.onChangePagination(page)}
                                        defaultCurrent={1}
                                        total={20}
                                        pageSizeOptions={stateVar.pageSizeOptions.slice()}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}
