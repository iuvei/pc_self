/*真人投注*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {DatePicker, Radio, Table, Select, Pagination, Button, Icon, Modal, Input, Checkbox} from 'antd';
const Option = Select.Option;
const RadioGroup = Radio.Group;
import moment from 'moment';
import Fetch from '../../../Utils';
import {setDateTime, disabledDate, datedifference} from '../../../CommonJs/common';
import {stateVar} from '../../../State';

@observer
export default class Person extends Component {
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
                username: null, //查询用户名
                starttime: setDateTime(0) + ' 02:00:00',
                endtime: setDateTime(1) + ' 01:59:59',
                code: 0, // 游戏编码（游戏名称）
                status: '-1', //3 :和 1：赢 2： 输  -1：所有
                ptype: 'noteam', // team (团对)
                p: 1, //页码
                pn: 10,

                sortdesc: null,
                offects: null,
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

    /*获取真人投注记录*/
    getData() {
        Fetch.EagameRecordSearch({
            method: 'POST',
            body: JSON.stringify(this.state.postData)
        }).then((res) => {
            if (this._ismount) {
                this.setState({searchLoading: false});
                if (res.status == 200) {
                    let data = res.repsoneContent;
                    this.setState({
                        data: data.eagametzlist,
                        lotteryList: data.nameList,
                        sum: data.all_amount,
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
                dataIndex: 'clientbet_login',
                classNam: 'ellipsis_2',
                width: 130,
            }, {
                title: '时间',
                dataIndex: 'deal_startdate',
                width: 130,
            }, {
                title: '游戏名称',
                dataIndex: 'name',
                render: (text, record) => {
                    return (
                        <div>
                            <p>{text}</p>
                            <p>{record.methodname}</p>
                        </div>
                    )
                },
                width: 130,
            }, {
                title: '牌局号',
                dataIndex: 'deal_code',
                width: 130,
            }, {
                title: '投注金额',
                dataIndex: 'clientbet_bet_amount',
                className: 'column-right',
                sorter: (a, b) => {
                },
                width: 130,
            }, {
                title: '奖金',
                dataIndex: 'clientbet_payout_amount',
                className: 'column-right',
                sorter: (a, b) => {
                },
                width: 130,
            }, {
                title: '盈亏',
                dataIndex: 'clientbet_hold',
                className: 'column-right',
                render: (text) => (
                    text < 0 ? <span className="col_color_shu">{text}</span> :
                        <span className="col_color_ying">{text}</span>
                ),
                sorter: (a, b) => {
                },
                width: 130,
            }, {
                title: '状态',
                dataIndex: 'status',
                render: (text) => (
                    text == '赢' ? <span className="col_color_ying">{text}</span> :
                        <span className="col_color_shu">{text}</span>
                ),
                width: 70,
            }];
        const {sum, total, lotteryList, postData} = this.state;
        const footer = <div className="l_b_tabel_footer" style={{display: total < 1 ? 'none' : ''}}>
            <span>总计</span>
            <span>
                总投注金额：
                <strong>{sum.all_bet_amount}元</strong>
            </span>
            <span>
                总奖金：
                <strong>{sum.all_payout_amount}元</strong>
            </span>
            <span>
                总盈亏：
                <strong>{sum.all_hold}元</strong>
            </span>
        </div>;

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
                                <Select defaultValue="-1" style={{minWidth: 80}} onChange={(value) => {
                                    this.handleStatus(value)
                                }}>
                                    <Option value="-1">所有</Option>
                                    <Option value="1">赢</Option>
                                    <Option value="2">输</Option>
                                    <Option value="3">和</Option>
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






