/*分红*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../../Utils';
import { Select, Table, Input, Button, Modal, InputNumber } from 'antd';
const Option = Select.Option;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;
import { stateVar } from '../../../State';

import Contract from '../../Common/Contract/Contract';

let key = 1;
@observer
export default class Dividend extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            divIdEndTotals: [], // 日期
            sum: {}, // 总计
            total: 0, //总条数

            loading: false,
            searchLoading: false,

            postData: {
                username: '',
                starttime: '0', //返回的divIdEndTotals列表里选一个Id
                p: 1,
                pn: 50,
            },

            historyVisible: false, //历史分红模态框
            historyData: [],
            historyDividendUName: '',
            historyAllsalary: '',
            loadingModal: false,
            history: {
                affects: 0, //条数
                historyAllsalary: '', //历史分红总计
            },
            oneKeyDividend: 0, // 是否可以一键发放分红

            alterVisible: false, //修改比例
            alterData: {},
            affirmLoading: false,
            disabled: true,
            contractInfo: [
                {
                    id:0,
                    contract:"日工资契约",
                },
                {
                    id:1,
                    contract:"分红契约",
                },
                {
                    id:2,
                    contract:"奖金组契约",
                },
                {
                    id:3,
                    contract:"配额契约",
                }
            ],
            contract_name: '修改契约', //按钮btn
            send_all_button: '',
        };
        this.onCancel = this.onCancel.bind(this);
        this.onDiviratio = this.onDiviratio.bind(this);
    };
    componentDidMount() {
        this._ismount = true;
        this.getData()
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    /*获取分红列表*/
    getData(){
        this.setState({ loading: true });
        let { postData } = this.state;
        Fetch.dividendsalary({
            method: 'POST',
            body: JSON.stringify(postData),
        }).then((res)=>{
            if(this._ismount){
                this.setState({ searchLoading: false, loading: false });
                if(res.status == 200){
                    let data = res.repsoneContent,
                        team = {},
                        resultsFlag = data.alldata.results,
                        sum = data.sum;
                    if(data.sum.userid != undefined){
                        team = {
                            userid: '-1',
                            id: '-1',
                            username: '团队数据',
                            sale_total: sum.sale_total,
                            gross_income: sum.gross_income,
                            daily_salary: sum.team_daily_salary,
                            lose_salary: sum.team_lose_salary,
                            dividend_radio: sum.dividend_radio,
                            allsalary: sum.allsalary,
                            buttons:'----',
                        };
                        resultsFlag.unshift(team);
                    }
                    let dividendtotalsFirst = {
                        id: '0',
                        growkey: data.begintime + '至' + data.endtime
                    };
                    data.dividendtotals.unshift(dividendtotalsFirst);
                    this.setState({
                        data: resultsFlag,
                        divIdEndTotals: data.dividendtotals,
                        sum: sum,
                        total: data.alldata.affects,
                        oneKeyDividend: data.send_status,
                        send_all_button: data.send_all_button
                    });

                }
            }
        })
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
    /*输入用户名*/
    onChangeUserName(e) {
        let postData = this.state.postData;
        postData.username = e.target.value;
        this.forceUpdate();
    };
    /*选择日期*/
    onChangeSelect(val) {
        let postData = this.state.postData;
        postData.starttime = val;
        this.forceUpdate();
    };

    /*关闭修改分红模态框*/
    onCancel(){
        this.setState({
            alterVisible: false,
            contract_name: '修改契约',
        });
        this.getData();
    };
    /*操作按钮*/
    onClickButton(val, username, record) {
        if(val == '历史分红'){
            this.setState({
                historyVisible: true,
                loadingModal: true,
            });
            Fetch.personalsalary({
                method:'POST',
                body:JSON.stringify({username: username})
            }).then((res)=>{
                if(this._ismount){
                    this.setState({loadingModal: false});
                    if(res.status == 200){
                        let data = res.repsoneContent,
                            history = this.state.history;
                        history.historyAllsalary = data.history.history_allsalary;
                        history.affects = data.alldata.affects;
                        this.setState({
                            historyDividendUName: username,
                            historyData: data.alldata.results,
                            history: history,
                        })
                    }
                }
            })
        }else if(val == '修改比例') {
            this.setState({
                alterData: record,
                alterVisible: true,
                disabled: true,
            });
        }else if(val == '发放分红') {
            let _this = this;
            confirm({
                title: val,
                content: <div>
                            <p>用户名：<span style={{fontWeight: 'bold'}}>{username}</span></p>
                            <p>分红比例：{record.dividend_radio}</p>
                            <p>本期分红：<span className={parseFloat(record.allsalary) < 0 ? 'col_color_shu' : 'col_color_ying'}>{record.allsalary}</span></p>
                        </div>,
                okText: '确认发放',
                okType: '取消',
                onOk() {
                    Fetch.sendDividendSalary({
                        method: 'POST',
                        body: JSON.stringify({userid: parseInt(record.userid), id: parseInt(record.id)})
                    }).then((res)=>{
                        if(_this._ismount){
                            if(res.status == 200){
                                Modal.success({
                                    title: res.shortMessage,
                                });
                                _this.getData();
                            }else{
                                Modal.warning({
                                    title: res.shortMessage,
                                });
                            }
                        }
                    })
                },
            });
        }else if(val == '一键发放分红'){
            let _this = this;
            confirm({
                title: val,
                content: <p>{_this.state.send_all_button.msg}</p>,
                okText: '确认发放',
                okType: '取消',
                onOk() {
                    Fetch.sendDividendSalary({
                        method: 'POST',
                        body: JSON.stringify({total_id: parseInt(_this.state.postData.starttime)})
                    }).then((res)=>{
                        if(_this._ismount){
                            if(res.status == 200){
                                Modal.success({
                                    title: res.shortMessage,
                                });
                                _this.getData();
                            }else{
                                Modal.warning({
                                    title: res.shortMessage,
                                });
                            }
                        }
                    })
                },
            });
        }else{}

    };
    /*修改分红比例*/
    onDiviratio(contract_name){
        let _this = this;
        confirm({
            title: '确认要修改吗?',
            onOk() {
                _this.setProtocol(contract_name)
            },
            onCancel() {},
        });
    };

    setProtocol(contract_name){
        this.setState({affirmLoading: true, contract_name: '签订契约'});
        let alterData = this.state.alterData;
        let postData = {
            userid: alterData.userid,
            id: alterData.id,
            dividend_radio: alterData.dividend_radio,
        };
        Fetch.diviratio({
            method: 'POST',
            body: JSON.stringify(postData)
        }).then((res)=>{
            if(this._ismount){
                this.setState({affirmLoading: false});
                if(res.status == 200){
                    Modal.success({
                        title: res.repsoneContent,
                    });
                    this.setState({alterVisible: false, disabled: true, contract_name: '修改契约',});
                    this.getData();
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*修改值*/
    onChangeAlterContract(val){
        let alterData = this.state.alterData;
        alterData.dividend_radio = val;
        this.forceUpdate();
    }

    render() {
        const columns = [
             {
                title: '用户名',
                dataIndex: 'username',
                 render: (text)=>{
                    if(text == '团队数据'){
                        return {
                            children: text,
                            props: {
                                colSpan: 2,
                            },
                        }
                    }else{
                        return text;
                    }
                 },
                width: 90,
            }, {
                title: '所属组',
                dataIndex: 'usergroup_name',
                className: 'column-right',
                render:(text, record)=>{
                    if(record.username == '团队数据'){
                        return{
                            props: {
                                colSpan: 0,
                            }
                        }
                    } else {
                        return text
                    }
                },
                width: 70,
            },
            {
                title: '有效投注量',
                dataIndex: 'sale_total',
                className: 'column-right',
                width: 90,
            },
            {
                title: '盈亏总额',
                dataIndex: 'gross_income',
                className: 'column-right',
                width: 110,
            }, {
                title: '日工资总额',
                dataIndex: 'daily_salary',
                className: 'column-right',
                width: 100,
            }, {
                title: '日亏损总额',
                dataIndex: 'lose_salary',
                className: 'column-right',
                width: 100,
            }, {
                title: '分红比例',
                dataIndex: 'dividend_radio',
                className: 'column-right',
                render: (text)=>parseFloat(text) < 0 ? <span className="col_color_shu">{text}%</span> :
                                                        <span className="col_color_ying">{text}%</span>,
                width: 90,
            }, {
                title: '分红',
                dataIndex: 'allsalary',
                className: 'column-right',
                render: (text)=>parseFloat(text) < 0 ? <span className="col_color_shu">{text}</span> :
                                                        <span className="col_color_ying">{text}</span>,
                width: 90,
            },
            {
                title: '操作',
                dataIndex: 'buttons',
                width: 260,
                render: (text, record) => {
                    if(record.username == '团队数据'){
                        return text
                    } else {
                        return (
                            <ButtonGroup>
                                {
                                    text.map((item,i)=>{
                                        return <Button key={i} onClick={()=>this.onClickButton(item.text, record.username, record)}>{item.text}</Button>
                                    })
                                }
                            </ButtonGroup>
                        )
                    }
                },
            }
            ];
        const columnsModal = [
                {
                    title: '时间',
                    dataIndex: 'growkey',
                    width: 372,
                }, {
                    title: '分红',
                    dataIndex: 'allsalary',
                    width: 372,
                }
            ];
        const { postData, sum, divIdEndTotals, total, oneKeyDividend, data, disabled } = this.state;
        const footer = <ul className="dividend_footer clear">
                            <li>个人结余</li>
                            <li>{sum.sale}</li>
                            <li>{sum.self_gross_income}</li>
                            <li>{sum.daily_salary}</li>
                            <li>{sum.lose_salary}</li>
                            <li className={parseFloat(sum.dividend_radio) < 0 ? 'col_color_shu' : 'col_color_ying'}>{sum.dividend_radio}%</li>
                            <li className={parseFloat(sum.self_allsalary) < 0 ? 'col_color_shu' : 'col_color_ying'}>{sum.self_allsalary}</li>
                            <li>
                                {
                                    oneKeyDividend == 0 ?
                                        <Button onClick={()=>this.onClickButton('历史分红', stateVar.userInfo.userName)}>历史分红</Button> :
                                        <ButtonGroup>
                                            <Button onClick={()=>this.onClickButton('历史分红', stateVar.userInfo.userName)}>历史分红</Button>
                                            <Button onClick={()=>this.onClickButton('一键发放分红', stateVar.userInfo.userName)}>一键发放分红</Button>
                                        </ButtonGroup>
                                }
                            </li>
                        </ul>;
        return (
            <div className="report">
                <div className="team_list_top">
                    <div className="t_l_time">
                        <ul className="t_l_time_row">
                            <li>
                                <span>用户名：</span>
                                <Input placeholder="请输入用户名" value={postData.username} onChange={(e)=>this.onChangeUserName(e)}/>
                            </li>
                            <li>
                                <span>日期：</span>
                                <Select value={postData.starttime} style={{ width: 180 }} onChange={(value)=>this.onChangeSelect(value)}>
                                    {
                                        divIdEndTotals.map((item)=>{
                                            return <Option value={item.id} key={item.id}>{item.growkey}</Option>
                                        })
                                    }
                                </Select>
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
                                <p>提示：分红资数据保留为有效时间最近30天数据</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="t_l_table">
                    <div className="t_l_location_name">
                    </div>
                    <div className="t_l_table_list dividend_table">
                        <Table columns={columns}
                               rowKey={record => record.id || record.userid}
                               dataSource={data}
                               pagination={false}
                               loading={this.state.loading}
                               footer={total <= 0 || isNaN(total) || sum.sale == undefined ? null : ()=>footer}
                               className="table_list"
                        />
                    </div>
                    <Modal
                        title="历史分红"
                        visible={this.state.historyVisible}
                        width={800}
                        bodyStyle={{height: 400}}
                        footer={null}
                        maskClosable={false}
                        onCancel={()=>this.setState({historyVisible: false})}
                        className="table_modal"
                    >
                        <p className="modal_username">查询用户名：{this.state.historyDividendUName}</p>
                        <div className="modal_table">
                            <Table columns={columnsModal}
                                   rowKey={record => record.id != undefined ? record.id : key++ }
                                   dataSource={this.state.historyData}
                                   pagination={false}
                                   loading={this.state.loadingModal}
                                   scroll={{y: 220}}
                            />
                            <ul className="dividend_modal_Footer clear" style={{display: this.state.history.affects <= 0 ? 'none' : ''}}>
                                <li>总计</li>
                                <li>{this.state.history.historyAllsalary}</li>
                            </ul>
                        </div>
                    </Modal>
                    <Contract
                        title="分红契约"
                        userid={this.state.alterData.userid}
                        textDescribe={
                            <div className="a_c_text">
                                <p>契约内容：</p>
                                <div style={{whiteSpace: 'normal'}}>
                                    如该用户每半月结算净盈亏总值时为负数，可获得分红，金额为亏损值的
                                    <InputNumber min={0} value={this.state.alterData.dividend_radio}
                                                 onChange={(value)=>this.onChangeAlterContract(value)}
                                                 // disabled={disabled}
                                    />
                                    %。
                                </div>
                            </div>
                        }
                        alterData={this.state.alterData}
                        alterVisible={this.state.alterVisible}
                        affirmLoading={this.state.affirmLoading}
                        disabled={this.state.disabled}
                        contract_name={this.state.contract_name}
                        userList={this.state.data}
                        contractInfo={this.state.contractInfo}
                        disabledSelect={true}
                        onCancel={this.onCancel}
                        onAffirm={this.onDiviratio}
                    />
                </div>
            </div>
        );
    }
}
