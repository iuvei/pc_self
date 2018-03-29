/*博饼投注*/
import React, {PureComponent} from 'react';
import {observer} from 'mobx-react';
import { DatePicker, Modal, Checkbox, Table, Input, Pagination, Button, Popover } from 'antd';
import moment from 'moment';
import Fetch from '../../../Utils';
import {setDateTime, datedifference, disabledDate} from '../../../CommonJs/common';
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
                star_date: setDateTime(0) + ' 00:00:00',
                end_date: setDateTime(0) + ' 23:59:59',
                ischild: 0, //  1(团对) 0(个人)
                pn: 10, // 每页条数
                p: 1,
                offects: null, //以下数字，英文为数字代表的字段1 totalprice, 2 total_bet, 3 total_point, 4 bonus, 5 prizepool, 6 total_account
                sortdesc: null, // 0 降序 1升序
            },
            searchLoading: false,
            total: 0, // 总条数
            doubleVisible: false, // 加倍详情modal
            doubleData: {
                data: [],
                capital: 0, //初始本金
                finning: 0, //游戏局数
                total_double:{}, //总计
            },
            doubleName: '',
            doubleLoading: false,
        }
    };
    componentDidMount() {
        this._ismount = true;
        this.getData()
    };
    componentWillUnmount() {
        this._ismount = false;
    };
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
    /*加倍详情*/
    onDoubledetails(record){
        this.setState({doubleVisible: true, doubleLoading: true});
        let { postData } = this.state;
        Fetch.doubledetails({
            method: 'POST',
            body: JSON.stringify({
                starttime: postData.star_date,
                endtime: postData.end_date,
                packageid: record.packageid,
                userid: record.userid,
                username: record.username,
            })
        }).then((res)=>{
            if(this._ismount){
                this.setState({doubleLoading: false});
                if(res.status == 200){
                    let data = res.repsoneContent,
                        { doubleData } = this.state;
                    doubleData.data = data.aDoubleDetails;
                    doubleData.capital = data.capital;
                    doubleData.finning = data.finning;
                    doubleData.total_double = data.total_double;
                    this.setState({doubleData, doubleName: record.username})
                }
            }
        })
    }

    render() {
        let columns = [
            {
                title: '用户名',
                dataIndex: 'username',
                width: 110,
            }, {
                title: '游戏时间',
                dataIndex: 'writetime',
                width: 90,
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
                width: 90,
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
                width: 110,
            }, {
                title: '返点总额',
                dataIndex: 'total_point',
                className: 'column-right',
                width: 80,
            }, {
                title: '中奖金额',
                dataIndex: 'bonus',
                className: 'column-right',
                sorter: (a, b) => {},
                width: 100,
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
                width: 100,
            }, {
                title: '加倍详情',
                dataIndex: 'isfivezero',
                render: (text, record) => (
                    text == 0 ? '-' : <a href="javascript:void(0)" onClick={()=>this.onDoubledetails(record)}>查看</a>
                ),
                width: 80,
            }];
        let columnsDouble = [
            {
                title: '游戏时间',
                dataIndex: 'writetime',
                width: 90,
            },
            {
                title: '局数',
                dataIndex: 'wininning',
                render: (text)=> '第'+text+'局',
                width: 80,
            },
            {
                title: '次数',
                dataIndex: 'ci',
                width: 50,
            },
            {
                title: '倍数',
                dataIndex: 'multiple',
                width: 50,
            },
            {
                title: '投注内容',
                dataIndex: 'userbet',
                width: 80,
            },
            {
                title: '投注本金',
                dataIndex: 'bet',
                className:'column-right',
                render: (text)=> -text,
                width: 80,
            },
            {
                title: '加倍补注',
                dataIndex: 'addrecharge',
                className:'column-right',
                width: 80,
            },
            {
                title: '失败补注',
                dataIndex: 'failrecharge',
                className:'column-right',
                width: 80,
            },
            {
                title: '返点金额',
                dataIndex: 'userpoint',
                className:'column-right',
                width: 80,
            },
            {
                title: '开奖结果',
                dataIndex: 'game_result',
                width: 100,
            },
            {
                title: '中奖金额',
                dataIndex: 'bonus',
                className:'column-right',
                width: 90,
            },
            {
                title: '奖池奖金',
                dataIndex: 'prizepool',
                className:'column-right',
                width: 90,
            },
            {
                title: '盈亏',
                dataIndex: 'singleprice',
                className:'column-right',
                render: (text)=>parseFloat(text) < 0 ?
                    <span className="col_color_shu">{text}</span> :
                    <span className="col_color_ying">{text}</span>,
                width: 80,
            }
        ];
        const { totalInfo, doubleData, total, doubleName, postData } = this.state;
        const total_double = doubleData.total_double;
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
                            <li>
                                <span>投注时间：</span>
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    allowClear={false}
                                    placeholder="请选择开始时间"
                                    defaultValue={moment(setDateTime(0) + ' 00:00:00')}
                                    onChange={(date, dateString)=>{this.onChangeStartTime(date, dateString)}}
                                    disabledDate={(current)=>disabledDate(current, -16, 1)}
                                />
                                <span style={{margin: '0 8px'}}>至</span>
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    allowClear={false}
                                    placeholder="请选择结束时间"
                                    defaultValue={moment(setDateTime(0) + ' 23:59:59')}
                                    onChange={(date, dateString)=>{this.onChangeEndTime(date, dateString)}}
                                    onOk={(date)=>{this.onOk(date)}}
                                    disabledDate={(current) => disabledDate(current, -datedifference(postData.star_date, setDateTime(0)), 1)}
                                />
                            </li>
                            <li>
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

                <Modal
                    title="加倍详情"
                    visible={this.state.doubleVisible}
                    width={1100}
                    bodyStyle={{height: 500}}
                    footer={null}
                    maskClosable={false}
                    onCancel={()=>this.setState({doubleVisible: false})}
                    className="double_table_modal"
                >
                    <div className="modal_username">
                        <span>查询用户：{doubleName}</span>
                        <span>初始本金：{doubleData.capital}元</span>
                        <span>游戏局数：{doubleData.finning}</span>
                    </div>
                    <div className="modal_table">
                        <Table columns={columnsDouble}
                               rowKey={record => record.projectid}
                               dataSource={doubleData.data}
                               pagination={false}
                               loading={this.state.doubleLoading}
                               scroll={{y: 345}}
                        />
                        <ul className="historyTfoot_list clear">
                            <li>合计</li>
                            <li>-{total_double.sum_bet}</li>
                            <li>{total_double.sum_addrecharge}</li>
                            <li>{total_double.sum_failrecharge}</li>
                            <li>{total_double.sum_point}</li>
                            <li>-</li>
                            <li>{total_double.sum_bonus}</li>
                            <li>{total_double.sum_prizepool}</li>
                            <li className={total_double.sum_total_account < 0 ? 'col_color_ying' : 'col_color_ying'}>{total_double.sum_total_account}</li>
                        </ul>
                    </div>
                </Modal>
            </div>

        );
    }
}

