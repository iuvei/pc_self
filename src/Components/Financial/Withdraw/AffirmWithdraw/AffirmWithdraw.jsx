/*确认提款*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Button, Input } from 'antd';
import Fetch from '../../../../Utils';
import { stateVar } from '../../../../State';
import ForgetFundPw from '../../../Account/Security/ForgetFundPw/ForgetFundPw';

import './AffirmWithdraw.scss';

@observer
export default class AffirmWithdraw extends Component {
    constructor(props) {
        super(props);
        this.state = {
            forgetVisible: false,
            response: {},
        };
    };
    componentDidMount() {

    };

    // 确认提款
    onRecharge() {
        this.setState({ iconLoadingRecharge: true });
    };
    /*子组件调用关闭模态框*/
    onHideChildModal() {
        this.setState({forgetVisible: false})
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
                        <Input type="password" size="large" placeholder="请输入资金密码" />
                        <a href="javascript:void(0)" className="a_m_password" onClick={()=>this.setState({forgetVisible: true})}>忘记资金密码？</a>
                    </li>
                    <li className="r_m_primary_btn">
                        <span className="r_m_li_w"></span>
                        <Button type="primary" size="large" loading={this.state.iconLoadingRecharge} onClick={()=>{this.onRecharge()}}>
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
