/*右边快捷方式组件*/
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Icon ,Popover} from 'antd';
import { hashHistory } from 'react-router';
import './Rightplug.scss'
import { stateVar } from '../../../State'
import ComplainAndSuggests from "../ComplainAndSuggests/ComplainAndSuggests";
import Chat from '../../Chat/Chat';
import qrcode from "./Img/qrcode.png";
let curLocation = location.href;  /*当前浏览器url地址*/
@observer
export default class RightPlug extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            visible:false,      //控制投诉建议模态框的显示
            modalVisible: false,
            showMsg: false,
        };
        this.hideChat = this.hideChat.bind(this);
        this.hideTousuModal = this.hideTousuModal.bind(this);
    };
    componentDidMount() {
        let cw = document.body.clientWidth;
        if(cw < 1340){
            this.hideRight()
        }
        /*添加全局方法，给后台调用*/
        let _this = this;
        window.onShowMsg = function(type){
            if(type == 1){
                _this.setState({showMsg: true});
            }else{
                _this.setState({showMsg: false});
            }

        };
        /*获取当前走势图的相对路径*/
        curLocation = curLocation.split("#")[0] + "#/tendency";
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
    	$(".right_plug_open").animate({right:'-20px'},200,()=>{
    		$(".right_plug").animate({right:'0'},500);
    		stateVar.paused = true;
    	});
    };
    switchOld(){
    	window.location.href = '/?controller=default&action=switch&_v=3.0';
    };
    /*关闭上下级聊天*/
    hideChat() {
        this.setState({modalVisible: false})
    };
    /*关闭投诉模态框*/
    hideTousuModal(){
        this.setState({visible: false})
    };

    render() {
        const { modalVisible } = this.state;
        return (
        	<div>
                <Chat
                    visible={modalVisible}
                    hideChat={this.hideChat}
                />
	        	<div className="box-shape right_plug" style={{right:stateVar.paused ? 0 : '-140px'}}>
                    <ul className="right_list">
                        <li>
		                    <p className="r_p_goOld r_p_common" onClick={()=>this.switchOld()}>
                                    返回旧版
                            </p>
                        </li>
                        <li>
                            <Popover
                                placement="left"
                                content={
                                    <img src={qrcode} width={160}/>
                                }
                                title="手机扫一扫，下载手机APP"
                            >
                                <p className="r_p_app r_p_common">
                                    APP下载
                                </p>
                            </Popover>
                        </li>
                        <li>
                            <p className="r_p_kehuduan r_p_common" onClick={()=>hashHistory.push('/downLoadClient')}>
                                下载客户端
                            </p>
                        </li>
                        <li>
                            <p className="r_p_kehuzx r_p_common">
                                <a href={stateVar.httpService} target="_blank">
                                    客户咨询
                                </a>
                            </p>
                        </li>
                        <li className="lianxi_p">
                            {
                                this.state.showMsg ? <b className="r_p_common_extent"></b> : null
                            }
                            <p className="r_p_kefu r_p_common" onClick={()=>this.setState({modalVisible: true})}>联系好友</p>
                        </li>
                        <li>
                            <p className="r_p_zoushi r_p_common">
                                <a href={curLocation} target="_blank">
                                    走势图
                                </a>
                            </p>
                        </li>
                        <li>
                            <p className="r_p_tousu r_p_common" onClick={()=>this.setState({visible:true})}>
                                投诉建议
                            </p>
	                            {
	                                this.state.visible ?
                                        <ComplainAndSuggests visible={this.state.visible}
                                                             title="投诉建议"
                                                             transferMsg = {visible => this.transferMsg(visible)}
                                                             hideTousuModal = {()=>this.hideTousuModal()}
                                        />:
                                        null
	                            }
                        </li>

                    </ul>
					<div className='r_caret-right' onClick={()=>this.hideRight()}>
	                    <Icon type="double-right" />
	                </div>
	            </div>
	            <div className="box-shape right_plug_open" style={{right:stateVar.paused ? '-20px' : '0'}}>
		            <div className='openRight' onClick={()=>{this.openRight()}}>
		           	 	<Icon type="double-left" />
		           	</div>
	           	</div>
            </div>
        );
    }
}

