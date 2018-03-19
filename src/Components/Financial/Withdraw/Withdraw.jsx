/*提现*/
import React, { Component } from 'react';
import {observer} from 'mobx-react';
import { hashHistory } from 'react-router';
import Fetch from '../../../Utils';
import { stateVar } from '../../../State';
import { InputNumber, Button, Modal, Spin } from 'antd';
import { onValidate } from '../../../CommonJs/common';

import './Withdraw.scss';

@observer
export default class Withdraw extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectShow: true,
            resultCode: '',
            spinLoading: true,
            iconLoadingRecharge: false,
            moneyFlag: 0,
            response: {
                plattimes: 0,
                todaytimes: 0,
                fAvailableBalance: 0,
                iMinMoney: 0,
                iMaxMoney: 0,
                fee_max: 0, // 手续费封顶
                fee_rate: 0, //费率
            },
            defaultBank: null, // 默认选中
            postData: {
                type: 'wstep2', //流程步骤
                money: 0,
                bankinfo: '', //银行卡id#银行id 例: 122#10
                wstep1Code: '' //传入wstep1的密钥
            },
            validate: {
                money: 2, // 0: 对， 1：错
            },
            shortMessage: '',
        }
    };
    componentDidMount() {
        this._ismount = true;
        this.getWithdrawel();
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    /*获取用户可提款的银行卡信息和可提款金额*/
    getWithdrawel() {
        Fetch.withdrawel({
            method: 'POST',
            body: JSON.stringify({type: 'wstep1'})
        }).then((res)=>{
            if(this._ismount){
                this.setState({spinLoading: false});
                if(res.status == 200) {
                    let data = res.repsoneContent,
                        postData = this.state.postData;
                    postData.wstep1Code = data.wstep1Code;
                    postData.bankinfo = data.bankList[0] != undefined ? data.bankList[0].id + '#' + data.bankList[0].bank_id : '';
                    this.setState({
                        response: data,
                        defaultBank: data.bankList[0] != undefined ? data.bankList[0].id : '',
                        postData,
                        selectShow: false,
                    })
                }else{
                    this.setState({
                        selectShow: true,
                        shortMessage: res.shortMessage,
                        resultCode: res.resultCode,
                    });
                }
            }
        })
    };

    onRechargeAmount(value) {
        let { validate, postData, response } = this.state;
        let reg = /^[0-9]*$/;
        let r = reg.test(value);
        if(!r || value < response.iMinMoney || value > response.iMaxMoney){
            validate.money = 1;
        }else{
            validate.money = 0;
        }
        this.setState({moneyFlag: value, validate},()=>{
            if(!r){
                postData.money = 0
            }else{
                postData.money = value - this.onCountMoney();
            }
            this.setState({postData})
        });
    };
    // 提现下一步
    onRecharge() {
        let { validate } = this.state;
        if(validate.money != 0){
            validate.money = 1;
            this.setState({validate});
            return
        }
        this.setState({ iconLoadingRecharge: true });
        Fetch.withdrawel({
            method: 'POST',
            body: JSON.stringify(this.state.postData)
        }).then((res)=>{
            if(this._ismount){
                this.setState({ iconLoadingRecharge: false });
                if(res.status == 200) {
                    stateVar.bankWithdrawInfo = res.repsoneContent;
                    hashHistory.push('/financial/withdraw/affirmWithdraw');
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*选择提款银行*/
    onSelectBank(item) {
        let postData = this.state.postData;
        postData.bankinfo = item.id + '#' + item.bank_id;
        this.setState({postData, defaultBank: item.id})
    };
    /*跳转绑定银行卡*/
    onClickCapital(type){
        if(type == 1){
            stateVar.navIndex = 'selfInfo';
            stateVar.securityIndex = 1;
            hashHistory.push({
                pathname: '/selfInfo/security',
                query: {
                    navIndex: 2
                }
            });
        }else{
            stateVar.navIndex = 'selfInfo';
            hashHistory.push({
                pathname: '/selfInfo/bankCardManage',
                query: {
                    navIndex: 1
                }
            });
        }
    };
    /*enter键提交*/
    onSubmit(e){
        if(e.keyCode == 13){
            this.onRecharge()
        }
    };
    /*计算提款手续费*/
    onCountMoney(){
        let { response, moneyFlag } = this.state;
        if(moneyFlag == '' || moneyFlag == undefined){
            return 0
        }
        if((response.plattimes - response.todaytimes) <= 0){
            if((moneyFlag * response.fee_rate / 100) >= response.fee_max){
                return response.fee_max
            }else{
                return (moneyFlag * response.fee_rate / 100).toFixed(2)
            }
        }else{
            return 0
        }
    }
    render() {
        const { selectShow, response, spinLoading, postData, resultCode } = this.state;
        const userInfo = stateVar.userInfo;

        return (
            <div className="withdraw_main" onKeyDown={(e)=>this.onSubmit(e)}>
                <Spin spinning={spinLoading}>
                    {
                        selectShow ?
                            resultCode == 1002 ?
                                <ul className="w_m_nopassword">
                                    <li>{this.state.shortMessage}</li>
                                    <li>
                                        <span onClick={()=>this.onClickCapital(1)}>设置资金密码</span>
                                    </li>
                                </ul> :
                                resultCode == 1003 ?
                                    <ul className="w_m_nopassword">
                                        <li>{this.state.shortMessage}</li>
                                        <li>
                                            <span onClick={()=>this.onClickCapital(2)}>绑定银行卡</span>
                                        </li>
                                    </ul> :
                                    <ul className="w_m_nopassword">
                                        <li>{this.state.shortMessage}</li>
                                    </ul> :
                                <div>
                                    <ul className="r_m_list">
                                        <li>
                                            <span className="r_m_li_w">用户名：</span>
                                            <span className="r_m_qq">{userInfo.userName}</span>
                                        </li>
                                        <li>
                                            <span className="r_m_li_w">可提款金额：</span>
                                            <span className="r_m_qq fAvailableBalance">￥{response.fAvailableBalance}</span>
                                        </li>
                                        <li className="clear">
                                            <span className="r_m_li_w bank_v_top">可提款银行：</span>
                                            <ul className="back_list">
                                                {
                                                    response.bankList == undefined ? '' :
                                                        response.bankList.map((item)=>{
                                                            return (
                                                                <li key={item.id} onClick={()=>this.onSelectBank(item)}>
                                                                    <div className={this.state.defaultBank == item.id ? 'r_m_qq_controler r_m_active' : 'r_m_qq_controler'}>
                                                                        <img src={stateVar.httpUrl + item.bankImgUrl} alt=""/>
                                                                        <span className="r_m_qq">{item.bank_name.substring(0, 4)}：{item.account.slice(-5)}[{item.account_name}]</span>
                                                                    </div>
                                                                </li>
                                                            )
                                                        })
                                                }
                                            </ul>
                                        </li>
                                        <li>
                                            <span className="r_m_li_w">提款金额：</span>
                                            <InputNumber min={0}
                                                         formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                         parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                         size="large"
                                                         onChange={(value)=>{this.onRechargeAmount(value)}}
                                                         className={onValidate('money', this.state.validate)}
                                            />
                                            <span className="span_margin">元</span>
                                            <p className="r_m_dx">
                                                <span className="r_m_recharge_text">
                                                单笔提现限额：最低：
                                                <strong>{response.iMinMoney} 元</strong>
                                                ，最高：
                                                <strong>{response.iMaxMoney} 元</strong>
                                            </span>
                                            </p>
                                        </li>
                                        <li>
                                            <span className="r_m_li_w">提款手续费：</span>
                                            <span className="r_m_qq fAvailableBalance">{this.onCountMoney()}元</span>
                                        </li>
                                        <li>
                                            <span className="r_m_li_w">实际到账金额：</span>
                                            <span className="r_m_qq fAvailableBalance">{postData.money}元</span>
                                            <div className="tr_m_text">
                                                <h4>
                                                    平台每日可免费提现&nbsp;<i>{response.plattimes}</i>&nbsp;次，今日剩余&nbsp;<em>{response.plattimes - response.todaytimes < 0 ? 0 : response.plattimes - response.todaytimes}</em>&nbsp;次
                                                </h4>
                                            </div>
                                        </li>
                                        <li className="r_m_primary_btn">
                                            <span className="r_m_li_w"></span>
                                            <Button type="primary" size="large" loading={this.state.iconLoadingRecharge} onClick={()=>{this.onRecharge()}}>
                                                下一步
                                            </Button>
                                        </li>
                                        <li>
                                            <div className="r_m_dx">
                                                <p>注意事项：</p>
                                                <p>1.单笔取款最高{response.iMaxMoney}元</p>
                                                <p>2.通常你的提款申请只需3分钟即可到账，最高峰可能需要15分钟左右，如超过30分钟未到账，请及时联系在线客服。</p>
                                                <p>3.本平台每日可免费提款{response.plattimes}次，超过{response.plattimes}后每笔收取1%手续费，每笔上限50元，请您合理安排取款事宜。</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                    }
                </Spin>
            </div>
        );
    }
}
