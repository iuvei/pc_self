import React, {Component} from 'react';
import {observer} from 'mobx-react';
import 'whatwg-fetch'
import Fetch from '../../../Utils';
import './PlayMethodIntroduce.scss';
@observer
export default class PlayMethodIntroduce extends Component {
    constructor(props){
        super(props);
        this.state = {
            navListIndex: 0, //控制显示模块
            shishicaiTable: null,
            fucaiTable: null,
            pailieTable: null,
            shiyixuanwu: null,
            beijingkuaile: null,
            bobing: null
        }
    };

    /*获取玩法介绍数据*/
    getPlayMethod() {

        Fetch.playMethod({
            method: "POST"
        }).then((data) => {

            if (data.status == 200) {
                this.setState({
                    shishicaiTable: data.repsoneContent[0].content,
                    fucaiTable: data.repsoneContent[1].content,
                    pailieTable: data.repsoneContent[2].content,
                    shiyixuanwuTable: data.repsoneContent[3].content,
                    beijingkuaileTable: data.repsoneContent[4].content,
                    bobingTable: data.repsoneContent[5].content
                });
            }
        });
    }
    /*改变界面导航条内容*/

    changePlayMethod() {
        if(this.state.shishicaiTable == null){
            return '';
        }

        var  ul_0 = <p className="shishicai" dangerouslySetInnerHTML={{__html: this.state.shishicaiTable}}/>
        var ul_1 = <div className="fucai" dangerouslySetInnerHTML={{__html: this.state.fucaiTable}}></div>
        var ul_2 = <div className="pailie" dangerouslySetInnerHTML={{__html: this.state.pailieTable}}></div>
        var ul_3 = <div className="shiyixuanwu" dangerouslySetInnerHTML={{__html: this.state.shiyixuanwuTable}}></div>
        var ul_4 = <div className="beijingkuaile" dangerouslySetInnerHTML={{__html: this.state.beijingkuaileTable}}></div>
        var ul_5 = <div className="bobing" dangerouslySetInnerHTML={{__html: this.state.bobingTable}}></div>
        switch (this.state.navListIndex) {

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
            case 4:
                return ul_4;
                break;
            case 5:
                return ul_5;
                break;

        }
    }
    componentDidMount() {
        this.getPlayMethod();
    };

    render() {
        const navList = ['时时彩', '福彩3D', '排列三', '十一选五', '北京快乐8', '博饼'];
        return (
            <div className="playMethod_main">
                <ul className="p_select_list">
                    {
                        navList.map((value, index)=>{
                            return <li className={this.state.navListIndex == index ? 'p_select_list_active' : ''}
                                       onClick={() => {this.setState({navListIndex: index})}} key={index}>{value}</li>
                        })
                    }

                </ul>

                {this.changePlayMethod()}

            </div>
        );
    }
}
