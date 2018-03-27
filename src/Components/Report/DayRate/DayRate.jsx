/*日工资*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../../Utils';
import { DatePicker, Table, Pagination, Input, Button, Icon, Modal, InputNumber, Popconfirm } from 'antd';
import moment from 'moment';
const confirm = Modal.confirm;
const ButtonGroup = Button.Group;
import { stateVar } from '../../../State';
import { setDateTime, disabledDate } from '../../../CommonJs/common';
import Crumbs from '../../Common/Crumbs/Crumbs';
import Contract from '../../Common/Contract/Contract';

@observer
export default class DayRate extends Component {
    constructor(props){
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

            alterVisible: false, //修改比例
            alterData: {},
            affirmLoading: false,
            disabled: true,
            contentArr: [], // 日工资契约协议
            salary_ratio: [], //修改协议
            contract_name: '修改契约', //按钮btn
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
            protocol: [],// 自身协议
            hideBtn: false,
        };
        this.onCancel = this.onCancel.bind(this);
        this.onDiviratio = this.onDiviratio.bind(this);
        this.onConsent = this.onConsent.bind(this);
    };
    componentDidMount() {
        this._ismount = true;
        this.getData();
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    /*获取日工资列表*/
    getData() {
        this.setState({ loading: true });
        Fetch.dailysalary({
            method: "POST",
            body: JSON.stringify(this.state.postData)
        }).then((res)=>{
            if(this._ismount){
                this.setState({
                    loading: false,
                    searchLoading: false
                });
                let table = this.state.table;
                if(res.status == 200){
                    let data = res.repsoneContent,
                        userName = stateVar.userInfo.userName;
                    // for(let i = 0, results = data.results; i < results.length; i++){
                    //     if(userName == results[i].username){
                    //         results[i].buttons[1].text = '自身协议';
                    //         break;
                    //     }
                    // }
                    table.dayRateList = data.results;
                    table.sum = data.sum;
                    table.total = parseInt(data.affects);
                    this.setState({table: table});
                } else {
                    table.dayRateList = [];
                    table.sum = [];
                    table.total = 0;
                    this.setState({table: table});
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
        postData.username = e.target.value;
        this.setState({postData: postData})
    };
    /*搜索*/
    onSearch() {
        this.setState({ searchLoading: true });
        this.getData();
    };
    /*切换每页显示条数*/
    onShowSizeChange (current, pageSize) {
        let postData = this.state.postData;
        postData.p = current;
        postData.pn = pageSize;
        this.setState({postData: postData},()=>this.getData());
    };
    /*面包屑组件调用*/
    onChildState(item, table) {
        let postData = this.state.postData;
        postData.username = item.name;
        this.setState({
            postData: postData,
            table: table,
        }, ()=>this.getData())
    };
    /*同意协议*/
    onConsent(){
        let { alterData } = this.state;
        this.setState({affirmLoading: true});
        Fetch.dailysalaryself({
            method: 'POST',
            body: JSON.stringify({status: 1, userid: alterData.userid})
        }).then((res)=>{
            if(this._ismount){
                this.setState({affirmLoading: false});
                if(res.status == 200){
                    Modal.success({
                        title: res.shortMessage,
                    });
                    this.setState({alterVisible: false});
                    this.getData();
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    }
    /*点击用户名*/
    onClickUserName(name) {
        let table = this.state.table,
            historyArr = this.state.table.history,
            postData = this.state.postData,
            historyFlag = true;
        postData.username = name;
        this.setState({postData: postData, table: table}, ()=> {
            let history = {
                name: postData.username,
                date: postData.starttime,
            };
            for(let i = 0; i < historyArr.length; i++) {
                if(historyArr[i].name === history.name && historyArr[i].date === history.date) {
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
        if(table.history.length === 1){
            return
        }
        table.history.splice(-1, 1);
        postData.username = table.history[table.history.length-1].name;
            this.setState({
                postData: postData,
                table: table,
        }, ()=>this.getData())
    };
    /*操作按钮*/
    onClickButton(type, record) {
        if(type == '历史工资'){
            this.setState({
                visible: true,
                searchUserName: record.username,
                loadingModal: true,
            });
            Fetch.salarypersonalsalary({
                method: 'POST',
                body: JSON.stringify({username: record.username, begintime: '', eatime: record.gmt_sale})
            }).then((res)=>{
                if(this._ismount){
                    this.setState({loadingModal: false});
                    let abg = {
                        results: []
                    };
                    if(res.status == 200){
                        this.setState({historyData: res.repsoneContent.list});
                    }
                }
            })
        }else if(type == '修改协议' || type == '已签订过' || type == '等待同意' || type == '自身协议' || type == '同意协议' || type == '查看协议'){
            if(type == '查看协议'){
                this.setState({hideBtn: true})
            }
            this.setState({
                alterData: record,
                alterVisible: true,
                disabled: true
            });
            let postDataSelf = {
                userid: record.userid,
                parentid: record.parent_id,
                id: record.id,
                gmt_sale: record.gmt_sale,
            };
            Fetch.dailysalaryself({
                method: 'POST',
                body: JSON.stringify(postDataSelf)
            }).then((res)=>{
                if(this._ismount && res.status == 200){
                    let data = res.repsoneContent;
                    let prosFlag = [];
                    if(data.pros.length > 1){
                        prosFlag = res.repsoneContent.pros[1]
                    }else{
                        prosFlag = res.repsoneContent.pros[0]
                    }
                    this.setState({
                        contentArr: prosFlag,
                        salary_ratio: prosFlag,
                    })
                }
            });
            Fetch.dailysalaryself({
                method: 'POST',
                body: JSON.stringify({userid: stateVar.userInfo.userId})
            }).then((res)=>{
                if(this._ismount && res.status == 200){
                    this.setState({protocol: res.repsoneContent.pros[0]})
                }
            })
        }else{}
    };
    /*修改值*/
    onChangeAlterContract(val, item){
        item.salary_ratio = val;
        let salary_ratioFlag = this.state.contentArr;
        salary_ratioFlag.forEach((data)=>{
            if(data.sale == item.sale){
                data.salary_ratio = val == '' ? 0 : val
            }
        });
        this.setState({salary_ratio: salary_ratioFlag});
    };
    /*修改活跃人数*/
    onChangeActiveNumber(val, item, index){
        let value = val;
        if(!value){
            value = 0;
        }
        item.active_member = value;
        let { contentArr } = this.state;
        contentArr[index].active_member = ''+value;
        this.setState({salary_ratio: contentArr});
    };
    /*修改日销量*/
    onChangeDailySales(val, item, index){
        item.sale = val;
        let { contentArr } = this.state;
        contentArr[index].sale = ''+val;
        this.setState({salary_ratio: contentArr});
    };
    /*日销量排序从小到大*/
    compare(property){
        return function(a,b){
            let value1 = a[property];
            let value2 = b[property];
            return value1 - value2;
        }
    }
    /*日销量失去焦点事件*/
    onBlurSale(){
        let { contentArr } = this.state;
        let contentArrFlag = contentArr.sort(this.compare('sale'));
        for(let i=0;i<contentArr.length;i++){
            if (contentArrFlag[i+1] != undefined && contentArrFlag[i].sale == contentArrFlag[i+1].sale){
                Modal.warning({
                    title: '不同档位日销量不能相同，请重新输入！',
                });
                contentArrFlag[i].sale = '0'
            }
        }
        this.setState({contentArr: contentArrFlag})
    };
    /*删除档位*/
    onDelete(i){
        let { contentArr } = this.state;
        if(contentArr.length <= 3){
            Modal.warning({
                title: '日工资契约最低保留三个挡位',
            });
            return
        }
        let contentArrFlag = contentArr.filter((item, index)=> index != i);
        this.setState({
            contentArr: contentArrFlag,
            salary_ratio: contentArrFlag
        })
    };
    /*添加档位*/
    onAddSale(){
        let { contentArr, protocol } = this.state;
        let contentObj = protocol[contentArr.length];
        contentArr.push(contentObj);
        this.setState({contentArr});
    };
    /*修改协议*/
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
            parentid: alterData.parent_id,
            gmt_sale: alterData.gmt_sale,
            salary_ratio: this.state.salary_ratio,
        };
        Fetch.dailysalaryupdate({
            method: 'POST',
            body: JSON.stringify(postData)
        }).then((res)=>{
            if(this._ismount){
                this.setState({affirmLoading: false});
                if(res.status == 200){
                    Modal.success({
                        title: res.repsoneContent,
                    });
                    this.setState({alterVisible: false, disabled: true, contract_name: '修改契约'});
                    this.getData();
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*关闭修改日工资模态框*/
    onCancel(){
        this.setState({alterVisible: false, contract_name: '修改契约'});
    };
    /*某页*/
    onChangePage(page){
        let postData = this.state.postData;
        postData.p = page;
        this.setState({postData: postData},()=>this.getData());
    };
    render() {
        const { postData, table, historyData, disabled, contentArr } = this.state;
        const columns = [
            {
                title: '用户名',
                dataIndex: 'username',
                render: (text, record, index) => index == 0 ? text : <a href="javascript:void(0)" onClick={()=>this.onClickUserName(text)} style={{color: '#0088DE'}}>{text}</a>,
                width: 110,
                filterIcon: <Icon type="smile-o" style={{ color: 'red' }} />,
            }, {
                title: '所属组',
                dataIndex: 'usergroup_name',
                width: 90,
            }, {
                title: '投注量',
                dataIndex: 'sale',
                className: 'column-right',
                width: 120,
            }, {
                title: '有效投注量',
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
                render: (text)=>parseFloat(text) < 0 ? <span className="col_color_shu">{text}</span> :
                                                        <span className="col_color_ying">{text}</span>,
                width: 120,
            }, {
                title: '操作',
                dataIndex: 'buttons',
                width: 200,
                render: (text, record) => (
                    <ButtonGroup>
                        {
                            text.map((item, index)=>{
                                return <Button key={index} onClick={()=>this.onClickButton(item.text, record)}>{item.text}</Button>
                            })
                        }
                    </ButtonGroup>
                ),
            }
        ];
        let footer = '';
        if(table.sum != undefined){
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
                        <ul className="t_l_time_row">
                            <li>
                                <span>用户名：</span>
                                <Input placeholder="请输入用户名" onChange={(e)=>this.onUserName(e)} value={postData.username}/>
                            </li>
                            <li>
                                <span className="t_m_date_classify">查询日期：</span>
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    allowClear={false}
                                    defaultValue={moment(setDateTime(0))}
                                    placeholder="请选择日期"
                                    onChange={(date, dateString)=>{this.onChangeDate(date, dateString)}}
                                    disabledDate={(current)=>disabledDate(current, -30, 0)}
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
                                <p>提示：日工资数据保留为有效时间最近30天数据</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="t_l_table">
                    <div className="t_l_location_name">
                        <span className="left">当前位置：</span>
                        <Crumbs table={table} onChildState={this.onChildState.bind(this)}/>
                        <a className="t_l_goBack right" href="javascript:void(0)" onClick={()=>this.onClickGoBac_1()}> &lt;&lt;返回上一层 </a>
                    </div>
                    <div className="t_l_table_list">
                        <Table columns={columns}
                               rowKey={record => record.userid}
                               dataSource={table.dayRateList}
                               pagination={false}
                               loading={this.state.loading}
                               footer={table.total <= 0 ? null : ()=>footer}
                        />
                    </div>
                    <div className="t_l_page">
                        <Pagination  style={{display: table.total < 1 ? 'none' : ''}}
                                    showSizeChanger
                                    onShowSizeChange={(current, pageSize)=>this.onShowSizeChange(current, pageSize)}
                                    onChange={(pageNumber)=>this.onChangePage(pageNumber)}
                                    defaultCurrent={1}
                                    total={table.total}
                                    pageSizeOptions={stateVar.pageSizeOptions.slice()}
                        />
                    </div>
                </div>
                <Modal
                    title="历史工资"
                    visible={this.state.visible}
                    width={800}
                    bodyStyle={{height: 400}}
                    footer={null}
                    maskClosable={false}
                    onCancel={()=>this.setState({visible: false})}
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
                <Contract
                    title="日工资契约"
                    userid={this.state.alterData.userid}
                    textDescribe={
                        <div className="a_c_text a_c_text_sale">
                            <p>契约内容：</p>
                            <div>
                                <ul className="text_content_list">
                                    {
                                        contentArr.map((item, i)=>{
                                            return (
                                                <li key={i}>
                                                    {i+1}档：
                                                    日销量≥
                                                    <span style={{width: 58, display: 'inline-block'}}>{item.sale}</span>
                                                    {/*<InputNumber min={0} value={item.sale}*/}
                                                                 {/*onChange={(value)=>this.onChangeDailySales(value, item, i)}*/}
                                                                 {/*onBlur={()=>this.onBlurSale()}*/}
                                                                 {/*disabled={disabled}*/}
                                                    {/*/>*/}
                                                    元，
                                                    且活跃用户≥
                                                    <InputNumber min={0} value={item.active_member}
                                                                 onChange={(value)=>this.onChangeActiveNumber(value, item, i)}
                                                                 // disabled={disabled}
                                                    />
                                                    人，日工资比例为
                                                    <InputNumber min={0} value={item.salary_ratio}
                                                                 onChange={(value)=>this.onChangeAlterContract(value, item)}
                                                                 // disabled={disabled}
                                                    />
                                                    %。
                                                    {
                                                        contentArr.length-1 == i ?
                                                            <Popconfirm title="确定删除吗?"
                                                                        onConfirm={() => this.onDelete(i)}
                                                            >
                                                                <span className="hover col_color_ying delete_sale">删除</span>
                                                            </Popconfirm> :
                                                            null
                                                    }
                                                </li>
                                            )
                                        })
                                    }
                                    <li className="brisk_user" key="0">当日投注金额≥1000元，计为一个活跃用户</li>
                                    <li className="brisk_user" key="00">
                                        下级日工资各档位日销量要求需与自身保持一致，删除档位时遵循从高到底的原则，但至少保留三档。
                                    </li>
                                </ul>
                                <span className="hover col_color_ying add_sale"
                                      onClick={()=>this.onAddSale()}
                                      style={{display: contentArr.length >= 6 ? 'none' : ''}}>
                                    添加档位
                                </span>
                            </div>
                        </div>
                    }
                    alterData={this.state.alterData}
                    alterVisible={this.state.alterVisible}
                    affirmLoading={this.state.affirmLoading}
                    // disabled={this.state.disabled}
                    contract_name={this.state.contract_name}
                    userList={table.dayRateList}
                    contractInfo={this.state.contractInfo}
                    disabledSelect={true}
                    onCancel={this.onCancel}
                    onAffirm={this.onDiviratio}
                    onConsent={this.onConsent}
                    hideBtn={this.state.hideBtn}
                />
            </div>
        );
    }
}
