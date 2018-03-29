/*体育投注*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {DatePicker, Radio, Table, Select, Pagination, Button, Icon, Modal, Input, Checkbox} from 'antd';
const Option = Select.Option;
const RadioGroup = Radio.Group;
import moment from 'moment';
import Fetch from '../../../Utils';
import {setDateTime, disabledDate, datedifference} from '../../../CommonJs/common';
import {stateVar} from '../../../State';

import './Sports.scss';

@observer
export default class Sports extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],// 真人投注列表
            loading: false,
            searchLoading: false, // 搜索按钮loading
            iscancancelLoading: false, // 撤单按钮loading
            showLottery: false, // 隐藏彩种
            value: null,
            total: 0,//总条数

            postData: {
                starttime: setDateTime(0) + ' 02:00:00',
                endtime: setDateTime(1) + ' 01:59:59',
                p: 1, //页码
                pn: 10,
                status: '0', //WON  LOSE  running  Reject Refund  DRAW  Void  waiting
                ptype: "noteam", //team (团对)
                code: null, //游戏名称
                search: 1,

                offects: null,
                sortdesc: null,
            },
            lotteryList: [], //游戏种类
            sum: {},
        }
    };

    componentDidMount() {
        this._ismount = true;
        this.getData()
    };

    componentWillUnmount() {
        this._ismount = false;
    };

    /*获取体育投注*/
    getData() {
        Fetch.sportsRecordSearch({
            method: 'POST',
            body: JSON.stringify(this.state.postData)
        }).then((res) => {
            if (this._ismount) {
                this.setState({searchLoading: false});
                if (res.status == 200) {
                    let data = res.repsoneContent;
                    this.setState({
                        data: data.list,
                        lotteryList: data.nameList,
                        sum: data.all_sum.result,
                        total: parseInt(data.offects),
                    })
                } else {
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };

    /*开始时间*/
    onChangeStartTime(date, dateString) {
        let postData = this.state.postData;
        postData.starttime = dateString;
        this.setState({postData: postData});
    };

    /*结束时间*/
    onChangeEndTime(date, dateString) {
        let postData = this.state.postData;
        postData.endtime = dateString;
        this.setState({postData: postData});
    };

    handleTableChange = (pagination, filters, sorter) => {
        let postData = this.state.postData;
        if (sorter.columnKey == undefined) {
            postData.sortdesc = null;
            postData.offects = null;
        } else {
            postData.sortdesc = sorter.order == 'descend' ? 0 : 1;
            postData.offects = sorter.columnKey;
        }
        this.setState({postData: postData}, () => this.getData());
    };
    /*选择状态*/
    handleStatus(val) {
        let postData = this.state.postData;
        postData.status = val;
        this.setState({postData: postData});
    };

    /*搜索*/
    onSearch() {
        this.setState({searchLoading: true});
        this.getData();
    };

    // 游戏名称
    onChangeRadio(e) {
        let index = e.target.value,
            lotteryList = this.state.lotteryList,
            postData = this.state.postData;
        postData.code = lotteryList[index] == undefined ? null : lotteryList[index].code;

        this.setState({
            value: index,
            postData: postData,
            showLottery: false
        });
    };

    /*每页条数*/
    onShowSizeChange(current, pageSize) {
        let postData = this.state.postData;
        postData.p = current;
        postData.pn = pageSize;
        this.setState({postData: postData}, () => this.getData());
    };

    /*切换页面时*/
    onChangePagination(page) {
        let postData = this.state.postData;
        postData.p = page;
        this.setState({postData: postData}, () => this.getData());
    };

    /*选择彩种名称*/
    onSelectBetName() {
        this.setState({showLottery: !this.state.showLottery})
    };

    /*输入用户名*/
    onUserName(e) {
        let postData = this.state.postData;
        postData.username = e.target.value;
        this.setState({postData: postData});
    };

    /*包含下级复选框*/
    selectSubordinate(e) {
        let postData = this.state.postData;
        postData.ptype = e.target.checked == true ? 'team' : 'noteam';
        this.setState({postData: postData});
    };

    render() {
        let columns = [
            {
                title: '用户名',
                dataIndex: 'username',
                width: 110,
            }, {
                title: '时间',
                dataIndex: 'transaction_time',
                width: 85,
            }, {
                title: '游戏名称',
                dataIndex: 'name',
                width: 120,
            }, {
                title: '注单号',
                dataIndex: 'trans_id',
                width: 100,
            }, {
                title: '投注金额',
                dataIndex: 'stake',
                className: 'column-right',
                width: 90
            }, {
                title: '有效投注金额',
                dataIndex: 'valid_amount',
                className: 'column-right',
                sorter: (a, b) => {
                },
                width: 115,
            }, {
                title: '奖金',
                dataIndex: 'winlost_amount',
                className: 'column-right',
                sorter: (a, b) => {
                },
                width: 90,
            }, {
                title: '盈亏',
                dataIndex: 'win_lost_money',
                className: 'column-right',
                width: 100,
                render: (text) => (
                    text < 0 ? <span className="col_color_shu">{text}</span> :
                        <span className="col_color_ying">{text}</span>
                ),
                sorter: (a, b) => {
                },
            }, {
                title: '金额',
                dataIndex: 'after_amount',
                className: 'column-right',
                sorter: (a, b) => {
                },
                width: 100,
            }, {
                title: '状态',
                dataIndex: 'ticket_status',
                width: 90,
            }];
        const {postData, sum, total, lotteryList} = this.state;
        const footer = <div className="l_b_tabel_footer" style={{display: total < 1 ? 'none' : ''}}>
            <span>总计</span>
            <span>
                有效投注金额：
                <strong>{sum.all_stake}元</strong>
            </span>
            <span>
                奖金：
                <strong>{sum.all_valid_amount}元</strong>
            </span>
            <span>
                盈亏：
                <strong>{sum.all_winlost_amount}元</strong>
            </span>
            <span>
                金额：
                <strong>{sum.all_win_lost_money}元</strong>
            </span>
        </div>;


        return (
            <div className="lottery_bet sports">
                <div className="team_list_top">
                    <div className="t_l_time">
                        <ul className="t_l_time_row">
                            <li>
                                <span>投注时间：</span>
                                <DatePicker
                                    showTime
                                    allowClear={false}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="请选择开始时间"
                                    defaultValue={moment(setDateTime(0) + ' 02:00:00')}
                                    onChange={(date, dateString) => {
                                        this.onChangeStartTime(date, dateString)
                                    }}
                                    disabledDate={(current) => disabledDate(current, -16, 1)}
                                />
                                <span style={{margin: '0 8px'}}>至</span>
                                <DatePicker
                                    showTime
                                    allowClear={false}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="请选择结束时间"
                                    defaultValue={moment(setDateTime(1) + ' 01:59:59')}
                                    onChange={(date, dateString) => {
                                        this.onChangeEndTime(date, dateString)
                                    }}
                                    disabledDate={(current) => disabledDate(current, -datedifference(postData.starttime, setDateTime(0)), 1)}
                                />
                            </li>
                        </ul>
                        <ul className="t_l_classify">
                            <li>
                                <span>游戏名称：</span>
                                <Button onClick={() => this.onSelectBetName()}>
                                    {
                                        lotteryList[this.state.value] == undefined ? '所有游戏' :
                                            lotteryList[this.state.value].name
                                    }
                                    <Icon type="menu-unfold"/>
                                </Button>
                            </li>
                            <li>
                                <span>状态：</span>
                                <Select defaultValue="0" style={{width: 120}} onChange={(value) => {
                                    this.handleStatus(value)
                                }}>
                                    <Option value="0">所有</Option>
                                    <Option value="WON">WON</Option>
                                    <Option value="LOSE">LOSE</Option>
                                    <Option value="running">running</Option>
                                    <Option value="Reject Refund">Reject Refund</Option>
                                    <Option value="DRAW">DRAW</Option>
                                    <Option value="Void">Void</Option>
                                    <Option value="waiting">waiting</Option>
                                </Select>
                            </li>
                            <li>
                                <span>用户名：</span>
                                <Input placeholder="请输入用户名" value={this.state.postData.username}
                                       onChange={(e) => this.onUserName(e)}/>
                            </li>
                            <li>
                                <Checkbox onChange={(e) => {
                                    this.selectSubordinate(e)
                                }}>包含下级</Checkbox>
                            </li>
                            <li>
                                <Button type="primary" icon="search" loading={this.state.searchLoading}
                                        onClick={() => this.onSearch()}>
                                    搜索
                                </Button>
                            </li>
                        </ul>
                    </div>
                    <div
                        className={this.state.showLottery ? 't_m_select_lottery clear t_m_select_lottery_show' : 't_m_select_lottery clear'}>
                        <RadioGroup onChange={(e) => {
                            this.onChangeRadio(e)
                        }} value={this.state.value}>
                            <Radio value={null}>所有游戏</Radio>
                            {
                                lotteryList.map((item, index) => {
                                    return (
                                        <Radio value={index} key={item.id}>{item.name}</Radio>
                                    )
                                })
                            }
                        </RadioGroup>
                    </div>
                </div>
                <div className="t_l_table">
                    <div className="t_l_table_list">
                        <Table columns={columns}
                               rowKey={record => record.deal_id}
                               dataSource={this.state.data}
                               pagination={false}
                               loading={this.state.loading}
                               footer={total <= 0 ? null : () => footer}
                               onChange={this.handleTableChange}
                        />
                    </div>
                    <div className="t_l_page" style={{display: total < 1 ? 'none' : ''}}>
                        <Pagination showSizeChanger
                                    onShowSizeChange={(current, pageSize) => {
                                        this.onShowSizeChange(current, pageSize)
                                    }}
                                    onChange={(page) => this.onChangePagination(page)}
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

