import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { DatePicker,  Button, Checkbox, Input, Select, Table, Pagination } from 'antd';
const Option = Select.Option;

import './CommonSelect.scss'
@observer
export default class CommonSelect extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            pagination: {},
            loading: false,
            classify: 1, // 游戏分类
            variety: 1, // 游戏种类
            timeArrIndex: '', // 时间选择按钮
            searchLoading: false,
        }
    };
    onChange(date, dateString) {
        console.log(date, dateString);
    };

    componentDidMount() {

    };

    handleChange(value) {
        console.log(`selected ${value}`);
    };
    enterLoading() {
        this.setState({ searchLoading: true });
    };

    onCheckbox(e) {
        console.log(`checked = ${e.target.checked}`);
    }
    render() {
        return (
            <div className="game_bill mention_filling_record">
                <div className="team_list_top">
                    <div className="t_l_time">
                        <ul className="t_l_time_row">
                            <li className="t_m_date_classify">查询日期：</li>
                            <li>
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="请选择开始时间"
                                    onChange={(date, dateString)=>{this.onChange(date, dateString)}}
                                    onOk={this.onOk}
                                />
                            </li>
                            <li style={{margin: '0 8px'}}>至</li>
                            <li>
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="请选择结束时间"
                                    onChange={(date, dateString)=>{this.onChange(date, dateString)}}
                                    onOk={this.onOk}
                                />
                            </li>
                        </ul>
                        <ul className="t_l_classify">
                            <li>
                                <span className="t_m_date_classify">类型：</span>
                                <Select defaultValue="lucy" style={{ width: 100 }} onChange={()=>this.handleChange()}>
                                    <Option value="jack">Jack</Option>
                                    <Option value="lucy">Lucy</Option>
                                    <Option value="disabled" disabled>Disabled</Option>
                                    <Option value="Yiminghe">yiminghe</Option>
                                </Select>
                            </li>
                            <li>
                                <span>状态：</span>
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
                            <li>
                                <Checkbox onChange={(e)=>this.onCheckbox(e)}>包含下级</Checkbox>
                            </li>
                            <li className="t_m_serch">
                                <Button type="primary" icon="search" loading={this.state.searchLoading} onClick={()=>this.enterLoading()}>
                                    搜索
                                </Button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="t_l_table">
                    <div className="t_l_table_list">
                        <Table columns={this.props.columns}
                               dataSource={this.props.data}
                               pagination={false}
                               footer={()=>{
                                   return (
                                       <div className="mention_filling_record_footer clear">
                                           <span>
                                               {this.props.footer[0]}：
                                               <strong style={{color: '#E90000'}}>0</strong>
                                           </span>
                                           <span>
                                               {this.props.footer[1]}：
                                               <strong style={{color: '#00CD05'}}>0</strong>
                                           </span>
                                       </div>
                                   )
                               }}
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
