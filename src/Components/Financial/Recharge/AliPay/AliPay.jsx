/*支付宝*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { hashHistory } from 'react-router';
import Fetch from '../../../../Utils';
import { stateVar } from '../../../../State';
import { InputNumber, Button, Input, Modal } from 'antd';
import { changeMoneyToChinese, onValidate, getStore } from '../../../../CommonJs/common';

import './AliPay.scss'

@observer
export default class AliPay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iconLoadingRecharge: false,
            imgUrlIndex: 0,
            backList: null, // 可选择银行
            loadmax: 0, //渠道限额最多
            loadmin: 0, //渠道限额最少

            postData: {
                type: 'deposit', //操作类型
                tag: 'zhifubao', //充值分类  支付宝 zhifubao
                payment: '', //银行渠道code
                bid: null, //银行渠道id
                money: 0,//充值金额
                rid: null, //充值银行id
                code: 'zfbsm', //充值银行code
                // alipayName: '', //支付宝转账需要填写姓名
            },
            validate: {
                money: 2, // 0: 对， 1：错
                alipayName: 2,
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
                    loadmin = 0,
                    loadmax = 0,
                    postData = this.state.postData;
                if(data[0] !== undefined){
                    postData.payment = data[0].payport_name;
                    postData.bid = data[0].id;
                    postData.rid = data[0].rid;
                    postData.code = data[0].code;
                    loadmin = data[0].loadmin;
                    loadmax = data[0].loadmax;
                }

                this.setState({
                    backList: data,
                    loadmin: loadmin,
                    loadmax: loadmax,
                    postData: postData
                })
            }
        })
    };
    // 立即充值
    onRecharge() {
        let { validate, postData } = this.state;
        if(postData.code !== 'zfbsm' && validate.alipayName != 0){
            validate.alipayName = 1;
            this.setState({validate});
            return
        }
        if(validate.money != 0){
            validate.money = 1;
            this.setState({validate});
            return
        }
        this.setState({ iconLoadingRecharge: true });
        let tempwindow = window.open();
        Fetch.payment({
            method: 'POST',
            body: JSON.stringify(postData)
        }).then((res)=>{
            if(this._ismount){
                this.setState({ iconLoadingRecharge: false });
                if(res.status == 200){
                    if(postData.code == 'zfbsm'){ // 支付宝扫码
                        tempwindow.location.href = stateVar.httpUrl + res.repsoneContent.payUrl+ '&sess=' + getStore('session')
                    }else{
                        stateVar.aliPayInfo = res.repsoneContent.payInfo;
                        hashHistory.push({
                            pathname: '/financial/recharge/promptlyRecharge',
                            query: {
                                name: 'aliPay'
                            }
                        });
                    }
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };

    // 充值金额
    onRechargeAmount(value) {
        let {validate, postData, loadmin, loadmax} = this.state;
        let reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
        let r = reg.test(value);
        let val = parseFloat(value);
        if(!r || val == 0 || val < parseFloat(loadmin) || val > parseFloat(loadmax)){
            validate.money = 1;
        }else{
            validate.money = 0;
        }
        postData.money = value;
        this.setState({postData, validate});

    };
    //输入用户真实姓名
    onAlipayName(e){
        let value = e.target.value,
            validate = this.state.validate,
            postData = this.state.postData,
            regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
            regCn = /[！#￥（——）：；“”‘、，|《。》？、【】[\]]/im,
            reg=/^[·\u2E80-\u9FFF]+$/;
        if(value == '' || !reg.test(value) || regEn.test(value) || regCn.test(value)){
            validate.alipayName = 1;
        }else{
            validate.alipayName = 0;
        }
        postData.alipayName = value;
        this.setState({postData, validate});
    }
    /*选择充值方式*/
    selectActive(rid, index){
        let selectBank = this.state.backList.filter(item => item.rid == rid)[0],
            postData = this.state.postData;
        postData.payment = selectBank.payport_name;
        postData.bid = parseInt(selectBank.id);
        postData.rid = parseInt(selectBank.rid);
        postData.code = selectBank.code;
        if(selectBank.code == 'zfbsm'){
            delete postData.alipayName
        }
        this.setState({
            imgUrlIndex: index,
            loadmin: selectBank.loadmin,
            loadmax: selectBank.loadmax,
            postData: postData,
        });
    };
    /*enter键提交*/
    onSubmit(e){
        if(e.keyCode == 13){
            this.onRecharge()
        }
    }
    render() {
        const { backList } = this.state;
        return (
            <div className="ali_main" onKeyDown={(e)=>this.onSubmit(e)}>
                <div className="ali_m_hint">
                    <p>平台填写金额应当与网银汇款金额完全一致，否则将无法即使到账！</p>
                </div>
                <ul className="ali_m_list">
                    <li className="clear">
                        <span className="ali_m_li_w left">选择充值方式：</span>
                        {
                            backList == null ? <span style={{color: '#CF2027'}}>正在加载...</span> :
                                backList.length == 0 ?
                                <span style={{color: '#CF2027'}}>该充值方式正在维护中！！！</span> :
                                <ul className="ali_m_select_yhk left">
                                    {
                                        backList.map((item, index)=>{
                                            return (
                                                <li className={ this.state.imgUrlIndex === index ? 'ali_m_active' : '' } onClick={()=>{this.selectActive(item.rid, index)}} key={item.code}>
                                                    <img src={stateVar.httpUrl + item.bankImgUrl} alt=""/>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                        }
                    </li>
                    {
                        this.state.postData.code == 'zfbsm' ? null :
                            <li>
                                <span className="ali_m_li_w">支付宝真实姓名：</span>
                                <Input  size="large"
                                        onChange={(e)=>{this.onAlipayName(e)}}
                                        className={onValidate('alipayName', this.state.validate)}
                                />
                                <p className="ali_m_recharge_text" style={{margin: '5px 0 0 130px'}}>
                                    不得输入除[·]以外的符号，姓名错误将无法上分
                                </p>
                            </li>
                    }
                    <li>
                        <span className="ali_m_li_w">充值金额：</span>
                        <InputNumber min={0} size="large"
                                     formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                     parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                     onChange={(value)=>{this.onRechargeAmount(value)}}
                                     className={onValidate('money', this.state.validate)}
                        />
                        <span style={{margin: '0 15px 0 5px'}}>元</span>
                        <span>{changeMoneyToChinese(this.state.postData.money)}</span>
                        <p className="ali_m_dx">
                            <span className="ali_m_recharge_text">
                            单笔充值限额：最低
                            <strong style={{color: '#CB1313',fontWeight: 'normal'}}>{this.state.loadmin}</strong>
                            元，最高
                            <strong style={{color: '#CB1313',fontWeight: 'normal'}}>{this.state.loadmax}</strong>
                            元，最多保留两位小数，单日充值总额无上限
                        </span>
                        </p>
                    </li>
                    <li className="ali_m_primary_btn">
                        <span className="ali_m_li_w"></span>
                        <Button type="primary" size="large" loading={this.state.iconLoadingRecharge}
                                onClick={()=>{this.onRecharge()}}
                                disabled={backList == null || backList.length == 0}
                        >
                            立即充值
                        </Button>
                    </li>
                </ul>
            </div>
        )
    }
}
