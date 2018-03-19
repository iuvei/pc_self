/*公用模态框*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Button,Modal,Popover} from 'antd';
import emitter from '../../../Utils/events';
import Fatch from '../../../Utils';
import './LotteryModal.scss';
import { stateVar } from '../../../State';

@observer
export default class AlterModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	tzloding:false,
        	mmcvisible:false,
        	time:1,
        	spanText:'确定',
        	ifStop:false,
        	bonus:0,
        	kjText:''
        }
    };
    hideModal(){
    	this.setState({mmcvisible:false})
    };
    mmcOkStop(e){
    	if(this.state.spanText == '停止'){
    		if(this.state.ifStop){
    			return;
    		}
    		this.setState({ifStop:true});
    	}else{
    		this.setState({mmcvisible:false,ifStop:false});
    	}
    };
    getKjHistory(){
 		Fatch.aboutMmc({
		method:"POST",
		body:JSON.stringify({lotteryid:stateVar.nowlottery.lotteryBetId,issuecount:20,flag:'getlastcode'})
		}).then((data)=>{
			let tempData = data.repsoneContent;
			this.setState({mmcmoni:false});
			if(data.status == 200){
				if(tempData.length > 0){
					stateVar.mmccode = tempData[0].split(' ');
				}
				stateVar.mmCkjNumberList = tempData;
			}
		})
    };
    /*获取本平台余额*/
    getMenu() {
        Fatch.menu({
            method: 'POST',
            body: JSON.stringify({"flag":"getmoney"})
        }).then((res)=>{
            if (res.status == 200) {
                stateVar.allBalance.cpbalance = res.repsoneContent;
            }
        })
    };
    onOk(){
    	let tempObj  = this.props.betData;
    	let postData = {};
    	this.setState({tzloding:true});
    	$(".btn_group .oktz span").html('投注中...');
    	if(stateVar.nowlottery.lotteryBetId == 23){
    		if(stateVar.BetContent.totalMoney > stateVar.allBalance.cpbalance){
    			const modal = Modal.error({
				    title: '温馨提示',
				    content: '余额不足',
				    zIndex:10000
				});
				setTimeout(() => modal.destroy(), 3000);
				return;
    		}
    		postData = {
	    		lotteryid : tempObj.lotteryid,
	    		mid : 311700,
	    		poschoose : tempObj.poschoose,
	    		flag : tempObj.flag,
	    		play_source : tempObj.play_source,
	    		lt_total_nums : (stateVar.BetContent.totalNum/tempObj.lt_trace_count_input)*1000/1000,
	    		lt_total_money : stateVar.BetContent.totalMoney,
	    		randomNum : Math.floor((Math.random() * 10000) + 1),
	    		times:this.state.time,
	    		lt_trace_count_input:tempObj.lt_trace_count_input,
	    		It_trace_stop:tempObj.isPrizeStop == true ? 'yes' : 'no',
	    		lt_project : tempObj.lt_project
	    	};
	    	let defaultTime = 1;
	    	let tempIstop = tempObj.isPrizeStop;
	    	let getPrizeTime = 0;
	    	let kjtime = 1;
	    	let totalBonus = 0;
	    	let getlastPrize = 0;
	    	let formmc = ()=>{
	    		postData.times = kjtime;
	    		Fatch.aboutMmc({
	    		method:"POST",
	    		body:JSON.stringify(postData)
	    		}).then((data)=>{
	    			emitter.emit('kjhistory');
	    			if(defaultTime == 1){
	    				if(this.state.time < tempObj.lt_trace_count_input){
				    		$(".btn_group .oktz span").html('确定');
				    		this.props.lotteryOkBet();
				    		this.setState({tzloding:false,spanText:'停止',mmcvisible:true,kjText:<p className="lxp">第1次,共{tempObj.lt_trace_count_input}次</p>});
				    	}
	    			}
	    			let tempData = data.repsoneContent;
	    			$(".btn_group .oktz span").html('确定');
	    			this.setState({tzloding:false});
	    			this.props.lotteryOkBet();
	    			if(data.status == 200){
	    				this.getKjHistory();
	    				this.getMenu();
						this.props.historyBet();
	    				if(kjtime == tempObj.lt_trace_count_input){
	    					if(kjtime > 1){
	    						this.setState({spanText:'确定'});
	    						if(totalBonus > 0){
	    							this.setState({
			    						kjText:<div>
			    						<p className="lxp">共中奖{totalBonus.toFixed(4)}元</p>
			    						<p className="lxp">共游戏{kjtime}次</p>
			    						</div>
		    						});
	    						}else{
	    							this.setState({
			    						kjText:<div>
			    							<p className="lxp">共游戏{kjtime}次</p>
			    						</div>
		    						});
	    						}
	    						kjtime = 1;
	    					}else{
	    						const modal = Modal.success({
								    title: '温馨提示',
								    content: data.longMessage,
								});
								setTimeout(() => modal.destroy(), 2000);
	    					}
							stateVar.BetContent = {
						        lt_same_code:[],totalDan:0,totalNum:0,totalMoney:0,lt_trace_base:0
						    };
	    				}else{
	    					totalBonus = Number(totalBonus) + Number(tempData.bonus);
	    					if(!this.state.ifStop){
	    						if(tempData.bonus > 0 ){
	    							if(tempObj.isPrizeStop){
	    								this.setState({spanText:'确定',
				    						kjText:<div>
				    						<p className="lxp">共中奖{totalBonus.toFixed(4)}元</p>
				    						<p className="lxp">共游戏{kjtime}次</p>
				    						</div>
			    						});
			    						kjtime = 1;
			    						stateVar.BetContent = {
									        lt_same_code:[],totalDan:0,totalNum:0,totalMoney:0,lt_trace_base:0
									    };
	    								return;
	    							}
		    						getlastPrize = tempData.bonus;
		    						getPrizeTime++;
		    						this.setState({
			    						kjText:<div><p className="lxp">第{kjtime}次,共{tempObj.lt_trace_count_input}次</p>
			    						<p className="lxp">第{getPrizeTime}次中奖，中奖{tempData.bonus}元</p>
			    						<p className="lxp">共中奖{totalBonus.toFixed(4)}元</p>
			    						</div>
		    						});
		    					}else{
			    					if(totalBonus > 0){
			    						this.setState({
				    						kjText:<div><p className="lxp">第{kjtime}次,共{tempObj.lt_trace_count_input}次</p>
				    						<p className="lxp">第{getPrizeTime}次中奖，中奖{getlastPrize}元</p>
				    						<p className="lxp">共中奖{totalBonus.toFixed(4)}元</p>
				    						</div>
			    						});
				    				}else{
				    					this.setState({
				    						kjText:<div><p className="lxp">第{kjtime}次,共{tempObj.lt_trace_count_input}次</p>
				    						</div>
			    						});
			    					}
			    				}
		    					setTimeout(()=>{
		    						if(this.state.ifStop){
		    							if(totalBonus > 0){
			    							this.setState({
					    						kjText:<div>
					    						<p className="lxp">共中奖{totalBonus.toFixed(4)}元</p>
					    						<p className="lxp">共游戏{kjtime}次</p>
					    						</div>
				    						});
			    						}else{
			    							this.setState({
					    						kjText:<div>
					    							<p className="lxp">共游戏{kjtime}次</p>
					    						</div>
				    						});
			    						}
			    						this.setState({spanText:'确定'});
			    						kjtime = 1;
			    						return;
		    						}
		    						kjtime++;
		    						if(totalBonus > 0){
			    						this.setState({
				    						kjText:<div><p className="lxp">第{kjtime}次,共{tempObj.lt_trace_count_input}次</p>
				    						<p className="lxp">第{getPrizeTime}次中奖，中奖{getlastPrize}元</p>
				    						<p className="lxp">共中奖{totalBonus.toFixed(4)}元</p>
				    						</div>
			    						});
				    				}else{
				    					this.setState({
				    						kjText:<div><p className="lxp">第{kjtime}次,共{tempObj.lt_trace_count_input}次</p>
				    						</div>
			    						})
				    				}
				    				setTimeout(()=>{formmc()},1000);
		    					},1000);
	    					}else{
	    						if(totalBonus > 0){
	    							this.setState({
			    						kjText:<div>
			    						<p className="lxp">共中奖{totalBonus.toFixed(4)}元</p>
			    						<p className="lxp">共游戏{kjtime}次</p>
			    						</div>
		    						});
	    						}else{
	    							this.setState({
			    						kjText:<div>
			    							<p className="lxp">共游戏{kjtime}次</p>
			    						</div>
		    						});
	    						}
	    						this.setState({spanText:'确定'});
	    						kjtime = 1;
	    						return;
	    					}
	    				}
	    			}else{
	    				const modal = Modal.error({
						    title: '温馨提示',
						    content: data.longMessage,
						});
						setTimeout(() => modal.destroy(),3000);
	    			}
    			})
	    	}
	    	formmc();
    	}else{
    		if(tempObj.lt_trace_if == 'yes'){
    			postData = {
		    		lotteryid : tempObj.lotteryid,
		    		curmid : tempObj.curmid,
		    		flag : tempObj.flag,
		    		play_source : tempObj.play_source,
		    		lt_issue_start : tempObj.lt_issue_start,
		    		lt_total_nums : tempObj.lt_total_nums,
		    		lt_total_money : tempObj.lt_total_money,
		    		lt_trace_stop: tempObj.lt_trace_stop,
		    		lt_trace_if:'yes',
		    		lt_trace_money : tempObj.lt_trace_money,
					lt_trace_count_input : tempObj.lt_trace_count_input,
					lt_trace_issues : tempObj.lt_trace_issues,
		    		randomNum : Math.floor((Math.random() * 10000) + 1),
		    		lt_project : tempObj.lt_project
		    	};
    			postData = $.extend(postData,tempObj);
    		}else{
	    			postData = {
		    		lotteryid : tempObj.lotteryid,
		    		curmid : tempObj.curmid,
		    		poschoose : tempObj.poschoose,
		    		flag : tempObj.flag,
		    		play_source : tempObj.play_source,
		    		lt_furture_issue : tempObj.lt_furture_issue,
		    		lt_issue_start : tempObj.lt_issue_start,
		    		lt_total_nums : tempObj.lt_total_nums,
		    		lt_total_money : tempObj.lt_total_money,
		    		randomNum : Math.floor((Math.random() * 10000) + 1),
		    		lt_project : tempObj.lt_project
		    	};
    		}
	    	Fatch.aboutBet({
	    		method:"POST",
	    		body:JSON.stringify(postData)
	    		}).then((data)=>{
	    			$(".btn_group .oktz span").html('确定');
	    			this.props.lotteryOkBet();
	    			this.setState({tzloding:false});
	    			if(data.status == 200){
	    				this.getMenu();
	    				this.props.historyBet();
	    				const modal = Modal.success({
						    title: '温馨提示',
						    content: data.longMessage,
						});
						setTimeout(() => modal.destroy(), 3000);
						stateVar.BetContent = {
					        lt_same_code:[],totalDan:0,totalNum:0,totalMoney:0,lt_trace_base:0
					    };
	    			}else{
	    				$(".btn_group .oktz span").html('确定');
	    				this.setState({tzloding:false});
	    				let modal;
	    				if(data.longMessage.fail > 0){
	    					let msg = data.longMessage.content[0];
	    					modal = Modal.error({
							    title: '温馨提示',
							    content: msg,
							});
	    				}else{
	    					modal = Modal.error({
							    title: '温馨提示',
							    content: data.longMessage,
							});
	    				}
						setTimeout(() => modal.destroy(), 3000);
	    			}
    		})
    	}
    }
    onCancel= () => {
        $(".btn_group .oktz span").html('确定');
        this.setState({tzloding:false,time:1});
		this.props.lotteryOkBet(true);
    }
    render() {
    	let tempData = this.props.betData;
        return (
            <div>
                <Modal
                    title="温馨提示"
                    visible={stateVar.betVisible}
                    wrapClassName="lottery-modal"
                    onCancel={this.onCancel}
                    maskClosable={false}
                    footer={null}
                    zIndex="1001" >
                    <div className='l_m_content'>
                        <p className='l_m_title'>{
                        	tempData.lt_trace_if == 'yes' ? '你确定追号'+tempData.lt_trace_count_input+'期吗？' : ('你确定加入'+(stateVar.nowlottery.lotteryBetId == 23 ? '此游戏吗' : tempData.lt_furture_issue+'期？'))
                        }</p>
                        <div>
                            <div className='l_m_rectangle'></div>
                            <ul className='l_m_list'>
                            {
                            	tempData.lt_project ? tempData.lt_project.map((val,index)=>{
                            		return(
                            			<li key={index}>{
                            				val.desc.length > 40 ? <Popover content={val.desc}>
																	    <span>{val.desc.substr(0,40)+'...'}</span>
																	</Popover> : val.desc
                            			}
                            			<span className='l_m_unit'>{val.modeName}</span>
                            			</li>
                            		)
                            	}) : ''
                            }
                            </ul>
                            <ul className='l_m_warn'>
                                <li>单挑模式下，单玩法当期最大奖金3万+投注本金</li>
                            </ul>
                            <p>总金额：<span className='l_m_total'>{tempData.lt_trace_if == 'yes' ? Number(tempData.lt_trace_money).toFixed(4) : Number(tempData.lt_total_money).toFixed(4)}</span>元</p>
                        </div>
                    </div>
                    <div className='btn_group'>
                        <Button disabled={this.state.tzloding} className='oktz'  type="primary"  onClick={()=>{this.onOk()}}>
                            确认
                        </Button>
                        <Button  className='btn_cancel' type="primary"  onClick={()=>{this.onCancel()}}>
                            取消
                        </Button>
                    </div>
                </Modal>
                <div className='mmclxgame'>
                 	<Modal
			          title="连续游戏"
			          visible={this.state.mmcvisible}
			          maskClosable={false}
			          onCancel={()=>this.hideModal()}
			          footer={null}
			          className='mmcDiv'
			        >
			          	{this.state.kjText}
				      	<div className='mmclxgame'>
	                        <Button className='lxok'  type="primary"  onClick={(e)=>{this.mmcOkStop(e)}}>
	                            {this.state.spanText}
	                        </Button>
	                   	</div>
			        </Modal>
			    </div>
            </div>
        )
    }
}
