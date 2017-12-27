import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Table } from 'antd';
import './BetRecordTable.scss'
import Fatch from '../../../Utils'

@observer
export default class BetRecordTable extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	loading:false,
        	orderList:this.props.betHistory
        }
    };
    //再次购买
	againBuy(index){
		let tempObj = this.state.orderList[index];
		Fatch.aboutBet({
    		method : "POST",
    		body : JSON.stringify({flag:'againsave',lotteryid:tempObj.lotteryid,projectid:tempObj.projectid})}
    		).then((data)=>{
    			console.log(data)
    			if(data.status == 200){
    				this.getBetHistory(tempObj.lotteryid)
    				alert(data.longMessage);
    			}
    		})
		
	};
	//撤单
	cancelBet(index){
		let tempObj = this.state.orderList[index];
		Fatch.gameInfo({
    		method : "POST",
    		body : JSON.stringify({id:tempObj.projectno})}
    		).then((data)=>{
    			console.log(data)
    			if(data.status == 200){
    				this.getBetHistory(tempObj.lotteryid)
    				alert(data.longMessage);
    			}
    		})
	}
	//得到投注记录
     getBetHistory(lotyid){
    	let tempId = lotyid
    	Fatch.aboutBet({
    		method:"POST",
    		body:JSON.stringify({flag:'getprojects',lotteryid:tempId,issuecount:20})
    		}).then((data)=>{
    			console.log(data)
    			this.setState({orderList:data.repsoneContent})
    		})
    }; 
    render() {
        const columns = [
            { title: '订单号', dataIndex: 'name', key: 'name',width: 150 ,render: (text) => <a href="javascript:;" onClick={()=>{alert(text)}}>{text.length > 15 ? text.substr(0,15)+'...' : text}</a>},
            { title: '期号', dataIndex: 'age', key: 'age',width: 110 },
            { title: '玩法', dataIndex: 'address', key: 'addr2ess',width: 110 },
            { title: '投注内容', dataIndex: 'betContent', key: 'add2ress',width: 110 ,render: (text) => <a href="javascript:;" onClick={()=>{alert(0)}}>{text.length > 10 ? text.substr(0,10)+'...' : text}</a>},
            { title: '开奖号', dataIndex: 'lotteryNumber', key: 'addre2ss',width: 85 },
            { title: '投注金额', dataIndex: 'betMoney', key: 'a2ddress',width: 85,render:(text) => <span>{text}</span> },
            { title: '奖金', dataIndex: 'bonus', key: 'a2ddres2s',width: 85,render:(text) => <span>{text}</span> },
            { title: '状态', dataIndex: 'status', key: 'a2ddres22s',width: 85 },
            { title: '操作', dataIndex: 'againBuy', key: 'x', render: (text,objThis) => {
            	if(text == 1){
            		return <a href="javascript:;" onClick={()=>this.cancelBet(objThis['key'])}>撤单</a>
            	}else{
            		return <a href="javascript:;" onClick={()=>this.againBuy(objThis['key'])}>再次购买</a>
            	}
            }
            }
        ];
		let tempBet = this.state.orderList
		let data = [];
		for(let i=0;i<tempBet.length;i++){
			let tempData = { key: i, name: tempBet[i].projectno, age: tempBet[i].issue, address: tempBet[i].methodname,  betContent: tempBet[i].code, lotteryNumber: tempBet[i].i_code, betMoney: tempBet[i].totalprice, bonus: tempBet[i].bonus, status: tempBet[i].strstatus,againBuy:tempBet[i].iscancancel}
			data.push(tempData)
		}
        return (
            <div className="bet_record_table">
                <div className="b_r_top">重庆时时彩&nbsp;最近20期投注记录</div>
                <Table columns={columns} dataSource={data} pagination={ false } scroll={{ y: 240 }} size="small" loading={false}/>
            </div>
        );
    }
}
