/*综合游戏*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Row, Col, Button} from 'antd';
import { stateVar } from '../../State';
import { hashHistory } from 'react-router';
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
        name: 'KGAME游戏',
        link: '/otherGames/kgame',
        id: 'kgame',
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
            activeItem: {},
        };
    };
    componentDidMount(){
        this._ismount = true;
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    onHashHistory(item) {
        // let {otherGamesArr} = this.state;
        hashHistory.push(item.link);

        // otherGamesArr.forEach(function(items){
        //     if(items['id']==item.id){
        //         items['disabled'] = false;
        //     }
        // });
        //
        // this.setState({activeItem: item, otherGamesArr});
        // if(item.id == 'bb'){
        //     this.onBobing(item);
        // }else if(item.id == 'ea'){
        //     this.onEa(item);
        // }else if(item.id == 'pt'){
        //     this.onPt(item);
        // }else if(item.id == 'kgame'){
        //     this.onGt(item);
        // }else if(item.id == 'sport'){
        //     this.onSport(item);
        // }else{}
    };
    //
    // onForEach(item){
    //     let {otherGamesArr} = this.state;
    //     otherGamesArr.forEach(function(items){
    //         if(items['id']==item.id){
    //             items['disabled'] = true;
    //         }
    //     });
    //     this.setState({otherGamesArr});
    // };

    render() {
        const { otherGamesArr } = this.state;
        return (
            <div className={`otherGames_main theme-${stateVar.activeTheme}`}>
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
                                                        loading={!item.disabled}
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
