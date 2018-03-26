/*个人总表*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../../Utils';
import { stateVar } from '../../../State';
import { DatePicker, Button, Table, Popover } from 'antd';
import moment from 'moment';
import common from '../../../CommonJs/common';

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
let columnsRests = [], otherGamesFooter = {};
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
            },
            startHMS: '02:00',
            endHMS: '01:59'
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
        postData.starttime = dateString.slice(0, 10);
        this.setState({postData})
    };
    /*结束查询日期*/
    onChangeEndTime(date, dateString) {
        let postData = this.state.postData;
        postData.endtime = dateString.slice(0, 10);
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
    onShortcutTime(val, type) {
        let { postData, threeSeven, classify } = this.state;
        let yearMonth = common.setDateTime(0).slice(0, 8),
            startHMSFlag = '', endHMSFlag = '';
        if(classify == 0){//游戏分类为：彩票
            startHMSFlag = '02:00';
            endHMSFlag = '01:59';
            if(val == 3){ // 上周
                postData.starttime = common.getTime(7);
                postData.endtime = common.getTime(0);
            }else if(val == 4){ // 上半月
                postData.starttime = yearMonth + '01';
                postData.endtime = yearMonth + '16';
            }else if(val == 5){ // 下半月
                postData.starttime = yearMonth + '16';
                postData.endtime = common.getNextMonth(yearMonth) + '-01';
            }else if(val == 6){ // 本月
                postData.starttime = yearMonth + '01';
                postData.endtime = common.getNextMonth(yearMonth) + '-01';
            }else{}
        }else{//游戏分类为：其他
            startHMSFlag = '00:00';
            endHMSFlag = '23:59';
            if(val == 3){ // 上周
                postData.starttime = common.getTime(7);
                postData.endtime = common.getTime(1);
            }else if(val == 4){ // 上半月
                postData.starttime = yearMonth + '01';
                postData.endtime = yearMonth + '15';
            }else if(val == 5){ // 下半月
                postData.starttime = yearMonth + '15';
                postData.endtime = common.getMonthEndDate();
            }else if(val == 6){ // 本月
                postData.starttime = yearMonth + '01';
                postData.endtime = common.getMonthEndDate();
            }else{}
        }
        if(type !== 'classify'){
            if(threeSeven == val) {
                threeSeven = null
            }else{
                threeSeven = val;
            }
        }
        this.setState({
            threeSeven,
            postData,
            startHMS: startHMSFlag,
            endHMS: endHMSFlag
        });
    };
    /*游戏种类*/
    onVariety(id){
        this.setState({otherGamesSum: {}, otherGamesData: [], variety: id}, ()=>this.getData());
    };
    /*游戏分类*/
    onClassify(type){
        if(type === 0){
            this.setState({classify: 0, variety: 0}, ()=>{
                this.onShortcutTime(this.state.threeSeven, 'classify');
                this.getData();
            });
        }else{
            this.setState({classify: 1}, ()=>{
                this.onShortcutTime(this.state.threeSeven, 'classify');
                this.getData();
            })
        }
    };
    render() {
        const { dailysalaryStatus, userInfo } = stateVar;
        const { classify, variety, data, sum, otherGamesData, otherGamesSum, postData } = this.state;
        let columns = [
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
                width: 70,
            }, {
                title: '投注量',
                dataIndex: 'cp_stake',
                className: 'column-right',
                width: 80,
            }, {
                title: '有效投注量',
                dataIndex: 'cp_effective_stake',
                className: 'column-right',
                width: 85,
            },  {
                title: '中奖',
                dataIndex: 'cp_bonus',
                className: 'column-right',
                width: 80,
            }, {
                title: '返点',
                dataIndex: 'cp_point',
                className: 'column-right',
                width: 70,
            }, {
                title: '毛收入',
                dataIndex: 'income',
                className: 'column-right',
                width: 80,
            }, {
                title: '活动',
                dataIndex: 'sum_activity',
                className: 'column-right',
                width: 70,
            },
            // {
            //     title: '净收入',
            //     dataIndex: 'net_income',
            //     className: 'column-right',
            //     width: 80,
            // },
            {
                title: '日工资',
                dataIndex: 'salary',
                className: 'column-right',
                width: 75,
            }, {
                title: '日亏损',
                dataIndex: 'lose_salary',
                className: 'column-right',
                width: 75,
            }, {
                title: '分红',
                dataIndex: 'allsalary',
                className: 'column-right',
                width: 75,
            }, {
                title: '总盈亏',
                dataIndex: 'last_win_lose',
                className: 'column-right',
                render: text => text < 0 ? <span className="col_color_shu">{text}</span> :
                    <span className="col_color_ying">{text}</span>,
                width: 75,
            }
        ];
        let footer = <ul className="st_footer clear">
            <li>总计</li>
            <li>{sum.sum_cp_stake}</li>
            <li>{sum.sum_cp_effective}</li>
            <li>{sum.sum_cp_bonust}</li>
            <li>{sum.sum_cp_point}</li>
            <li>{sum.sum_income}</li>
            <li>{sum.sum_sum_activity}</li>
            {/*<li>{sum.sum_net_income}</li>*/}
            <li>{sum.sum_salary}</li>
            <li>{sum.sum_lose_salary}</li>
            <li>{sum.sum_allsalary}</li>
            <li className={parseFloat(sum.sum_last_win_lose) < 0 ? 'col_color_shu' : 'col_color_ying'}>{sum.sum_last_win_lose}</li>
        </ul>;
        if(dailysalaryStatus.isLose != 1){
            columns = [
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
                    width: 70,
                }, {
                    title: '投注量',
                    dataIndex: 'cp_stake',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: '有效量',
                    dataIndex: 'cp_effective_stake',
                    className: 'column-right',
                    width: 85,
                },  {
                    title: '中奖',
                    dataIndex: 'cp_bonus',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: '返点',
                    dataIndex: 'cp_point',
                    className: 'column-right',
                    width: 70,
                }, {
                    title: '毛收入',
                    dataIndex: 'income',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: '活动',
                    dataIndex: 'sum_activity',
                    className: 'column-right',
                    width: 70,
                },
                // {
                //     title: '净收入',
                //     className: 'column-right',
                //     dataIndex: 'net_income',
                //     width: 80,
                // },
                {
                    title: '日工资',
                    dataIndex: 'salary',
                    className: 'column-right',
                    width: 75,
                }, {
                    title: '分红',
                    dataIndex: 'allsalary',
                    className: 'column-right',
                    width: 75,
                }, {
                    title: '总盈亏',
                    dataIndex: 'last_win_lose',
                    className: 'column-right',
                    render: text => text < 0 ? <span className="col_color_shu">{text}</span> :
                        <span className="col_color_ying">{text}</span>,
                    width: 75,
                }
            ];
            footer = <ul className="st_f_Two clear">
                <li>总计</li>
                <li>{sum.sum_cp_stake}</li>
                <li>{sum.sum_cp_effective}</li>
                <li>{sum.sum_cp_bonust}</li>
                <li>{sum.sum_cp_point}</li>
                <li>{sum.sum_income}</li>
                <li>{sum.sum_sum_activity}</li>
                {/*<li>{sum.sum_net_income}</li>*/}
                <li>{sum.sum_salary}</li>
                <li>{sum.sum_allsalary}</li>
                <li className={parseFloat(sum.sum_last_win_lose) < 0 ? 'col_color_shu' : 'col_color_ying'}>{sum.sum_last_win_lose}</li>
            </ul>;
        }
        if(dailysalaryStatus.isSalary != 1){
            columns = [
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
                    width: 70,
                }, {
                    title: '投注量',
                    dataIndex: 'cp_stake',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: '有效投注量',
                    dataIndex: 'cp_effective_stake',
                    className: 'column-right',
                    width: 85,
                },  {
                    title: '中奖',
                    dataIndex: 'cp_bonus',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: '返点',
                    dataIndex: 'cp_point',
                    className: 'column-right',
                    width: 70,
                }, {
                    title: '毛收入',
                    dataIndex: 'income',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: '活动',
                    dataIndex: 'sum_activity',
                    className: 'column-right',
                    width: 70,
                },
                // {
                //     title: '净收入',
                //     dataIndex: 'net_income',
                //     className: 'column-right',
                //     width: 80,
                // },
                {
                    title: '日亏损',
                    dataIndex: 'lose_salary',
                    className: 'column-right',
                    width: 75,
                }, {
                    title: '分红',
                    dataIndex: 'allsalary',
                    className: 'column-right',
                    width: 75,
                }, {
                    title: '总盈亏',
                    dataIndex: 'last_win_lose',
                    className: 'column-right',
                    render: text => text < 0 ? <span className="col_color_shu">{text}</span> :
                        <span className="col_color_ying">{text}</span>,
                    width: 75,
                }
            ];
            footer = <ul className="st_f_Two clear">
                <li>总计</li>
                <li>{sum.sum_cp_stake}</li>
                <li>{sum.sum_cp_effective}</li>
                <li>{sum.sum_cp_bonust}</li>
                <li>{sum.sum_cp_point}</li>
                <li>{sum.sum_income}</li>
                <li>{sum.sum_sum_activity}</li>
                {/*<li>{sum.sum_net_income}</li>*/}
                <li>{sum.sum_lose_salary}</li>
                <li>{sum.sum_allsalary}</li>
                <li className={parseFloat(sum.sum_last_win_lose) < 0 ? 'col_color_shu' : 'col_color_ying'}>{sum.sum_last_win_lose}</li>
            </ul>;
        }
        if(dailysalaryStatus.isDividend != 1){
            columns = [
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
                    width: 70,
                }, {
                    title: '投注量',
                    dataIndex: 'cp_stake',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: '有效投注量',
                    dataIndex: 'cp_effective_stake',
                    className: 'column-right',
                    width: 85,
                },  {
                    title: '中奖',
                    dataIndex: 'cp_bonus',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: '返点',
                    dataIndex: 'cp_point',
                    className: 'column-right',
                    width: 70,
                }, {
                    title: '毛收入',
                    dataIndex: 'income',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: '活动',
                    dataIndex: 'sum_activity',
                    className: 'column-right',
                    width: 70,
                },
                // {
                //     title: '净收入',
                //     dataIndex: 'net_income',
                //     className: 'column-right',
                //     width: 80,
                // },
                {
                    title: '日工资',
                    dataIndex: 'salary',
                    className: 'column-right',
                    width: 75,
                }, {
                    title: '日亏损',
                    dataIndex: 'lose_salary',
                    className: 'column-right',
                    width: 75,
                }, {
                    title: '总盈亏',
                    dataIndex: 'last_win_lose',
                    className: 'column-right',
                    render: text => text < 0 ? <span className="col_color_shu">{text}</span> :
                        <span className="col_color_ying">{text}</span>,
                    width: 75,
                }
            ];
            footer = <ul className="st_f_Two clear">
                <li>总计</li>
                <li>{sum.sum_cp_stake}</li>
                <li>{sum.sum_cp_effective}</li>
                <li>{sum.sum_cp_bonust}</li>
                <li>{sum.sum_cp_point}</li>
                <li>{sum.sum_income}</li>
                <li>{sum.sum_sum_activity}</li>
                {/*<li>{sum.sum_net_income}</li>*/}
                <li>{sum.sum_salary}</li>
                <li>{sum.sum_lose_salary}</li>
                <li className={parseFloat(sum.sum_last_win_lose) < 0 ? 'col_color_shu' : 'col_color_ying'}>{sum.sum_last_win_lose}</li>
            </ul>;
        }
        if(dailysalaryStatus.isLose != 1 && dailysalaryStatus.isSalary != 1){
            columns = [
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
                    width: 70,
                }, {
                    title: '投注量',
                    dataIndex: 'cp_stake',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: '有效投注量',
                    dataIndex: 'cp_effective_stake',
                    className: 'column-right',
                    width: 85,
                },  {
                    title: '中奖',
                    dataIndex: 'cp_bonus',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: '返点',
                    dataIndex: 'cp_point',
                    className: 'column-right',
                    width: 70,
                }, {
                    title: '毛收入',
                    dataIndex: 'income',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: '活动',
                    dataIndex: 'sum_activity',
                    className: 'column-right',
                    width: 70,
                },
                // {
                //     title: '净收入',
                //     dataIndex: 'net_income',
                //     className: 'column-right',
                //     width: 80,
                // },
                {
                    title: '分红',
                    dataIndex: 'allsalary',
                    className: 'column-right',
                    width: 75,
                }, {
                    title: '总盈亏',
                    dataIndex: 'last_win_lose',
                    className: 'column-right',
                    render: text => text < 0 ? <span className="col_color_shu">{text}</span> :
                        <span className="col_color_ying">{text}</span>,
                    width: 75,
                }
            ];
            footer = <ul className="st_f_showOne clear">
                <li>总计</li>
                <li>{sum.sum_cp_stake}</li>
                <li>{sum.sum_cp_effective}</li>
                <li>{sum.sum_cp_bonust}</li>
                <li>{sum.sum_cp_point}</li>
                <li>{sum.sum_income}</li>
                <li>{sum.sum_sum_activity}</li>
                {/*<li>{sum.sum_net_income}</li>*/}
                <li>{sum.sum_allsalary}</li>
                <li className={parseFloat(sum.sum_last_win_lose) < 0 ? 'col_color_shu' : 'col_color_ying'}>{sum.sum_last_win_lose}</li>
            </ul>;
        }
        if(dailysalaryStatus.isLose != 1 && dailysalaryStatus.isDividend != 1){
            columns = [
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
                    width: 70,
                }, {
                    title: '投注量',
                    dataIndex: 'cp_stake',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: '有效投注量',
                    dataIndex: 'cp_effective_stake',
                    className: 'column-right',
                    width: 85,
                },  {
                    title: '中奖',
                    dataIndex: 'cp_bonus',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: '返点',
                    dataIndex: 'cp_point',
                    className: 'column-right',
                    width: 70,
                }, {
                    title: '毛收入',
                    dataIndex: 'income',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: '活动',
                    dataIndex: 'sum_activity',
                    className: 'column-right',
                    width: 70,
                },
                // {
                //     title: '净收入',
                //     dataIndex: 'net_income',
                //     className: 'column-right',
                //     width: 80,
                // },
                {
                    title: '日工资',
                    dataIndex: 'salary',
                    className: 'column-right',
                    width: 75,
                }, {
                    title: '总盈亏',
                    dataIndex: 'last_win_lose',
                    className: 'column-right',
                    render: text => text < 0 ? <span className="col_color_shu">{text}</span> :
                        <span className="col_color_ying">{text}</span>,
                    width: 75,
                }
            ];
            footer = <ul className="st_f_showOne clear">
                <li>总计</li>
                <li>{sum.sum_cp_stake}</li>
                <li>{sum.sum_cp_effective}</li>
                <li>{sum.sum_cp_bonust}</li>
                <li>{sum.sum_cp_point}</li>
                <li>{sum.sum_income}</li>
                <li>{sum.sum_sum_activity}</li>
                {/*<li>{sum.sum_net_income}</li>*/}
                <li>{sum.sum_salary}</li>
                <li className={parseFloat(sum.sum_last_win_lose) < 0 ? 'col_color_shu' : 'col_color_ying'}>{sum.sum_last_win_lose}</li>
            </ul>;
        }
        if(dailysalaryStatus.isSalary != 1 && dailysalaryStatus.isDividend != 1){
            columns = [
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
                    width: 70,
                }, {
                    title: '投注量',
                    dataIndex: 'cp_stake',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: '有效投注量',
                    dataIndex: 'cp_effective_stake',
                    className: 'column-right',
                    width: 85,
                },  {
                    title: '中奖',
                    dataIndex: 'cp_bonus',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: '返点',
                    dataIndex: 'cp_point',
                    className: 'column-right',
                    width: 70,
                }, {
                    title: '毛收入',
                    dataIndex: 'income',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: '活动',
                    dataIndex: 'sum_activity',
                    className: 'column-right',
                    width: 70,
                },
                // {
                //     title: '净收入',
                //     dataIndex: 'net_income',
                //     className: 'column-right',
                //     width: 80,
                // },
                {
                    title: '日亏损',
                    dataIndex: 'lose_salary',
                    className: 'column-right',
                    width: 75,
                }, {
                    title: '总盈亏',
                    dataIndex: 'last_win_lose',
                    className: 'column-right',
                    render: text => text < 0 ? <span className="col_color_shu">{text}</span> :
                        <span className="col_color_ying">{text}</span>,
                    width: 75,
                }
            ];
            footer = <ul className="st_f_showOne clear">
                <li>总计</li>
                <li>{sum.sum_cp_stake}</li>
                <li>{sum.sum_cp_effective}</li>
                <li>{sum.sum_cp_bonust}</li>
                <li>{sum.sum_cp_point}</li>
                <li>{sum.sum_income}</li>
                <li>{sum.sum_sum_activity}</li>
                {/*<li>{sum.sum_net_income}</li>*/}
                <li>{sum.sum_lose_salary}</li>
                <li className={parseFloat(sum.sum_last_win_lose) < 0 ? 'col_color_shu' : 'col_color_ying'}>{sum.sum_last_win_lose}</li>
            </ul>;
        }
        if(dailysalaryStatus.isLose != 1 && dailysalaryStatus.isSalary != 1 && dailysalaryStatus.isDividend != 1){
            columns = [
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
                    width: 70,
                }, {
                    title: '投注量',
                    dataIndex: 'cp_stake',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: '有效投注量',
                    dataIndex: 'cp_effective_stake',
                    className: 'column-right',
                    width: 85,
                },  {
                    title: '中奖',
                    dataIndex: 'cp_bonus',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: '返点',
                    dataIndex: 'cp_point',
                    className: 'column-right',
                    width: 70,
                }, {
                    title: '毛收入',
                    dataIndex: 'income',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: '活动',
                    dataIndex: 'sum_activity',
                    className: 'column-right',
                    width: 70,
                },
                // {
                //     title: '净收入',
                //     dataIndex: 'net_income',
                //     className: 'column-right',
                //     width: 80,
                // },
                {
                    title: '总盈亏',
                    dataIndex: 'last_win_lose',
                    className: 'column-right',
                    render: text => text < 0 ? <span className="col_color_shu">{text}</span> :
                        <span className="col_color_ying">{text}</span>,
                    width: 75,
                }
            ];
            footer = <ul className="st_f_showZero clear">
                <li>总计</li>
                <li>{sum.sum_cp_stake}</li>
                <li>{sum.sum_cp_effective}</li>
                <li>{sum.sum_cp_bonust}</li>
                <li>{sum.sum_cp_point}</li>
                <li>{sum.sum_income}</li>
                <li>{sum.sum_sum_activity}</li>
                {/*<li>{sum.sum_net_income}</li>*/}
                <li className={parseFloat(sum.sum_last_win_lose) < 0 ? 'col_color_shu' : 'col_color_ying'}>{sum.sum_last_win_lose}</li>
            </ul>;
        }

        if(otherGamesSum != undefined){
            if(variety == 0){
                columnsRests = [
                    {
                        title: '日期',
                        dataIndex: 'date',
                        width: 150,
                    }, {
                        title: '用户名',
                        dataIndex: 'userName',
                        render: text => userInfo.userName,
                        width: 150,
                    }, {
                        title: '投注',
                        dataIndex: 'stake_amount',
                        className: 'column-right',
                        width: 150,
                    }, {
                        title: '有效投注',
                        dataIndex: 'valid_amount',
                        className: 'column-right',
                        width: 150,
                    }, {
                        title: '中奖金额',
                        dataIndex: 'back_amount',
                        className: 'column-right',
                        width: 150,
                    }, {
                        title: '累计盈利',
                        dataIndex: 'win_lose',
                        className: 'column-right',
                        render: text => parseFloat(text) < 0 ? <span className="col_color_shu">{text}</span> :
                            <span className="col_color_ying">{text}</span>,
                        width: 150,
                    }
                ];
                otherGamesFooter = <ul className="o_g_footer clear">
                    <li>总计</li>
                    <li>{otherGamesSum.total_stake}</li>
                    <li>{otherGamesSum.total_valid}</li>
                    <li>{otherGamesSum.total_back}</li>
                    <li className={parseFloat(otherGamesSum.win_lose) < 0 ? 'col_color_shu' : 'col_color_ying'}>{otherGamesSum.win_lose}</li>
                </ul>;
            }else if(variety == 1){
                columnsRests = [
                    {
                        title: '日期',
                        dataIndex: 'date',
                        width: 150,
                    }, {
                        title: '用户名',
                        dataIndex: 'userName',
                        render: text => userInfo.userName,
                        width: 150,
                    }, {
                        title: '投注',
                        dataIndex: 'total_bet',
                        className: 'column-right',
                        width: 150,
                    }, {
                        title: '有效投注',
                        dataIndex: 'total_valid_bet',
                        className: 'column-right',
                        width: 150,
                    }, {
                        title: '中奖金额',
                        dataIndex: 'total_valid_win',
                        className: 'column-right',
                        width: 150,
                    }, {
                        title: '累计盈利',
                        dataIndex: 'total_win_loss',
                        className: 'column-right',
                        render: text => parseFloat(text) < 0 ? <span className="col_color_shu">{text}</span> :
                            <span className="col_color_ying">{text}</span>,
                        width: 150,
                    }
                ];
                otherGamesFooter = <ul className="o_g_footer clear">
                    <li>总计</li>
                    <li>{otherGamesSum.bet}</li>
                    <li>{otherGamesSum.valid_bet}</li>
                    <li>{otherGamesSum.valid_win}</li>
                    <li className={parseFloat(otherGamesSum.win_loss) < 0 ? 'col_color_shu' : 'col_color_ying'}>{otherGamesSum.win_loss}</li>
                </ul>;
            }else if(variety == 2){
                columnsRests = [
                    {
                        title: '日期',
                        dataIndex: 'date',
                        width: 150,
                    }, {
                        title: '用户名',
                        dataIndex: 'userName',
                        render: text => userInfo.userName,
                        width: 150,
                    }, {
                        title: '投注',
                        dataIndex: 'stake_amount',
                        className: 'column-right',
                        width: 150,
                    }, {
                        title: '有效投注',
                        dataIndex: 'valid_amount',
                        className: 'column-right',
                        width: 150,
                    }, {
                        title: '累计盈利',
                        dataIndex: 'back_amount',
                        className: 'column-right',
                        render: text => parseFloat(text) < 0 ? <span className="col_color_shu">{text}</span> :
                            <span className="col_color_ying">{text}</span>,
                        width: 150,
                    }
                ];
                otherGamesFooter = <ul className="o_g_tl_footer clear">
                    <li>总计</li>
                    <li>{otherGamesSum.total_stake}</li>
                    <li>{otherGamesSum.total_valid}</li>
                    <li className={parseFloat(otherGamesSum.win_lose) < 0 ? 'col_color_shu' : 'col_color_ying'}>{otherGamesSum.win_lose}</li>
                </ul>;
            }else if(variety == 3){
                columnsRests = [
                    {
                        title: '日期',
                        dataIndex: 'date',
                        width: 150,
                    }, {
                        title: '总投注金额',
                        dataIndex: 'total_bet',
                        className: 'column-right',
                        width: 150,
                    }, {
                        title: '返点总额',
                        dataIndex: 'total_point',
                        className: 'column-right',
                        width: 150,
                    }, {
                        title: '中奖总额',
                        dataIndex: 'total_win',
                        className: 'column-right',
                        width: 150,
                    }, {
                        title: '奖池奖金总额',
                        dataIndex: 'total_win_pool',
                        className: 'column-right',
                        width: 150,
                    }, {
                        title: '累计盈利',
                        dataIndex: 'total_winloss',
                        className: 'column-right',
                        render: text => parseFloat(text) < 0 ? <span className="col_color_shu">{text}</span> :
                            <span className="col_color_ying">{text}</span>,
                        width: 150,
                    }
                ];
                otherGamesFooter = <ul className="o_g_bobing_footer clear">
                    <li>总计</li>
                    <li>{otherGamesSum.total_bet}</li>
                    <li>{otherGamesSum.total_point}</li>
                    <li>{otherGamesSum.total_win}</li>
                    <li>{otherGamesSum.total_win_pool}</li>
                    <li className={parseFloat(otherGamesSum.total_winloss) < 0 ? 'col_color_shu' : 'col_color_ying'}>{otherGamesSum.total_winloss}</li>
                </ul>;
            }else{}
        }

        return (
            <div className="report">
                <div className="team_list_top">
                    <div className="t_l_time">
                        <ul className="t_l_time_row">
                            <li>
                                <span>查询日期：</span>
                                <DatePicker
                                    format={ "YYYY-MM-DD" + ' ' + this.state.startHMS }
                                    placeholder="请选择开始查询日期"
                                    value={moment(postData.starttime)}
                                    allowClear={false}
                                    onChange={(date, dateString)=>{this.onChangeStartTime(date, dateString)}}
                                    disabledDate={(current)=>common.disabledDate(current, -35, 1)}
                                />
                                <span style={{margin: '0 8px'}}>至</span>
                                <DatePicker
                                    format={ "YYYY-MM-DD" + ' ' + this.state.endHMS }
                                    placeholder="请选择结束查询日期"
                                    value={moment(postData.endtime)}
                                    allowClear={false}
                                    onChange={(date, dateString)=>{this.onChangeEndTime(date, dateString)}}
                                    disabledDate={(current)=>common.disabledDate(current, -35, 1)}
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
                            <li className="r_m_hint">
                                <p>提示：表数据是在数据产生30分钟后更新</p>
                            </li>
                        </ul>
                        <ul className="t_l_classify">
                            <li>
                                <span>游戏分类：</span>
                                <span className={0 === classify ? "t_l_border t_l_active" : "t_l_border"} onClick={()=>this.onClassify(0)}>彩票</span>
                                <span className={1 === classify ? "t_l_border t_l_active" : "t_l_border"} onClick={()=>this.onClassify(1)}>其他</span>
                            </li>
                            <li>
                                <span>游戏种类：</span>
                                {
                                    this.state.classify == 0 ?
                                        <span className="t_l_border t_l_active">全彩种</span> :
                                        <span>
                                            {
                                                otherGArr.map((item)=>{
                                                    return <span className={item.id === variety ? "t_l_border t_l_active" : "t_l_border"} onClick={()=>this.onVariety(item.id)} key={item.id}>{item.text}</span>
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
                                classify == 0 ?
                                    <Table columns={columns}
                                           rowKey={record => record.date}
                                           dataSource={data}
                                           loading={this.state.tableLoading}
                                           pagination={false}
                                           footer={data.length <= 0 ? null : ()=>footer}
                                    /> :
                                    <Table columns={columnsRests}
                                           rowKey={record => record.id}
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
