/*彩票明细*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../../Utils'
import { DatePicker, Table, Pagination, Input, Button, Icon, Checkbox, Modal } from 'antd';

import moment from 'moment';
import { stateVar } from '../../../State';
import { setDateTime, disabledDate, datedifference } from '../../../CommonJs/common';
import Crumbs from '../../Common/Crumbs/Crumbs';

@observer
export default class LotteryReport extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            searchLoading: false,
            postData: {
                username: '',
                userid: null, //如果有这个参数就是拆开记录变多条
                lotteryid: null,
                starttime: setDateTime(0),// 查询日期
                endtime: setDateTime(1),// 查询日期
                p: 1,
                pn: 10,
            },
            selfDate: '',
            showLottery: false, // 隐藏彩种
            variety: 1, // 游戏分类
            checkedList: [],
            indeterminate: true,
            checkAll: true,

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
            lotteryList: [], // 游戏种类
            userName: '',
        };
        // this.onChildState = this.onChildState.bind(this);
    };
    componentDidMount() {
        this._ismount = true;
        this.getData('init');
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    /*获取彩票明细列表*/
    getData(clickTable, type, username) {
        let {postData, checkedList, table} = this.state;
        if(clickTable == 'clickTable' && checkedList.length == 0){
            table.tableData = [];
            table.total = 0;
            this.setState({table, searchLoading: false});
            return
        }
        if(clickTable == 'clickTable'){
            postData.userid = null;
        }
        if(type == 'DATE'){
            // postData.username = null;
        }
        this.setState({ loading: true });
        postData.lotteryid = checkedList.join(',');
        Fetch.historyteamlottery({
            method: "POST",
            body: JSON.stringify(postData)
        }).then((res)=>{
            if(this._ismount){
                this.setState({
                    loading: false,
                    searchLoading: false,
                });
                let { table } = this.state;
                if(res.status == 200){
                    if(clickTable == 'clickTable'){
                        this.onClickTable('USERNAME', postData);
                        if(postData.username == null){
                            table.history = table.history.splice(0, 1)
                        }else{
                            table.history = table.history.filter((item)=>item.name.indexOf('(每日数据)') < 0);
                        }
                    }
                    let data = res.repsoneContent;
                    if(type == 'DATE'){
                        table.tableData.forEach((item, i)=>{
                            item.username = username
                        });
                        table.tableData = data.results;
                        table.total = 0;
                        table.sum = {};
                    }else{
                        table.tableData = data.results.slice(0, -1);
                        table.sum = data.results.slice(-1)[0];
                        table.total = parseInt(data.affects);
                    }
                    let selfDate;
                    if(clickTable == 'init'){
                        checkedList = [];
                        data.lotterys.forEach((item, i)=>{
                            checkedList.push(item.lotteryid)
                        });
                        selfDate = postData.starttime.slice(5) +' 至 '+ postData.endtime.slice(5);
                    }else{
                        selfDate =postData.starttime.slice(5,10) +' 至 '+ postData.endtime.slice(5,10);
                    }

                    this.setState({
                        table: table,
                        lotteryList: data.lotterys,
                        selfDate: selfDate,
                        checkedList,
                    });
                } else {
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        });
    };
    /*开始查询日期*/
    onChangeStartTime(date, dateString) {
        let postData = this.state.postData;
        postData.starttime = dateString.slice(0,10);
        this.setState({postData})
    };
    /*结束查询日期*/
    onChangeEndTime(date, dateString) {
        let postData = this.state.postData;
        postData.endtime = dateString.slice(0,10);
        this.setState({postData})
    };
    /*获取查询用户名*/
    onUserName(e) {
        let postData = this.state.postData;
        postData.username = e.target.value;
        this.setState({postData: postData})
    };
    /*搜索*/
    onSearch() {
        this.setState({ searchLoading: true });
        this.getData('clickTable');
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
        let {table, postData} = this.state,
            historyArr = table.history,
            historyFlag = true,
            history = {};
        if(type == 'DATE') {
            postData.userid = parseInt(record.userid);
            postData.username = null;
            postData.gDate = 1;
            history = {
                name: record.username + '(每日数据)',
                date: postData.starttime,
            };
        }else{
            postData.username = record.username;
            postData.userid = null;
            postData.gDate = 0;
            history = {
                name: record.username,
                date: postData.starttime,
            };
        }

        this.setState({
            postData: postData,
            table: table,
            userName: record.username,
        }, ()=> {
            for(let i = 0; i < historyArr.length; i++) {
                if(historyArr[i].name === history.name) {
                    historyFlag = false;
                    break;
                }
            }
            if (historyFlag && record.username != '' && record.username != null) {
                table.history.push(history);
            }
            this.getData('no', type, record.username);
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
    /*选择彩种名称*/
    onSelectBetName(){
        this.setState({showLottery: !this.state.showLottery})
    };
    // 游戏种类
    variety_index(index) {
        return index === this.state.variety ? "t_l_border t_l_active" : "t_l_border"
    };
    /*复选*/
    onChangeCheckbox(checkedList) {
        let lotteryList = this.state.lotteryList;
        this.setState({
            checkedList: checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < lotteryList.length),
            checkAll: checkedList.length === lotteryList.length,
        });
    };
    /*全彩种*/
    onCheckAllChange(e) {
        let lotteryList = this.state.lotteryList,
            lotteryIdArr = [];
        lotteryList.forEach((item, i)=>{
            lotteryIdArr.push(item.lotteryid)
        });
        this.setState({
            checkedList: e.target.checked ? lotteryIdArr : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    };

    render() {
        const { postData, table, lotteryList, selfDate, userName } = this.state;
        const columns = [
            {
                title: '日期',
                dataIndex: 'dateLevel',
                render: (text, record) => postData.userid != null ?
                    text :
                    <span className="hover_a" onClick={()=>this.onClickTable('DATE', record)}>{selfDate}</span>,
                width: 140,
            }, {
                title: '用户名',
                dataIndex: 'username',
                render: (text, record, index) => (
                    text ?
                        index == 0 ?
                            text :
                            <span className="hover_a" onClick={()=>this.onClickTable('USERNAME', record)}>{text}</span> :
                        userName
                ),
                width: 120,
            }, {
                title: '总投注',
                dataIndex: 'sum_totalprice',
                className: 'column-right',
                width: 130,
            }, {
                title: '有效投注',
                dataIndex: 'sum_effective_price',
                className: 'column-right',
                width: 130,
            }, {
                title: '中奖',
                dataIndex: 'sum_bonus',
                className: 'column-right',
                width: 130,
            }, {
                title: '返点',
                dataIndex: 'sum_diffmoney',
                className: 'column-right',
                width: 130,
            }, {
                title: '毛收入',
                dataIndex: 'self_shu',
                className: 'column-right',
                render: (text, record)=> {
                    let acount = (parseFloat(record.sum_bonus) + parseFloat(record.sum_diffmoney) - record.sum_totalprice).toFixed(4);
                    return parseFloat(acount) < 0 ? <span className="col_color_shu">{acount}</span> :
                        <span className="col_color_ying">{acount}</span>
                },
                width: 130,
            }
        ];
        let footer;
        if(table.sum != undefined) {
            const sumAccout = (parseFloat(table.sum.sum_bonus) + parseFloat(table.sum.sum_diffmoney) - table.sum.sum_totalprice).toFixed(4);
            footer = <ul className="lotteryReport_footer clear">
                <li>合计</li>
                <li>{table.sum.sum_totalprice}</li>
                <li>{table.sum.sum_effective_price}</li>
                <li>{table.sum.sum_bonus}</li>
                <li>{table.sum.sum_diffmoney}</li>
                <li className={parseFloat(sumAccout) < 0 ? 'col_color_shu' : 'col_color_ying'}>{sumAccout}</li>
            </ul>;
        }
        return (
            <div className="report">
                <div className="team_list_top">
                    <div className="t_l_time">
                        <ul className="t_l_time_row">
                            <li>
                                <span>查询日期：</span>
                                <DatePicker
                                    format={ "YYYY-MM-DD" + ' ' + '02:00:00' }
                                    allowClear={false}
                                    placeholder="请选择开始查询日期"
                                    defaultValue={moment(setDateTime(0))}
                                    onChange={(date, dateString)=>{this.onChangeStartTime(date, dateString)}}
                                    disabledDate={(current)=>disabledDate(current, -16, 0)}
                                />
                                <span style={{margin: '0 8px'}}>至</span>
                                <DatePicker
                                    format={ "YYYY-MM-DD" + ' ' + '01:59:59' }
                                    allowClear={false}
                                    placeholder="请选择结束查询日期"
                                    defaultValue={moment(setDateTime(1))}
                                    onChange={(date, dateString)=>{this.onChangeEndTime(date, dateString)}}
                                    disabledDate={(current)=>disabledDate(current, -datedifference(postData.starttime, setDateTime(0)), 1)}
                                />
                            </li>
                            <li className="r_m_hint">
                                <p>提示：彩票明细数据保留为有效时间最近16天数据</p>
                            </li>
                        </ul>
                        <ul className="t_l_classify">
                            <li>
                                <span>游戏分类：</span>
                                <span className={this.variety_index(1)} onClick={()=>{this.setState({variety: 1})}}>彩票</span>
                            </li>
                            <li>
                                <span>游戏种类：</span>
                                <Button onClick={()=>this.onSelectBetName()}>
                                    选择彩种
                                    <Icon type="menu-unfold" />
                                </Button>
                            </li>
                            <li>
                                <span>用户名：</span>
                                <Input placeholder="请输入用户名" value={this.state.postData.username} onChange={(e)=>this.onUserName(e)}/>
                            </li>
                            <li>
                                <Button type="primary" icon="search" loading={this.state.searchLoading} onClick={()=>this.onSearch()}>
                                    搜索
                                </Button>
                            </li>
                        </ul>
                    </div>
                    <div className={this.state.showLottery ? 't_m_select_lottery t_m_select_lottery_show clear' : 't_m_select_lottery clear'}>
                        <Checkbox
                            indeterminate={this.state.indeterminate}
                            onChange={(e)=>this.onCheckAllChange(e)}
                            checked={this.state.checkAll}
                        >
                            全彩种
                        </Checkbox>
                        <Checkbox.Group onChange={(checkedList)=>this.onChangeCheckbox(checkedList)}
                                        value={this.state.checkedList}
                        >
                            {
                                lotteryList.map((item, i)=>{
                                    return <Checkbox value={item.lotteryid} key={item.lotteryid}>{item.cnname}</Checkbox>
                                })
                            }
                        </Checkbox.Group>
                    </div>
                </div>
                <div className="t_l_table">
                    <div className="t_l_location_name">
                        <span className="left">当前位置：</span>
                        <Crumbs table={table} onChildState={this.onChildState.bind(this)}/>
                        <a className="t_l_goBack right" href="javascript:void(0)" onClick={()=>this.onClickGoBac_1()}> &lt;&lt;返回上一层 </a>
                    </div>
                    <div className="t_l_table_list">
                        <Table columns={columns}
                               rowKey={record => record.dateLevel == undefined ? record.userid : record.dateLevel}
                               dataSource={table.tableData}
                               pagination={false}
                               loading={this.state.loading}
                               footer={table.total <= 0 || isNaN(table.total) ? null : ()=>footer}
                        />
                    </div>
                    <div className="t_l_page" style={{display: table.total <= 0 || isNaN(table.total) ? 'none' : ''}}>
                        <Pagination showSizeChanger
                                    onShowSizeChange={(current, pageSize)=>this.onShowSizeChange(current, pageSize)}
                                    onChange={(page)=>this.onChangePagination(page)}
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
