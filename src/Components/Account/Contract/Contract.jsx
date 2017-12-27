import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Table, Button, Popconfirm, Pagination, Icon,Modal,Select,Input,Slider,InputNumber ,Tooltip } from 'antd';
import ContractModal from './ContractModal/ContractModal'

import Footer from '../../Common/Footer/Footer'
const Option=Select.Option

import addSrc from './Img/add.png';
import moneySrc from './Img/money.png';
import dollarSrc from './Img/dollar.png';
import yuanSrc from './Img/yuan.png';

import './Contract.scss'

@observer
export default class Contract extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedRowKeys: [], // Check here to configure the default column
            loading: false,
            visible:false,

        }
    };
    transferMsg(visible) {
        this.setState({
            visible
        });
    }

    onShowSizeChange(current, pageSize) {
        console.log(current, pageSize);
        this.setState({pagination: current})
    };
    showModal(){
        this.setState({
            visible:true,
        });
    }

    componentWillUnmount() {
        console.log("componentWillUnmount");

    };

    render() {
        const columns = [{
            title: '用户名',
            dataIndex: 'name',
            key: 'name',
            width: 107,
        }, {
            title: '奖金组',
            dataIndex: 'award',
            key: 'award',
            width: 80,
            },{
            title: '分红比例',
            dataIndex: 'portion',
            key: 'portion',
            width: 80,
        }, {
                title: '日工资协议',
                children: [{
                    title: '日销量1万',
                    dataIndex: 'day1',
                    key: 'day1',
                    width: 80,

                }, {
                    title: '日销量10万',
                    dataIndex: 'day10',
                    key: 'day10',
                    width: 80,

                }, {
                    title: '日销量30万',
                    dataIndex: 'day30',
                    key: 'day30',
                    width: 80,

                }, {
                    title: '日销量50万',
                    dataIndex: 'day50',
                    key: 'day50',
                    width: 80,

                }, {
                    title: '日销量70万',
                    dataIndex: 'day70',
                    key: 'day70',
                    width: 80,

                }, {
                    title: '日销量100万',
                    dataIndex: 'day100',
                    key: 'day100',
                    width: 80,

                }]
            },{
                title: '配置管理',
                children: [{
                    title: '1956',
                    dataIndex: 'deal0',
                    key: 'deal0',
                    width: 80,
                },{
                    title: '1954',
                    dataIndex: 'deal1',
                    key: 'deal1',
                    width: 80,
                },{
                    title: '1952',
                    dataIndex: 'deal2',
                    key: 'deal2',
                    width: 80,
                },{
                    title: '1950',
                    dataIndex: 'deal3',
                    key: 'deal3',
                    width: 80,
                }]
        }];
        const data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                key: i,
                name: 'supervip',
                award: i + 1,
                portion: '7%',
                day1: '2%',
                day10: '39%',
                day30: '4%',
                day50: '59%',
                day70: '69%',
                day100:'7%',
                deal0:'5',
                deal1:'4',
                deal2:'8',
                deal3:'9',
            });
        }
        const text=<div className='c_info_wrap'>
            <p className='c_info_title'>日工资规则</p>
            <p className='c_i_title1'>恒彩日工资：</p>
            <p>发放时间：每日10:00由系统自动发放上一日工资；</p>
            <p className='c_i_title2'>日工资规则：</p>
            <p>1、非同IP、非同银行卡会员</p>
            <p>2、参与投注的流水统计限彩票，且玩法投注不得超过该玩法70%（不包含70%</p>
            <p>），即定位胆必须小于7住，二码必须小于69注，三码必须小于699注，四星必</p>
            <p>须小于6999注，</p>
            <p>五星必须小于69999注。如发现违规投注情况，均视作放弃日工资；恒彩娱乐保</p>
            <p>留最终解释权，并持有终止、修改等权利</p>
        </div>;

        return (
            <div className='contract_main'>
                <ul className='c_top'>
                    <li className='c_salary'>
                        <p className='c_title'><img src={moneySrc}/>我的日工资比例
                            <Tooltip placement="bottom" title={text} >
                                <Icon className='c-info' type="info-circle" />
                            </Tooltip>

                        </p>
                        <ul className='c_table1'>
                            <li>100</li>
                            <li>110</li>
                        </ul>
                        <ul className='c_table2'>
                            <li>120</li>
                            <li>130</li>
                        </ul>
                        <ul className='c_table3'>
                            <li>140</li>
                            <li>150</li>
                        </ul>
                    </li>
                    <li className='c_portion'>
                        <p className='c_title'><img src={yuanSrc}/>我的分红比例</p>
                        <div className='c_table_wrap'>
                            <div >
                                <p>分红</p>
                                <p className='c_txt'>15%</p>
                            </div>
                        </div>

                    </li>
                    <li className='c_award'>
                        <p className='c_title'><img src={dollarSrc}/>我的奖金组</p>
                        <div className='c_table_wrap'>
                            <div >
                                <p>奖金组</p>
                                <p className='c_txt'>1956</p>
                            </div>
                        </div>

                    </li>
                    <li className='c_setContract' onClick={()=>{this.showModal()}}>
                        <div>
                            <img src={addSrc}/>
                            <p>创建契约</p>
                        </div>
                    </li>
                </ul>
                { this.state.visible ?   <ContractModal visible={this.state.visible} transferMsg = {visible => this.transferMsg(visible)}/>:""}
                <div className="c_table">
                    <Table columns={columns} dataSource={data} bordered={true} pagination={false}/>
                </div>
                <div className="right">
                    <Pagination showSizeChanger onShowSizeChange={(current, pageSize)=>{this.onShowSizeChange(current, pageSize)}} defaultCurrent={1} total={500} />
                </div>

            </div>
        );
    }
}
