/*追号记录*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {hashHistory} from 'react-router';
import {DatePicker, Radio, Table, Select, Pagination, Button, Icon, Popover, Modal} from 'antd';
import {stateVar} from '../../../State';
import moment from 'moment';
import Fetch from '../../../Utils';
import {setDateTime, disabledDate, datedifference} from '../../../CommonJs/common';

import './AfterRecord.scss';

const shortcutTime = [
    {
        text: '近三天',
        id: 3
    }, {
        text: '近七天',
        id: 7
    }
];
@observer
export default class AfterRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],// 追号列表
            loading: false,
            searchLoading: false, // 搜索按钮loading
            iscancancelLoading: false, // 撤单按钮loading
            showLottery: false, // 隐藏彩种
            value: null,
            total: 0,//总条数

            postData: {
                lotteryid: null, //彩种id，0为全部
                methodid: '-1', //玩法id 0为全部
                threeSeven: 0, //3 近三天  7 近七天
                starttime: setDateTime(0) + ' 02:00:00',
                endtime: setDateTime(1) + ' 01:59:59',
                zhstatus: '-1', //0:进行中;1:已取消;2:已完成;-1:所有
                pn: 10, // 每页显示条数
                p: 1, //页码

                sortdesc: 0,
                offects: null,
            },
            responseData: {
                lotteryList: [], //彩种名称
                newCrowdList: {}, //玩法群
                newMethodCrowdList: {}, //玩法
            },
            sum: {},
            crowdid: '-1',// 玩法群id
        }
    };

    componentDidMount() {
        this._ismount = true;
        this.getData()
    };

    componentWillUnmount() {
        this._ismount = false;
    };

    /*获取追号记录*/
    getData() {
        this.setState({loading: true});
        Fetch.traceInfo({
            method: 'POST',
            body: JSON.stringify(this.state.postData)
        }).then((res) => {
            if (this._ismount) {
                this.setState({searchLoading: false, loading: false});
                if (res.status == 200) {
                    let data = res.repsoneContent;
                    let responseData = {
                        lotteryList: data.lotteryList,
                        newCrowdList: data.newCrowdList,
                        newMethodCrowdList: data.newMethodCrowdList,
                    };
                    this.setState({
                        data: data.list,
                        responseData: responseData,
                        sum: data.all_sum,
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
        postData.zhstatus = val;
        this.setState({postData: postData});
    };

    /*搜索*/
    onSearch() {
        this.setState({searchLoading: true});
        this.getData();
    };

    // 彩种名称
    onChangeRadio(e) {
        let index = e.target.value,
            postData = this.state.postData,
            responseData = this.state.responseData;
        postData.lotteryid = responseData.lotteryList[index] == undefined ? null : responseData.lotteryList[index].lotteryid;

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

    /*选择近三天，近七天*/
    onShortcutTime(val) {
        let postData = this.state.postData;
        if (postData.threeSeven == val) {
            postData.threeSeven = null
        } else {
            postData.threeSeven = val;
        }
        this.setState({postData: postData});
    };

    /*切换页面时*/
    onChangePagination(page) {
        let postData = this.state.postData;
        postData.p = page;
        this.setState({postData: postData}, () => this.getData());
    };

    /*选择彩种名称*/
    onSelectBetName() {
        if (this.state.showLottery == false) {
            let postData = this.state.postData;
            postData.methodid = '-1';
            this.setState({
                crowdid: '-1',
                postData: postData,
            })
        }
        this.setState({showLottery: !this.state.showLottery})
    };

    /*点击状态*/
    onClickStatus(record) {
        stateVar.afterDetails = true;
        hashHistory.push({
            pathname: '/gameRecord/aRdetails',
            query: {
                taskid: record.taskid
            }
        });
    };

    render() {
        let columns = [
            {
                title: '追号编号',
                dataIndex: 'taskid',
                classNam: 'ellipsis_2',
                width: 110,
            }, {
                title: '追号时间',
                dataIndex: 'begintime',
                width: 90,
            }, {
                title: '彩种与玩法',
                dataIndex: 'cnname',
                render: (text, record) => {
                    return (
                        <div>
                            <p>{text}</p>
                            <p>{record.methodname}</p>
                        </div>
                    )
                },
                width: 90,
            }, {
                title: '追号进度',
                dataIndex: 'beginissue',
                render: (text, record) => {
                    return (
                        <div className="beginissue">
                            <p><span className="issuecount">期号</span>{text}</p>
                            <p><span className="finishedcount">进度</span>{record.finishedcount}/{record.issuecount}期</p>
                        </div>
                    )
                },
                width: 150,
            }, {
                title: '追号内容',
                dataIndex: 'codes_str',
                render: (text, record) => {
                    return (
                        text != '详细号码' ? text :
                            <Popover
                                content={<div style={{width: '150px', wordWrap: 'break-word'}}>{record.codes}</div>}
                                title="详细号码" trigger="hover">
                                <span className="hover_a">{text}</span>
                            </Popover>
                    )
                },
                width: 90,
            }, {
                title: '追号总金额',
                dataIndex: 'taskprice',
                className: 'column-right',
                sorter: (a, b) => {
                },
                width: 110,
            }, {
                title: '完成金额',
                dataIndex: 'finishprice',
                className: 'column-right',
                sorter: (a, b) => {
                },
                width: 100,
            }, {
                title: '取消金额',
                dataIndex: 'cancelprice',
                className: 'column-right',
                sorter: (a, b) => {
                },
                width: 100,
            }, {
                title: '中奖后终止',
                dataIndex: 'stoponwin',
                render: (text) => text == 1 ? '是' : '否',
                width: 80,
            }, {
                title: '状态',
                dataIndex: 'status',
                render: (text, record) => {
                    return (
                        <a href="javascript:void(0)" style={{textDecoration: 'underline'}}
                           onClick={() => this.onClickStatus(record)}>
                            {
                                text == 0 ? <span className="col_color_shu">进行中</span> :
                                    text == 1 ? '已取消' :
                                        text == 2 ? <span className="col_color_ying">已完成</span> : ''
                            }
                        </a>
                    )
                },
                width: 70,
            }];
        const sum = this.state.sum;
        const total = this.state.total;
        const footer = <div className="l_b_tabel_footer">
            <span>总计</span>
            <span>
                追号总金额：
                <strong>{sum.total_taskprice}元</strong>
            </span>
            <span>
                完成金额：
                <strong>{sum.total_finishprice}元</strong>
            </span>
            <span>
                取消金额：
                <strong>{sum.total_cancelprice}元</strong>
            </span>
        </div>;
        const Option = Select.Option;
        const RadioGroup = Radio.Group;
        const responseData = this.state.responseData;
        const postData = this.state.postData;
        const crowdid = this.state.crowdid;

        return (
            <div className="lottery_bet after_record">
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
                            <li className="t_m_line"></li>
                            <li>
                                <ul className="t_l_time_btn clear">
                                    {
                                        shortcutTime.map((item, i) => {
                                            return <li
                                                className={item.id === this.state.postData.threeSeven ? 't_l_time_btn_active' : ''}
                                                onClick={() => {
                                                    this.onShortcutTime(item.id)
                                                }} key={item.id}>{item.text}</li>
                                        })
                                    }
                                </ul>
                            </li>
                        </ul>
                        <ul className="t_l_classify">
                            <li>
                                <span>彩种名称：</span>
                                <Button onClick={() => this.onSelectBetName()}>
                                    {
                                        responseData.lotteryList[this.state.value] == undefined ? '所有游戏' :
                                            responseData.lotteryList[this.state.value].cnname
                                    }
                                    <Icon type="menu-unfold"/>
                                </Button>
                            </li>
                            <li>
                                <span>玩法群：</span>
                                <Select value={this.state.crowdid} style={{minWidth: 90}}
                                        onChange={(value) => this.setState({crowdid: value})}>
                                    <Option value="-1">所有玩法群</Option>
                                    {
                                        responseData.newCrowdList[postData.lotteryid] != undefined ?
                                            responseData.newCrowdList[postData.lotteryid].map((item, i) => {
                                                return <Option value={item.crowdid}
                                                               key={item.crowdid}>{item.crowdname}</Option>
                                            }) : ''
                                    }
                                </Select>
                            </li>
                            <li>
                                <span>玩法组：</span>
                                <Select value={postData.methodid} style={{minWidth: 130}}
                                        onChange={(value) => {
                                            postData.methodid = value;
                                            this.setState({postData: postData})
                                        }}
                                >
                                    <Option value="-1">所有玩法组</Option>
                                    {
                                        responseData.newMethodCrowdList[postData.lotteryid] != undefined &&
                                        responseData.newMethodCrowdList[postData.lotteryid][crowdid] != undefined &&
                                        crowdid != '-1' ?
                                            responseData.newMethodCrowdList[postData.lotteryid][crowdid].map((item, i) => {
                                                return <Option value={item.methodid}
                                                               key={item.methodid}>{item.methodname}</Option>
                                            }) : ''
                                    }
                                </Select>
                            </li>
                            <li>
                                <span>状态：</span>
                                <Select defaultValue="-1" style={{minWidth: 80}} onChange={(value) => {
                                    this.handleStatus(value)
                                }}>
                                    <Option value="-1">所有</Option>
                                    <Option value="0">进行中</Option>
                                    <Option value="1">已取消</Option>
                                    <Option value="2">已完成</Option>
                                </Select>
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
                                responseData.lotteryList.map((item, index) => {
                                    return (
                                        <Radio value={index} key={item.lotteryid}>{item.cnname}</Radio>
                                    )
                                })
                            }
                        </RadioGroup>
                    </div>
                </div>
                <div className="t_l_table">
                    <div className="t_l_table_list">
                        <Table columns={columns}
                               rowKey={record => record.taskid}
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




