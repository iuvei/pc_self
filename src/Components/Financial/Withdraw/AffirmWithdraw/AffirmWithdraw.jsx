/*确认提款*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { hashHistory } from 'react-router';
import { Button, Input, Modal } from 'antd';
import Fetch from '../../../../Utils';
import { stateVar } from '../../../../State';
import ForgetFundPw from '../../../Account/Security/ForgetFundPw/ForgetFundPw';
import md5 from 'md5';

import './AffirmWithdraw.scss';

@observer
export default class AffirmWithdraw extends Component {
    constructor(props) {
        super(props);
        this.state = {
            forgetVisible: false,
            iconLoading: false,
            response: {},
            validate: {
                secpass: 2, // 0: 对， 1：错
            },
            secpass: '', //提款密码
        };
    };
    componentDidMount() {
        this._ismount = true;
    };


    // 确认提款
    onRecharge() {
        let validate = this.state.validate;
        if(validate.secpass != 0) {
            validate.secpass = 1;
            this.setState({ validate });
            return
        }
        this.setState({ iconLoading: true });
        const bankWithdrawInfo = stateVar.bankWithdrawInfo;
        let postData = {
            type: 'wstep3', //流程步骤
            money: bankWithdrawInfo.money,
            secpass: md5(this.state.secpass), //提款密码
            wstep2Code: bankWithdrawInfo.wstep2Code, //传入wstep1的密钥
            cardid: bankWithdrawInfo.datas.cardid, //传入银行卡id
        };

        Fetch.withdrawel({
            method: 'POST',
            body: JSON.stringify(postData)
        }).then((res)=>{
            if(this._ismount){
                this.setState({ iconLoading: false });
                if(res.status == 200){
                    Modal.success({
                        title: res.shortMessage,
                        onOk() {
                            hashHistory.push('/financial/withdraw');
                        }
                    });
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                    validate.secpass = 1;
                    this.setState({ secpass: '' });
                }
            }
        })
    };
    /*子组件调用关闭模态框*/
    onHideChildModal() {
        this.setState({forgetVisible: false})
    }
    /*验证显示不同class*/
    onValidate(val) {
        let classNames,
            validate = this.state.validate;
        if(validate[val] == 0) {
            classNames = 'correct'
        } else if(validate[val] == 1) {
            classNames = 'wrong'
        } else {
            classNames = ''
        }
        return classNames
    };
    /*验证资金密码*/
    onVerifyPw(e) {
        let value = e.target.value,
            validate = this.state.validate;
        if(value == ''){
            validate.secpass = 1
        }else{
            validate.secpass = 0
        }
        this.setState({secpass: e.target.value})
    }
    render() {
        const userInfo = stateVar.userInfo;
        const bankWithdrawInfo = stateVar.bankWithdrawInfo;
        console.log(stateVar.bankWithdrawInfo);

        return (
            <div className="affirm_withdraw">
                <ul className="r_m_list">
                    <li>
                        <span className="r_m_li_w">用户名：</span>
                        <span className="r_m_qq">{userInfo.userName}</span>
                    </li>
                    <li>
                        <span className="r_m_li_w">可提款金额：</span>
                        <span className="r_m_qq">￥{bankWithdrawInfo.availablebalance}</span>
                    </li>
                    <li>
                        <span className="r_m_li_w">提款金额：</span>
                        <span className="r_m_qq">￥{bankWithdrawInfo.money}</span>
                    </li>
                    <li>
                        <span className="r_m_li_w">开户行银行：</span>
                        <span className="r_m_qq">{bankWithdrawInfo.datas.bankname}</span>
                    </li>
                    <li>
                        <span className="r_m_li_w">开户行地址：</span>
                        <span className="r_m_qq">{bankWithdrawInfo.datas.province}&nbsp;{bankWithdrawInfo.datas.bankcity}</span>
                    </li>
                    <li>
                        <span className="r_m_li_w">提款银行卡账号：</span>
                        <span className="r_m_qq">{bankWithdrawInfo.datas.bankno}</span>
                    </li>
                    <li>
                        <span className="r_m_li_w">请验证资金密码：</span>
                        <Input value={this.state.secpass} type="password" size="large" placeholder="请输入资金密码"
                               onChange={(e)=>this.onVerifyPw(e)}
                               className={this.onValidate('secpass')}
                        />
                        <a href="javascript:void(0)" className="a_m_password" onClick={()=>this.setState({forgetVisible: true})}>忘记资金密码？</a>
                    </li>
                    <li className="r_m_primary_btn">
                        <span className="r_m_li_w"></span>
                        <Button type="primary" size="large" loading={this.state.iconLoading} onClick={()=>{this.onRecharge()}}>
                            确认提款
                        </Button>
                    </li>
                </ul>
                <ForgetFundPw visible={this.state.forgetVisible}
                              onHideModal={this.onHideChildModal.bind(this)}
                />
            </div>
        )
    }
}
