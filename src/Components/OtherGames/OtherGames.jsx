/*综合游戏*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Row, Col, Button, Modal } from 'antd';
import { stateVar } from '../../State';
import { hashHistory } from 'react-router';
import Fetch from '../../Utils';
import './OtherGames.scss'

const allBalance = stateVar.allBalance;
const otherGamesArr = [
    {
        name: '博饼',
        link: '/otherGames/bobing',
        id: 'bb',
        disabled: true,
        money: allBalance.bobingBalance,
    },{
        name: 'EA娱乐城',
        link: '/otherGames/ea',
        id: 'ea',
        disabled: true,
        money: allBalance.eabalance,
    },{
        name: 'PT游戏',
        link: '/otherGames/pt',
        id: 'pt',
        disabled: true,
        money: allBalance.ptbalance,
    },{
        name: 'GT娱乐城',
        link: '/otherGames/gt',
        id: 'gt',
        disabled: true,
        money: allBalance.kgbalance,
    },{
        name: '体育竞技',
        link: '/otherGames/sport',
        id: 'sport',
        disabled: true,
        money: allBalance.sbbalance,
    }
];
@observer
export default class OtherGames extends Component {
    constructor(props) {
        super(props);
        this.state = {
            otherGamesArr: otherGamesArr,
        };
    };
    componentDidMount(){
        this._ismount = true;
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    onHashHistory(item) {
        if(item.id == 'bb'){
            this.onBobing(item.link);
        }else if(item.id == 'ea'){
            this.onEa(item.link);
        }else if(item.id == 'pt'){
            this.onPt(item.link);
        }else if(item.id == 'gt'){
            this.onGt(item.link);
        }else if(item.id == 'sport'){
            this.onSport(item.link);
        }else{}
    };
    /*是否有权限进入Ea*/
    onEa(link) {
        Fetch.eagame({
            method: 'POST'
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200){
                    hashHistory.push(link);
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*是否有权限进入pt*/
    onPt(link) {
        Fetch.ptindex({
            method: 'POST',
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200){
                    hashHistory.push(link);
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*是否有权限进入体育竞技*/
    onSport(link){
        Fetch.sport({
            method: 'POST',
            body: JSON.stringify({"do":"login"})
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200){
                    hashHistory.push(link);
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*是否有权限进入GT娱乐*/
    onGt(link){
        Fetch.gtLogin({
            method: 'POST'
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200){
                    hashHistory.push(link);
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*是否有权限进入博饼*/
    onBobing(link) {
        Fetch.newGetprizepool({
            method: 'POST'
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200){
                    hashHistory.push(link);
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    render() {
        const { otherGamesArr } = this.state;
        return (
            <div className="otherGames_main">
                <Row type="flex" justify="center" align="top" className="main_width" >
                    <Col span={24}>
                        <ul className="activity_list clear">
                            {
                                otherGamesArr.map((item)=>{
                                    return (
                                        <li key={item.name}>
                                            <img src={require('./Img/'+item.id+'.jpg')}/>
                                            <div className="activity_participation clear">
                                                <div className="left">
                                                    <p>{item.name}</p>
                                                    <p className="active_bonus">账户余额：{item.money} 元</p>
                                                </div>
                                                <Button className="right"
                                                        onClick={()=>this.onHashHistory(item)} type="primary" size="large"
                                                >
                                                    立即游戏
                                                </Button>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </Col>
                </Row>
            </div>
        )
    }
}
