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
                money: '',//充值金额
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
                    _data = data[0],
                    loadmin = 0,
                    loadmax = 0,
                    postData = this.state.postData;
                if(_data !== undefined){
                    postData.payment = _data.payport_name;
                    postData.bid = _data.id;
                    postData.rid = _data.rid;
                    postData.code = _data.code;
                    loadmin = _data.loadmin;
                    loadmax = _data.loadmax;
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
        let tempwindow;
        if(postData.code == 'zfbsm'){
            tempwindow = window.open();
        }
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
        if(postData.payment == 'zhifubaoc9'){
            if(r && val <=  parseFloat(loadmax) && val >= parseFloat(loadmin)){
                if((val <= 500 && val % 10 == 0) || (val > 500 && val % 50 == 0)){
                    validate.money = 0;
                }else{
                    validate.money = 1;
                }
            }else{
                validate.money = 1;
            }
        }else{
            if(!r || val < parseFloat(loadmin) || val > parseFloat(loadmax)){
                validate.money = 1;
            }else{
                validate.money = 0;
            }
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
        let {postData, validate, backList} = this.state,
            selectBank = backList.filter(item => item.rid == rid)[0];
        postData.payment = selectBank.payport_name;
        postData.money = '';
        postData.bid = parseInt(selectBank.id);
        postData.rid = parseInt(selectBank.rid);
        postData.code = selectBank.code;
        validate.money = 2;

        if(selectBank.code == 'zfbsm'){
            delete postData.alipayName
        }
        this.setState({
            imgUrlIndex: index,
            loadmin: selectBank.loadmin,
            loadmax: selectBank.loadmax,
            postData: postData,
            validate,
        });
    };
    /*enter键提交*/
    onSubmit(e){
        if(e.keyCode == 13){
            this.onRecharge()
        }
    }
    render() {
        const { backList, postData } = this.state;
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
                                     value={postData.money}
                                     parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                     onChange={(value)=>{this.onRechargeAmount(value)}}
                                     className={onValidate('money', this.state.validate)}
                        />
                        <span style={{margin: '0 15px 0 5px'}}>元</span>
                        <span>{changeMoneyToChinese(this.state.postData.money)}</span>
                        <p className="ali_m_dx">
                            <span className="ali_m_recharge_text">
                            单笔充值限额：最低
                            <span className="col_color_ying">{this.state.loadmin}</span>
                            元，最高
                            <span className="col_color_ying">{this.state.loadmax}</span>
                            元，
                            {
                                postData.payment == 'zhifubaoc9' ?
                                    <span>
                                        金额必须是
                                        <span className="col_color_ying">10</span>
                                        的倍数并且大于
                                        <span className="col_color_ying">500</span>
                                        时必须是
                                        <span className="col_color_ying">50</span>
                                        的倍数，
                                    </span>
                                   :
                                null
                            }
                            单日充值总额无上限
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
