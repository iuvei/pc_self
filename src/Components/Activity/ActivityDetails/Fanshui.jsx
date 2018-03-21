import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Row, Col, Table, } from 'antd';

import fanshui_details from './Img/fanshui_details.png';
import './ActivityDetails.scss';

@observer
export default class Fanshui extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    render() {
        let columns = [
            { title: '周有效投注额（元）', dataIndex: 'bet' ,width: 80},
            { title: '会员', dataIndex: 'member' ,width: 80},
            { title: '上级', dataIndex: 'superior' ,width: 80},
            { title: '直属', dataIndex: 'directly',width: 80}
        ];
        const data = [
            {
                bet: '2.000 - 300.000',
                member: '0.5%',
                superior: '0.1%',
                directly: '0.1%',
            },
            {
                bet: '300.001 - 2000.000',
                member: '0.6%',
                superior: '0.1%',
                directly: '0.1%',
            },
            {
                bet: '2000.000以上',
                member: '0.8%',
                superior: '0.1%',
                directly: '0.1%',
            },
        ];

        return (
            <Row type="flex" justify="center" align="top" className="a_d_main main_width" >
                <Col span={24}>
                    <img className="a_d_activeImg" src={fanshui_details} alt="活动"/>
                    <h3 className="a_d_activeName">周返水</h3>
                    <div className="a_d_active_introduce clear">
                        <div className="a_d_active left">
                            <div className="clear">
                                <ul className="a_d_list left">
                                    <li>
                                        <span>活动时间：</span>
                                        <span>2018年1月1日 00:00:00 至 2018年12月31日 23:59:59</span>
                                    </li>
                                    <li>
                                        <span className="left">活动内容：</span>
                                        <span className="right" style={{width: 750}}>
                                            会员符合以下标准，上级得0.1%奖金，直属得0.1%奖金，会员返水最高金额上限为五万元，上级及总代直属的返水上限为
                                            <span className="col_color_ying">五千</span>
                                            元，
                                            <span className="col_color_ying">（该活动不包含彩票有效投注）</span>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div className="a_d_explain">
                                <p className="a_d_explain_text">奖金说明：</p>
                                <div style={{border: '1px solid #ccc', padding: 6}}>
                                    <Table columns={columns}
                                           rowKey={record => record.bet}
                                           dataSource={data}
                                           pagination={false}
                                           size="middle"
                                    />
                                </div>
                            </div>
                            <div className="a_d_explain">
                                <p className="a_d_explain_text">规则说明：</p>
                                <ul className="a_d_explain_list">
                                    <li>
                                        <span className="col_color_ying">①</span>&nbsp;
                                        本活动所有恒彩会员均可参与，返水将在
                                        <span className="col_color_ying">每周结算后一个工作日</span>
                                        内发放；
                                    </li>
                                    <li>
                                        <span className="col_color_ying">②</span>&nbsp;
                                        此活动规则适用于
                                        <span className="col_color_ying">体育竞技、EA娱乐城、PT娱乐城、KGAME游戏、博饼</span>
                                        ；
                                    </li>
                                    <li>
                                        <span className="col_color_ying">③</span>&nbsp;
                                        获得返水的最低金额为，
                                        <span className="col_color_ying">10元</span>
                                        返水按照
                                        <span className="col_color_ying">1元的整数倍</span>
                                        发放；
                                    </li>
                                    <li>
                                        <span className="col_color_ying">④</span>&nbsp;
                                        <span className="col_color_ying">有效流水</span>
                                        仅是
                                        <span className="col_color_ying">产生输赢结果的投注额</span>
                                        进行计算，所有对冲投注及无风险投注不计算在体育竞技、EA娱乐城、PT娱乐城、GT娱
                                        乐城、博饼有效流水内及累计投注要求内；
                                    </li>
                                    <li>
                                        <span className="col_color_ying">⑤</span>&nbsp;
                                        同一账户、同一姓名、同一银行卡、同一IP地址不可重复申请；
                                    </li>
                                    <li>
                                        <span className="col_color_ying">⑥</span>&nbsp;
                                        参与本活动需要遵守恒彩平台相关规则，如发现任何利用活动或技术漏洞对冲等恶意套利行为，恒彩平台将扣除所有违规所得，并且有权
                                        <span className="col_color_ying">冻结</span>
                                        其账号；
                                    </li>
                                    <li>
                                        <span className="col_color_ying">⑦</span>&nbsp;
                                        恒彩彩票平台保留对活动的最终解释权，并持有修改、终止等权利；
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="right">
                            {/*<div className="a_d_schedule clear">*/}
                                {/*<p className="schedule_title">个人进度</p>*/}
                                {/*<ul className="schedule_list">*/}
                                    {/*<li>流水金额：10000000.00元</li>*/}
                                {/*</ul>*/}
                            {/*</div>*/}
                            <div className="a_d_schedule clear">
                                <p className="schedule_title">活动范围</p>
                                    <ul className="schedule_list lottery_name clear">
                                        <li style={{color:'#CC0000', fontSize:14}}>综合游戏</li>
                                        <li className="left">EA娱乐城</li>
                                        <li className="left">体育竞技</li>
                                        <li className="left">PT娱乐城</li>
                                        <li className="left">KGAME游戏</li>
                                        <li className="left">博饼</li>
                                    </ul>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        )
    }
}
