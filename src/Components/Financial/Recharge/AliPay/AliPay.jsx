/*支付宝*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { hashHistory } from 'react-router';
import Fetch from '../../../../Utils';
import { stateVar } from '../../../../State';
import { InputNumber, Button, Input } from 'antd';
import { changeMoneyToChinese } from '../../../../CommonJs/common';

import './AliPay.scss'

@observer
export default class AliPay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iconLoadingRecharge: false,
            imgUrlIndex: 0,
            backList: [], // 可选择银行
            loadmax: 0, //渠道限额最多
            loadmin: 0, //渠道限额最少

            postData: {
                type: 'deposit', //操作类型
                tag: 'zhifubao', //充值分类  支付宝 zhifubao
                payment: '', //银行渠道code
                bid: null, //银行渠道id
                money: 0,//充值金额
                rid: null, //充值银行id
                code: '', //充值银行code
                alipayName: '', //支付宝转账需要填写姓名
            }
        };
    };
    componentDidMount() {
        this._ismount = true;
        this.onLinePayment()
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    onLinePayment(){
        Fetch.payment({
            method: 'POST',
            body:JSON.stringify({type: 'paymentBank', cateid: 4})
        }).then((res)=>{
            if(this._ismount && res.status == 200){
                let data = res.repsoneContent,
                    postData = this.state.postData;
                postData.money = data[0].loadmin;
                postData.payment = data[0].payport_name;
                postData.bid = data[0].id;
                postData.rid = data[0].rid;
                postData.code = data[0].code;
                this.setState({
                    backList: data,
                    loadmin: data[0].loadmin,
                    loadmax: data[0].loadmax,
                    postData: postData
                })
            }
        })
    }
    // 立即充值
    onRecharge() {
        this.setState({ iconLoadingRecharge: true });
        hashHistory.push('/financial/recharge/promptlyRecharge');
        // Fetch.payment({
        //     method: 'POST',
        //     body: JSON.stringify(this.state.postData)
        // }).then((res)=>{
        //     if(this._ismount){
        //         this.setState({ iconLoadingRecharge: false });
        //         if(res.status == 200){
        //             // window.open(stateVar.httpUrl + res.repsoneContent.payUrl)
        //         }
        //     }
        // })
    };
    // 充值金额
    onRechargeAmount(value) {
        let postData = this.state.postData;
        postData.money = value;
        this.setState({postData})
    };
    //输入用户真实姓名
    onAlipayName(e){
        let postData = this.state.postData;
        postData.alipayName = e.target.value;
        this.setState({postData});
    }
    /*选择充值方式*/
    selectActive(rid, index){
        let selectBank = this.state.backList.filter(item => item.rid == rid)[0],
            postData = this.state.postData;
        postData.payment = selectBank.payport_name;
        postData.bid = parseInt(selectBank.id);
        postData.rid = parseInt(selectBank.rid);
        postData.code = selectBank.code;
        this.setState({
            imgUrlIndex: index,
            loadmin: selectBank.loadmin,
            loadmax: selectBank.loadmax,
            postData: postData,
        });
    };
    render() {
        return (
            <div className="ali_main">
                <div className="ali_m_hint">
                    <p>平台填写金额应当与网银汇款金额完全一致，否则将无法即使到账！</p>
                </div>
                <ul className="ali_m_list">
                    <li className="clear">
                        <span className="ali_m_li_w left">选择充值方式：</span>
                        {
                            this.state.backList.length == 0 ? <span style={{color: '#CF2027'}}>该充值方式正在维护中！！！</span> :
                                <ul className="ali_m_select_yhk left">
                                    {
                                            this.state.backList.map((item, index)=>{
                                                return (
                                                    <li className={ this.state.imgUrlIndex === index ? 'ali_m_active' : '' } onClick={()=>{this.selectActive(item.rid, index)}} key={item.code}>
                                                        <img src={require('./Img/'+item.code+'.png')} alt=""/>
                                                    </li>
                                                )
                                            })
                                    }
                                </ul>
                        }
                    </li>
                    <li>
                        <span className="ali_m_li_w">支付宝真实姓名：</span>
                        <Input  size="large" onChange={(e)=>{this.onAlipayName(e)}} />
                        &nbsp;
                        <span className="ali_m_recharge_text" style={{marginLeft: 28}}>
                            不得输入除[·]以外的符号，姓名错误将无法上分
                        </span>
                    </li>
                    <li>
                        <span className="ali_m_li_w">充值金额：</span>
                        <InputNumber min={parseFloat(this.state.loadmin)} max={parseFloat(this.state.loadmax)} size="large"
                                     defaultValue={1}
                                     formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                     parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                     onChange={(value)=>{this.onRechargeAmount(value)}}
                        />
                        <span style={{margin: '0 15px 0 3px'}}>元</span>
                        <span className="ali_m_recharge_text">
                            单笔充值限额：最低
                            <strong style={{color: '#CB1313',fontWeight: 'normal'}}>{this.state.loadmin}</strong>
                            元，最高
                            <strong style={{color: '#CB1313',fontWeight: 'normal'}}>{this.state.loadmax}</strong>
                            元，单日充值总额无上限
                        </span>
                        <p className="ali_m_dx">{changeMoneyToChinese(this.state.postData.money)}</p>
                    </li>
                    <li className="ali_m_primary_btn">
                        <span className="ali_m_li_w"></span>
                        <Button type="primary" size="large" loading={this.state.iconLoadingRecharge}
                                onClick={()=>{this.onRecharge()}}
                                disabled={this.state.backList.length == 0}
                        >
                            立即充值
                        </Button>
                    </li>
                </ul>
            </div>
        )
    }
}
