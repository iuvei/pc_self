/*资金帐变*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../../Utils';
import { stateVar } from '../../../State';
import { setDateTime, disabledDate } from '../../../CommonJs/common';
import { DatePicker,  Button, Checkbox, Input, Select, Table, Pagination } from 'antd';
import moment from 'moment';
const Option = Select.Option;

const otypeArr = [
    {
        name: '[+]上级充值',
        id: 1
    },
    {
        name: '[+]跨级充值  ',
        id: 2
    },
    {
        name: '信用充值',
        id: 3
    },
    {
        name: '[-]充值扣费',
        id: 4
    },
    {
        name: '本人提现',
        id: 5
    },
    {
        name: '跨级提现',
        id: 6
    },{
        name: '下级提现',
        id: 7
    },
    {
        name: '本人发起提现',
        id: 8
    },
    {
        name: '下级发起提现',
        id: 9
    },
    {
        name: '商务提现申请',
        id: 10
    },
    {
        name: '商务提现失败',
        id: 11
    },
    {
        name: '信用扣减',
        id: 12
    },
    {
        name: '商务提现成功',
        id: 13
    },
    {
        name: '银行转出',
        id: 14
    },
    {
        name: '转入银行',
        id: 15
    },
    {
        name: 'EA转入',
        id: 16
    },
    {
        name: 'EA转出',
        id: 17
    },
    {
        name: '频道小额转入',
        id: 18
    },
    {
        name: '[-]小额扣除',
        id: 19
    },
    {
        name: '小额接收',
        id: 20
    },
    {
        name: '特殊金额清理',
        id: 21
    },
    {
        name: '特殊金额整理',
        id: 22
    },
    {
        name: '[+]理赔充值',
        id: 23
    },
    {
        name: '[-]管理员扣减',
        id: 24
    },
    {
        name: '转账理赔',
        id: 25
    },
    {
        name: '平台提现成功',
        id: 29
    },
    {
        name: '在线提现申请',
        id: 30
    },
    {
        name: '在线提现解冻',
        id: 32
    },
    {
        name: '在线提现扣款',
        id: 33
    },
    {
        name: '在线充值手续费',
        id: 34
    },
    {
        name: '在线提现手续费',
        id: 35
    },
    {
        name: '人工提现冻结',
        id: 36
    },
    {
        name: '人工提现解冻',
        id: 37
    },
    {
        name: '[+]现金充值',
        id: 38
    },
    {
        name: '彩票促销充值',
        id: 40
    },
    {
        name: '后台清理冻结金额',
        id: 41
    },
    {
        name: '[+]分红',
        id: 42
    },
    {
        name: '[+]反水',
        id: 43
    },
    {
        name: 'PT转入',
        id: 50
    },
    {
        name: 'PT转出',
        id: 51
    },
    {
        name: '博饼转入',
        id: 52
    },
    {
        name: '博饼转出',
        id: 53
    },
    {
        name: 'GT转入',
        id: 54
    },
    {
        name: 'GT转出',
        id: 55
    },
    {
        name: '沙巴转入',
        id: 56
    },
    {
        name: '沙巴转出',
        id: 57
    },
    {
        name: '彩票转入',
        id: 58
    },
    {
        name: '彩票转出',
        id: 59
    },
    {
        name: '总代扶持',
        id: 60
    },
    {
        name: '彩票分红',
        id: 61
    },
    {
        name: 'EA分红',
        id: 62
    },
    {
        name: '沙巴分红',
        id: 63
    },
    {
        name: 'PT分红',
        id: 64
    },
    {
        name: '博饼分红',
        id: 65
    },
    {
        name: 'GT分红',
        id: 66
    },
    {
        name: 'EA反水',
        id: 67
    },
    {
        name: '沙巴反水',
        id: 68
    },
    {
        name: 'PT反水',
        id: 69
    },
    {
        name: '博饼反水',
        id: 70
    },
    {
        name: 'GT反水',
        id: 71
    },
    {
        name: 'EA促销充值',
        id: 72
    },
    {
        name: '沙巴促销充值',
        id: 73
    },
    {
        name: 'PT促销充值',
        id: 74
    },
    {
        name: '博饼促销充值',
        id: 75
    },
    {
        name: 'GT促销充值',
        id: 76
    },
    {
        name: '[+]日工资',
        id: 77
    },
    {
        name: '[+]日亏损佣金',
        id: 78
    },
    {
        name: '[+]半月分红收入',
        id: 79
    },
    {
        name: '[-]半月分红支出',
        id: 80
    }
];
@observer
export default class AccountChange extends Component {
    constructor(props){
        super(props);
        this.state = {
            tableLoading: false,
            data: [],
            searchLoading: false,
            postData: {
                sdatetime: setDateTime(0), // 开始时间 2017-12-27
                edatetime: setDateTime(1), // 结束时间 2017-12-27
                type: 4, //4资金帐变
                otype: null,
                status: 0, //1 是成功 2是失败 0是所有
                username: '', // 用户名
                child: 0, //是否包含所有下级 0: 不包含， 1：包含
                p: 1,
                size: 10,
            },
            response: {},
        }
    };

    componentDidMount() {
        this._ismount = true;
        this.getData();
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    /*获取资金帐变列表*/
    getData() {
        this.setState({tableLoading: true});
        Fetch.getrwrecord({
            method: 'POST',
            body: JSON.stringify(this.state.postData)
        }).then((res)=>{
            if(this._ismount) {
                this.setState({tableLoading: false, searchLoading: false});
                if(res.status == 200){
                    this.setState({response: res.repsoneContent});
                }
            }
        })
    }
    /*是否包含下级*/
    onCheckbox(e) {
        let postData = this.state.postData;
        if(e.target.checked){
            postData.child = 1;
        }else{
            postData.child = 0;
        }
        this.setState({postData});
    }
    /*开始查询日期*/
    onChangeStartDate(date, dateString) {
        let postData = this.state.postData;
        postData.sdatetime = dateString;
        this.setState({postData});
    };
    /*结束查询日期*/
    onChangeEndDate(date, dateString) {
        let postData = this.state.postData;
        postData.edatetime = dateString;
        this.setState({postData});
    };
    /*查询类型*/
    onChangeType(val){
        let postData = this.state.postData;
        postData.otype = parseInt(val);
        this.setState({postData});
    };
    /*状态*/
    onChangeStatus(val){
        let postData = this.state.postData;
        postData.status = parseInt(val);
        this.setState({postData});
    };
    /*查询用户名*/
    onChangeUserName(e) {
        let postData = this.state.postData;
        postData.username = e.target.value;
        this.setState({postData});
    };
    /*搜索*/
    onSearch() {
        this.setState({searchLoading: true});
        this.getData();
    };
    /*切换每页显示条数*/
    onShowSizeChange (current, pageSize) {
        let postData = this.state.postData;
        postData.p = current;
        postData.size = pageSize;
        this.setState({postData: postData},()=>this.getData())
    };
    /*切换页面时*/
    onChangePagination(page) {
        let postData = this.state.postData;
        postData.p = page;
        this.setState({postData: postData},()=>this.getData());
    };
    render() {
        const { response } = this.state;
        const columns = [
            {
                title: '账变编号',
                dataIndex: 'orderNo',
                width: 150,
            }, {
                title: '用户名',
                dataIndex: 'username',
                width: 120,
            }, {
                title: '时间',
                dataIndex: 'times',
                width: 140,
            }, {
                title: '类型',
                dataIndex: 'wd_status',
                width: 100,
            }, {
                title: '收入',
                dataIndex: 'in',
                className: 'column-right',
                render: (text, record) => record.operations == 1 ? <span className="col_color_ying">+{text}</span> : '',
                width: 110,
            }, {
                title: '支出',
                dataIndex: 'out',
                className: 'column-right',
                render: (text, record) => record.operations == 0 ? <span className="col_color_shu">-{text}</span> : '',
                width: 110,
            },{
                title: '余额',
                dataIndex: 'availablebalance',
                className: 'column-right',
                width: 110,
            }, {
                title: '状态',
                dataIndex: 'transferstatus',
                render: text => text == 1 || text == 3 ? '失败' : '成功',
                width: 60,
            }, {
                title: '备注',
                dataIndex: 'description',
                width: 100,
            }
        ];
        const footer = <div className="mention_filling_record_footer clear">
                           <span>
                               总收入：
                               <strong className="col_color_ying">{response.allAcount == null || response.allAcount.in == undefined? '0' :  response.allAcount.in}</strong>
                               元
                           </span>
                            <span>
                               总支出：
                               <strong className="col_color_shu">{response.allAcount == null || response.allAcount.out == undefined ? '0' :  response.allAcount.out}</strong>
                               元
                           </span>
        </div>;

        return (
            <div className="mention_filling_record">
                <div className="team_list_top">
                    <div className="t_l_time">
                        <ul className="t_l_time_row">
                            <li>
                                <span>查询日期：</span>
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    allowClear={false}
                                    placeholder="请选择查询开始日期"
                                    defaultValue={moment(setDateTime(0))}
                                    onChange={(date, dateString)=>{this.onChangeStartDate(date, dateString)}}
                                    disabledDate={(current)=>disabledDate(current, -16, 1)}
                                />
                            </li>
                            <li>
                                <span className="t_m_date_mar">至</span>
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    allowClear={false}
                                    placeholder="请选择查询结束日期"
                                    defaultValue={moment(setDateTime(1))}
                                    onChange={(date, dateString)=>{this.onChangeEndDate(date, dateString)}}
                                    disabledDate={(current)=>disabledDate(current, -16, 1)}
                                />
                            </li>
                        </ul>
                        <ul className="t_l_classify">
                            <li>
                                <span>查询类型：</span>
                                <Select defaultValue={null} style={{ width: 130 }} onChange={(value)=>this.onChangeType(value)}>
                                    <Option value={null}>所有</Option>
                                    {
                                        otypeArr.map((item)=>{
                                            return <Option value={''+ item.id} key={item.id}>{item.name}</Option>
                                        })
                                    }
                                </Select>
                            </li>
                            <li>
                                <span>状态：</span>
                                <Select defaultValue="0" style={{ width: 100 }} onChange={(value)=>this.onChangeStatus(value)}>
                                    <Option value="0">所有</Option>
                                    <Option value="1">成功</Option>
                                    <Option value="2">失败</Option>
                                </Select>
                            </li>
                            <li>
                                <span>用户名：</span>
                                <Input placeholder="请输入用户名" onChange={(e)=>this.onChangeUserName(e)}/>
                            </li>
                            <li>
                                <Checkbox onChange={(e)=>this.onCheckbox(e)}>包含下级</Checkbox>
                            </li>
                            <li className="t_m_serch">
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
                               rowKey={(record, index)=> index}
                               dataSource={response.result}
                               pagination={false}
                               loading={this.state.tableLoading}
                               footer={response.resultCount <= 0 ? null : ()=>footer}
                        />
                    </div>
                    <div className="t_l_page" style={{display: response.resultCount <= 0 ? 'none' : ''}}>
                        <Pagination showSizeChanger
                                    onShowSizeChange={(current, pageSize)=>{this.onShowSizeChange(current, pageSize)}}
                                    onChange={(page)=>this.onChangePagination(page)}
                                    defaultCurrent={1}
                                    total={parseInt(response.resultCount)}
                                    pageSizeOptions={stateVar.pageSizeOptions.slice()}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
