/*确认模态框公共样式*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Button,Modal,Icon  } from 'antd';

import './ConfirmModal.scss';

@observer
export default class ConfirmModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            title:"温馨提示",

        }
    };



    onOk= () => {
        this.props.transferMsg(false);
    }
    onCancel= () => {
        this.props.transferMsg(false);
    }

    render() {

        return (
            <Modal
                title={this.props.title}
                visible={this.props.visible}
                wrapClassName="confirm-modal"
                maskClosable={false}
                footer={null}
                closable={false}
            >
                <div className='confirm-text'>
                    <Icon  type={this.props.icon}  style={{fontSize:15,color:'#febe15',paddingRight:5}}/>
                    {this.props.content}
                </div>
                <div className='btn_group'>
                    <Button  type="primary"  onClick={()=>{this.onOk()}}>
                        确认
                    </Button>
                    <Button  className='btn_cancel' type="primary"  onClick={()=>{this.onCancel()}}>
                        取消
                    </Button>
                </div>

            </Modal>
        )
    }
}
