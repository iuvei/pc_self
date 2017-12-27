/*右边快捷方式组件*/
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Icon  } from 'antd';
import {Link} from 'react-router';

import './Rightplug.scss'

@observer
export default class RightPlug extends Component {

    render() {
        return (
            <div className="right_plug">
                <ul className="right_list">
                    <li>
                        <i className="r_p_goOld r_p_common"></i>
                    </li>
                    <li>
                        <i className="r_p_chongzhi r_p_common"></i>
                    </li>
                    <li>
                        <i className="r_p_kefu r_p_common"></i>
                    </li>
                    <li>
                        <i className="r_p_kehuduan r_p_common"></i>
                    </li>
                    <li>
                        <i className="r_p_app r_p_common"></i>
                    </li>
                    <li>
                        <Link to="/tendency">
                            <i className="r_p_zoushi r_p_common"></i>
                        </Link>
                    </li>
                    <li>
                        <i className="r_p_tousu r_p_common"></i>
                    </li>
                    <li>
                        <Icon type="caret-right" />
                    </li>
                </ul>
            </div>
        );
    }
}
