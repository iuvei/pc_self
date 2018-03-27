/*追号详情*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { hashHistory } from 'react-router';
import { stateVar } from '../../../../State';
import { Button, Modal, Table, Pagination, message, Popover } from 'antd';
import Fetch from '../../../../Utils';

import './ARdetails.scss';

@observer
export default class ARdetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            stopLoading: false,
            data: [],
            total: 0,
            details: {},
            seatModal: {},
        };
    };
    componentDidMount() {
        this._ismount = true;
        this.getData();
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    getData() {
        this.setState({loading: true});
        Fetch.newtaskdetail({
            method: 'POST',
            body: JSON.stringify({id: this.props.location.query.taskid})
        }).then((res)=>{
            if(this._ismount){
                this.setState({loading: false});
                if(res.status == 200){
                    let data = res.repsoneContent;
                    this.setState({
                        details: data.task,
                        data: data.aTaskdetail.filter(item => item.projectid !== '0'),
                    })
                }
            }
        })
    };
    /*每页条数*/
    onShowSizeChange(current, pageSize) {
        let postData = this.state.postData;
        postData.p = current;
        postData.pn = pageSize;
        this.setState({postData: postData},()=>this.getData());
    };
    /*切换页面时*/
    onChangePagination(page) {
        let postData = this.state.postData;
        postData.p = page;
        this.setState({postData: postData},()=>this.getData());
    };
    /*返回追号记录*/
    handClick(e) {
        e.preventDefault();
        stateVar.afterDetails = false;
        hashHistory.goBack();
    };
    /*点击订单号*/
    onClickProjectid(record){
        this.setState({
            visible: true,
            seatModal: record,
        })
    };
    /*判断中奖状态*/
    onWinningState(record) {
        if(record.iscancel == 0){
            if(record.isgetprize == 0){
                return '未开奖'
            }else if(record.isgetprize == 2){
                return '未中奖'
            }else if(record.isgetprize == 1){
                return record.prizestatus == 0 ? '未派奖' : <b className="col_color_ying">已派奖</b>
            }
        }else if(record.iscancel == 1){
            return '本人撤单'
        }else if(record.iscancel == 2){
            return '平台撤单'
        }else if(record.iscancel == 3){
            return '错开撤单'
        }
    };
    /*关闭模态框*/
    handleCancel() {
        this.setState({visible: false});
        let seatModal = this.state.seatModal;
        seatModal.iscancancel == 11 ? this.getData() : '';
    };
    /*终止追号*/
    onStopAfter() {
        let details = this.state.details,
            _this = this,
            postData = {
                id: details.taskid,
                lotteryid: details.lotteryid,
            };
        Modal.confirm({
            title: '你确定要终止追号吗?',
            okType: 'danger',
            onOk() {
                _this.setState({stopLoading: true});
                Fetch.cancelTaskAjax({
                    method: 'POST',
                    body: JSON.stringify(postData)
                }).then((res)=>{
                    if(_this._ismount){
                        _this.setState({stopLoading: false});
                        if(res.status == 200){
                            message.success(res.longMessage);
                            _this.getData();
                        } else {
                            Modal.warning({
                                title: res.longMessage,
                            });
                        }
                    }
                })
            }
        });

    };
    /*撤单*/
    onCancelgameAjax(seatModal) {
        let _this = this;
        Modal.confirm({
            title: '你确定要撤单吗?',
            content: '单号：'+ seatModal.projectid,
            okType: 'danger',
            onOk() {
                _this.setState({iscancancelLoading: true});
                Fetch.cancelgameAjax({
                    method:'POST',
                    body:JSON.stringify({id: seatModal.projectid})
                }).then((res)=>{
                    if(_this._ismount) {
                        _this.setState({iscancancelLoading: false});
                        if(res.status == 200){
                            message.success(res.longMessage);
                            let seatModal = _this.state.seatModal;
                            seatModal.iscancancel = 11; // 随意设置一个值来判断关闭和撤单成功后是否重新刷新列表
                            _this.setState({seatModal: seatModal});
                        } else {
                            Modal.warning({
                                title: res.shortMessage,
                            });
                        }
                    }
                })
            }
        });
    };

    render() {
        const {total, details, seatModal } = this.state;
        let columns = [
            {
                title: '订单号',
                dataIndex: 'projectid',
                render:(text,record)=><span className="ellipsis_2 hover_a" onClick={()=>this.onClickProjectid(record)}>{text}</span>,
                width: 90,
            }, {
                title: '用户名',
                dataIndex: 'userame',
                width: 90,
            }, {
                title: '彩种与玩法',
                dataIndex: 'lotteryname',
                render:(text,record)=>{
                    return (
                        <div>
                            <p>{details.cnname}</p>
                            <p>{record.methodname}</p>
                        </div>
                    )
                },
                width: 120,
            }, {
                title: '投注时间',
                dataIndex: 'writetime',
                width: 90,
            }, {
                title: '期号',
                dataIndex: 'issue',
                width: 110,
            }, {
                title: '投注内容',
                dataIndex: 'code',
                render:(text,record)=>{
                    return (
                        text != '详细号码' ? text :
                            <Popover content={<div style={{width: '150px',wordWrap: 'break-word'}}>{record.code}</div>} title="详细号码" trigger="hover">
                                <span className="hover_a">{text}</span>
                            </Popover>
                    )
                },
                width: 90,
            }, {
                title: '投注倍数',
                dataIndex: 'multiple',
                width: 75,
            }, {
                title: '投注模式',
                dataIndex: 'modes',
                render: (text)=>text == 1 ? '元' : text == 2 ? '角' : '分',
                width: 75,
            }, {
                title: '开奖号码',
                dataIndex: 'kjcode',
                width: 90,
            }, {
                title: '投注金额',
                dataIndex: 'totalprice',
                className:'column-right',
                width: 90,
            }, {
                title: '奖金',
                dataIndex: 'bonus',
                className:'column-right',
                render:(text)=>(
                    text < 0 ? <span className="col_color_ying">{text}</span> :
                        <span className="col_color_shu">{text}</span>
                ),
                width: 90,
            }, {
                title: '状态',
                dataIndex: 'active',
                render: (text,record)=>this.onWinningState(record),
                width: 80,
            }];

        return (
            <div className="ar_details">
                <div className="a_m_title">
                    <span>游戏记录</span>
                    <span> &gt; </span>
                    <span>追号详情</span>
                </div>
                <div className="c_nav">
                    <ul className="nav_list clear">
                        <li onClick={(e)=>{this.handClick(e)}}>
                            <a href="javascript:void(0)">返回列表</a>
                        </li>
                        <li className='nav_active'>
                            <a href="javascript:void(0)">追号详情</a>
                        </li>
                    </ul>
                </div>
                <ul className="details_content">
                    <li>
                        <span>追号编号：{details.taskid}</span>
                        <span>开始期号：{details.beginissue}</span>
                        <span>追号期数：{details.issuecount}期</span>
                    </li>
                    <li>
                        <span>游戏用户：{details.username}</span>
                        <span>
                            <b>追号内容：</b>
                            <b>{details.codes}</b>
                        </span>
                        <span>完成期数：{details.finishedcount}期</span>
                    </li>
                    <li>
                        <span>追号时间：{details.begintime}</span>
                        <span>模式：{details.modes}</span>
                        <span>取消期数：{details.cancelcount}期</span>
                    </li>
                    <li>
                        <span>游戏玩法：{details.cnname}-{details.methodname}</span>
                        <span>中奖后终止：{details.stoponwin == 1 ? '是' : '否'}</span>
                        <span>
                            状态：{
                                    details.status == 0 ? <em className="col_color_shu" style={{fontStyle: 'normal'}}>进行中</em> :
                                    details.status == 1 ? '已取消' :
                                    details.status == 2 ? '已完成' : ''
                                  }
                        </span>
                    </li>
                </ul>
                <div style={{textAlign: 'center', height: 33}}>
                    <Button style={{display: details.status == 2 ? 'none' : ''}} type="primary" loading={this.state.stopLoading} onClick={()=>this.onStopAfter()}>终止追号</Button>
                </div>
                <div className="t_l_table">
                    <div className="t_l_table_list">
                        <Table columns={columns}
                               rowKey={record => record.entry}
                               dataSource={this.state.data}
                               pagination={false}
                               loading={this.state.loading}
                               footer={null}
                        />
                    </div>
                    <div className="t_l_page" style={{display: total < 1 ? 'none' : ''}}>
                        <Pagination showSizeChanger
                                    onShowSizeChange={(current, pageSize)=>{this.onShowSizeChange(current, pageSize)}}
                                    onChange={(page)=>this.onChangePagination(page)}
                                    defaultCurrent={1}
                                    total={total}
                                    pageSizeOptions={stateVar.pageSizeOptions.slice()}
                        />
                    </div>
                </div>
                <Modal
                    title="投注单期记录"
                    width={915}
                    visible={this.state.visible}
                    onCancel={()=>this.handleCancel()}
                    footer={null}
                    maskClosable={false}
                    className="lottery_bet_modal"
                >
                    <span className="bet_seat">投注单号：<i>{seatModal.projectid}</i></span>
                    <Button className="right" onClick={()=>this.onCancelgameAjax(seatModal)}
                            style={{display: seatModal.iscancancel == 1 ? '' : 'none', marginRight: 12}} type="primary" icon="retweet"
                            loading={this.state.iscancancelLoading}
                    >撤单</Button>
                    <p className="bet_d_bg"></p>
                    <div className="bet_details">
                        <ul className="bet_list clear">
                            <li>
                                <span>用户名：</span>
                                <span>{details.username}</span>
                            </li>
                            <li>
                                <span>投注期号：</span>
                                <span>{seatModal.issue}</span>
                            </li>
                            <li>
                                <span>开奖号码：</span>
                                <ul className="bet_cody_style clear">
                                    {
                                        seatModal.kjcode != undefined ?
                                            seatModal.kjcode.split('').map((item,i)=>{
                                                return <li key={i}>{item}</li>
                                            }) : ''
                                    }
                                </ul>
                            </li>
                            <li>
                                <span>彩种玩法：</span>
                                <span>{seatModal.lotteryname}-{seatModal.methodname}</span>
                            </li>
                            <li>
                                <span>投注倍数：</span>
                                <span>{seatModal.multiple}倍</span>
                            </li>
                            <li>
                                <span>投注金额：</span>
                                <span>{seatModal.totalprice}</span>
                            </li>
                            <li>
                                <span>投注时间：</span>
                                <span>{seatModal.writetime}</span>
                            </li>
                            <li>
                                <span>投注模式：</span>
                                <span>{seatModal.modes == 1 ? '元' : seatModal.modes == 2 ? '角' : '分'}</span>
                            </li>
                            <li>
                                <span>中奖金额：</span>
                                <span style={{color: '#EE0000'}}>{seatModal.bonus}</span>
                                <span className="right">{this.onWinningState(seatModal)}</span>
                            </li>
                        </ul>
                        <p>投注内容：<i className="bet_cao" style={{display: seatModal.vote_status == 1 ? '' : 'none'}}>单</i></p>
                        <div className="bet_cody">
                            {seatModal.code}
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}
