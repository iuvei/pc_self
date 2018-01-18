/*支付宝转账确认*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Button, message } from 'antd';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { stateVar } from '../../../../../State';
import { genCountdown } from '../../../../../CommonJs/common';

import './promptlyRecharge.scss'

@observer
export default class promptlyRecharge extends Component {
    constructor(props){
        super(props);
        this.state = {
            time: '00:00', // 倒计时
            disabled: false,
        }
    };
    componentDidMount() {
        this.getCountDown();
    };
    componentWillUnmount() {
        clearInterval(this.clartInt);
    };
    getCountDown() {
        let time = 900;
         this.clartInt = window.setInterval(()=>{
            if(time == 0){
                this.setState({disabled: true});
                clearInterval(this.clartInt);
            }
            this.setState({time: genCountdown(time).slice(3)});
            time--;
        }, 1000);
    }
    render() {
        const aliPayInfo = stateVar.aliPayInfo;
        return (
            <div className="promptly_recharge clear">
                <ul className="p_r_list left">
                    <li>
                        <span className="p_r_text">收款银行：</span>
                        <span className="gathering_bank">
                            <img src={require('../Img/yinhang/'+ aliPayInfo.b_acc_name.toLowerCase() +'.jpg')} alt=""/>
                        </span>
                    </li>
                    <li>
                        <span className="p_r_text">收款人姓名：</span>
                        <span className="gathering_bank">{aliPayInfo.Payee}</span>
                        <CopyToClipboard text={aliPayInfo.Payee} onCopy={() => message.success('复制成功')}>
                            <Button className="btn_p" type="primary">通用复制</Button>
                        </CopyToClipboard>
                    </li>
                    <li>
                        <span className="p_r_text">收款账户：</span>
                        <span className="gathering_bank">{aliPayInfo.account}</span>
                        <CopyToClipboard text={aliPayInfo.account} onCopy={() => message.success('复制成功')}>
                            <Button className="btn_p" type="primary">通用复制</Button>
                        </CopyToClipboard>
                    </li>
                    <li>
                        <span className="p_r_text">充值金额：</span>
                        <span className="gathering_bank col_color_ying">{aliPayInfo.fMoney}元</span>
                        <CopyToClipboard text={aliPayInfo.fMoney} onCopy={() => message.success('复制成功')}>
                            <Button className="btn_p" type="primary">通用复制</Button>
                        </CopyToClipboard>
                    </li>
                    <li>
                        <span className="p_r_text">备注（付款说明）：</span>
                        <span className="gathering_bank col_color_ying">{aliPayInfo.remark}</span>
                        <CopyToClipboard text={aliPayInfo.remark} onCopy={() => message.success('复制成功')}>
                            <Button className="btn_p" type="primary">通用复制</Button>
                        </CopyToClipboard>
                    </li>
                    <li>
                        <span className="p_r_text"></span>
                        <Button style={{marginTop: 30}} disabled={this.state.disabled} size="large" type="primary">
                            <a href="https://auth.alipay.com/login/index.htm?goto=https%3A%2F%2Fmy.alipay.com%2Fportal%2Fi.htm" target="_blank">
                                登录支付宝转账
                            </a>
                        </Button>
                    </li>
                </ul>
                <div className="p_r_explain right">
                    <div className="count_down">
                        <span>充值订单有效倒计时&nbsp;</span>
                        <span className="col_color_ying">{this.state.time}</span>
                    </div>
                    <div className="p_r_e_text">
                        <p>注意事项：</p>
                        <p>1、请务必按照左侧信息填写交易，如果不按照左侧信息进行充值造成的损失自行承担。</p>
                        <p>2、晚上23:30至00:00分以及00:30至01:00，支付宝<i>不会到账</i>。</p>
                        <p>3、付款时支付宝提示第2天到账时，<i>请勿付款</i>。</p>
                        <p>4、充值账号随机更换，请以左侧显示账号为准。</p>
                        <p>5、请将“备注(付款说明)”输入到支付宝“付款说明”栏内，否则可能会<i>影响到账</i>。</p>
                        <p>6、若使用手机支付宝转账，和电脑转账效果一致；转账后请耐心等待到账。</p>
                    </div>
                </div>
            </div>
        );
    }
}
