/*团队列表*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { hashHistory } from 'react-router';
import { DatePicker, Table, Input, Button, Pagination, Modal } from 'antd';
import Fetch from '../../../Utils';
import Crumbs from '../../Common/Crumbs/Crumbs'
import { stateVar } from '../../../State';

import './TeamList.scss'

@observer
export default class TeamList extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            tableData: {
                dataSource: [],
                total: 0, // 数据条数
                accnumall: 0, //团队总人数
                history: [
                    {
                        name: stateVar.userInfo.userName,
                    }
                ]
            },
            selectInfo: {
                username: '', //用户id
                // min_money: '', //金额筛选最小值
                // max_money: '', //金额筛选最大值
                register_time_begin: '', //开始时间
                register_time_end: '', //结束时间
                p: 1, //页数
                pn: 10, //每页条数
                uid: '', //点击用户名传入的用户id

                sortby: null, // sortby: 字段名 asc(升序) desc(降序)
            }
        }
    };
    componentDidMount() {
        this._ismount = true;
        this.getTeamList();
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    handleTableChange = (pagination, filters, sorter) => {
        let selectInfo = this.state.selectInfo;
        if(sorter.columnKey == undefined){
            selectInfo.sortby = null;
            this.setState({selectInfo: selectInfo});
        } else {
            if(sorter.order == 'descend') {
                selectInfo.sortby = sorter.columnKey + ' ' + 'desc';
            }else{
                selectInfo.sortby = sorter.columnKey + ' ' + 'asc';
            }
            this.setState({selectInfo: selectInfo},()=>this.getTeamList());
        }
    };
    /*获取团队列表*/
    getTeamList() {
        let selectInfo = this.state.selectInfo;
        this.setState({loading: true});
        if(selectInfo.username == stateVar.userInfo.userName) {
            selectInfo.username = '';
            selectInfo.uid = '';
        }
        Fetch.usreList({
            method: "POST",
            body: JSON.stringify(selectInfo)
        }).then((res)=>{
            if(this._ismount) {
                this.setState({loading: false});
                if(res.status == 200){
                    let resData = res.repsoneContent,
                        tableData = this.state.tableData;
                    tableData.dataSource = resData.results;
                    tableData.accnumall = parseInt(resData.accnumall);
                    tableData.total = parseInt(resData.affects);
                    this.setState({tableData: tableData});
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*input用户名*/
    onChangeUserName(e) {
        let selectInfo = this.state.selectInfo;
        selectInfo.username =e.target.value;
        this.setState({selectInfo: selectInfo})
    }
    // /*最小余额*/
    // onChangeMinMoney(val) {
    //     console.log(val);
    //     let selectInfo = this.state.selectInfo;
    //     selectInfo.min_money = val;
    //     this.setState({selectInfo: selectInfo})
    // };
    // /*最大余额*/
    // onChangeMaxMoney(val) {
    //     let selectInfo = this.state.selectInfo;
    //     selectInfo.max_money = val;
    //     this.setState({selectInfo: selectInfo})
    // };
    /*注册开始时间*/
    onRegisterTimeStart(date, dateString) {
        let selectInfo = this.state.selectInfo;
        selectInfo.register_time_begin = dateString;
        this.setState({selectInfo: selectInfo})
    };
    /*注册结束时间*/
    onRegisterTimeEnd(date, dateString) {
        let selectInfo = this.state.selectInfo;
        selectInfo.register_time_end = dateString;
        this.setState({selectInfo: selectInfo})
    };
    /*点击下级用户*/
    onClickUserName(record) {
        let historyFlag = true,
            tableData = this.state.tableData,
            selectInfo = this.state.selectInfo,
            history = tableData.history;
        selectInfo.uid = record.userid;
        for(let i = 0; i < history.length; i++) {
            if(history[i].name === record.username) {
                historyFlag = false;
                break;
            }
        }
        if (historyFlag) {
            history.push({name: record.username, uid: record.userid});
        }
        this.setState({
            selectInfo: selectInfo,
            tableData: tableData,
        }, ()=>this.getTeamList(record.userid));
        console.log(tableData)
    };
    /*切换每页显示条数*/
    onShowSizeChange (current, pageSize) {
        let selectInfo = this.state.selectInfo;
        selectInfo.p = current;
        selectInfo.pn = pageSize;
        this.setState({selectInfo: selectInfo}, ()=>this.getTeamList())
    };
    /*面包屑组件调用*/
    onChildState(item, i) {
        let selectInfo = this.state.selectInfo;
        selectInfo.uid = item.uid;
        this.setState({
            selectInfo: selectInfo
        }, ()=>this.getTeamList())
    };
    /*奖金组*/
    onClickPrizeGroup(val) {

    };
    /*游戏记录*/
    onSelectGameRecord(record) {
        hashHistory.push({
                pathname: '/gameRecord/lotteryBet',
                query: {
                    name: record.username
                }
        });
    };
    render() {
        const tableData = this.state.tableData;
        const columns = [
            {
                title: '用户名',
                dataIndex: 'username',// 列数据在数据项中对应的 key，支持 a.b.c 的嵌套写法
                render: (text, record) => <a className="hover_a" href="javascript:void(0)" onClick={()=>this.onClickUserName(record)}>{text}</a>,
                width: 140,
            }, {
                title: '用户类型',
                dataIndex: 'groupname',
                width: 80,
            }, {
                title: '团队人数',
                dataIndex: 'team_count',
                sorter: () => {},
                width: 100,
            }, {
                title: '奖金组',
                dataIndex: 'prize_group',
                render: (text, record) => <a className="hover_a" href="javascript:void(0)" onClick={()=>this.onClickPrizeGroup(record)}>{text}</a>,
                sorter: () => {},
                width: 100,
            }, {
                title: '注册时间',
                dataIndex: 'register_time',
                sorter: () => {},
                width: 85,
            }, {
                title: '日工资',
                dataIndex: 'daily_salary_status',
                render: text => <Button type="danger">{text==1 ? '已签订' : '未签订'}</Button>,
                width: 100,
            }, {
                title: '分红',
                dataIndex: 'dividend_salary_status',
                render: text => <Button type="danger">{text==1 ? '已签订' : '未签订'}</Button>,
                width: 100,
            }, {
                title: '配额',
                dataIndex: 'useraccgroup_status',
                render: text => <Button type="danger">{text == 1 ? '已签订' : '未签订'}</Button>,
                width: 100,
            }, {
                title: '最后登录时间',
                dataIndex: 'lasttime',
                width: 85,
            }, {
                title: '操作',
                dataIndex: 'action',
                render: (text, record) => <Button type="danger" onClick={()=>this.onSelectGameRecord(record)}>游戏记录</Button>,
                width: 130,
            }];
        // 总计
        const footer = <div className="tabel_footer">
                            <span>总计</span>
                            <span>
                                  团队总人数：
                                  <strong>{tableData.accnumall} 人</strong>
                            </span>
                        </div>;

        return (
            <div className="team_list">
                <div className="team_list_top">
                    <div className="t_l_time">
                        <ul className="t_l_time_row">
                            <li>
                                <span>用户名：</span>
                                <Input placeholder="请输入用户名" value={this.state.selectInfo.username} onChange={(e)=>this.onChangeUserName(e)}/>
                            </li>
                            {/*<li className="t_m_date_classify">余额：</li>*/}
                            {/*<li style={{marginLeft: '8px'}}>*/}
                                {/*<InputNumber min={0} placeholder="余额" onChange={(val)=>this.onChangeMinMoney(val)} />*/}
                            {/*</li>*/}
                            {/*<li style={{margin: '0 8px'}}>至</li>*/}
                            {/*<li>*/}
                                {/*<InputNumber min={0} placeholder="余额" onChange={(val)=>this.onChangeMaxMoney(val)} />*/}
                            {/*</li>*/}
                            <li className="t_m_date_classify">注册时间：</li>
                            <li style={{marginLeft: '8px'}}>
                                <DatePicker showTime
                                            format="YYYY-MM-DD HH:mm:ss"
                                            placeholder="请选择开始时间"
                                            onChange={(date, dateString)=>this.onRegisterTimeStart(date, dateString)}
                                />
                            </li>
                            <li style={{margin: '0 8px'}}>至</li>
                            <li>
                                <DatePicker showTime
                                            format="YYYY-MM-DD HH:mm:ss"
                                            placeholder="请选择结束时间"
                                            onChange={(date, dateString)=>this.onRegisterTimeEnd(date, dateString)}
                                />
                            </li>
                            <li className="t_m_serch">
                                <Button type="primary"
                                        icon="search"
                                        onClick={()=>this.getTeamList()}
                                >
                                    搜索
                                </Button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="t_l_table">
                    <div className="t_l_location_name">
                        <span className="left">当前位置：</span>
                        <Crumbs table={this.state.tableData} onChildState={this.onChildState.bind(this)}/>
                    </div>
                    <div className="t_l_table_list">
                        <Table columns={columns}
                               rowKey={record => record.userid}
                               dataSource={this.state.tableData.dataSource}
                               pagination={false}
                               loading={this.state.loading}
                               footer={tableData.total <= 0 ? null : ()=>footer}
                               onChange={this.handleTableChange}
                        />
                    </div>
                    <div className="page right"  style={{display: tableData.total <= 0 ? 'none' : ''}}>
                        <Pagination showSizeChanger
                                    onShowSizeChange={(current, pageSize)=>this.onShowSizeChange(current, pageSize)}
                                    defaultCurrent={1}
                                    total={this.state.tableData.total}
                                    pageSizeOptions={stateVar.pageSizeOptions.slice()}
                        />
                    </div>
                </div>
            </div>

        );
    }
}
