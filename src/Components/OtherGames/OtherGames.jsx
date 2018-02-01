import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Row, Col, Button  } from 'antd';
import { stateVar } from '../../State';
import { hashHistory } from 'react-router';
import Fetch from '../../Utils';
import './OtherGames.scss'

const otherGamesArr = [
    {
        name: '博饼',
        link: '/otherGames/bobing',
        id: 'bb',
        disabled: true,
        money: '0.00',
    },{
        name: 'EA娱乐城',
        link: '/otherGames/ea',
        id: 'ea',
        disabled: true,
        money: '0.00',
    },{
        name: 'PT游戏',
        link: '/otherGames/pt',
        id: 'pt',
        disabled: true,
        money: '0.00',
    },{
        name: 'GT娱乐城',
        link: '/otherGames/gt',
        id: 'gt',
        disabled: true,
        money: '0.00',
    },{
        name: '体育竞技',
        link: '/otherGames/sport',
        id: 'sport',
        disabled: true,
        money: '0.00',
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
        this.onGt();
        this.onEa();
        this.onPt();
        this.onSport();
        this.onBobing();
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    onHashHistory(item) {
        hashHistory.push(item.link);
    };
    /*是否有权限进入Ea*/
    onEa() {
        Fetch.eagame({
            method: 'POST'
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200){
                    let { otherGamesArr } = this.state;
                    for(let i = 0; i < otherGamesArr.length; i++){
                        if(otherGamesArr[i].id == 'ea'){
                            otherGamesArr[i].money = stateVar.allBalance.eabalance;
                            otherGamesArr[i].disabled = false;
                            break;
                        }
                    }
                    this.setState({otherGamesArr})
                }
            }
        })
    };
    /*是否有权限进入pt*/
    onPt() {
        Fetch.ptindex({
            method: 'POST',
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200){
                    let { otherGamesArr } = this.state;
                    for(let i = 0; i < otherGamesArr.length; i++){
                        if(otherGamesArr[i].id == 'pt'){
                            otherGamesArr[i].money = stateVar.allBalance.ptbalance;
                            otherGamesArr[i].disabled = false;
                            break;
                        }
                    }
                    this.setState({otherGamesArr})
                }
            }
        })
    };
    /*是否有权限进入体育竞技*/
    onSport(){
        Fetch.sport({
            method: 'POST',
            body: JSON.stringify({"do":"login"})
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200){
                    let { otherGamesArr } = this.state;
                    for(let i = 0; i < otherGamesArr.length; i++){
                        if(otherGamesArr[i].id == 'sport'){
                            otherGamesArr[i].money = stateVar.allBalance.sbbalance;
                            otherGamesArr[i].disabled = false;
                            break;
                        }
                    }
                    this.setState({otherGamesArr})
                }
            }
        })
    };
    /*是否有权限进入GT娱乐*/
    onGt(){
        Fetch.gtLogin({
            method: 'POST'
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200){
                    let { otherGamesArr } = this.state;
                    for(let i = 0; i < otherGamesArr.length; i++){
                        if(otherGamesArr[i].id == 'gt'){
                            otherGamesArr[i].money = stateVar.allBalance.kgbalance;
                            otherGamesArr[i].disabled = false;
                            break;
                        }
                    }
                    this.setState({otherGamesArr})
                }
            }
        })
    };
    /*是否有权限进入博饼*/
    onBobing() {
        Fetch.newGetprizepool({
            method: 'POST'
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200){
                    let { otherGamesArr } = this.state;
                    for(let i = 0; i < otherGamesArr.length; i++){
                        if(otherGamesArr[i].id == 'bb'){
                            otherGamesArr[i].money = stateVar.allBalance.bobingBalance;
                            otherGamesArr[i].disabled = false;
                            break;
                        }
                    }
                    this.setState({otherGamesArr})
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
                                                        disabled={item.disabled}
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
