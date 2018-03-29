/*盈亏总表*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../../Utils';
import { stateVar } from '../../../State';
import { DatePicker, Button, Table, Pagination, Input, Tooltip, Icon } from 'antd';
import moment from 'moment';
import { setDateTime, disabledDate, getTime, getNextMonth, getMonthEndDate, datedifference } from '../../../CommonJs/common';
import Crumbs from '../../Common/Crumbs/Crumbs';

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
export default class TeamTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            threeSeven: null,
            tableLoading: false,
            searchLoading: false,
            classify: 0, // 游戏分类
            variety: 0, // 游戏种类
            postData: {
                sdatetime: setDateTime(0),
                edatetime: setDateTime(1),
                fType: 'getTeamLotteryReport', // getTeamLotteryReport获取团队彩票总表; getTeamThirdReport 获取团队第三方总表
                username: null,
                thirdid: null, //第三方的id 1是pt;2是ea;3是 体育;4是博饼
                gDate: null, // 是否按照日期分组数据 1是 0否
                p: 1,
                pagesize: 10, //只可传入 10 25 50

                orderBy: null,
                orderByType: null,
            },
            startHMS: '02:00:00',
            endHMS: '01:59:59',

            table: {
                tableData: [], // 彩票明细列表
                sum: {},
                total: 0, // 记录条数
                history: [
                    {
                        name: stateVar.userInfo.userName,
                        date: setDateTime(-1),
                    }
                ],
            },
            selfDate: '',
        }
    };
    componentDidMount() {
        this._ismount = true;
        this.getData();
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    getData(type, username) {
        this.setState({ tableLoading: true });
        let { classify, variety, postData } = this.state;
        if(classify == 0){
            postData.fType = 'getTeamLotteryReport';
            postData.thirdid = null;
        }else{
            postData.fType = 'getTeamThirdReport';
            if(variety == 0){// ea
                postData.thirdid = 2;
            }else if(variety == 1){//pt
                postData.thirdid = 1;
            }else if(variety == 2){//体育
                postData.thirdid = 3;
            }else if(variety == 3){//博饼
                postData.thirdid = 4;
            }else{}
        }
        if(type == 'onSearch'){
            postData.userid = null;
        }
        Fetch.teammain({
            method: 'POST',
            body: JSON.stringify(postData),
        }).then((res)=>{
            if(this._ismount) {
                this.setState({ searchLoading: false, tableLoading: false });
                let { table, postData } = this.state;
                if(res.status == 200){
                    let data = res.repsoneContent;
                    if(data.forYourself){
                        table.tableData = data.forYourself.concat(data.forYourTeamResult);
                    }else{
                        table.tableData = data.forYourTeamResult;
                    }
                    table.sum = data.totalSum;

                    if(type == 'onSearch'){
                        table.history = table.history.filter((item)=>item.name.indexOf('(每日数据)') < 0)
                    }
                    if(type == 'DATE'){
                        table.tableData.forEach((item, i)=>{
                            item.username = username
                        });
                        table.total = 0;
                        postData.gDate = null;
                        this.setState({
                            table: table,
                            postData,
                        });
                    }else{
                        table.total = parseInt(data.resultCount);
                        this.setState({
                            table: table,
                            selfDate: postData.sdatetime.slice(5) +' 至 '+ postData.edatetime.slice(5),
                        });
                    }
                } else {
                    table.tableData = [];
                    table.sum = {};
                    table.total = 0;
                    this.setState({table: table});
                }
            }
        })
    };
    /*搜索*/
    onSearch() {
        this.setState({ searchLoading: true });
        this.getData('onSearch');
    };
    /*开始查询日期*/
    onChangeStartTime(date, dateString) {
        if(!dateString){
            return
        }
        let postData = this.state.postData;
        postData.sdatetime = dateString.slice(0, 10);
        this.setState({postData});
    };
    /*结束查询日期*/
    onChangeEndTime(date, dateString) {
        if(!dateString){
            return
        }
        let postData = this.state.postData;
        postData.edatetime = dateString.slice(0, 10);
        this.setState({postData});
    };
    /*切换每页显示条数*/
    onShowSizeChange (current, pageSize) {
        let postData = this.state.postData;
        postData.p = current;
        postData.pagesize = pageSize;
        this.setState({postData: postData},()=>this.getData())
    };
    /*切换页面时*/
    onChangePage(page) {
        let postData = this.state.postData;
        postData.p = page;
        this.setState({postData: postData},()=>this.getData());
    };
    /*快捷选择时间*/
    onShortcutTime(val, type) {
        let { postData, threeSeven, classify } = this.state;
        let yearMonth = setDateTime(0).slice(0, 8),
            startHMSFlag = '', endHMSFlag = '';
        if(classify == 0){//游戏分类为：彩票
            startHMSFlag = '02:00:00';
            endHMSFlag = '01:59:59';
            if(val == 3){ // 上周
                postData.sdatetime = getTime(7);
                postData.edatetime = getTime(0);
            }else if(val == 4){ // 上半月
                postData.sdatetime = yearMonth + '01';
                postData.edatetime = yearMonth + '16';
            }else if(val == 5){ // 下半月
                postData.sdatetime = yearMonth + '16';
                postData.edatetime = getNextMonth(yearMonth) + '-01';
            }else if(val == 6){ // 本月
                postData.sdatetime = yearMonth + '01';
                postData.edatetime = getNextMonth(yearMonth) + '-01';
            }else{}
        }else{//游戏分类为：其他
            startHMSFlag = '00:00:00';
            endHMSFlag = '23:59:59';
            if(val == 3){ // 上周
                postData.sdatetime = getTime(7);
                postData.edatetime = getTime(1);
            }else if(val == 4){ // 上半月
                postData.sdatetime = yearMonth + '01';
                postData.edatetime = yearMonth + '15';
            }else if(val == 5){ // 下半月
                postData.sdatetime = yearMonth + '15';
                postData.edatetime = getMonthEndDate();
            }else if(val == 6){ // 本月
                postData.sdatetime = yearMonth + '01';
                postData.edatetime = getMonthEndDate();
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
        this.setState({variety: id}, ()=>this.getData());
    };
    /*游戏分类*/
    onClassify(type){
        if(type === 0){ //彩票
            this.setState({classify: 0, variety: 0}, ()=>{
                this.onShortcutTime(this.state.threeSeven, 'classify');
                this.getData();
            });
        }else{ //其他
            this.setState({classify: 1}, ()=>{
                this.onShortcutTime(this.state.threeSeven, 'classify');
                this.getData();
            });
        }

    };
    /*获取查询用户名*/
    onUserName(e) {
        let postData = this.state.postData;
        postData.username = e.target.value;
        this.setState({postData: postData});
    };

    /*面包屑组件调用*/
    onChildState(item, table) {
        let postData = this.state.postData;
        postData.username = item.name;
        postData.userid = null;
        this.setState({
            postData: postData,
            table: table,
        }, ()=>this.getData())
    };
    /*点击日期和用户名*/
    onClickTable(type, record) {
        let table = this.state.table,
            historyArr = this.state.table.history,
            postData = this.state.postData,
            historyFlag = true,
            history = {};
        if(type == 'DATE') {
            postData.userid = parseInt(record.userid);
            // postData.username = null;
            postData.gDate = 1;
            history = {
                name: record.username + '(每日数据)',
                date: postData.sdatetime,
            };
        }else{
            postData.username = record.username;
            postData.userid = null;
            postData.gDate = 0;
            history = {
                name: record.username,
                date: postData.sdatetime,
            };
        }

        this.setState({postData: postData, table: table}, ()=> {
            for(let i = 0; i < historyArr.length; i++) {
                if(historyArr[i].name === history.name) {
                    historyFlag = false;
                    break;
                }
            }
            if (historyFlag) {
                table.history.push(history);
            }
            this.getData(type, record.username);
        });
    };
    /*返回上一层table*/
    onClickGoBac_1() {
        let table = this.state.table,
            postData = this.state.postData;
        if(table.history.length === 1){
            return
        }
        table.history.splice(-1, 1);
        postData.username = table.history[table.history.length-1].name;
        postData.userid = null;
        this.setState({
            postData: postData,
            table: table,
        }, ()=>this.getData())
    };
    /*排序*/
    handleTableChange = (pagination, filters, sorter) => {
        let {postData} = this.state;
        if(sorter.columnKey == undefined){
            postData.orderBy = null;
            postData.orderByType = null;
            postData.gDate = null;
            this.setState({postData: postData});
        } else {
            postData.orderByType = sorter.order == 'descend' ? 'DESC' : 'ASC';
            postData.orderBy = sorter.columnKey;
            if(postData.userid){
                postData.gDate = 1;
            }else{
                postData.gDate = null;
            }
            this.setState({postData: postData},()=>this.getData());
        }

    };
    render() {
        const { dailysalaryStatus } = stateVar;
        const { table, classify, variety, postData, selfDate } = this.state;
        const sum = table.sum;

        let columns = [
            {
                title: '日期',
                dataIndex: 'rdate',
                render: (text, record) => postData.userid != null ?
                    text :
                    <p className="hover" onClick={()=>this.onClickTable('DATE', record)} style={{color: '#0088DE'}}>{selfDate.slice(0,5)}<br/>{selfDate.slice(5)}</p>,
                width: 60,
            }, {
                title: '用户名',
                dataIndex: 'username',
                render: (text, record, index) => stateVar.userInfo.userName == text || postData.userid != null ? text :
                    <p className="hover" onClick={()=>this.onClickTable('USERNAME', record)}
                       style={{color: '#0088DE'}}>{text}</p>,
                width: 75,
            }, {
                title: '投注量',
                dataIndex: 'sum_price',
                className: 'column-right',
                sorter: (a, b)=>{},
                width: 85,
            }, {
                title: '有效量',
                dataIndex: 'sum_effective_price',
                className: 'column-right',
                sorter: (a, b)=>{},
                width: 85,
            },  {
                title: '中奖',
                dataIndex: 'sum_bonus',
                className: 'column-right',
                sorter: (a, b)=>{},
                width: 85,
            }, {
                title: '返点',
                dataIndex: 'sum_point',
                className: 'column-right',
                width: 70,
            }, {
                title: <span>
                        毛收入
                        <Tooltip placement="bottomRight"
                                 title={
                                     '毛收入 = 投注量 - 中奖 + 返点'
                                 }>
                            <Icon className='head_hint' type="question-circle" />
                    </Tooltip>
                </span>,
                dataIndex: 'sum_grossincome',
                className: 'column-right',
                width: 85,
            }, {
                title: <span>
                        活动
                        <Tooltip placement="bottomRight"
                                 title={
                                     '活动 = 活动中完成任务领取的奖金'
                                 }>
                            <Icon className='head_hint' type="question-circle" />
                    </Tooltip>
                </span>,
                dataIndex: 'sum_activity',
                className: 'column-right',
                width: 85,
            },
            // {
            //     title: '净收入',
            //     dataIndex: 'sum_netincome',
            //     className: 'column-right',
            //     // render: (text) =>  <span className="col_color_ying">{parseFloat(text).toFixed(2)}</span>,
            //     width: 120,
            // },
            {
                title: '日工资',
                dataIndex: 'sum_dailywages',
                className: 'column-right',
                width: 85,
            }, {
                title: '日亏损',
                dataIndex: 'sum_dailyloss',
                className: 'column-right',
                width: 85,
            }, {
                title: '分红',
                dataIndex: 'sum_dividents',
                className: 'column-right',
                width: 85,
            }, {
                title: <span>
                        总盈亏
                        <Tooltip placement="bottomRight"
                                 title={
                                     '总盈亏 = 毛收入 + 日工资 + 日亏损佣金 + 活动 + 分红'
                                 }>
                            <Icon className='head_hint' type="question-circle" />
                    </Tooltip>
                </span>,
                dataIndex: 'sum_total',
                className: 'column-right',
                sorter: (a, b)=>{},
                render: text => text < 0 ? <span className="col_color_shu">{text}</span> :
                    <span className="col_color_ying">{text}</span>,
                width: 95,
            }
        ];
        let footer = <ul className="tt_footer clear">
            <li>总计</li>
            <li>{sum.total_price}</li>
            <li>{sum.total_effective_price}</li>
            <li>{sum.total_bonus}</li>
            <li>{sum.total_point}</li>
            <li>{sum.total_grossincome}</li>
            <li>{sum.total_activity}</li>
            {/*<li>{sum.total_netincome}</li>*/}
            <li>{sum.total_dailywages}</li>
            <li>{sum.total_dailyloss}</li>
            <li>{sum.total_dividents}</li>
            <li className={parseFloat(sum.total_total) < 0 ? 'col_color_shu' : 'col_color_ying'}>{sum.total_total}</li>
        </ul>;
        if(dailysalaryStatus.isLose != 1){
            columns = [
                {
                    title: '日期',
                    dataIndex: 'rdate',
                    render: (text, record) => postData.userid != null ? text : <a href="javascript:void(0)" onClick={()=>this.onClickTable('DATE', record)} style={{color: '#0088DE'}}>{selfDate}</a>,
                    width: 50,
                }, {
                    title: '用户名',
                    dataIndex: 'username',
                    render: (text, record, index) => stateVar.userInfo.userName == text || postData.userid != null ? text :
                        <a href="javascript:void(0)" onClick={()=>this.onClickTable('USERNAME', record)}
                           style={{color: '#0088DE'}}>{text}</a>,
                    width: 70,
                }, {
                    title: '投注量',
                    dataIndex: 'sum_price',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    width: 80,
                }, {
                    title: '有效量',
                    dataIndex: 'sum_effective_price',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    width: 90,
                },  {
                    title: '中奖',
                    dataIndex: 'sum_bonus',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    width: 80,
                }, {
                    title: '返点',
                    dataIndex: 'sum_point',
                    className: 'column-right',
                    width: 70,
                }, {
                    title: <span>
                        毛收入
                        <Tooltip placement="bottomRight"
                                 title={
                                     '毛收入 = 投注量 - 中奖 + 返点'
                                 }>
                            <Icon className='head_hint' type="question-circle" />
                    </Tooltip>
                </span>,
                    dataIndex: 'sum_grossincome',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: <span>
                        活动
                        <Tooltip placement="bottomRight"
                                 title={
                                     '活动 = 活动中完成任务领取的奖金'
                                 }>
                            <Icon className='head_hint' type="question-circle" />
                    </Tooltip>
                </span>,
                    dataIndex: 'sum_activity',
                    className: 'column-right',
                    width: 70,
                },
                // {
                //     title: '净收入',
                //     dataIndex: 'sum_netincome',
                //     className: 'column-right',
                //     width: 80,
                // },
                {
                    title: '日工资',
                    dataIndex: 'sum_dailywages',
                    className: 'column-right',
                    width: 75,
                }, {
                    title: '分红',
                    dataIndex: 'sum_dividents',
                    className: 'column-right',
                    width: 75,
                }, {
                    title: <span>
                        总盈亏
                        <Tooltip placement="bottomRight"
                                 title={
                                     '总盈亏 = 毛收入 + 日工资 + 日亏损佣金 + 活动 + 分红'
                                 }>
                            <Icon className='head_hint' type="question-circle" />
                    </Tooltip>
                </span>,
                    dataIndex: 'sum_total',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    render: text => text < 0 ? <span className="col_color_shu">{text}</span> :
                        <span className="col_color_ying">{text}</span>,
                    width: 80,
                }
            ];
            footer = <ul className="tt_f_showTwo clear">
                <li>总计</li>
                <li>{sum.total_price}</li>
                <li>{sum.total_effective_price}</li>
                <li>{sum.total_bonus}</li>
                <li>{sum.total_point}</li>
                <li>{sum.total_grossincome}</li>
                <li>{sum.total_activity}</li>
                {/*<li>{sum.total_netincome}</li>*/}
                <li>{sum.total_dailywages}</li>
                <li>{sum.total_dividents}</li>
                <li className={parseFloat(sum.total_total) < 0 ? 'col_color_shu' : 'col_color_ying'}>{sum.total_total}</li>
            </ul>;
        }
        if(dailysalaryStatus.isSalary != 1){
            columns = [
                {
                    title: '日期',
                    dataIndex: 'rdate',
                    render: (text, record) => postData.userid != null ? text : <a href="javascript:void(0)" onClick={()=>this.onClickTable('DATE', record)} style={{color: '#0088DE'}}>{selfDate}</a>,
                    width: 50,
                }, {
                    title: '用户名',
                    dataIndex: 'username',
                    render: (text, record, index) => stateVar.userInfo.userName == text || postData.userid != null ? text :
                        <a href="javascript:void(0)" onClick={()=>this.onClickTable('USERNAME', record)}
                           style={{color: '#0088DE'}}>{text}</a>,
                    width: 70,
                }, {
                    title: '投注量',
                    dataIndex: 'sum_price',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    width: 80,
                }, {
                    title: '有效量',
                    dataIndex: 'sum_effective_price',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    width: 90,
                },  {
                    title: '中奖',
                    dataIndex: 'sum_bonus',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    width: 80,
                }, {
                    title: '返点',
                    dataIndex: 'sum_point',
                    className: 'column-right',
                    width: 70,
                }, {
                    title: <span>
                        毛收入
                        <Tooltip placement="bottomRight"
                                 title={
                                     '毛收入 = 投注量 - 中奖 + 返点'
                                 }>
                            <Icon className='head_hint' type="question-circle" />
                    </Tooltip>
                </span>,
                    dataIndex: 'sum_grossincome',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: <span>
                        活动
                        <Tooltip placement="bottomRight"
                                 title={
                                     '活动 = 活动中完成任务领取的奖金'
                                 }>
                            <Icon className='head_hint' type="question-circle" />
                    </Tooltip>
                </span>,
                    dataIndex: 'sum_activity',
                    className: 'column-right',
                    width: 70,
                },
                // {
                //     title: '净收入',
                //     dataIndex: 'sum_netincome',
                //     className: 'column-right',
                //     width: 80,
                // },
                {
                    title: '日亏损',
                    dataIndex: 'sum_dailyloss',
                    className: 'column-right',
                    width: 75,
                }, {
                    title: '分红',
                    dataIndex: 'sum_dividents',
                    className: 'column-right',
                    width: 75,
                }, {
                    title: <span>
                        总盈亏
                        <Tooltip placement="bottomRight"
                                 title={
                                     '总盈亏 = 毛收入 + 日工资 + 日亏损佣金 + 活动 + 分红'
                                 }>
                            <Icon className='head_hint' type="question-circle" />
                    </Tooltip>
                </span>,
                    dataIndex: 'sum_total',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    render: text => text < 0 ? <span className="col_color_shu">{text}</span> :
                        <span className="col_color_ying">{text}</span>,
                    width: 80,
                }
            ];
            footer = <ul className="tt_f_showTwo clear">
                <li>总计</li>
                <li>{sum.total_price}</li>
                <li>{sum.total_effective_price}</li>
                <li>{sum.total_bonus}</li>
                <li>{sum.total_point}</li>
                <li>{sum.total_grossincome}</li>
                <li>{sum.total_activity}</li>
                {/*<li>{sum.total_netincome}</li>*/}
                <li>{sum.total_dailyloss}</li>
                <li>{sum.total_dividents}</li>
                <li className={parseFloat(sum.total_total) < 0 ? 'col_color_shu' : 'col_color_ying'}>{sum.total_total}</li>
            </ul>;
        }
        if(dailysalaryStatus.isDividend != 1){
            columns = [
                {
                    title: '日期',
                    dataIndex: 'rdate',
                    render: (text, record) => postData.userid != null ? text : <a href="javascript:void(0)" onClick={()=>this.onClickTable('DATE', record)} style={{color: '#0088DE'}}>{selfDate}</a>,
                    width: 70,
                }, {
                    title: '用户名',
                    dataIndex: 'username',
                    render: (text, record, index) => stateVar.userInfo.userName == text || postData.userid != null ? text :
                        <a href="javascript:void(0)" onClick={()=>this.onClickTable('USERNAME', record)}
                           style={{color: '#0088DE'}}>{text}</a>,
                    width: 80,
                }, {
                    title: '投注量',
                    dataIndex: 'sum_price',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    width: 80,
                }, {
                    title: '有效量',
                    dataIndex: 'sum_effective_price',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    width: 90,
                },  {
                    title: '中奖',
                    dataIndex: 'sum_bonus',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    width: 80,
                }, {
                    title: '返点',
                    dataIndex: 'sum_point',
                    className: 'column-right',
                    width: 70,
                }, {
                    title: <span>
                        毛收入
                        <Tooltip placement="bottomRight"
                                 title={
                                     '毛收入 = 投注量 - 中奖 + 返点'
                                 }>
                            <Icon className='head_hint' type="question-circle" />
                    </Tooltip>
                </span>,
                    dataIndex: 'sum_grossincome',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: <span>
                        活动
                        <Tooltip placement="bottomRight"
                                 title={
                                     '活动 = 活动中完成任务领取的奖金'
                                 }>
                            <Icon className='head_hint' type="question-circle" />
                    </Tooltip>
                </span>,
                    dataIndex: 'sum_activity',
                    className: 'column-right',
                    width: 70,
                },
                // {
                //     title: '净收入',
                //     dataIndex: 'sum_netincome',
                //     className: 'column-right',
                //     width: 80,
                // },
                {
                    title: '日工资',
                    dataIndex: 'sum_dailywages',
                    className: 'column-right',
                    width: 75,
                }, {
                    title: '日亏损',
                    dataIndex: 'sum_dailyloss',
                    className: 'column-right',
                    width: 75,
                }, {
                    title: <span>
                        总盈亏
                        <Tooltip placement="bottomRight"
                                 title={
                                     '总盈亏 = 毛收入 + 日工资 + 日亏损佣金 + 活动 + 分红'
                                 }>
                            <Icon className='head_hint' type="question-circle" />
                    </Tooltip>
                </span>,
                    dataIndex: 'sum_total',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    render: text => text < 0 ? <span className="col_color_shu">{text}</span> :
                        <span className="col_color_ying">{text}</span>,
                    width: 80,
                }
            ];
            footer = <ul className="tt_f_showTwo clear">
                <li>总计</li>
                <li>{sum.total_price}</li>
                <li>{sum.total_effective_price}</li>
                <li>{sum.total_bonus}</li>
                <li>{sum.total_point}</li>
                <li>{sum.total_grossincome}</li>
                <li>{sum.total_activity}</li>
                {/*<li>{sum.total_netincome}</li>*/}
                <li>{sum.total_dailywages}</li>
                <li>{sum.total_dailyloss}</li>
                <li className={parseFloat(sum.total_total) < 0 ? 'col_color_shu' : 'col_color_ying'}>{sum.total_total}</li>
            </ul>;
        }
        if(dailysalaryStatus.isLose != 1 && dailysalaryStatus.isSalary != 1){
            columns = [
                {
                    title: '日期',
                    dataIndex: 'rdate',
                    render: (text, record) => postData.userid != null ? text : <a href="javascript:void(0)" onClick={()=>this.onClickTable('DATE', record)} style={{color: '#0088DE'}}>{selfDate}</a>,
                    width: 75,
                }, {
                    title: '用户名',
                    dataIndex: 'username',
                    render: (text, record, index) => stateVar.userInfo.userName == text || postData.userid != null ? text :
                        <a href="javascript:void(0)" onClick={()=>this.onClickTable('USERNAME', record)}
                           style={{color: '#0088DE'}}>{text}</a>,
                    width: 80,
                }, {
                    title: '投注量',
                    dataIndex: 'sum_price',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    width: 80,
                }, {
                    title: '有效量',
                    dataIndex: 'sum_effective_price',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    width: 90,
                },  {
                    title: '中奖',
                    dataIndex: 'sum_bonus',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    width: 80,
                }, {
                    title: '返点',
                    dataIndex: 'sum_point',
                    className: 'column-right',
                    width: 70,
                }, {
                    title: <span>
                        毛收入
                        <Tooltip placement="bottomRight"
                                 title={
                                     '毛收入 = 投注量 - 中奖 + 返点'
                                 }>
                            <Icon className='head_hint' type="question-circle" />
                    </Tooltip>
                </span>,
                    dataIndex: 'sum_grossincome',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: <span>
                        活动
                        <Tooltip placement="bottomRight"
                                 title={
                                     '活动 = 活动中完成任务领取的奖金'
                                 }>
                            <Icon className='head_hint' type="question-circle" />
                    </Tooltip>
                </span>,
                    dataIndex: 'sum_activity',
                    className: 'column-right',
                    width: 70,
                },
                // {
                //     title: '净收入',
                //     dataIndex: 'sum_netincome',
                //     className: 'column-right',
                //     width: 80,
                // },
                {
                    title: '分红',
                    dataIndex: 'sum_dividents',
                    className: 'column-right',
                    width: 75,
                }, {
                    title: <span>
                        总盈亏
                        <Tooltip placement="bottomRight"
                                 title={
                                     '总盈亏 = 毛收入 + 日工资 + 日亏损佣金 + 活动 + 分红'
                                 }>
                            <Icon className='head_hint' type="question-circle" />
                    </Tooltip>
                </span>,
                    dataIndex: 'sum_total',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    render: text => text < 0 ? <span className="col_color_shu">{text}</span> :
                        <span className="col_color_ying">{text}</span>,
                    width: 80,
                }
            ];
            footer = <ul className="tt_f_showOne clear">
                <li>总计</li>
                <li>{sum.total_price}</li>
                <li>{sum.total_effective_price}</li>
                <li>{sum.total_bonus}</li>
                <li>{sum.total_point}</li>
                <li>{sum.total_grossincome}</li>
                <li>{sum.total_activity}</li>
                {/*<li>{sum.total_netincome}</li>*/}
                <li>{sum.total_dividents}</li>
                <li className={parseFloat(sum.total_total) < 0 ? 'col_color_shu' : 'col_color_ying'}>{sum.total_total}</li>
            </ul>;
        }
        if(dailysalaryStatus.isLose != 1 && dailysalaryStatus.isDividend != 1){
            columns = [
                {
                    title: '日期',
                    dataIndex: 'rdate',
                    render: (text, record) => postData.userid != null ? text : <a href="javascript:void(0)" onClick={()=>this.onClickTable('DATE', record)} style={{color: '#0088DE'}}>{selfDate}</a>,
                    width: 70,
                }, {
                    title: '用户名',
                    dataIndex: 'username',
                    render: (text, record, index) => stateVar.userInfo.userName == text || postData.userid != null ? text :
                        <a href="javascript:void(0)" onClick={()=>this.onClickTable('USERNAME', record)}
                           style={{color: '#0088DE'}}>{text}</a>,
                    width: 80,
                }, {
                    title: '投注量',
                    dataIndex: 'sum_price',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    width: 80,
                }, {
                    title: '有效量',
                    dataIndex: 'sum_effective_price',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    width: 90,
                },  {
                    title: '中奖',
                    dataIndex: 'sum_bonus',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    width: 80,
                }, {
                    title: '返点',
                    dataIndex: 'sum_point',
                    className: 'column-right',
                    width: 70,
                }, {
                    title: <span>
                        毛收入
                        <Tooltip placement="bottomRight"
                                 title={
                                     '毛收入 = 投注量 - 中奖 + 返点'
                                 }>
                            <Icon className='head_hint' type="question-circle" />
                    </Tooltip>
                </span>,
                    dataIndex: 'sum_grossincome',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: <span>
                        活动
                        <Tooltip placement="bottomRight"
                                 title={
                                     '活动 = 活动中完成任务领取的奖金'
                                 }>
                            <Icon className='head_hint' type="question-circle" />
                    </Tooltip>
                </span>,
                    dataIndex: 'sum_activity',
                    className: 'column-right',
                    width: 70,
                },
                // {
                //     title: '净收入',
                //     dataIndex: 'sum_netincome',
                //     className: 'column-right',
                //     width: 80,
                // },
                {
                    title: '日工资',
                    dataIndex: 'sum_dailywages',
                    className: 'column-right',
                    width: 75,
                }, {
                    title: <span>
                        总盈亏
                        <Tooltip placement="bottomRight"
                                 title={
                                     '总盈亏 = 毛收入 + 日工资 + 日亏损佣金 + 活动 + 分红'
                                 }>
                            <Icon className='head_hint' type="question-circle" />
                    </Tooltip>
                </span>,
                    dataIndex: 'sum_total',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    render: text => text < 0 ? <span className="col_color_shu">{text}</span> :
                        <span className="col_color_ying">{text}</span>,
                    width: 80,
                }
            ];
            footer = <ul className="tt_f_showOne clear">
                <li>总计</li>
                <li>{sum.total_price}</li>
                <li>{sum.total_effective_price}</li>
                <li>{sum.total_bonus}</li>
                <li>{sum.total_point}</li>
                <li>{sum.total_grossincome}</li>
                <li>{sum.total_activity}</li>
                {/*<li>{sum.total_netincome}</li>*/}
                <li>{sum.total_dailywages}</li>
                <li className={parseFloat(sum.total_total) < 0 ? 'col_color_shu' : 'col_color_ying'}>{sum.total_total}</li>
            </ul>;
        }
        if(dailysalaryStatus.isSalary != 1 && dailysalaryStatus.isDividend != 1){
            columns = [
                {
                    title: '日期',
                    dataIndex: 'rdate',
                    render: (text, record) => postData.userid != null ? text : <a href="javascript:void(0)" onClick={()=>this.onClickTable('DATE', record)} style={{color: '#0088DE'}}>{selfDate}</a>,
                    width: 70,
                }, {
                    title: '用户名',
                    dataIndex: 'username',
                    render: (text, record, index) => stateVar.userInfo.userName == text || postData.userid != null ? text :
                        <a href="javascript:void(0)" onClick={()=>this.onClickTable('USERNAME', record)}
                           style={{color: '#0088DE'}}>{text}</a>,
                    width: 80,
                }, {
                    title: '投注量',
                    dataIndex: 'sum_price',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    width: 80,
                }, {
                    title: '有效量',
                    dataIndex: 'sum_effective_price',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    width: 90,
                },  {
                    title: '中奖',
                    dataIndex: 'sum_bonus',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    width: 80,
                }, {
                    title: '返点',
                    dataIndex: 'sum_point',
                    className: 'column-right',
                    width: 70,
                }, {
                    title: <span>
                        毛收入
                        <Tooltip placement="bottomRight"
                                 title={
                                     '毛收入 = 投注量 - 中奖 + 返点'
                                 }>
                            <Icon className='head_hint' type="question-circle" />
                    </Tooltip>
                </span>,
                    dataIndex: 'sum_grossincome',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: <span>
                        活动
                        <Tooltip placement="bottomRight"
                                 title={
                                     '活动 = 活动中完成任务领取的奖金'
                                 }>
                            <Icon className='head_hint' type="question-circle" />
                    </Tooltip>
                </span>,
                    dataIndex: 'sum_activity',
                    className: 'column-right',
                    width: 70,
                },
                // {
                //     title: '净收入',
                //     dataIndex: 'sum_netincome',
                //     className: 'column-right',
                //     width: 80,
                // },
                {
                    title: '日亏损',
                    dataIndex: 'sum_dailyloss',
                    className: 'column-right',
                    width: 75,
                }, {
                    title: <span>
                        总盈亏
                        <Tooltip placement="bottomRight"
                                 title={
                                     '总盈亏 = 毛收入 + 日工资 + 日亏损佣金 + 活动 + 分红'
                                 }>
                            <Icon className='head_hint' type="question-circle" />
                    </Tooltip>
                </span>,
                    dataIndex: 'sum_total',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    render: text => text < 0 ? <span className="col_color_shu">{text}</span> :
                        <span className="col_color_ying">{text}</span>,
                    width: 80,
                }
            ];
            footer = <ul className="tt_f_showOne clear">
                <li>总计</li>
                <li>{sum.total_price}</li>
                <li>{sum.total_effective_price}</li>
                <li>{sum.total_bonus}</li>
                <li>{sum.total_point}</li>
                <li>{sum.total_grossincome}</li>
                <li>{sum.total_activity}</li>
                {/*<li>{sum.total_netincome}</li>*/}
                <li>{sum.total_dailyloss}</li>
                <li className={parseFloat(sum.total_total) < 0 ? 'col_color_shu' : 'col_color_ying'}>{sum.total_total}</li>
            </ul>;
        }
        if(dailysalaryStatus.isLose != 1 && dailysalaryStatus.isSalary != 1 && dailysalaryStatus.isDividend != 1){
            columns = [
                {
                    title: '日期',
                    dataIndex: 'rdate',
                    render: (text, record) => postData.userid != null ? text : <a href="javascript:void(0)" onClick={()=>this.onClickTable('DATE', record)} style={{color: '#0088DE'}}>{selfDate}</a>,
                    width: 70,
                }, {
                    title: '用户名',
                    dataIndex: 'username',
                    render: (text, record, index) => stateVar.userInfo.userName == text || postData.userid != null ? text :
                        <a href="javascript:void(0)" onClick={()=>this.onClickTable('USERNAME', record)}
                           style={{color: '#0088DE'}}>{text}</a>,
                    width: 80,
                }, {
                    title: '投注量',
                    dataIndex: 'sum_price',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    width: 80,
                }, {
                    title: '有效量',
                    dataIndex: 'sum_effective_price',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    width: 90,
                },  {
                    title: '中奖',
                    dataIndex: 'sum_bonus',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    width: 80,
                }, {
                    title: '返点',
                    dataIndex: 'sum_point',
                    className: 'column-right',
                    width: 70,
                }, {
                    title: <span>
                        毛收入
                        <Tooltip placement="bottomRight"
                                 title={
                                     '毛收入 = 投注量 - 中奖 + 返点'
                                 }>
                            <Icon className='head_hint' type="question-circle" />
                    </Tooltip>
                </span>,
                    dataIndex: 'sum_grossincome',
                    className: 'column-right',
                    width: 80,
                }, {
                    title: <span>
                        活动
                        <Tooltip placement="bottomRight"
                                 title={
                                     '活动 = 活动中完成任务领取的奖金'
                                 }>
                            <Icon className='head_hint' type="question-circle" />
                    </Tooltip>
                </span>,
                    dataIndex: 'sum_activity',
                    className: 'column-right',
                    width: 70,
                },
                // {
                //     title: '净收入',
                //     dataIndex: 'sum_netincome',
                //     className: 'column-right',
                //     width: 80,
                // },
                {
                    title: <span>
                        总盈亏
                        <Tooltip placement="bottomRight"
                                 title={
                                     '总盈亏 = 毛收入 + 日工资 + 日亏损佣金 + 活动 + 分红'
                                 }>
                            <Icon className='head_hint' type="question-circle" />
                    </Tooltip>
                </span>,
                    dataIndex: 'sum_total',
                    className: 'column-right',
                    sorter: (a, b)=>{},
                    render: text => text < 0 ? <span className="col_color_shu">{text}</span> :
                        <span className="col_color_ying">{text}</span>,
                    width: 80,
                }
            ];
            footer = <ul className="tt_f_showZero clear">
                <li>总计</li>
                <li>{sum.total_price}</li>
                <li>{sum.total_effective_price}</li>
                <li>{sum.total_bonus}</li>
                <li>{sum.total_point}</li>
                <li>{sum.total_grossincome}</li>
                <li>{sum.total_activity}</li>
                {/*<li>{sum.total_netincome}</li>*/}
                <li className={parseFloat(sum.total_total) < 0 ? 'col_color_shu' : 'col_color_ying'}>{sum.total_total}</li>
            </ul>;
        }

        if(variety == 0 || variety == 1){
            columnsRests = [
                {
                    title: '日期',
                    dataIndex: 'rdate',
                    render: (text, record) => postData.userid != null ? text : <a href="javascript:void(0)" onClick={()=>this.onClickTable('DATE', record)} style={{color: '#0088DE'}}>{selfDate}</a>,
                    width: 150,
                }, {
                    title: '用户名',
                    dataIndex: 'username',
                    render: (text, record, index) => stateVar.userInfo.userName == text || postData.userid != null ? text :
                        <a href="javascript:void(0)" onClick={()=>this.onClickTable('USERNAME', record)}
                           style={{color: '#0088DE'}}>{text}</a>,
                    width: 150,
                }, {
                    title: '投注',
                    dataIndex: 'sum_price',
                    className: 'column-right',
                    width: 150,
                }, {
                    title: '有效投注',
                    dataIndex: 'sum_effective_price',
                    className: 'column-right',
                    width: 150,
                }, {
                    title: '中奖金额',
                    dataIndex: 'sum_bonus',
                    className: 'column-right',
                    width: 150,
                }, {
                    title: '累计盈利',
                    dataIndex: 'sum_total',
                    className: 'column-right',
                    render: text => parseFloat(text) < 0 ? <span className="col_color_shu">{text}</span> :
                        <span className="col_color_ying">{text}</span>,
                    width: 150,
                }
            ];
            otherGamesFooter = <ul className="o_g_footer clear">
                <li>总计</li>
                <li>{sum.total_price}</li>
                <li>{sum.total_effective_price}</li>
                <li>{sum.total_bonus}</li>
                <li className={parseFloat(sum.total_total) < 0 ? 'col_color_shu' : 'col_color_ying'}>{sum.total_total}</li>
            </ul>;
        }else if(variety == 2){
            columnsRests = [
                {
                    title: '日期',
                    dataIndex: 'rdate',
                    render: (text, record) => postData.userid != null ? text : <a href="javascript:void(0)" onClick={()=>this.onClickTable('DATE', record)} style={{color: '#0088DE'}}>{selfDate}</a>,
                    width: 110,
                }, {
                    title: '用户名',
                    dataIndex: 'username',
                    render: (text, record, index) => stateVar.userInfo.userName == text || postData.userid != null ? text :
                        <a href="javascript:void(0)" onClick={()=>this.onClickTable('USERNAME', record)}
                           style={{color: '#0088DE'}}>{text}</a>,
                    width: 200,
                }, {
                    title: '投注',
                    dataIndex: 'sum_price',
                    className: 'column-right',
                    width: 180,
                }, {
                    title: '有效投注',
                    dataIndex: 'sum_effective_price',
                    className: 'column-right',
                    width: 180,
                }, {
                    title: '累计盈利',
                    dataIndex: 'sum_total',
                    className: 'column-right',
                    render: text => parseFloat(text) < 0 ? <span className="col_color_shu">{text}</span> :
                        <span className="col_color_ying">{text}</span>,
                    width: 180,
                }
            ];
            otherGamesFooter = <ul className="o_g_tl_footer clear">
                <li>总计</li>
                <li>{sum.total_price}</li>
                <li>{sum.total_effective_price}</li>
                <li className={parseFloat(sum.total_total) < 0 ? 'col_color_shu' : 'col_color_ying'}>{sum.total_total}</li>
            </ul>;
        }else if(variety == 3){
            columnsRests = [
                {
                    title: '日期',
                    dataIndex: 'rdate',
                    render: (text, record) => postData.userid != null ? text : <a href="javascript:void(0)" onClick={()=>this.onClickTable('DATE', record)} style={{color: '#0088DE'}}>{selfDate}</a>,
                    width: 150,
                }, {
                    title: '用户名',
                    dataIndex: 'username',
                    render: (text, record, index) => stateVar.userInfo.userName == text || postData.userid != null ? text :
                        <a href="javascript:void(0)" onClick={()=>this.onClickTable('USERNAME', record)}
                           style={{color: '#0088DE'}}>{text}</a>,
                    width: 150,
                }, {
                    title: '总投注金额',
                    dataIndex: 'sum_price',
                    className: 'column-right',
                    width: 150,
                }, {
                    title: '返点总额',
                    dataIndex: 'sum_point',
                    className: 'column-right',
                    width: 120,
                }, {
                    title: '中奖总额',
                    dataIndex: 'sum_bonus',
                    className: 'column-right',
                    width: 120,
                }, {
                    title: '奖池奖金总额',
                    dataIndex: 'sum_prizepool',
                    className: 'column-right',
                    width: 150,
                }, {
                    title: '累计盈利',
                    dataIndex: 'sum_total',
                    className: 'column-right',
                    render: text => parseFloat(text) < 0 ? <span className="col_color_shu">{text}</span> :
                        <span className="col_color_ying">{text}</span>,
                    width: 120,
                }
            ];
            otherGamesFooter = <ul className="o_g_bobing_footer clear">
                <li>总计</li>
                <li>{sum.total_price}</li>
                <li>{sum.total_point}</li>
                <li>{sum.total_bonus}</li>
                <li>{sum.total_prizepool}</li>
                <li className={parseFloat(sum.total_total) < 0 ? 'col_color_shu' : 'col_color_ying'}>{sum.total_total}</li>
            </ul>;
        }else{}

        return (
            <div className="report">
                <div className="team_list_top clear">
                    <div className="t_l_time left">
                        <ul className="t_l_time_row">
                            <li>
                                <span>查询日期：</span>
                                <DatePicker
                                    format={ "YYYY-MM-DD" + ' ' + this.state.startHMS }
                                    placeholder="请选择开始查询日期"
                                    value={moment(postData.sdatetime)}
                                    allowClear={false}
                                    onChange={(date, dateString)=>{this.onChangeStartTime(date, dateString)}}
                                    disabledDate={(current)=>disabledDate(current, -30, 0)}
                                />
                                <span style={{margin: '0 8px'}}>至</span>
                                <DatePicker
                                    format={ "YYYY-MM-DD" + ' ' + this.state.endHMS }
                                    placeholder="请选择结束查询日期"
                                    value={moment(postData.edatetime)}
                                    allowClear={false}
                                    onChange={(date, dateString)=>{this.onChangeEndTime(date, dateString)}}
                                    disabledDate={(current)=>disabledDate(current, -datedifference(postData.sdatetime, setDateTime(0)), 1)}
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
                            {
                                stateVar.userInfo.userType == 0 ?
                                    null :
                                    <li>
                                        <span>用户名：</span>
                                        <Input placeholder="请输入用户名" value={this.state.postData.username} onChange={(e)=>this.onUserName(e)}/>
                                    </li>
                            }
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
                    <div className="r_m_hint right">
                        <p>提示：总表数据保留为有效时间最近30天数据<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;盈亏数据是在数据产生30分钟后更新
                        </p>
                    </div>
                </div>
                <div className="t_l_table">
                    <div className="t_l_location_name">
                        <span className="left">当前位置：</span>
                        <Crumbs table={table} onChildState={this.onChildState.bind(this)}/>
                        <a className="t_l_goBack right" href="javascript:void(0)" onClick={()=>this.onClickGoBac_1()}> &lt;&lt;返回上一层 </a>
                    </div>
                    <div className="t_l_table_list">
                        {
                            classify === 0 ?
                                <Table columns={columns}
                                       // rowKey={record => record.rdate !== undefined ? record.rdate : record.userid}
                                       rowKey={(record, index)=> index}
                                       dataSource={table.tableData}
                                       loading={this.state.tableLoading}
                                       pagination={false}
                                       footer={table.tableData.length <= 0 ? null : ()=>footer}
                                       // bordered={true}
                                       scroll={{ y: 600 }}
                                       onChange={this.handleTableChange}
                                /> :
                                <Table columns={columnsRests}
                                       rowKey={record => record.rdate !== undefined ? record.rdate : record.userid}
                                       dataSource={table.tableData}
                                       loading={this.state.tableLoading}
                                       pagination={false}
                                       footer={table.tableData.length <= 0 ? null : ()=>otherGamesFooter}
                                       scroll={{ y: 600 }}
                                />
                        }

                    </div>
                    <div className="t_l_page">
                        <Pagination  style={{display: table.total < 1 ? 'none' : ''}}
                                     showSizeChanger
                                     onShowSizeChange={(current, pageSize)=>this.onShowSizeChange(current, pageSize)}
                                     onChange={(pageNumber)=>this.onChangePage(pageNumber)}
                                     defaultCurrent={1}
                                     total={table.total}
                                     pageSizeOptions={stateVar.pageSizeOptions.slice()}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
