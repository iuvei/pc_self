/*博饼投注*/
import React, {PureComponent} from 'react';
import {observer} from 'mobx-react';
import { DatePicker, Modal, Checkbox, Table, Input, Pagination, Button, Popover } from 'antd';
import moment from 'moment';
import Fetch from '../../../Utils';
import common from '../../../CommonJs/common';
import { stateVar } from '../../../State';

@observer
export default class BobingRecord extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            totalInfo: {}, // 总计
            loading: false, // 表格loading
            postData: {
                username:'', //查询用户名
                star_date: common.setDateTime(0) + ' 00:00:00',
                end_date: common.setDateTime(0) + ' 23:59:59',
                ischild: 0, //  1(团对) 0(个人)
                pn: 10, // 每页条数
                p: 1,
                offects: null, //以下数字，英文为数字代表的字段1 totalprice, 2 total_bet, 3 total_point, 4 bonus, 5 prizepool, 6 total_account
                sortdesc: null, // 0 降序 1升序
            },
            searchLoading: false,
            total: 0, // 总条数
        }
    };
    componentDidMount() {
        this._ismount = true;
        this.getData()
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    // shouldComponentUpdate(nextProps, nextState){
        // return nextState.data == this.state.data
    // }
    /*获取博饼投注*/
    getData() {
        Fetch.bbbetting({
            method: 'POST',
            body: JSON.stringify(this.state.postData)
        }).then((res)=>{
            if(this._ismount){
                this.setState({searchLoading: false});
                if(res.status == 200) {
                    let repsone = res.repsoneContent;
                    this.setState({
                        data: repsone.aProject,
                        totalInfo: repsone.all_info,
                        total: parseInt(repsone.affects),
                    })
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*搜索*/
    onSearch() {
        this.setState({searchLoading: true});
        this.getData()
    };
    /*开始时间*/
    onChangeStartTime(date, dateString) {
        let postData = this.state.postData;
        postData.star_date = dateString;
        this.setState({postData: postData});
    };
    /*结束时间*/
    onChangeEndTime(date, dateString) {
        let postData = this.state.postData;
        postData.end_date = dateString;
        this.setState({postData: postData});
    };
    handleTableChange = (pagination, filters, sorter) => {
        if(sorter.columnKey != undefined) {
            let postData = this.state.postData;
            if(sorter.order == 'descend') {//降序
                postData.sortdesc = 0 //0 降序 1升序
            } else if(sorter.order == 'ascend') {
                postData.sortdesc = 1
            }
            postData.offects = sorter.columnKey;
            this.setState({
                postData: postData,
            }, ()=>this.getData());
        }
    };

    // 包含下级
    selectSubordinate(e) {
        let postData = this.state.postData;
        if(e.target.checked){
            postData.ischild = 1
        }else {
            postData.ischild = 0
        }
        this.setState({postData: postData})
    };
    /*每页某条*/
    onShowSizeChange(current, pageSize) {
        let postData = this.state.postData;
        postData.pn = pageSize;
        postData.p = 1;
        this.setState({postData: postData},()=>this.getData())
    };
    /*某页*/
    onChangePage(page){
        let postData = this.state.postData;
        postData.p = page;
        this.setState({postData: postData},()=>this.getData())
    };
    /*输入用户名*/
    onUserName(e) {
        let postData = this.state.postData;
        postData.username = e.target.value;
        this.setState({postData: postData});
    };
    onColor() {
        return parseFloat(this.state.totalInfo.sum_prizepool) < 0 ? 'col_color_shu' : 'col_color_ying';
    };

    render() {
        let columns = [
            {
                title: '用户名',
                dataIndex: 'username',
                width: 110,
            }, {
                title: '游戏时间',
                dataIndex: 'writetime',
                width: 140,
            }, {
                title: '投注内容',
                dataIndex: 'code',
                render: (text, record) => (
                    <Popover content={
                        <ul>
                            <li>
                                <span>游戏单号：</span>
                                <span>{record.packageid}</span>
                            </li>
                            <li>
                                <span>博饼点数：</span>
                                <span>{record.code}</span>
                            </li>
                            <li>
                                <span>奖级：</span>
                                <span>{record.award_method}</span>
                            </li>
                            <li>
                                <span>模式：</span>
                                <span>{record.modes}</span>
                            </li>
                            <li>
                                <span>游戏局数：</span>
                                <span>{record.inning}</span>
                            </li>
                        </ul>
                    }>
                        <a href="javascript:void(0)" style={{color: '#0088DE'}}>详细内容</a>
                    </Popover>
                ),
                width: 100,
            },{
                title: '博饼投注金额',
                dataIndex: 'totalprice',
                className: 'column-right',
                sorter: (a, b) => {},
                width: 120,
            }, {
                title: '加倍总投注额',
                dataIndex: 'total_bet',
                className: 'column-right',
                // sorter: (a, b) => a.age - b.age,
                width: 120,
            }, {
                title: '返点总额',
                dataIndex: 'total_point',
                className: 'column-right',
                // sorter: (a, b) => a.age - b.age,
                width: 90,
            }, {
                title: '中奖金额',
                dataIndex: 'bonus',
                className: 'column-right',
                sorter: (a, b) => {},
                width: 110,
            }, {
                title: '奖池金额',
                dataIndex: 'prizepool',
                className: 'column-right',
                sorter: (a, b) => {},
                width: 110,
            }, {
                title: '盈亏',
                dataIndex: 'total_account',
                className: 'column-right',
                render: text => (
                    text < 0 ? <span className="col_color_shu">{text}</span> :
                            <span className="col_color_ying">{text}</span>

                ),
                // sorter: (a, b) => a.age - b.age,
                width: 100,
            }, {
                title: '加倍详情',
                dataIndex: 'isfivezero',
                render: text => (
                    text == 0 ? '-' : <a href="#">查看</a>
                ),
                width: 100,
            }];
        const totalInfo = this.state.totalInfo;
        const total = this.state.total;
        const footer = <ul className="tabel_footer clear" style={{display: total <= 0 ? 'none' : ''}}>
                            <li>总计</li>
                            <li>{totalInfo.sum_totalprice}</li>
                            <li>{totalInfo.sum_total_bet}</li>
                            <li>{totalInfo.sum_total_point}</li>
                            <li>{totalInfo.sum_bonus}</li>
                            <li>{totalInfo.sum_prizepool}</li>
                            <li className={this.onColor()}>{totalInfo.sum_total_account}</li>
                            <li>&nbsp;</li>
                        </ul>;
        return (
            <div className="lottery_bet">
                <div className="team_list_top">
                    <div className="t_l_time">
                        <ul className="t_l_time_row">
                            <li className="t_m_date_classify">投注时间：</li>
                            <li>
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="请选择开始时间"
                                    defaultValue={moment(common.setDateTime(0) + ' 00:00:00')}
                                    onChange={(date, dateString)=>{this.onChangeStartTime(date, dateString)}}
                                    disabledDate={(current)=>common.disabledDate(current, -16, 0)}
                                />
                            </li>
                            <li style={{margin: '0 8px'}}>至</li>
                            <li>
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="请选择结束时间"
                                    defaultValue={moment(common.setDateTime(0) + ' 23:59:59')}
                                    onChange={(date, dateString)=>{this.onChangeEndTime(date, dateString)}}
                                    onOk={(date)=>{this.onOk(date)}}
                                    disabledDate={(current)=>common.disabledDate(current, -16, 0)}
                                />
                            </li>
                            <li style={{margin: '0 10px'}}>
                                <span>用户名：</span>
                                <Input placeholder="请输入用户名" style={{width: '150px'}} value={this.state.postData.username} onChange={(e)=>this.onUserName(e)}/>
                            </li>
                            <li>
                                <Checkbox onChange={(e)=>{this.selectSubordinate(e)}}>包含下级</Checkbox>
                            </li>
                            <li>
                                <Button type="primary" icon="search" loading={this.state.searchLoading} onClick={()=>this.onSearch()}>
                                    搜索
                                </Button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="t_l_table">
                    <div className="t_l_table_list">
                        <Table columns={columns}
                               rowKey={record => record.packageid}
                               dataSource={this.state.data}
                               pagination={false}
                               loading={this.state.loading}
                               footer={total <= 0 ? null : ()=>footer}
                               onChange={this.handleTableChange}
                        />
                    </div>
                    <div className="t_l_page" style={{display: total <= 0 ? 'none' : ''}}>
                        <Pagination showSizeChanger
                                    onShowSizeChange={(current, pageSize)=>{this.onShowSizeChange(current, pageSize)}}
                                    onChange={(pageNumber)=>this.onChangePage(pageNumber)}
                                    defaultCurrent={1}
                                    total={total}
                                    pageSizeOptions={stateVar.pageSizeOptions.slice()}
                        />
                    </div>
                </div>
            </div>

        );
    }
}

