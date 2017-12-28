/*安全中心*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../../Utils';
import { Select,Input,Button,Modal } from 'antd';
const Option = Select.Option;
import { stateVar } from '../../../State';

import Setsecurity from './Setsecurity/Setsecurity';
import CapitalPassword from './CapitalPassword/CapitalPassword';
import BindingEmail from './BindingEmail/BindingEmail';
import LoginPassword from './LoginPassword/LoginPassword';

import   './Security.scss'

@observer
export default class Security extends Component {
    constructor(props){
        super(props);
        this.state = {
            iconLoadingRecharge: false,
            navListIndex: 3,
            visible1: false,
            visible2: false,
        };
        this.onChangeIndex = this.onChangeIndex.bind(this);
    };
    /*切换选择不同操作*/
    onChangeIndex(index) {
        this.setState({navListIndex: index})
    };

    render() {
        const userInfo = stateVar.userInfo;
        const navList = [
                {
                    text: '修改登录密码',
                    id: 0,
                },{
                    text: userInfo.setsecurity == 'no' ? '修改资金密码' : '设置资金密码',
                    id: 1,
                }, {
                    text: '绑定邮箱',
                    id: 2,
                }, {
                    text: userInfo.setquestion == 'no' ? '修改密保问题' : '设置密保问题',
                    id: 3,
                }
            ];
        const childArr = [
            <LoginPassword/>,
            <CapitalPassword/>,
            <BindingEmail/>,
            <Setsecurity onChangeIndex = {this.onChangeIndex}/>,
        ];
        const navListIndex = this.state.navListIndex;
        return (
            <div className="security_main">
                <ul className="s_m_select_list clear">
                    {
                        navList.map((item, index)=>{
                            return <li className={navListIndex === item.id ? 's_m_select_list_active' : ''}
                                       onClick={() => this.onChangeIndex(item.id)} key={item.id}>
                                        {item.text}
                                    </li>
                        })
                    }
                </ul>
                { childArr[navListIndex] }
            </div>
        );
    }
}
