import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Button, Icon,Modal,Select,Slider,InputNumber  } from 'antd';
import 'whatwg-fetch'
import Fetch from '../../../../Utils';
const Option=Select.Option

import './ContractModal.scss';
import guanbi  from  './Img/guanbi.png'

@observer
export default class ContractModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            ModalTitle: false,
            visible:false,
            navListIndex:4,
            modalClass:"center-modal-c",
            slider:{
                sliderValue: 1850,
                disabledMinus: false,
                sliderMin: 1800,
                sliderMax:1956,
            },
        };
    };
    /*获取用户信息*/
    getUserInfo(){
        Fetch.childrenList({method: "POST"}).then((data)=> {
            console.log("childrenList",data)
        })

    }
    contractType() {
        const ul_0 =<div>
            <ul className="c_speci_contract0">
                <li>
                    契约内容：
                </li>
                <li>
                    <span>第一档：日销量≥1万元时，且活跃用户≥0人时，日工资为</span>
                    <InputNumber size="small" placeholder="" />
                    <span>元/万；</span>
                </li>
                <li>
                    <span>第二档：日销量≥10万元时，且活跃用户≥5人时，日工资为</span>
                    <InputNumber size="small" placeholder="" />
                    <span>元/万；</span>
                </li>
                <li>
                    <span>第三档：日销量≥30万元时，且活跃用户≥10人时，日工资为</span>
                    <InputNumber size="small" placeholder="" />
                    <span>元/万；</span>
                </li>
                <li>
                    <span>第四档：日销量≥50万元时，且活跃用户≥20人时，日工资为</span>
                    <InputNumber size="small" placeholder="" />
                    <span>元/万；</span>
                </li>
                <li>
                    <span>第五档：日销量≥70万元时，且活跃用户≥30人时，日工资为</span>
                    <InputNumber size="small" placeholder="" />
                    <span>元/万；</span>
                </li>
                <li>
                    <span>第六档：日销量≥1万元时，且活跃用户≥40人时，日工资为</span>
                    <InputNumber size="small" placeholder="" />
                    <span>元/万；</span>
                </li>
            </ul>
            <div className="c_b_user0">
                <p>supervip</p>
                <p>2017.11.14</p>
            </div>
            <div className='c_btn0'>
                <Button type="primary">提交契约</Button>
                <Button type="primary" className='c_btn_cancel0'onClick={()=>this.onCancel()}>取消</Button>
            </div>

        </div>;
        const ul_1 =<div>
            <ul className="c_speci_contract1">
                <li>契约内容：</li>
                <li>如该用户每半月结算净盈亏总值时为负数，可获得分红，金额为亏</li>
                <li>
                    <span>损值的</span>
                    <InputNumber size="small" placeholder="" />
                    <span>%。</span>
                </li>
            </ul>
            <div className="c_b_user1">
                <p>supervip</p>
                <p>2017.11.14</p>
            </div>
            <div className='c_btn1'>
                <Button type="primary">提交契约</Button>
                <Button type="primary" className='c_btn_cancel1' onClick={()=>this.onCancel()}>取消</Button>
            </div>

        </div>;
        const ul_2 =<div>
            <ul className="c_speci_contract2">
                <li className='c-title'>契约内容：</li>
                <li>
                    <span>该用户的奖金组级别为</span>
                    <InputNumber
                        min={1800}
                        max={1968}
                        style={{ marginLeft: 16 }}
                        value={this.state.slider.sliderValue}
                        onChange={(value)=>this.onChangeSlider(value)}
                    />
                </li>
                <li>该奖金组剩余配额：无限</li>
                <li>
                    <ul className="c_k_slider">
                        <li>
                            <Icon type="left" onClick={()=>{
                                this.setState(preState => (
                                    preState.slider.sliderValue--
                                ))
                            }}/>
                        </li>
                        <li style={{width: '290px'}}>
                            <Slider min={this.state.slider.sliderMin} tipFormatter={null}
                                    max={this.state.slider.sliderMax}
                                    onChange={(value)=>{this.onChangeSlider(value)}}
                                    value={this.state.slider.sliderValue} />

                        </li>
                        <li>
                            <Icon type="right" onClick={()=>{
                                this.setState(preState => {
                                    console.log(typeof preState.slider.sliderValue)
                                    return {sliderValue: preState.slider.sliderValue++}
                                })
                            }}/>
                        </li>
                    </ul>
                    <div className='c-s-extent'>{this.state.slider.sliderMin}-{this.state.slider.sliderMax}</div>
                </li>
            </ul>
            <div className="c_b_user2">
                <p>supervip</p>
                <p>2017.11.14</p>
            </div>
            <div className='c_btn2'>
                <Button type="primary">提交契约</Button>
                <Button type="primary" className='c_btn_cancel2' onClick={()=>this.onCancel()}>取消</Button>
            </div>
        </div>;
        const ul_3 =<div>
            <ul className="c_speci_contract0">
                <li>
                    契约内容：
                </li>
                <li>
                    该用户可继续推广下级，其中可推广
                </li>
                <li>
                    <span>奖金组为1956的下级用户</span>
                    <InputNumber size="small" placeholder="" />
                    <span>/5个；</span>
                </li>
                <li>
                    <span>奖金组为1954的下级用户</span>
                    <InputNumber size="small" placeholder="" />
                    <span>/5个；</span>
                </li>
                <li>
                    <span>奖金组为1952的下级用户</span>
                    <InputNumber size="small" placeholder="" />
                    <span>/5个；</span>
                </li>
                <li>
                    <span>奖金组为1950的下级用户</span>
                    <InputNumber size="small" placeholder="" />
                    <span>/5个；</span>
                </li>

            </ul>
            <div className="c_b_user2">
                <p>supervip</p>
                <p>2017.11.14</p>
            </div>
            <div className='c_btn0'>
                <Button type="primary">提交契约</Button>
                <Button type="primary" className='c_btn_cancel0'onClick={()=>this.onCancel()}>取消</Button>
            </div>

        </div>;
        switch (parseInt(this.state.navListIndex)) {
            case 0:
                return ul_0;
                break;
            case 1:
                return ul_1;
                break;
            case 2:
                return ul_2;
                break;
            case 3:
                return ul_3;
                break;
        }
    }
    showModal() {
        this.setState({
            visible: true,
        });
    };
    onSelectSys(value){
        console.log(value);
        let index=value;
        if(value==3){
            index=2;
        }
        this.setState({
            navListIndex: value,
            modalClass:"center-modal-c"+index,

        })

    };
    onCancel(){
        this.props.transferMsg(false);


    };
    // 滑动条
    onChangeSlider(value) {
        let slider = this.state.slider;
        slider.sliderValue = value;
        this.forceUpdate();

    };
    componentDidMount() {
        this._ismount = true;
        this.getUserInfo();

    };
    render() {
        return (
            <Modal ref="myModal"
                   title=""
                   wrapClassName={this.state.modalClass}
                   visible={this.props.visible}
                   footer={null}
                   closable={false}
            >
               <img className='c_m_guanbi' src={guanbi}  style={{display: this.state.navListIndex==4 ? 'block' : 'none'}} onClick={()=>this.onCancel()}/>
                <div className="c_aa_form">

                    <ul className="c_aa_list">
                        <li className="c_user">
                            <span className="c_aa_left_text">用户名：</span>
                            <Select size="large" style={{ width: 280 }} onChange={(value)=>{this.onSelectUser(value)}} getPopupContainer={() => document.getElementsByClassName('c_user')[0]} placeholder="请选择需要创建契约的用户">
                                <Option value="jack">Jack</Option>
                                <Option value="lucy">Lucy</Option>
                                <Option value="Yiminghe">yiminghe</Option>
                            </Select>
                        </li>
                        <li className="c_contractType">
                            <span className="c_aa_left_text">契约类型：</span>
                            <Select className="c_aa_marg" size="large" style={{ width: 280 }} onChange={(value)=>{this.onSelectSys(value)}} getPopupContainer={() => document.getElementsByClassName('c_contractType')[0]} placeholder="请选择需要创建契约的系统">
                                <Option value="0">日工资契约</Option>
                                <Option value="1">分红契约</Option>
                                <Option value="2">奖金组契约</Option>
                                <Option value="3">配额契约</Option>
                            </Select>
                        </li>

                    </ul>
                    {this.contractType()}
                </div>
            </Modal>
        )
    }
}
