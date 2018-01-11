/*平台公告*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Modal, Badge } from 'antd';
import Fetch from '../../../Utils';

import './Notice.scss'

@observer
export default class Notice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            badgeFlag: 0 , // 是否已读
            shouldUpdate: true,
        };
    };
    componentDidMount() {
        this._ismount = true;
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    selectNotice(item) {
        this.props.onNoticeDetails(item);
        Fetch.helpNotice({
            method: "POST",
            body: JSON.stringify({
                nid: item.id,
            })
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200) {
                    this.props.onNoticeList(item);
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    render() {
        const noticeDetails = this.props.noticeDetails;
        return (
            <Modal
                width="918px"
                title="平台公告"
                visible={this.props.visible}
                onCancel={()=>this.props.hideModal()}
                footer={null}
                maskClosable={false}
                className="notice clear"
            >
                <div className="notice_controller left"
                     ref="notice_controller"
                     onMouseOver={()=>this.refs.notice_controller.style.overflowY="scroll"}
                     onMouseOut={()=>this.refs.notice_controller.style.overflow="hidden"}
                >
                    <ul className="notice_list">
                        {
                            this.props.noticeList.map((item)=>{
                                return (
                                    <li className={noticeDetails.id === item.id ? 'notive_active' : ''}
                                        onClick={()=>this.selectNotice(item)}  key={item.id}
                                    >
                                        <p>{item.subject}</p>
                                        <h5>{item.sendday}</h5>
                                        <b className="badge" style={{display: item.unread_id === 1 ? 'inline' : 'none'}}>
                                            <Badge  status="error"/>
                                        </b>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="notice_content right">
                    <div className="notice_c_title">
                        <p>{noticeDetails.subject}</p>
                        <h3>发布时间：{noticeDetails.sendday}</h3>
                    </div>
                    <div className="notice_c_details" ref="notice_c_details"
                         onMouseOver={()=>this.refs.notice_c_details.style.overflowY="scroll"}
                         onMouseOut={()=>this.refs.notice_c_details.style.overflow="hidden"}
                    >
                        <div className="notice_c_text" dangerouslySetInnerHTML={{__html: noticeDetails.content}}></div>
                    </div>
                </div>
            </Modal>
        )
    }
}
