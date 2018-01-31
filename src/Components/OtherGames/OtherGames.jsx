import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Row, Col, Button, Pagination  } from 'antd';
import { hashHistory } from 'react-router';
import Fetch from '../../Utils';
import './OtherGames.scss'

import activity01 from './Img/activity01.png';
import activity02 from './Img/activity02.png';
import activity03 from './Img/activity03.png';
import activity04 from './Img/activity04.png';
import activity_apply from './Img/activity_apply.png';
import activity_conduct from './Img/activity_conduct.png';

const otherGamesArr = [
    {
        name: '博饼',
        link: '/otherGames/bobing',
        id: 'bb',
        imgUrl: activity01,
        disabled: true,
        activityTime: '活动时间：2017年11月01日02:00:00 - 12月01日02:00:00',
        activeBonus: '最高奖金：10000元',
    },{
        name: 'EA娱乐城',
        link: '/otherGames/ea',
        id: 'ea',
        disabled: true,
        imgUrl: activity02,
        activityTime: '活动时间：2017年11月01日02:00:00 - 12月01日02:00:00',
        activeBonus: '最高奖金：10000元',
    },{
        name: 'PT游戏',
        link: '/otherGames/pt',
        id: 'pt',
        disabled: true,
        imgUrl: activity03,
        activityTime: '活动时间：2017年11月01日02:00:00 - 12月01日02:00:00',
        activeBonus: '最高奖金：10000元',
    },{
        name: 'GT',
        link: '/otherGames/gt',
        id: 'gt',
        disabled: true,
        imgUrl: activity04,
        activityTime: '活动时间：2017年11月01日02:00:00 - 12月01日02:00:00',
        activeBonus: '最高奖金：10000元',
    },{
        name: '体育',
        link: '/otherGames/sport',
        id: 'sport',
        disabled: true,
        imgUrl: activity04,
        activityTime: '活动时间：2017年11月01日02:00:00 - 12月01日02:00:00',
        activeBonus: '最高奖金：10000元',
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
                    <Col span={22}>
                        <ul className="activity_list clear">
                            {
                                otherGamesArr.map((item)=>{
                                    return (
                                        <li key={item.name}>
                                            <img src={item.imgUrl} alt="活动"/>
                                            <img className="activity_apply" src={ activity_apply } alt=""/>
                                            <div className="activity_participation clear">
                                                <div className="left">
                                                    <p>
                                                        {item.name}
                                                        <span className="active_bonus">{item.activeBonus}</span>
                                                    </p>
                                                    <i>{item.activityTime}</i>
                                                </div>
                                                <Button className="right"
                                                        onClick={()=>this.onHashHistory(item)} type="primary" size="large"
                                                        disabled={item.disabled}
                                                >
                                                    立即参与
                                                </Button>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>

                        {/*<div className="active_pagination">*/}
                            {/*<Pagination defaultCurrent={1} pageSize={4} total={8} />*/}
                        {/*</div>*/}
                    </Col>
                </Row>
            </div>
        )
    }
}
