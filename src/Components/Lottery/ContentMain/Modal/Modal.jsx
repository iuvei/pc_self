import React, {Component} from 'react';
import {observer} from 'mobx-react';
import mobx,{computed, autorun} from "mobx";
import { Table, Button, Modal, Select, InputNumber, Checkbox ,notification,Icon} from 'antd';
import ModelView from '../../../Common/ChildNav/ChildNav'
import { stateVar } from '../../../../State'

import './Modal.scss'

@observer
export default class ModalView extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	checked: true,
            loading: false,
            chaseLoading: false,
            traceItem:[],
        	checkselectItem:[],
        	checkAll:false,
        	traceTitleIndex:0,
        	traceIssueNum:1,
        	traceTimeNum:1,
        	traceLowMoneyNum:10,
        	traceIssueSpaceNum:1,
        	traceTimeSpaceNum:1,
        	periodsIndex:-1,
        	traceTotalIssue:0,
        	traceTotalMoney:0,
        	traceifStop:true,
        	tempLotteryLength:0
        }
        this.onChangeNavIndex = this.onChangeNavIndex.bind(this);
    };
    componentDidMount(){
    };
    componentDidUpdate(){
    	if(stateVar.tracevisible && !stateVar.checkTrace){
    		this.actionTrace();
    	}
    }
    enterLoading() {
        this.setState({ loading: true });
    };
    enterChaseLoading() {
        this.setState({ chaseLoading: true });
    };
    //关闭追号
    getSuperaddition() {
    	stateVar.tracevisible = false;
    	stateVar.checkTrace = false;
        this.setState({
        	traceItem:[],
        	checkAll:false,
        	traceIssueNum:1,
        	traceTimeNum:1,
        	traceLowMoneyNum:10,
        	traceIssueSpaceNum:1,
        	traceTimeSpaceNum:1,
        	traceTitleIndex:0,
        	periodsIndex:-1,
        	traceTotalMoney:0,
        	traceTotalIssue:0,
        	traceItem:[],
        	checkselectItem:[]
        });
    };
    //切换追号title
    onChangeNavIndex(param){
    	if(param == this.state.traceTitleIndex){
    		return;
    	}
    	this.setState({
    		traceIssueNum:1,
        	traceTimeNum:1,
        	traceLowMoneyNum:10,
        	traceIssueSpaceNum:1,
        	traceTimeSpaceNum:1,
        	traceTitleIndex:param,
        	periodsIndex:-1
    	},()=>{
    		this.clearTraceNumber();
    	});
    };
    //清空追号号码
    clearTraceNumber(){
    	this.setState({checkAll:false},()=>{
			let tempTraceItem = this.state.traceItem;
			let tempArray = [];
			for(let i=0;i<tempTraceItem.length;i++){
				tempArray.push(false);
				tempTraceItem[i].times = 0;
    			tempTraceItem[i].money = 0;
			}
			this.setState({checkselectItem:tempArray,traceItem:tempTraceItem,traceTotalMoney:0,traceTotalIssue:0});
    	});
    };
    //选择追号期数
    navTraceIssue(index,val){
    	if(val == '全部'){
    		val = this.state.traceItem.length;
    	}
    	this.setState({periodsIndex: index,traceIssueNum:parseInt(val)})
    }
    //最低收益率
    onChangeLowMoney(param){
    	if(param == '' || param == undefined){
			param = 1;
		}
		this.setState({traceLowMoneyNum:param});
    };
    //追号期数
	onChangeInputTraceIssue(param){
		if(param == '' || param == undefined){
			param = 1;
		}
		this.setState({traceIssueNum:param,periodsIndex:-1});
	};
	//倍数
    onChangeInputTimeIssue(param){
    	if(param == '' || param == undefined){
			param = 1;
		}
		this.setState({traceTimeNum:param});
    };
    //翻倍追号隔的期数
    onChangeInputSpaceTraceIssue(param){
    	if(param == '' || param == undefined){
			param = 1;
		}
		this.setState({traceIssueSpaceNum:param});
    };
    //翻倍追号隔的倍数
    onChangeInputSpaceTimeIssue(param){
    	if(param == '' || param == undefined){
			param = 1;
		}
		this.setState({traceTimeSpaceNum:param});
    };
    //立即生成追号
    enterLoading(){
    	let tempData = this.state.checkselectItem;
		let tempTotalIssue = this.state.traceIssueNum;
		let tempTotalTime = this.state.traceTimeNum;
		let tempTraceItem = this.state.traceItem;
		let tempSpaceIssue	= this.state.traceIssueSpaceNum;
        let tempSpaceTime = this.state.traceTimeSpaceNum;
        let tempLowTraceMoney = this.state.traceLowMoneyNum;
		let tempMoney = 0;
		let tempTime = 0;
		let tempFlag = false;
		let p = 0;//奖金
    	if(this.state.traceTitleIndex == 0){
    		if(tempTotalIssue == tempTraceItem.length){
    			tempFlag = true;
    		}
    		for(let i=0;i<tempTraceItem.length;i++){
    			if(i < tempTotalIssue){
    				tempTraceItem[i].times = tempTotalTime;
    				tempTraceItem[i].money = tempTraceItem[i].times * stateVar.BetContent.totalMoney;
    				tempData[i] = true;
    				tempMoney += tempTraceItem[i].money;
    				tempTime += 1;
    			}else{
    				tempTraceItem[i].times = 0;
    				tempTraceItem[i].money = 0;
    				tempData[i] = false;
    			}
    		}
    	}else if(this.state.traceTitleIndex == 1){
    		if(tempTotalIssue == stateVar.tomorrowIssue.length){
    			tempFlag = true;
    		}
    		for(let i=0;i<tempTraceItem.length;i++){
    			if(i < tempTotalIssue){
    				if(i != 0 && i % tempSpaceIssue == 0){
    					tempTotalTime = tempTotalTime * tempSpaceTime;
    				}
    				tempTraceItem[i].times = tempTotalTime;
    				tempTraceItem[i].money = tempTraceItem[i].times * stateVar.BetContent.totalMoney;
    				tempData[i] = true;
    				tempMoney += tempTraceItem[i].money;
    				tempTime += 1;
    			}else{
    				tempTraceItem[i].times = 0;
    				tempTraceItem[i].money = 0;
    				tempData[i] = false;
    			}
    		}
    	}else if(this.state.traceTitleIndex == 2){
    		let marmt = 0;
            let marmd = 0;
            let martype =0;//利润率支持情况，0:支持,1:玩法不支持，2:多玩法，3:多圆角模式
            $.each(stateVar.BetContent.lt_same_code,(i,n)=>{
                if( marmt != 0 && marmt != n.methodid ){
                    martype = 2;
                    return false;
                }else{
                    marmt = n.methodid;
                }
                if( marmd != 0 && marmd != n.mode ){
                    martype = 3;
                    return false;
                }else{
                    marmd = n.mode;
                }
				//北京快乐吧：不支持利润率追号！
                if( n.prize <= 0 || $.inArray(n.methodid, [371,373,375,377,379,381,383]) > -1 ){
                    martype = 1;
                    return false;
                }else{
                    p = n.prize;
                }
            });
            if( martype == 1 ){
                alert('该玩法不支持利润率追号');
                return false;
            }else if( martype == 2 ){
                alert('多玩法不支持利润率追号，请选择单一玩法进行投注');
                return false;
            }else if( martype == 3 ){
                alert('多圆角模式不支持利润率追号，请选择单一圆角模式');
                return false;
            }
            let e = tempLowTraceMoney//最低利润率
            e = isNaN(e) ? 0 : e;
            if( e <= 0 ){
                alert('利润率错误');
                return false;
            }
            let m = stateVar.BetContent.lt_trace_base;//每期金额的初始值
            if( e >= ((p*100/m)-100) ){
                $.alert('利润率错误');
                return false;
            }
            let t = 0;//返回的倍数
            for(let i=0;i<tempTraceItem.length;i++){
    			if(i < tempTotalIssue){
    				let times = this.computeByMargin(tempTotalTime,e,m,tempMoney,p);
    				tempTraceItem[i].times = times;
    				tempTraceItem[i].money = tempTraceItem[i].times * stateVar.BetContent.totalMoney;
    				tempData[i] = true;
    				tempMoney += tempTraceItem[i].money;
    				tempTime += 1;
    			}else{
    				tempTraceItem[i].times = 0;
    				tempTraceItem[i].money = 0;
    				tempData[i] = false;
    			}
    		}
    	}
    	this.setState({checkselectItem:tempData,traceItem:tempTraceItem,checkAll:tempFlag,traceTotalMoney:tempMoney,traceTotalIssue:tempTime});
    };
    //确定追号投注
    enterChaseLoading(){
    	if(this.state.traceTotalMoney <= 0 || this.state.traceTotalIssue <= 0){
    		alert('请先选择追号投注内容');
    		return;
    	}
    	let tempIssue = this.state.traceItem;
    	let submitIssue = [];
    	let summitTime = {};
    	for(let i=0;i<tempIssue.length;i++){
    		if(this.state.checkselectItem[i]){
    			let tempaaa = stateVar.todayAndTomorrow[i].issue;
    			submitIssue.push(tempaaa);
    			summitTime['lt_trace_times_'+tempaaa] = tempIssue[i].times;
    		}
    	}
    	let tempObj = {
    		lotteryid : stateVar.nowlottery.lotteryBetId,
    		curmid : stateVar.nowlottery.cuimId,
    		flag : "save",
    		play_source : 10,
    		lt_allin_if : "no",
    		lt_issue_start : stateVar.nextIssue,
    		lt_total_nums : stateVar.BetContent.totalNum,
    		lt_total_money : stateVar.BetContent.totalMoney,
    		lt_trace_stop: this.state.traceifStop ? 'yes' : 'no',
    		lt_trace_if:'yes',
    		lt_trace_money : this.state.traceTotalMoney,
			lt_trace_count_input : this.state.traceTotalIssue,
			lt_trace_issues:submitIssue,
    		lt_project:[]
    	};
    	for(let i in summitTime){
    		tempObj[i] = summitTime[i];
    	}
    	for(let i=0;i<stateVar.BetContent.lt_same_code.length;i++){
    		tempObj.lt_project.push(stateVar.BetContent.lt_same_code[i])
    	}
    	stateVar.betData = mobx.toJS(tempObj);
    	stateVar.betVisible = true;
    };
    computeByMargin(s,m,b,o,p){
        s = s ? parseInt(s,10) : 0;
        m = m ? parseInt(m,10) : 0;
        b = b ? Number(b) : 0;
        o = o ? Number(o) : 0;
        p = p ? Number(p) : 0;
        var t = 0;
        if( b > 0 ){
            if( m > 0 ){
                t = Math.ceil( ((m/100+1)*o)/(p-(b*(m/100+1))) );
            }else{//无利润率
                t = 1;
            }
            if( t < s ){//如果最小倍数小于起始倍数，则使用起始倍数
                t = s;
            }
        }
        return t;
    };
    //单选追号复选框处理
    selectItem(index,e){
    	let tempData = this.state.checkselectItem;
    	let tempTraceItem = this.state.traceItem;
    	let tempFlag = true;
    	let tempMoney = 0;
    	let tempTime = 0;
		for(let i=0;i<tempData.length;i++){
			if(i == index){
				tempData[i] = e.target.checked;
				if(!tempData[i]){
					tempTraceItem[i].times = 0;
					tempTraceItem[i].money= 0;

				}else{
					tempTraceItem[i].times = 1;
					tempTraceItem[i].money = tempTraceItem[i].times * stateVar.BetContent.totalMoney;
				}
			}
			if(!tempData[i]){
				tempFlag = false;
			}else{
				tempMoney += tempTraceItem[i].money;
				tempTime += 1;
			}
		}
		this.setState({checkselectItem:tempData,checkAll:tempFlag,traceTotalMoney:tempMoney,traceTotalIssue:tempTime});
    }
    //追号输入框
    traceInput(index,val){
    	if(val == '' || val == undefined){
    		val = 1;
    	}
    	let tempMoney = 0;
    	let tempTime = 0;
    	let tempTraceItem = this.state.traceItem;
    	for(let i=0;i<tempTraceItem.length;i++){
    		if(i == index){
    			tempTraceItem[i].times = val;
    			tempTraceItem[i].money = tempTraceItem[i].times * stateVar.BetContent.totalMoney;
    		}
    		if(this.state.checkselectItem[i]){
    			tempMoney += tempTraceItem[i].money;
				tempTime += 1;
    		}
    	}
    	this.setState({traceItem:tempTraceItem,traceTotalMoney:tempMoney,traceTotalIssue:tempTime});
    };
    //全选追号
    onCheckAllChange(e){
    	this.setState({checkAll:!this.state.checkAll},()=>{
    		let tempData = this.state.traceItem;
    		let tempArray = [];
    		let tempMoney = 0;
    		let tempTime = 0;
    		if(this.state.checkAll){
    			for(let i=0;i<tempData.length;i++){
    				if(!this.state.checkselectItem[i]){
    					tempData[i].times = 1;
						tempData[i].money= tempData[i].times * stateVar.BetContent.totalMoney;
    				}
    				tempMoney += tempData[i].money;
					tempTime += 1;
    				tempArray.push(true);
    			}
    		}else{
    			for(let i=0;i<tempData.length;i++){
    				tempData[i].times = 0;
					tempData[i].money= 0;
    				tempArray.push(false);
    			}
    		}
    		this.setState({checkselectItem:tempArray,traceItem:tempData,traceTotalMoney:tempMoney,traceTotalIssue:tempTime});
    	});
    };
    //中奖追停
    onChangeTraceStop(e){
    	this.setState({traceifStop:e.target.checked});
    }
    //追号数据处理
    actionTrace(){
    	stateVar.checkTrace = true;
    	if(!stateVar.tracevisible){
    		return;
    	}
    	let tempObj = this.state.traceItem;
    	if(tempObj.length > 0){
    		tempObj.shift();
    	}
    	let tempMoney = 0;
    	let tempTime = 0;
    	let tempData = stateVar.todayAndTomorrow;
    	let dataTemp = [];
    	let tempArray = [];
    	for(let i=0;i<tempData.length;i++){
    		if(i >= 50){
    			break;
    		}else{
    			let obj = {};
    			if(tempObj.length > 0 && tempObj[i] != undefined && tempObj[i].times > 0){
    				obj = {
		                age: tempObj[i].age,
		                times: tempObj[i].times,
		                money: tempObj[i].money,
		                kjtime: tempObj[i].kjtime,
		    		}
    				tempArray.push(true);
    			}else{
    				obj = {
		                age: tempData[i].issue,
		                times: 0,
		                money: 0,
		                kjtime: tempData[i].saleend,
		    		}
    				tempArray.push(false);
    			}
    			tempMoney += obj.money;
    			tempTime += obj.times;
    			dataTemp.push(obj)
    		}
    	}
    	this.setState({traceItem:dataTemp,checkselectItem:tempArray,traceTotalMoney:tempMoney,traceTotalIssue:tempTime});
    };
    render() {
    	const navList = [
            {
                link: '',
                text: '同倍追号'
            },{
                link: '',
                text: '翻倍追号'
            },{
                link: '',
                text: '利润率追号'
            }
        ];
        const periodsList = ['5期','10期', '20期', '50期', '全部'];
        return (
            <Modal
                width='865px'
                visible={stateVar.tracevisible}
                title= {<ModelView defaultIndex={this.state.traceTitleIndex} onChangeNavIndex={this.onChangeNavIndex} navList = {navList}/>}
                onCancel={()=>{this.getSuperaddition()}}
                maskClosable={false}
                footer={null}
                className="modal_content"
            >
                <div className="modal_main" value={stateVar.todayAndTomorrow[0]}>
    				<div className="m_m_content clear">
    					<div style={{display:this.state.traceTitleIndex ==0 ? 'block':'none'}}>
	                        <div className="modal_periods left">
	                            <p className="m_p_text left">追号期数</p>
	                            <ul className="m_periods_list left">
	                                {
	                                    periodsList.map((value, index)=>{
	                                        return <li key={index} className={this.state.periodsIndex === index ? 'm_periods_active' : ''} onClick={()=>this.navTraceIssue(index,value)}>{value}</li>
	                                    })
	                                }
	                            </ul>
	                        </div>
	                        <div className="periods_input left">
	                            <span>手动输入</span>
	                            <InputNumber min={1} max={50} value={this.state.traceIssueNum} onChange={(value)=>{this.onChangeInputTraceIssue(value)}} />
	                            <span>期</span>
	                        </div>
	                        <div className="multiple_input left">
	                            <span>倍数</span>
	                            <InputNumber min={1} max={9999} value={this.state.traceTimeNum} onChange={(value)=>{this.onChangeInputTimeIssue(value)}} />
	                            <span>倍</span>
	                        </div>
	                        <Button type="primary" className="m_m_btn" loading={this.state.loading} onClick={()=>this.enterLoading()}>
	                            生成
	                        </Button>
                        </div>
                        <div style={{display:this.state.traceTitleIndex ==2 ? 'block':'none'}}>
                        	<div className="periods_input left">
	                            <span>追号期数</span>
	                            <InputNumber min={1} max={50} value={this.state.traceIssueNum} onChange={(value)=>{this.onChangeInputTraceIssue(value)}} />
	                            <span>期</span>
	                        </div>
	                        <div className="multiple_input left">
	                            <span>倍数</span>
	                            <InputNumber min={1} max={9999} value={this.state.traceTimeNum} onChange={(value)=>{this.onChangeInputTimeIssue(value)}} />
	                            <span>倍</span>
	                        </div>
	                        <div className="periods_input left">
	                            <span>最低收益</span>
	                            <InputNumber min={1} max={100} value={this.state.traceLowMoneyNum} onChange={(value)=>{this.onChangeLowMoney(value)}} />
	                            <span>%</span>
	                        </div>
	                        <Button type="primary" className="m_m_btn" loading={this.state.loading} onClick={()=>this.enterLoading()}>
	                            生成
	                        </Button>

	                    </div>
	                    <div style={{display:this.state.traceTitleIndex ==1 ? 'block':'none'}}>
	                    	<div className="multiple_input left">
	                            <span>追号期数</span>
	                            <InputNumber min={1} max={50} value={this.state.traceIssueNum} onChange={(value)=>{this.onChangeInputTraceIssue(value)}} />
	                            <span>期</span>
	                        </div>
	                        <div className="periods_input left">
	                            <span>隔</span>
	                            <InputNumber min={1} max={50} value={this.state.traceIssueSpaceNum} onChange={(value)=>{this.onChangeInputSpaceTraceIssue(value)}} />
	                            <span>期</span>
	                        </div>
	                        <div className="periods_input periods_inputlv left">
	                            <span>，&nbsp;倍数 X</span>
	                            <InputNumber min={1} max={9999} value={this.state.traceTimeSpaceNum} onChange={(value)=>{this.onChangeInputSpaceTimeIssue(value)}} />
	                            <span>倍</span>
	                        </div>
	                        <Button type="primary" className="m_m_btn" loading={this.state.loading} onClick={()=>this.enterLoading()}>
	                            生成
	                        </Button>
	                    </div>
                    </div>
                    <div className="m_m_table">
                    	<div className='thClass'>
                    		<div style={{width:'15%'}}>序号</div>
                    		<div style={{width:'20%'}}><Checkbox onChange={(e)=>this.onCheckAllChange(e)} checked={this.state.checkAll}>期数</Checkbox></div>
                    		<div style={{width:'25%'}}>倍率</div>
                    		<div style={{width:'15%'}}>金额</div>
                    		<span className='span' style={{width:'25%'}}>开奖时间</span>
                    	</div>
                    	<div className='tableTrace'>
	                        <table>
	                        	<tbody>
		                        	{
		                        		this.state.traceItem.map((val,index)=>{
		                        			return(
		                        				<tr key={index}>
					                        		<td style={{width:'15%'}}>{index+1}</td>
					                        		<td style={{width:'20%'}}><Checkbox onChange={(e)=>{this.selectItem(index,e)}} checked={this.state.checkselectItem[index]}>{val.age}</Checkbox></td>
					                        		<td style={{width:'25%'}}><InputNumber min={0} disabled={!this.state.checkselectItem[index]} max={9999} value={val.times} onChange={(value)=>{this.traceInput(index,value)}} />&nbsp;倍</td>
					                        		<td style={{width:'15%',color:'#cb1414'}}>{val.money.toFixed(4)}元</td>
					                        		<td style={{width:'25%'}}>{val.kjtime}</td>
		                        				</tr>
		                        			)
		                        		})
		                        	}
	                        	</tbody>
                        </table>
                        </div>
                    </div>
                    <div className="m_m_footer clear">
                        <div className="m_m_left_btn left">
                            <Checkbox onChange={(e)=>this.onChangeTraceStop(e)}>中奖后停止追号</Checkbox>
                            <Button type="primary" onClick={()=>this.clearTraceNumber()}>清空号码</Button>
                        </div>
                        <ul className="m_m_footer_info right">
                            <li>
                                <span>总期数：</span>
                                <em>{this.state.traceTotalIssue}</em>
                                <span>&nbsp;期，</span>
                            </li>
                            <li>
                                <span>追号总金额：</span>
                                <em>{this.state.traceTotalMoney.toFixed(4)}</em>
                                <span>&nbsp;元</span>
                            </li>
                            <li>
                                <Button type="primary"
                                        loading={this.state.chaseLoading}
                                        onClick={()=>this.enterChaseLoading()}
                                        size="large"
                                >
                                    确定追号投注
                                </Button>
                            </li>
                        </ul>
                    </div>
                </div>
            </Modal>
        )
    }
}
