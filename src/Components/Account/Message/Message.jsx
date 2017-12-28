/*站内信*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../../Utils';
import { Table, Button, Popconfirm, Pagination, message, Modal } from 'antd';
import { stateVar } from '../../../State';

import './Message.scss'
@observer
export default class Message extends Component {
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            tableLoading: false,
            loading: false,
            data: [], //信息列表
            total: 0, //总条数

            postData: {
                msgids: '',
                tag: '',
                p: 1,
                pn: 10,
            },
            repDetails: {//详情
                subject: '加载中...',
                sendtime: '加载中...',
                content: '加载中...',
            },
        }
    };
    componentDidMount() {
        this._ismount = true;
        this.getData()
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    getData() {
        let postData = this.state.postData;
        this.setState({ tableLoading: true });
        Fetch.messages({
            method: 'POST',
            body: JSON.stringify(postData)
        }).then((res)=>{
            if(this._ismount){
                this.setState({ loading: false, tableLoading: false });
                if(res.status == 200) {
                    if(postData.tag != ''){
                        message.success(res.shortMessage);
                        // this.setState({ data: this.state.data.filter((item, index) => item.entry !== key) });
                        let postData = this.state.postData;
                        postData.tag = '';
                        postData.msgids = '';

                        this.setState({postData: postData}, ()=>this.getData());

                    }else{
                        let data = res.repsoneContent;
                        this.setState({
                            data: data.results,
                            total: parseInt(data.affects),
                        });
                    }
                }
            }
        })
    }
    /*删除选中*/
    onDeleteAll() {
        this.setState({ loading: true });
        this.getData();
    };
    onSelectChange = (msgids) => {
        let postData = this.state.postData;
        postData.msgids = msgids.join();
        postData.tag = 'deleteChoices';
        this.setState({ postData });
    };
    /*删除某条*/
    onDeleteOne(key) {
        let postData = this.state.postData;
        postData.msgids = key;
        postData.tag = 'deleteChoices';
        this.setState({postData}, ()=>this.getData());
    };
    /*切换每页条数*/
    onShowSizeChange(current, pageSize) {
        console.log(current, pageSize);
        let postData = this.state.postData;
        postData.p = current;
        postData.pn = pageSize;
        this.setState({postData: postData},()=>this.getData())
    };
    /*详情*/
    onCheckContent(record) {
        this.setState({visible: true});
        Fetch.messages({
            method: 'POST',
            body: JSON.stringify({tag:'viewdetail', msgid: record.entry})
        }).then((res)=>{
            if(this._ismount && res.status == 200){
                this.setState({repDetails: res.repsoneContent})
            }
        })
    };
    /*关闭模态框*/
    onHideModal() {
        this.setState({
            visible: false,
        });
        this.getData();
    };
    render() {
        const { loading, data, total, postData, repDetails } = this.state;
        const columns = [
                {
                    title: '发送人',
                    dataIndex: 'sender_name',
                    width: 200,
                }, {
                    title: '消息标题',
                    dataIndex: 'subject',
                    width: 400,
                    className: 'message_p',
                    render: (text, record)=> <a className="ellipsis" href="javascript:void(0)" style={{fontWeight: record.isview == 0 ? 'bold' : 'normal'}} onClick={()=>this.onCheckContent(record)}>{text}</a>,
                }, {
                    title: '时间',
                    dataIndex: 'sendtime',
                    width: 200,
                }, {
                    title: '用户操作',
                    dataIndex: 'action',
                    width: 200,
                    render: (text, record) => {
                        return (
                                    <Popconfirm title="确定要删除?" onConfirm={() => this.onDeleteOne(record.entry)}>
                                        <a href="javascript:void(0)" style={{textDecoration: 'underline'}}>删除</a>
                                    </Popconfirm>
                                )
                    },
                }
            ];
        const msgids = postData.msgids;
        const rowSelection = {
            msgids,
            onChange: this.onSelectChange,
        };
        const hasSelected = postData.msgids.length > 0;
        return (
            <div className="message_main">
                <Table rowSelection={rowSelection}
                       rowKey={record => record.entry}
                       columns={columns}
                       dataSource={data}
                       bordered={true}
                       pagination={false}
                       loading={this.state.tableLoading}
                       rowClassName={(record)=>{return record.isview == 0 ? 'message_unread' : ''}}
                />
                <div className="message_m_page" style={{display: total <= 0 ? 'none' : ''}}>
                    <Button
                        type="primary"
                        onClick={()=>this.onDeleteAll()}
                        disabled={!hasSelected}
                        loading={loading}
                    >
                        删除选中
                    </Button>
                    <div className="message_m_pageSize right" >
                        <Pagination showSizeChanger
                                    onShowSizeChange={(current, pageSize)=>{this.onShowSizeChange(current, pageSize)}}
                                    defaultCurrent={1}
                                    total={total}
                                    pageSizeOptions={stateVar.pageSizeOptions.slice()}
                        />
                    </div>
                </div>
                <Modal
                    width='700px'
                    visible={this.state.visible}
                    title={repDetails.subject}
                    onCancel={()=>this.onHideModal()}
                    maskClosable={false}
                    footer={null}
                    className="message_modal"
                >
                    <p>{repDetails.sendtime}</p>
                    <div className="modal_detailes">{repDetails.content}</div>
                    <p>
                        <Button type="primary" onClick={()=>this.onHideModal()}>知道了</Button>
                    </p>
                </Modal>

            </div>
        );
    }
}
