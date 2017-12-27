/*团队列表*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { action } from 'mobx';
import { DatePicker, Checkbox, Table, Badge, Input } from 'antd';
import 'whatwg-fetch'

import request from '../../../Utils/Request'

import './TeamTable.scss'

import t_m_serch from './Img/t_m_serch.png'
import t_m_icon from './Img/t_m_icon.png'

@observer
export default class teamTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            pagination: {},
            loading: false,
            classify: 1, // 游戏分类
            variety: 1, // 游戏种类
            timeArrIndex: '', // 时间选择按钮
        }
    };
    onChange(date, dateString) {
        // console.log(date, dateString);
    };
    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.fetch({
            results: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
        });
    };
    fetch = (params = {}) => {
        // console.log('params:', params);
        this.setState({ loading: true });
        fetch('https://randomuser.me/api?results=5',{
            // body: JSON.stringify({
            //             results: 10,
            //             ...params,
            // })
        }) .then(function(response) {
                return response.json()
            }).then((json) => {
            // console.log(json)
            const pagination = { ...this.state.pagination };
            // Read total count from server
            // pagination.total = data.totalCount;
            pagination.total = 200;
            this.setState({
                loading: false,
                data: json.results,
                pagination,
            });
        }).catch((ex) => {
            // console.log('parsing failed', ex)
        })
    };
    componentDidMount() {
        // this.fetch();
        request('https://randomuser.me/api?results=5').then((result) => { console.log(result) })
    };
    // 游戏分类
    classify_index(index) {
        return index === this.state.classify ? "t_l_border t_l_active" : "t_l_border"
    };
    // 游戏种类
    variety_index(index) {
        return index === this.state.variety ? "t_l_border t_l_active" : "t_l_border"
    };

    expandedRowRender() {
        const columns = [
            { title: 'Date', dataIndex: 'date', key: 'date' },
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Status', key: 'state', render: () => <span><Badge status="success" />Finished</span> },
            { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
            {
                title: 'Action',
                dataIndex: 'operation',
                key: 'operation',
                render: () => (
                    <span className="table-operation">
                        <a href="#">Pause</a>
                        <a href="#">Stop</a>
                    </span>
                ),
            },
        ];

            const data = [];
            for (let i = 0; i < 3; ++i) {
                data.push({
                    key: i,
                    date: '2014-12-24 23:12:00',
                    name: 'This is production name',
                    upgradeNum: 'Upgraded: 56',
                });
            }
            return (
                <div className="t_l_child_table">
                    <Table
                        columns={columns}
                        showHeader={false}
                        dataSource={data}
                        pagination={false}
                    />
                </div>
            );
        };


    render() {
        const timeArr = ['上周','上半月','下半月','本月'];

        const columns = [
            {
            title: '日期',
            dataIndex: 'name2121',// 列数据在数据项中对应的 key，支持 a.b.c 的嵌套写法
            render: text => <a href="#">{text}</a>,
            filterDropdown: (
                <div className="t_l_prompt">
                    <div>
                        8979845646<br/>
                        faweawf
                    </div>
                </div>
            ),// 可以自定义筛选菜单，此函数只负责渲染图层，需要自行编写各种交互
            filterIcon: <img style={{verticalAlign: 'sub', marginLeft: '4px'}} src={t_m_icon} alt="提示" title={'提示'}/>, // 自定义 fiter 图标。
            // width: '20%',
            }, {
                title: '用户名',
                dataIndex: 'name323',
                filterDropdown: (
                    <div className="t_l_prompt">
                        <div>
                            8979845646<br/>
                            faweawf
                        </div>
                    </div>
                ),// 可以自定义筛选菜单，此函数只负责渲染图层，需要自行编写各种交互
                filterIcon: <img className="" style={{verticalAlign: 'sub', marginLeft: '4px'}} src={t_m_icon} alt="提示" title="提示"/>, // 自定义 fiter 图标。
            }, {
                title: '投注',
                dataIndex: 'email',
                render: text => <a href="http://www.baidu.com/">{text}</a>,
            }, {
                title: '中奖',
                dataIndex: 'gender',
                render: name => `${name.first} ${name.last}`,// 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引，@return里面可以设置表格行/列合并 Function(text, record, index) {}
            }, {
                title: '返点',
                dataIndex: 'name',
            }, {
                title: '毛收入',
                dataIndex: 'email4',
            }, {
                title: '日工资',
                dataIndex: 'email5',
            }, {
                title: '日亏损',
                dataIndex: 'email6',
            }, {
                title: '活动',
                dataIndex: 'email7',
            }, {
                title: '净收入',
                dataIndex: 'email8',
            }, {
                title: '分红',
                dataIndex: 'email9',
            }, {
                title: '总盈亏',
                dataIndex: 'email10',
            }];

        return (
            <div className="team_list">
                <div className="team_list_top">
                    <div className="t_l_time">
                        <ul className="t_l_time_row">
                            <li className="t_m_date_classify">查询日期：</li>
                            <li style={{marginLeft: '8px'}}><DatePicker onChange={(date, dateString)=>{this.onChange(date, dateString)}} /></li>
                            <li style={{margin: '0 8px'}}>至</li>
                            <li><DatePicker onChange={(date, dateString)=>{this.onChange(date, dateString)}} /></li>
                            <li className="t_m_line"></li>
                            <li>
                                <ul className="t_l_time_btn clear">
                                    {
                                        timeArr.map((value,index)=>{
                                            return (
                                                <li className={this.state.timeArrIndex === index ? 't_l_time_btn_active' : ''} onClick={()=>{this.setState({timeArrIndex: index})}} key={index}>{value}</li>
                                            )
                                        })
                                    }
                                </ul>
                            </li>
                        </ul>
                        <ul className="t_l_classify">
                            <li>
                                <span className="t_m_date_classify">游戏分类：</span>
                                <span className={this.classify_index(1)} onClick={()=>{this.setState({classify: 1})}}>彩票</span>
                                <span className={this.classify_index(2)} onClick={()=>{this.setState({classify: 2})}}>其他</span>
                            </li>
                            <li>
                                <span>游戏种类：</span>
                                <span className={this.variety_index(1)} onClick={()=>{this.setState({variety: 1})}}>全彩种</span>
                            </li>
                            <li>
                                <span>用户名：</span>
                                <Input placeholder="请输入用户名" />
                            </li>
                            <li className="t_m_serch">
                                <img src={t_m_serch} alt="搜索"/>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="t_l_table">
                    <div className="t_l_location_name">
                        <span>当前位置：</span>
                        <span>sfhwofha</span>
                        <span> > </span>
                        <span>happy (每日数据)</span>
                    </div>
                    <div className="t_l_table_list">
                        <Table columns={columns}
                               rowKey={record => record.registered}
                               dataSource={this.state.data}
                               pagination={this.state.pagination}
                               loading={this.state.loading}
                               expandedRowRender={this.expandedRowRender}
                               footer={() => 'Footer'}
                               onChange={this.handleTableChange}
                               scroll={{y: 300}}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
