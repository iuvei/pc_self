/*公用模态框*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Button,Modal  } from 'antd';
import Fatch from '../../../Utils'
import './LotteryModal.scss'

import rectangle from './Img/rectangle.png'

@observer
export default class AlterModal extends Component {
    constructor(props) {
        super(props);
    };
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    onOk= () => {
    	let tempObj  = this.props.betData;
    	let postData = {
    		lotteryid : tempObj.lotteryid,
    		curmid : tempObj.curmid,
    		poschoose : tempObj.poschoose,
    		flag : tempObj.flag,
    		play_source : tempObj.play_source,
    		lt_allin_if : "no",
    		lt_furture_issue : tempObj.lt_furture_issue,
    		lt_issue_start : tempObj.lt_issue_start,
    		lt_total_nums : tempObj.lt_total_nums,
    		lt_total_money : tempObj.lt_total_money,
    		randomNum : Math.floor((Math.random() * 10000) + 1),
    		lt_project : tempObj.lt_project
    	};
    	Fatch.aboutBet({
    		method:"POST",
    		body:JSON.stringify(postData)
    		}).then((data)=>{
    			if(data.status == 200){
					alert(data.longMessage);
    			}
    		})
    }
    onCancel= () => {
        this.props.lotteryOkBet();
    }
    render() {
    	let tempData = this.props.betData;
        return (
            <div className="">
                <Button type="primary" onClick={this.showModal}>Open</Button>
                <Modal
                    title="温馨提示"
                    visible={this.props.visible}
                    wrapClassName="lottery-modal"
                    onCancel={this.onCancel}
                    maskClosable={false}
                    footer={null}
                >
                    <div className='l_m_content'>
                        <p className='l_m_title'>你确定加入{tempData.lt_furture_issue}期？</p>
                        <div>
                            <div className='l_m_rectangle'></div>
                            <ul className='l_m_list'>
                            {
                            	tempData.lt_project ? tempData.lt_project.map((val,index)=>{
                            		return(
                            			<li key={index}>{val.desc}<span className='l_m_unit' key={index}>{val.modeName}</span></li>
                            		)
                            	}) : ''
                            }
                            </ul>
                            <ul className='l_m_warn'>
                                <li>单挑警告：该单处于单挑模式，本期最大奖金30000元</li>
                            </ul>
                            <p>总金额：<span className='l_m_total'>{tempData.lt_total_money}</span>元</p>
                        </div>
                    </div>
                    <div className='btn_group'>
                        <Button  type="primary"  onClick={()=>{this.onOk()}}>
                            确认
                        </Button>
                        <Button  className='btn_cancel' type="primary"  onClick={()=>{this.onCancel()}}>
                            取消
                        </Button>
                    </div>

                </Modal>
            </div>
        )
    }
}
