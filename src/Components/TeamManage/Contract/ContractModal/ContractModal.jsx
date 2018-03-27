import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {  Icon,Modal,Select,Slider,InputNumber , Popconfirm } from 'antd';
const confirm = Modal.confirm;
import Fetch from '../../../../Utils';
import Contract from '../../../Common/Contract/Contract';
// let typeContent = '';

import './ContractModal.scss';
import guanbi  from  './Img/guanbi.png'
const Option=Select.Option;

@observer
export default class ContractModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alterVisible: false,
            alterData: {},
            type: -1, //契约类型
            affirmLoading: false,
            contract_name: '修改契约', //按钮btn
            disabled: true,
            typeName: '', // 要修改类型的名字：日工资，分红，配额，奖金组
            contentArr: [],
            diviPost:{// 分红请求参数
                userid: null,
                dividend_radio: 0, // 要修改的比例
            },
            prizeGroupPost: {}, // 奖金组请求参数
            prizeGroupList: [], //可设置的奖金组列表
            agPost: {// 配额请求参数
                flag: 'post', //修改配额的时候必须传这个值
                accgroup: [], //返回的奖金组agid
                accnum: [], // 与accgroup顺序一致, 增加的配额个数
                uid: null, //要修改的用户id
            },
            prizeGroupFlag: 0, // 需要修改的奖金组
            salary_ratio: [], //修改协议

            userList:[], //下级用户列表（代理）
            contractInfo:[],//契约类型
            userid:null, // 下级用户userid
            username: '',//下级用户username
            self: {},
            typeContent: '',
        };
        this.onCancel = this.onCancel.bind(this);
        this.onDiviratio = this.onDiviratio.bind(this);
        this.onSelectUser = this.onSelectUser.bind(this);
        this.onSelectSys = this.onSelectSys.bind(this);
    };
    componentDidMount() {
        this._ismount = true;
        this.getUserInfo();
    };
    componentWillUnmount(){
        this._ismount = false;
    }
    /*关闭模态框*/
    onCancel(){
        this.setState({contract_name: '修改契约', alterVisible: false, affirmLoading: false})
    };
    /*获取用户信息 */
    getUserInfo(){
        Fetch.childrenList({
            method: "POST",
            body: JSON.stringify({pn: 100})
        }).then((res)=> {
            if(this._ismount){
                if(res.status == 200){
                    let { contractInfo } =this.state,
                        data = res.repsoneContent,
                        self = data.self;
                    if(self.daily_salary_status == '1'){
                        contractInfo.push({
                            id:0,
                            contract:"日工资契约",
                        });
                    }
                    if(self.dividend_salary_status == '1'){
                        contractInfo.push({
                            id:1,
                            contract:"分红契约",
                        })
                    }
                    contractInfo.push({
                        id:2,
                        contract:"奖金组契约",
                    });
                    if(self.useraccgroup_status == '1'){
                        contractInfo.push({
                            id:3,
                            contract:"配额契约",
                        })
                    }
                    this.setState({
                        userList: data.results.filter(item => item.usertype == '1'),
                        contractInfo,
                        self: data.self
                    });
                }
            }
        })
    };
    /*选择下级用户*/
    onSelectUser(item, origin){
        Fetch.childrenList({
            method: "POST",
            body: JSON.stringify({pn: 100})
        }).then((res)=> {
            if(this._ismount){
                if(res.status == 200){
                    let data = res.repsoneContent,
                        alterData = data.results.filter(items => items.userid == item.key)[0]; //选择的当前用户信息;
                    this.setState({
                        userid:item.key,
                        username:item.label,
                        alterData: alterData,
                        contract_name: '修改契约',
                    }, ()=>{
                        if(origin == 'child'){
                            this.onSelectSys(this.state.type)
                        }
                    });
                }
            }
        })
    };
    /*选择契约类型获取相应信息*/
    onSelectSys(type) {
        let { alterData } = this.state;
        this.setState({
            alterVisible: true,
            disabled: true,
            prizeGroupFlag: alterData.prize_group,
            type: type,
            contract_name: '修改契约',
        },()=>{
            this.props.transferMsg(false);
        });
        if(type == 3 || type == '配额契约'){ //配额
            this.getAccGroupList(alterData);
        }else if(type == 0 || type == '日工资契约'){//日工资
            let postDataSelf = {
                userid: alterData.userid,
                parentid: alterData.parentid,
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
                            salary_ratio: pros[pros.length - 1],
                        }, ()=>this.onTypeContent());
                    }
                }
            });
        }else if(type == 1 || type == '分红契约'){//分红
            let { diviPost } = this.state;
            diviPost.dividend_radio = alterData.dividend_radio;
            this.setState({
                typeName: '分红契约',
                diviPost,
            }, ()=>this.onTypeContent());
        }else if(type == 2 || type == '奖金组契约'){ //奖金组
            //获取可设置的奖金组列表
            Fetch.awardTeam({
                method: 'POST',
                body: JSON.stringify({uid: alterData.userid})
            }).then((res)=>{
                if(this._ismount && res.status == 200){
                    let { prizeGroupPost } = this.state,
                        data = res.repsoneContent;
                    prizeGroupPost.uid = data.uid;
                    prizeGroupPost.flag = 'rapid';
                    prizeGroupPost.selfPoint = data.selfPoint;
                    this.setState({
                        typeName: '奖金组契约',
                        prizeGroupList: data.list,
                        prizeGroupPost,
                        groupLevel: data.groupLevel,
                    }, ()=>this.onTypeContent());
                }
            })
        }else{}
    };
    /*获取对应用户配额列表*/
    getAccGroupList(record){
        Fetch.quota({
            method: 'POST',
            body: JSON.stringify({uid: record.userid})
        }).then((res)=>{
            if(this._ismount && res.status == 200){
                let aAllUserTypeAccNum = res.repsoneContent.aAllUserTypeAccNum,
                    { agPost } = this.state,
                    contentArrFlag = aAllUserTypeAccNum.filter(item => item.accGroup <= record.prize_group);
                agPost.accgroup = [];
                agPost.accnum = [];
                contentArrFlag.forEach((item)=>{
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
                }, ()=>this.onTypeContent());
            }
        })
    };
    /*选择不同类型对应不同显示类容*/
    onTypeContent(){
        let { contentArr, agPost, diviPost, prizeGroupList, alterData, type } = this.state,
            typeContent = '';
        if(type == 3 || type == '配额契约'){ //配额契约
            let accGroup = contentArr.filter(item => item.accGroup <= alterData.prize_group);
            typeContent = <div className="a_c_text">
                <p>契约内容：</p>
                <p>该用户可继续推广下级，其中可分配奖金组：</p>
                <ul className="text_content_list">
                    {
                        accGroup.map((item, i)=>{
                            return (
                                <li key={item.uagid}>
                                    {item.accGroup}&nbsp;配额为
                                    <span className="subaccnum">{item.subaccnum == undefined ? '0' : item.subaccnum}</span>个
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
                    <li>{alterData.prize_group < 1950 ? alterData.prize_group : '1948'}&nbsp;及以下剩余配额：无限；</li>
                </ul>
            </div>;
        }else if(type == 0 || type == '日工资契约'){//日工资契约
            typeContent = <div className="a_c_text a_c_text_sale">
                <p>契约内容：</p>
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
                                                 {/*onBlur={()=>this.onBlurSale(item, i)}*/}
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
            </div>;
        }else if(type == 1 || type == '分红契约'){//分红契约
            typeContent = <div className="a_c_text">
                <p>契约内容：</p>
                <div style={{whiteSpace: 'normal'}}>
                    如该用户每半月结算净盈亏总值时为负数，可获得分红，金额为亏损值的
                    <span style={{display: 'none'}}>{diviPost.dividend_radio}</span>
                    <InputNumber
                                 min={0}
                                 max={100}
                                 value={diviPost.dividend_radio}
                                 onChange={(value)=>{
                                    diviPost.dividend_radio = value;
                                    this.setState({diviPost}, ()=>this.onTypeContent());
                                 }}
                    />
                    %。
                </div>
            </div>;
        }else if(type == 2 || type == '奖金组契约'){ //奖金组契约
            typeContent = <div className="a_c_text">
                <p>契约内容：</p>
                <div>
                    该用户的奖金组级别为
                    <InputNumber
                                 min={prizeGroupList.length !== 0 ? parseInt(prizeGroupList[0].prizeGroup) : 1800}
                                 max={prizeGroupList.length !== 0 ? parseInt(prizeGroupList[prizeGroupList.length-1].prizeGroup) : 1956}
                                 value={this.state.prizeGroupFlag}
                                 step={2}
                                 onChange={(value)=>this.onRegisterSetBonus(value)}
                    />。
                    <div className="prize_group_slider">
                        <Icon className="slider_left" onClick={()=>this.onMinus()} type="left"/>
                        <Slider
                            min={prizeGroupList.length !== 0 ? parseInt(prizeGroupList[0].prizeGroup) : 0}
                            max={prizeGroupList.length !== 0 ? parseInt(prizeGroupList[prizeGroupList.length-1].prizeGroup) : 0}
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
        this.setState({typeContent: typeContent});
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
        this.setState({agPost}, ()=>this.onTypeContent());
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
        this.setState({salary_ratio: salary_ratioFlag}, ()=>this.onTypeContent());
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
        this.setState({salary_ratio: contentArr}, ()=>this.onTypeContent());
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
        }, ()=>this.onTypeContent())
    };
    /*添加档位*/
    onAddSale(){
        let { contentArr } = this.state,
            protocol = this.props.protocol;
        let contentObj = protocol[contentArr.length];
        contentArr.push(contentObj);
        this.setState({contentArr}, ()=>this.onTypeContent());
    };
    /*奖金组设置 滑动条*/
    onRegisterSetBonus(value) {
        this.setState({prizeGroupFlag: value}, ()=>this.onTypeContent());
    };
    /*奖金组*/
    onMinus() {
        let { prizeGroupFlag, prizeGroupList } = this.state;
        if( prizeGroupFlag <= prizeGroupList[0].prizeGroup){
            return
        }
        this.setState({prizeGroupFlag: this.state.prizeGroupFlag - 2}, ()=>this.onTypeContent());
    };
    onAdd(){
        let { prizeGroupFlag, prizeGroupList } = this.state;
        if( prizeGroupFlag >= prizeGroupList[prizeGroupList.length - 1].prizeGroup){
            return
        }
        this.setState({prizeGroupFlag: this.state.prizeGroupFlag + 2}, ()=>this.onTypeContent());
    };
    /*提交协议*/
    onDiviratio(contract_name){
        let _this = this;
        confirm({
            title: '确认要修改吗?',
            onOk() {
                _this.setProtocol(contract_name)
            },
        });
    };

    setProtocol(contract_name){
        let { type, alterData } = this.state;
        this.setState({affirmLoading: true, contract_name: '签订契约'});
        if(type == 3 || type == '配额契约'){//配额契约
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
                        this.props.getContractList(); //更新列表
                        if(contract_name == '新申请'){
                            this.setState({quotaVisible: false});
                            this.getData();
                            this.getNum();
                        }else{
                            this.setState({alterVisible: false, disabled: true, contract_name: '修改契约'});
                        }
                        this.getAccGroupList(alterData);
                    }else{
                        Modal.warning({
                            title: res.shortMessage,
                        });
                    }
                }
            })
        }else if(type == 1 || type == '分红契约'){//分红契约
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
                        this.props.getContractList(); //更新列表
                        this.setState({alterVisible: false, disabled: true, contract_name: '修改契约'});
                    }else{
                        Modal.warning({
                            title: res.shortMessage,
                        });
                    }
                }
            })
        }else if(type == 0 || type == '日工资契约'){//日工资契约
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
                        this.props.getContractList(); //更新列表
                        this.setState({alterVisible: false, disabled: true, contract_name: '修改契约'});
                    }else{
                        Modal.warning({
                            title: res.longMessage,
                            content: res.shortMessage
                        });
                    }
                }
            })
        }else if(type == 2 || type == '奖金组契约'){//奖金组契约
            let { prizeGroupFlag, prizeGroupPost, prizeGroupList } = this.state;
            let selectPrizeGroup = prizeGroupList.filter((item, index) => item.prizeGroup == prizeGroupFlag)[0];
            prizeGroupPost.groupLevel = prizeGroupFlag;
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
                        this.props.getContractList(); //更新列表
                        this.setState({alterVisible: false, disabled: true, contract_name: '修改契约'});
                    }else{
                        Modal.warning({
                            title: res.shortMessage,
                        });
                    }
                }
            })
        }else{}
    };

    render() {
        const {userList, contractInfo } = this.state;
        return (
            <div>
                {
                    this.props.visible ?
                        <Modal ref="myModal"
                               wrapClassName= 'center-modal-c'
                               visible={this.props.visible}
                               footer={null}
                               closable={false}
                        >
                            <img className='c_m_guanbi' src={guanbi} onClick={()=>this.props.transferMsg(false)}/>
                            <div className="c_aa_form">
                                <ul className="c_aa_list">
                                    <li className="c_user">
                                        <span className="c_aa_left_text">用户名：</span>
                                        <Select
                                            showSearch
                                            labelInValue
                                            style={{ width: 280 }}
                                            placeholder="请选择需要创建契约的用户"
                                            optionFilterProp="children"
                                            onChange={(value)=>{this.onSelectUser(value)}}
                                            getPopupContainer={() => document.getElementsByClassName('c_user')[0]}
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            {
                                                userList.map((item) => {
                                                    return (
                                                        <Option value={item.userid} key={item.username}>{item.username}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </li>
                                    <li className="c_contractType">
                                        <span className="c_aa_left_text">契约类型：</span>
                                        <Select className="c_aa_marg" size="large"
                                                style={{ width: 280 }}
                                                onChange={(value)=>{this.onSelectSys(value)}}
                                                getPopupContainer={() => document.getElementsByClassName('c_contractType')[0]}
                                                placeholder="请选择需要创建契约的系统"
                                        >
                                            {
                                                this.state.userid ?
                                                    contractInfo.map((item) => {
                                                        return (
                                                            <Option value={''+item.id} key={item.id}>{item.contract}</Option>
                                                        )
                                                    }):''
                                            }
                                        </Select>
                                    </li>
                                </ul>
                            </div>
                        </Modal> :
                        null
                }
                {
                    this.state.alterVisible ?
                        <Contract
                            title={this.state.typeName}
                            userid={this.state.userid}
                            textDescribe={this.state.typeContent}
                            alterData={this.state.alterData}
                            alterVisible={this.state.alterVisible}
                            affirmLoading={this.state.affirmLoading}
                            contract_name={this.state.contract_name}
                            // disabled={this.state.disabled}
                            userList={this.state.userList}
                            contractInfo={this.state.contractInfo}
                            // hideBtn = {accGroupFlag == 1}
                            onCancel={this.onCancel}
                            onAffirm={this.onDiviratio}
                            onSelectUser={this.onSelectUser}
                            onSelectSys={this.onSelectSys}
                        /> : null
                }

            </div>
        )
    }
}
