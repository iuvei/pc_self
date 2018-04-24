import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../../Utils';
import './PlayMethodIntroduce.scss';
@observer
export default class PlayMethodIntroduce extends Component {
    constructor(props){
        super(props);
        this.state = {
            navListIndex: 0, //控制显示模块
            list: [],
        }
    };
    componentDidMount() {
        this._ismount = true;
        this.getPlayMethod();
    };
    componentWillUnmount(){
        this._ismount = false;
    }
    /*获取玩法介绍数据*/
    getPlayMethod() {
        Fetch.playMethod({
            method: "POST"
        }).then((res) => {
            if(this._ismount){
                if (res.status == 200) {
                    this.setState({
                        list: res.repsoneContent,
                    });
                }
            }
        });
    }

    render() {
        const {list, navListIndex} = this.state;
        return (
            <div className="playMethod_main">
                <ul className="p_select_list">
                    {
                        list.map((item, index)=>{
                            return <li className={navListIndex == index ? 'p_select_list_active' : ''}
                                       onClick={() => {this.setState({navListIndex: index})}} key={item.tagname}>{item.tagname}</li>
                        })
                    }

                </ul>
                {
                    list.map((itm, ind) => {
                        return (
                            <div className="table_play" dangerouslySetInnerHTML={{__html: itm.content}} style={{display: navListIndex == ind ? 'block' : 'none'}} key={ind} ></div>
                        )
                    })
                }
            </div>
        );
    }
}
