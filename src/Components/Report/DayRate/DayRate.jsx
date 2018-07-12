/*日工资*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../../Utils';
import {DatePicker, Table, Pagination, Input, Button, Icon, Modal, Tooltip} from 'antd';
import moment from 'moment';
import {stateVar} from '../../../State';
import {setDateTime, disabledDate} from '../../../CommonJs/common';
import Crumbs from '../../Common/Crumbs/Crumbs';

@observer
export default class DayRate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            searchLoading: false,

            postData: {
                // username: stateVar.userInfo.userName,// 查询用户名
                username: '',// 查询用户名
                starttime: setDateTime(-1),// 查询日期
                p: 1,
                pn: 10,
            },
            searchUserName: '', //查询历史工资用户名
            visible: false, // 模态框显示隐藏

            table: {
                dayRateList: [], // 日工资列表
                sum: {},
                total: 0, // 日工资记录条数
                history: [
                    {
                        name: stateVar.userInfo.userName,
                        date: setDateTime(0),
                    }
                ],
            },
            historyData: {},// 历史日工资
        };
    };

    componentDidMount() {
        this._ismount = true;
        this.getData();
    };

    componentWillUnmount() {
        this._ismount = false;
    };

    onKeyDown(e) {
        if (e.keyCode == 13) {
            this.onSearch();
        }
    };

    /*获取日工资列表*/
    getData(type) {
        this.setState({loading: true});
        Fetch.dailysalary({
            method: "POST",
            body: JSON.stringify(this.state.postData)
        }).then((res) => {
            if (this._ismount) {
                this.setState({
                    loading: false,
                    searchLoading: false
                });
                let table = this.state.table;
                if (res.status == 200) {
                    let data = res.repsoneContent;
                    table.dayRateList = data.results;
                    table.sum = data.sum;
                    table.total = parseInt(data.affects);
                    this.setState({table: table});
                } else {
                    if(type == 'onSearch'){
                        Modal.warning({
                            title: res.shortMessage,
                        });
                    }
                }
            }
        });
    };

    /*获取查询日期*/
    onChangeDate(date, dateString) {
        let postData = this.state.postData;
        postData.starttime = dateString;
        this.setState({postData})
    };

    /*获取查询用户名*/
    onUserName(e) {
        let postData = this.state.postData;
        postData.username = e.target.value.replace(/\s/g, '');
        this.setState({postData: postData})
    };

    /*搜索*/
    onSearch() {
        let {postData} = this.state;
        postData.p = 1;
        this.setState({searchLoading: true, postData}, ()=>this.getData('onSearch'));
    };

    /*切换每页显示条数*/
    onShowSizeChange(current, pageSize) {
        let postData = this.state.postData;
        postData.p = current;
        postData.pn = pageSize;
        this.setState({postData: postData}, () => this.getData());
    };

    /*面包屑组件调用*/
    onChildState(item, table) {
        let postData = this.state.postData;
        postData.username = item.name;
        this.setState({
            postData: postData,
            table: table,
        }, () => this.getData())
    };

    /*点击用户名*/
    onClickUserName(name) {
        let table = this.state.table,
            historyArr = this.state.table.history,
            postData = this.state.postData,
            historyFlag = true;
        postData.username = name;
        this.setState({postData: postData, table: table}, () => {
            let history = {
                name: postData.username,
                date: postData.starttime,
            };
            for (let i = 0; i < historyArr.length; i++) {
                if (historyArr[i].name === history.name && historyArr[i].date === history.date) {
                    historyFlag = false;
                    break;
                }
            }
            if (historyFlag) {
                table.history.push(history);
            }
            this.getData();
        });
    };

    /*返回上一层table*/
    onClickGoBac_1() {
        let table = this.state.table,
            postData = this.state.postData;
        if (table.history.length === 1) {
            return
        }
        table.history.splice(-1, 1);
        postData.username = table.history[table.history.length - 1].name;
        this.setState({
            postData: postData,
            table: table,
        }, () => this.getData())
    };

    /*操作按钮*/
    onClickButton(record) {
        this.setState({
            visible: true,
            searchUserName: record.username,
            loadingModal: true,
        });
        Fetch.salarypersonalsalary({
            method: 'POST',
            body: JSON.stringify({username: record.username, begintime: '', eatime: record.gmt_sale})
        }).then((res) => {
            if (this._ismount) {
                this.setState({loadingModal: false});
                if (res.status == 200) {
                    this.setState({historyData: res.repsoneContent.list});
                }
            }
        })
    };

    /*某页*/
    onChangePage(page) {
        let postData = this.state.postData;
        postData.p = page;
        this.setState({postData: postData}, () => this.getData());
    };

    render() {
        const {postData, table, historyData} = this.state;
        const columns = [
            {
                title: '用户名',
                dataIndex: 'username',
                render: (text, record, index) => index == 0 ? text :
                    <span className="hover_a" onClick={() => this.onClickUserName(text)}
                          style={{color: '#0088DE'}}>{text}</span>,
                width: 110,
                filterIcon: <Icon type="smile-o" style={{color: 'red'}}/>,
            }, {
                title: '用户类型',
                dataIndex: 'usergroup_name',
                width: 90,
            }, {
                title: '投注量',
                dataIndex: 'sale',
                className: 'column-right',
                width: 120,
            }, {
                title: <span>
                        有效量
                        <Tooltip placement="bottomRight"
                                 title={
                                     '对打套利销量不计入有效量'
                                 }>
                            <Icon className='head_hint' type="question-circle"/>
                    </Tooltip>
                </span>,
                dataIndex: 'effective_sale',
                className: 'column-right',
                width: 120,
            }, {
                title: '日工资比例',
                dataIndex: 'salary_ratio',
                className: 'column-right',
                width: 120,
            }, {
                title: '团队日工资',
                dataIndex: 'allsalary',
                className: 'column-right',
                width: 120,
            }, {
                title: '日工资',
                dataIndex: 'salary',
                className: 'column-right',
                render: (text) => parseFloat(text) < 0 ? <span className="col_color_shu">{text}</span> :
                    <span className="col_color_ying">{text}</span>,
                width: 120,
            }, {
                title: '历史工资',
                dataIndex: 'buttons',
                width: 200,
                render: (text, record) => <span className="hover_a" onClick={() => this.onClickButton(record)}>详情</span>
            }
        ];
        let footer = '';
        if (table.sum != undefined) {
            footer = <ul className="tfoot_list clear">
                <li>合计</li>
                <li>{table.sum.total_sale == null ? '-' : table.sum.total_sale}</li>
                <li>{table.sum.total_effective_sale == null ? '-' : table.sum.total_effective_sale}</li>
                <li>-</li>
                <li>-</li>
                <li>{table.sum.total_salary == null ? '-' : table.sum.total_salary}</li>
            </ul>;
        }

        const columnsModal = [
            {
                title: '时间',
                dataIndex: 'gmt_sale',
                width: 275,
            }, {
                title: '日工资',
                dataIndex: 'salary',
                width: 275,
            }
        ];

        return (
            <div className="report">
                <div className="team_list_top">
                    <div className="t_l_time">
                        <ul className="t_l_time_row" onKeyDown={(e) => this.onKeyDown(e)}>
                            <li>
                                <span>用户名：</span>
                                <Input placeholder="请输入用户名" onChange={(e) => this.onUserName(e)}
                                       value={postData.username}/>
                            </li>
                            <li>
                                <span className="t_m_date_classify">查询日期：</span>
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    allowClear={false}
                                    defaultValue={moment(postData.starttime)}
                                    placeholder="请选择日期"
                                    onChange={(date, dateString) => {
                                        this.onChangeDate(date, dateString)
                                    }}
                                    disabledDate={(current) => disabledDate(current, -30, 0)}
                                />
                            </li>
                            <li>
                                <Button type="primary"
                                        icon="search"
                                        loading={this.state.searchLoading}
                                        onClick={() => this.onSearch()}
                                >
                                    搜索
                                </Button>
                            </li>
                            <li className="r_m_hint">
                                <p>提示：日工资数据可查询30天以内数据</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="t_l_table">
                    <div className="t_l_location_name">
                        <span className="left">当前位置：</span>
                        <Crumbs table={table} onChildState={this.onChildState.bind(this)}/>
                        <a className="t_l_goBack right" href="javascript:void(0)"
                           onClick={() => this.onClickGoBac_1()}> &lt;&lt;返回上一层 </a>
                    </div>
                    <div className="t_l_table_list">
                        <Table columns={columns}
                               rowKey={record => record.userid}
                               dataSource={table.dayRateList}
                               pagination={false}
                               loading={this.state.loading}
                               footer={table.total <= 0 ? null : () => footer}
                        />
                    </div>
                    <div className="t_l_page">
                        <Pagination style={{display: table.total < 1 ? 'none' : ''}}
                                    showSizeChanger
                                    onShowSizeChange={(current, pageSize) => this.onShowSizeChange(current, pageSize)}
                                    onChange={(pageNumber) => this.onChangePage(pageNumber)}
                                    defaultCurrent={1}
                                    total={table.total}
                                    pageSizeOptions={stateVar.pageSizeOptions.slice()}
                        />
                    </div>
                </div>
                <Modal
                    title="历史工资"
                    wrapClassName="vertical-center-modal"
                    visible={this.state.visible}
                    width={800}
                    bodyStyle={{height: 400}}
                    footer={null}
                    maskClosable={false}
                    onCancel={() => this.setState({visible: false})}
                    className="table_modal"
                >
                    <p className="modal_username">查询用户：{this.state.searchUserName}</p>
                    <div className="modal_table">
                        <Table columns={columnsModal}
                               rowKey={record => record.id}
                               dataSource={historyData.results}
                               pagination={false}
                               loading={this.state.loadingModal}
                               scroll={{y: 245}}
                        />
                        <ul className="historyTfoot_list clear">
                            <li>合计</li>
                            <li>{historyData.sum == undefined ? '-' : historyData.sum.total_salary}</li>
                        </ul>
                    </div>
                </Modal>
            </div>
        );
    }
}
