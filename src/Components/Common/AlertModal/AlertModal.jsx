/*提示模态框公共样式*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Button,Modal,Icon  } from 'antd';

import './AlertModal.scss';

@observer
export default class AlterModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    };
    onOk= () => {
        this.props.transferMsg(false);
    };
    handleCancel = (e) => {
        this.props.transferMsg(false);
    };

    render() {
        return (
                <Modal
                    title={this.props.title}
                    visible={this.props.visible}
                    wrapClassName="alter-modal"
                    onCancel={this.handleCancel}
                    maskClosable={false}
                    footer={null}
                >
                    <div className='alert-text'>
                        <Icon  type={this.props.icon}  style={{fontSize:15,color:'#febe15',paddingRight:5}}/>
                        {this.props.content}
                    </div>
                    <div className='btn_group'>
                        <Button  type="primary"  onClick={()=>{this.onOk()}}>
                            确认
                        </Button>
                    </div>

                </Modal>
        )
    }
}
