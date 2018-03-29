/*彩票投注*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {DatePicker, Checkbox, Radio, Table, Select, Input, Pagination, Button, Icon, Popover, Modal} from 'antd';
import moment from 'moment';
import Fetch from '../../../Utils';
import {setDateTime, disabledDate, datedifference} from '../../../CommonJs/common';
import {stateVar} from '../../../State';

import './LotteryBet.scss';
const Option = Select.Option;
const RadioGroup = Radio.Group;
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
export default class LotteryBet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],// 彩票投注列表
            loading: false,
            searchLoading: false, // 搜索按钮loading
            iscancancelLoading: false, // 撤单按钮loading
            showLottery: false, // 隐藏彩种
            value: null,
            total: 0,//总条数

            postData: {
                lotteryid: null, //彩种id，0为全部
                methodid: '-1', //玩法id -1为全部
                ischild: 0, //0个人  1团队
                modes: 0, //1元 2 角 3分
                username: null, //查询用户名
                threeSeven: 0, //3 近三天  7 近七天
                starttime: setDateTime(0) + ' 02:00:00',
                endtime: setDateTime(1) + ' 01:59:59',
                pstatus: 0, //0 全部 1(3种撤单) 2未中奖 3未派奖 4 已派奖 5未开奖
                pn: 10, // 每页显示条数
                p: 1, //页码
                sortdesc: null,
                offects: null,
            },
            responseData: {
                lotteryList: [], //彩种名称
                newCrowdList: {}, //玩法群
                newMethodCrowdList: {}, //玩法
            },
            sum: {},
            visible: false,
            seatModal: {},//模态框内容
            crowdid: '-1',// 玩法群id -1为全部
        }
    };

    componentDidMount() {
        this._ismount = true;
        this.getData()
    };

    componentWillUnmount() {
        this._ismount = false;
    };

    /*获取彩票投注*/
    getData() {
        this.setState({loading: true});
        let postData = this.state.postData,
            name = this.props.location.query.name;
        if (name != undefined && postData.username == null) {
            postData.username = name
        }
        Fetch.newGameList({
            method: 'POST',
            body: JSON.stringify(this.state.postData)
        }).then((res) => {
            if (this._ismount) {
                this.setState({
                    searchLoading: false,
                    loading: false,
                });
                if (res.status == 200) {
                    let data = res.repsoneContent;
                    let responseData = {
                        lotteryList: data.lotteryList,
                        newCrowdList: data.newCrowdList,
                        newMethodCrowdList: data.newMethodCrowdList,
                    };
                    this.setState({
                        data: data.aProject,
                        responseData: responseData,
                        sum: data.allAmount,
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
    /*投注模式*/
    handleBetPattern(val) {
        let postData = this.state.postData;
        postData.modes = val;
        this.setState({postData: postData});
    };

    /*状态*/
    handleStatus(val) {
        let postData = this.state.postData;
        postData.pstatus = val;
        this.setState({postData: postData});
    };

    /*包含下级*/
    selectSubordinate(e) {
        let postData = this.state.postData;
        if (e.target.checked == true) {
            postData.ischild = 1
        } else {
            postData.ischild = 0
        }
        this.forceUpdate();
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
            responseData = this.state.responseData,
            lotteryid = responseData.lotteryList[index] == undefined ? null : responseData.lotteryList[index].lotteryid;
        postData.lotteryid = lotteryid;

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

    /*输入用户名*/
    onUserName(e) {
        let postData = this.state.postData;
        postData.username = e.target.value;
        this.setState({postData: postData});
    };

    /*点击订单号*/
    onClickProjectid(record) {
        this.setState({
            visible: true,
            seatModal: record,
        })
    };

    /*判断中奖状态*/
    onWinningState(record) {
        if (record.iscancel == 0) {
            if (record.isgetprize == 0) {
                return '未开奖'
            } else if (record.isgetprize == 2) {
                return '未中奖'
            } else if (record.isgetprize == 1) {
                return record.prizestatus == 0 ? '未派奖' : <b className="col_color_ying">已派奖</b>
            }
        } else if (record.iscancel == 1) {
            return '本人撤单'
        } else if (record.iscancel == 2) {
            return '平台撤单'
        } else if (record.iscancel == 3) {
            return '错开撤单'
        }
    };

    /*撤单*/
    onCancelgameAjax(seatModal) {
        let _this = this;
        Modal.confirm({
            title: '你确定要撤单吗?',
            content: '单号：' + seatModal.projectid,
            okType: 'danger',
            onOk() {
                _this.setState({iscancancelLoading: true});
                Fetch.cancelgameAjax({
                    method: 'POST',
                    body: JSON.stringify({id: seatModal.projectid})
                }).then((res) => {
                    if (_this._ismount) {
                        _this.setState({iscancancelLoading: false});
                        if (res.status == 200) {
                            Modal.success({
                                title: res.longMessage,
                            });
                            let seatModal = _this.state.seatModal;
                            seatModal.iscancancel = 11; // 随意设置一个值来判断关闭和撤单成功后是否重新刷新列表
                            _this.setState({seatModal: seatModal});
                        } else {
                            Modal.warning({
                                title: res.shortMessage,
                            });
                        }
                    }
                })
            }
        });
    };

    /*关闭模态框*/
    handleCancel() {
        this.setState({visible: false})
        let seatModal = this.state.seatModal;
        seatModal.iscancancel == 11 ? this.getData() : '';
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

    render() {
        let columns = [
            {
                title: '订单号',
                dataIndex: 'projectid',
                render: (text, record) => <span className="ellipsis_2 hover_a"
                                                onClick={() => this.onClickProjectid(record)}>{text}</span>,
                width: 90,
            }, {
                title: '用户名',
                dataIndex: 'username',
                width: 90,
            }, {
                title: '彩种与玩法',
                dataIndex: 'lotteryname',
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
                title: '投注时间',
                dataIndex: 'writetime',
                width: 90,
            }, {
                title: '期号',
                dataIndex: 'issue',
                width: 90,
            }, {
                title: '投注内容',
                dataIndex: 'codes_str',
                render: (text, record) => {
                    return (
                        text != '详细号码' ? text :
                            <Popover content={<div style={{width: '150px', wordWrap: 'break-word'}}>{record.code}</div>}
                                     title="详细号码" trigger="hover">
                                <span className="hover_a">{text}</span>
                            </Popover>
                    )
                },
                width: 90,
            }, {
                title: '投注倍数',
                dataIndex: 'multiple',
                width: 75,
            }, {
                title: '投注模式',
                dataIndex: 'modes',
                render: (text) => text == 1 ? '元' : text == 2 ? '角' : '分',
                width: 75,
            }, {
                title: '开奖号码',
                dataIndex: 'i_code',
                render: (text, record) => {
                    return (
                        text != null && '' + text.length < 10 ? text :
                            <Popover
                                content={<div style={{width: '150px', wordWrap: 'break-word'}}>{record.i_code}</div>}
                                title="详细号码" trigger="hover">
                                <span className="hover_a">详细号码</span>
                            </Popover>
                    )
                },
                width: 75,
            }, {
                title: '投注金额',
                dataIndex: 'totalprice',
                className: 'column-right',
                width: 80,
                sorter: (a, b) => {
                },
            }, {
                title: '奖金',
                dataIndex: 'bonus',
                className: 'column-right',
                render: (text) => (
                    text < 0 ? <span className="col_color_shu">{text}</span> :
                        <span className="col_color_ying">{text}</span>
                ),
                sorter: (a, b) => {
                },
                width: 80,
            }, {
                title: '状态',
                dataIndex: 'active',
                render: (text, record) => this.onWinningState(record),
                width: 70,
            }];
        const {seatModal, sum, total, responseData, postData, crowdid} = this.state;
        const footer = <div className="l_b_tabel_footer">
            <span>总计</span>
            <span>
                                  总投注额：
                                  <strong>{sum.all_totalprice}元</strong>
                              </span>
            <span>
                                  总奖金：
                                  <strong>{sum.all_bonus}元</strong>
                              </span>
        </div>;

        return (
            <div className="lottery_bet">
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
                            <li>
                                <span>用户名：</span>
                                <Input placeholder="请输入用户名" value={this.state.postData.username} style={{width: 180}}
                                       onChange={(e) => this.onUserName(e)}/>
                            </li>
                            <li>
                                <Checkbox onChange={(e) => {
                                    this.selectSubordinate(e)
                                }}>包含下级</Checkbox>
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
                                <span>投注模式：</span>
                                <Select defaultValue="0" style={{minWidth: 80}} onChange={(value) => {
                                    this.handleBetPattern(value)
                                }}>
                                    <Option value="0">所有</Option>
                                    <Option value="1">元</Option>
                                    <Option value="2">角</Option>
                                    <Option value="3">分</Option>
                                </Select>
                            </li>
                            <li>
                                <span>状态：</span>
                                <Select defaultValue="0" style={{minWidth: 80}} onChange={(value) => {
                                    this.handleStatus(value)
                                }}>
                                    <Option value="0">所有</Option>
                                    <Option value="1">撤单</Option>
                                    <Option value="2">未中奖</Option>
                                    <Option value="3">未派奖</Option>
                                    <Option value="4">已派奖</Option>
                                    <Option value="5">未开奖</Option>
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
                               rowKey={record => record.projectid}
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
                <Modal
                    title="投注单期记录"
                    width={915}
                    visible={this.state.visible}
                    onCancel={() => this.handleCancel()}
                    footer={null}
                    maskClosable={false}
                    className="lottery_bet_modal"
                >
                    <span className="bet_seat">投注单号：<i>{seatModal.projectid}</i></span>
                    <Button className="right" onClick={() => this.onCancelgameAjax(seatModal)}
                            style={{display: seatModal.iscancancel == 1 ? '' : 'none', marginRight: 12}} type="primary"
                            icon="retweet"
                            loading={this.state.iscancancelLoading}
                    >撤单</Button>
                    <p className="bet_d_bg"></p>
                    <div className="bet_details">
                        <ul className="bet_list clear">
                            <li>
                                <span>用户名：</span>
                                <span>{seatModal.username}</span>
                            </li>
                            <li>
                                <span>投注期号：</span>
                                <span>{seatModal.issue}</span>
                            </li>
                            <li>
                                <span>开奖号码：</span>
                                <ul className="bet_cody_style clear">
                                    {
                                        seatModal.i_code != undefined ?
                                            seatModal.i_code.indexOf(' ') > 0 ?
                                                seatModal.i_code.split(' ').map((item, i) => {
                                                    return <li key={i}>{item}</li>
                                                }) :
                                                seatModal.i_code.split('').map((item, i) => {
                                                    return <li key={i}>{item}</li>
                                                }) : ''
                                    }
                                </ul>
                            </li>
                            <li>
                                <span>彩种玩法：</span>
                                <span>{seatModal.lotteryname}-{seatModal.methodname}</span>
                            </li>
                            <li>
                                <span>投注倍数：</span>
                                <span>{seatModal.multiple}倍</span>
                            </li>
                            <li>
                                <span>投注金额：</span>
                                <span>{seatModal.totalprice}</span>
                            </li>
                            <li>
                                <span>投注时间：</span>
                                <span>{seatModal.writetime}</span>
                            </li>
                            <li>
                                <span>投注模式：</span>
                                <span>{seatModal.modes == 1 ? '元' : seatModal.modes == 2 ? '角' : '分'}</span>
                            </li>
                            <li>
                                <span>中奖金额：</span>
                                <span style={{color: '#EE0000'}}>{seatModal.bonus}</span>
                                <span className="right">{this.onWinningState(seatModal)}</span>
                            </li>
                        </ul>
                        <p>投注内容：<i className="bet_cao" style={{display: seatModal.vote_status == 1 ? '' : 'none'}}>单</i>
                        </p>
                        <div className="bet_cody">
                            {seatModal.code}
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

