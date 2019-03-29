/*走势图*/
import React, {Component} from 'react';
import {DatePicker, Checkbox, Select, Button} from 'antd';
import moment from 'moment';
import './Tendency.scss'
import Fetch from '../../Utils';
import NormalTable from "./NormalTable/NormalTable";
import ReverseTable from "./ReverseTable/ReverseTable";
import {setStore, getStore, setDateTime, disabledDate, datedifference} from "../../CommonJs/common";
import lotteryTypeList from '../../CommonJs/common.json';
const lotteryType = lotteryTypeList.lotteryType;
const Option = Select.Option;

export default class Tendency extends Component {
    constructor(props) {
        super(props);
        this.state = {
            postData: { //查询表格数据的requestData
                lotteryId: this.props.location.query.id == undefined ? 1 : this.props.location.query.id,  //查询彩种
                issueCount: 30,               //查询期数
                TrendType: 1,           //查询走势图类型
                starttime: null,
                endtime: null,
            },
            loading: true,
            tableTrendTotal: [],                 //所有彩种对应包含的走势图类型
            lotteryBigType: null,                  //每一个彩种对应的大彩种，例：欢乐生肖属于时时彩
            responseData: null, /*请求返回的数据，作为属性传给走势图表格*/
            checked: true, /*控制折线的显示*/
            reversetable: false, /*控制是否上下转换表格，boolean*/
        }
    };

    componentDidMount() {
        this._ismount = true;
        this.getTable();
    };

    componentWillUnmount() {
        this._ismount = false;
    };

    /*
     * 输入：全局变量当前彩种，用户选择走势图类型，显示期数，开始时间
     * 查询走势图信息
     * */
    getTable(issueCount) {
        let {postData} = this.state;
        postData.issueCount = issueCount || postData.issueCount;
        this.setState({loading: true});
        Fetch.trend(
            {
                method: "POST",
                body: JSON.stringify(postData)
            }).then((res) => {
            if (this._ismount) {
                if (res.status == 200) {
                    /*请求到数据后立马获取当前所有彩种以及相应彩种的所有走势图类型,只处理一次
                     * 并将走势图类型对应上彩种id进行数组重构
                     * 通过判断数组变量tableTrendTotal的长度判断是否进行数组重构(有待处理）
                     * */
                    let data = res.repsoneContent,
                        tableTrendTotal = [],
                        tableTrend = [],
                        lotteryListFlag = data.aData.lotteryList,
                        trendPic = data.aData.trendPic;
                    for (let i = 0; i < lotteryListFlag.length; i++) {
                        tableTrend = [];
                        for (let x in trendPic[lotteryListFlag[i].lotteryid][0]) {
                            tableTrend.push({
                                id: x,
                                name: trendPic[lotteryListFlag[i].lotteryid][0][x],
                            })
                        }
                        tableTrendTotal[lotteryListFlag[i].lotteryid] = tableTrend;
                    }
                    /*重构后台返回的lotteryList
                     * 将彩种id作为索引，彩种大类作为变量内容
                     * */
                    let lotteryBigType = [];
                    for (let i = 0; i < lotteryListFlag.length; i++) {
                        lotteryBigType[lotteryListFlag[i].lotteryid] = lotteryListFlag[i].lotterytype;
                    }
                    this.setState({
                        tableTrendTotal: tableTrendTotal,
                        trendPic: data.aData.trenPic,
                        tableTrend: tableTrend,
                        loading: false,
                        lotteryBigType: lotteryBigType,
                        responseData: data,
                    })
                }
            }
        })
    };

    /*开始查询日期*/
    onChangeStartTime(date, dateString) {
        let {postData} = this.state;
        postData.starttime = dateString;
        this.setState({postData})
    };

    /*结束查询日期*/
    onChangeEndTime(date, dateString) {
        let {postData} = this.state;
        postData.endtime = dateString;
        this.setState({postData})
    };


    /*处理时间对象 end*/
    /*选择不同走势图类型*/
    handleChangeMethod(value) {
        let {postData} = this.state;
        postData.TrendType = value;
        this.setState({
            postData: postData,
        }, ()=>this.getTable());
    };

    /*选择不同彩种类型
     * 并请求对应彩种下的第一种走势图类型*/
    handleChangePlayType(value) {
        let {postData, tableTrendTotal} = this.state;
        postData.lotteryId = value;
        postData.TrendType = parseInt(tableTrendTotal[value][0].id);
        this.setState({
            postData: postData,
        }, ()=>this.getTable());
    };

    /*倒转当前表格*/
    reverseTable() {
        setStore("reversetable", !this.state.reversetable);
        this.setState((prevState, props) => ({
            reversetable: !prevState.reversetable,
        }));

    };

