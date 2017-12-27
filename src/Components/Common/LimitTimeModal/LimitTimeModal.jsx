/*限时显示模态框*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Modal,Button } from 'antd';

import './LimitTimeModal.scss';

@observer
export default class LimitTimeModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            secondsElapsed:4, //控制模态框显示的时间time-1
            visible:false,
        }
    };
    /*循环计时*/
    tick(){
        this.setState(preState => (
            preState.secondsElapsed--
        ))
        if(this.state.secondsElapsed>0){
            setTimeout(() =>this.tick(), 1000);

        }else{
            this.setState({
                visible: false,
            });
        }

    }
    showModal = () => {
        this.setState({
            visible: true,
        });
        setTimeout(this.tick(), 1000);
    }
    render() {
        return (
                <Modal
                    title={false}
                    visible={this.props.visible}
                    wrapClassName="limit-time-modal"
                    maskClosable={false}
                    closable={false}
                    footer={null}
                >
                    <div className='alert-text'>
                        <p> 20170815-0847期已截止</p>
                        <p>当前为20170815-0848</p>
                        <p>投注请注意期号！<span className='l_m_time'>({this.state.secondsElapsed})</span></p>
                    </div>
                </Modal>

        )
    }
}
