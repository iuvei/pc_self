import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { DatePicker, Radio, Button, Icon, Input, Select, Table, Pagination } from 'antd';
const Option = Select.Option;
const RadioGroup = Radio.Group;
import './GameBill.scss'

@observer
export default class GameBill extends Component {
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
        this._ismount = true;
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
    render() {
        const timeArr = ['上周','上半月','下半月','本月'];
        const arr = ['重庆时时彩1', '新疆时时彩2', '重庆时时彩3', '重庆时时彩4', '重庆时时彩', '重庆时时彩', '重庆时时彩', '重庆时时彩', '重庆时时彩', '重庆时时彩', '重庆时时彩'];
        const columns = [
            {
                title: '用户名',
                dataIndex: 'name',
            }, {
                title: '时间',
                dataIndex: 'age',
            }, {
                title: '彩种与玩法',
                dataIndex: 'address',
            }, {
                title: '期号',
                key: 'action',
            }, {
                title: '投注模式',
                key: 'action1',
            }, {
                title: '帐变类型',
                key: 'action2',
            }, {
                title: '变动金额',
                key: 'action3',
            }, {
                title: '余额',
                key: 'action4',
            }
        ];
        const data = [{
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
        }, {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
        }, {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
        }];
        return (
            <div className="game_bill">
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
                                <span className="t_m_date_classify">彩种分类：</span>
                                <Button onClick={()=>this.showLottery()}>
                                    {arr[this.state.value]}
                                    <Icon type="menu-unfold" />
                                </Button>
                            </li>
                            <li>
                                <span>投注模式：</span>
                                <Select defaultValue="lucy" style={{ width: 100 }} onChange={()=>this.handleChange()}>
                                    <Option value="jack">Jack</Option>
                                    <Option value="lucy">Lucy</Option>
                                    <Option value="disabled" disabled>Disabled</Option>
                                    <Option value="Yiminghe">yiminghe</Option>
                                </Select>
                            </li>
                            <li>
                                <span>帐变类型：</span>
                                <Select defaultValue="lucy" style={{ width: 100 }} onChange={()=>this.handleChange()}>
                                    <Option value="jack">Jack</Option>
                                    <Option value="lucy">Lucy</Option>
                                    <Option value="disabled" disabled>Disabled</Option>
                                    <Option value="Yiminghe">yiminghe</Option>
                                </Select>
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
                    <div className={this.state.showLottery ? 't_m_select_lottery clear t_m_select_lottery_show' : 't_m_select_lottery clear'}>
                    <RadioGroup onChange={(e)=>{this.onSelectLottery(e)}} value={this.state.value}>
                        {
                            arr.map((value,index)=>{
                                return (
                                    <Radio value={index} key={index}>{value}</Radio>
                                )
                            })
                        }
                    </RadioGroup>
                    </div>
                </div>
                <div className="t_l_table">
                    <div className="t_l_table_list">
                        <Table columns={columns} dataSource={data} pagination={false}/>
                    </div>
                    <div className="t_l_page">
                        <Pagination showSizeChanger onShowSizeChange={(current, pageSize)=>{this.onShowSizeChange(current, pageSize)}} defaultCurrent={1} total={500} />
                    </div>
                </div>
            </div>
        );
    }
}
