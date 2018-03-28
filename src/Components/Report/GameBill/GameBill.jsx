/*游戏帐变*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { DatePicker, Radio, Table, Select, Pagination, Button, Icon, Modal, Input, Checkbox} from 'antd';
const Option = Select.Option;
const RadioGroup = Radio.Group;
import moment from 'moment';
import Fetch from '../../../Utils';
import { setDateTime, disabledDate, datedifference } from '../../../CommonJs/common';
import { stateVar } from '../../../State';

@observer
export default class GameBill extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],// 游戏帐变
            tableLoading: false,
            searchLoading: false, // 搜索按钮loading
            iscancancelLoading: false, // 撤单按钮loading
            showLottery: false, // 隐藏彩种

            value: null,
            total: 0,//总条数
            postData: {
                lotteryid: 0, //彩种id
                modes: 0,
                starttime: setDateTime(0),
                endtime: setDateTime(1),
                ordertype: 0,
                p:1, //页码
                pn: 10,
            },
            lotteryList: [], //游戏种类
            modes: [], //投注模式
            type: [], //帐变类型
        }
    };
    componentDidMount() {
        this._ismount = true;
        this.getData()
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    /*获取游戏帐变记录*/
    getData() {
        this.setState({tableLoading: true});
        Fetch.lotteryAccountChanged({
            method: 'POST',
            body: JSON.stringify(this.state.postData)
        }).then((res)=>{
            if(this._ismount){
                this.setState({searchLoading: false, tableLoading: false});
                if(res.status == 200) {
                    let data = res.repsoneContent;
                    this.setState({
                        data: data.aOrders,
                        lotteryList: data.lottery_new,
                        total: parseInt(data.offects),
                        modes: data.modes,
                        type: data.type,
                    })
                }else{
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

    /*投注模式*/
    handleModes(val) {
        let postData = this.state.postData;
        postData.modes = val;
        this.setState({postData});
    };
    /*帐变类型*/
    handleOrdertype(val) {
        let postData = this.state.postData;
        postData.ordertype = val;
        this.setState({postData});
    };
    /*搜索*/
    onSearch() {
        this.setState({searchLoading: true});
        this.getData();
    };
    // 彩种名称
    onChangeRadio(e) {
        let index = e.target.value,
            lotteryList = this.state.lotteryList,
            postData = this.state.postData;
        postData.lotteryid = lotteryList[index] == undefined ? null : lotteryList[index].lotteryid;

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
        this.setState({postData: postData},()=>this.getData());
    };
    /*切换页面时*/
    onChangePagination(page) {
        let postData = this.state.postData;
        postData.p = page;
        this.setState({postData: postData},()=>this.getData());
    };
    /*选择彩种名称*/
    onSelectBetName(){
        this.setState({showLottery: !this.state.showLottery})
    };
    render() {
        const { total, lotteryList, modes, type, postData } = this.state;
        let columns = [
            {
                title: '用户名',
                dataIndex: 'username',
                width: 130,
            }, {
                title: '时间',
                dataIndex: 'times',
                width: 160,
            }, {
                title: '彩种与玩法',
                dataIndex: 'lotteryname',
                render:(text,record)=>{
                    return (
                        <div>
                            <p>{text}</p>
                            <p>{record.methodname}</p>
                        </div>
                    )
                },
                width: 90,
            }, {
                title: '期号',
                dataIndex: 'issue',
                width: 130,
            }, {
                title: '投注模式',
                dataIndex: 'modes',
                width: 90,
            }, {
                title: '帐变类型',
                dataIndex: 'ordertypeid',
                render: text=>{
                    for(let i = 0; i < type.length; i++){
                        if(text == type[i].id){
                            return type[i].cntitle
                        }
                    }
                },
                width: 130,
            }, {
                title: '变动金额',
                dataIndex: 'amount',
                className:'column-right',
                render:(text, record)=>(
                    record.operations == 0 ? <span className="col_color_shu">-{text}</span> :
                                            <span className="col_color_ying">+{text}</span>
                ),
                width: 130,
            }, {
                title: '余额',
                dataIndex: 'availablebalance',
                className:'column-right',
                width: 130,
            }];

        return (
            <div className="report">
                <div className="team_list_top">
                    <div className="t_l_time">
                        <ul className="t_l_time_row">
                            <li>
                                <span>查询日期：</span>
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    allowClear={false}
                                    placeholder="请选择开始时间"
                                    defaultValue={moment(setDateTime(0))}
                                    onChange={(date, dateString)=>{this.onChangeStartTime(date, dateString)}}
                                    disabledDate={(current)=>disabledDate(current, -16, 0)}
                                />
                                <span style={{margin: '0 8px'}}>至</span>
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    allowClear={false}
                                    placeholder="请选择结束时间"
                                    defaultValue={moment(setDateTime(1))}
                                    onChange={(date, dateString)=>{this.onChangeEndTime(date, dateString)}}
                                    disabledDate={(current)=>disabledDate(current, -datedifference(postData.starttime, setDateTime(0)), 1)}
                                />
                            </li>
                        </ul>
                        <ul className="t_l_classify">
                            <li>
                                <span>彩种名称：</span>
                                <Button onClick={()=>this.onSelectBetName()}>
                                    {
                                        lotteryList[this.state.value] == undefined ? '所有游戏' :
                                            lotteryList[this.state.value].cnname
                                    }
                                    <Icon type="menu-unfold" />
                                </Button>
                            </li>
                            <li>
                                <span>投注模式：</span>
                                <Select defaultValue="0" style={{ width: 80 }} onChange={(value)=>{this.handleModes(value)}}>
                                    <Option value="0">所有</Option>
                                    {
                                        modes.map((item, i)=>{
                                            return <Option value={''+item.modeid} key={item.modeid}>{item.name}</Option>
                                        })
                                    }
                                </Select>
                            </li>
                            <li>
                                <span>帐变类型：</span>
                                <Select defaultValue="0" style={{ minWidth: 120 }} onChange={(value)=>{this.handleOrdertype(value)}}>
                                    <Option value="0">所有类型</Option>
                                    {
                                        type.map((item, i)=>{
                                            return <Option value={item.id} key={item.id}>{item.cntitle}</Option>
                                        })
                                    }
                                </Select>
                            </li>
                            <li>
                                <Button type="primary" icon="search" loading={this.state.searchLoading} onClick={()=>this.onSearch()}>
                                    搜索
                                </Button>
                            </li>
                        </ul>
                    </div>
                    <div className={this.state.showLottery ? 't_m_select_lottery clear t_m_select_lottery_show' : 't_m_select_lottery clear'}>
                        <RadioGroup onChange={(e)=>{this.onChangeRadio(e)}} value={this.state.value}>
                            <Radio value={null}>所有游戏</Radio>
                            {
                                lotteryList.map((item,index)=>{
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
                               rowKey={record => record.entry}
                               dataSource={this.state.data}
                               pagination={false}
                               loading={this.state.tableLoading}
                               footer={null}
                        />
                    </div>
                    <div className="t_l_page" style={{display: total < 1 ? 'none' : ''}}>
                        <Pagination showSizeChanger
                                    onShowSizeChange={(current, pageSize)=>{this.onShowSizeChange(current, pageSize)}}
                                    onChange={(page)=>this.onChangePagination(page)}
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
