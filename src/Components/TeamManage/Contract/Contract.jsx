/*契约系统*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Table, Icon,Tooltip,Spin,Button,Modal,InputNumber } from 'antd';
import { stateVar } from '../../../State';
import ContractModal from './ContractModal/ContractModal';
import Fetch from '../../../Utils';

import addSrc from './Img/add.png';
import moneySrc from './Img/money.png';
import dollarSrc from './Img/dollar.png';
import yuanSrc from './Img/yuan.png';
import quota from './Img/quota.png';

import './Contract.scss'

const text=<div className='c_info_wrap'>
    <p className='c_info_title'>日工资规则</p>
    <p className='c_i_title1'>恒彩日工资：</p>
    <p>发放时间：每日10:00由系统自动发放上一日工资；</p>
    <p className='c_i_title2'>日工资规则：</p>
    <p>1、非同IP、非同银行卡会员</p>
    <p>2、参与投注的流水统计限彩票，且玩法投注不得超过该玩法70%（不包含70%</p>
    <p>），即定位胆必须小于7住，二码必须小于69注，三码必须小于699注，四星必</p>
    <p>须小于6999注，</p>
    <p>五星必须小于69999注。如发现违规投注情况，均视作放弃日工资；恒彩彩票保</p>
    <p>留最终解释权，并持有终止、修改等权利</p>
</div>;

@observer
export default class Contract extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedRowKeys: [], // Check here to configure the default column
            loading: true,       /*控制表格请求数据的加载样式*/
            visible:false,                     // 控制创建契约模态框的显示
            curUserSignStatus:{                //当前用户各种契约签订状态，用以控制头部各项的显示，以及下级用户表头的显示
                dividend_ratio_status:0,   //分红比例签订状态
                daily_salary_status:0,     //日工资签订状态
                quota_status:0,             //配额契约签订状态
            },
            protocol:[],               //当前用户的日工资比例
            cur_dividend_radio:null,/*当前用户的日工资比例*/
            tableLength:null,/*实际获取到的下级用户数目*/
            columns:[],/*下级用户信息表格表头*/
            tableData:[],/*下级用户信息表格内容*/
            quotaVisible: false, //配额
            quotaList: [], //配额列表
            quotaPost:{}, //申请配额请求参数
            quotaLoding: false,
        };
        this.getContractList = this.getContractList.bind(this);
        this.transferMsg = this.transferMsg.bind(this);
    };
    componentDidMount() {
        this._ismount = true;
        this.getContractList();
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    transferMsg(visible) {
        this.setState({
            visible: visible
        });
    };

    onShowSizeChange(current, pageSize) {
        this.setState({pagination: current})
    };
    showModal(){
        this.setState({visible:true});
    };
    /*
    * 获取当前登录用户的契约信息
    * */
    getContractList(){
        Fetch.contractList({method: "POST",
            body: JSON.stringify({
                "pn": 100,
            })}).then((res)=>{
            if(this._ismount ){
                this.setState({loading:false});
                if(res.status==200){
                    let data = res.repsoneContent,
                        columns=[],
                        tableData=[];
                    /*获取当前用户各种契约签订状态
                    *获取当期用户的日工资，分红，奖金组
                    * 下级用户实际数目
                    * */
                    let curUserSignStatus=this.state.curUserSignStatus;
                    if(data.protocol instanceof Array){
                        curUserSignStatus.daily_salary_status = 1;
                    }
                    curUserSignStatus.dividend_ratio_status = data.dividend_ratio != null && '1';
                    if(data.self_acc_group.length>0){
                        curUserSignStatus.quota_status = 1;
                    }
                    this.setState({
                        curUserSignStatus:curUserSignStatus,
                        protocol:data.protocol,
                        cur_dividend_radio: data.dividend_ratio != null && data.dividend_ratio,
                        tableLength:data.results.length,
                        quotaList: data.prizeaccount,
                    });
                    /*下级用户信息表格渲染  begin*/
                    /*表头 begin*/
                    /*添加下级用户的用户名，奖金组表头*/
                    columns.push({
                        title: '用户名',
                        dataIndex: "name",
                        key: 'name',
                    });
                    columns.push({
                        title: '奖金组',
                        dataIndex: "awardGroup",
                        key: 'awardGroup',
                    });
                    /*添加分红比例表头
                    * 当上级用户签订了分红比例时，下级才有分红比例表头
                    * */
                    if(curUserSignStatus.dividend_ratio_status == 1){
                        columns.push({
                            title: '分红比例',
                            dataIndex: "divendRatio",
                        });
                    }
                    /*添加日工资表头
                    * 当上级用户签订了日工资时，下级才有日工资表头*/
                    if(data.protocol instanceof Array){
                        columns.push({
                            title: '日工资协议',
                            key: 'dailySalary',
                            children: [{
                                title: '第一档',
                                dataIndex: 'dailySalary0',
                                key: 'dailySalary0',

                            }, {
                                title: '第二档',
                                dataIndex: 'dailySalary1',
                                key: 'dailySalary1',

                            }, {
                                title: '第三档',
                                dataIndex: 'dailySalary2',
                                key: 'dailySalary2',

                            }, {
                                title: '第四档',
                                dataIndex: 'dailySalary3',
                                key: 'dailySalary3',

                            }, {
                                title: '第五档',
                                dataIndex: 'dailySalary4',
                                key: 'dailySalary4',

                            }, {
                                title: '第六档',
                                dataIndex: 'dailySalary5',
                                key: 'dailySalary5',

                            }],
                        });
                    }
                    /*添加配额管理表头
                    * 当上级用户签订了配额管理时，下级才有配额管理表头
                    * 配额管理下的组别必须小于当前用户奖金组级别表头
                    * */
                    if(stateVar.userInfo.accGroup >= 1950 && data.self_acc_group.length>0){
                        let columnChildren=[];
                        for(let i=1950;i<=parseInt(data.prize);i++){
                            columnChildren.push({
                                title: i,
                                dataIndex: `quotaManage${i}`,
                                key: `quotaManage${i}`,
                            });
                            i++;
                        }
                        columns.push({
                            title: '配额管理',
                            key: 'quotaManage',
                            children:columnChildren,
                        });
                    }
                    /*表头 end*/

                    /*表格内容 begin*/
                    /*添加用户名，奖金组*/
                    for(let j=0;j<data.results.length;j++){

                        tableData.push({
                            name: data.results[j].username,
                            awardGroup: data.results[j].prize_group,
                            key:`tableData${j}`,
                        });

                        /*添加分红比例,当上级用户签订了分红比例，才添加数据
                        * 当此下级用户签订了分红比例时，显示分红比例，否则显示“-”*/
                        if(curUserSignStatus.dividend_ratio_status==1){
                            if(data.results[j].dividend_salary_status==1){
                                tableData[j][ "divendRatio"] = data.results[j].dividend_radio+"%";
                            }else{
                                tableData[j][ "divendRatio"] = data.results[j].dividend_radio+"%";

                            }
                        }
                        /*添加日工资,当上级用户签订了日工资，才添加数据
                        * 当此下级用户签订了日工资时，显示日工资，否则显示“-”*/
                        if(data.protocol instanceof Array){
                            for(let k=0;k<6;k++){
                                if(data.results[j].daily_salary_status==1){
                                    tableData[j][`dailySalary${k}`] = data.results[j].daily_protocol[k] != undefined && data.results[j].daily_protocol[k].salary_ratio+"%";
                                }else{
                                    tableData[j][`dailySalary${k}`]="-";
                                }
                            }
                        }
                        /*当上级用户签订了配额管理时，下级才有配额管理
                        * 只显示小于当前用户奖金组级别的配额数据*/
                        if(data.self_acc_group.length>0){
                            for(let z=1950 ;z<=parseInt(data.prize);z++) {
                                tableData[j][`quotaManage${z}`] = data.results[j].group_level[z].accnum;
                                z++;
                            }
                        }
                    }

                    /*表格内容 end*/
                    /*下级用户信息列表表格渲染  end */
                    this.setState({
                        columns:columns,
                        tableData:tableData,
                    })
                }else{

                }

            }

        });
    }
    /*配额管理*/
    onApplyPrizeQuota(){
        this.setState({quotaLoding: true});
        Fetch.applyPrizeQuota({
            method: 'POST',
            body: JSON.stringify(this.state.quotaPost)
        }).then((res)=>{
            if(this._ismount){
                this.setState({quotaLoding: false, quotaVisible: false, quotaPost: {}});
                if(res.status == 200){
                    Modal.success({
                        title: '尊敬的用户：',
                        content: res.shortMessage,
                        okText: '确认关闭'
                    });
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*申请配额*/
    onChangeQuota(val, item){
        let { quotaPost } = this.state;
        if(val != '' && val != undefined){
            quotaPost[item.prizeGroup] = val;
        }else{
            quotaPost[item.prizeGroup] = 0;
        }
        this.setState({quotaPost});
    };
    onStyleAccGroup() {
        const { dailysalaryStatus } = stateVar;
        if(dailysalaryStatus.isSalary != 1 && dailysalaryStatus.isDividend != 1){//无日工资比例，无分红比例
            return 'border_content c_portion_height'
        }
        else if(dailysalaryStatus.isSalary == 1 && dailysalaryStatus.isDividend != 1){//无分红比例
            return 'border_content c_portion_height'
        }
        else if(dailysalaryStatus.isSalary != 1 && dailysalaryStatus.isDividend == 1){//无日工资比例
            return 'border_content no_salay'
        }
        else{
            return 'border_content c_portion'
        }
    }
    onStyleAccnum() {
        const { dailysalaryStatus } = stateVar;
        if(dailysalaryStatus.isSalary != 1 && dailysalaryStatus.isDividend != 1){//无日工资比例，无分红比例
            return 'border_content c_quota_width'
        }
        else{
            return 'border_content c_quota'
        }
    }
    onStyleDividend() {
        const { dailysalaryStatus } = stateVar;
        if(dailysalaryStatus.isSalary != 1 && dailysalaryStatus.isDividend != 1){//无日工资比例，无分红比例
            return 'c_dividend border_content'
        }
        else if(dailysalaryStatus.isSalary != 1 && dailysalaryStatus.isDividend == 1){//无日工资比例
            return 'border_content no_salay'
        }
        else {
            return 'c_portion border_content'
        }
    };
    render() {
        const { dailysalaryStatus } = stateVar;
        const { protocol,cur_dividend_radio,tableData,columns, quotaList, quotaPost} = this.state;

        const columnsDay = [
            {
                title: '日有销量',
                dataIndex: 'sale',
                render: (text)=> '≥'+ text
            },
            {
                title: '活跃人数',
                dataIndex: 'active_member',
                render: (text)=> '≥'+ text + '人'
            },
            {
                title: '日工资',
                dataIndex: 'salary_ratio',
                render: (text)=> '≥'+ text + '%'
            }
        ];

        return (
           <div className='contract_main'>
             <Spin tip="加载中..." spinning={this.state.loading}  size="large"/>
               {
                   !this.state.loading ?
                   <div>
                       <ul className='c_top clear'>
                           {
                               dailysalaryStatus.isSalary == 0 ?
                                   null :
                                   <li>
                                       <div className='c_salary border_content' >
                                           <p className='c_title'><img src={moneySrc}/>我的日工资比例
                                               <Tooltip placement="bottom" title={text}  overlayClassName='contract_helpinfo'>
                                                   <Icon className='c-info' type="info-circle" />
                                               </Tooltip>
                                           </p>
                                           <div className="day_table">
                                               <Table bordered={true}
                                                      rowKey={(record, index)=> index}
                                                      dataSource={protocol}
                                                      columns={columnsDay}
                                                      pagination={false}
                                               />
                                           </div>
                                       </div>
                                   </li>
                           }
                           <li>
                               {
                                   dailysalaryStatus.isDividend == 1 ?
                                       <div className={this.onStyleDividend()} >
                                           <p className='c_title'><img src={yuanSrc}/>我的分红比例</p>
                                           <div className='c_table_wrap'>
                                               <p>分红</p>
                                               <p className='c_txt'>{cur_dividend_radio}%</p>
                                           </div>
                                       </div> :
                                       null
                               }
                               <div className={this.onStyleAccGroup()}>
                                   <p className='c_title'><img src={dollarSrc}/>我的奖金组</p>
                                   <div className='c_table_wrap'>
                                       <p>奖金组</p>
                                       <p className='c_txt'>{stateVar.userInfo.accGroup}</p>
                                   </div>
                               </div>
                           </li>
                           <li>
                               <div className={this.onStyleAccnum()}>
                                   <p className='c_title'>
                                       <img src={quota}/>
                                       我的配额
                                   </p>
                                   {
                                       quotaList.length == 0 ?
                                           <div style={{fontSize: 14, marginTop: 110}}>无限制</div> :
                                           <ul className="quota_list">
                                               {
                                                   quotaList.map((item)=>{
                                                       return <li key={item.uagid}>{item.prizeGroup}奖金组：{item.accnum}个</li>
                                                   })
                                               }
                                               <li>剩余奖金组：无限制</li>
                                               <li>
                                                   <Button onClick={()=>this.setState({quotaVisible: true})}>申请补充奖金组</Button>
                                               </li>
                                           </ul>
                                   }
                               </div>
                           </li>
                           <li className='c_setContract' onClick={()=>{this.showModal()}}>
                               <img src={addSrc}/>
                               <p>创建契约</p>
                           </li>
                       </ul>
                       <ContractModal
                           visible={this.state.visible}
                           transferMsg = {this.transferMsg}
                           getContractList = {this.getContractList}
                           protocol = {protocol}
                       />
                       <div className="c_table">
                           <Table columns={columns} dataSource={tableData} bordered={true} loading={this.state.loading} pagination={true}/>
                       </div>
                   </div> : null
               }
               <Modal
                   title="配额申请"
                   visible={this.state.quotaVisible}
                   width={440}
                   footer={null}
                   maskClosable={false}
                   onCancel={()=>this.setState({quotaVisible: false, quotaPost: {}})}
                   className="quota_modal"
               >
                   <ul className="quota_list">
                       {
                           quotaList.map((item)=>{
                               return (
                                   <li key={item.uagid}>
                                       申请奖金组{item.prizeGroup}的配额
                                       <InputNumber min={0}
                                           value={quotaPost[item.prizeGroup]}
                                           onChange={(value)=>this.onChangeQuota(value, item)}
                                       />
                                       个（当前有<span className="current_quota">{item.accnum}</span>个）
                                   </li>
                               )
                           })
                       }
                       <li>剩余奖金组配额：无限制</li>
                       <li>
                           <Button onClick={()=>this.onApplyPrizeQuota()} loading={this.state.quotaLoding} type="primary">申请</Button>
                           <Button onClick={()=>this.setState({quotaVisible: false, quotaPost: {}})}>取消</Button>
                       </li>
                   </ul>
               </Modal>
            </div>
        );
    }
}
