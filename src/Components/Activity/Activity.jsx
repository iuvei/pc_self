import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../Utils';
import {Row, Col, Button, Pagination} from 'antd';
import {timestampToTime} from '../../CommonJs/common';
import {stateVar} from '../../State';
import {hashHistory, Link} from 'react-router';

import './Activity.scss'

import litimg from './Img/litimg.png';
import activity1 from './Img/active1.png';
import activity200 from './Img/active200.png';
import activity400 from './Img/active400.png';
import activity401 from './Img/active401.png';
import fanshui from './Img/fanshui.png';

@observer
export default class Activity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activityArr: [], //活动列表
            total: 0, //总条数
            postData: {
                p: 1,
                pn: 10,
            }
        };
    };

    componentDidMount() {
        this._ismount = true;
        this.getData();
    };

    componentWillUnmount() {
        this._ismount = false;
    };

    getData() {
        Fetch.acitveLists({
            method: 'POST',
            body: JSON.stringify(this.state.postData)
        }).then((res) => {
            if (this._ismount && res.status == 200) {
                let data = res.repsoneContent;
                let fanshui = {
                    activity_id: "-1",
                    activity_title: "周返水",
                    status: "1",
                    add_time: "1520408759",
                    start_time: "1520408759",
                    end_time: "1546271999",
                    enroll_num_type_val: "2:00:00",
                    enroll_max_number: "50",
                    menus_name: "专题",
                    activity_pics: "./Img/fanshui.png",
                    enroll_already_number: 1,
                    plan_award_amount: "0"
                };
                data.datas.unshift(fanshui);
                this.setState({
                    activityArr: data.datas,
                    total: data.datacount,
                })
            }
        })
    }

    /*切换页面时*/
    onChangePagination(page) {
        let postData = this.state.postData;
        postData.p = page;
        this.setState({postData: postData}, () => this.getData());
    };

    /*切换每页条数*/
    onShowSizeChange(current, pageSize) {
        let postData = this.state.postData;
        postData.p = current;
        postData.pn = pageSize;
        this.setState({postData: postData}, () => this.getData())
    };

    activityDetails(item) {
        if (item.activity_id == '-1') {
            hashHistory.push('/activity/fanshui');
        } else {
            hashHistory.push({
                pathname: '/activity/activityDetails',
                query: {
                    id: item.activity_id
                }
            });
        }
    };

    /*按钮状态*/
    onBtnType(item) {

        let status = item.status;
        if (status == 1) {
            // if(item.user_is_enrolls == 1){
            //     return '进行中'
            // }else{
            //     return '立即参与';
            // }
            return '进行中'
        } else if (status == 200) {
            return '已完成';
        } else if (status == 400) {
            return '已满员';
        } else if (status == 401) {
            return '已结束';
        } else {
            return '加载中';
        }
    };

    render() {
        const {activityArr} = this.state;
        return (
            <div className={`activity_main theme-${stateVar.activeTheme}`}>
                <Row type="flex" justify="center" align="top" className="main_width">
                    <Col span={24}>
                        <ul className="activity_list clear">
                            {
                                activityArr.map((item) => {
                                    return (
                                        <li key={item.activity_id}>
                                            <div className="activity_img">
                                                {
                                                    item.activity_id == '-1' ?
                                                        <img src={fanshui} alt=""/> :
                                                        item.activity_pics == undefined || item.activity_pics == '' ?
                                                            <img src={litimg} alt="活动"/> :
                                                            <img
                                                                src={stateVar.httpUrl + item.activity_pics + '?' + new Date().getTime()}
                                                                alt="活动"/>
                                                }
                                            </div>
                                            {
                                                item.status == '1' ||
                                                item.status == '200' ||
                                                item.status == '400' ||
                                                item.status == '401' ?
                                                    <img className="activity_apply"
                                                         src={require('./Img/active' + item.status + '.png')}/> :
                                                    null
                                            }

                                            <div className="activity_participation clear">
                                                <div className="left">
                                                    <p>
                                                        {item.activity_title}
                                                    </p>
                                                    <i>活动时间：{timestampToTime(item.start_time)} 至 {timestampToTime(item.end_time)}</i>
                                                </div>
                                                <Button className={item.status != 1 ? 'endBtn right' : 'right'}
                                                        type="primary" size="large"
                                                        onClick={() => this.activityDetails(item)}
                                                >
                                                    {
                                                        item.activity_id == '-1' ?
                                                            '查看详情' :
                                                            this.onBtnType(item)
                                                    }
                                                </Button>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        <div className="active_pagination"
                             style={{display: this.state.total <= 0 || this.state.total == undefined ? 'none' : ''}}>
                            <Pagination showSizeChanger
                                        onShowSizeChange={(current, pageSize) => {
                                            this.onShowSizeChange(current, pageSize)
                                        }}
                                        onChange={(page) => this.onChangePagination(page)}
                                        defaultCurrent={1}
                                        total={parseInt(this.state.total)}
                                        pageSizeOptions={stateVar.pageSizeOptions.slice()}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}