    /*选择最近30期，最近50期，最近100期,并请求对应的表格行数*/
    onShortcutTime(val) {
        let postData = this.state.postData;
        if (postData.issueCount == val) {
        } else {
            postData.issueCount = val;
            this.getTable(val);
        }
        this.setState({postData: postData});
    };

    /*控制折线图的显示隐藏*/
    displayChartLine(e) {
        this.setState({
            checked: e.target.checked,
        });

    };

    /*正确显示表格，包括倒转表格和正常表格,当彩种为北京pk10时，表格生成滚动条*/
    displapyTable() {
        let reverseState = getStore("reversetable") || this.state.reversetable;
        /*首先从缓存中获取表格显示样式*/
        if (!this.state.loading) {
            if (reverseState) {
                return <ReverseTable responseData={this.state.responseData} checked={this.state.checked}
                                     lotteryId={this.state.postData.lotteryId}/>;
            } else {
                return <NormalTable responseData={this.state.responseData} checked={this.state.checked}
                                    lotteryId={this.state.postData.lotteryId}/>;
            }
        } else {
            return "";
        }
    };

    render() {
        const {tableTrendTotal, postData} = this.state;
        const shortcutTime = [
            {
                text: '最近30期',
                id: 30
            }, {
                text: '最近50期',
                id: 50
            }, {
                text: '最近100期',
                id: 100
            }
        ];

        return (
            <div className='tendency-main'>
                <div className='t-top'>
                    <ul className='lottery_list'>
                        <li id="t_lottery_type">
                            <Select style={{minWidth: 130}}
                                // getPopupContainer={() => document.getElementById('t_lottery_type')}
                                    value={'' + postData.lotteryId} onChange={(value) => {
                                this.handleChangePlayType(value)
                            }}>
                                {
                                    lotteryType.map(item => {
                                        return <Option value={'' + item.lotteryid} key={'' + item.lotteryid}
                                                       disabled={item.disabled || item.tendency}>{item.cnname}</Option>
                                    })
                                }
                            </Select>
                        </li>
                        <li id="t_lottery_method">
                            <Select style={{minWidth: 130}}
                                // getPopupContainer={() => document.getElementById('t_lottery_method')}
                                    value={''+ postData.TrendType} onChange={(value) => {
                                this.handleChangeMethod(value)
                            }}>
                                {
                                    tableTrendTotal[postData.lotteryId] != undefined ? tableTrendTotal[postData.lotteryId].map((value) => {
                                        return (
                                            <Option value={''+ value.id} key={''+ value.id}>{value.name}</Option>
                                        )
                                    }) : null
                                }
                            </Select>
                        </li>
                        <li>
                            <Checkbox checked={this.state.checked} onChange={(e) => {
                                this.displayChartLine(e)
                            }}>显示走势折线</Checkbox>
                        </li>
                        <li>
                        <span className='hover_a' onClick={() => {
                            this.reverseTable()
                        }}>表格上下转换</span>
                        </li>
                        <li></li>
                        <li>当前统计期数：{this.state.postData.issueCount}</li>
                        <li>
                            <ul className='t-period clear'>
                                {
                                    shortcutTime.map((item, i) => {
                                        return <li
                                            className={item.id === this.state.postData.issueCount ? 't_period_btn_active' : ''}
                                            onClick={() => {
                                                this.onShortcutTime(item.id)
                                            }} key={item.id}>{item.text}</li>
                                    })
                                }
                            </ul>
                        </li>
                        <li>
                            <span>日期：</span>
                            <DatePicker
                                format="YYYY-MM-DD hh:mm:ss"
                                allowClear={false}
                                showTime
                                placeholder="请选择开始时间"
                                onChange={(date, dateString) => {
                                    this.onChangeStartTime(date, dateString)
                                }}
                                disabledDate={(current)=>disabledDate(current, -365, 0)}
                                />
                            <span>&nbsp;至&nbsp;</span>
                            <DatePicker
                                format="YYYY-MM-DD hh:mm:ss"
                                allowClear={false}
                                showTime
                                placeholder="请选择结束时间"
                                onChange={(date, dateString) => {
                                    this.onChangeEndTime(date, dateString)
                                }}
                                disabledDate={(current) => disabledDate(current, -datedifference(postData.starttime, setDateTime(0)), 1)}
                            />
                        </li>
                        <li>
                            <Button type="primary" onClick={() => {
                                this.getTable()
                            }}>
                                查询
                            </Button>
                        </li>
                    </ul>
                </div>
                <div className="c_table">
                    { this.displapyTable() }
                </div>
            </div>
        );
    }
}
