import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Select,Table, Modal, InputNumber, Row, Col, Checkbox,Button, Radio ,Switch} from 'antd';
import mobx,{computed, autorun} from "mobx";
import QueueAnim from 'rc-queue-anim';
import './ContentMain.scss'

import Fatch from '../../../Utils'
import { stateVar } from '../../../State'
import Method from '../method.js'
import commone from '../commone.js'

import common from '../../../CommonJs/common';

import BetRecordTable from '../BetRecordTable/BetRecordTable'
import ModelView from './../../Common/ChildNav/ChildNav'
import AlterModal from './../../Common/LotteryModal/LotteryModal'

import minus_multiple from './Img/minus_multiple.png';
import add_multiple from './Img/add_multiple.png';
import close from './Img/close.png';
import cz_logo_11_5 from './Img/cz_logo_11_5.png'

import Transform from '../../../CommonJs/transform.react.js';

const Option = Select.Option;
const config = {
    'server' : 'ws://10.63.15.242:9502',
    'flash_websocket' : true
}
const client_id = Date.parse(new Date());
@observer
export default class ContentMian extends Component {
    constructor(props){
        super(props)
        this.state = {
            navIndex : 0,
            navTwoIndex : 0,
            navThreeIndex : 0,
            navFourIndex : 0,
            wqbsgIndex:0,
            renIndex:0,
            hotIndex : 0,
            hotSwitch : false, // 冷热遗漏开关
            multipleValue : 1, // 投注倍数
            modes:[],
            selectYjf: 0, // 选择元角分模式
            childVisible: false, //隐藏子组件模态框
            lotteryMethod:[],//单个彩种玩法
            statusClass : true,
            numss:0,
            money:0,
            checked: true,
            omodel:'1',
            textAreaValue:'',
            todayAndTomorrow : [],
            timeShow:{hour:'00',second:'00',minute:'00',day:'00'},
            issueIndex:'请选择期号',
            code : ['','','','',''],//开奖号码
        	nowIssue:'',//上一期前期号
        	nextIssue:'',//当前期号
        	historyBet:[],//投注记录
        	el1: {rotateZ: 0},
        	ifRandom:false,
        	lotterycurmid:'',
        	betlotteryId:'',
        	betokObj:{},
        	visible:false,
        	issueArray:[],
        	booleanValue:true,
            interval: null,
        }

    };
    // 音效开关
    onChanges(checked) {
        console.log(`switch to ${checked}`);
    };
    //确定投注页面
    lotteryOkBet(){
    	this.setState({visible:false})
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
	//万千百十个复选框切换
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
    multipleValue(event) {
        let value = event.target.value;
        if ( value === '' || parseInt(value) <= 1 ) {
            value = 1
        } else {
            value = parseInt(value)
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
    //初始化默认调用方法
    componentDidMount() {
    	// this.initData();
    	// this.getWebsoket();
    	// this.getFutureIssue();
    	// this.getlotterycode();
    	// this.getBetHistory();

        mobx.autorun(() => console.log(this.getDan));
    };
    @computed get getDan(){
        console.log('getDan');
        this.initData();
        // this.getWebsoket();
        this.getFutureIssue();
        this.getlotterycode();
        this.getBetHistory();
    	return stateVar.nowlottery.lotteryId;
    };
    getWebsoket(){
    	let ws = {};
    	//使用原生WebSocket
	    if (window.WebSocket || window.MozWebSocket)
	    {
	        ws = new WebSocket(config.server);
	    }
	    //使用flash websocket
	    else if (config.flash_websocket)
	    {
	        WEB_SOCKET_SWF_LOCATION = "./flash-websocket/WebSocketMain.swf";
	        $.getScript("./flash-websocket/swfobject.js", function () {
	            $.getScript("./flash-websocket/web_socket.js", function () {
	                ws = new WebSocket(config.server);
	            });
	        });
	    }
	    //使用http xhr长轮循
	    else
	    {
	        ws = new Comet(config.server);
	    }
	    this.listenEvent(ws);
    };
    listenEvent(ws){
	    /**
	     * 连接建立时触发
	     */
	    ws.onopen = function (e) {
	        var msg = {"method":"join","uid":client_id,"hobby":1};
	        ws.send(JSON.stringify(msg));
	    };

	    ws.onmessage = function (e) {
	    	console.log(e)
	        var message = eval('('+ e.data +')');
	        var cmd = message.data.method;
	        if (cmd == 'connection')
	        {
	            if(message.data.status == 1)
	            {
	               //alert('connection ok');
	            }
	        }
	        else if (cmd == 'push')
	        {
	            //var server_data = message.data;
				//var datastr=stringify(server_data.data);
	            $("#container").append(e.data + "<br/>");
	        }
		};

		    /**
		     * 连接关闭事件
		     */
	    ws.onclose = function (e) {
	        $(".pubArea").hide();
	    };

	    /**
	     * 异常事件
	     */
	    ws.onerror = function (e) {
	        $(".pubArea").hide();
	    };
    };
    initData(){
    	let lotteryData = require('../../../CommonJs/common.json');
    	let tempLotteryType = {};
    	for(let i = 0,lotteryDt=lotteryData.lotteryType;i<lotteryDt.length;i++){
    		if(lotteryDt[i]['lotteryid'] != 23){
    			if(lotteryDt[i]['nav'] == stateVar.nowlottery.lotteryId){
    				this.setState({lotterycurmid:lotteryDt[i]['curmid'],betlotteryId:lotteryDt[i]['lotteryid']});
    			}
    			tempLotteryType[lotteryDt[i]['nav']] = lotteryDt[i]['curmid']
    		}
    	}
    	//判断玩法是否有缓存，没有则重新获取所有玩法
    	if(common.getStore('lotteryMethod')){
			this.setOneMethod(common.getStore('lotteryMethod'));
    	}else{
	    	this.getLotteryData(tempLotteryType)
    	}
    };
    //获取所有彩种玩法
    getLotteryData(val){
    	Fatch.lotteryBets({
    		method : "POST",
    		body : JSON.stringify({sCurmids:val})}
    		).then((data)=>{
    			this.setState({ loading: false });
    			if(data.status == 200){
    				let tempData = data.repsoneContent;
                    common.setStore(stateVar.userInfo.userName, {'lotteryMethod':tempData});
    				this.setOneMethod(tempData);
    			}
    		})
    };
    //获取最近一期开奖号码和期号
    getlotterycode(){
    	let tempId = commone.getLotteryId(stateVar.nowlottery.lotteryId);
    	Fatch.aboutBet({
    		method:"POST",
    		body:JSON.stringify({flag:'getlotterycode',lotteryid:tempId})
    		}).then((data)=>{
    			console.log(data)
    			let tempData = data.repsoneContent;
    			let tempArray = this.state.todayAndTomorrow;
				if(tempArray.length <= 120){
					this.getFutureIssue();
				}
    			if(data.status == 200){
					while(true){
						if(tempArray.length == 0){
							break;
						}
    					if(tempData.curissue != tempArray[0].issue){
    						tempArray.splice(0,1);
    					}else{
    						break;
    					}
    				}
					stateVar.issueItem = tempArray;
    				this.setState({code:tempData.code.split(''),nowIssue:tempData.issue,nextIssue:tempData.curissue,todayAndTomorrow:tempArray,issueIndex:tempArray.length != 0 ? tempArray[0].issue : ''});
    				// this.tick(tempData.datetime,tempData.cursaleend)
    			}
    		})
    };
    //得到投注记录
     getBetHistory(){
    	let tempId = commone.getLotteryId(stateVar.nowlottery.lotteryId);
    	Fatch.aboutBet({
    		method:"POST",
    		body:JSON.stringify({flag:'getprojects',lotteryid:tempId,issuecount:20})
    		}).then((data)=>{
    			console.log(data)
    			let tempData = data.repsoneContent;
    			console.log(data)
    			if(data.status == 200){
					this.setState({historyBet:tempData});
    			}
    		})
    };
    //获取未来期
    getFutureIssue(){
    	//返回根据彩种类型返回彩种ID
    	let tempId = commone.getLotteryId(stateVar.nowlottery.lotteryId);
    	Fatch.aboutBet({
    		method:"POST",
    		body:JSON.stringify({flag:'getTodayTomorrowIssue',lotteryid:tempId})
    		}).then((data)=>{
    			if(data.status == 200){
					let todayData = data.repsoneContent.today;
					let tomorrowData = data.repsoneContent.tomorrow;
					todayData = todayData.concat(tomorrowData);
					stateVar.issueItem = todayData;
					this.setState({todayAndTomorrow:todayData,issueIndex:todayData[0].issue});
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
    	this.state.interval = setInterval(() =>{
    		if($.lt_time_leave > 0 && ($.lt_time_leave % 240 == 0 || $.lt_time_leave == 60 )){//每隔4分钟以及最后一分钟重新读取服务器时间
    			let tempId = commone.getLotteryId(stateVar.nowlottery.lotteryId);
    			Fatch.aboutBet({
		    		method:"POST",
		    		body:JSON.stringify({flag:'gettime',lotteryid:tempId,issue:this.state.nextIssue})
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
    		$.lt_time_leave = $.lt_time_leave - 1;
    		let tempTime = commone.diff($.lt_time_leave);
    		this.setState({timeShow:tempTime});
    		if( $.lt_time_leave <= 0 ){//结束
                clearInterval(this.state.interval);
                if(!$.lt_submiting){//如果没有正在提交数据则弹出对话框,否则主动权交给提交表单
					if(true){
							/*alert('当期销售已截止，请进入下一期购买')*/
							this.lt_reset(true);
					}else{
						return;
					}
                }
            }
    	},1000);
    }
    lt_reset(iskeep){
    	if($.lt_time_leave <= 0){
    		this.getlotterycode();
    	}
    }
    componentWillUnmount() {
	    clearInterval(this.state.interval);
	}
    //设置单个彩种玩法 val:所有玩法信息
    setOneMethod(val){
    	let lotteryid = stateVar.nowlottery.lotteryId
    	for(let i in val){
			if(i == lotteryid){
				this.setState({lotteryMethod:val[i]},()=>{
					let oneLotteryData = this.state.lotteryMethod;
    				// this.selectAreaData(oneLotteryData);
				})
			}
    	}
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
    	this.setState({navTwoIndex:a,navThreeIndex:b,navFourIndex:0,wqbsgIndex:0,textAreaValue:''},()=>{
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
				console.log(ss)
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
            	tmepS = play.formatInputNumbers();
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
        	let lt_elem = $(this);
            let error_num = lt_elem.data("error_num");
            let repeat_num = lt_elem.data('repeat_num');
            if (error_num.length > 0 || repeat_num.length > 0) {
                Method.play.showErrorNumbers(lt_elem,error_num,repeat_num);
            } else {
                alert("没有重复及错误号码！");
            }
        	return false;
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
                case 'SDZU2' : this.setState({textAreaValue:stateVar.aboutGame.data_sel[0].join(" ")},()=>{
				                	this._inptu_deal();
				                });
                               alert('已删除以下重复号'+'\r\n'+err.join(";"));
                               break;
                default      : this.setState({textAreaValue:stateVar.aboutGame.data_sel[0].join(" ")},()=>{
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
    //添加号码
    addNum(){
    	let nums  = this.state.numss;//投注注数取整
        let times = this.state.multipleValue;//投注倍数取整
        let money = Math.round(times * nums * 2 * (this.state.modes[this.state.selectYjf].rate * 1000)) /1000;  //倍数*注数*单价 * 模式
        let mid   = stateVar.aboutGame.methodID;
		let current_positionsel = $.lt_position_sel;
        let cur_position = 0;
        let otype =stateVar.aboutGame.otype;
        if (current_positionsel.length > 0) {
            $.each(current_positionsel, function(i, n) {
                cur_position += Math.pow(2, 4 - parseInt(n, 10))
            })
        }
        if( isNaN(nums) || isNaN(times) || isNaN(money) || money <= 0 ){//如果没有任何投注内容
			alert(otype == 'input' ? '请输入正确的号码' : '请选择完整的号码');
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
                this.setState({textAreaValue:stateVar.aboutGame.data_sel[0].join(" ")},()=>{
                	this._inptu_deal();//重新统计
                })
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
                case 'HHZX' : error = Method._inputCheck_Num(3,true,_HHZXcheck,true); break;
                //任选二-直选单式
                case "RXZXSSC2DS":
                case "RXZXWFC2DS":
                case "RXZXFFC2DS":
                case 'ZX2'  : error = Method._inputCheck_Num(2,true); break;
                //任选二组选单式
                case 'RXZUSSC2DS'  :
                case 'RXZUWFC2DS'  :
                case 'RXZUFFC2DS'  :
                case 'ZU2'  : error = Method._inputCheck_Num(2,true,_HHZXcheck,true); break;
                case 'ZX5'  : error = Method._inputCheck_Num(5,true); break;
                case 'ZX4'  : error = Method._inputCheck_Num(4,true); break;
                case 'ZUS'  : error = Method._inputCheck_Num(3,true, _ZUSDScheck, true); break;
                case 'ZUL'  : error = Method._inputCheck_Num(3,true, _ZULDScheck, true); break;
                case 'SDZX3': error = Method._inputCheck_Num(8,true,_SDinputCheck,false); break;
                case 'SDZU3': error = Method._inputCheck_Num(8,true,_SDinputCheck,true); break;
                case 'SDZX2': error = Method._inputCheck_Num(5,true,_SDinputCheck,false); break;
                case 'SDZU2': error = Method._inputCheck_Num(5,true,_SDinputCheck,true); break;
                case 'SDRX1': error = Method._inputCheck_Num(2,true,_SDinputCheck,false); break;
                case 'SDRX2': error = Method._inputCheck_Num(5,true,_SDinputCheck,true); break;
                case 'SDRX3': error = Method._inputCheck_Num(8,true,_SDinputCheck,true); break;
                case 'SDRX4': error = Method._inputCheck_Num(11,true,_SDinputCheck,true); break;
                case 'SDRX5': error = Method._inputCheck_Num(14,true,_SDinputCheck,true); break;
                case 'SDRX6': error = Method._inputCheck_Num(17,true,_SDinputCheck,true); break;
                case 'SDRX7': error = Method._inputCheck_Num(20,true,_SDinputCheck,true); break;
                case 'SDRX8': error = Method._inputCheck_Num(23,true,_SDinputCheck,true); break;
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
                	//$("#lt_write_del").trigger("click");
            	    var lt_elem = $("#lt_write_del");
	                var error_num = lt_elem.data("error_num");
	                var repeat_num = lt_elem.data('repeat_num');
	                if(error_num.length > 0 || repeat_num.length > 0){
	                    Method.play.showErrorNumbers(lt_elem, error_num, repeat_num);
	                }
                default: break;
            }
            if( error.length > 0 ){//如果存在错误的号码，则提示
                ermsg += lot_lang.em_s1+'\n'+error.join(", ")+"\n";
            }

            if( ermsg.length > 1 ){
                alert(ermsg);
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

        let tempObj = mobx.toJS(
        	{
	        	type:otype,
	        	methodid:mid,
	        	name:tempName,
	        	numberbet:nohtml,
	        	desc:tempName + ' '+ nohtml,
	        	codes:temp.join('|'),
	        	mode:this.state.modes[this.state.selectYjf].rate,
	        	modeName:this.state.modes[this.state.selectYjf].name,
	        	times: this.state.multipleValue,
	        	nums: nums,
	        	money:money,
	        	omodel:this.state.omodel,
	        	menuid:stateVar.aboutGame.menuid
        	}
        );
        console.log(tempObj)
        stateVar.BetContent.lt_same_code.push(tempObj);
        stateVar.BetContent.totalDan = stateVar.BetContent.lt_same_code.length;//总单数增加
        let tempNum = 0,tempMoney = 0;
        for(let i=0;i<stateVar.BetContent.lt_same_code.length;i++){
        	tempNum += parseInt(stateVar.BetContent.lt_same_code[i].nums);
        	tempMoney += Number(stateVar.BetContent.lt_same_code[i].money);
        }
        stateVar.BetContent.totalNum = tempNum;//总注数
       	stateVar.BetContent.totalMoney = tempMoney;//总钱
    	stateVar.BetContent.lt_trace_base   = tempMoney;//追号的钱
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
        //成功添加以后清空选号区数据
        for(let i=0; i<stateVar.aboutGame.data_sel.length; i++ ){//清空已选择数据
            stateVar.aboutGame.data_sel[i] = [];
            this.setState({numss:0,money:0});
        }
        if( otype == 'input' ){//清空所有显示的数据
            this.setState({textAreaValue:''},()=>{
            	this._inptu_deal();
            });
        }
        else if( otype == 'digital' || otype == 'dxds' || otype == 'dds' ){
           $("li.number_active").removeClass('number_active');
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
    		lotteryid : this.state.betlotteryId,
    		curmid : this.state.lotterycurmid,
    		poschoose : "",
    		flag : "save",
    		play_source : 5,
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
    		lt_project:[]
    	};
    	for(let i=0;i<stateVar.BetContent.lt_same_code.length;i++){
    		tempObj.lt_project.push(stateVar.BetContent.lt_same_code[i])
    	}
    	this.setState({betokObj:mobx.toJS(tempObj),visible:true})
    	console.log(stateVar.BetContent.lt_same_code)
    }
    openTrace(){
    	this.setState({childVisible:true},()=>{
    		let traceTotal = 120;
	    	let tempArray = this.state.todayAndTomorrow;
	    	let acceptArray = [];
	    	for(let i=0;i<tempArray.length;i++){
	    		if(i == traceTotal){
	    			break;
	    		}else{
	    			let obj = {
	    				key: i+1,
		                name: i+1,
		                age: tempArray[i].issue,
		                address: '0',
		                address1: '0',
		                address2: tempArray[i].saleend,
		                visited:false
	    			}
	    			acceptArray.push(obj);
	    		}
	    	}
	    	setTimeout(()=>{
	    		this.setState({issueArray:acceptArray});
    		},50);
    	});
    };
    onSuperaddition() {
        this.setState({childVisible: false,issueArray:[]});
    };
    //直接投注
    directBet(){

    }
    //删除购物车单条记录
    deleteBet(a){
    	/**
    	 a,单条记录的索引
    	 */
    	stateVar.BetContent.lt_same_code.splice(a,1);
    	stateVar.BetContent.totalDan = stateVar.BetContent.lt_same_code.length;//总单数增加
        let tempNum = 0,tempMoney = 0;
        for(let i=0;i<stateVar.BetContent.lt_same_code.length;i++){
        	tempNum += parseInt(stateVar.BetContent.lt_same_code[i].nums);
        	tempMoney += Number(stateVar.BetContent.lt_same_code[i].money);
        }
        stateVar.BetContent.totalNum = tempNum;
       	stateVar.BetContent.totalMoney = tempMoney;
       	stateVar.BetContent.lt_trace_base = tempMoney;
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
    	this.setState({navFourIndex:c},this.selectAreaData(this.state.lotteryMethod,true))//庄闲特殊处理
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
        	this.setState({navFourIndex:tempIndex},this.selectAreaData(this.state.lotteryMethod,true))//龙虎特殊处理
        }
    }
    //万千百十个切换
    checkwqbsg(a){
    	return a == this.state.wqbsgIndex ? 'hover' : '';
    }
	linkState(){
		console.log('moore')
	}
    //生成选号数据
    selectAreaData(a,flag){
    	let numberObj
    	if(a[this.state.navIndex].title != undefined && a[this.state.navIndex].title == '龙虎庄闲'){
    		numberObj = a[this.state.navIndex].label[this.state.navThreeIndex].label[this.state.navFourIndex];
    	}else{
    		numberObj = a[this.state.navIndex].label[this.state.navTwoIndex].label[this.state.navThreeIndex];
    	}
    	$.lt_position_sel = [];
    	if(numberObj.selectarea.selPosition){
    		let defaultposition = numberObj.defaultposition.split('');
    		for(let i=0;i<defaultposition.length;i++){
    			if(defaultposition[i] == 1){
    				$.lt_position_sel.push(i);
    			}
    		}
    	}
    	let methodid = numberObj.methodid;
    	stateVar.aboutGame.methodID = methodid;
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
    		this.setState({ifRandom:false});
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
		}
    }
    //生成选号界面
    selectArea(a){
    	let numberObj = a[this.state.navIndex].label[this.state.navTwoIndex].label[this.state.navThreeIndex];
    	let numberObjLh  = a[this.state.navIndex]
    	return <div className="c_m_select_body">
    	{
    		(()=>{
    			if(numberObj && numberObj.selectarea.selPosition){
    				const plainOptions = numberObj.defaultposition.split('');
    				const wqbsgTemp = ['万位','千位','百位','十位','个位'];
	    			let tempHtml;
	    			tempHtml = <div className='selPosition'>{
	    				plainOptions.map((val,index)=>{
	    					console.log(val)
    						return (
								<div className={val == 1 ? 'checkBox selected' : 'checkBox'}  key={index}><Checkbox checkedLink={()=>this.linkState('booleanValue')} defaultChecked={val == 1 ? true : false}  onChange={(e)=>this.onChangeCheckBox(e,index,val)}>{wqbsgTemp[index]}</Checkbox></div>
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
					            	 	return <li onClick={(e)=>this.changeNum(e)} value={vl} name={'lt_place_'+val.place}  key={idx}>{vl}<p className="omit">1</p></li>
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
				}
    			return htmlStr
    		})(JSON.stringify(numberObj))
    	}
    	</div>
    }
    //玩法gtitle区域
    gtitleArea(a){
    	let oneLotteryData = a;
    	if(oneLotteryData[this.state.navIndex].title != undefined && oneLotteryData[this.state.navIndex].title == "龙虎庄闲"){
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
    }
    render() {
    	const navList = [
            {
                link: '',
                text: '同倍追号'
            },{
                link: '',
                text: '利润率追号'
            },{
                link: '',
                text: '翻倍追号'
            }
        ];
        const periodsList = ['10期', '20期', '50期', '全部'];

        const columns = [
            {
                title: '序号',
                dataIndex: 'name',
                width: 50,
            }, {
                title: '期数',
                dataIndex: 'age',
                width: 150,
            }, {
                title: '倍率',
                dataIndex: 'address',
                width: 200,
                render: (text, record) => (
                    <span>
                        <InputNumber min={1} max={10} disabled={record.visited ? false : true}  defaultValue={0} onChange={()=>this.onChange()} />&nbsp;倍
                    </span>
                ),
            }, {
                title: '金额',
                dataIndex: 'address1',
                width: 150,
                render: (text) => (
                    <span style={{color: '#CB1313'}}>{text}元</span>
                ),
            }, {
                title: '开奖时间',
                dataIndex: 'address2',
                width: 200,
            }
        ];
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(selectedRowKeys);
            },
            onSelect:(a,b,c)=>{
            	const newData = this.state.issueArray;
            	const target = newData.filter(item => a.key === item.key)[0];
            	if(target){
            		if(b){
            			target.visited = true;
            		}else{
            			target.visited = false;
            		}
            		this.setState({issueArray:newData});
            	}
            	console.log(b)
            },
            onSelectAll:(a,b,c)=>{
            	const newData = this.state.issueArray;
            	if(a){
            		for(let i=0;i<newData.length;i++){
            			newData[i].visited = true;
            		}
            	}else{
            		for(let i=0;i<newData.length;i++){
            			newData[i].visited = false;
            		}
            	}
            	this.setState({issueArray:newData});
            }
        };
    	let oneLotteryData = this.state.lotteryMethod;
    	if(oneLotteryData.length == 0){
    		return <div></div>
    	}
    	// let htmlmethod = this.gtitleArea(oneLotteryData);//玩法区域
    	// let htmldata = this.selectArea(oneLotteryData);//投注区域
    	let objRen = {};
        return (
            <QueueAnim duration={0}
                       animConfig={[
                           { opacity: [1, 0], translateY: [0, 50] }
                       ]}>
                {/*<div className="bet_content" key="ContentTop">*/}
                    {/*<div className="content_title">*/}
                        {/*<ul className="title_list clear">*/}
                            {/*<li>*/}
                                {/*<div className="content_cz_logo">*/}
                                    {/*<img src={cz_logo_11_5} alt=""/>*/}
                                {/*</div>*/}
                            {/*</li>*/}
                            {/*<li>*/}
                                {/*<ul className="content_center">*/}
                                    {/*<li className="content_cz_text">*/}
                                        {/*<div className="cz_name m_bottom">*/}
                                            {/*<span>加拿大11选5</span>*/}
                                            {/*<span className="c_t_facade">官网</span>*/}
                                        {/*</div>*/}
                                        {/*<div className="cz_periods m_bottom">*/}
                                            {/*<span style={{color:'#FFE38E'}}>{this.state.nextIssue}</span>*/}
                                            {/*<span>期</span>*/}
                                        {/*</div>*/}
                                        {/*<div className="voice_switch m_bottom">*/}
                                            {/*<span>音效</span>*/}
                                            {/*<Switch size="small" defaultChecked={false} onChange={(checked) => this.onChanges(checked)} />*/}
                                        {/*</div>*/}
                                    {/*</li>*/}
                                    {/*<li className="abort_time">*/}
                                        {/*<p className="abort_time_text">投注截止还有</p>*/}
                                        {/*<div className="c_m_count_down">*/}
                                            {/*<Row type="flex" align="bottom">*/}
                                                {/*<Col span={6}>*/}
                                                    {/*<div className="item_text">{this.state.timeShow.hour}</div>*/}
                                                {/*</Col>*/}
                                                {/*<Col span={2}>*/}
                                                    {/*<div className="item_type">时</div>*/}
                                                {/*</Col>*/}
                                                {/*<Col span={6}>*/}
                                                    {/*<div className="item_text">{this.state.timeShow.minute}</div>*/}
                                                {/*</Col>*/}
                                                {/*<Col span={2}>*/}
                                                    {/*<div className="item_type">分</div>*/}
                                                {/*</Col>*/}
                                                {/*<Col span={6}>*/}
                                                    {/*<div className="item_text">{this.state.timeShow.second}</div>*/}
                                                {/*</Col>*/}
                                                {/*<Col span={2}>*/}
                                                    {/*<div className="item_type">秒</div>*/}
                                                {/*</Col>*/}
                                            {/*</Row>*/}
                                        {/*</div>*/}
                                    {/*</li>*/}
                                {/*</ul>*/}
                            {/*</li>*/}
                            {/*<li>*/}
                                {/*<div className="praise_mark">*/}
                                    {/*<div className="praise_mark_text">*/}
                                        {/*<span>第<span style={{color:'#FFE38E'}}>{this.state.nowIssue}</span>期&nbsp;开奖号码</span>*/}
                                        {/*<span className="method_introduce right">玩法介绍</span>*/}
                                    {/*</div>*/}
                                    {/*<ul className="ball_number clear">*/}
	                                    {/*{*/}
                                        	{/*this.state.code.map((val,idx)=>{*/}
                                        		{/*return (*/}
                                        			{/*<li key={idx}>{val}</li>*/}
                                        		{/*)*/}
                                        	{/*})*/}
	                                    {/*}*/}
                                    {/*</ul>*/}
                                {/*</div>*/}
                            {/*</li>*/}
                        {/*</ul>*/}
                    {/*</div>*/}
                {/*</div>*/}
                {/*<div className="content_main" key="ContentMian">*/}
                    {/*<div className="c_m_nav">*/}
                        {/*<ul className="c_m_nav_list left">*/}
                            {/*{*/}
                                {/*// oneLotteryData.map(( element,index ) => {*/}
                                {/*// 	if(element.title == '任选'){*/}
                                {/*// 		return(*/}
                                {/*// 			<li className='renxuan' key={index}>*/}
									{/*// 			<div className="c_m_select">*/}
						         {/*//                    <div className="c_m_select_method_text">{element.title+'玩法'}</div>*/}
						         {/*//                    <ul className="c_m_select_list clear">*/}
						         {/*//                    {*/}
						         {/*//                    	element.label.map((val,idx)=>{*/}
						         {/*//                    		let tempVal = val.gtitle.substr(0,2);*/}
						         {/*//                    		if(objRen[tempVal] == undefined){*/}
						         {/*//                    			objRen[tempVal] = tempVal*/}
						         {/*//                    			return(*/}
							     {/*//                        			<li onClick={() => this.changeMethod(index,idx)} key={idx}>{element.title + tempVal.split('')[1]}</li>*/}
							     {/*//                        		)*/}
						         {/*//                    		}*/}
						         {/*//                    		return '';*/}
						         {/*//                    	})*/}
						         {/*//                    }*/}
						         {/*//                    </ul>*/}
						         {/*//                </div>*/}
									{/*// 		</li>*/}
                                {/*// 		)*/}
                                {/*// 	}*/}
                                {/*//     return(*/}
                                {/*//         <li onClick={() => this.changeMethod(index)} className={ this.check_nav_index( index ) } key={index}>{element.title}</li>*/}
                                {/*//     )*/}
                                {/*// })*/}
                            {/*}*/}
                        {/*</ul>*/}
                    {/*</div>*/}
                    {/*<div className="c_m_controler">*/}
                        {/*<div className="c_m_controler_method">*/}
                     	{/*/!*{htmlmethod}*!/*/}
                        	{/*{*/}
                        		{/*// this.getnfprizeArea(oneLotteryData)*/}
                        	{/*}*/}
                        {/*</div>*/}
                        {/*<div className="c_m_select_number">*/}
                            {/*<div className="c_m_select_title">*/}
                                {/*<div className="c_m_select_name">*/}
                                    {/*/!*{oneLotteryData[this.state.navIndex].title == '龙虎庄闲' ? oneLotteryData[this.state.navIndex].label[this.state.navThreeIndex].gtitle : (oneLotteryData[this.state.navIndex].label[this.state.navTwoIndex].gtitle + oneLotteryData[this.state.navIndex].label[this.state.navTwoIndex].label[this.state.navThreeIndex].name)}*!/*/}
                                {/*</div>*/}
                                {/*<div style={{display:'none'}}>*/}
	                                {/*<ul className="c_m_select_hot">*/}
	                                    {/*<li onClick={()=>{this.setState({hotIndex : 0})}} className={this.state.hotIndex === 0 ? 'active' : ''} >冷热</li>*/}
	                                    {/*<li onClick={()=>{this.setState({hotIndex : 1})}} className={this.state.hotIndex === 1 ? 'active' : ''}>遗漏</li>*/}
	                                {/*</ul>*/}
	                                {/*<Button className="c_m_btn" onClick={()=>{this.setState({hotSwitch : !this.state.hotSwitch})}}>*/}
	                                    {/*{this.state.hotSwitch ? '开' : '关'}*/}
	                                {/*</Button>*/}
	                                {/*<Radio.Group  onChange={(e)=>{this.handleSizeChange(e)}}>*/}
	                                    {/*<Radio.Button value="30期">30期</Radio.Button>*/}
	                                    {/*<Radio.Button value="60期">60期</Radio.Button>*/}
	                                    {/*<Radio.Button value="100期">100期</Radio.Button>*/}
	                                {/*</Radio.Group>*/}
                                {/*</div>*/}
                                {/*<span className="c_m_select_title_right right">*/}
                                    {/*/!*<span>{oneLotteryData[this.state.navIndex].title == '龙虎庄闲' ? oneLotteryData[this.state.navIndex].label[this.state.navThreeIndex].label[this.state.navFourIndex].methoddesc : oneLotteryData[this.state.navIndex].label[this.state.navTwoIndex].label[this.state.navThreeIndex].methoddesc}</span>*!/*/}
                                    {/*<span className="c_m_lottery_explain">中奖说明</span>*/}
                                {/*</span>*/}
                            {/*</div>*/}
                            {/*/!*{htmldata}*!/*/}
                        {/*</div>*/}
                        {/*<div className="c_m_select_operate">*/}
                            {/*<div className="c_m_select_operate_text">*/}
                                {/*<span className="c_m_select_money">您选择了<strong>{this.state.numss}</strong>注，共<strong>{this.state.money}</strong>元</span>*/}
                                {/*<span className="c_m_select_multiple">*/}
                                    {/*<span>倍数：</span>*/}
                                    {/*<img className="hvr-grow-shadow" onClick={()=>{this.minusMultiple()}} src={minus_multiple} alt="减少倍数"/>*/}
                                    {/*<input type="text" value={this.state.multipleValue} onChange={this.multipleValue.bind(this)}/>*/}
                                    {/*<img className="hvr-grow-shadow" onClick={()=>{this.addMultiple()}} src={add_multiple} alt="增加倍数"/>*/}
                                {/*</span>*/}
                                {/*<span className="c_m_select_yjftype">*/}
                                    {/*<span>模式：</span>*/}
                                    {/*<ul className="c_m_select_yjf right">*/}
                                        {/*{*/}
                                            {/*this.state.modes.map((value,index)=>{*/}
                                                {/*return (*/}
                                                  {/*<li onClick={()=>this.changeMode(index)} className={this.state.selectYjf === index ? 'yjf_active' : ''} key={index}>{value.name}</li>*/}
                                                {/*);*/}
                                            {/*})*/}
                                        {/*}*/}
                                    {/*</ul>*/}
                                {/*</span>*/}
                                {/*<span className="c_m_future_expect">*/}
                                    {/*<span>未来期：</span>*/}
                                    {/*{*/}
                                    	{/*(()=>{*/}
                                    		{/*return (*/}
                                    			{/*<span>*/}
			                                        {/*<Select value={this.state.issueIndex} style={{ width: 170 }} onChange={(value) => this.handleChangeIssue(value)}>*/}
                                    					{/*{*/}
                                    						{/*this.state.todayAndTomorrow.map((val,index)=>{*/}
                                    							{/*if(index == 0){*/}
                                    								{/*return (*/}
	                                    								{/*<Option key={index} value={val.issue}>{val.issue}(当前期)</Option>*/}
	                                    							{/*)*/}
                                    							{/*}else{*/}
                                    								{/*if(index>=120){*/}
                                    									{/*return ''*/}
                                    								{/*}*/}
                                    								{/*return (*/}
	                                    								{/*<Option key={index} value={val.issue}>{val.issue}</Option>*/}
	                                    							{/*)*/}
                                    							{/*}*/}
                                    						{/*})*/}
                                    					{/*}*/}
			                                        {/*</Select>*/}
			                                    {/*</span>*/}
                                    		{/*)*/}
                                    	{/*})()*/}
                                    {/*}*/}
                                {/*</span>*/}
                            {/*</div>*/}
                            {/*<div className="c_m_select_button">*/}
                                {/*<i className="c_m_add_btn" onClick={()=>this.addNum()}></i>*/}
                                {/*<i className="c_m_bet_btn" onClick={()=>this.directBet()}></i>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        {/*<div className="c_m_select_code_record">*/}
                            {/*<div className="c_m_select_record_content">*/}
                                {/*<Row>*/}
                                    {/*<Col span={19}>*/}
                                        {/*<div className="c_m_select_record_table">*/}
                                        {/*{*/}
                                        	{/*stateVar.BetContent.lt_same_code.length == 0 ? '选号区，请选择号码' : stateVar.BetContent.lt_same_code.map((value,index)=>{*/}
                                        		{/*return (*/}
                                        			{/*<ul className="c_m_select_record_list clear" key={index}>*/}
                                        				{/*<li>{value.name}</li>*/}
		                                                {/*<li>{value.numberbet}</li>*/}

		                                                {/*<li className="c_m_cody_close" onClick={()=>this.deleteBet(index)}><img src={close} alt=""/></li>*/}
		                                                {/*<li>{value.money + '元'}</li>*/}
		                                                {/*<li>{value.nums + '注'}</li>*/}
		                                                {/*<li>{value.times + '倍'}</li>*/}
		                                                {/*<li>{value.modeName}</li>*/}
                                        			{/*</ul>*/}
                                        			{/*)*/}
                                        	{/*})*/}
                                        {/*}*/}
                                        {/*</div>*/}
                                    {/*</Col>*/}
                                    {/*<Col span={5}>*/}
                                        {/*<div className="c_m_machine_select">*/}
                                            {/*<Button className="c_m_machine_select_1" disabled={this.state.ifRandom} onClick={()=>this.setByRandom()}>机选一注</Button>*/}
                                            {/*<Button className="c_m_machine_select_5" disabled={this.state.ifRandom} onClick={()=>this.setByRandom(5)}>机选五注</Button>*/}
                                            {/*<div className="c_m_empty machine_active" onClick={()=>this.clearAllBet()}>清空号码</div>*/}
                                        {/*</div>*/}
                                    {/*</Col>*/}
                                {/*</Row>*/}
                            {/*</div>*/}
                            {/*<div className="c_m_affirm_bet">*/}
                                {/*<ul className="c_m_affirm_bet_list clear">*/}
                                    {/*<li>*/}
                                        {/*<span>单数：</span>*/}
                                        {/*<span><strong>{stateVar.BetContent.totalDan}</strong>单</span>*/}
                                    {/*</li>*/}
                                    {/*<li>*/}
                                        {/*<span>注数：</span>*/}
                                        {/*<span><strong>{stateVar.BetContent.totalNum}</strong>注</span>*/}
                                    {/*</li>*/}
                                    {/*<li>*/}
                                        {/*<span>总金额：</span>*/}
                                        {/*<span><strong>{stateVar.BetContent.totalMoney}</strong>元</span>*/}
                                    {/*</li>*/}
                                    {/*<li className="c_m_affirm_bet_btn" onClick={()=>this.actionBet()}>确认投注</li>*/}
                                    {/*<li className="c_m_superaddition"><Button disabled={stateVar.BetContent.lt_same_code == 0 ? true : false} onClick={()=>this.openTrace()}>追号</Button></li>*/}
                                {/*</ul>*/}
                                {/*<Modal*/}
					                {/*width='865px'*/}
					                {/*visible={this.state.childVisible}*/}
					                {/*title= {<ModelView navList = {navList}/>}*/}
					                {/*onCancel={()=>{this.onSuperaddition()}}*/}
					                {/*maskClosable={false}*/}
					                {/*footer={null}*/}
					                {/*className="modal_content"*/}
					            {/*>*/}
					                {/*<div className="modal_main">*/}
					                    {/*<div className="m_m_content clear">*/}
					                        {/*<div className="modal_periods left">*/}
					                            {/*<p className="m_p_text left">追号期数</p>*/}
					                            {/*<ul className="m_periods_list left">*/}
					                                {/*{*/}
					                                    {/*periodsList.map((value, index)=>{*/}
					                                        {/*return <li key={index} className={this.state.periodsIndex === index ? 'm_periods_active' : ''} onClick={()=>this.setState({periodsIndex: index})}>{value}</li>*/}
					                                    {/*})*/}
					                                {/*}*/}
					                            {/*</ul>*/}
					                        {/*</div>*/}
					                        {/*<div className="periods_input left">*/}
					                            {/*<span>手动输入</span>*/}
					                            {/*<InputNumber min={1} max={10} defaultValue={1} onChange={(value)=>{this.onChange(value)}} />*/}
					                            {/*<span>期</span>*/}
					                        {/*</div>*/}
					                        {/*<div className="multiple_input left">*/}
					                            {/*<span>倍数</span>*/}
					                            {/*<InputNumber min={1} max={10} defaultValue={1} onChange={(value)=>{this.onChange(value)}} />*/}
					                            {/*<span>倍</span>*/}
					                        {/*</div>*/}
					                        {/*<Button type="primary" className="m_m_btn" loading={this.state.loading} onClick={()=>this.enterLoading()}>*/}
					                            {/*生成*/}
					                        {/*</Button>*/}
					                    {/*</div>*/}
					                    {/*<div className="m_m_table">*/}
					                        {/*<Table rowSelection={rowSelection}*/}
					                               {/*columns={columns}*/}
					                               {/*dataSource={this.state.issueArray}*/}
					                               {/*pagination={false}*/}
					                               {/*scroll={{ y: 240 }}*/}
					                               {/*size="middle"*/}
					                        {/*/>*/}
					                    {/*</div>*/}
					                    {/*<div className="m_m_footer clear">*/}
					                        {/*<div className="m_m_left_btn left">*/}
					                            {/*<Checkbox onChange={()=>this.onChange()}>中奖后停止追号</Checkbox>*/}
					                            {/*<Button type="primary">清空号码</Button>*/}
					                        {/*</div>*/}
					                        {/*<ul className="m_m_footer_info right">*/}
					                            {/*<li>*/}
					                                {/*<span>总期数：</span>*/}
					                                {/*<em>0</em>*/}
					                                {/*<span>期，</span>*/}
					                            {/*</li>*/}
					                            {/*<li>*/}
					                                {/*<span>追号总金额：</span>*/}
					                                {/*<em>0.00</em>*/}
					                                {/*<span>元</span>*/}
					                            {/*</li>*/}
					                            {/*<li>*/}
					                                {/*<Button type="primary"*/}
					                                        {/*loading={this.state.chaseLoading}*/}
					                                        {/*onClick={()=>this.enterChaseLoading()}*/}
					                                        {/*size="large"*/}
					                                {/*>*/}
					                                    {/*确定追号投注*/}
					                                {/*</Button>*/}
					                            {/*</li>*/}
					                        {/*</ul>*/}
					                    {/*</div>*/}
					                {/*</div>*/}
					            {/*</Modal>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        {/*<BetRecordTable betHistory={this.state.historyBet}/>*/}
                    {/*</div>*/}
                {/*</div>*/}
                {/*<AlterModal visible={this.state.visible} lotteryOkBet={this.lotteryOkBet.bind(this)} betData={this.state.betokObj}/>*/}
            </QueueAnim>
        );
    }
}
