import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Table,Popconfirm,Button, Modal,Popover} from 'antd';
import './BetRecordTable.scss'
import Fatch from '../../../Utils'
import { stateVar } from '../../../State'
import './../../GameRecord/LotteryBet/LotteryBet.scss';
@observer
export default class BetRecordTable extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	loading:false,
        	visible:false,
        	seatModal:{}
        }
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
    //再次购买
	againBuy(index){
		let tempObj = this.props.betHistory[index];
		Fatch.aboutBet({
    		method : "POST",
    		body : JSON.stringify({flag:'againsave',lotteryid:tempObj.lotteryid,projectid:tempObj.projectid})}
    		).then((data)=>{
    			if(data.status == 200){
    				this.props.histoeryBet();
    				this.getMenu();
    				const modal = Modal.success({
					    title: '温馨提示',
					    content: data.longMessage,
					});
					setTimeout(() => modal.destroy(), 3000);
    			}else{
    				const modal = Modal.success({
					    title: '温馨提示',
					    content: data.longMessage,
					});
					setTimeout(() => modal.destroy(), 3000);
    			}
    		})

	};
	//撤单
	cancelBet(index){
		let tempObj = this.props.betHistory[index];
		Fatch.gameInfo({
    		method : "POST",
    		body : JSON.stringify({id:tempObj.projectno})}
    		).then((data)=>{
    			if(data.status == 200){
    				this.getMenu();
    				this.props.histoeryBet();
    				const modal = Modal.success({
					    title: '温馨提示',
					    content: data.longMessage,
					});
					setTimeout(() => modal.destroy(), 3000);
    			}else{
    				const modal = Modal.success({
					    title: '温馨提示',
					    content: data.longMessage,
					});
					setTimeout(() => modal.destroy(), 3000);
    			}
    		})
	}
	openModal(a,b){
		let tempObj = b || {};
		this.setState({visible:true,seatModal:tempObj});
	};
	handleCancel(){
		this.setState({visible:false,seatModal:{}});
	}
    render() {
    	let columns;
    	if(stateVar.nowlottery.lotteryBetId == 23){
    		columns = [
	            { title: '投注时间', dataIndex: 'datatime', key: 'datatime',width: 110 },
	            { title: '玩法', dataIndex: 'address', key: 'addr2ess',width: 110 },
	            { title: '投注内容', dataIndex: 'betContent', key: 'add2ress',width: 110 ,render: (text) =>
	            text.length > 10 ? <Popover content={text}>
				    <div>详细号码</div>
				</Popover>  : text
	            },
	            { title: '开奖号', dataIndex: 'lotteryNumber', key: 'addre2ss',width: 85 },
	            { title: '投注金额', dataIndex: 'betMoney', key: 'a2ddress',width: 85,render:(text) => <span>{text}</span> },
	            { title: '奖金', dataIndex: 'bonus', key: 'a2ddres2s',width: 85,render:(text) => <span>{text}</span> }
	        ];
    	}else{
    		columns = [
	            { title: '订单号', dataIndex: 'name', key: 'name',width: 140 ,render: (a,b) => <a href="javascript:;" onClick={()=>this.openModal(a,b)}>{a.length > 15 ? a.substr(0,15)+'...' : text}</a>},
	            { title: '期号', dataIndex: 'age', key: 'age',width: 100 },
	            { title: '玩法', dataIndex: 'address', key: 'addr2ess',width: 100 },
	            { title: '投注内容', dataIndex: 'betContent', key: 'add2ress',width: 100 ,render: (text) =>
	            	text.length > 10 ? <Popover content={text}>
					    <div>详细号码</div>
					</Popover>  : text
	            },
	            { title: '开奖号', dataIndex: 'lotteryNumber', key: 'addre2ss',width: 95 },
	            { title: '投注金额', dataIndex: 'betMoney', key: 'a2ddress',width: 75,render:(text) => <span>{text}</span> },
	            { title: '奖金', dataIndex: 'bonus', key: 'a2ddres2s',width: 75,render:(text) => <span style={{color:'#CF2027'}}>{text}</span> },
	            { title: '状态', dataIndex: 'status', key: 'a2ddres22s',width: 55 ,render:(text)=>
	            	text == '已派奖' ? <span style={{color:'#CF2027',fontWeight:'bold'}}>{text}</span> : text
	            },
	            { title: '操作', dataIndex: 'againBuy', key: 'x', render: (text,objThis) => {
		            	if(text == 1){
		            		return <Popconfirm className='canclebet' title='确定撤单吗？' placement="topLeft" onConfirm={()=>this.cancelBet(objThis['key'])}><Button className='buyAgain'>撤单</Button></Popconfirm>
		            	}else{
		            		return <Popconfirm placement="topLeft" title='再次购买吗？' onConfirm={()=>this.againBuy(objThis['key'])}><Button className='buyAgain'>再次购买</Button></Popconfirm>
		            	}
	           		}
	            }
	        ];
    	}
		let tempBet = this.props.betHistory;
		let data = [];
		for(let i=0;i<tempBet.length;i++){
			let tempData = { key: i, name: tempBet[i].projectno || "",modes:tempBet[i].modes,multiple:tempBet[i].multiple, datatime:tempBet[i].writetime ,age: tempBet[i].issue, address: tempBet[i].methodname, betContent: tempBet[i].code, lotteryNumber: tempBet[i].i_code || tempBet[i].wcode, betMoney: tempBet[i].totalprice, bonus: tempBet[i].bonus, status: tempBet[i].strstatus,againBuy:tempBet[i].iscancancel}
			data.push(tempData)
		}
        return (
            <div className="bet_record_table">
                <div className="b_r_top">{stateVar.nowlottery.cnname}&nbsp;最近20期投注记录</div>
                <Table columns={columns} dataSource={data} pagination={ false } scroll={{ y: 254 }} size="small" loading={false}/>
                <Modal
	                title="投注单期记录"
	                width={915}
	                visible={this.state.visible}
	                onCancel={()=>this.handleCancel()}
	                footer={null}
	                maskClosable={false}
	                className="lottery_bet_modal"
	            >
	                <span className="bet_seat">投注单号：<i>{this.state.seatModal.name}</i></span>
	                <Button className="right" onClick={()=>this.onCancelgameAjax(this.state.seatModal)}
	                        style={{display: this.state.seatModal.iscancancel == 1 ? '' : 'none', marginRight: 12}} type="primary" icon="retweet"
	                        loading={this.state.iscancancelLoading}
	                >撤单</Button>
	                <p className="bet_d_bg"></p>
	                <div className="bet_details">
	                    <ul className="bet_list clear">
	                        <li>
	                            <span>用户名：</span>
	                            <span>{stateVar.userInfo.userName}</span>
	                        </li>
	                        <li>
	                            <span>投注期号：</span>
	                            <span>{this.state.seatModal.age}</span>
	                        </li>
	                        <li>
	                            <span>开奖号码：</span>
	                            <ul className="bet_cody_style clear">
	                                {
	                                    this.state.seatModal.lotteryNumber != undefined ? (this.state.seatModal.lotteryNumber.indexOf(' ') > -1 ? this.state.seatModal.lotteryNumber.split(' ').map((item,i)=>{
	                                        return <li key={i}>{item}</li>
	                                    }) : this.state.seatModal.lotteryNumber.split('').map((item,i)=>{
	                                        return <li key={i}>{item}</li>
	                                    }))
	                                    : ''
	                                }
	                            </ul>
	                        </li>
	                        <li>
	                            <span>彩种玩法：</span>
	                            <span>{stateVar.nowlottery.cnname}-{this.state.seatModal.address}</span>
	                        </li>
	                        <li>
	                            <span>投注倍数：</span>
	                            <span>{this.state.seatModal.multiple}倍</span>
	                        </li>
	                        <li>
	                            <span>投注金额：</span>
	                            <span>{this.state.seatModal.betMoney}</span>
	                        </li>
	                        <li>
	                            <span>投注时间：</span>
	                            <span>{this.state.seatModal.datatime}</span>
	                        </li>
	                        <li>
	                            <span>投注模式：</span>
	                            <span>{this.state.seatModal.modes == 1 ? '元' : this.state.seatModal.modes == 2 ? '角' : '分'}</span>
	                        </li>
	                        <li>
	                            <span>中奖金额：</span>
	                            <span style={{color: '#EE0000'}}>{this.state.seatModal.bonus}</span>
	                            <span className="right">{this.state.seatModal.status}</span>
	                        </li>
	                    </ul>
	                    <p>投注内容：<i className="bet_cao" style={{display: this.state.seatModal.vote_status == 1 ? '' : 'none'}}>单</i></p>
	                    <div className="bet_cody">
	                        {this.state.seatModal.betContent}
	                    </div>
	                </div>
	            </Modal>
            </div>
        );
    }
}
