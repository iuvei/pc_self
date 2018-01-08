/*个人总表*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../../Utils';
import { stateVar } from '../../../State';
import { DatePicker, Button, Table, Popover } from 'antd';
import moment from 'moment';
import common from '../../../CommonJs/common';

import './SelfTable.scss'

const shortcutTime = [
    {
        text: '上周',
        id: 3
    },{
        text: '上半月',
        id: 4
    },{
        text: '下半月',
        id: 5
    },{
        text: '本月',
        id: 6
    }
];
const otherGArr = [
    {
        text: 'EA娱乐城',
        id: 0
    },
    {
        text: 'PT游戏',
        id: 1
    },
    {
        text: '体育竞技',
        id: 2
    },
    {
        text: '博饼',
        id: 3
    }
];
@observer
export default class SelfTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            threeSeven: null,
            data: [],
            sum: {},
            tableLoading: false,
            searchLoading: false,
            classify: 0, // 游戏分类
            variety: 0, // 游戏种类
            otherGamesData: [],
            otherGamesSum: {},
            postData: {
                starttime: common.setDateTime(0),
                endtime: common.setDateTime(1),
                // p: 1,
                // pn: 10,
            }
        }
    };
    componentDidMount() {
        this._ismount = true;
        this.getData();
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    getData() {
        this.setState({ tableLoading: true });
        let { classify, variety } = this.state;
        if(classify == 0){
            Fetch.profitLossLotteryBySelf({
                method: 'POST',
                body: JSON.stringify(this.state.postData),
            }).then((res)=>{
                if(this._ismount) {
                    this.setState({ searchLoading: false, tableLoading: false });
                    if(res.status == 200) {
                        let data = res.repsoneContent;
                        this.setState({
                            data: data.results,
                            sum: data.total,
                        });
                    }else{
                        this.setState({
                            data: [],
                            sum: {},
                        });
                    }
                }
            })
        }else{
            let postData = this.state.postData,
                postFlag = {
                    start_date: postData.starttime,
                    end_date: postData.endtime,
                };
            if(variety == 0){
                Fetch.historyea({
                    method: 'POST',
                    body: JSON.stringify(postFlag)
                }).then((res)=>{
                    if(this._ismount){
                        this.setState({ searchLoading: false, tableLoading: false });
                        if(res.status == 200){
                            let data = res.repsoneContent;
                            this.setState({
                                otherGamesData: data.result,
                                otherGamesSum: data.report_total,
                            });
                        }
                    }

                })
            }else if(variety == 1){
                postFlag.search = 1;
                Fetch.ptdaily({
                    method: 'POST',
                    body: JSON.stringify(postFlag)
                }).then((res)=>{
                    if(this._ismount){
                        this.setState({ searchLoading: false, tableLoading: false });
                        if(res.status == 200){
                            let data = res.repsoneContent;
                            this.setState({
                                otherGamesData: data.results,
                                otherGamesSum: data.total,
                            });
                        }
                    }
                })
            }else if(variety == 2){
                Fetch.historysports({
                    method: 'POST',
                    body: JSON.stringify(postFlag)
                }).then((res)=>{
                    if(this._ismount){
                        this.setState({ searchLoading: false, tableLoading: false });
                        if(res.status == 200){
                            let data = res.repsoneContent;
                            this.setState({
                                otherGamesData: data.result,
                                otherGamesSum: data.report_total,
                            });
                        }
                    }
                })
            }else if(variety == 3){
                Fetch.bbdailybyself({
                    method: 'POST',
                    body: JSON.stringify(postFlag)
                }).then((res)=>{
                    if(this._ismount){
                        this.setState({ searchLoading: false, tableLoading: false });
                        if(res.status == 200){
                            let data = res.repsoneContent;
                            this.setState({
                                otherGamesData: data.results,
                                otherGamesSum: data.total,
                            });
                        }
                    }
                })

            }
        }

    };
    /*搜索*/
    onSearch() {
        this.setState({ searchLoading: true });
        this.getData();
    };
    /*开始查询日期*/
    onChangeStartTime(date, dateString) {
        let postData = this.state.postData;
        postData.starttime = dateString;
        this.setState({postData})
    };
    /*结束查询日期*/
    onChangeEndTime(date, dateString) {
        let postData = this.state.postData;
        postData.endtime = dateString;
        this.setState({postData})
    };
    /*切换每页显示条数*/
    onShowSizeChange (current, pageSize) {
        let postData = this.state.postData;
        postData.p = current;
        postData.pn = pageSize;
        this.setState({postData: postData},()=>this.getData())
    };
    /*切换页面时*/
    onChangePagination(page) {
        let postData = this.state.postData;
        postData.p = page;
        this.setState({postData: postData},()=>this.getData());
    };
    /*快捷选择时间*/
    onShortcutTime(val) {
        let threeSeven = this.state.threeSeven;
        if(threeSeven == val) {
            threeSeven = null
        }else{
            threeSeven = val;
        }
        this.setState({threeSeven});
    };
    /*游戏分类-其他类型*/
    onRests() {
        this.setState({classify: 1});
    }
    /*游戏种类-选择第三方时*/
    onOtherGame(id) {
        this.setState({variety: id});
    };

    render() {
        const dailysalaryStatus = stateVar.dailysalaryStatus;
        const { classify, variety, data, sum, otherGamesData, otherGamesSum } = this.state;
        const columns = [
            {
                title: '日期',
                dataIndex: 'date',
                render: text => text.slice(5),
                width: 50,
            }, {
                title: '用户名',
                dataIndex: 'username',
                render:(text)=>{
                    return (
                        text.length < 10 ? text :
                            <Popover content={text} title={null} trigger="hover">
                                <span className="ellipsis" style={{display: 'inline-block', width: 70}}>{text}</span>
                            </Popover>
                    )
                },
                width: 85,
            }, {
                title: '投注量',
                dataIndex: 'cp_stake',
                className: 'column-right',
                render: text => parseFloat(text).toFixed(3),
                width: 95,
            }, {
                title: '有效投注量',
                dataIndex: 'cp_effective_stake',
                className: 'column-right',
                render: text => parseFloat(text).toFixed(3),
                width: 95,
            },  {
                title: '中奖',
                dataIndex: 'cp_bonus',
                className: 'column-right',
                render: text => parseFloat(text).toFixed(3),
                width: 95,
            }, {
                title: '返点',
                dataIndex: 'cp_point',
                className: 'column-right',
                render: text => parseFloat(text).toFixed(3),
                width: 85,
            }, {
                title: '毛收入',
                dataIndex: 'income',
                className: 'column-right',
                render: text => parseFloat(text).toFixed(3),
                width: 95,
            }, {
                title: '日工资',
                dataIndex: 'salary',
                className: dailysalaryStatus.isLose != 1 ? 'column-right status_hide' : 'column-right',
                render: text => parseFloat(text).toFixed(3),
                width: 85,
            }, {
                title: '日亏损',
                dataIndex: 'lose_salary',
                className: dailysalaryStatus.isSalary != 1 ? 'column-right status_hide' : 'column-right',
                render: text => parseFloat(text).toFixed(3),
                width: 70,
            }, {
                title: '活动',
                dataIndex: 'sum_activity',
                className: 'column-right',
                render: text => parseFloat(text).toFixed(3),
                width: 70,
            }, {
                title: '净收入',
                dataIndex: 'net_income',
                className: dailysalaryStatus.isDividend != 1 ? 'column-right status_hide' : 'column-right',
                render: text => parseFloat(text).toFixed(3),
                width: 95,
            }, {
                title: '分红',
                dataIndex: 'allsalary',
                className: dailysalaryStatus.isDividend != 1 ? 'column-right status_hide' : 'column-right',
                render: text => parseFloat(text).toFixed(3),
                width: 85,
            }, {
                title: '总盈亏',
                dataIndex: 'last_win_lose',
                className: 'column-right',
                render: text => text < 0 ? <span className="col_color_shu">{parseFloat(text).toFixed(3)}</span> :
                                            <span className="col_color_ying">{parseFloat(text).toFixed(3)}</span>,
                width: 90,
            }
        ];
        const columnsRests = [
            {
                title: '日期',
                dataIndex: 'usergroup_naeweme',
                width: 130,
            }, {
                title: '用户名',
                dataIndex: 'sale',
                width: 130,
            }, {
                title: '投注',
                dataIndex: 'effective_sale',
                width: 130,
            }, {
                title: '有效投注',
                dataIndex: 'usergroup_name',
                width: 130,
            }, {
                title: '中奖金额',
                dataIndex: 'safewale',
                width: 130,
            }, {
                title: '返水',
                dataIndex: 'effective_sale232',
                width: 130,
            }, {
                title: '累计盈利',
                dataIndex: 'effective323_sale',
                width: 130,
            }, {
                title: '分红',
                dataIndex: 'effecti235ve_sale',
                width: 130,
            }
        ];
        const footer = <ul className="st_footer clear">
                            <li>总计</li>
                            <li>{sum.sum_cp_stake}</li>
                            <li>{sum.sum_cp_effective}</li>
                            <li>{sum.sum_cp_bonust}</li>
                            <li>{sum.sum_cp_point}</li>
                            <li>{sum.sum_income}</li>
                            <li>{sum.sum_salary}</li>
                            <li>{sum.sum_lose_salary}</li>
                            <li>{sum.sum_sum_activity}</li>
                            <li>{sum.sum_net_income}</li>
                            <li>{sum.sum_allsalary}</li>
                            <li className={parseFloat(sum.sum_last_win_lose) < 0 ? 'col_color_shu' : 'col_color_ying'}>{sum.sum_last_win_lose}</li>
                        </ul>;
        const otherGamesFooter = <ul className="st_footer clear">
            <li>总计</li>
            {/*<li>{otherGamesSum.sum_income}</li>*/}
            {/*<li>{otherGamesSum.sum_salary}</li>*/}
            {/*<li>{otherGamesSum.sum_lose_salary}</li>*/}
            {/*<li>{otherGamesSum.sum_sum_activity}</li>*/}
            {/*<li>{otherGamesSum.sum_net_income}</li>*/}
            {/*<li className={parseFloat(otherGamesSum.sum_last_win_lose) < 0 ? 'col_color_shu' : 'col_color_ying'}>{otherGamesSum.sum_last_win_lose}</li>*/}
        </ul>;

        return (
            <div className="self_table">
                <div className="team_list_top">
                    <div className="t_l_time">
                        <ul className="t_l_time_row">
                            <li>
                                <span>查询日期：</span>
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    placeholder="请选择开始查询日期"
                                    defaultValue={moment(common.setDateTime(0))}
                                    onChange={(date, dateString)=>{this.onChangeStartTime(date, dateString)}}
                                    disabledDate={(current)=>common.disabledDate(current, 'lt',-16)}
                                />
                                <span style={{margin: '0 8px'}}>至</span>
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    placeholder="请选择结束查询日期"
                                    defaultValue={moment(common.setDateTime(1))}
                                    onChange={(date, dateString)=>{this.onChangeEndTime(date, dateString)}}
                                    disabledDate={(current)=>common.disabledDate(current, 'gt', 1)}
                                />
                            </li>
                            <li className="t_m_line"></li>
                            <li>
                                <ul className="t_l_time_btn clear">
                                    {
                                        shortcutTime.map((item,i)=>{
                                            return <li className={item.id === this.state.threeSeven ? 't_l_time_btn_active' : ''} onClick={()=>{this.onShortcutTime(item.id)}} key={item.id}>{item.text}</li>
                                        })
                                    }
                                </ul>
                            </li>
                        </ul>
                        <ul className="t_l_classify">
                            <li>
                                <span>游戏分类：</span>
                                <span className={0 === classify ? "t_l_border t_l_active" : "t_l_border"} onClick={()=>{this.setState({classify: 0, variety: 0})}}>彩票</span>
                                <span className={1 === classify ? "t_l_border t_l_active" : "t_l_border"} onClick={()=>this.onRests()}>其他</span>
                            </li>
                            <li>
                                <span>游戏种类：</span>
                                {
                                    this.state.classify == 0 ?
                                        <span className={0 === variety ? "t_l_border t_l_active" : "t_l_border"} onClick={()=>{this.setState({variety: 1})}}>全彩种</span> :
                                        <span>
                                            {
                                                otherGArr.map((item)=>{
                                                    return <span className={item.id === variety ? "t_l_border t_l_active" : "t_l_border"} onClick={()=>this.onOtherGame(item.id)} key={item.id}>{item.text}</span>
                                                })
                                            }
                                        </span>
                                }
                            </li>
                            <li className="t_m_serch">
                                <Button type="primary"
                                        icon="search"
                                        loading={this.state.searchLoading}
                                        onClick={()=>this.onSearch()}
                                >
                                    搜索
                                </Button>
                            </li>
                        </ul>
                    </div>
                </div>
                    <div className="t_l_table">
                        <div className="t_l_table_list">
                            {
                                classify === 0 ?
                                    <Table columns={columns}
                                           rowKey={record => record.date}
                                           dataSource={data}
                                           loading={this.state.tableLoading}
                                           pagination={false}
                                           footer={data.length <= 0 ? null : ()=>footer}
                                    /> :
                                    <Table columns={columnsRests}
                                           rowKey={record => record.date}
                                           dataSource={otherGamesData}
                                           loading={this.state.tableLoading}
                                           pagination={false}
                                           footer={otherGamesData.length <= 0 ? null : ()=>otherGamesFooter}
                                    />
                            }

                        </div>
                    </div>
            </div>
        );
    }
}
