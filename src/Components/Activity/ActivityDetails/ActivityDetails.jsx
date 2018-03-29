import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../../Utils';
import { Row, Col, Button, Table, Modal  } from 'antd';
import { timestampToTime } from '../../../CommonJs/common';
import { stateVar } from '../../../State';

import litimg_details from './Img/litimg_details.png';
import './ActivityDetails.scss';

@observer
export default class ActivityDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            btnLoading: false,
            tableLoading: false,
            id: this.props.location.query.id, //活动id
            response:{
                activity_mechanism_type: '-1', //活动奖金机制 （1 专题、2 拉新、3 签到、4 充值流水、7 新人注册）
                activity_pics: '',//活动图片
                activity_title: '', //活动标题
                start_time: '', //活动开始时间戳
                end_time: '',
                radio_activity_type_url: '', //活动链接
                platform: {}, //参与来源平台
                lotterys: [], //活动范围，彩种列表
                games: [], //活动范围，游戏列表
                activity_introduce: '',//规则说明
                status: '', //状态状态。1 正常，200 已完成，400 已满员，401 已结束
                reg_add_time_last_of: '0', //直属下线注册时间晚于时间戳值
                is_regnew_pay_amount_val: '0',//直属下线充值限额条件值
                max_online_num_num: '0', //最大参与人数
                remain_online_num: '0', //剩余可参加人数

                sign_day_count_type: '0', //签到的计算方式（0 按天累计计算，1 按天连续计算）
                sign_conditions_water_amount: '0', //流水达到 x 元，自动签到
                activity_award_sign_sets: [], //签到奖励的档次数据

                water_bills_stes: {}, //充值流水
                user_is_enrolls: '1', //当前用户是否已经报名。0 否，1 是。当未登录时，永远显示 0
                max_online_num_type: 0,
            },
            userSign: {}, //个人进度
            tableData: [], // 新人注册活动
        };
    };
    componentDidMount(){
        this._ismount = true;
        this.getData();
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    getData() {
        Fetch.activityData({
            method: 'GET',
            // body: JSON.stringify({id: this.props.location.query.id})
        }, '&id='+this.state.id).then((res)=>{
            if(this._ismount && res.status == 200){
                let data= res.repsoneContent, newReset = [];
                if(data.activity_mechanism_type != 1){
                    this.getUserSignDatas();
                }
                if(data.activity_mechanism_type == 7){
                    if(data.zc_recharge_amount){
                        newReset = [
                            {
                                recharge: '注册绑卡',
                                bonus: data.zc_newadd_reward_amount,
                                action: data.newadd_rewardzc_extract_amount,
                                btn: data.user_reg_status,
                                id: '1',
                            },
                            {
                                recharge: data.zc_recharge_amount,
                                bonus: data.zc_recharge_reward_amount,
                                action: data.reward_extractzc_amount,
                                btn: data.user_cha_status,
                                id: '2',
                            }
                        ]
                    }else{
                        newReset = [
                            {
                                recharge: '注册绑卡',
                                bonus: data.zc_newadd_reward_amount,
                                action: data.newadd_rewardzc_extract_amount,
                                btn: data.user_reg_status,
                                id: '1',
                            }
                        ]
                    }
                }
                this.setState({
                    response: data,
                    tableData: newReset,
                });
            }
        })
    }
    getUserSignDatas() {
        Fetch.userSignDatas({
            method: 'GET',
        }, '&id='+this.state.id).then((res)=>{
            if(this._ismount && res.status == 200){
                let data= res.repsoneContent;
                this.setState({userSign: data})
            }
        })
    };
    /*报名*/
    enterApply() {
        this.setState({ btnLoading: true });
        Fetch.postEnrolls({
            method: 'POST',
            body: JSON.stringify({activityid: this.state.id})
        }).then((res)=>{
            if(this._ismount){
                this.setState({btnLoading: false});
                if(res.status == 200){
                    Modal.success({
                        title: res.shortMessage,
                    });
                    this.getData();
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*活动签到领奖*/
    onSignTheAward(record){
        Fetch.signTheAward({
            method: 'POST',
            body: JSON.stringify({
                activityid: this.state.id,
                awardday: record.aw_days
            })
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200){
                    Modal.success({
                        title: '领取成功',
                        content: res.shortMessage,
                    });
                    this.getData();
                }else if(res.status == 400){
                    Modal.success({
                        title: '领取成功',
                        content: res.shortMessage,
                    });
                    this.getData();
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*充值达标领奖*/
    onRechargeAmountAward(record){
        Fetch.rechargeAmountAward({
            method: 'POST',
            body: JSON.stringify({
                activityid: this.state.id,
                amount: record.wa_pay_amount,
            })
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200){
                    Modal.success({
                        title: '领取成功',
                        content: res.shortMessage,
                    });
                    this.getData();
                }else if(res.status == 400){
                    Modal.success({
                        title: '领取成功',
                        content: res.shortMessage,
                    });
                    this.getData();
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*流水达标领奖*/
    onWateAmountAward(record){
        Fetch.wateAmountAward({
            method: 'POST',
            body: JSON.stringify({
                activityid: this.state.id,
                amount: record.wa_water_account,
            })
        }).then((res)=> {
            if(this._ismount){
                if(res.status == 200){
                    Modal.success({
                        title: '领取成功',
                        content: res.shortMessage,
                    });
                    this.getData();
                }else if(res.status == 400){
                    Modal.success({
                        title: '领取成功',
                        content: res.shortMessage,
                    });
                    this.getData();
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*拉新领奖*/
    onPullNewAward(){
        Fetch.pullNewAward({
            method: 'POST',
            body: JSON.stringify({
                activityid: this.state.id,
            })
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200){
                    Modal.success({
                        title: '领取成功',
                        content: res.shortMessage,
                    });
                    this.getData();
                }else if(res.status == 400){
                    Modal.success({
                        title: '领取成功',
                        content: res.shortMessage,
                    });
                    this.getData();
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*新人注册活动领取registerAward*/
    onNewReset(record){
        let type = '',
            {userSign} = this.state;
        if(record.id == 1){//注册领取
            type = 'recharge'
        }else{
            type = 'extract'
        }
        Fetch.registerAward({
            method: 'POST',
            body: JSON.stringify({
                activityid: this.state.id,
                amount: userSign.recharge_amount,
                register_type: type
            })
        }).then((res)=> {
            if(this._ismount){
                if(res.status == 200){
                    Modal.success({
                        title: '领取成功',
                        content: res.shortMessage,
                    });
                    this.getData();
                }else if(res.status == 400){
                    Modal.success({
                        title: '领取成功',
                        content: res.shortMessage,
                    });
                    this.getData();
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    }
    /*奖金说明*/
    onActivityType(){
        let { response } = this.state,
            activityType = response.activity_mechanism_type;
        if(activityType == 1){
            return (
                <div className="dissertation_active">
                    <span>专题活动链接地址：</span>
                    <a href={response.radio_activity_type_url} target="_blank">{response.radio_activity_type_url}</a>
                </div>
            )
        }else if(activityType == 2){
            let columns = [
                { title: '已推广人数（人）', dataIndex: 'pull_new_num' ,width: 80},
                { title: '有效推广人数（人）', dataIndex: 'used_recharge_count' ,width: 80},
                { title: '可领奖金', dataIndex: 'used_user_award_amount' ,width: 80},
                { title: '操作', dataIndex: 'used_user_award_amount_2',
                    render: (text) =>
                        <Button
                            onClick={()=>this.onPullNewAward()} type="primary"
                            disabled={response.user_is_enrolls == 0 ? true : false}
                        >
                            领取
                        </Button>,
                    width: 80
                }
            ];
            let { userSign } = this.state;
            let data = [
                {
                    pull_new_num: userSign.pull_new_num,
                    used_recharge_count: userSign.used_recharge_count,
                    used_user_award_amount: userSign.used_user_award_amount,
                    userid: '1',
                }
            ];
            return (
                <div className="dissertation_active">
                    <ul>
                        <li>1. 直属下线注册时间晚于
                            <span className="col_color_ying">{timestampToTime(response.reg_add_time_last_of)}</span>
                            （包含），且充值金额大于等于
                            <span className="col_color_ying">{response.is_regnew_pay_amount_val}</span>
                            元
                        </li>
                        <li>
                            2. 人数限额：
                            <span className="col_color_ying">{response.max_online_num_num}</span>
                            人
                        </li>
                    </ul>
                    <div className="a_d_table">
                        <Table columns={columns}
                               rowKey={record => record.userid}
                               dataSource={data}
                               pagination={false}
                               loading={this.state.tableLoading}
                               scroll={{y: 300}}
                               size="middle"
                        />
                    </div>
                </div>
            )
        }else if(activityType == 3){
            let activity_award_sign_sets = response.activity_award_sign_sets instanceof Array && response.activity_award_sign_sets[0];
            if(activity_award_sign_sets != undefined){
                let columns = [
                    { title: '达到天数', dataIndex: 'aw_days' ,width: 80},
                    { title: '奖金', dataIndex: 'aw_pay_awards' ,width: 80},
                    { title: '可领取次数', dataIndex: 'aw_get_award_numbers' ,width: 80},
                    { title: '操作', dataIndex: 'aw_get_award_numbers_2',
                        render: (text, record) =>
                            <Button
                                onClick={()=>this.onSignTheAward(record)} type="primary"
                                disabled={
                                    response.user_is_enrolls == 0 ||
                                    (parseInt(record.aw_get_award_numbers) <= 0 ||
                                    record.user_sing_get_numbers != 1
                                        ? true : false)}
                            >
                                领取
                            </Button>,
                        width: 80
                    }
                ];

                if(activity_award_sign_sets.aw_days == undefined){
                    columns = columns.filter(item => item.dataIndex != 'aw_days')
                }
                if(activity_award_sign_sets.aw_pay_awards == undefined){
                    columns = columns.filter(item => item.dataIndex != 'aw_pay_awards')
                }
                if(activity_award_sign_sets.aw_surplus_prizes == undefined){
                    columns = columns.filter(item => item.dataIndex != 'aw_surplus_prizes')
                }
                if(activity_award_sign_sets.aw_get_award_numbers == undefined){
                    columns = columns.filter(item => item.dataIndex != 'aw_get_award_numbers')
                }
                return (
                    <div>
                        <p className="a_d_explain_text">1. {response.sign_day_count_type == 0 ? '流水按天累计计算' : '流水按天连续计算'}</p>
                        <p className="a_d_explain_text">
                            2. 流水达到
                            <span className="col_color_ying"> {response.sign_conditions_water_amount == '' ? 0 : response.sign_conditions_water_amount} </span>
                            元，自动签到
                        </p>
                        <div className="a_d_table">
                            <Table columns={columns}
                                   rowKey={record => record.userid}
                                   dataSource={response.activity_award_sign_sets}
                                   pagination={false}
                                   loading={this.state.tableLoading}
                                   scroll={{y: 300}}
                                   size="middle"
                            />
                        </div>
                    </div>
                )
            }else{
                return <p className="no_data">暂无数据</p>;
            }
        }else if(activityType == 4){
            let water_bills_stes = response.water_bills_stes instanceof Array && response.water_bills_stes[0];
            if(water_bills_stes != undefined){
                let columns = [
                    { title: '序号', dataIndex: 'key', width: 50,
                        render: (text, record, index)=> index+1
                    },
                    { title: '充值金额', dataIndex: 'wa_pay_amount', width: 75 },
                    { title: '充值奖金', dataIndex: 'wa_pay_awards', width: 75 },
                    // { title: '剩余奖金份数', dataIndex: 'wa_surplus_prizes', width: 75 },
                    { title: '可领次数', dataIndex: 'wa_get_awards', width: 75 },
                    { title: '流水金额', dataIndex: 'wa_water_account', width: 75 },
                    { title: '流水奖金', dataIndex: 'wa_water_award', width: 75 },
                    { title: '可领次数', dataIndex: 'wa_get_award_numbers', width: 75 },
                    { title: '操作', dataIndex: 'wa_get_awards_2', width: 75,
                        render: (text, record) =>
                            <Button type="primary"
                                    disabled={
                                        response.status != 1||
                                        response.user_is_enrolls == 0 ||
                                        parseInt(record.wa_get_awards) <= 0 ||
                                        record.user_aw_get_numbers != 1 ? true : false
                                    }
                                    onClick={()=>this.onRechargeAmountAward(record)}
                            >
                                领取
                            </Button>,
                    },
                    { title: '操作', dataIndex: 'wa_get_award_numbers_2', width: 80,
                        render: (text, record) =>
                            <Button type="primary"
                                    disabled={
                                        response.status != 1||
                                        response.user_is_enrolls == 0 ||
                                        parseInt(record.wa_get_award_numbers) <= 0 ||
                                        record.user_wa_get_numbers != 1 ? true : false
                                    }
                                    onClick={()=>this.onWateAmountAward(record)}
                            >
                                领取
                            </Button>
                    },
                ];

                if(water_bills_stes.wa_pay_amount == undefined){
                    columns = columns.filter(item => item.dataIndex != 'wa_pay_amount')
                }
                if(water_bills_stes.wa_pay_awards == undefined){
                    columns = columns.filter(item => item.dataIndex != 'wa_pay_awards')
                }
                if(water_bills_stes.wa_surplus_prizes == undefined){
                    columns = columns.filter(item => item.dataIndex != 'wa_surplus_prizes')
                }
                if(water_bills_stes.wa_get_awards == undefined){
                    columns = columns.filter(item => item.dataIndex != 'wa_get_awards');
                    columns = columns.filter(item => item.dataIndex != 'wa_get_awards_2')
                }
                if(water_bills_stes.wa_water_account == undefined){
                    columns = columns.filter(item => item.dataIndex != 'wa_water_account')
                }
                if(water_bills_stes.wa_water_award == undefined){
                    columns = columns.filter(item => item.dataIndex != 'wa_water_award')
                }
                if(water_bills_stes.wa_surplus_award == undefined){
                    columns = columns.filter(item => item.dataIndex != 'wa_surplus_award')
                }
                if(water_bills_stes.wa_get_award_numbers == undefined){
                    columns = columns.filter(item => item.dataIndex != 'wa_get_award_numbers');
                    columns = columns.filter(item => item.dataIndex != 'wa_get_award_numbers_2');
                }

                return (
                    <div className="a_d_table">
                        <Table columns={columns}
                               rowKey={(record, index) => index}
                               dataSource={response.water_bills_stes}
                               pagination={false}
                               loading={this.state.tableLoading}
                               scroll={{y: 300}}
                               size="middle"
                        />
                    </div>
                )
            }else{
                return <p className="no_data">暂无数据</p>;
            }
        }else if(activityType == 7){
            let columns = [
                { title: '充值金额', dataIndex: 'recharge', width: 75 },
                { title: '可领取奖金', dataIndex: 'bonus', width: 75 },
                { title: '操作', dataIndex: 'action', width: 75,
                    render: (text, record) =>
                        <Button type="primary"
                                disabled={
                                    response.user_is_enrolls == 0 ||
                                    record.btn != 1 ? true : false
                                }
                                onClick={()=>this.onNewReset(record)}
                        >
                            领取
                        </Button>,
                }
            ];
            return (
                <div className="a_d_table">
                    <Table columns={columns}
                           rowKey={record => record.id}
                           dataSource={this.state.tableData}
                           pagination={false}
                           loading={this.state.tableLoading}
                           size="middle"
                    />
                </div>
            )
        }else{
            return <p className="no_data">暂无数据</p>;
        }
    };
    /*参与平台*/
    onPlatform(){
        let { response } = this.state,
            platform = response.platform,
            text = '';
        if(platform.read_rang_android != undefined && platform.read_rang_android == 1){
            text += 'Android客户端，'
        }
        if(platform.read_rang_ios != undefined && platform.read_rang_ios == 1){
            text += 'IOS客户端，'
        }
        if(platform.read_rang_web != undefined && platform.read_rang_web == 1){
            text += 'web端，'
        }
        if(platform.read_rang_air != undefined && platform.read_rang_air == 1){
            text += 'Air客户端，'
        }
        if(platform.read_rang_other != undefined && platform.read_rang_other == 1){
            text += '其他'
        }
        return text;
    };
    /*报名状态*/
    onStatus(){
        let { response } = this.state,
            status = response.status,
            user_is_enrolls = response.user_is_enrolls;
        if(user_is_enrolls == 0 && status == 1){
            return '立刻报名'
        }else if(user_is_enrolls == 1 && status == 1){
            return '已报名'
        }else if(status == 200){
            return '已完成'
        }else if(status == 400){
            return '已满员'
        }else if(status == 401){
            return '已结束'
        }else{
            return '无状态'
        }
    };
    /*个人进度*/
    onMechanismType(){
        let { response, userSign } = this.state,
            type = response.activity_mechanism_type;
        if(type == 1){
            return <p className="dissertation">请前往专题页查看个人进度</p>
        }else if(type == 2){
            return (
                <ul className="schedule_list">
                    <li>已推广人数：{userSign.pull_new_num == undefined ? '0' : userSign.pull_new_num} 人</li>
                    <li>有效推广人数：{userSign.used_recharge_count == undefined ? '0' : userSign.used_recharge_count} 人</li>
                    <li>可领取奖金：{userSign.used_user_award_amount == undefined ? '0' : userSign.used_user_award_amount}元</li>
                </ul>
            )
        }else if(type == 3){
            return (
                <ul className="schedule_list">
                    <li>累计签到天数：{userSign.count_sign_days == undefined ? '0' : userSign.count_sign_days} 天</li>
                    <li>连续最大签到天数：{userSign.max_continuity_sign_days == undefined ? '0' : userSign.max_continuity_sign_days} 天</li>
                    <li>可领取奖金：{userSign.user_award_amount == undefined ? '0' : userSign.user_award_amount} 元</li>
                    <li>已领取奖金：{userSign.use_award_amount == undefined ? '0' : userSign.use_award_amount} 元</li>
                </ul>
            )
        }else if(type == 4){
            let water_bills_stes = response.water_bills_stes instanceof Array && response.water_bills_stes[0];
            return (
                <ul className="schedule_list">
                    {
                        water_bills_stes.wa_pay_amount != undefined ?
                            <li>充值金额：{userSign.recharge_amount == undefined ? '0' : userSign.recharge_amount} 元</li> : null
                    }
                    {/*{*/}
                        {/*water_bills_stes.wa_pay_amount != undefined ?*/}
                            {/*<li>充值奖金金额：{userSign.user_award_amount == undefined ? '0' : userSign.user_award_amount} 元</li> : null*/}
                    {/*}*/}
                    {
                        water_bills_stes.wa_water_account != undefined ?
                            <li>流水金额：{userSign.user_loss_amount == undefined ? '0' : userSign.user_loss_amount} 元</li> : null
                    }
                    {
                        water_bills_stes.wa_water_account != undefined ?
                            <li>流水奖金金额：{userSign.loss_award_amount == undefined ? '0' : userSign.loss_award_amount} 元</li> : null
                    }
                    <li>已领取奖金金额：{userSign.use_award_amount == undefined ? '0' : userSign.use_award_amount} 元</li>
                    <li>剩余奖金金额：{userSign.used_user_award_amount == undefined ? '0' : userSign.used_user_award_amount} 元</li>
                </ul>
            )
        }else if(type == 7){
            return (
                <ul className="schedule_list">
                    <li>已充值金额：{userSign.recharge_amount}元</li>
                </ul>
            )
        }else{
            return <p className="dissertation">无</p>
        }
    };
    render() {
        const { response } = this.state;
        return (
            <Row type="flex" justify="center" align="top" className="a_d_main main_width" >
                <Col span={24}>
                    {
                        response.activity_pics == undefined || response.activity_pics == '' ?
                            <img className="a_d_activeImg" src={litimg_details} alt=""/> :
                            <img className="a_d_activeImg" src={stateVar.httpUrl+response.activity_pics + '?' + new Date().getTime()} alt="活动"/>

                    }
                    <h3 className="a_d_activeName">{response.activity_title}</h3>
                    <div className="a_d_active_introduce clear">
                        <div className="a_d_active left">
                            <div className="clear">
                                <ul className="a_d_list left">
                                    <li>
                                        <span>活动时间：</span>
                                        <span>
                                            {timestampToTime(response.start_time)} 至 {timestampToTime(response.end_time)}
                                        </span>
                                    </li>
                                    <li>
                                        <span>活动限额：</span>
                                        <span>{response.max_online_num_type == 0 ? '总共限额' : '每日限额'} {response.max_online_num_num} 名</span>
                                    </li>
                                    <li>
                                        <span>参与平台：</span>
                                        <span>
                                            {
                                                this.onPlatform()
                                            }
                                        </span>
                                    </li>
                                </ul>
                                <div className="a_d_apply right">
                                    {
                                        response.activity_mechanism_type == 1 ? null :
                                            <Button type="primary" loading={this.state.btnLoading}
                                                    onClick={()=>this.enterApply()}
                                                    disabled = {response.status != 1 || response.user_is_enrolls != 0}
                                            >
                                                {
                                                    this.onStatus()
                                                }
                                            </Button>
                                    }
                                    {/*<p className="a_d_residue_number">（限额剩余{response.remain_online_num}人）</p>*/}
                                </div>
                            </div>
                            <div className="a_d_explain">
                                <p className="a_d_explain_text">奖金说明：</p>
                                {
                                    this.onActivityType()
                                }
                            </div>
                            {
                                response.activity_introduce == '' ? null :
                                    <div className="a_d_explain">
                                        <p className="a_d_explain_text">规则说明：</p>
                                        <div className="a_d_explain_list" dangerouslySetInnerHTML={{__html: response.activity_introduce}}></div>
                                    </div>
                            }

                        </div>
                        <div className="right">
                            <div className="a_d_schedule clear">
                                <p className="schedule_title">个人进度</p>
                                {
                                    this.onMechanismType()
                                }
                            </div>
                            <div className="a_d_schedule clear">
                                <p className="schedule_title">活动范围</p>
                                    <ul className="schedule_list lottery_name clear">
                                        <li style={{color:'#CC0000', fontSize:14}}>彩票</li>
                                        {
                                            response.lotterys instanceof Array && response.lotterys == 0 ?
                                                <p className="no_data">暂无数据</p> :
                                                response.lotterys.map((item, index)=>{
                                                    return (
                                                        <li className="left" key={index}>{item}</li>
                                                    )
                                                })
                                        }
                                    </ul>
                                    <ul className="schedule_list lottery_name clear">
                                        <li style={{color:'#CC0000', fontSize:14}}>综合游戏</li>
                                        {
                                            response.games instanceof Array && response.games.length == 0 ?
                                                <p className="no_data">暂无数据</p> :
                                                response.games.map((item, index)=>{
                                                    return (
                                                        <li className="left" key={index}>{item}</li>
                                                    )
                                                })
                                        }
                                    </ul>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        )
    }
}
