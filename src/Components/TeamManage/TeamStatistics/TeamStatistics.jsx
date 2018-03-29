/*团队统计*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Spin} from 'antd';
import echarts from 'echarts';
import Fetch from '../../../Utils';
import { setDateTime } from '../../../CommonJs/common';

import './TeamStatistics.scss'

const selectDayArr = [
    {
        text: '七天',
        id: 7,
    },{
        text: '十五天',
        id: 15,
    },{
        text: '三十天',
        id: 30,
    }
];
@observer
export default class TeamStatistics extends Component {
    constructor(props){
        super(props);
        this.state={
            spinLoading: false,
            postData: {
                tag: 'getUserBaseData', //获得统计数据必传getUserBaseData这个值
                limite_data: null,// 如果有传此参数就第获得多少天之前的数据,没传就只获得当天数据
            },
            response: {
                add_money_count: 0, //今日充值人数
                login_count: 0,//今日登陆人数
                register_count: 0,//今日注册人数
                team_count: 0,//团队总人数
                vote_count: 0,//今日投注人数
            },
            statistics: {
                date: [], // 日期
                registerData: [], // 注册
                loginData: [], // 登录
                addMoneyData: [], // 充值
                voteData: [], // 投注
            },
            defaultSelect: {// 默认是否选中
                register: true,
                login: false,
                recharge: false,
                bet:false,
            }
        }
    };
    componentDidMount() {
        this._ismount = true;
        this.onSelectDay(7);
        this.getTodayData();
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    /*获取今日相关数据*/
    getTodayData() {
        Fetch.UpUserTeam({
            method: 'POST',
            body: JSON.stringify({tag: 'getUserBaseData'})
        }).then((res)=>{
            if(this._ismount && res.status == 200){
                let data = res.repsoneContent,
                    response = {
                        add_money_count: data.add_money_count,
                        login_count: data.login_count,
                        register_count: data.register_count,
                        team_count: data.team_count,
                        vote_count: data.vote_count,
                    };
                this.setState({response: response});

            }
        })
    };
    getData() {
        this.setState({spinLoading: true});
        Fetch.UpUserTeam({
            method: 'POST',
            body: JSON.stringify(this.state.postData),
        }).then((res)=>{
            if(this._ismount){
                this.setState({spinLoading: false});
                if(res.status == 200){
                    let loginDataArr = [],
                        registerDataArr = [],
                        addMoneyDataArr = [],
                        voteDataArr = [],
                        data = res.repsoneContent,
                        statistics = this.state.statistics,
                        login_count = data.login_count,
                        register_count = data.register_count,
                        add_money_count = data.add_money_count,
                        vote_count = data.vote_count;
                    for(let j = 0, date = statistics.date; j < date.length; j++) {
                        let loginFlag = true,
                            registerFlag = true,
                            addMoneyFlag = true,
                            voteFlag = true;
                        for(let key in login_count) {
                            if(key == date[j]){
                                loginDataArr.push(login_count[key]);
                                loginFlag = false;
                                break;
                            }
                        }
                        if(loginFlag) {
                            loginDataArr.push(0);
                        }
                        for(let key in register_count) {
                            if(key == date[j]){
                                registerDataArr.push(register_count[key]);
                                registerFlag = false;
                                break;
                            }
                        }
                        if(registerFlag) {
                            registerDataArr.push(0);
                        }
                        for(let key in add_money_count) {
                            if(key == date[j]){
                                addMoneyDataArr.push(add_money_count[key]);
                                addMoneyFlag = false;
                                break;
                            }
                        }
                        if(addMoneyFlag) {
                            addMoneyDataArr.push(0);
                        }
                        for(let key in vote_count) {
                            if(key == date[j]){
                                voteDataArr.push(vote_count[key]);
                                voteFlag = false;
                                break;
                            }
                        }
                        if(voteFlag) {
                            voteDataArr.push(0);
                        }
                    }
                    statistics.loginData = loginDataArr;
                    statistics.registerData = registerDataArr;
                    statistics.addMoneyData = addMoneyDataArr;
                    statistics.voteData = voteDataArr;
                    this.setState({statistics: statistics}, ()=>this.brokenLine());
                }else{}
            }

        })
    };
    // 折线图
    brokenLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('main')),
            { statistics, defaultSelect } = this.state,
            _this = this;
        let option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['注册人数','登陆人数','充值人数','投注人数'],
                selected: { // 默认是否选中
                    '注册人数': defaultSelect.register,
                    '登陆人数': defaultSelect.login,
                    '充值人数': defaultSelect.recharge,
                    '投注人数': defaultSelect.bet
                },
            },
            xAxis:  {
                type: 'category',
                boundaryGap: false,
                data: statistics.date
            },
            yAxis: {
                type: 'value',
            },
            grid: {
                left: '3%',
                right: '4%',
                top: '25%',
                bottom: '3%',// 控制图表上下左右的空白尺寸
                containLabel: true
            },
            series: [
                {
                    name:'注册人数',
                    type:'line',
                    data:statistics.registerData,
                    itemStyle : {
                        normal : {
                            color:'#20C68E', // 折点
                            lineStyle:{
                                color:'#20C68E' // 折线
                            }
                        }
                    },
                },
                {
                    name:'登陆人数',
                    type:'line',
                    data:statistics.loginData,
                    itemStyle : {
                        normal : {
                            color:'#F58B63', // 折点
                            lineStyle:{
                                color:'#F58B63' // 折线
                            }
                        }
                    },
                },
                {
                    name:'充值人数',
                    type:'line',
                    data:statistics.addMoneyData,
                    itemStyle : {
                        normal : {
                            color:'#27AAE6', // 折点
                            lineStyle:{
                                color:'#27AAE6' // 折线
                            }
                        }
                    },
                },
                {
                    name:'投注人数',
                    type:'line',
                    data:statistics.voteData,
                    itemStyle : {
                        normal : {
                            color:'#FF5757', // 折点
                            lineStyle:{
                                color:'#FF5757' // 折线
                            }
                        }
                    },
                },
            ]
        };

        // 图例开关的行为只会触发 legendselectchanged 事件
        myChart.on('legendselectchanged', function (params) {
            // 获取点击图例的选中状态
            let isSelected = params.selected[params.name];
            if(isSelected){
                if(params.name == '注册人数'){
                    defaultSelect.register = true
                }else if(params.name == '登陆人数'){
                    defaultSelect.login = true
                }else if(params.name == '充值人数'){
                    defaultSelect.recharge = true
                }else if(params.name == '投注人数'){
                    defaultSelect.bet = true
                }else{}
            }else{
                if(params.name == '注册人数'){
                    defaultSelect.register = false
                }else if(params.name == '登陆人数'){
                    defaultSelect.login = false
                }else if(params.name == '充值人数'){
                    defaultSelect.recharge = false
                }else if(params.name == '投注人数'){
                    defaultSelect.bet = false
                }else{}
            }
            _this.setState({defaultSelect});
        });
        // 绘制图表
        myChart.setOption(option);
    };
    // 选择天数
    onSelectDay(val) {
        let dateFlag = [],
            postData = this.state.postData,
            statistics = this.state.statistics;
        if(postData.limite_data == val) {
            return
        }
        postData.limite_data = val;
        for(let i = 1; i <= val; i++){
            let day = setDateTime(-i);
            dateFlag.unshift(day);
        }
        statistics.date = dateFlag;
        this.setState({
            statistics: statistics,
            postData: postData,
        },()=>this.getData());

    }
    render() {
        const response = this.state.response;

        return (
            <div className="t_st_main">
                <ul className="t_st_people_num clear">
                    <li>
                        <div className="t_st_sum_preple">
                            <p>团队总人数</p>
                            <p>{response.team_count}人</p>
                        </div>
                    </li>
                    <li>
                        <div>
                            <p>今日注册人数</p>
                            <p>{response.register_count}人</p>
                        </div>
                    </li>
                    <li>
                        <div>
                            <p>今日登陆人数</p>
                            <p>{response.login_count}人</p>
                        </div>
                    </li>
                    <li>
                        <div>
                            <p>今日充值人数</p>
                            <p>{response.add_money_count}人</p>
                        </div>
                    </li>
                    <li>
                        <div>
                            <p>今日投注人数</p>
                            <p>{response.vote_count}人</p>
                        </div>
                    </li>
                </ul>
                <div className="r_m_hint right" style={{lineHeight: '28px'}}>
                    <p>提示：团队统计人数时间计算时间为00:00:00-23:59:59</p>
                </div>
                <Spin spinning={this.state.spinLoading}>
                    <div className="t_st_broken_line">
                        <ul className="t_st_select_day">
                            {
                                selectDayArr.map((item)=>{
                                    return (
                                        <li className={this.state.postData.limite_data === item.id ? 'select_day_active' : ''} onClick={()=>{this.onSelectDay(item.id)}} key={item.id}>{item.text}</li>
                                    )
                                })
                            }
                        </ul>
                        <div id="main" style={{ width: 1040, height: 450 }}></div>
                    </div>
                </Spin>
            </div>
        );
    }
}
