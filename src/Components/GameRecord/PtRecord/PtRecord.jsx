/*PT投注*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {DatePicker, Modal, Checkbox, Radio, Table, Select, Input, Pagination, Button, Icon} from 'antd';
import moment from 'moment';
import Fetch from '../../../Utils'
import {setDateTime, disabledDate, datedifference} from '../../../CommonJs/common';
import {stateVar} from '../../../State';

@observer
export default class PtRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false,
            showLottery: false, // 隐藏彩种
            lotteryArr: [], // 游戏分类
            games: {},// 所有游戏名称
            value: null,
            sum: {}, //总计
            postData: {
                username: '', //查询用户名
                starttime: setDateTime(0) + ' 02:00:00',
                endtime: setDateTime(1) + ' 01:59:59',
                type: "personal", // group(团队) personal(个人)
                search: 1,
                gamecate: null, // 游戏分类 默认：15(老虎机)
                gameid: '0', // 游戏名称
                status: '0', // 0 :全部, 1 :和, 2：赢, 3： 输
                p: 1, //页码
                pn: 10,
                sortdesc: null,
                offects: null,
            },
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

    /*获取真人投注*/
    getData() {
        Fetch.ptbets({
            method: 'POST',
            body: JSON.stringify(this.state.postData)
        }).then((res) => {
            if (this._ismount) {
                this.setState({searchLoading: false});
                if (res.status == 200) {
                    let data = res.repsoneContent;
                    this.setState({
                        lotteryArr: data.gameCategory.category,
                        games: data.gameCategory.games,
                        data: data.winlosses instanceof Array ? data.winlosses : [],
                        total: parseInt(data.affects),
                        sum: data.winlossesAmount,
                    })
                } else {
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

    /* 游戏分类*/
    handleChangeMethod(value) {
        let postData = this.state.postData;
        postData.gameid = value;
        this.setState({postData: postData})
    };

    /*状态*/
    handleChangeStatus(value) {
        let postData = this.state.postData;
        postData.status = value;
        this.setState({postData: postData})
    };

    // 包含下级
    selectSubordinate(e) {
        let postData = this.state.postData;
        if (e.target.checked == true) {
            postData.type = 'group'
        } else {
            postData.type = 'personal'
        }
        this.setState({postData: postData});
    };

    // 游戏分类
    onChangeRadio(e) {
        let index = e.target.value,
            postData = this.state.postData,
            lotteryArr = this.state.lotteryArr;
        postData.gamecate = lotteryArr[index] == undefined ? null : lotteryArr[index].id;
        postData.gameid = '0';
        postData.status = '0';
        this.setState({
            value: index,
            postData: postData,
            showLottery: false
        });
    };

    /*每页某条*/
    onShowSizeChange(current, pageSize) {
        let postData = this.state.postData;
        postData.pn = pageSize;
        postData.p = 1;
        this.setState({postData: postData}, () => this.getData())
    };

    /*某页*/
    onChangePage(page) {
        let postData = this.state.postData;
        postData.p = page;
        this.setState({postData: postData}, () => this.getData())
    };

    onShowLottery() {
        this.setState({showLottery: !this.state.showLottery});
    };

    /*输入用户名*/
    onUserName(e) {
        let postData = this.state.postData;
        postData.username = e.target.value;
        this.setState({postData: postData});
    }

    render() {
        const total = this.state.total;
        const sum = this.state.sum;
        const footer = <ul className="pt_footer clear">
            <li>总计</li>
            <li>{sum.sum_pb}</li>
            <li>{sum.sum_pw}</li>
            <li>{sum.sum_pwl}</li>
        </ul>;
        const Option = Select.Option;
        const RadioGroup = Radio.Group;
        // 单选彩种名称
        const lotteryArr = this.state.lotteryArr;
        const postData = this.state.postData;

        let columns = [
            {
                title: '用户名',
                dataIndex: 'username',
                width: 110,
            }, {
                title: '时间',
                dataIndex: 'project_Game_date',
                width: 110,
            }, {
                title: '游戏名称',
                dataIndex: 'game_name',
                width: 135,
            }, {
                title: '牌局号',
                dataIndex: 'project_Game_code',
                width: 135,
            }, {
                title: '投注金额',
                dataIndex: 'project_bet',
                className: 'column-right',
                sorter: (a, b) => {
                },
                width: 120,
            }, {
                title: '奖金',
                dataIndex: 'project_win',
                className: 'column-right',
                sorter: (a, b) => {
                },
                width: 120,
            }, {
                title: '盈亏',
                dataIndex: 'project_WinLossAmount',
                className: 'column-right',
                render: text => (
                    text < 0 ? <span className="col_color_shu">{text}</span> :
                        <span className="col_color_ying">{text}</span>
                ),
                sorter: (a, b) => {
                },
                width: 135,
            }, {
                title: '状态',
                dataIndex: 'status',
                render: (text, record) => {
                    if (parseFloat(record.project_WinLossAmount) < 0) {
                        return '输'
                    } else if (parseFloat(record.project_WinLossAmount) > 0) {
                        return '赢'
                    } else {
                        return '和'
                    }
                },
                width: 70,
            }];
        const gamecate = this.state.postData.gamecate,
            games = this.state.games[gamecate] instanceof Array ? this.state.games[gamecate] : [];

        return (
            <div className="lottery_bet pt_record">
                <div className="team_list_top">
                    <div className="t_l_time">
                        <ul className="t_l_time_row">
                            <li>
                                <span className="t_m_date_classify">投注时间：</span>
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
                                <span className="t_m_date_classify">游戏分类：</span>
                                <Button onClick={() => this.onShowLottery()}>
                                    {
                                        lotteryArr[this.state.value] == undefined ? '所有游戏' :
                                            lotteryArr[this.state.value].name
                                    }
                                    <Icon type="menu-unfold"/>
                                </Button>
                            </li>
                            <li>
                                <span>游戏名称：</span>
                                <Select value={postData.gameid} style={{minWidth: 125}} onChange={(value) => {
                                    this.handleChangeMethod(value)
                                }}>
                                    <Option value="0">所有游戏</Option>
                                    {
                                        games.map((item, index) => {
                                            return <Option value={item.id} key={item.id}>{item.cn_name}</Option>
                                        })
                                    }
                                </Select>
                            </li>
                            <li>
                                <span>状态：</span>
                                <Select value={postData.status} style={{minWidth: 80}} onChange={(value) => {
                                    this.handleChangeStatus(value)
                                }}>
                                    <Option value="0">全部</Option>
                                    <Option value="1">和</Option>
                                    <Option value="2">赢</Option>
                                    <Option value="3">输</Option>
                                </Select>
                            </li>
                            <li>
                                <span>用户名：</span>
                                <Input placeholder="请输入用户名" value={postData.username}
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
                        className={this.state.showLottery ? 't_m_select_lottery clear t_m_select_lottery_show' : 't_m_select_lottery clear'}
                        style={{display: this.props.navIndex === 5 ? 'none' : 'block'}}
                    >
                        <RadioGroup onChange={(e) => {
                            this.onChangeRadio(e)
                        }} value={this.state.value}>
                            <Radio value={null}>所有游戏</Radio>
                            {
                                lotteryArr.map((item, index) => {
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
                               rowKey={record => record.project_id}
                               dataSource={this.state.data}
                               pagination={false}
                               loading={this.state.loading}
                               footer={total <= 0 ? null : () => footer}
                               onChange={this.handleTableChange}
                        />
                    </div>
                    <div className="t_l_page" style={{display: total <= 0 ? 'none' : ''}}>
                        <Pagination showSizeChanger
                                    onShowSizeChange={(current, pageSize) => {
                                        this.onShowSizeChange(current, pageSize)
                                    }}
                                    onChange={(pageNumber) => this.onChangePage(pageNumber)}
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

