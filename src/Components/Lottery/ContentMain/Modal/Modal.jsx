import React, {Component} from 'react';
import {observer} from 'mobx-react';
import mobx,{computed, autorun} from "mobx";
import { Table, Button, Modal, Select, InputNumber, Checkbox } from 'antd';
import ModelView from '../../../Common/ChildNav/ChildNav'
import { stateVar } from '../../../../State'

import './Modal.scss'

@observer
export default class ModalView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            chaseLoading: false,
            periodsIndex: null,
            issueItem:[],
            checkAll:false,
            checkedList:[]
        }
    };
    componentDidMount(){
    	this.setState({issueItem:stateVar.issueItem});
    };
    enterLoading() {
        this.setState({ loading: true });
    };
    onChange(value) {
        console.log('changed', value);
    };
    enterChaseLoading() {
        this.setState({ chaseLoading: true });
    };
    handerClick(){
    	
    };
    onCheckAllChange(e){
    	this.setState({indeterminate:!this.state.indeterminate,checkAll:!this.state.checkAll},()=>{
    		if(this.state.checkAll){
    			
    		}
    	});
    };
    render() {
    	let tempData = stateVar.issueItem || [];
    	let dataTemp = []
    	for(let i=0;i<tempData.length;i++){
    		if(i == 120){
    			break;
    		}else{
    			let obj = {
	    			key: i+1,
	                name: i+1,
	                age: tempData[i].issue,
	                address: '0',
	                address1: '0',
	                address2: tempData[i].saleend,
	    		}
    			dataTemp.push(obj)
    		}
    	}
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
        const periodsList = ['5期','10期', '20期', '50期', '全部'];

        return (
            <Modal
                width='865px'
                visible={this.props.visible}
                title= {<ModelView navList = {navList}/>}
                onCancel={()=>{this.props.onSuperaddition()}}
                maskClosable={false}
                footer={null}
                className="modal_content"
            >
                <div className="modal_main">
                {
                	((){
                		
                	})()
                }
                    <div className="m_m_content clear">
                        <div className="modal_periods left">
                            <p className="m_p_text left">追号期数</p>
                            <ul className="m_periods_list left">
                                {
                                    periodsList.map((value, index)=>{
                                        return <li key={index} className={this.state.periodsIndex === index ? 'm_periods_active' : ''} onClick={()=>this.setState({periodsIndex: index})} key={index}>{value}</li>
                                    })
                                }
                            </ul>
                        </div>
                        <div className="periods_input left">
                            <span>手动输入</span>
                            <InputNumber min={1} max={10} defaultValue={1} onChange={(value)=>{this.onChange(value)}} />
                            <span>期</span>
                        </div>
                        <div className="multiple_input left">
                            <span>倍数</span>
                            <InputNumber min={1} max={10} defaultValue={1} onChange={(value)=>{this.onChange(value)}} />
                            <span>倍</span>
                        </div>
                        <Button type="primary" className="m_m_btn" loading={this.state.loading} onClick={()=>this.enterLoading()}>
                            生成
                        </Button>
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
		                        		dataTemp.map((value,index)=>{
		                        			return(
		                        				<tr key={index}>
					                        		<td style={{width:'15%'}}>{index+1}</td>
					                        		<td style={{width:'20%'}}><Checkbox onChange={this.handerClick}>{value.age}</Checkbox></td>
					                        		<td style={{width:'25%'}}><InputNumber min={1} disabled={true} max={9999} defaultValue={0} onChange={(value)=>{this.onChange(value)}} />&nbsp;倍</td>
					                        		<td style={{width:'15%',color:'#cb1414'}}>{value.address1}元</td>
					                        		<td style={{width:'25%'}}>{value.address2}</td>
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
                            <Checkbox onChange={()=>this.onChange()}>中奖后停止追号</Checkbox>
                            <Button type="primary">清空号码</Button>
                        </div>
                        <ul className="m_m_footer_info right">
                            <li>
                                <span>总期数：</span>
                                <em>0</em>
                                <span>期，</span>
                            </li>
                            <li>
                                <span>追号总金额：</span>
                                <em>0.00</em>
                                <span>元</span>
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
