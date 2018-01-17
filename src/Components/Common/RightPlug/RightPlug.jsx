/*右边快捷方式组件*/
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Icon ,Modal} from 'antd';
import {Link} from 'react-router';

import './Rightplug.scss'
import { stateVar } from '../../../State'
import TweenOne from 'rc-tween-one';
import Fatch from '../../../Utils'
import {getStore } from "../../../CommonJs/common";
import ComplainAndSuggests from "../ComplainAndSuggests/ComplainAndSuggests";
import p_QRSrc from "./Img/p_QR.png"
@observer
export default class RightPlug extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            visible:false,      //控制投诉建议模态框的显示
            hover1:false,       //控制返回旧版标签的鼠标移入移出状态
            hover2:false,       //控制在线支付标签的鼠标移入移出状态
            hover3:false,       //控制在线客服标签的鼠标移入移出状态
            hover4:false,       //控制客户端下载标签的鼠标移入移出状态
            hover5:false,       //控制手机app标签的鼠标移入移出状态
            hover6:false,       //控制走势图标签的鼠标移入移出状态
            hover7:false,       //控制投诉建议标签的鼠标移入移出状态
        }
    };
    transferMsg(visible) {
        this.setState({
            visible
        });
    };
    hideRight(){
    	$(".right_plug").animate({right:'-140px'},500,()=>{
    		$(".right_plug_open").animate({right:'0'},200);
    		stateVar.paused = false;
    	});
    };
    openRight(){
    	$(".right_plug_open").animate({right:'-15px'},200,()=>{
    		$(".right_plug").animate({right:'0'},500);
    		stateVar.paused = true;
    	});
    };
    showModal(){
        this.setState({
            visible:true,
        });
    };
    switchOld(){
    	window.location.href = 'http://10.63.15.242:81?controller=default&action=switch&_v=3.0&sess='+getStore('session');
    };
    render() {
        return (
        	<div>
	        	<div className="box-shape right_plug" style={{right:stateVar.paused ? 0 : '-140px'}}>
                    <ul className="right_list">
                        <li className={this.state.hover1?"active":""} onMouseLeave={()=>{this.setState({
		                            hover1:false,
		                        });}}>
		                    <a onClick={()=>this.switchOld()} >
		                        <label >{this.state.hover1?"返回旧版":''}</label>
	
	                        	<i className="r_p_goOld r_p_common"  onMouseEnter={()=>{
		                            this.setState({
		                                hover1:true,
		                            });}}>
		                        </i>
	                        </a>
                        </li>
                        <li className={this.state.hover2?"active":""}>
                        	<Link to="/financial/recharge">
	                        	<label >{this.state.hover2?"在线充值":''}</label>
	                            <i className="r_p_chongzhi r_p_common" onMouseLeave={()=>{
	                            this.setState({
	                                hover2:false,
	                            });}} onMouseEnter={()=>{
	                                this.setState({
	                                    hover2:true,
	                                });}}>
	                            </i>
                             </Link>
                        </li>
                        <li className={this.state.hover3?"active":""} onMouseLeave={()=>{this.setState({
                            hover3:false,
                        });}}><label >{this.state.hover3?"在线客服":''}</label>
                            <a href="http://www.baidu.com/" target="_blank"> <i className="r_p_kefu r_p_common" onMouseEnter={()=>{this.setState({
                                hover3:true,
                            });}}></i></a>
                        </li>
                        <li className={this.state.hover4?"active":""} onMouseLeave={()=>{this.setState({
                            hover4:false,
                        });}}>
                        <Link to="/downLoadClient">
                        	<label >{this.state.hover4?"下载客户端":''}</label>
                            <i className="r_p_kehuduan r_p_common" onMouseEnter={()=>{this.setState({
                                hover4:true,
                            });}}>
                            </i>
                        </Link>
                        </li>
                        <li  className={this.state.hover5?"active":""} onMouseLeave={()=>{this.setState({
                            hover5:false,
                        });}}>
                            <i className="r_p_app r_p_common"  onMouseEnter={()=>{this.setState({
                                hover5:true,
                            });}}></i>
                            <img className='p_QR' src={p_QRSrc} style={{display: this.state.hover5? 'block' : 'none'}}/>
                        </li>
                        <li  className={this.state.hover6?"active":""} onMouseLeave={()=>{this.setState({
                            hover6:false,
                        });}}>
	                        <Link to="/tendency">
	                        	<label >{this.state.hover6?"走势图":''}</label>
	                            <i className="r_p_zoushi r_p_common" onMouseEnter={()=>{this.setState({
	                                hover6:true,
	                            });}}>
	                            </i>
                            </Link>
                        </li>
                        <li  className={this.state.hover7?"active":""} onMouseLeave={()=>{this.setState({
                            hover7:false,
                        });}} >
                        <a onClick={()=>{this.showModal()}}>
	                        <label >{this.state.hover7?"投诉建议":''}</label>
	                            <i className="r_p_tousu r_p_common" onMouseEnter={()=>{this.setState({
	                                hover7:true,
	                            });}}></i>
	                            { this.state.visible ?   <ComplainAndSuggests visible={this.state.visible} title="投诉建议" transferMsg = {visible => this.transferMsg(visible)}/>:""}
                        </a>
                        </li>

                    </ul>
					<div className='r_caret-right' onClick={()=>this.hideRight()}>
	                    <Icon type="caret-right" />
	                </div>
	            </div>
	            <div className="box-shape right_plug_open" style={{right:stateVar.paused ? '-15px' : '0'}}>
		            <div className='openRight' onClick={()=>{this.openRight()}}>
		           	 	<Icon type="caret-left" />
		           	</div>
	           	</div>
            </div>
        );
    }
}

