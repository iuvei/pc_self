import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../../Utils';
import './HowDeposit.scss';
@observer
export default class HowDeposit extends Component {
    constructor(props){
        super(props);
        this.state = {
            navListIndex: 0, //控制显示模块
            list: [],
        }
    };
    componentDidMount() {
        this._ismount = true;
        this.getHowDeposit();
    };
    componentWillUnmount(){
        this._ismount = false;
    }
    /*获取如何存款数据*/
   getHowDeposit() {
       Fetch.howDeposit({
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
            <div className="howDeposit_main">
                <ul className="h_select_list">
                    {
                        list.map((item, index)=>{
                            return <li className={navListIndex == index ? 'h_select_list_active' : ''}
                                       onClick={() => {this.setState({navListIndex: index})}} key={item.tagname}>{item.tagname}</li>
                        })
                    }
                </ul>
                {
                    list.map((itm, ind) => {
                        return (
                            <div className="zhaohang" dangerouslySetInnerHTML={{__html: itm.content}} style={{display: navListIndex == ind ? 'block' : 'none'}} key={ind} ></div>
                        )
                    })
                }
            </div>
        );
    }
}
