import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { hashHistory } from 'react-router';
import './RightSider.scss';
import { stateVar } from '../../../State';
import common from './../../../CommonJs/common.js';

@observer
export default class RightSider extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	el1: {rotateZ: 0},
        	moreIndex:10
        };
    }
    updateMoney() {
        this.setState({
            el1: {rotateZ: this.state.el1.rotateZ + 25}
        });
        if(this.state.el1.rotateZ<1080){
            window.requestAnimationFrame(this.updateMoney.bind(this));
        } else {
            this.setState({
                el1: {rotateZ: 0}
            })
        }
    };
    onHashHistory(router, nav, childNav) {
        hashHistory.push({
            pathname: router,
            query: {navIndex: childNav}
        });
        stateVar.navIndex = nav;
    };
    showMore(){
    	this.setState({moreIndex:20});
    };
    hideMore(){
    	this.setState({moreIndex:10});
    };
    render() {
    	let kjNumber;
    	if(stateVar.nowlottery.lotteryBetId == 23){
    		kjNumber =  stateVar.mmCkjNumberList.slice() || [];
    	}else{
    		kjNumber =  stateVar.kjNumberList.slice() || [];
    	}
    	let tempObj = {type:'',content:[]};
    	let shapeFlag = true;
    	$.each(stateVar.kjNumberList,(index,value)=>{
    		if(value.shapes){
    			for(let i in value.shapes){
    				if(stateVar.aboutGame.methodID == i){
    					shapeFlag = false;
    					tempObj.type= value.shapes[i].type;
    					tempObj.content.push({shapeCode:value.code,shapeIssue:value.issue,shapeWei:value.shapes[i].wei,shapeType:value.shapes[i].shape})
    				}
    			}
    			if(shapeFlag){
    				tempObj.type= '';
					tempObj.content.push({shapeCode:value.code,shapeIssue:value.issue});
    			}
    		}else{
				tempObj.type= '';
				tempObj.content.push({shapeCode:value.code,shapeIssue:value.issue});
    		}
    	});
        return (
            <div className="right_sider" key="RightSider">
                <div className="user_info">
                    <ul className="user_info_list">
                        <li>您好！{common.getStore('userName')}</li>
                        <li>余额:<span style={{color:'#CF2027'}}>￥{stateVar.allBalance.cpbalance}</span></li>
                        <li>
                            <div className="user_recharge" onClick={()=>this.onHashHistory('/financial/recharge', 'financial', 0)}>立即充值</div>
                        </li>
                    </ul>
                </div>
                {
                	(()=>{
                		let showhtml;
                		if(stateVar.nowlottery.lotteryBetId == 23){
                			showhtml=<div className="history_period">
                			<ul className="thead_title mmc_title">
		                        <li>开奖号码</li>
		                    </ul>
				            {
				            	kjNumber.map((value,index)=>{
		                    		if(index >= this.state.moreIndex){
		                    			return ''
		                    		}
		                    		return(
		                    			<ul className="tbody_title mmc_tbody_title" key={index}>
			                                <li>
				                                <ul className="right_ball_number clear">{
				                                	value.split(' ').map((val,idx)=>{
				                                		return (
						                                    <li key={idx}>{val}</li>
				                                		)
				                                	})
				                                }
				                                </ul>
			                                </li>
			                            </ul>
		                    		)
		                    	})
				            }
				            <div style={{display:((this.state.moreIndex == 10 && kjNumber.length != 0) ? 'block' : 'none')}} className="r_sider_more" onClick={()=>this.showMore()}>显示更多10期>></div>
			                <div style={{display:((this.state.moreIndex == 20 && kjNumber.length != 0) ? 'block' : 'none')}} className="r_sider_more" onClick={()=>this.hideMore()}>立即收起</div>
			                <div style={{display: kjNumber.length == 0 ? 'block' : 'none'}} className="r_sider_more">无数据</div>
			                </div>
                		}else{
            				showhtml = (()=>{
            					if(tempObj.type == '' || tempObj.type == undefined){
            						return (
            							<div className="history_period">
	            							<ul className="thead_title">
						                        <li style={{width:'40%'}}>奖期</li>
						                        <li style={{width:'60%'}}>号码</li>
						                    </ul>
						                    {
						                    	tempObj.content.map((value,index)=>{
						                    		if(index >= this.state.moreIndex){
						                    			return ''
						                    		}
						                    		return(
						                    			<ul className="tbody_title" key={index} style={{height:(stateVar.nowlottery.lotteryBetId == 26 ? '43px' : '35px'),lineHeight:(stateVar.nowlottery.lotteryBetId == 26 ? '43px' : '35px')}}>
							                                <li style={{width:'40%'}}>{
							                                	(value.shapeIssue.split('-').length == 2 ? value.shapeIssue.split('-')[1] : value.shapeIssue.split('-')[0]) +'期'
							                                }</li>
							                                <li style={{width:(stateVar.nowlottery.lotteryBetId == 26 ? '55%' : '60%')}}>
								                                <ul className="right_ball_number clear" style={{marginTop:(stateVar.nowlottery.lotteryBetId == 26 ? '2px' : '8px'),marginLeft:(value.shapeCode.length > 5 ? '16px' : (value.shapeCode.length < 5 ? '37px' : '23px'))}}>{
								                                	(()=>{
								                                		if(value.shapeCode.length > 5){
								                                			if(stateVar.nowlottery.lotteryBetId == 26){
								                                				return(
									                                				value.shapeCode.split(' ').map((val,idx)=>{
									                                					if(value.shapeWei){
									                                						return (
															                                    <li className={value.shapeWei[idx] == 1 ? 'selected morepklength' : 'morelength'} key={idx}>{val}</li>
													                                		)
									                                					}else{
									                                						return (
															                                    <li className='selected morepklength' key={idx}>{val}</li>
													                                		)
									                                					}
												                                	})
									                                			)
								                                			}else{
								                                				return(
									                                				value.shapeCode.split(' ').map((val,idx)=>{
									                                					if(value.shapeWei){
									                                						return (
															                                    <li className={value.shapeWei[idx] == 1 ? 'selected morelength' : 'morelength'} key={idx}>{val}</li>
													                                		)
									                                					}else{
									                                						return (
															                                    <li className='selected morelength' key={idx}>{val}</li>
													                                		)
									                                					}
												                                	})
									                                			)
								                                			}
								                                		}else{
								                                			return(
									                                			value.shapeCode.split('').map((val,idx)=>{
								                                					if(value.shapeWei){
								                                						return (
														                                    <li className={value.shapeWei[idx] == 1 ? 'selected' : ''} key={idx}>{val}</li>
												                                		)
								                                					}else{
								                                						return (
														                                    <li className='selected' key={idx}>{val}</li>
												                                		)
								                                					}
											                                	})
								                                			)
								                                		}
								                                	})()
								                                }
								                                </ul>
							                                </li>
							                            </ul>
						                    		)
						                    	})
						                    }
						                    <div style={{display:((this.state.moreIndex == 10 && kjNumber.length != 0) ? 'block' : 'none')}} className="r_sider_more" onClick={()=>this.showMore()}>显示更多10期>></div>
										    <div style={{display:((this.state.moreIndex == 20 && kjNumber.length != 0) ? 'block' : 'none')}} className="r_sider_more" onClick={()=>this.hideMore()}>立即收起</div>
										    <div style={{display: kjNumber.length == 0 ? 'block' : 'none'}} className="r_sider_more">无数据</div>
						                </div>
            						)
            					}else if(tempObj.type instanceof Array){
            						return (
            							<div className="history_period">
	            							<ul className="thead_title">
						                        <li style={{width:'20%'}}>奖期</li>
						                        <li style={{width:'40%'}}>号码</li>
						                        {
						                        	tempObj.type.map((value,index)=>{
						                        		return (
						                        			<li style={{width:(40/tempObj.type.length)+'%'}} key={index}>{value}</li>
						                        		)
						                        	})
						                        }
						                    </ul>
						                    {
						                    	tempObj.content.map((value,index)=>{
						                    		if(index >= this.state.moreIndex){
						                    			return ''
						                    		}
						                    		return(
						                    			<ul className="tbody_title" key={index}>
							                                <li style={{width:'20%'}}>{
							                                	(value.shapeIssue.split('-').length == 2 ? value.shapeIssue.split('-')[1] : value.shapeIssue.split('-')[0]) +'期'
							                                }</li>
							                                <li style={{width:'40%'}}>
								                                <ul className="right_ball_number clear">{
								                                	(()=>{
								                                		if(value.shapeCode.length > 5){
								                                			return(
								                                				value.shapeCode.split(' ').map((val,idx)=>{
								                                					if(value.shapeWei){
								                                						return (
														                                    <li className={value.shapeWei[idx] == 1 ? 'selected' : ''} key={idx}>{val}</li>
												                                		)
								                                					}else{
								                                						return (
														                                    <li key={idx} className='selected'>{val}</li>
												                                		)
								                                					}
											                                	})
								                                			)
								                                		}else{
								                                			return(
									                                			value.shapeCode.split('').map((val,idx)=>{
								                                					if(value.shapeWei){
								                                						return (
														                                    <li className={value.shapeWei[idx] == 1 ? 'selected' : ''} key={idx}>{val}</li>
												                                		)
								                                					}else{
								                                						return (
														                                    <li key={idx} className='selected'>{val}</li>
												                                		)
								                                					}
											                                	})
								                                			)
								                                		}
								                                	})()
								                                }
								                                </ul>
							                                </li>
							                                {
							                                	value.shapeType.map((value,index)=>{
							                                		return(
							                                			<li style={{width:(40/tempObj.type.length)+'%',color:'#CF2027'}} key={index}>{value}</li>
							                                		)
							                                	})
							                                }
							                            </ul>
						                    		)
						                    	})
						                    }
						                    <div style={{display:((this.state.moreIndex == 10 && kjNumber.length != 0) ? 'block' : 'none')}} className="r_sider_more" onClick={()=>this.showMore()}>显示更多10期>></div>
										    <div style={{display:((this.state.moreIndex == 20 && kjNumber.length != 0) ? 'block' : 'none')}} className="r_sider_more" onClick={()=>this.hideMore()}>立即收起</div>
										    <div style={{display: kjNumber.length == 0 ? 'block' : 'none'}} className="r_sider_more">无数据</div>
						                </div>
            						)
            					}else{
            						return (
            							<div className="history_period">
	            							<ul className="thead_title">
						                        <li style={{width:'25%'}}>奖期</li>
						                        <li style={{width:'50%'}}>号码</li>
						                        <li style={{width:'25%'}}>{tempObj.type}</li>
						                    </ul>
						                    {
						                    	tempObj.content.map((value,index)=>{
						                    		if(index >= this.state.moreIndex){
						                    			return ''
						                    		}
						                    		return(
						                    			<ul className="tbody_title" key={index}>
							                                <li style={{width:'25%'}}>{
							                                	(value.shapeIssue.split('-').length == 2 ? value.shapeIssue.split('-')[1] : value.shapeIssue.split('-')[0]) +'期'
							                                }</li>
							                                <li style={{width:'41%',margin:'0 10px'}}>
								                                <ul className="right_ball_number clear">{
								                                	(()=>{
								                                		if(value.shapeCode.length > 5){
								                                			return(
								                                				value.shapeCode.split(' ').map((val,idx)=>{
								                                					if(value.shapeWei){
								                                						return (
														                                    <li className={value.shapeWei[idx] == 1 ? 'selected' : ''} key={idx}>{val}</li>
												                                		)
								                                					}else{
								                                						return (
														                                    <li key={idx} className='selected'>{val}</li>
												                                		)
								                                					}
											                                	})
								                                			)
								                                		}else{
								                                			return(
									                                			value.shapeCode.split('').map((val,idx)=>{
								                                					if(value.shapeWei){
								                                						return (
														                                    <li className={value.shapeWei[idx] == 1 ? 'selected' : ''} key={idx}>{val}</li>
												                                		)
								                                					}else{
								                                						return (
														                                    <li key={idx} className='selected'>{val}</li>
												                                		)
								                                					}
											                                	})
								                                			)
								                                		}
								                                	})()
								                                }
								                                </ul>
							                                </li>
							                                {
							                                	(()=>{
							                                		let classType='';
							                                		switch(value.shapeType){
							                                			case '庄':
							                                			case '龙':
							                                				classType='banker';
							                                				break;
							                                			case '闲':
							                                			case '虎':
							                                				classType='player';
							                                				break;
							                                			case '和':
							                                				classType='tie';
							                                				break;
							                                			default:
							                                				classType='';
							                                				break;
							                                		}
						                                			if(classType != ''){
						                                				return (
							                                				<li className={classType}>{value.shapeType}</li>
							                                			)
						                                			}else{
						                                				return (
						                                					<li style={{width:'23%',color:'#CF2027'}}>{value.shapeType}</li>
							                                			)
						                                			}
							                                	})()
							                                }
							                            </ul>
						                    		)
						                    	})
						                    }
						                    <div style={{display:((this.state.moreIndex == 10 && kjNumber.length != 0) ? 'block' : 'none')}} className="r_sider_more" onClick={()=>this.showMore()}>显示更多10期>></div>
										    <div style={{display:((this.state.moreIndex == 20 && kjNumber.length != 0) ? 'block' : 'none')}} className="r_sider_more" onClick={()=>this.hideMore()}>立即收起</div>
										    <div style={{display: kjNumber.length == 0 ? 'block' : 'none'}} className="r_sider_more">无数据</div>
						                </div>
            						)
            					}
            				})()
                		}
                		return showhtml;
                	})()
                }
            </div>
        );
    }
}
