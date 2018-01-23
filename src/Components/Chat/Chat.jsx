/*上下级聊天*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Modal } from 'antd';
import { getStore } from "../../CommonJs/common";
import './Chat.scss';

@observer
export default class Chat extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        return (
            <Modal visible={this.props.visible}
                   width={830}
                   height={561}
                   closable={false}
                   footer={null}
                   maskClosable={false}
                   className="liaotian_modal"
            >
                <iframe scrolling="no"
                        id="main" name="main"
                        src={'http://10.63.15.242:81/pcservice/?controller=user&action=UserTeam&tag=html&sess=' + getStore('session')}
                        className="liaotian_iframe"
                        style={{height: 561, width: 830}}
                >
                </iframe>
                <div onClick={()=>this.props.hideChat()} className="close_btn"></div>
            </Modal>
        )
    }
}
