import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { DatePicker, Radio, Button, Icon, Input, Select, Table, Pagination } from 'antd';
const Option = Select.Option;
const RadioGroup = Radio.Group;

import './SelfTable.scss'

@observer
export default class SelfTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            pagination: {},
            loading: false,
            classify: 1, // 游戏分类
            variety: 1, // 游戏种类
            timeArrIndex: '', // 时间选择按钮
            showLottery: false, // 隐藏彩种
            value: 1,
            searchLoading: false,
        }
    };
    onChange(date, dateString) {
        console.log(date, dateString);
    };
    onSelectLottery(e) {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
        this.setState({showLottery: false})
    };
    componentDidMount() {

    };

    handleChange(value) {
        console.log(`selected ${value}`);
    };
    enterLoading() {
        this.setState({ searchLoading: true });
    };
    showLottery() {
        this.setState({showLottery: !this.state.showLottery});
    };
    // 游戏分类
    classify_index(index) {
        return index === this.state.classify ? "t_l_border t_l_active" : "t_l_border"
    };
    // 游戏种类
    variety_index(index) {
        return index === this.state.variety ? "t_l_border t_l_active" : "t_l_border"
    };
    render() {
        const timeArr = ['上周','上半月','下半月','本月'];
        const columns = [
            {
                title: '日期',
                dataIndex: 'name',
            }, {
                title: '用户名',
                dataIndex: 'age',
            }, {
                title: '投注',
                dataIndex: 'address',
            }, {
                title: '中奖',
                key: 'action',
            }, {
                title: '返点',
                key: 'action1',
            }, {
                title: '毛收入',
                key: 'action2',
            }, {
                title: '日工资',
                key: 'action3',
            }, {
                title: '日亏损',
                key: 'action4',
            }, {
                title: '活动',
                key: 'action5',
            }, {
                title: '净收入',
                key: 'action6',
            }, {
                title: '分红',
                key: 'action7',
            }, {
                title: '总盈亏',
                key: 'action8',
            }
        ];
        const data = [{
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York',
        }, {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London',
        }, {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney',
        }];
        return (
            <div className="self_table">
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
                                <Button type="primary"
                                        icon="search"
                                        loading={this.state.searchLoading}
                                        onClick={()=>this.enterLoading()}
                                >
                                    搜索
                                </Button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="t_l_table">
                    <div className="t_l_table_list">
                        <Table columns={columns}
                               dataSource={data}
                               pagination={false}
                               footer={() => 'Footer'}

                        />
                    </div>
                    <div className="t_l_table_list" style={{marginTop: 10}}>
                        <Table columns={columns}
                               dataSource={data}
                               pagination={false}
                               footer={() => 'Footer'}
                        />
                    </div>
                    <div className="t_l_page">
                        <Pagination showSizeChanger onShowSizeChange={(current, pageSize)=>{this.onShowSizeChange(current, pageSize)}} defaultCurrent={1} total={500} />
                    </div>
                </div>
            </div>
        );
    }
}
