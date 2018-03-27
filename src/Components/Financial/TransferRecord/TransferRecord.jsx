/*转账记录*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../../Utils';
import { stateVar } from '../../../State';
import { disabledDate, setDateTime } from '../../../CommonJs/common';
import { DatePicker,  Button, Select, Table, Pagination } from 'antd';
import moment from 'moment';
const Option = Select.Option;

const OptionArr = [
    {
        name: '所有类型',
        id: 'all',
    },
    {
        name: '彩票账户',
        id: '0',
    },
    {
        name: '体育',
        id: '1',
    },
    {
        name: 'EA',
        id: '2',
    },
    {
        name: 'PT',
        id: '3',
    },
    {
        name: '博饼',
        id: '4',
    },
];
@observer
export default class TransferRecord extends Component {
    constructor(props){
        super(props);
        this.state = {
            tableLoading: false,
            data: [],
            total: 0,
            searchLoading: false,

            outMoney: OptionArr,
            inMoney: OptionArr,
            postData: {
                starttime: setDateTime(0), // 开始时间 2017-12-27
                endtime: setDateTime(1), // 结束时间 2017-12-27
                out_money: 'all', //出款方all 是所有 0是彩票账户 1是体育2是ea  3是pt  4是博饼
                in_money: 'all', //收款方 all 是所有
                status: 2, //2是所有 1成功 0失败
                p: 1,
                pagesize: 10,
            },
        }
    };

    componentDidMount() {
        this._ismount = true;
        this.getData();
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    /*获取充提列表*/
    getData() {
        this.setState({tableLoading: true});
        Fetch.fundreport({
            method: 'POST',
            body: JSON.stringify(this.state.postData)
        }).then((res)=>{
            if(this._ismount) {
                this.setState({tableLoading: false, searchLoading: false});
                if(res.status == 200){
                    let data = res.repsoneContent;
                    this.setState({data: data.result, total: parseInt(data.total)})
                }
            }

        })
    }
    /*开始查询日期*/
    onChangeStartDate(date, dateString) {
        let postData = this.state.postData;
        postData.starttime = dateString;
        this.setState({postData});
    };
    /*结束查询日期*/
    onChangeEndDate(date, dateString) {
        let postData = this.state.postData;
        postData.endtime = dateString;
        this.setState({postData});
    };
    /*查询类型*/
    onChangeType(val, type){
        let postData = this.state.postData,
            flag = [];
        postData[type] = val;
        if(val == '0') {
            flag = OptionArr.filter(item => item.id != val).filter(item => item.id != 'all');
        }else if(val == '1' || val == '2' || val == '3' || val == '4'){
            flag = OptionArr.filter(item => item.id == '0')
        }
        if(type == 'in_money'){
            this.setState({postData});
        }else{
            this.setState({postData, inMoney: flag});
        }
    };

    /*状态*/
    onChangeStatus(val){
        let postData = this.state.postData;
        postData.status = parseInt(val);
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
        postData.pagesize = pageSize;
        this.setState({postData: postData},()=>this.getData())
    };
    /*切换页面时*/
    onChangePagination(page) {
        let postData = this.state.postData;
        postData.p = page;
        this.setState({postData: postData},()=>this.getData());
    };
    render() {
        const { response, outMoney, inMoney, data, total } = this.state;
        const columns = [
            {
                title: '时间',
                dataIndex: 'time',
                width: 140,
            }, {
                title: '单号',
                dataIndex: 'trans_id',
                width: 160,
            }, {
                title: '转出账户',
                dataIndex: 'out',
                width: 130,
            }, {
                title: '转入账户',
                dataIndex: 'in',
                width: 130,
            }, {
                title: '转账金额',
                dataIndex: 'tranfsAmout',
                className: 'column-right',
                width: 130,
            }, {
                title: '转出账户金额',
                dataIndex: 'before_blance',
                className: 'column-right',
                width: 110,
            },{
                title: '转入账户金额',
                dataIndex: 'new_blance',
                className: 'column-right',
                width: 110,
            }, {
                title: '状态',
                dataIndex: 'status',
                render: text => text == '成功' ? <span className="col_color_ying">{text}</span> : text,
                width: 70,
            }
        ];

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
                                    disabledDate={(current)=>disabledDate(current, -18, 1)}
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
                                    disabledDate={(current)=>disabledDate(current, -18, 1)}
                                />
                            </li>
                            <li className="t_m_date_mar r_m_hint">
                                <p>提示：由于第三方数据同步存在延迟，如需实时数据请您咨询客服!</p>
                            </li>
                        </ul>
                        <ul className="t_l_classify">
                            <li>
                                <span>查询类型：</span>
                                <span className="t_m_date_mar">从</span>
                                <Select defaultValue="all" style={{ width: 100 }} onChange={(value)=>this.onChangeType(value, 'out_money')}>
                                    {
                                        outMoney.map((item, i)=>{
                                            return <Option value={item.id} key={item.id}>{item.name}</Option>
                                        })
                                    }
                                </Select>
                                <span className="t_m_date_mar">至</span>
                                <Select defaultValue="all" style={{ width: 100 }} onChange={(value)=>this.onChangeType(value, 'in_money')}>
                                    {
                                        inMoney.map((item, i)=>{
                                            return <Option value={item.id} key={item.id}>{item.name}</Option>
                                        })
                                    }
                                </Select>
                            </li>
                            <li>
                                <span>状态：</span>
                                <Select defaultValue="2" style={{ width: 100 }} onChange={(value)=>this.onChangeStatus(value)}>
                                    <Option value="2">所有</Option>
                                    <Option value="1">成功</Option>
                                    <Option value="0">失败</Option>
                                </Select>
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
                               dataSource={data}
                               pagination={false}
                               loading={this.state.tableLoading}
                               footer={null}
                        />
                    </div>
                    <div className="t_l_page" style={{display: total <= 0 || isNaN(total) ? 'none' : ''}}>
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
