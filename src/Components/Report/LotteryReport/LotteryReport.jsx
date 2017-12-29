/*彩票报表*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../../Utils'
import { DatePicker, Table, Pagination, Input, Button, Icon, Checkbox } from 'antd';

import moment from 'moment';
import { stateVar } from '../../../State';
import common from '../../../CommonJs/common';
import Crumbs from '../../Common/Crumbs/Crumbs';

import './LotteryReport.scss';

@observer
export default class LotteryReport extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            searchLoading: false,
            postData: {
                userid: null, //如果有这个参数就是拆开记录变多条
                // lotteryid: null, //彩种id
                parentid: null,
                starttime: common.setDateTime(0),// 查询日期
                endtime: common.setDateTime(1),// 查询日期
                p: 1,
                pn: 10,
            },
            selfDate: '',
            showLottery: false, // 隐藏彩种
            variety: 1, // 游戏分类
            checkedList: [],
            indeterminate: true,
            checkAll: true,

            searchUserName: '', //查询历史工资用户名
            visible: false, // 模态框显示隐藏

            table: {
                tableData: [], // 日工资列表
                sum: {},
                total: 0, // 日工资记录条数
                history: [
                    {
                        name: stateVar.userInfo.userName,
                        date: common.setDateTime(-1),
                    }
                ],
            },
            historyData: {},// 历史日工资

            lotteryList: [], // 游戏种类
        }
    };
    componentDidMount() {
        this._ismount = true;
        this.getData();
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    /*获取彩票报表列表*/
    getData() {
        this.setState({ loading: true });
        let postData = this.state.postData;
        Fetch.historyteamlottery({
            method: "POST",
            body: JSON.stringify(postData)
        }).then((res)=>{
            console.log(res)
            if(this._ismount){
                this.setState({
                    loading: false,
                    searchLoading: false,
                });
                let { table } = this.state;
                if(res.status == 200){
                    let data = res.repsoneContent,
                        lotteryIdArr = [];
                    table.tableData = data.results.slice(0, -1);
                    table.sum = data.results.slice(-1);
                    table.total = parseInt(data.affects);
                    data.lotterys.forEach((item, i)=>{
                        lotteryIdArr.push(item.lotteryid)
                    });

                    this.setState({
                        table: table,
                        lotteryList: data.lotterys,
                        checkedList: lotteryIdArr,
                        selfDate: postData.starttime +' 至 '+ postData.endtime,
                    });
                } else {
                    console.log(res.shortMessage);
                    table.tableData = [];
                    table.sum = {};
                    table.total = 0;
                    this.setState({table: table});
                }
            }
        });
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
    /*获取查询用户名*/
    onUserName(e) {
        let postData = this.state.postData;
        postData.username = e.target.value;
        this.setState({postData: postData})
    };
    /*搜索*/
    onSearch() {
        this.setState({ searchLoading: true });
        this.getData();
    };
    /*切换每页显示条数*/
    onShowSizeChange (current, pageSize) {
        let postData = this.state.postData;
        postData.p = current;
        postData.pn = pageSize;
        this.setState({postData: postData},()=>this.getData())
    };
    /*面包屑组件调用*/
    onChildState(item, table) {
        let postData = this.state.postData;
        postData.username = item.name;
        this.setState({
            postData: postData,
            table: table,
        }, ()=>this.getData())
    };
    /*点击用户名*/
    onClickTable(type, record) {
        let table = this.state.table,
            historyArr = this.state.table.history,
            postData = this.state.postData,
            historyFlag = true;
        if(type == 'DATE') {
            postData.userid = parseInt(record.userid);
            postData.parentid = null;
        }else{
            postData.parentid = record.parentid;
            postData.userid = null;
        }

        this.setState({postData: postData, table: table}, ()=> {
            // let history = {
            //     name: postData.username,
            //     date: postData.starttime,
            // };
            // for(let i = 0; i < historyArr.length; i++) {
            //     if(historyArr[i].name === history.name && historyArr[i].date === history.date) {
            //         historyFlag = false;
            //         break;
            //     }
            // }
            // if (historyFlag) {
            //     table.history.push(history);
            // }
            this.getData();
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
        const { postData, table, historyData, lotteryList, selfDate } = this.state;
        const columns = [
            {
                title: '日期',
                dataIndex: 'self_date',
                render: (text, record) => <a href="javascript:void(0)" onClick={()=>this.onClickTable('DATE', record)} style={{color: '#0088DE'}}>{selfDate}</a>,
                width: 140,
                filterIcon: <Icon type="smile-o" style={{ color: 'red' }} />,
            }, {
                title: '用户名',
                dataIndex: 'username',
                render: (text, record) => <a href="javascript:void(0)" onClick={()=>this.onClickTable('USERNAME', record)} style={{color: '#0088DE'}}>{text}</a>,
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
                title: '盈亏',
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
        const footer = <ul className="tfoot_list clear">
            <li>合计</li>
            <li>{table.sum.total_sale == null ? '-' : table.sum.total_sale}</li>
            <li>{table.sum.total_effective_sale == null ? '-' : table.sum.total_effective_sale}</li>
            <li>-</li>
            <li>-</li>
            <li>{table.sum.total_salary == null ? '-' : table.sum.total_salary}</li>
            <li>-</li>
        </ul>;

        return (
            <div className="lottery_report">
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
                               footer={table.total <= 0 ? null : ()=>footer}
                               // size="middle"
                        />
                    </div>
                    <div className="t_l_page right">
                        <Pagination  style={{display: table.total < 1 ? 'none' : ''}}
                                    showSizeChanger
                                    onShowSizeChange={(current, pageSize)=>this.onShowSizeChange(current, pageSize)}
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
