import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Row, Col, Button, Table  } from 'antd';

import active_detaile from './Img/active_detaile.png';
import './ActivityDetails.scss'
@observer
export default class ActivityDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            tableLoading: false,
        };
    };
    enterLoading() {
        this.setState({ loading: true });
    };
    render() {
        const columns = [
            { title: '序号', dataIndex: 'key', width: 50 },
            { title: '充值金额', dataIndex: 'age', width: 80 },
            { title: '充值奖金', dataIndex: 'address', width: 80 },
            { title: '剩余奖金份数', dataIndex: 'addressss', width: 111 },
            { title: '可领次数', dataIndex: 'address4',
                render: (text, record) => <Button type="primary">领取</Button>,
                width: 80
            },
            { title: '流水金额', dataIndex: 'address1', width: 80 },
            { title: '流水奖金', dataIndex: 'name', width: 80 },
            { title: '奖金分数', dataIndex: 'address3', width: 80 },
            { title: '剩余奖金份数', dataIndex: 'address343', width: 111 },
            { title: '可领次数', dataIndex: '', width: 80,
                render: (text, record) => <Button type="primary" disabled={record.key === 2 ? true : false}>领取</Button>
            },
        ];

        const data = [
            { key: 1, name: 'John Brown', age: 32, address: 'New York '},
            { key: 2, name: 'Jim Green', age: 42, address: 'Londrk' },
            { key: 3, name: 'Joe Black', age: 32, address: 'ake Park' },
        ];
        const ruleText = [
            {
                key: '①',
                text: '所有会员均可参与，流水后即可申请奖金，奖金无需流水即可出款，每日限额<i>（500）</i>名；',
            },{
                key: '②',
                text: '每人每日<i>仅可领取一轮</i>，活动奖励将在申请后1小时内发放，流水需要当天完成<i>（02:00:00 - 02:00:00）</i>否则次日不可继续申请彩金；',
            },{
                key: '③',
                text: '申请奖金需在次日01:59:59以前完成，逾期将视为自动放弃当天奖励；',
            },{
                key: '④',
                text: '该活动消费流水只计算<i> 泰国彩种 </i>流水，且不与其它活动共享。玩法投注不得超过该玩法投注总码的70%（不包含70%），即定位胆必须小于7注，二码必须小于70注，三码必须小于700注，四星必须小于7000注，五星必须小于70000注。如发现违规投注情况，均视作放弃本次活动；',
            },{
                key: '⑤',
                text: '同一账户、同一姓名、同一银行卡、同一IP地址不可重复申请；',
            },{
                key: '⑥',
                text: '参与本活动需要遵守恒彩平台相关规则，如发现任何利用活动或技术漏洞对冲等恶意套利行为，恒彩平台将扣除所有<i>违规所得</i>，并且有权<i>冻结</i>其账号；',
            },{
                key: '⑦',
                text: '恒彩娱乐平台保留对活动的最终解释权，并持有修改、终止等权利。',
            },

        ];
        const lotteryName = [
            '泰国秒秒彩',
            '泰国300秒',
            '河内60秒',
            '重庆时时彩',
            '天津时时彩',
            '北京PK拾',
            '山东11选5',
            '排列3',
            '北京快乐8',
            '泰国60秒',
            '泰国11选5',
            '腾讯时时彩',
            '新疆时时彩',
            '河南481',
            '江西11选5',
            '广东11选5',
            '3D福彩',
        ];
        const gameName = [
            'EA娱乐城',
            'PT娱乐城',
            '博饼',
            '体育竞技',
            'GT娱乐城',
        ];
        return (
            <div className="activity_details">
                <Row type="flex" justify="center" align="top" className="a_d_main main_width" >
                    <Col span={24}>
                        <img className="a_d_activeImg" src={active_detaile} alt=""/>
                        <h3 className="a_d_activeName">泰国幸运金</h3>
                        <div className="a_d_active_introduce clear">
                            <div className="a_d_active left">
                                <div className="clear">
                                    <ul className="a_d_list left">
                                        <li>
                                            <span>活动时间：</span>
                                            <span>2017年11月01日02:00至2017年11月11日02:00</span>
                                        </li>
                                        <li>
                                            <span>活动限额：</span>
                                            <span>每日限额500名</span>
                                        </li>
                                        <li>
                                            <span>参与平台：</span>
                                            <span>
                                                PC客户端
                                                （<a className="hover_a" href="#">平台说明</a>）
                                            </span>
                                        </li>
                                        <li></li>
                                        <li>
                                            <span>奖金说明：</span>
                                            <span></span>
                                        </li>
                                        <li>
                                            <span>总计可领取奖金次数：</span>
                                            <span>1次</span>
                                        </li>
                                    </ul>
                                    <div className="a_d_apply right">
                                        <Button type="primary" className="a_d_apply_btn" loading={this.state.loading} onClick={()=>this.enterLoading()}>
                                            立刻报名
                                        </Button>
                                        <p className="a_d_residue_number">（限额剩余20人）</p>
                                    </div>
                                    <div className="a_d_apply right">
                                        <Button type="primary" className="a_d_apply_btn" loading={this.state.loading} onClick={()=>this.enterLoading()}>
                                            进行中
                                        </Button>
                                        <Button type="primary" className="a_d_apply_btn" loading={this.state.loading} onClick={()=>this.enterLoading()}>
                                            点击签到
                                        </Button>
                                        <Button type="primary" className="a_d_apply_btn" loading={this.state.loading} onClick={()=>this.enterLoading()}>
                                            已签到
                                        </Button>
                                    </div>
                                </div>
                                <div className="a_d_explain">
                                    {/*<p className="a_d_explain_text">奖金说明：</p>*/}
                                    {/*<p className="a_d_explain_text">总计可领取奖金次数：1次</p>*/}
                                    <div className="a_d_table">
                                        <Table columns={columns}
                                               rowKey={record => record.userid}
                                               dataSource={data}
                                               pagination={false}
                                               loading={this.state.tableLoading}
                                               onChange={this.handleTableChange}
                                               scroll={{y: 300}}
                                               size="middle"
                                        />
                                    </div>
                                </div>
                                <div className="a_d_explain">
                                    <p className="a_d_explain_text">规则说明：</p>
                                    <ul className="a_d_explain_list">
                                        {
                                            ruleText.map((item, index)=>{
                                                return (
                                                    <li key={index}>
                                                        <span style={{color: '#CC0000', marginRight: 10}}>{item.key}</span>
                                                        <span dangerouslySetInnerHTML={{__html: item.text}}></span>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            </div>
                            <div className="right">
                                <div className="a_d_schedule clear">
                                    <p className="schedule_title">个人进度</p>
                                    <ul className="schedule_list">
                                        <li>有效充值金额：10000000.00元</li>
                                        <li>有效流水金额：10000000.00元</li>
                                        <li>待审核奖金：10000000.00元</li>
                                        <li>已领取奖金：10次</li>
                                        <li>剩余抽奖次数：10次</li>
                                    </ul>
                                    <a className="lucky_draw right" href="#">前往抽奖</a>
                                </div>
                                <div className="a_d_schedule clear">
                                    <p className="schedule_title">活动范围</p>
                                    <ul className="schedule_list lottery_name clear">
                                        <li style={{color:'#CC0000', fontSize:14}}>彩票</li>
                                        {
                                            lotteryName.map((item, index)=>{
                                                return (
                                                    <li className="left" key={index}>{item}</li>
                                                )
                                            })
                                        }
                                    </ul>
                                    <ul className="schedule_list lottery_name clear">
                                        <li style={{color:'#CC0000', fontSize:14}}>综合游戏</li>
                                        {
                                            gameName.map((item, index)=>{
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
            </div>
        )
    }
}
