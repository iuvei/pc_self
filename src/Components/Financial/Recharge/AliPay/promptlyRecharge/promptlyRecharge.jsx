/*支付宝转账确认*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../../../../Utils';
import { Select, InputNumber, Modal, Button, message, Input } from 'antd';
const Option = Select.Option;
const Search = Input.Search;
import { stateVar } from '../../../../../State';

import './promptlyRecharge.scss'

@observer
export default class promptlyRecharge extends Component {
    constructor(props){
        super(props);
        this.state = {
        }
    };
    componentDidMount() {
        this._ismount = true;
    };
    componentWillUnmount() {
        this._ismount = false;
    };

    render() {

        return (
            <div className="promptly_recharge">
                <ul className="p_r_list">
                    <li>
                        <span className="p_r_text">收款银行：</span>
                    </li>
                    <li>
                        <span className="p_r_text">收款银行：</span>
                        <Search style={{ width: 200 }} placeholder="input search text" enterButton="Search" size="large" />
                    </li>
                </ul>
            </div>
        );
    }
}
