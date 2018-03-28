/*日亏损佣金*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { setDateTime, disabledDate, datedifference } from '../../../CommonJs/common';
import { Table, Pagination, Button, Modal, DatePicker } from 'antd';
import moment from 'moment';
import { stateVar } from '../../../State';

import Fetch from '../../../Utils';

const FLAG_OBJECT = {};
@observer
export default class Losesalary extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            sum: 0, // 总计
            total: 0, //总条数
            loading: false,
            searchLoading: false,
            postData: {
                begintime: setDateTime(-1), //历史工资起时间
                eatime: setDateTime(0), // 历史工资结束时间
                p: 1,
                pn: 10,
            },
            visible: false, //模态框
            loadingModal: false,
            modalPostData: {
                userid: '',
                gmt_sale: '',
            },
            modalResp: {}, //详情
        };
    };
    componentDidMount() {
        this._ismount = true;
        this.getData();
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    /*获取日亏损佣金列表*/
    getData(){
        this.setState({ loading: true });
        Fetch.losesalary({
            method: 'POST',
            body: JSON.stringify(this.state.postData),
        }).then((res)=>{
            this.setState({ searchLoading: false, loading: false });
            if(this._ismount && res.status == 200){
                let data = res.repsoneContent;
                this.setState({
                    data: data.list.results,
                    total: parseInt(data.list.affects),
                    sum: data.list.sum.total_salary,
                })
            }
        })
    };
    /*开始时间*/
    onChangeStartDate(date, dateString){
        let postData = this.state.postData;
        postData.begintime = dateString;
        this.setState({postData: postData})
    };
    /*结束时间*/
    onChangeEndDate(date, dateString){
        let postData = this.state.postData;
        postData.eatime = dateString;
        this.setState({postData: postData})
    };
    /*搜索*/
    onSearch() {
        this.setState({ searchLoading: true });
        this.getData();
    };
    /*切换每页条数*/
    onShowSizeChange (current, pageSize) {
        let postData = this.state.postData;
        postData.p = current;
        postData.pn = pageSize;
        this.setState({postData: postData}, ()=>this.getData())
    };
    /*切换页面时*/
    onChangePagination(page) {
        let postData = this.state.postData;
        postData.p = page;
        this.setState({postData: postData},()=>this.getData());
    };
    /*关闭模态框*/
    handleCancel(){
        this.setState({
            visible: false,
        });
    };
    /*操作按钮*/
    onClickButton(record) {
        let modalPostData = this.state.modalPostData;
        modalPostData.userid = record.userid;
        modalPostData.gmt_sale = record.gmt_sale;
        this.setState({
            visible: true,
            modalPostData: modalPostData,
            loadingModal: true,
        });
        Fetch.detail({
            method: 'POST',
            body: JSON.stringify(modalPostData),
        }).then((res)=>{
            if(this._ismount){
                this.setState({loadingModal: false});
                if(res.status == 200) {
                    this.setState({modalResp: res.repsoneContent});
                }
            }
        })

    };
    render() {
        const columns = [
             {
                title: '日期',
                dataIndex: 'gmt_sale',
                width: 250,
            }, {
                title: '个人日亏损佣金',
                dataIndex: 'salary',
                className: 'column-right',
                render: (text)=>parseFloat(text) < 0 ? <span className="col_color_shu">{text}</span> :
                                                        <span className="col_color_ying">{text}</span>,
                width: 250,
            }, {
                title: '团队日亏损佣金',
                dataIndex: 'self_sale',
                className: 'column-right',
                render: (text)=>parseFloat(text) < 0 ? <span className="col_color_shu">{text}</span> :
                                                        <span className="col_color_ying">{text}</span>,
                width: 250,
            }, {
                title: '操作',
                dataIndex: 'buttons',
                width: 250,
                render: (text, record, index) => <Button onClick={()=>this.onClickButton(record)}>查看详情</Button>,
            }];
        const columnsModal = [
                {
                    title: '用户名',
                    dataIndex: 'username',
                    width: 110,
                }, {
                    title: '用户组',
                    dataIndex: 'usergroup_name',
                    width: 90,
                }, {
                    title: '投注量',
                    dataIndex: 'cp_stake',
                    className: 'column-right',
                    width: 100,
                }, {
                    title: '返点',
                    dataIndex: 'cp_point',
                    className: 'column-right',
                    width: 100,
                }, {
                    title: '中奖金额',
                    dataIndex: 'cp_bonus',
                    className: 'column-right',
                    width: 100,
                }, {
                    title: '亏损额',
                    dataIndex: 'cp_win_lose',
                    className: 'column-right',
                    width: 100,
                }, {
                    title: '产生佣金',
                    dataIndex: 'lose_salary',
                    className: 'column-right',
                    render: (text)=>parseFloat(text) < 0 ? <span className="col_color_shu">{text}</span> :
                                                            <span className="col_color_ying">{text}</span>,
                    width: 100,
                }
            ];
        const { sum, total, modalPostData, modalResp, postData } = this.state;
        const modalTotal = modalResp.total != undefined ? modalResp.total : FLAG_OBJECT;
        const list = modalResp.list != undefined ? modalResp.list : FLAG_OBJECT;
        const footer = <ul className="losesaLary_footer clear">
                            <li>总计</li>
                            <li className={parseFloat(sum) < 0 ? 'col_color_shu' : 'col_color_ying'}>{sum}</li>
                        </ul>;

        return (
            <div className="report">
                <div className="team_list_top">
                    <div className="t_l_time">
                        <ul className="t_l_time_row">
                            <li>
                                <span>查询日期：</span>
                                <DatePicker placeholder="查询开始日期"
                                            allowClear={false}
                                            defaultValue={moment(setDateTime(-1))}
                                            onChange={(date, dateString)=>{this.onChangeStartDate(date, dateString)}}
                                            disabledDate={(current)=>disabledDate(current, -30, 0)}

                                />
                                <span style={{margin: '0 5px'}}>至</span>
                                <DatePicker placeholder="查询结束日期"
                                            allowClear={false}
                                            defaultValue={moment(setDateTime(0))}
                                            onChange={(date, dateString)=>{this.onChangeEndDate(date, dateString)}}
                                            disabledDate={(current)=>disabledDate(current, -datedifference(postData.begintime, setDateTime(0)), 1)}
                                />
                            </li>
                            <li>
                                <Button type="primary"
                                        icon="search"
                                        loading={this.state.searchLoading}
                                        onClick={()=>this.onSearch()}
                                >
                                    搜索
                                </Button>
                            </li>
                            <li className="r_m_hint">
                                <p>提示：日亏损数据保留为有效时间最近30天数据</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="t_l_table">
                    <div className="t_l_location_name"></div>
                    <div className="t_l_table_list">
                        <Table columns={columns}
                               rowKey={record => record.id}
                               dataSource={this.state.data}
                               pagination={false}
                               loading={this.state.loading}
                               footer={total <= 0 ? null : ()=>footer}
                        />
                    </div>
                    <div className="t_l_page right" style={{display: total == 0 ? 'none' : ''}}>
                        <Pagination showSizeChanger
                                    onShowSizeChange={(current, pageSize)=>this.onShowSizeChange(current, pageSize)}
                                    onChange={(page)=>this.onChangePagination(page)}
                                    defaultCurrent={1}
                                    total={total}
                                    pageSizeOptions={stateVar.pageSizeOptions.slice()}
                        />
                    </div>
                    <Modal
                        title="日亏损佣金详情"
                        visible={this.state.visible}
                        width={800}
                        bodyStyle={{height: 400}}
                        footer={null}
                        maskClosable={false}
                        onCancel={()=>this.handleCancel()}
                        className="table_modal"
                    >
                        <p className="modal_username">查询日期：{modalPostData.gmt_sale}</p>
                        <div className="modal_table">
                            <Table columns={columnsModal}
                                   rowKey={record => record.id}
                                   dataSource={list.results}
                                   pagination={false}
                                   loading={this.state.loadingModal}
                                   scroll={{y: 245}}
                            />
                            <ul className="modalFooter clear" style={{display: list.affects <= 0 ? 'none' : ''}}>
                                <li>总计</li>
                                <li>{modalTotal.cp_stake}</li>
                                <li>{modalTotal.cp_point}</li>
                                <li>{modalTotal.cp_bonus}</li>
                                <li>{modalTotal.cp_win_lose}</li>
                                <li className={parseFloat(modalTotal.lose_salary) < 0 ? 'col_color_shu' : 'col_color_ying'}>{modalTotal.lose_salary}</li>
                            </ul>
                        </div>
                    </Modal>
                </div>
            </div>
        );
    }
}
