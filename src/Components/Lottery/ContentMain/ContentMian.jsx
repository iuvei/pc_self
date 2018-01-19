import React, {Component} from 'react';
import Websocket from 'react-websocket';
import {observer} from 'mobx-react';
import { Select,Table, Modal,message, InputNumber, Row, Col, Checkbox,Button, Radio ,Switch,Tooltip,Spin,notification,Icon } from 'antd';
import mobx,{computed, autorun} from "mobx";
import QueueAnim from 'rc-queue-anim';
import './ContentMain.scss'
import './Modal/Modal.scss'

import Fatch from '../../../Utils'
import { stateVar } from '../../../State'
import Method from '../method.js'
import commone from '../commone.js'

import common from '../../../CommonJs/common';

import LeftSider from './../LeftSider/LeftSider'
import BetRecordTable from '../BetRecordTable/BetRecordTable'
import ModelView from './../../Common/ChildNav/ChildNav'
import AlterModal from './../../Common/LotteryModal/LotteryModal'

import minus_multiple from './Img/minus_multiple.png';
import add_multiple from './Img/add_multiple.png';
import close from './Img/close.png';

import Transform from '../../../CommonJs/transform.react.js';

const Option = Select.Option;
@observer
export default class ContentMian extends Component {
    constructor(props){
        super(props)
        this.state = {
        	kjStopFlag:[],
        	kjStopallFlag:false,
        	kjStopTime:0,
            navIndex : 0,
            navTwoIndex : 0,
            navThreeIndex : 0,
            navFourIndex : 0,
            wqbsgIndex:0,
            renIndex:0,
            hotIndex : 0,
            hotSwitch : false, // 冷热遗漏开关
            multipleValue : 1, // 投注倍数
            multipleMmcValue : 1,//连续投注次数
            modes:[],
            selectYjf: 0, // 选择元角分模式
            tracevisible: false, //隐藏子组件模态框
            lotteryMethod:[],//单个彩种玩法
            statusClass : true,
            numss:0,
            money:0,
            checked: true,
            omodel:'1',
            textAreaValue:'',
            todayAndTomorrow : [],
            todayIssue:[],
            tomorrowIssue:[],
            timeShow:{hour:'00',second:'00',minute:'00',day:'00'},
            issueIndex:'请选择期号',
            code : [],//开奖号码
            animateCode:[],//开奖动画号码
        	nowIssue:'??????',//上一期前期号
        	nextIssue:'??????',//当前期号
        	historyBet:[],//投注记录
        	el1: {rotateZ: 0},
        	ifRandom:false,
        	betokObj:{},
        	visible:false,
        	issueArray:[],
        	booleanValue:true,
        	imgUrl:'pk10',
        	mmccode:['-','-','-','-','-'],
        	mmcmoni:true,
        	isPrizeStop:false,
        	directFlag:false,
        	defaultposition:[],
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
        this.lotteryOkBet = this.lotteryOkBet.bind(this);
        this.getBetHistory = this.getBetHistory.bind(this);
        this.getKjHistory = this.getKjHistory.bind(this);
        this.onChangeNavIndex = this.onChangeNavIndex.bind(this);
    };
    // 音效开关
    onChangeSound(checked) {
        if(checked){
        	common.setStore('soundswitch','off');
        }else{
        	common.setStore('soundswitch','on');
        }
    };
    //确定投注页面
    lotteryOkBet(param){
    	if(param){
    		this.setState({visible:false});
    	}else{
    		this.setState({visible:false,traceItem:[],checkselectItem:[]});
    		this.getSuperaddition();
    	}
    }
    handleChangeIssue( value ) {
        this.setState({issueIndex:value});
    };
    handleChangeRatio(value) {
        this.setState({omodel:value});
    };
    handleSizeChange(e) {
        console.log(e.target.value)
    };
    toggleChecked = () => {
	    this.setState({ checked: !this.state.checked });
	}
	toggleDisable = () => {
	    this.setState({ disabled: !this.state.disabled });
	}
	//任选万千百十个复选框切换
	onChangeCheckBox (e,a,b) {
		$.lt_position_sel = [];
		if(e.target.checked){
			$(".selPosition .checkBox").eq(a).addClass('selected');
		}else{
			$(".selPosition .checkBox").eq(a).removeClass('selected');
		}
		$(".selPosition .checkBox").each((index,val)=>{
			if($(val).hasClass('selected')){
				$.lt_position_sel.push(index)
			}
		})
		let num = Method.checkNum()
        this.getNumMoney(num);
	}
    // 监听输入倍数
    multipleValue(val) {
        let value = val;
        value = parseInt(value);
        if (isNaN(value) || typeof value != 'number') {
            value = 1
        }
        this.setState({multipleValue: value},()=>{
        	this.getNumMoney(this.state.numss)
        });
    };
    // 减少倍数
    minusMultiple() {
        this.state.multipleValue <= 1 ? this.setState({multipleValue: 1},()=>{
        	this.getNumMoney(this.state.numss)
        }) : this.setState({multipleValue: (this.state.multipleValue - 1)},()=>{
        	this.getNumMoney(this.state.numss)
        })
    };
    // 增加倍数
    addMultiple() {
        this.setState({multipleValue: this.state.multipleValue + 1},()=>{
        	this.getNumMoney(this.state.numss)
        })
    };
    // 减少连续开奖次数
    minusMmcMultiple() {
    	if(stateVar.BetContent.lt_same_code.length == 0){
    		alert('请先选择号码');
    		return;
    	}
        this.state.multipleMmcValue <= 1 ? this.setState({multipleMmcValue: 1}) : this.setState({multipleMmcValue: (this.state.multipleMmcValue - 1)},()=>{
        	stateVar.BetContent.totalDan = stateVar.BetContent.lt_same_code.length * this.state.multipleMmcValue;//总单数增加
	        let tempNum = 0,tempMoney = 0;
	        for(let i=0;i<stateVar.BetContent.lt_same_code.length;i++){
	        	tempNum += parseInt(stateVar.BetContent.lt_same_code[i].nums);
	        	tempMoney += Number(stateVar.BetContent.lt_same_code[i].money);
	        }
	        stateVar.BetContent.totalNum = tempNum * this.state.multipleMmcValue;
	       	stateVar.BetContent.totalMoney = tempMoney * this.state.multipleMmcValue*10000/10000;
	       	stateVar.BetContent.lt_trace_base = tempMoney * this.state.multipleMmcValue;
        })
    };
    // 增加连续开奖次数
    addMmcMultiple() {
    	if(stateVar.BetContent.lt_same_code.length == 0){
    		alert('请先选择号码');
    		return;
    	}
        this.setState({multipleMmcValue: this.state.multipleMmcValue + 1},()=>{
        	stateVar.BetContent.totalDan = stateVar.BetContent.lt_same_code.length * this.state.multipleMmcValue;//总单数增加
	        let tempNum = 0,tempMoney = 0;
	        for(let i=0;i<stateVar.BetContent.lt_same_code.length;i++){
	        	tempNum += parseInt(stateVar.BetContent.lt_same_code[i].nums);
	        	tempMoney += Number(stateVar.BetContent.lt_same_code[i].money);
	        }
	        stateVar.BetContent.totalNum = tempNum * this.state.multipleMmcValue;
	       	stateVar.BetContent.totalMoney = tempMoney *10000*this.state.multipleMmcValue/10000;
	       	stateVar.BetContent.lt_trace_base = tempMoney * this.state.multipleMmcValue;
        })
    };
    //输入连续开奖次数
    multipleMmcValue(event) {
        let value = event.target.value;
        value = parseInt(value);
        if ( isNaN(value) || typeof value != 'number') {
            value = 1
        }
        this.setState({multipleMmcValue: value},()=>{
        	let tempNum = 0,tempMoney = 0;
	        for(let i=0;i<stateVar.BetContent.lt_same_code.length;i++){
	        	tempNum += parseInt(stateVar.BetContent.lt_same_code[i].nums);
	        	tempMoney += Number(stateVar.BetContent.lt_same_code[i].money);
	        }
	        stateVar.BetContent.totalNum = tempNum * this.state.multipleMmcValue;
	       	stateVar.BetContent.totalMoney = tempMoney*10000 * this.state.multipleMmcValue/10000;
	       	stateVar.BetContent.lt_trace_base = tempMoney * this.state.multipleMmcValue;
        });
        if(stateVar.BetContent.lt_same_code.length == 0){
    		alert('请先选择号码');
    	}
    };
    //中奖追停选中框
    onChangeStop(e){
    	this.setState({isPrizeStop:e.target.checked});
    }
    //初始化默认调用方法
    componentDidMount() {
    	this.initData();
    };
    handleData(data){
    	var message = eval('('+ data +')');
    	if(message.status == 1){
    		let tempType = message.data.type;
    		if(tempType == 1){
    			let tempData = message.data.data;
    			if(tempData){
    				if(tempData.lotteryid == stateVar.nowlottery.lotteryBetId){
    					this.actionSound('kj');
    					let tempCode;
    					if(tempData['number'].length <= 5){
	    					tempCode = tempData['number'].split('');
	    				}else{
	    					tempCode = tempData['number'].split(' ');
	    				}
	    				this.setState({kjStopallFlag:true});
    					this.setState({code:tempCode,nowIssue:tempData.expectedIssue});
    					this.getKjHistory(true);
    				}
    			}
    		}else if(tempType == 4 || tempType == 3){
    			this.getBetHistory();
    		}else if(tempType == 8){
    			alert(33)
    			common.removeStore(common.getStore('userId'))
    			this.getLotteryData();
    		}else if(tempType == 7){
    			notification.open(
    				{
					    message: message.data.data.title,
					    description: message.data.data.content,
					    placement:'bottomRight',
					    duration:10,
					    icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
					}
    			)
    		}
    	}
    }
    openWebsocket(){
    	var msg = {"method":"join","uid":common.getStore('userId'),"hobby":1};
    	this.refWebSocket.state.ws.send(JSON.stringify(msg))
    }
    initData(){
    	let lotteryData = require('../../../CommonJs/common.json');
    	let tempLotteryType = {};
    	let tempLotteryLength;
    	for(let i = 0,lotteryDt=lotteryData.lotteryType;i<lotteryDt.length;i++){
    		if(lotteryDt[i]['nav'] == stateVar.nowlottery.lotteryId){
				stateVar.nowlottery.cuimId = lotteryDt[i]['curmid'];
				stateVar.nowlottery.defaultMethodId = lotteryDt[i]['methodid'];
				stateVar.nowlottery.lotteryBetId = lotteryDt[i]['lotteryid'];
				stateVar.nowlottery.cnname = lotteryDt[i]['cnname'];
				stateVar.nowlottery.imgUrl =  lotteryDt[i]['imgUrl'];
				tempLotteryLength = lotteryDt[i].lotterLength == undefined ? 5 : lotteryDt[i].lotterLength;
    		}
    		if(lotteryDt[i]['lotteryid'] != 23){
				tempLotteryType[lotteryDt[i]['nav']] = lotteryDt[i]['curmid']
			}
    	}
    	let tempArrCode = [];
    	let tempStopFlag = [];
    	for(let i=0;i<tempLotteryLength;i++){
    		tempArrCode.push('-');
    		tempStopFlag.push(false);
    	}
    	this.setState({code:tempArrCode,kjStopFlag:tempStopFlag,animateCode:tempArrCode,tempLotteryLength:tempLotteryLength},()=>{
    		this.kjanimate(0);
    	});
    	stateVar.alllotteryType = tempLotteryType;//所有彩种类型
    	stateVar.openLotteryFlag = false;//控制彩种是否可以点击
    	this.setState({
	    		kjStopFlag:[],
	        	kjStopallFlag:false,
	        	kjStopTime:0,
    			todayAndTomorrow:[],
    			todayIssue:[],
	    		tomorrowIssue:[],
	    		timeShow:{hour:'00',second:'00',minute:'00',day:'00'},
	    		nowIssue:'??????',
	        	nextIssue:'??????',
	        	navIndex:0,
	        	navTwoIndex: 0,
	        	navThreeIndex:0,
	        	navFourIndex:0,
	        	renIndex:0,
	        	textAreaValue:'',
	        	historyBet:[],
	        	modes:[],
            	selectYjf: 0,
            	issueIndex:'请选择期号',
            	defaultposition:[],
            	lotteryMethod:[],
            	numss:0,
            	money:0,
            	checked: true,
            	omodel:'1'
        	},()=>{
    		stateVar.BetContent.lt_same_code = [];
	    	stateVar.BetContent.totalDan = 0;
	    	stateVar.BetContent.totalNum = 0;
	       	stateVar.BetContent.totalMoney = 0;
	       	stateVar.BetContent.lt_trace_base = 0;
	       	stateVar.kjNumberList = []
        	$("li.number_active").removeClass('number_active');
        	$(".lh .hover").removeClass('hover');
        	$(".zx span").removeClass('hover');
        	//判断玩法是否有缓存，没有则重新获取所有玩法
	    	let ifMehtod = common.getStore(common.getStore('userId')) == (null || undefined) ? false : true;
	    	if(ifMehtod){
				this.setOneMethod(common.getStore(common.getStore('userId')));
	    	}else{
	    		this.getLotteryData();
	    	}
    		this.getFutureIssue();
	    	this.getlotterycode();
	    	this.getBetHistory();
	    	this.getKjHistory();
    	});
    };
    /**
     Function 开奖动画
     param 号码个数
     */
    kjanimate(b){
    	let param = this.state.tempLotteryLength;
    	if(this.state.kjStopTime >= 5){
    		return;
    	}
		let tempCode = [];
		for(let i=0; i<param;i++){
			if(stateVar.nowlottery.cnname.indexOf('11选5') > -1){
				tempCode.push(Math.floor(Math.random()*2)+''+Math.floor(Math.random()*10));
			}else{
				tempCode.push(Math.floor(Math.random()*10));
			}
		}
		this.setState({animateCode:tempCode},()=>{
			setTimeout(()=>{
				if(b < 800){
					b = b + 30;
					this.kjanimate(b);
				}else{
					if(this.state.kjStopallFlag){
	    				let tempI = this.state.kjStopTime;
	    				setTimeout(()=>{
	    					let tempArr = [];
	    					for(let i=0;i<this.state.code.length;i++){
	    						if(i <= tempI){
	    							tempArr.push(true);
	    						}else{
									tempArr.push(false);
	    						}
	    					}
	    					tempI += 1;
	    					this.setState({kjStopFlag:tempArr,kjStopTime:tempI},()=>{
	    						$(".kjCodeClass").eq(tempI-1).animate({fontSize:"36px"},50,()=>{
	    							$(".kjCodeClass").animate({fontSize:"30px"},200);
	    						});
	    					});
	    				},50);
	    				this.kjanimate(600);
	    			}else{
	    				this.kjanimate(800);
	    			}
				}
    		},50);
		});

    };
    //获取所有彩种玩法
    getLotteryData(){
    	Fatch.lotteryBets({
    		method : "POST",
    		body : JSON.stringify({sCurmids:stateVar.alllotteryType})}
    		).then((data)=>{
    			this.setState({ loading: false });
    			if(data.status == 200){
    				let tempData = data.repsoneContent;
    				this.getMmcMethod(tempData);
    				this.setOneMethod(tempData);
    			}
    		})
    };
    //获取秒秒彩玩法
    getMmcMethod(val){
    	Fatch.aboutMmc(
    		{
    			method:'post',
    			body:JSON.stringify({sCurmids:311700,lotteryid:23})
    		}
    	).then((data)=>{
    		stateVar.openLotteryFlag = true;
			if(data.status == 200){
				let tempData = data.repsoneContent;
				let tempBets = val;
				tempBets['mmc'] = tempData;
				common.setStore(common.getStore('userId'), tempBets);
				if(stateVar.nowlottery.lotteryBetId == 23){
					this.setOneMethod(tempData);
				}
			}
		})
    };
    //设置单个彩种玩法 val:所有玩法信息
    setOneMethod(val){
    	let tempIndex = 0;
    	let tempMsg;
    	for(let i in val){
			if(i == stateVar.nowlottery.lotteryId){
				let tempVal = val[i];
				if(tempVal.msg != undefined){
					tempMsg = tempVal.msg;
					break;
				}else{
					for(let j=0;j<tempVal.length;j++){
						let tempK = tempVal[j].label;
						for(let k=0;k<tempK.length;k++){
							let tempS = tempK[k].label;
							for(let s=0;s<tempS.length;s++){
								if(tempS[s].methodid == stateVar.nowlottery.defaultMethodId && tempS[s].selectarea.type != "input"){
									tempIndex = j;
									break;
								}
							}
						}
					}
					this.setState({lotteryMethod:val[i],navIndex:tempIndex},()=>{
						//相关玩法的state值赋值
	    				this.selectAreaData(this.state.lotteryMethod);
					})
				}
			}
    	}
    	if(tempMsg){
    		alert(tempMsg);
    	}
    };
    //获取最近一期开奖号码和期号
    getlotterycode(a){
    	if(stateVar.nowlottery.lotteryBetId == 23){
    		return false;
    	}
    	Fatch.aboutBet({
    		method:"POST",
    		body:JSON.stringify({flag:'getlotterycode',lotteryid:stateVar.nowlottery.lotteryBetId})
    		}).then((data)=>{
    			let tempData = data.repsoneContent;
    			let tempArray = this.state.todayAndTomorrow;
    			if(data.status == 200){
    				if(a){
    					while(true){
							if(this.state.todayAndTomorrow.length == 0){
								break;
							}
	    					if(tempData.curissue != tempArray[0].issue){
	    						tempArray.splice(0,1);
	    					}else{
	    						break;
	    					}
	    				}
    				}
    				let tempCode = [];
    				if(tempData.code.length <= 5){
    					tempCode = tempData.code.split('');
    				}else{
    					tempCode = tempData.code.split(' ');
    				}
    				if(this.state.code.join('') == tempCode.join('')){
    					this.setState({kjStopallFlag:false});
    				}else{
    					this.setState({kjStopallFlag:true});
    				}
    				this.setState({code:tempCode,nowIssue:tempData.issue,nextIssue:tempData.curissue,issueIndex:tempArray.length != 0 ? tempArray[0].issue : '??????'},()=>{
    					if(a && tempArray.length != 0){
    						this.setState({todayAndTomorrow:tempArray});
    					}else{
    						this.getFutureIssue();
    					}
    					this.actionTrace();
    					this.tick(tempData.datetime,tempData.cursaleend);
    				});
    			}
    		})
    };
    //秒秒彩模拟开号
    monikj(){
    	this.setState({mmcmoni:true});
    	$(".monikj span").html('开奖中...')
    	Fatch.aboutMmc({
    		method:"POST",
    		body:JSON.stringify({"flag":"getcodes","lotteryid":23})
    		}).then((data)=>{
    			this.setState({mmcmoni:false});
    			$(".monikj span").html('模拟开奖')
    			data = JSON.parse(data);
    			let tempData = data.repsoneContent;
    			if(data.status == 200){
    				this.setState({mmccode:tempData.split('')});
					this.getBetHistory();
					this.getKjHistory();
    			}
    		})
    };
    //得到投注记录
     getBetHistory(){
     	let tempObj = {flag:'getprojects',lotteryid:stateVar.nowlottery.lotteryBetId,issuecount:20}
     	if(stateVar.nowlottery.lotteryBetId == 23){
     		Fatch.aboutMmc({
	    		method:"POST",
	    		body:JSON.stringify(tempObj)
	    		}).then((data)=>{
    			let tempData = data.repsoneContent;
    			if(data.status == 200){
    				stateVar.openLotteryFlag = true;
					this.setState({historyBet:tempData});
    			}
    		})
     	}else{
     		Fatch.aboutBet({
	    		method:"POST",
	    		body:JSON.stringify(tempObj)
	    		}).then((data)=>{
    			let tempData = data.repsoneContent;
    			if(data.status == 200){
					this.setState({historyBet:tempData});
    			}
    		})
     	}
    };
    //得到最近历史开奖号码
     getKjHistory(flag){
     	if(stateVar.nowlottery.lotteryBetId == 23){
     		Fatch.aboutMmc({
	    		method:"POST",
	    		body:JSON.stringify({lotteryid:stateVar.nowlottery.lotteryBetId,issuecount:20,flag:'getlastcode'})
	    		}).then((data)=>{
	    			let tempData = data.repsoneContent;
	    			this.setState({mmcmoni:false});
	    			if(data.status == 200){
	    				if(tempData.length > 0){
	    					this.setState({mmccode:tempData[0].split(' ')})
	    				}
	    				stateVar.mmCkjNumberList = tempData;
	    			}
    			})
     	}else{
     		let tempObj = {};
     		if(flag){
     			tempObj = {lotteryid:stateVar.nowlottery.lotteryBetId,issuecount:20,curmid:stateVar.nowlottery.cuimId,cacheTrue:2};
     		}else{
     			tempObj = {lotteryid:stateVar.nowlottery.lotteryBetId,issuecount:20,curmid:stateVar.nowlottery.cuimId};
     		}
     		Fatch.ksHistoery({
	    		method:"POST",
	    		body:JSON.stringify(tempObj)
	    		}).then((data)=>{
	    			if(data.status == 200){
	    				stateVar.kjNumberList = data.repsoneContent;
	    			}
	    		})
     	}
    };
    //获取未来期
    getFutureIssue(){
    	//返回根据彩种类型返回彩种ID
    	if(stateVar.nowlottery.lotteryBetId == 23){
    		return false;
    	}
    	Fatch.aboutBet({
    		method:"POST",
    		body:JSON.stringify({flag:'getTodayTomorrowIssue',lotteryid:stateVar.nowlottery.lotteryBetId})
    		}).then((data)=>{
    			if(data.status == 200){
    				stateVar.openLotteryFlag = true;
					let todayData = data.repsoneContent.today;
					let tomorrowData = data.repsoneContent.tomorrow;
					todayData = todayData.concat(tomorrowData);
					this.setState({tomorrowIssue:tomorrowData,todayIssue:todayData,todayAndTomorrow:todayData,issueIndex:todayData[0].issue},()=>{
						this.actionTrace();
					});
    			}
    		})
    };
    //开奖倒计时
    tick(starttime,endtime){
        if( starttime == "" || endtime == "" ){
            $.lt_time_leave = 0;
        }else{
            $.lt_time_leave = (commone.format(endtime).getTime()- commone.format(starttime).getTime())/1000;//总秒数
        }
        let hsm = commone.diff($.lt_time_leave);
        this.setState({timeShow:hsm});
    	window.interval = setInterval(()=>{
    		if($.lt_time_leave > 0 && ($.lt_time_leave % 240 == 0 || $.lt_time_leave == 60 )){//每隔4分钟以及最后一分钟重新读取服务器时间
    			Fatch.aboutBet({
		    		method:"POST",
		    		body:JSON.stringify({flag:'gettime',lotteryid:stateVar.nowlottery.lotteryBetId,issue:this.state.nextIssue})
		    		}).then((data)=>{
		    			if(data.status == 200){
		    				let tempData = data.repsoneContent || 0;
		    				tempData = parseInt(tempData,10);
                            tempData = isNaN(tempData) ? 0 : tempData;
                            tempData = tempData <= 0 ? 0 : tempData;
                            $.lt_time_leave = tempData;
		    			}
		    		})
            }
    		let tempTime = commone.diff($.lt_time_leave);
    		this.setState({timeShow:tempTime});
    		if($.lt_time_leave == 60){
    			this.actionSound(60);
    		}
    		if( $.lt_time_leave == 0 ){//结束
    			this.actionSound(0);
    			this.setState({kjStopallFlag:false,kjStopTime:0,kjStopFlag:[false,false,false,false,false]},()=>{
    				this.kjanimate(0);
    			});

                clearInterval(window.interval);
				message.config({
				  top:'50%',
				  duration: 3
				});
				this.setState({visible:false});
				message.info('当期销售已截止，请进入下一期购买');
				this.getlotterycode(true);
    			this.getBetHistory();
    			this.getKjHistory();
            }
    		$.lt_time_leave = $.lt_time_leave - 1;
    	},100000);
    }
    componentWillUnmount() {
    	stateVar.BetContent = {
	        lt_same_code:[],totalDan:0,totalNum:0,totalMoney:0,lt_trace_base:0
	    };
	    stateVar.openLotteryFlag = true;
	    stateVar.checkLotteryId= true;
	    clearInterval(window.interval);
	}
    //处理声音
    actionSound(param){
    	let tempHtml;
    	if(param == 0){
    		tempHtml = document.getElementById('fengdansound');
    	}else if(param == 60){
    		tempHtml = document.getElementById('minutesound');
    	}else if(param == 'kj'){
    		tempHtml = document.getElementById('kjsound');
    	}else{
    		return;
    	}
    	if(common.getStore('soundswitch') == 'off'){
    		tempHtml.muted = true;
    	}else{
    		tempHtml.muted = false;
    	}
    	tempHtml.play();
    };
    //玩法切换
     check_nav_index( index ){
        return index === this.state.navIndex ? "nav_list_active" : ""
    };
    //玩法内容切换样式
    check_tow_index(a,b){
    	return (a == this.state.navTwoIndex && b == this.state.navThreeIndex) ? "method_details_active" : '';
    };
    //玩法title切换
    changeMethod(a,b){
    	 this.clearNum();
    	 this.setState({navIndex:a,navTwoIndex:b || 0,navThreeIndex:0,navFourIndex:0,renIndex:b,textAreaValue:''},()=>{
    	 	this.selectAreaData(this.state.lotteryMethod);
    	 });
    }
    //玩法gtitle内容切换
    methodClick(a,b){
    	/*
    	 c,龙虎庄闲
    	 **/
    	this.clearNum();
    	this.setState({navTwoIndex:a,navThreeIndex:b,navFourIndex:0,wqbsgIndex:0,textAreaValue:'',defaultposition:[]},()=>{
    		this.selectAreaData(this.state.lotteryMethod);
    	});
    };
    //设置号码方法
    changeNum(obj){
    	/*
    	 参数obj，目标元素
    	 **/
    	let tempFalg = true;
    	if(obj.target.tagName.toLowerCase() == 'p'){
    		tempFalg = false;
    	}
    	if(tempFalg){
    		if(obj.target.className == 'number_active'){
	    		this.unSelectNum(obj.target,false);
	    	}else{
	    		this.selectNum(obj.target,false);
	    	}
    	}else{
    		if(obj.target.parentNode.className == 'number_active'){
	    		this.unSelectNum(obj.target.parentNode,false);
	    	}else{
	    		this.selectNum(obj.target.parentNode,false);
	    	}
    	}
    }
    //取消选号
    unSelectNum(a,isButton){
    	/*
    	 参数a，目标元素
    	 **/
    	if(!$(a).hasClass('number_active')){
    		return;
    	}
    	$(a).removeClass('number_active')
    	let aa = $(a).attr('value');
    	let b = Number($(a).attr('name').replace('lt_place_',''))
    	stateVar.aboutGame.data_sel[b] = stateVar.aboutGame.data_sel[b].filter((item)=>{
    		return item != aa;
    	})
    	if( !isButton ){//如果不是按钮触发则进行统计，按钮的统一进行统计
            let num = Method.checkNum()
            this.getNumMoney(num);
        }
    }
    //选中号码
    selectNum( a,isButton ){
    	/*
    	 参数a，目标元素
    	 **/
    	if($(a).hasClass('number_active')){
    		return;
    	}
    	$(a).addClass('number_active')
    	let tempA = $(a).attr('value');
    	let b = Number($(a).attr('name').replace('lt_place_',''))
    	let data_sel = stateVar.aboutGame.data_sel;
		tempA = tempA.replace(/\<div.*\<\/div>/g,"").replace(/\r\n/g,"");
		let methodname = Method.methodId[stateVar.aboutGame.methodID];
		if(methodname == "RYSMHDHD" || methodname == "RYSMDT" || methodname == "RYSMTS" || methodname == "RYSMZXBD" || methodname == "3XDT" || methodname == "3XHDHD"
			|| methodname == "ZU3BD" || methodname == "4XDT" || methodname == "4XHDHD" || methodname == "5XDT" || methodname == "5XHDHD" || methodname == "RYEMZUBD"
			|| methodname == "SXZU24DT" || methodname == "SXZU12DT" || methodname == "SXZU6DT" || methodname == "SXZU4DT"){
			if(methodname == "3XHDHD" || methodname == "4XHDHD" || methodname == "5XHDHD"){
				var danlen = 9;
			} else if(methodname == "RYSMHDHD"){
				var danlen = 8;
			} else if(methodname == "3XDT" || methodname == "RYSMDT" || methodname == "SXZU12DT"){
				var danlen = 2;
			} else if(methodname == "4XDT" || methodname == "SXZU24DT"){
				var danlen = 3;
			} else if(methodname == "5XDT"){
				var danlen = 4;
			} else if(methodname == "ZU3BD" || methodname == "RYSMZXBD" || methodname == "RYSMTS" || methodname == "RYEMZUBD" || methodname == "SXZU6DT"
					|| methodname == "SXZU4DT"){
				var danlen = 1;
			}
			if (data_sel[0].length + 1 > danlen && b == 0) {//判断此次点击是否要超出范围,并且是点击的第一行
				var lastnumber = data_sel[0][data_sel[0].length - 1];//获取最后一个号码
				$.each($('li[name="lt_place_0"][class="number_active"]'),function(i, n) {
					var tmphtml = $(this).attr("value");
					if (tmphtml == lastnumber) {
						$(this).attr("class", "");
						stateVar.aboutGame.data_sel[0] = stateVar.aboutGame.data_sel[0].filter((item)=>{
				    		return item != lastnumber
				    	})
					}
				})
			}
		}
		if(methodname == "RYSMHDHD" || methodname == "RYSMDT" || methodname == "3XDT" || methodname == "3XHDHD" || methodname == "4XDT"
			|| methodname == "4XHDHD" || methodname == "5XDT" || methodname == "5XHDHD" || methodname == "SXZU24DT" || methodname == "SXZU12DT"
			|| methodname == "SXZU6DT" || methodname == "SXZU4DT") {
			var unplace = 1 - b;
			if (data_sel[unplace].contains(tempA)) {//判断当前点击的这行的这个数值在另外一行中是否已经被选择
				$.each($('li[name="lt_place_' + unplace + '"][class="number_active"]'), function(i, n) {
					var tmphtml = $(this).attr("value");
					if (tmphtml == tempA) {
						$(this).attr("class", "");
						data_sel[unplace] = $.grep(data_sel[unplace], function(n, i) {//在另外一个数组中过滤掉当前点击的值
							return n == tempA;
						}, true)
					}
				})
			}
		}
        data_sel[b].push(tempA);//加入到数组中
        if( !isButton ){//如果不是按钮触发则进行统计，按钮的统一进行统计

			var numlimit = parseInt(stateVar.aboutGame.maxcodecount);
			if( numlimit > 0 ){
				if( data_sel[b].length > numlimit ){
					this.unSelectNum(a,b,false);
				}
			}
            let num = Method.checkNum();
            this.getNumMoney(num);
        }
    };
    //计算注数，金额
    getNumMoney(a){
    	/*
    	 参数a，注数，参数b，回调函书，可有可无
    	 **/
	    let times = parseInt(this.state.multipleValue,10);
	    if( isNaN(times) )
	    {
	        times = 1;
	    }
	    let money = Math.round(times * a * 2 * (this.state.modes[this.state.selectYjf].rate * 1000)) /1000;  //倍数*注数*单价 * 模式
	    money = isNaN(money) ? 0 : money;
    	this.setState({numss:a,money:money});
    }
    //切换圆角分模式
    changeMode(index){
    	this.setState({selectYjf: index},()=>{
        	this.getNumMoney(this.state.numss)
        });
    }
    //选择奇数号码
    selectOdd(obj){
        if( Number($(obj).attr('value')) % 2 == 1 ){
             this.selectNum(obj,true);
        }else{
             this.unSelectNum(obj,true);
        }
    };
    //选择偶数号码
    selectEven(obj){
        if( Number($(obj).attr('value')) % 2 == 0 ){
             this.selectNum(obj,true);
        }else{
             this.unSelectNum(obj,true);
        }
    };
    //选则大号
    selectBig(i,obj){
        if( i >= stateVar.aboutGame.noBigIndex ){
            this.selectNum(obj,true);
        }else{
            this.unSelectNum(obj,true);
        }
    };
    //选择小号
    selectSmall(i,obj){
        if( i < stateVar.aboutGame.noBigIndex ){
            this.selectNum(obj,true);
        }else{
            this.unSelectNum(obj,true);
        }
    };
    //大小全清动作行为
    dxqqAction(a,b){
    	/*
    	 a，玩法类型
    	 b,目标元素
    	 **/
    	if(1){
        	/*if(b.target.className == ''){
        		$(b.target).addClass("selected").siblings().removeClass("selected")
        	}*/
        	var td = $(b.target).parent().parent().children('ul')[0];
        	td = $(td);
            switch($(b.target).attr('name')){
                case 'all' :
					$.each(td.children(),(i,n)=>{
						this.selectNum(n,true);
					});
					break;
                case 'big' :
                    $.each(td.children(),(i,n) => {
                        this.selectBig(i,n);
                    });break;
                case 'small' :
                    $.each(td.children(),(i,n) => {
                        this.selectSmall(i,n);
                    });break;
                case 'odd' :
                    $.each(td.children(),(i,n) => {
                        this.selectOdd(n);
                    });break;
		        case 'even' :
                    $.each(td.children(),(i,n) => {
                        this.selectEven(n);
                    });break;
                case 'clean' :
					$.each(td.children(),(i,n) => {
						this.unSelectNum(n,true);
					});break;
                default : break;
            }
            let num = Method.checkNum();
            this.getNumMoney(num);
        }else{//或者玩法为大小单双即有清按钮的处理
            $.each($(this).parent().children(":first").children(),function(i,n){
                unSelectNum(n,true);
            });
            let num = Method.checkNum();
            this.getNumMoney(num);
        }
    }
    //导入文件
    importFile(e){
    	let target = e.target;
    	let isIE = /msie/i.test(navigator.userAgent) && !window.opera;
    	let fileSize = 0,filePath;
    	let fileSystem;
       	if(isIE && !target.files) {
	        filePath = target.value;
	        fileSystem = new ActiveXObject("Scripting.FileSystemObject");
	        let files = fileSystem.GetFile (filePath);
	        fileSize = files.Size;
       	} else {
       		filePath = target.value;
        	fileSize = target.files[0].size;
        }
        let size = fileSize / 1024;
        if(size>2000){
        	alert("附件不能大于2M");
        	target.value="";
        	return
        }
        let name=target.value;
        let _this = this;
        let fileName = name.substring(name.lastIndexOf(".")+1).toLowerCase();
        if(fileName == 'txt' || fileName == 'svg'){
        	if(isIE && !target.files) {
        		let ts = fileSystem.OpenTextFile(filePath,1);
				let s = ts.ReadLine();
        	}else{
        		let reader = new FileReader();
	            reader.readAsText(target.files[0], 'UTF-8');
	            reader.onload = function (evt) {
	                let filestring = evt.target.result;
	                _this.setState({textAreaValue:filestring},()=>{
	                	_this._inptu_deal();
	                });
	            }
        	}
        }else{
        	alert("请选择正确格式文件上传(txt,svg格式)！");
            target.value="";
            return
        }
    }
    //输入框监听处理
     _inptu_deal(e){
        var tmepS = e ? e.target.value : $(".textAreaClass").val();
        var m = tmepS.replace(/[^\s-\r,;，；０１２３４５６７８９0-9]/g,"");
        tmepS = $.trim(tmepS.replace(/[^\s\r,;，；０１２３４５６７８９0-9]/g,""));
        let methodname = Method.methodId[stateVar.aboutGame.methodID];
        switch( methodname ){
            case 'SDZX3' :
            case 'SDZU3' :
            case 'SDZX2' :
            case 'SDRX1' :
            case 'SDRX2' :
            case 'SDRX3' :
            case 'SDRX4' :
            case 'SDRX5' :
            case 'SDRX6' :
            case 'SDRX7' :
            case 'SDRX8' :
            case 'SDZU2' : tmepS = tmepS.replace(/[\r\n,;，；]/g,"|").replace(/(\|)+/g,"|"); break;
            case 'PK10ZX2':
            case 'PK10ZX3':
            case 'PK10ZX4':
            case 'PK10ZX5':
            case 'PK10ZX6':
            	tmepS = Method.play.formatInputNumbers();
            	stateVar.aboutGame.data_sel[0] = tmepS;
            	break;
            default: tmepS = tmepS.replace(/[\s\r,;，；　]/g,"|").replace(/(\|)+/g,"|"); break;
        }
	    if(methodname.indexOf("PK10ZX") === -1){
            tmepS = tmepS.replace(/０/g,"0").replace(/１/g,"1").replace(/２/g,"2").replace(/３/g,"3").replace(/４/g,"4").replace(/５/g,"5").replace(/６/g,"6").replace(/７/g,"7").replace(/８/g,"8").replace(/９/g,"9");
            if( tmepS == "" ){
	           	stateVar.aboutGame.data_sel[0] = []; //清空数据
	        }else{
	            stateVar.aboutGame.data_sel[0] = tmepS.split("|");
		  	}
        }
        this.setState({textAreaValue:m},()=>{
        	this.getNumMoney(Method.checkNum());
        });
    };
    //删除重复号
    deleteSameNumber(){
        let err = this.dumpNum(true);
        let methodname = Method.methodId[stateVar.aboutGame.methodID];
        if(methodname.indexOf('PK10ZX') != -1){
        	if(err.length > 0){
	            let error_num = stateVar.savePkInput.error_num;
	            let repeat_num = stateVar.savePkInput.repeat_num;
	            if (error_num.length > 0 || repeat_num.length > 0) {
	                this.setState({textAreaValue:err.join(',')},()=>{
	                	this._inptu_deal();//重新统计
	                })
	                alert('已删除以下重复号'+'\r\n'+err.join(";"));
	            } else {
	                alert("没有重复及错误号码！");
	            }
	        	return false;
        	}
    	}
        if( err.length > 0 ){//如果有重复号码
            this.getNumMoney(Method.checkNum());
            switch( methodname ){
                case 'SDZX3' :
                case 'SDZU3' :
                case 'SDZX2' :
                case 'SDRX1' :
                case 'SDRX2' :
                case 'SDRX3' :
                case 'SDRX4' :
                case 'SDRX5' :
                case 'SDRX6' :
                case 'SDRX7' :
                case 'SDRX8' :
                case 'SDZU2' :
                	this.setState({textAreaValue:stateVar.aboutGame.data_sel[0].join(" ")},()=>{
	                	this._inptu_deal();
	                });
                   	alert('已删除以下重复号'+'\r\n'+err.join(";"));
                   	break;
                default :
                	this.setState({textAreaValue:stateVar.aboutGame.data_sel[0].join(" ")},()=>{
	                	this._inptu_deal();
	                });
                   	alert('已删除以下重复号'+'\r\n'+err.join(" "));
                  	break;
            }
        }else{
            alert('没有重复号码');
        }
    };
	//重复号处理
    dumpNum(isdeal){
        var l   = stateVar.aboutGame.data_sel[0].length;
        var err = [];
        var news= []; //除去重复号后的结果
        if( l == 0 ){
            return err;
        }
        for(let i=0; i<l; i++ ){
            if( $.inArray(stateVar.aboutGame.data_sel[0][i],err) != -1 ){
                continue;
            }
            for( let j=i+1; j<l; j++ ){
                if( stateVar.aboutGame.data_sel[0][i] == stateVar.aboutGame.data_sel[0][j] ){
                    err.push(stateVar.aboutGame.data_sel[0][i]);
                    break;
                }
            }
            news.push(stateVar.aboutGame.data_sel[0][i]);
        }
        if( isdeal ){//如果是做删除重复号的处理
            stateVar.aboutGame.data_sel[0] = news;
        }
        return err;
    };
    //清除选中号码
    clearNum(){
    	$('li[class="number_active"]').attr("class","");
    	this.setState({numss:0,money:0,multipleValue:1})
    }
    //清除输入框的内容
    cleartextArea(){
    	this.setState({textAreaValue:''},()=>{
    		$(".textAreaClass").val('');
    		this._inptu_deal();
    	});
    }
    //直接投注
    directBet(){
		this.addNum(true);
    }
    //添加号码
    addNum(param){
    	let nums  = this.state.numss;//投注注数取整
        let times = this.state.multipleValue;//投注倍数取整
        let money = Math.round(times * nums * 2 * (this.state.modes[this.state.selectYjf].rate * 1000)) /1000;  //倍数*注数*单价 * 模式
        let mid   = stateVar.aboutGame.methodID;
		let current_positionsel = $.lt_position_sel;
        let cur_position = 0;
        let otype =stateVar.aboutGame.otype;
        let poschoose = '';
        if (current_positionsel.length > 0) {
            $.each(current_positionsel,(i,n)=> {
                poschoose += (String(parseInt(n)+1) + ',');
            });
            poschoose = poschoose.slice(0,-1);
        }
        if( isNaN(nums) || isNaN(times) || isNaN(money) || money <= 0 ){//如果没有任何投注内容
        	if(param){
        		alert(otype == 'input' ? '请先输入号码' : '请先选择号码');
        	}else{
        		alert(otype == 'input' ? '请输入正确的号码' : '请选择完整的号码');
        	}
            return false;
        }
        if( otype == 'input' ){//如果是输入型，则检测号码合法性，以及是否存在重复号
            let mname = Method.methodId[stateVar.aboutGame.methodID];//玩法的简写,如:'ZX3'
            let error = [];
            let edump = [];
            let ermsg = "";
            //检测重复号，并除去重复号
            edump = this.dumpNum(true);
            if( edump.length >0 ){//有重复号
                ermsg += '以下号码重复，已自动进行过滤'+'\n'+edump.join(", ");
                nums = Method.checkNum();
                money = Math.round(times * nums * 2 * (this.state.modes[this.state.selectYjf].rate * 1000)) /1000;  //倍数*注数*单价 * 模式

            }
            switch(mname){//根据类型不同做不同检测
                //任三 直选 直选单式
                case 'RXZXSSC3DS':
                case 'RXZXWFC3DS':
                case 'RXZXFFC3DS':
                case 'ZX3'  : error = Method._inputCheck_Num(3,true); break;
                //任三 直选 混合组选
                case 'RXZUWFC3HH' :
                case 'RXZUFFC3HH' :
                case 'RXZUSSC3HH' :
                case 'HHZX' : error = Method._inputCheck_Num(3,true,Method._HHZXcheck,true); break;
                //任选二-直选单式
                case "RXZXSSC2DS":
                case "RXZXWFC2DS":
                case "RXZXFFC2DS":
                case 'ZX2'  : error = Method._inputCheck_Num(2,true); break;
                //任选二组选单式
                case 'RXZUSSC2DS'  :
                case 'RXZUWFC2DS'  :
                case 'RXZUFFC2DS'  :
                case 'ZU2'  : error = Method._inputCheck_Num(2,true,Method._HHZXcheck,true); break;
                case 'ZX5'  : error = Method._inputCheck_Num(5,true); break;
                case 'ZX4'  : error = Method._inputCheck_Num(4,true); break;
                case 'ZUS'  : error = Method._inputCheck_Num(3,true, Method._ZUSDScheck, true); break;
                case 'ZUL'  : error = Method._inputCheck_Num(3,true, Method._ZULDScheck, true); break;
                case 'SDZX3': error = Method._inputCheck_Num(8,true,Method._SDinputCheck,false); break;
                case 'SDZU3': error = Method._inputCheck_Num(8,true,Method._SDinputCheck,true); break;
                case 'SDZX2': error = Method._inputCheck_Num(5,true,Method._SDinputCheck,false); break;
                case 'SDZU2': error = Method._inputCheck_Num(5,true,Method._SDinputCheck,true); break;
                case 'SDRX1': error = Method._inputCheck_Num(2,true,Method._SDinputCheck,false); break;
                case 'SDRX2': error = Method._inputCheck_Num(5,true,Method._SDinputCheck,true); break;
                case 'SDRX3': error = Method._inputCheck_Num(8,true,Method._SDinputCheck,true); break;
                case 'SDRX4': error = Method._inputCheck_Num(11,true,Method._SDinputCheck,true); break;
                case 'SDRX5': error = Method._inputCheck_Num(14,true,Method._SDinputCheck,true); break;
                case 'SDRX6': error = Method._inputCheck_Num(17,true,Method._SDinputCheck,true); break;
                case 'SDRX7': error = Method._inputCheck_Num(20,true,Method._SDinputCheck,true); break;
                case 'SDRX8': error = Method._inputCheck_Num(23,true,Method._SDinputCheck,true); break;
                //任选四 直选 直选单式
                case "RXZXWFC4DS":
                case "RXZXFFC4DS":
                case "RXZXSSC4DS": error = Method._inputCheck_Num(4, true); break;
	    //pk10单式
                case "PK10ZX2":
                case "PK10ZX3":
                case "PK10ZX4":
                case "PK10ZX5":
                case "PK10ZX6":
	                if(stateVar.savePkInput.error_num.length > 0 || stateVar.savePkInput.repeat_num.length > 0){
	                	let content = "已删除以下重复或错误号码：<br/>";
				        let no_repeat_num = stateVar.savePkInput.no_repeat_num;
				        stateVar.savePkInput.right_num = no_repeat_num;
				        stateVar.savePkInput.repeat_num = [];
				        stateVar.savePkInput.error_num = [];
				        /*content += (error_num.length > 0 ? (error_num.join() + '\n') : '') + repeat_num.join();*/
	                }
                default: break;
            }
            if( error.length > 0 ){//如果存在错误的号码，则提示
                ermsg += '有错误的号码';
            }

            if( ermsg.length > 1 ){
            	if(!param){
            		alert(ermsg);
            	}
            }
        }
    	let nos = stateVar.aboutGame.str;
        let temp = [];
        for( let i=0; i<stateVar.aboutGame.data_sel.length; i++ ){
            nos = nos.replace('X',stateVar.aboutGame.data_sel[i].sort(Method._SortNum).join(stateVar.aboutGame.sp));
            temp.push( stateVar.aboutGame.data_sel[i].sort(Method._SortNum).join("&") );
        }
        let nohtml = nos;
        let tempName  = '['+stateVar.aboutGame.title+'_'+stateVar.aboutGame.name+']';
		//计算奖金，并且判断是否支持利润率追号
        let pc = 0;
        let pz = 0;
        $.each(stateVar.aboutGame.prize,function(i,n){
            n = isNaN(Number(n)) ? 0 : Number(n);
            pz = pz > n ? pz : n;
            pc++;
        });
        if( pc != 1 ){
            pz = 0;
        }
        pz = Math.round( pz * (this.state.modes[this.state.selectYjf].rate * 1000))/1000;
        let tempObj = mobx.toJS(
        	{
	        	type:otype,
	        	methodid:mid,
	        	name:tempName,
	        	numberbet:nohtml,
	        	desc:tempName + ' '+ nohtml,
	        	codes:temp.join('|'),
	        	mode:this.state.modes[this.state.selectYjf].modeid,
	        	modeName:this.state.modes[this.state.selectYjf].name,
	        	times: this.state.multipleValue,
	        	nums: nums,
	        	money:money,
	        	omodel:this.state.omodel,
	        	menuid:stateVar.aboutGame.menuid,
	        	poschoose:poschoose,
	        	prize:pz
        	}
        );
        if(tempObj.poschoose == ''){
        	delete tempObj.poschoose;
        }
        if(param){
        	this.setState({directFlag:true});
        	let postData = {
	    		lotteryid : stateVar.nowlottery.lotteryBetId,
	    		curmid : stateVar.nowlottery.cuimId,
	    		poschoose : "",
	    		flag :"save",
	    		play_source : 10,
	    		lt_allin_if : "no",
	    		lt_furture_issue : this.state.issueIndex,
	    		lt_issue_start : this.state.nextIssue,
	    		lt_total_nums : nums,
	    		lt_total_money : money,
	    		randomNum : Math.floor((Math.random() * 10000) + 1),
	    		lt_project : [tempObj]
	    	};
        	Fatch.aboutBet({
	    		method:"POST",
	    		body:JSON.stringify(postData)
	    		}).then((data)=>{
	    			this.setState({directFlag:false});
	    			if(data.status == 200){
	    				const modal = Modal.success({
						    title: '温馨提示',
						    content: data.longMessage,
						});
						setTimeout(() => modal.destroy(), 3000);
						stateVar.BetContent = {
					        lt_same_code:[],totalDan:0,totalNum:0,totalMoney:0,lt_trace_base:0
					    };
						//成功添加以后清空选号区数据
				        for(let i=0; i<stateVar.aboutGame.data_sel.length; i++ ){//清空已选择数据
				            stateVar.aboutGame.data_sel[i] = [];
				            this.setState({numss:0,money:0});
				        }
				        if( otype == 'input' ){//清空所有显示的数据
				            this.setState({textAreaValue:''},()=>{
				            	this._inptu_deal();
				            });
				        }else if( otype == 'digital' || otype == 'dxds' || otype == 'dds' ){
				           $("li.number_active").removeClass('number_active');
				        }else if(otype == 'lhzx_lh'){
				        	$(".lh .hover").removeClass('hover');
				        }else if(otype = 'lhzx_zx'){
				        	$(".zx span").removeClass('hover');
				        }
	    			}else{
	    				const modal = Modal.error({
						    title: '温馨提示',
						    content: data.longMessage,
						});
						setTimeout(() => modal.destroy(), 3000);
	    			}
    		})
	    	return;
        }
        stateVar.BetContent.lt_same_code.push(tempObj);
        stateVar.BetContent.totalDan = stateVar.BetContent.lt_same_code.length * this.state.multipleMmcValue;//总单数增加
        let tempNum = 0,tempMoney = 0;
        for(let i=0;i<stateVar.BetContent.lt_same_code.length;i++){
        	tempNum += parseInt(stateVar.BetContent.lt_same_code[i].nums);
        	tempMoney += Number(stateVar.BetContent.lt_same_code[i].money);
        }
        stateVar.BetContent.totalNum = tempNum * this.state.multipleMmcValue;//总注数
       	stateVar.BetContent.totalMoney = tempMoney*10000 * this.state.multipleMmcValue/10000;//总钱
    	stateVar.BetContent.lt_trace_base   = tempMoney;//追号的钱
        //成功添加以后清空选号区数据
        for(let i=0; i<stateVar.aboutGame.data_sel.length; i++ ){//清空已选择数据
            stateVar.aboutGame.data_sel[i] = [];
            this.setState({numss:0,money:0});
        }
        if( otype == 'input' ){//清空所有显示的数据
            this.setState({textAreaValue:''},()=>{
            	this._inptu_deal();
            });
        }else if( otype == 'digital' || otype == 'dxds' || otype == 'dds' ){
           $("li.number_active").removeClass('number_active');
        }else if(otype == 'lhzx_lh'){
        	$(".lh .hover").removeClass('hover');
        }else if(otype = 'lhzx_zx'){
        	$(".zx span").removeClass('hover');
        }
        return true;
    }
    //机选
    setByRandom(a){
    	/**
    	 参数a，机选注数1注或5注
    	 */
    	let tempBet = Method.random();
    	for(let i=0; i<stateVar.aboutGame.data_sel.length; i++ ){//清空已选择数据
            stateVar.aboutGame.data_sel[i] = [];
        }
    	let tempArr = mobx.toJS(stateVar.aboutGame.data_sel);
    	for(let i=0; i<tempArr.length; i++ ){//清空已选择数据
            let l = [];
            for(let j=0;j<tempBet[i].length;j++){
            	l.push(String(tempBet[i][j]));
            }
			stateVar.aboutGame.data_sel[i] = l;
        }
    	let tpNum = mobx.toJS(Method.checkNum());
    	this.setState({numss:tpNum},()=>{
    		this.addNum();
    		if(a && --a != 0){
    			this.setByRandom(a);
    		}
    	});
    }
    //确认投注
    actionBet(){
    	if(stateVar.BetContent.lt_same_code.length == 0){
    		alert('请先选号');
    		return;
    	}
    	let tempObj = {
    		lotteryid : stateVar.nowlottery.lotteryBetId,
    		curmid : stateVar.nowlottery.cuimId,
    		poschoose : "",
    		flag : "save",
    		play_source : 10,
    		lt_allin_if : "no",
    		lt_furture_issue : this.state.issueIndex,
    		lt_issue_start : this.state.nextIssue,
    		lt_total_nums : stateVar.BetContent.totalNum,
    		lt_total_money : stateVar.BetContent.totalMoney,
    		lt_trace_times_margin : 1,
			lt_trace_margin : 50,
			lt_trace_times_same : 1,
			lt_trace_diff : 1,
			lt_trace_times_diff : 2,
			lt_trace_count_input : 10,
			lt_trace_money : 0,
			lt_trace_count_input : this.state.multipleMmcValue,//mmc连续输入次数
			isPrizeStop:this.state.isPrizeStop,//mmc中奖追停
    		lt_project:[]
    	};
    	for(let i=0;i<stateVar.BetContent.lt_same_code.length;i++){
    		tempObj.lt_project.push(stateVar.BetContent.lt_same_code[i])
    	}
    	this.setState({betokObj:mobx.toJS(tempObj),visible:true})
    }
    //打开追号
    openTrace(){
    	this.setState({tracevisible:true},()=>{
    		this.actionTrace();
    	});
    };
    //关闭追号
    getSuperaddition() {
        this.setState({
        	tracevisible: false,
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
    		if(tempTotalIssue == this.state.tomorrowIssue.length){
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
    		if(tempTotalIssue == this.state.tomorrowIssue.length){
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
    			let tempaaa = this.state.todayAndTomorrow[i].issue;
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
    		lt_issue_start : this.state.nextIssue,
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
    	this.setState({betokObj:mobx.toJS(tempObj),visible:true})
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
    	if(!this.state.tracevisible){
    		return;
    	}
    	let tempObj = this.state.traceItem;
    	if(tempObj.length > 0){
    		tempObj.shift();
    	}
    	let tempMoney = 0;
    	let tempTime = 0;
    	let tempData = this.state.todayAndTomorrow;
    	let dataTemp = [];
    	let tempArray = [];
    	for(let i=0;i<tempData.length;i++){
    		if(i >= this.state.tomorrowIssue.length){
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
    }
    //删除购物车单条记录
    deleteBet(a){
    	/**
    	 a,单条记录的索引
    	 */
    	stateVar.BetContent.lt_same_code.splice(a,1);
    	stateVar.BetContent.totalDan = stateVar.BetContent.lt_same_code.length * this.state.multipleMmcValue;//总单数增加
        let tempNum = 0,tempMoney = 0;
        for(let i=0;i<stateVar.BetContent.lt_same_code.length;i++){
        	tempNum += parseInt(stateVar.BetContent.lt_same_code[i].nums);
        	tempMoney += Number(stateVar.BetContent.lt_same_code[i].money);
        }
        stateVar.BetContent.totalNum = tempNum * this.state.multipleMmcValue;
       	stateVar.BetContent.totalMoney = tempMoney*10000 * this.state.multipleMmcValue/10000;
       	stateVar.BetContent.lt_trace_base = tempMoney * this.state.multipleMmcValue;
    }
    //清空购物车
    clearAllBet(){
    	stateVar.BetContent.lt_same_code = [];
    	stateVar.BetContent.totalDan = 0;
    	stateVar.BetContent.totalNum = 0;
       	stateVar.BetContent.totalMoney = 0;
       	stateVar.BetContent.lt_trace_base = 0;
    }
    //点击庄闲
    clickZx(e,c){
    	let tempObj = this.state.lotteryMethod[this.state.NavIndex];
		if($(e.target).hasClass('hover')){
    		return;
    	}
    	$(e.target).parent('div').siblings().find('span').removeClass('hover');
    	$(e.target).addClass('hover');
    	this.setState({navFourIndex:c},()=>{
    		this.selectAreaData(this.state.lotteryMethod,true)
    	})//庄闲特殊处理
    }
    //点击龙虎万千个
    clickLth(e,b,c){
    	let tempObj = this.state.lotteryMethod[this.state.navIndex].label[this.state.navThreeIndex].label;
    	let postData = b;
    	let tempIndex = this.state.navFourIndex;
    	if($(e.target).hasClass('hover')){
    		return;
    	}
		$(e.target).addClass('hover').siblings().removeClass('hover');
		if(c){
			this.setState({wqbsgIndex:$('.wqbsg span.hover').index()});
		}
		let _wqbsg = $(".wqbsg span.hover").attr("name"),
        	 _lth = $(".lth span.hover").attr("name"),
        	 wqbsglth = _wqbsg + _lth;
        if(typeof postData[wqbsglth] != 'undefined'){
        	tempIndex = postData[wqbsglth].split('-')[1]
        	this.setState({navFourIndex:tempIndex},()=>{
        		this.selectAreaData(this.state.lotteryMethod,true,postData)
        	})//龙虎特殊处理
        }else{
        	let tempWqbsg = _wqbsg + 'l';
       		let tempMethoid = postData[tempWqbsg].split('-')[1];
       		stateVar.aboutGame.methodID = this.state.lotteryMethod[this.state.navIndex].label[this.state.navThreeIndex].label[tempMethoid].methodid;
        }
    }
    //万千百十个切换
    checkwqbsg(a){
    	return a == this.state.wqbsgIndex ? 'hover' : '';
    }
    //生成选号数据
    selectAreaData(a,flag,postData){
    	let numberObj;
    	if(!a){
    		return;
    	}
    	if(a[this.state.navIndex].title == '龙虎庄闲'){
    		numberObj = a[this.state.navIndex].label[this.state.navThreeIndex].label[this.state.navFourIndex];
    	}else{
    		numberObj = a[this.state.navIndex].label[this.state.navTwoIndex].label[this.state.navThreeIndex];
    	}
    	$.lt_position_sel = [];
    	if(numberObj.selectarea.selPosition){
    		let defaultposition = numberObj.defaultposition.split('');
    		this.setState({defaultposition:defaultposition});
    		for(let i=0;i<defaultposition.length;i++){
    			if(defaultposition[i] == 1){
    				$.lt_position_sel.push(i);
    			}
    		}
    	}
    	let tempArray = [];
    	if(!postData){
	    	$.each(a[this.state.navIndex].label,(index,value)=>{
	    		$.each(value.label,(index,value)=>{
    				let tempID = value.methodid;
    				tempArray.push(tempID);
	    		});
	    	});
    	}else{

    	}
    	stateVar.methodIdItem = tempArray;
    	stateVar.aboutGame.methodID = numberObj.methodid;
    	stateVar.aboutGame.maxcodecount = numberObj.maxcodecount;
    	stateVar.aboutGame.noBigIndex = numberObj.selectarea.noBigIndex;
    	stateVar.aboutGame.title = a[this.state.navIndex].title;
    	stateVar.aboutGame.name = numberObj.name;
    	stateVar.aboutGame.str = numberObj.show_str;
    	stateVar.aboutGame.menuid = numberObj.menuid;
    	stateVar.aboutGame.sp = numberObj.code_sp;
    	stateVar.aboutGame.prize = numberObj.prize;
    	stateVar.aboutGame.data_sel = [];
    	stateVar.aboutGame.minchosen = [];
    	let tempMode = [];
    	numberObj.modes.map((val,index)=>{
    		let modes  = {modeid:val.modeid,name:val.name,rate:val.rate}
    		tempMode.push(modes)
    	})
    	this.setState({modes:tempMode});
    	let max_place= 0; //总共的选择型排列数
    	let data_sel = [];
    	let otype = numberObj.selectarea.type.toLocaleString()
    	stateVar.aboutGame.otype = otype
    	if( otype == 'input'){
    		this.setState({ifRandom:true});
    		stateVar.aboutGame.max_place = max_place;
			stateVar.aboutGame.minchosen = [];
			stateVar.aboutGame.data_sel[0] = [];
    	}else if( otype == 'digital'){
    		switch(stateVar.aboutGame.methodID){
    			case 3110761:
    			case 3110760:
    			case 3110756:
    			case 3110755:
    			case 3110678:
    			case 3110715:
    			case 3110701:
    			case 3110711:
    			case 3110693:
    			case 3110708:
    			case 3110728:
    			case 3110676:
    			case 3110714:
    			case 3110700:
    			case 3110710:
    			case 3110689:
    			case 3110704:
    			case 3110724:
    			case 3110677:
    			case 3110713:
    			case 3110702:
    			case 3110712:
    			case 3110691:
    			case 3110706:
    			case 3110726:
    			case 2261:
    			case 1261:
    				this.setState({ifRandom:true});
    				break;
    			default:
    				this.setState({ifRandom:false});
    		}
    		numberObj.selectarea.layout.map((val,index)=>{
	    		val.place  = parseInt(val.place,10);
				stateVar.aboutGame.max_place = val.place > max_place ? val.place : max_place;
				stateVar.aboutGame.data_sel[val.place] = [];
				stateVar.aboutGame.minchosen[val.place] = (typeof(val.minchosen) == 'undefined') ? 0 : val.minchosen;
	    	})
    	}else if(otype == 'dxds'){//大小单双类型(北京快乐吧)
    		this.setState({ifRandom:false});
    		numberObj.selectarea.layout.map((val,index)=>{
    			val.place  = parseInt(val.place,10);
				stateVar.aboutGame.max_place = val.place > max_place ? val.place : max_place;
				stateVar.aboutGame.data_sel[val.place] = [];
    		})
    	}else if(otype == 'lhzx_lh') {
    		this.setState({ifRandom:true});
    		stateVar.aboutGame.max_place = max_place;
			stateVar.aboutGame.minchosen = [];
			numberObj.selectarea.layout.map((val,index)=>{
				if(val){
					stateVar.aboutGame.data_sel[0] = [val.code];
				}
			});
            if(flag){
            	this.getNumMoney(Method.checkNum());
            }
		}else if(otype == 'lhzx_zx') {
			this.setState({ifRandom:true});
			stateVar.aboutGame.max_place = max_place;
			stateVar.aboutGame.minchosen = [];
			numberObj.selectarea.layout.map((val,index)=>{
				if(val){
					stateVar.aboutGame.data_sel[0] = [val.code];
				}
			});
			if(flag){
            	this.getNumMoney(Method.checkNum());
            }
		}else if(otype == 'dds'){
			numberObj.selectarea.layout.map((val,index)=>{
	    		val.place  = parseInt(val.place,10);
				stateVar.aboutGame.max_place = val.place > max_place ? val.place : max_place;
				stateVar.aboutGame.data_sel[val.place] = [];
				stateVar.aboutGame.minchosen[val.place] = (typeof(val.minchosen) == 'undefined') ? 0 : val.minchosen;
	    	})
		}
    }
    //生成选号界面
    selectArea(a){
    	if(!a){
    		return;
    	}
    	let numberObj = a[this.state.navIndex].label[this.state.navTwoIndex].label[this.state.navThreeIndex];
    	let numberObjLh  = a[this.state.navIndex]
    	return <div className="c_m_select_body">
    	{
    		(()=>{
    			if(numberObj && numberObj.selectarea.selPosition){
    				let wqbsgTemp = ['万位','千位','百位','十位','个位'];
	    			let tempHtml;
	    			tempHtml = <div className='selPosition'>{
	    				this.state.defaultposition.map((val,index)=>{
    						return (
								<div className={val == 1 ? 'checkBox selected' : 'checkBox'}  key={index}>
									<Checkbox defaultChecked={val == 1 ? true : false}  onChange={(e)=>this.onChangeCheckBox(e,index,val)}>{wqbsgTemp[index]}</Checkbox>
								</div>
							)
	    				})
	    			}</div>
	    			return tempHtml;
    			}else{
    				return '';
    			}
    		})()
    	}
    	{
    		((a)=>{
    			let tempObj = JSON.parse(a);
    			let htmlStr;
    			let otype = tempObj.selectarea.type.toLocaleString();
    			if( otype == 'input'){
    				htmlStr = <div className='inputDiv'>
	    				<textarea className='textAreaClass' value={this.state.textAreaValue} onChange={(e)=>this._inptu_deal(e)}></textarea>
	    				<div className='inputImport'>
	    					<span className='importFile'><input type='file' onChange={(e)=>this.importFile(e)}/>导入文件</span>
	    					<span onClick={()=>this.deleteSameNumber()}>删除重复号</span>
	    					<span onClick={()=>this.cleartextArea()}>清空号码</span>
	    				</div>
    				</div>
    			}else if( otype == 'digital'){
    				htmlStr = tempObj.selectarea.layout.map((val,index)=>{
						 return (
						 	<div className="c_m_select_body_number" key={index}>
							<p className="c_m_select_places">{val.title == '' ? '选号' : val.title}</p>
							<ul className="c_m_number_list">{
					            	val.no.split('|').map((vl,idx)=>{
					            	 	return <li onClick={(e)=>this.changeNum(e)} value={vl} name={'lt_place_'+val.place}  key={idx}>{vl}<p className="omit" style={{display:'none'}}>1</p></li>
				            		})
		            		}
            				</ul>
            				{
            					((n)=>{
            						let tempStr
            						if(typeof n.isButton != 'undefined'){//在后三码胆拖、红胆黑胆中需要对具体的行进行按钮的控制
										if( n.isButton == true){
											tempStr =
												<div className="c_m_number_select right">
												<button className='li' name='all' onClick={(e)=>this.dxqqAction(otype,e)}>全</button>
												<button className='li' name='big' onClick={(e)=>this.dxqqAction(otype,e)}>大</button>
												<button className='li' name='small' onClick={(e)=>this.dxqqAction(otype,e)}>小</button>
												<button className='li' name='odd' onClick={(e)=>this.dxqqAction(otype,e)}>奇</button>
												<button className='li' name='even' onClick={(e)=>this.dxqqAction(otype,e)}>偶</button>
												<button  className='li'name='clean' onClick={(e)=>this.dxqqAction(otype,e)}>清</button>
												</div>
										}
									}else{
										if( tempObj.selectarea.isButton == true ){
											tempStr =
												<div className="c_m_number_select right">
													<button className='li' name='all' onClick={(e)=>this.dxqqAction(otype,e)}>全</button>
													<button className='li' name='big' onClick={(e)=>this.dxqqAction(otype,e)}>大</button>
													<button className='li' name='small' onClick={(e)=>this.dxqqAction(otype,e)}>小</button>
													<button className='li' name='odd' onClick={(e)=>this.dxqqAction(otype,e)}>奇</button>
													<button className='li' name='even' onClick={(e)=>this.dxqqAction(otype,e)}>偶</button>
													<button  className='li'name='clean' onClick={(e)=>this.dxqqAction(otype,e)}>清</button>
												</div>
										}
									}
									return tempStr
            					})(val)
            				}
						</div>)
    				})
    			}else if(otype == 'dxds'){//大小单双类型(北京快乐吧)
    				htmlStr = tempObj.selectarea.layout.map((val,index)=>{
						 return (
						 	<div className="c_m_select_body_number" key={index}>
							<p className="c_m_select_places">{val.title == '' ? '选号' : val.title}</p>
							<ul className="c_m_number_list">{
					            	val.no.split('|').map((vl,idx)=>{
					            	 	return <li onClick={(e)=>this.changeNum(e)} value={vl} name={'lt_place_'+val.place} key={idx}>{vl}<p className="omit"></p></li>
				            		})
		            		}
            				</ul>
            				<div className="c_m_number_select right">
            					<button className='li' name='all' onClick={(e)=>this.dxqqAction(otype,e)}>全</button>
            					<button className='li' name='clean' onClick={(e)=>this.dxqqAction(otype,e)}>清</button>
            				</div>
						</div>)
    				})
    			}else if( numberObjLh.title == '龙虎庄闲' ){
    				if(numberObjLh.label[this.state.navThreeIndex].gtitle == "庄闲"){
    					htmlStr = <div className='zx'>{
    						numberObjLh.label[this.state.navThreeIndex].label.map((val,index)=>{
	    						return (
		    							<div className={val.selectarea.layout[0].code} key={index}>{
					    					<span onClick={(e)=>this.clickZx(e,index)}>{val.name}</span>
			    						}</div>
		    						)
    						})
    					}</div>
    				}else{
    					let wqbsg = { 'w' : '万', 'q' : '千', 'b' : '百', 's' : '十', 'g' : '个'};
            			let lth = { 'l' : '龙', 't' : '虎', 'h' : '和' };
            			let lh_obj = { 'l1h2': 'wql', 'h1l2': 'wqt', 'l1h3': 'wbl', 'h1l3': 'wbt', 'l1h4': 'wsl', 'h1l4': 'wst', 'l1h5': 'wgl', 'h1l5': 'wgt', 'l2h3': 'qbl', 'h2l3': 'qbt', 'l2h4': 'qsl', 'h2l4': 'qst', 'l2h5': 'qgl', 'h2l5': 'qgt', 'l3h4': 'bsl', 'h3l4': 'bst', 'l3h5': 'bgl', 'h3l5': 'bgt', 'l4h5': 'sgl', 'h4l5': 'sgt' };
            			let postData = {};
            			let pos_lth_config = ['l','t','h'];
            			let pos_wei = [];//存万千百十个
            			let pos_lth = [];//存龙虎和
            			$.each(numberObjLh.label[this.state.navThreeIndex].label,(index,val)=>{
            				let code = val['selectarea']['layout'][0]['code'];
							if(typeof lh_obj[code] === 'undefined'){//整合lh_obj数据
	                            lh_obj[code] =  code;
	                        }
							postData[lh_obj[code]] = this.state.navThreeIndex + '-' + index
            			});
            			$.each(postData,(ky,value)=>{//拼装数据
	                        let pos_wei_str = ky.slice(0,2);
	                        let pos_lth_str = ky.slice(2,3);
	                        if($.inArray(pos_wei_str,pos_wei) == -1){
	                            pos_wei.push(pos_wei_str);
	                        }
	                        if($.inArray(pos_lth_str,pos_lth) == -1){
	                            pos_lth.push(pos_lth_str);
	                        }
	                    });
	                    if(pos_lth.sort().join('') == 'hlt'){
	                        pos_lth = pos_lth_config;
	                    }
    					htmlStr = <div className='lh'>
    						<div className='wqbsg'>{
	    						pos_wei.map((value,index)=>{
		    						return (
					    				<span className={this.checkwqbsg(index)} name={value} onClick={(e)=>this.clickLth(e,postData,true)} key={index}>{wqbsg[value.split("")[0]]+wqbsg[value.split("")[1]]}</span>
			    					)
	    						})
	    					}
    						</div>
    						<div className='lth'><p>{$('.wqbsg span.hover').html()}</p>
    						{
    							pos_lth.map((value,index)=>{
		    						return (
					    				<span name={value} onClick={(e)=>this.clickLth(e,postData)} key={index}>{lth[value]}</span>
			    					)
	    						})
    						}
    						</div>
    					</div>
					}
				}else if(otype == 'dds'){
					htmlStr = tempObj.selectarea.layout.map((val,index)=>{
						 return (
						 	<div className="c_m_select_body_number" key={index}>
							<p className="c_m_select_places">{val.title == '' ? '选号' : val.title}</p>
							<ul className="c_m_number_list ddsdiv">{
					            	val.no.split('|').map((vl,idx)=>{
					            	 	return <li className='dds' onClick={(e)=>this.changeNum(e)} value={vl} name={'lt_place_'+val.place}  key={idx}>{vl}<p className="omit">1</p></li>
				            		})
		            		}
            				</ul>
						</div>)
    				})
				}
    			return htmlStr
    		})(JSON.stringify(numberObj))
    	}
    	</div>
    }
    //玩法gtitle区域
    gtitleArea(a){
    	let oneLotteryData = a;
    	if(oneLotteryData[this.state.navIndex].title == "龙虎庄闲"){
    		return (
    			<div className="c_m_method_type clear">
    				<span className="left">{oneLotteryData[this.state.navIndex].title}</span>
	    			<ul className="c_m_method_details left">{
	    				oneLotteryData[this.state.navIndex].label.map((value,idx)=>{
		    				return (
			                    <li onClick={()=>this.methodClick(0,idx,value)} className={this.check_tow_index(0,idx)} key={idx}>{value.gtitle}</li>
			        		)
		    			})
	    			}</ul>
    			</div>
    		)
    	}else if(oneLotteryData[this.state.navIndex].title == "任选"){
    		return (
    			oneLotteryData[this.state.navIndex].label.map((value,idx)=>{
    				if(this.state.renIndex == 0){
    					if(idx >= 2){
    						return '';
    					}
    				}else if(this.state.renIndex == 2){
    					if(idx < 2 || idx > 3){
    						return '';
    					}
    				}else{
    					if(idx <= 3){
    						return '';
    					}
    				}
    				return (
	    				<div className="c_m_method_type clear" key={idx}>
	                        <span className="left">{value.gtitle}</span>
	                        <ul className="c_m_method_details left">
	                        {
	                        	value.label.map((val,index) =>{
	                        		return (
	                        			<li onClick={()=>this.methodClick(idx,index)} className={this.check_tow_index(idx,index)} key={index}>{val.name}</li>
	                        		)
	                        	})
	                        }
	                        </ul>
	                    </div>
	        		)
    			})
    		)
    	}else{
    		return (
    			oneLotteryData[this.state.navIndex].label.map((value,idx)=>{
    				return (
	    				<div className="c_m_method_type clear" key={idx}>
	                        <span className="left">{value.gtitle}</span>
	                        <ul className="c_m_method_details left">
	                        {
	                        	value.label.map((val,index) =>{
	                        		return (
	                        			<li onClick={()=>this.methodClick(idx,index)} className={this.check_tow_index(idx,index)} key={index}>{val.name}</li>
	                        		)
	                        	})
	                        }
	                        </ul>
	                    </div>
	        		)
    			})
    		)
    	}
    };
    //得到奖金组视图
    getnfprizeArea(a){
    	let oneLotteryData = a;
    	let tempHtml,nfprize;
    	if(oneLotteryData[this.state.navIndex].title == "龙虎庄闲"){
    		nfprize = oneLotteryData[this.state.navIndex].label[this.state.navThreeIndex].label[this.state.navFourIndex].nfdprize;
    	}else{
    		nfprize = oneLotteryData[this.state.navIndex].label[this.state.navTwoIndex].label[this.state.navThreeIndex].nfdprize;
    	}
    	if(nfprize.length == 0){
    			tempHtml =  ''
		}else{
			tempHtml = <div className="c_m_bonus_ratio">
                <span>单注奖金</span>
                <Select value={this.state.omodel} style={{ width: 100 }} onChange={(value)=>{this.handleChangeRatio(value)}}>
                    <Option value='1'>{nfprize.defaultprize + '-' + nfprize.userdiffpoint + '%'}</Option>
                    <Option value='2'>{nfprize.levs + '-0%'}</Option>
                </Select>
            </div>
		}
    	return tempHtml;
    };
    //显示开奖号码
    showkjNumber(){
    	if(stateVar.nowlottery.lotteryId == 'pk10'){
    		return(
    			<div className="praise_mark">
		    		<div className="praise_mark_text_pk10">
		                <div>第&nbsp;<span style={{color:'#FFE38E'}}>{this.state.nowIssue}</span>&nbsp;期</div>
		                <div>开奖号码</div>
		                <div>
			                <span className="method_introduce">走势图</span>&nbsp;
			                <span className="method_introduce">玩法介绍</span>
		                </div>
		            </div>
		            <ul className="ball_number_pk10">
		                {
		                	this.state.code.map((val,idx)=>{
		                		return (
		                			<li key={idx}>{val}</li>
		                		)
		                	})
		                }
		            </ul>
            	</div>
    		)
    	}else{
    		return(
    			<div className="praise_mark">
		    		<div className="praise_mark_text">
		                <span>第<span style={{color:'#FFE38E'}}>{this.state.nowIssue}</span>期&nbsp;开奖号码</span>
		                <span className="method_introduce right">玩法介绍</span>
		                <span className="method_introduce right">走势图</span>
		            </div>
		            <ul className="ball_number clear">
		                {
		                	this.state.code.map((val,idx)=>{
		                		return (
		                			<li key={idx}>
		                				<span className='kjCodeClass' style={{display:this.state.kjStopFlag[idx] ? 'block' : 'none'}}>{val}</span>
		                				<span style={{display:this.state.kjStopFlag[idx] ? 'none' : 'block'}}>{this.state.animateCode[idx]}</span>
		                			</li>
		                		)
		                	})
		                }
		            </ul>
            	</div>
    		)
    	}
    }
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
    	let oneLotteryData = this.state.lotteryMethod;
    	if(oneLotteryData.length == 0){
    		return <div className='loadingbet'>
    			<Spin tip="加载中..." size="large"></Spin>
    		</div>
    	}
    	let htmlmethod = this.gtitleArea(oneLotteryData);//玩法区域
    	let htmldata = this.selectArea(oneLotteryData);//投注区域
    	let objRen = {};
    	let imgUrl = stateVar.nowlottery.imgUrl;
        return (
        	<div>
        		<Websocket url='ws://10.63.15.242:9502' onMessage={this.handleData.bind(this)} onOpen={this.openWebsocket.bind(this)}
        			ref = {Websocket => {
                  this.refWebSocket = Websocket;
                }}
        		/>
	        	<LeftSider resetInit={()=>this.initData()}></LeftSider>
	            <div className='content_bet'>
	            	<div className="bet_content" key="ContentTop">
	                    <div className="content_title">
	                    {
	                    	(()=>{
	                    		let topHtml;
	                    		if(stateVar.nowlottery.lotteryBetId == 23){
	                    			topHtml = <ul className="title_list clear">
			                            <li>
			                                <div className="content_cz_logo">
			                                    <img src={require('./Img/'+imgUrl+'.png')} alt=""/>
			                                </div>
			                            </li>
			                            <li>
			                                <ul className="content_center mmc">
			                                    <li className="content_cz_text">
			                                        <div className="cz_name m_bottom">
			                                            <span>{stateVar.nowlottery.cnname}</span>
			                                        </div>
			                                    </li>
			                                </ul>
			                            </li>
			                            <li>
			                            	<ul className="ball_number_mmc">
								                {
								                	this.state.mmccode.map((val,idx)=>{
								                		return (
								                			<li key={idx}>{val}</li>
								                		)
								                	})
								                }
								           	</ul>
			                            </li>
			                            <li>
			                            	<Button className='monikj' disabled={this.state.mmcmoni} onClick={()=>this.monikj()}>模拟开奖</Button>
			                            </li>
			                        </ul>
	                    		}else{
	                    			topHtml = <ul className="title_list clear">
			                            <li>
			                                <div className="content_cz_logo">
			                                    <img src={require('./Img/'+imgUrl+'.png')} alt=""/>
			                                </div>
			                            </li>
			                            <li>
			                                <ul className="content_center">
			                                    <li className="content_cz_text">
			                                        <div className="cz_name m_bottom">
			                                            <span>{stateVar.nowlottery.cnname}</span>
			                                        </div>
			                                        <div className="cz_periods m_bottom">
			                                            <span style={{color:'#FFE38E'}}>{this.state.nextIssue}</span>
			                                            <span>期</span>
			                                        </div>
			                                        <div className="voice_switch m_bottom">
			                                            <span>音效</span>
			                                            <Switch size="small" defaultChecked={common.getStore('soundswitch') == 'off' ? true : false} onChange={(checked) => this.onChangeSound(checked)} />
			                                        </div>
			                                    </li>
			                                    <li className="abort_time">
			                                        <p className="abort_time_text">投注截止还有</p>
			                                        <div className="c_m_count_down">
			                                            <Row type="flex" align="bottom">
			                                                <Col span={6}>
			                                                    <div className="item_text">{this.state.timeShow.hour}</div>
			                                                </Col>
			                                                <Col span={2}>
			                                                    <div className="item_type">时</div>
			                                                </Col>
			                                                <Col span={6}>
			                                                    <div className="item_text">{this.state.timeShow.minute}</div>
			                                                </Col>
			                                                <Col span={2}>
			                                                    <div className="item_type">分</div>
			                                                </Col>
			                                                <Col span={6}>
			                                                    <div className="item_text">{this.state.timeShow.second}</div>
			                                                </Col>
			                                                <Col span={2}>
			                                                    <div className="item_type">秒</div>
			                                                </Col>
			                                            </Row>
			                                        </div>
			                                    </li>
			                                </ul>
			                            </li>
			                            <li>
				                            {
				                            	this.showkjNumber()
				                            }
			                            </li>
			                        </ul>
	                    		}
	                    		return topHtml;
	                    	})()
	                    }

	                    </div>
	                </div>
	                <div className="content_main" key="ContentMian">
	                    <div className="c_m_nav">
	                        <ul className="c_m_nav_list left">
	                            {
	                                oneLotteryData.map(( element,index ) => {
	                                	if(element.title == '任选'){
	                                		return(
	                                			<li className='renxuan' key={index}>
													<div className="c_m_select">
							                            <div className="c_m_select_method_text">{element.title+'玩法'}</div>
							                            <ul className="c_m_select_list clear">
							                            {
							                            	element.label.map((val,idx)=>{
							                            		let tempVal = val.gtitle.substr(0,2);
							                            		if(objRen[tempVal] == undefined){
							                            			objRen[tempVal] = tempVal
							                            			return(
								                            			<li onClick={() => this.changeMethod(index,idx)} key={idx}>{element.title + tempVal.split('')[1]}</li>
								                            		)
							                            		}
							                            		return '';
							                            	})
							                            }
							                            </ul>
							                        </div>
												</li>
	                                		)
	                                	}
	                                    return(
	                                        <li onClick={() => this.changeMethod(index)} className={ this.check_nav_index( index ) } key={index}>{element.title}</li>
	                                    )
	                                })
	                            }
	                        </ul>
	                    </div>
	                    <div className="c_m_controler">
	                        <div className="c_m_controler_method">
	                     	{htmlmethod}
	                        	{
	                        		this.getnfprizeArea(oneLotteryData)
	                        	}
	                        </div>
	                        <div className="c_m_select_number">
	                            <div className="c_m_select_title">
	                                <div className="c_m_select_name">
	                                    {oneLotteryData[this.state.navIndex].title == '龙虎庄闲' ? oneLotteryData[this.state.navIndex].label[this.state.navThreeIndex].gtitle : (oneLotteryData[this.state.navIndex].label[this.state.navTwoIndex].gtitle + oneLotteryData[this.state.navIndex].label[this.state.navTwoIndex].label[this.state.navThreeIndex].name)}
	                                </div>
	                                <div style={{display:'none'}}>
		                                <ul className="c_m_select_hot">
		                                    <li onClick={()=>{this.setState({hotIndex : 0})}} className={this.state.hotIndex === 0 ? 'active' : ''} >冷热</li>
		                                    <li onClick={()=>{this.setState({hotIndex : 1})}} className={this.state.hotIndex === 1 ? 'active' : ''}>遗漏</li>
		                                </ul>
		                                <Button className="c_m_btn" onClick={()=>{this.setState({hotSwitch : !this.state.hotSwitch})}}>
		                                    {this.state.hotSwitch ? '开' : '关'}
		                                </Button>
		                                <Radio.Group  onChange={(e)=>{this.handleSizeChange(e)}}>
		                                    <Radio.Button value="30期">30期</Radio.Button>
		                                    <Radio.Button value="60期">60期</Radio.Button>
		                                    <Radio.Button value="100期">100期</Radio.Button>
		                                </Radio.Group>
	                                </div>
	                                <span className="c_m_select_title_right right">
	                                    <span>{oneLotteryData[this.state.navIndex].title == '龙虎庄闲' ? oneLotteryData[this.state.navIndex].label[this.state.navThreeIndex].label[this.state.navFourIndex].methoddesc : oneLotteryData[this.state.navIndex].label[this.state.navTwoIndex].label[this.state.navThreeIndex].methoddesc}</span>
	                                    <Tooltip placement="bottomRight" title={oneLotteryData[this.state.navIndex].title == '龙虎庄闲' ? oneLotteryData[this.state.navIndex].label[this.state.navThreeIndex].label[this.state.navFourIndex].methodhelp : oneLotteryData[this.state.navIndex].label[this.state.navTwoIndex].label[this.state.navThreeIndex].methodhelp}>
									        <Button className='c_m_lottery_explain'>中奖说明</Button>
									    </Tooltip>
	                                </span>
	                            </div>
	                            {htmldata}
	                        </div>
	                        <div className="c_m_select_operate">
	                            <div className="c_m_select_operate_text">
	                                <span className="c_m_select_money">您选择了<strong>{this.state.numss}</strong>注，共<strong>{this.state.money}</strong>元</span>
	                                <span className="c_m_select_multiple">
	                                    <span>倍数：</span>
	                                    <img className="hvr-grow-shadow" onClick={()=>{this.minusMultiple()}} src={minus_multiple} alt="减少倍数"/>
	                                    <InputNumber type="text" min={1} max={9999} value={this.state.multipleValue} onChange={this.multipleValue.bind(this)}></InputNumber>
	                                    <img className="hvr-grow-shadow" onClick={()=>{this.addMultiple()}} src={add_multiple} alt="增加倍数"/>
	                                </span>
	                                <span className="c_m_select_yjftype">
	                                    <span>模式：</span>
	                                    <ul className="c_m_select_yjf right">
	                                        {
	                                            this.state.modes.map((value,index)=>{
	                                                return (
	                                                  <li onClick={()=>this.changeMode(index)} className={this.state.selectYjf === index ? 'yjf_active' : ''} key={index}>{value.name}</li>
	                                                );
	                                            })
	                                        }
	                                    </ul>
	                                </span>
	                                {
	                                	(()=>{
	                                		if(stateVar.nowlottery.lotteryBetId == 23){
	                                			return ''
	                                		}else{
	                                			return(
	                                			<span className="c_m_future_expect">
				                                    <span>未来期：</span>
				                                    {
				                                    	(()=>{
				                                    		return (
				                                    			<span>
							                                        <Select value={this.state.issueIndex} style={{ width: 170 }} onChange={(value) => this.handleChangeIssue(value)}>
				                                    					{
				                                    						this.state.todayAndTomorrow.map((val,index)=>{
				                                    							if(index == 0){
				                                    								return (
					                                    								<Option key={index} value={val.issue}>{val.issue}(当前期)</Option>
					                                    							)
				                                    							}else{
				                                    								if(index >= this.state.tomorrowIssue.length){
				                                    									return ''
				                                    								}
				                                    								return (
					                                    								<Option key={index} value={val.issue}>{val.issue}</Option>
					                                    							)
				                                    							}
				                                    						})
				                                    					}
							                                        </Select>
							                                    </span>
				                                    		)
				                                    	})()
				                                    }
				                                </span>
				                            )
	                                	}
	                                	})()
	                                }
	                            </div>
	                            <div className="c_m_select_button">
	                                <i className="c_m_add_btn" onClick={()=>this.addNum()}></i>
	                                <Button style={{display:(stateVar.nowlottery.lotteryBetId == 23 ? 'none' : 'inline-block')}} disabled={this.state.directFlag} className="c_m_bet_btn directBet" onClick={()=>this.directBet()}></Button>
	                            </div>
	                        </div>
	                        <div className="c_m_select_code_record">
	                            <div className="c_m_select_record_content">
	                                <Row>
	                                    <Col span={19}>
	                                        <div className="c_m_select_record_table">
	                                        {
	                                        	stateVar.BetContent.lt_same_code.length == 0 ? '选号区，请选择号码' : stateVar.BetContent.lt_same_code.map((value,index)=>{
	                                        		return (
	                                        			<ul className="c_m_select_record_list clear" key={index}>
	                                        				<li>{value.name}</li>
			                                                <li>{value.numberbet}</li>

			                                                <li className="c_m_cody_close" onClick={()=>this.deleteBet(index)}><img src={close} alt=""/></li>
			                                                <li>{value.money + '元'}</li>
			                                                <li>{value.nums + '注'}</li>
			                                                <li>{value.times + '倍'}</li>
			                                                <li>{value.modeName}</li>
	                                        			</ul>
	                                        			)
	                                        	})
	                                        }
	                                        </div>
	                                    </Col>
	                                    <Col span={5}>
	                                        <div className="c_m_machine_select">
	                                            <Button className="c_m_machine_select_1" disabled={this.state.ifRandom} onClick={()=>this.setByRandom()}>机选一注</Button>
	                                            <Button className="c_m_machine_select_5" disabled={this.state.ifRandom} onClick={()=>this.setByRandom(5)}>机选五注</Button>
	                                            <div className="c_m_empty machine_active" onClick={()=>this.clearAllBet()}>清空号码</div>
	                                        </div>
	                                    </Col>
	                                </Row>
	                            </div>
	                            <div className="c_m_affirm_bet">
	                                <ul className="c_m_affirm_bet_list clear">
	                                    <li>
	                                        <span>单数：</span>
	                                        <span><strong>{stateVar.BetContent.totalDan}</strong>&nbsp;单</span>
	                                    </li>
	                                    <li>
	                                        <span>注数：</span>
	                                        <span><strong>{stateVar.BetContent.totalNum}</strong>&nbsp;注</span>
	                                    </li>
	                                    <li>
	                                        <span>总金额：</span>
	                                        <span><strong>{stateVar.BetContent.totalMoney}</strong>&nbsp;元</span>
	                                    </li>
	                                    <li className="c_m_affirm_bet_btn" onClick={()=>this.actionBet()}>确认投注</li>
	                                    {
	                                    	(()=>{
	                                    		if(stateVar.nowlottery.lotteryBetId == 23){
	                                    			return(
	                                    				<li className='c_m_select_multiple_div'>
	                                    					<div className="">
				                                    			<span className="c_m_select_multiple">
								                                    <span>连续开奖：</span>
								                                    <img className="hvr-grow-shadow" onClick={()=>{this.minusMmcMultiple()}} src={minus_multiple} alt="减少"/>
								                                    <input type="text" value={this.state.multipleMmcValue} onChange={this.multipleMmcValue.bind(this)}/>
								                                    <img className="hvr-grow-shadow" onClick={()=>{this.addMmcMultiple()}} src={add_multiple} alt="增加"/>
								                                </span>
								                                <Checkbox onChange={(e)=>this.onChangeStop(e)}>中奖后停止</Checkbox>
							                                </div>
	                                    				</li>
	                                    			)
	                                    		}else{
	                                    			return(
	                                    				<li className="c_m_superaddition"><Button disabled={stateVar.BetContent.lt_same_code == 0 ? true : false} onClick={()=>this.openTrace()}>追号</Button></li>
	                                    			)
	                                    		}
	                                    	})()
	                                    }
	                                </ul>
	                                <Modal
						                width='865px'
						                visible={this.state.tracevisible}
						                title= {<ModelView defaultIndex={this.state.traceTitleIndex} onChangeNavIndex={this.onChangeNavIndex} navList = {navList}/>}
						                onCancel={()=>{this.getSuperaddition()}}
						                maskClosable={false}
						                footer={null}
						                className="modal_content"
						            >
						                <div className="modal_main">
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
							                            <InputNumber min={1} max={120} value={this.state.traceIssueNum} onChange={(value)=>{this.onChangeInputTraceIssue(value)}} />
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
							                            <InputNumber min={1} max={120} value={this.state.traceIssueNum} onChange={(value)=>{this.onChangeInputTraceIssue(value)}} />
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
							                            <InputNumber min={1} max={120} value={this.state.traceIssueNum} onChange={(value)=>{this.onChangeInputTraceIssue(value)}} />
							                            <span>期</span>
							                        </div>
							                        <div className="periods_input left">
							                            <span>隔</span>
							                            <InputNumber min={1} max={120} value={this.state.traceIssueSpaceNum} onChange={(value)=>{this.onChangeInputSpaceTraceIssue(value)}} />
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
	                            </div>
	                        </div>
	                        <BetRecordTable histoeryBet={this.getBetHistory} betHistory={this.state.historyBet}/>
	                    </div>
	                </div>
	                <AlterModal visible={this.state.visible} historyBet={this.getBetHistory} mmchistoeryBet={this.getKjHistory} lotteryOkBet={this.lotteryOkBet} betData={this.state.betokObj}/>
            	</div>
            </div>
        );
    }
}
