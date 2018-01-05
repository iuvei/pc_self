/*提现*/
import React, { Component } from 'react';
import {observer} from 'mobx-react';
import { hashHistory } from 'react-router';
import Fetch from '../../../Utils';
import { stateVar } from '../../../State';
import { InputNumber, Button, Modal } from 'antd';

import './Withdraw.scss';

@observer
export default class Withdraw extends Component {
    constructor(props){
        super(props);
        this.state = {
            iconLoadingRecharge: false,
            response: {},
            defaultBank: null, // 默认选中
            postData: {
                type: 'wstep2', //流程步骤
                money: 1,
                bankinfo: '', //银行卡id#银行id 例: 122#10
                wstep1Code: '' //传入wstep1的密钥
            }
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
            if(this._ismount && res.status == 200) {
                let data = res.repsoneContent,
                    postData = this.state.postData;
                postData.wstep1Code = data.wstep1Code;
                postData.bankinfo = data.bankList[0] != undefined ? data.bankList[0].id + '#' + data.bankList[0].bank_id : '';
                this.setState({
                    response: data,
                    defaultBank: data.bankList[0] != undefined ? data.bankList[0].id : '',
                    postData,
                })
            }
        })
    }

    onRechargeAmount(value) {
        let postData = this.state.postData;
        postData.money = value;
        this.setState({postData});
    }
    // 提现下一步
    onRecharge() {
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
    render() {
        const { response } = this.state;
        const userInfo = stateVar.userInfo;

        return (
            <div className="withdraw_main">
                <div className="tr_m_text">
                    <h4>
                        温馨提示：提款时间00：00：00至23：59：59，全天候为您服务！每天限提&nbsp;<i>{response.plattimes}</i>&nbsp;次，今天您已经成功发起了&nbsp;<em>{response.todaytimes}</em>&nbsp;次提现申请
                    </h4>
                </div>
                <ul className="r_m_list">
                    <li>
                        <span className="r_m_li_w">用户名：</span>
                        <span className="r_m_qq">{userInfo.userName}</span>
                    </li>
                    <li>
                        <span className="r_m_li_w">可提款金额：</span>
                        <span className="r_m_qq">￥{response.fAvailableBalance}</span>
                    </li>
                    <li className="clear">
                        <span className="r_m_li_w bank_v_top">可提款银行：</span>
                        <ul className="back_list">
                            {
                                response.bankList == undefined ? '' :
                                response.bankList.map((item, i)=>{
                                    return (
                                        <li key={item.id} onClick={()=>this.onSelectBank(item)}>
                                            <div className={this.state.defaultBank == item.id ? 'r_m_qq_controler r_m_active' : 'r_m_qq_controler'}>
                                                <img src={require('./Img/yinhang/'+item.bank_code+'.jpg')} alt=""/>
                                                <span className="r_m_qq">{item.bank_name}：{item.account.slice(-5)}[{item.account_name}]</span>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </li>
                    <li>
                        <span className="r_m_li_w">提款金额：</span>
                        <InputNumber min={response.iMinMoney} max={response.iMaxMoney}
                                     defaultValue={1}
                                     formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                     parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                     size="large"
                                     onChange={(value)=>{this.onRechargeAmount(value)}}
                        />
                        <span className="span_margin">元</span>
                        <span className="r_m_recharge_text">
                            单笔充值限额：最低
                            <strong>{response.iMinMoney} 元</strong>
                            ，最高
                            <strong>{response.iMaxMoney} 元</strong>
                        </span>
                    </li>
                    <li className="r_m_primary_btn">
                        <span className="r_m_li_w"></span>
                        <Button type="primary" size="large" loading={this.state.iconLoadingRecharge} onClick={()=>{this.onRecharge()}}>
                           下一步
                        </Button>
                    </li>
                </ul>
            </div>
        );
    }
}
