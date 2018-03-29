/*团队列表*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { hashHistory } from 'react-router';
import { DatePicker, Table, Input, Button, Pagination, Modal, InputNumber, Slider, Icon, Badge, Popconfirm, Popover, Spin } from 'antd';
const confirm = Modal.confirm;
import Fetch from '../../../Utils';
import Crumbs from '../../Common/Crumbs/Crumbs'
import { stateVar } from '../../../State';
import Contract from '../../Common/Contract/Contract';
import { changeMoneyToChinese, onValidate } from '../../../CommonJs/common';
import md5 from 'md5';

import './TeamList.scss';

let typeContent = '';
@observer
export default class TeamList extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            tableData: {
                dataSource: [],
                total: 0, // 数据条数
                accnumall: 0, //团队总人数
                history: [
                    {
                        name: stateVar.userInfo.userName,
                    }
                ]
            },
            selectInfo: {
                username: '', //用户id
                register_time_begin: '', //开始时间
                register_time_end: '', //结束时间
                p: 1, //页数
                pn: 10, //每页条数
                uid: '', //点击用户名传入的用户id
                sortby: null, // sortby: 字段名 asc(升序) desc(降序)
            },
            alterVisible: false, //修改比例
            alterData: {},
            affirmLoading: false,
            disabled: true,
            typeName: '', // 要修改类型的名字：日工资，分红，配额，奖金组
            contentArr: [],
            prizeGroupList: [], //可设置的奖金组列表
            prizeGroupFlag: 0, // 需要修改的奖金组

            salary_ratio: [], //修改协议

            agPost: {// 配额请求参数
                flag: 'post', //修改配额的时候必须传这个值
                accgroup: [], //返回的奖金组agid
                accnum: [], // 与accgroup顺序一致, 增加的配额个数
                uid: null, //要修改的用户id
            },
            diviPost:{// 分红请求参数
                userid: null,
                dividend_radio: null, // 要修改的比例
            },
            prizeGroupPost: {}, // 奖金组请求参数
            contract_name: '修改契约', //按钮btn
            quotaVisible: false, //配额
            quotaList: [], //配额列表
            quotaPost:{}, //申请配额请求参数
            quotaLoding: false,
            num: 0, //配额申请成功数
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
            protocol: [],//自身协议
            rechargeVisible: false,
            validate: {
                money: 2, // 0: 对， 1：错
                fundPassword: 2
            },
            postDataRecharge: {// 充值
                money: '',
                fundPassword: ''
            },
            recharge: {
                balance: 0,
                recharge_max: 0,
                recharge_min: 0,
                username: '',
                userid: '',
            },
            rechargeLoading: false,
            self: {},
            teamMoney: 0,
            popoverLoading: false,
        };
        this.onCancel = this.onCancel.bind(this);
        this.onDiviratio = this.onDiviratio.bind(this);
    };
    componentDidMount() {
        this._ismount = true;
        this.getData();
        this.getNum();
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    getNum(){
        Fetch.quota({
            method: 'POST',
            body: JSON.stringify({flag: 'list'})
        }).then((res)=>{
            if(this._ismount && res.status == 200){
                this.setState({num: res.repsoneContent.num})
            }
        })
    };
    handleTableChange = (pagination, filters, sorter) => {
        let selectInfo = this.state.selectInfo;
        if(sorter.columnKey == undefined){
            selectInfo.sortby = null;
            this.setState({selectInfo: selectInfo});
        } else {
            if(sorter.order == 'descend') {
                selectInfo.sortby = sorter.columnKey + ' ' + 'desc';
            }else{
                selectInfo.sortby = sorter.columnKey + ' ' + 'asc';
            }
            this.setState({selectInfo: selectInfo},()=>this.getData());
        }
    };
    /*获取团队列表*/
    getData(type, record) {
        let selectInfo = this.state.selectInfo;
        this.setState({loading: true});
        if(selectInfo.username == stateVar.userInfo.userName) {
            selectInfo.username = '';
            selectInfo.uid = '';
        }
        if(type === 'clickName'){
            let selectInfo = this.state.selectInfo;
            selectInfo.uid = record.userid;
            selectInfo.username = null;
        }
        Fetch.usreList({
            method: "POST",
            body: JSON.stringify(selectInfo)
        }).then((res)=>{
            if(this._ismount) {
                this.setState({loading: false});
                if(res.status == 200){
                    let resData = res.repsoneContent,
                        tableData = this.state.tableData,
                        historyFlag = true,
                        history = tableData.history;
                    if(type === 'clickName'){
                        for(let i = 0; i < history.length; i++) {
                            if(history[i].name === record.username) {
                                historyFlag = false;
                                break;
                            }
                        }
                        if (historyFlag) {
                            history.push({name: record.username, uid: record.userid});
                        }
                    }
                    tableData.dataSource = resData.results;
                    tableData.accnumall = parseInt(resData.self.team_count);
                    tableData.total = parseInt(resData.affects);
                    this.setState({
                        tableData: tableData,
                        self: resData.self
                    });
                }
            }
        })
    };
    /*input用户名*/
    onChangeUserName(e) {
        let selectInfo = this.state.selectInfo;
        selectInfo.username =e.target.value;
        this.setState({selectInfo: selectInfo})
    }
    /*注册开始时间*/
    onRegisterTimeStart(date, dateString) {
        let selectInfo = this.state.selectInfo;
        selectInfo.register_time_begin = dateString;
        this.setState({selectInfo: selectInfo});
    };
    /*注册结束时间*/
    onRegisterTimeEnd(date, dateString) {
        let selectInfo = this.state.selectInfo;
        selectInfo.register_time_end = dateString;
        this.setState({selectInfo: selectInfo});
    };
    /*切换每页显示条数*/
    onShowSizeChange (current, pageSize) {
        let selectInfo = this.state.selectInfo;
        selectInfo.p = current;
        selectInfo.pn = pageSize;
        this.setState({selectInfo}, ()=>this.getData())
    };
    /*切换页面时*/
    onChangePagination(page) {
        let selectInfo = this.state.selectInfo;
        selectInfo.p = page;
        this.setState({selectInfo},()=>this.getData());
    };
    /*面包屑组件调用*/
    onChildState(item, i) {
        let selectInfo = this.state.selectInfo;
        selectInfo.uid = item.uid;
        this.setState({
            selectInfo: selectInfo
        }, ()=>this.getData())
    };
    /*修改契约*/
    onClickColBtn(type, record) {
        if(record.useraccgroup_status == 3){//新申请
            this.setState({
                quotaVisible: true,
                alterData: record,
            });
            this.getAccGroupList(record);
        }else{
            this.setState({
                alterData: record,
                disabled: true,
            });
            if(type == '配额'){
                this.setState({alterVisible: true});
                this.getAccGroupList(record);
            }else if(type == '日工资'){
                let postDataSelf = {
                    userid: record.userid,
                    parentid: record.parentid,
                };
                Fetch.dailysalaryself({
                    method: 'POST',
                    body: JSON.stringify(postDataSelf)
                }).then((res)=>{
                    if(this._ismount){
                        if(res.status == 200){
                            let pros = res.repsoneContent.pros;
                            this.setState({
                                typeName: '日工资契约',
                                contentArr: pros[pros.length - 1],
                                alterVisible: true,
                                salary_ratio: pros[pros.length - 1],
                            })
                        }else{
                            Modal.warning({
                                title: res.shortMessage,
                            });
                        }
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
            }else if(type == '分红'){
                let { diviPost } = this.state;
                diviPost.dividend_radio = record.dividend_radio;
                this.setState({
                    typeName: '分红契约',
                    alterVisible: true,
                    diviPost,
                })
            }else{
                //获取可设置的奖金组列表
                Fetch.awardTeam({
                    method: 'POST',
                    body: JSON.stringify({uid: record.userid})
                }).then((res)=>{
                    if(this._ismount){
                        if(res.status == 200){
                            let { prizeGroupPost } = this.state,
                                data = res.repsoneContent;
                            prizeGroupPost.uid = data.uid;
                            prizeGroupPost.flag = 'rapid';
                            prizeGroupPost.selfPoint = data.selfPoint;
                            this.setState({
                                typeName: '奖金组契约',
                                prizeGroupList: data.list,
                                prizeGroupPost,
                                prizeGroupFlag: record.prize_group,
                                alterVisible: true,
                            })
                        }else{
                            Modal.warning({
                                title: res.shortMessage,
                                content: '新注册的用户10分钟后才能修改奖金组，请稍后再试！'
                            });
                        }
                    }
                })
            }
        }
    };
    /*游戏记录*/
    onSelectGameRecord(record) {
        hashHistory.push({
                pathname: '/gameRecord/lotteryBet',
                query: {
                    name: record.username
                }
        });
        stateVar.navIndex = 'gameRecord';
    };
    /*修改日工资比例*/
    onChangeAlterContract(val, item){
        item.salary_ratio = val;
        let salary_ratioFlag = this.state.contentArr;
        salary_ratioFlag.forEach((data, i)=>{
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
    /*提交协议*/
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
        let { typeName, alterData } = this.state;
        this.setState({affirmLoading: true, contract_name: '签订契约'});
        if(typeName == '配额契约'){
            this.setState({quotaLoding: true});
            let { agPost } = this.state;
            if(contract_name == '新申请'){
                agPost.SH = 1;
            }else{
                agPost.SH != undefined && delete agPost.SH;
            }
            agPost.uid = alterData.userid;
            Fetch.quota({
                method: 'POST',
                body: JSON.stringify(agPost)
            }).then((res)=>{
                if(this._ismount){
                    this.setState({affirmLoading: false, quotaLoding: false});
                    if(res.status == 200){
                        Modal.success({
                            title: res.repsoneContent,
                        });
                        if(contract_name == '新申请'){
                            this.setState({quotaVisible: false});
                            this.getNum();
                        }else{
                            this.setState({alterVisible: false, disabled: true, contract_name: '修改契约'});
                        }
                        this.getAccGroupList(alterData);
                        this.getData();
                    }else{
                        Modal.warning({
                            title: res.shortMessage,
                        });
                    }
                }
            })
        }else if(typeName == '分红契约'){
            let diviPost = this.state.diviPost;
            diviPost.userid = alterData.userid;
            Fetch.diviratio({
                method: 'POST',
                body: JSON.stringify(diviPost)
            }).then((res)=>{
                if(this._ismount) {
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
        }else if(typeName == '日工资契约'){
            let postData = {
                userid: alterData.userid,
                parentid: this.state.self.userid,
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
        }else if(typeName == '奖金组契约'){
            let { prizeGroupFlag, prizeGroupPost, prizeGroupList } = this.state;
            let selectPrizeGroup = prizeGroupList.filter((item, index) => item.prizeGroup == prizeGroupFlag)[0];
            prizeGroupPost.groupLevel = prizeGroupFlag;
            debugger
            prizeGroupPost.keeppoint = ((prizeGroupPost.selfPoint - selectPrizeGroup.high) * 100).toFixed(2);
            Fetch.awardTeam({
                method: 'POST',
                body: JSON.stringify(prizeGroupPost)
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
        }
    };
    /*关闭模态框*/
    onCancel(){
        this.setState({contract_name: '修改契约', alterVisible: false, affirmLoading: false})
    };
    /*奖金组设置 滑动条*/
    onRegisterSetBonus(value) {
        this.setState({prizeGroupFlag: value});
    };
    /*奖金组*/
    onMinus() {
        let { prizeGroupFlag, prizeGroupList } = this.state;
        if( prizeGroupFlag <= prizeGroupList[0].prizeGroup){
            return
        }
        this.setState({prizeGroupFlag: this.state.prizeGroupFlag - 2});
    };
    onAdd(){
        let { prizeGroupFlag, prizeGroupList } = this.state;
        if(prizeGroupFlag >= prizeGroupList[prizeGroupList.length - 1].prizeGroup){
            return
        }
        this.setState({prizeGroupFlag: this.state.prizeGroupFlag + 2});
    };
    /*设置配额契约*/
    onChangeAccGroup(value, item){
        let { agPost } = this.state,
            accgroup = agPost.accgroup;
        for(let i = 0; i < accgroup.length; i++){
            if(accgroup[i] == item.agid){
                agPost.accnum[i] = value;
                break;
            }
        }
        this.setState({agPost});
    };
    /*获取对应用户配额列表*/
    getAccGroupList(record){
        Fetch.quota({
            method: 'POST',
            body: JSON.stringify({uid: record.userid})
        }).then((res)=>{
            if(this._ismount && res.status == 200){
                let aAllUserTypeAccNum = res.repsoneContent.aAllUserTypeAccNum,
                    { agPost } = this.state;
                agPost.accgroup = [];
                agPost.accnum = [];
                aAllUserTypeAccNum.forEach((item)=>{
                    agPost.accgroup.push(item.agid);
                    if(item.quotanum != undefined){
                        agPost.accnum.push(item.quotanum);
                    }else{
                        agPost.accnum.push(0);
                    }
                });
                this.setState({
                    typeName: '配额契约',
                    contentArr: aAllUserTypeAccNum,
                })
            }
        })
    };
    onCancelQuota(){
        this.setState({quotaVisible: false, quotaPost: {}});
        this.getData();
        this.getNum();
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
    /*选择充值*/
    onRecharge(record){
        Fetch.transfer({
            method: 'POST',
            body: JSON.stringify({
                toUserid: record.userid,
                type: 'TransferInfo'
            })
        }).then((res)=>{
            if(this._ismount && res.status == 200){
                let {recharge} = this.state,
                    data = res.repsoneContent;
                recharge.userid = record.userid;
                recharge.username = data.username;
                recharge.recharge_max = data.recharge_max;
                recharge.recharge_min = data.recharge_min;
                recharge.balance = data.balance;
                this.setState({
                    recharge,
                    rechargeVisible: true
                })
            }else{
                Modal.warning({
                    title: res.shortMessage,
                });
            }
        })

    };
    onCancelRecharge() {
        let {validate, postDataRecharge} = this.state;
        validate.money = 2;
        validate.fundPassword = 2;
        postDataRecharge.money = '';
        postDataRecharge.fundPassword = '';
        this.setState({
            rechargeVisible: false,
            validate,
            postDataRecharge,
            rechargeLoading: false,
        })
    }
    // 充值金额
    onRechargeAmount(value) {
        let {validate, postDataRecharge, recharge} = this.state;
        let reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
        let r = reg.test(value);
        if(!r || value < recharge.recharge_min || value > recharge.recharge_max){
            validate.money = 1;
        }else{
            validate.money = 0;
        }
        postDataRecharge.money = value;
        this.setState({postDataRecharge, validate});

    };
    /*立即充值*/
    onConfirm() {
        let {validate, postDataRecharge, recharge} = this.state;
        if(validate.money == 0 && validate.fundPassword == 0){
            this.setState({rechargeLoading: true});
            Fetch.transfer({
                method: 'POST',
                body: JSON.stringify({
                    toUserid: recharge.userid,
                    type: 'goTransfer',
                    money: postDataRecharge.money,
                    secpass: md5(postDataRecharge.fundPassword)
                })
            }).then((res)=>{
                if(this._ismount){
                    if(res.status == 200){
                        Modal.success({
                            title: res.shortMessage,
                        });
                        this.onCancelRecharge();
                    }else{
                        this.setState({rechargeLoading: false});
                        Modal.warning({
                            title: res.shortMessage,
                        });
                    }
                }
            })
        }else{
            if(validate.money == 2){
                validate.money = 1
            }
            if(validate.fundPassword == 2){
                validate.fundPassword = 1
            }
            this.setState({validate})
        }
    };
    onFundPassword(e){
        let {validate, postDataRecharge} = this.state,
            val = e.target.value;
        if(val == ''){
            validate.fundPassword = 1
        }else{
            validate.fundPassword = 0
        }
        postDataRecharge.fundPassword = val;
        this.setState({postDataRecharge, validate});
    };
    /*团队余额*/
    getTeamMoney(record) {
        this.setState({
            teamMoney: 0,
            popoverLoading: true,
        });
        Fetch.usreList({
            method: 'POST',
            body: JSON.stringify({uid: record.userid, tag: 'get_team_money'})
        }).then((res)=>{
            if(this._ismount){
                this.setState({popoverLoading: false});
                if(res.status == 200){
                    this.setState({teamMoney: res.repsoneContent.money})
                }
            }
        })
    };
    render() {
        const { dailysalaryStatus} = stateVar;
        const { tableData, typeName, contentArr, prizeGroupList, agPost, diviPost, recharge, postDataRecharge } = this.state;
        let columns = [
            {
                title: '用户名',
                dataIndex: 'username',// 列数据在数据项中对应的 key，支持 a.b.c 的嵌套写法
                render: (text, record) => <span className="hover_a" onClick={()=>this.getData('clickName', record)}>{text}</span>,
                width: 100,
            }, {
                title: '用户类型',
                dataIndex: 'groupname',
                width: 70,
            }, {
                title: '团队人数',
                dataIndex: 'team_count',
                sorter: () => {},
                width: 80,
            }, {
                title: '个人余额',
                dataIndex: 'private_money',
                sorter: () => {},
                width: 90,
            }, {
                title: '奖金组',
                dataIndex: 'prize_group',
                render: (text, record) =>
                    tableData.history.length > 1 ?
                        text :
                        <span className="hover_a" onClick={()=>this.onClickColBtn('奖金组', record)}>{text}</span>,
                sorter: () => {},
                width: 70,
            }, {
                title: '注册时间',
                dataIndex: 'register_time',
                sorter: () => {},
                render: text => <p>{text.slice(0,10)}<br/>{text.slice(10)}</p>,
                width: 75,
            }, {
                title: '日工资',
                dataIndex: 'daily_salary_status',
                render: (text, record) =>
                    <Button type={text == 1 ? 'primary' : ''} ghost
                            onClick={()=>this.onClickColBtn('日工资', record)}
                            disabled={tableData.history.length > 1}
                    >
                        {text==1 ? '已签订' : '未签订'}
                    </Button>,
                width: 80,
            }, {
                title: '分红',
                dataIndex: 'dividend_salary_status',
                render: (text, record) =>
                    <Button type={text == 1 ? 'primary' : ''} ghost
                            onClick={()=>this.onClickColBtn('分红', record)}
                            disabled={tableData.history.length > 1}
                    >
                        {text==1 ? '已签订' : '未签订'}
                            </Button>,
                width: 80,
            }, {
                title: <span>
                        配额
                        <Badge count={this.state.num} style={{ backgroundColor: '#369900', marginLeft: 5 }} />
                </span>,
                dataIndex: 'useraccgroup_status',
                render: (text, record) =>
                record.usertype == 0 ?
                    '---' :
                    <Button className={text == 3 ? 'new_application' : ''}
                            type={text == 1 ? 'primary' : ''} ghost
                            onClick={()=>this.onClickColBtn('配额', record)}
                            disabled={tableData.history.length > 1}
                    >
                    {
                        text == 0 ?
                            '未分配' :
                            text == 1 ?
                                '已分配' :
                                '新申请'
                    }
                </Button>,
                width: 80,
            }, {
                title: '最后登录时间',
                dataIndex: 'lasttime',
                render: text => <p>{text.slice(0,10)}<br/>{text.slice(10)}</p>,
                width: 85,
            }, {
                title: '操作',
                dataIndex: 'action',
                render: (text, record) => (
                    <div>
                        <Popover content={
                            <span>
                                团队余额 : &nbsp;
                                <Spin wrapperClassName="col_color_ying spin_dp"
                                      spinning={this.state.popoverLoading}
                                      size="small"
                                >
                                    {this.state.teamMoney }
                                    </Spin>
                                &nbsp;元
                            </span>
                        }
                                 trigger="click"
                        >
                            <Button onClick={()=>this.getTeamMoney(record)}>团队余额</Button>
                        </Popover>
                        <Button className='recharge_btn'
                                onClick={()=>this.onRecharge(record)}
                                disabled={record.canRecharge == 1 ? false : true}
                        >
                            充值
                        </Button>
                        <Button className='game_record' onClick={()=>this.onSelectGameRecord(record)}>游戏记录</Button>
                    </div>
                ),
                width: 150,
            }];
        let footer = <div className="tabel_footer">
                            <span>总计</span>
                            <span>
                                  团队总人数：
                                  <strong>{tableData.accnumall} 人</strong>
                            </span>
                        </div>;

        if(dailysalaryStatus.isSalary != 1){
            columns = [
                {
                    title: '用户名',
                    dataIndex: 'username',// 列数据在数据项中对应的 key，支持 a.b.c 的嵌套写法
                    render: (text, record) => <span className="hover_a" onClick={()=>this.getData('clickName', record)}>{text}</span>,
                    width: 110,
                }, {
                    title: '用户类型',
                    dataIndex: 'groupname',
                    width: 70,
                }, {
                    title: '团队人数',
                    dataIndex: 'team_count',
                    sorter: () => {},
                    width: 80,
                }, {
                    title: '个人余额',
                    dataIndex: 'private_money',
                    sorter: () => {},
                    width: 90,
                }, {
                    title: '奖金组',
                    dataIndex: 'prize_group',
                    render: (text, record) =>
                        tableData.history.length > 1 ?
                            text :
                            <span className="hover_a" onClick={()=>this.onClickColBtn('奖金组', record)}>{text}</span>,
                    sorter: () => {},
                    width: 90,
                }, {
                    title: '注册时间',
                    dataIndex: 'register_time',
                    render: text => <p>{text.slice(0,10)}<br/>{text.slice(10)}</p>,
                    sorter: () => {},
                    width: 120,
                }, {
                    title: '分红',
                    dataIndex: 'dividend_salary_status',
                    render: (text, record) =>
                        <Button type={text == 1 ? 'primary' : ''} ghost
                                onClick={()=>this.onClickColBtn('分红', record)}
                                disabled={tableData.history.length > 1}
                        >
                            {text==1 ? '已签订' : '未签订'}
                        </Button>,
                    width: 85,
                }, {
                    title: <span>
                        配额
                        <Badge count={this.state.num} style={{ backgroundColor: '#369900', marginLeft: 5 }} />
                    </span>,
                    dataIndex: 'useraccgroup_status',
                    render: (text, record) =>
                        <Button className={text == 3 ? 'new_application' : ''}
                                type={text == 1 ? 'primary' : ''} ghost
                                onClick={()=>this.onClickColBtn('配额', record)}
                                disabled={tableData.history.length > 1}
                        >
                            {
                                text == 0 ?
                                    '未分配' :
                                    text == 1 ?
                                        '已分配' :
                                        '新申请'
                            }
                        </Button>,
                    width: 85,
                }, {
                    title: '最后登录时间',
                    dataIndex: 'lasttime',
                    render: text => <p>{text.slice(0,10)}<br/>{text.slice(10)}</p>,
                    width: 120,
                }, {
                    title: '操作',
                    dataIndex: 'action',
                    render: (text, record) => <div>
                        <Button onClick={()=>this.onSelectGameRecord(record)}>游戏记录</Button>
                        <Button className='recharge_btn'
                                onClick={()=>this.onRecharge(record)}
                                disabled={record.canRecharge == 1 ? false : true}
                        >
                            充值
                        </Button>
                    </div>,
                    width: 150,
                }];
        }
        if(dailysalaryStatus.isDividend != 1){
            columns = [
                {
                    title: '用户名',
                    dataIndex: 'username',// 列数据在数据项中对应的 key，支持 a.b.c 的嵌套写法
                    render: (text, record) => <span className="hover_a" onClick={()=>this.getData('clickName', record)}>{text}</span>,
                    width: 110,
                }, {
                    title: '用户类型',
                    dataIndex: 'groupname',
                    width: 70,
                }, {
                    title: '团队人数',
                    dataIndex: 'team_count',
                    sorter: () => {},
                    width: 80,
                }, {
                    title: '个人余额',
                    dataIndex: 'private_money',
                    sorter: () => {},
                    width: 90,
                },{
                    title: '奖金组',
                    dataIndex: 'prize_group',
                    render: (text, record) =>
                        tableData.history.length > 1 ?
                            text :
                            <span className="hover_a" onClick={()=>this.onClickColBtn('奖金组', record)}>{text}</span>,
                    sorter: () => {},
                    width: 70,
                }, {
                    title: '注册时间',
                    dataIndex: 'register_time',
                    render: text => <p>{text.slice(0,10)}<br/>{text.slice(10)}</p>,
                    sorter: () => {},
                    width: 120,
                }, {
                    title: '日工资',
                    dataIndex: 'daily_salary_status',
                    render: (text, record) =>
                        <Button type={text == 1 ? 'primary' : ''} ghost
                                onClick={()=>this.onClickColBtn('日工资', record)}
                                disabled={tableData.history.length > 1}
                        >
                            {text==1 ? '已签订' : '未签订'}
                        </Button>,
                    width: 85,
                }, {
                    title: <span>
                        配额
                        <Badge count={this.state.num} style={{ backgroundColor: '#369900', marginLeft: 5 }} />
                    </span>,
                    dataIndex: 'useraccgroup_status',
                    render: (text, record) =>
                        <Button className={text == 3 ? 'new_application' : ''}
                                type={text == 1 ? 'primary' : ''} ghost
                                onClick={()=>this.onClickColBtn('配额', record)}
                                disabled={tableData.history.length > 1}
                        >
                            {
                                text == 0 ?
                                    '未分配' :
                                    text == 1 ?
                                        '已分配' :
                                        '新申请'
                            }
                        </Button>,
                    width: 85,
                }, {
                    title: '最后登录时间',
                    dataIndex: 'lasttime',
                    render: text => <p>{text.slice(0,10)}<br/>{text.slice(10)}</p>,
                    width: 120,
                }, {
                    title: '操作',
                    dataIndex: 'action',
                    render: (text, record) => <div>
                        <Button onClick={()=>this.onSelectGameRecord(record)}>游戏记录</Button>
                        <Button className='recharge_btn'
                                onClick={()=>this.onRecharge(record)}
                                disabled={record.canRecharge == 1 ? false : true}
                        >
                            充值
                        </Button>
                    </div>,
                    width: 150,
                }];
        }
        if(dailysalaryStatus.isSalary != 1 && dailysalaryStatus.isDividend != 1){
            columns = [
                {
                    title: '用户名',
                    dataIndex: 'username',// 列数据在数据项中对应的 key，支持 a.b.c 的嵌套写法
                    render: (text, record) => <span className="hover_a" onClick={()=>this.getData('clickName', record)}>{text}</span>,
                    width: 110,
                }, {
                    title: '用户类型',
                    dataIndex: 'groupname',
                    width: 70,
                }, {
                    title: '团队人数',
                    dataIndex: 'team_count',
                    sorter: () => {},
                    width: 80,
                }, {
                    title: '个人余额',
                    dataIndex: 'private_money',
                    sorter: () => {},
                    width: 90,
                }, {
                    title: '奖金组',
                    dataIndex: 'prize_group',
                    render: (text, record) =>
                        tableData.history.length > 1 ?
                            text :
                            <span className="hover_a" onClick={()=>this.onClickColBtn('奖金组', record)}>{text}</span>,
                    sorter: () => {},
                    width: 90,
                }, {
                    title: '注册时间',
                    dataIndex: 'register_time',
                    sorter: () => {},
                    width: 120,
                }, {
                    title: <span>
                        配额
                        <Badge count={this.state.num} style={{ backgroundColor: '#369900', marginLeft: 5 }} />
                    </span>,
                    dataIndex: 'useraccgroup_status',
                    render: (text, record) =>
                        <Button className={text == 3 ? 'new_application' : ''}
                                type={text == 1 ? 'primary' : ''} ghost
                                onClick={()=>this.onClickColBtn('配额', record)}
                                disabled={tableData.history.length > 1}
                        >
                            {
                                text == 0 ?
                                    '未分配' :
                                    text == 1 ?
                                        '已分配' :
                                        '新申请'
                            }
                        </Button>,
                    width: 100,
                }, {
                    title: '最后登录时间',
                    dataIndex: 'lasttime',
                    width: 120,
                }, {
                    title: '操作',
                    dataIndex: 'action',
                    render: (text, record) => <div>
                        <Button onClick={()=>this.onSelectGameRecord(record)}>游戏记录</Button>
                        <Button className='recharge_btn'
                                onClick={()=>this.onRecharge(record)}
                                disabled={record.canRecharge == 1 ? false : true}
                        >
                            充值
                        </Button>
                    </div>,
                    width: 150,
                }];
        }

        if(typeName == '配额契约'){
            // let accGroup = contentArr.filter(item => item.accGroup <= this.state.alterData.prize_group);
            let prize_group = this.state.alterData.prize_group;
            typeContent = <div className="a_c_text">
                <p>契约内容：</p>
                <p>该用户可继续推广下级，其中可分配奖金组：</p>
                <ul className="text_content_list">
                    {
                        contentArr.map((item, i)=>{
                            return (
                                <li key={item.uagid} style={{display: item.accGroup > prize_group ? 'none' : ''}}>
                                    {item.accGroup}&nbsp;配额为<span className="subaccnum">{item.subaccnum == undefined ? '0' : item.subaccnum}</span>个
                                    <span>
                                        ，再增加
                                        <InputNumber min={0}
                                                     value={agPost.accnum[i]}
                                                     onChange={(value)=>this.onChangeAccGroup(value, item)}
                                        />
                                        个 （剩余可分配{item.accnum}个）
                                    </span>
                                </li>
                            )
                        })
                    }
                    <li>{prize_group < 1950 ? prize_group : '1948'}&nbsp;及以下剩余配额：无限；</li>
                </ul>
            </div>;
        }else if(typeName == '日工资契约'){
            typeContent = <div className="a_c_text a_c_text_sale">
                <p>契约内容：</p>
                <ul className="text_content_list">
                    {
                        contentArr.map((item, i)=>{
                            return (
                                <li key={i+1}>
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
                                                 max={100}
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
            </div>;
        }else if(typeName == '分红契约'){
            typeContent = <div className="a_c_text">
                <p>契约内容：</p>
                <div style={{whiteSpace: 'normal'}}>
                    如该用户每半月结算净盈亏总值时为负数，可获得分红，金额为亏损值的
                    <InputNumber min={0}
                                 max={100}
                                 value={diviPost.dividend_radio}
                                 onChange={(value)=>{
                                     diviPost.dividend_radio = value;
                                     this.setState({diviPost});
                                 }}
                    />
                    %。
                </div>
            </div>;
        }else if(typeName == '奖金组契约'){
            typeContent = <div className="a_c_text">
                <p>契约内容：</p>
                <div>
                    该用户的奖金组级别为
                    <InputNumber
                                 // min={prizeGroupList.length !== 0 ? parseInt(prizeGroupList[0].prizeGroup) : 1800}
                                 // max={prizeGroupList.length !== 0 ? parseInt(prizeGroupList[prizeGroupList.length-1].prizeGroup) : 1956}
                                 value={this.state.prizeGroupFlag}
                                 step={2}
                                 onChange={(value)=>this.onRegisterSetBonus(value)}
                                 disabled={true}
                    />。
                    <div className="prize_group_slider">
                        <Icon className="slider_left" onClick={()=>this.onMinus()} type="left"/>
                        <Slider
                                min={prizeGroupList.length !== 0 ? parseInt(prizeGroupList[0].prizeGroup) : 1800}
                                max={prizeGroupList.length !== 0 ? parseInt(prizeGroupList[prizeGroupList.length-1].prizeGroup) : 1956}
                                step={2}
                                onChange={(value)=>{this.onRegisterSetBonus(value)}}
                                value={parseInt(this.state.prizeGroupFlag)}
                        />
                        <Icon className="slider_right" onClick={()=>this.onAdd()} type="right" />
                    </div>
                    {
                        prizeGroupList.length !== 0 && <p style={{textAlign: 'center'}}>{prizeGroupList[0].prizeGroup} - {prizeGroupList[prizeGroupList.length-1].prizeGroup}</p>
                    }
                </div>
            </div>;
        }else{
            typeContent = ''
        }

        return (
            <div className="team_list">
                <div className="team_list_top">
                    <div className="t_l_time">
                        <ul className="t_l_time_row">
                            <li>
                                <span>用户名：</span>
                                <Input placeholder="请输入用户名" value={this.state.selectInfo.username} onChange={(e)=>this.onChangeUserName(e)}/>
                            </li>
                            <li style={{marginLeft: '8px'}}>
                                <span>注册时间：</span>
                                <DatePicker showTime
                                            allowClear={false}
                                            format="YYYY-MM-DD HH:mm:ss"
                                            placeholder="请选择开始时间"
                                            onChange={(date, dateString)=>this.onRegisterTimeStart(date, dateString)}
                                />
                                <span style={{margin: '0 8px'}}>至</span>
                                <DatePicker showTime
                                            allowClear={false}
                                            format="YYYY-MM-DD HH:mm:ss"
                                            placeholder="请选择结束时间"
                                            onChange={(date, dateString)=>this.onRegisterTimeEnd(date, dateString)}
                                />
                            </li>
                            <li>
                                <Button type="primary"
                                        icon="search"
                                        onClick={()=>this.getData()}
                                >
                                    搜索
                                </Button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="t_l_table">
                    <div className="t_l_location_name">
                        <span className="left">当前位置：</span>
                        <Crumbs table={this.state.tableData} onChildState={this.onChildState.bind(this)}/>
                    </div>
                    <div className="t_l_table_list">
                        <Table columns={columns}
                               rowKey={record => record.userid}
                               dataSource={this.state.tableData.dataSource}
                               pagination={false}
                               loading={this.state.loading}
                               footer={tableData.total <= 0 ? null : ()=>footer}
                               onChange={this.handleTableChange}
                        />
                    </div>
                    <div className="page right"  style={{display: tableData.total <= 0 ? 'none' : ''}}>
                        <Pagination showSizeChanger
                                    onShowSizeChange={(current, pageSize)=>this.onShowSizeChange(current, pageSize)}
                                    onChange={(page)=>this.onChangePagination(page)}
                                    defaultCurrent={1}
                                    total={this.state.tableData.total}
                                    pageSizeOptions={stateVar.pageSizeOptions.slice()}
                        />
                    </div>
                </div>
                <Contract
                    title={this.state.typeName}
                    userid={this.state.alterData.userid}
                    textDescribe={typeContent}
                    alterData={this.state.alterData}
                    alterVisible={this.state.alterVisible}
                    affirmLoading={this.state.affirmLoading}
                    contract_name={this.state.contract_name}
                    // disabled={this.state.disabled}
                    userList={this.state.tableData.dataSource}
                    contractInfo={this.state.contractInfo}
                    disabledSelect={true}
                    onCancel={this.onCancel}
                    onAffirm={this.onDiviratio}
                />
                <Modal
                    title="配额申请"
                    visible={this.state.quotaVisible}
                    width={440}
                    footer={null}
                    maskClosable={false}
                    onCancel={()=>this.onCancelQuota()}
                    className="quota_modal"
                >
                    <p className="quota_name">
                        <span className="current_quota">{this.state.alterData.username}</span>
                        申请配额：
                    </p>
                    <ul className="quota_list">
                        {
                            contentArr.map((item, i)=>{
                                return (
                                    <li key={item.uagid}>
                                        申请奖金组{item.accGroup}的配额
                                        <InputNumber min={0}
                                                     value={agPost.accnum[i]}
                                                     onChange={(value)=>this.onChangeAccGroup(value, item)}
                                        />
                                        个（该下级剩余<span className="current_quota">{item.subaccnum}</span>个）
                                    </li>
                                )
                            })
                        }
                        <li>剩余奖金组配额：无限制</li>
                        <li>
                            <Button onClick={()=>this.onDiviratio('新申请')} loading={this.state.quotaLoding} type="primary">确认</Button>
                            <Button onClick={()=>this.onCancelQuota()}>取消</Button>
                        </li>
                    </ul>
                </Modal>
                <Modal
                    title="下级充值"
                    wrapClassName="vertical-center-modal recharge_modal"
                    width={400}
                    maskClosable={false}
                    visible={this.state.rechargeVisible}
                    onCancel={()=>this.onCancelRecharge()}
                    footer={null}
                >
                    <ul className="recharge_list">
                        <li>
                            <span>用户账号：</span>
                            <span>{recharge.username}</span>
                        </li>
                        <li>
                            <span>您的余额：</span>
                            <span className="col_color_ying">{recharge.balance} 元</span>
                        </li>
                        <li>
                            <span>充值金额：</span>
                            <InputNumber min={parseInt(recharge.recharge_min)} size="large"
                                         max={parseInt(recharge.recharge_max)}
                                         value={postDataRecharge.money}
                                         className={onValidate('money', this.state.validate)}
                                         onChange={(value)=>{this.onRechargeAmount(value)}}
                            />
                            <span style={{marginLeft: 5}}>元</span>
                            <p style={{marginLeft: 60}}>
                                充值最低金额
                                <strong className="col_color_ying">{recharge.recharge_min}</strong>
                                元，最高
                                <strong className="col_color_ying">{recharge.recharge_max}</strong>
                                元的整数
                            </p>
                            <p style={{marginLeft: 60, height: 18}}>{changeMoneyToChinese(this.state.postDataRecharge.money)}</p>
                        </li>
                        <li>
                            <span>资金密码：</span>
                            <Input type="password" size="large"  placeholder="资金密码"
                                   value={postDataRecharge.fundPassword}
                                   onChange={(e)=>this.onFundPassword(e)}
                                   className={onValidate('fundPassword', this.state.validate)}
                            />
                        </li>
                        <li style={{textAlign: 'center'}}>
                            <Button className='suggest_btn' type="primary"
                                    onClick={()=>{this.onConfirm()}}
                                    loading={this.state.rechargeLoading}
                            >
                                立即充值
                            </Button>
                        </li>
                    </ul>
                </Modal>
            </div>
        );
    }
}
