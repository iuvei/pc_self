import React, {Component} from 'react';
import {observer} from 'mobx-react';
import 'whatwg-fetch'
import Fetch from '../../../Utils';
import './HowDeposit.scss';
@observer
export default class HowDeposit extends Component {
    constructor(props){
        super(props);
        this.state = {
            navListIndex: 0, //控制显示模块
            gonghangContent: null, //工行显示内容
            jianhangContent: null, //建行显示内容
            nonghangContent: null, //农行显示内容
            nongkuahangContent: null, //农行跨行显示内容
            zhaohangContent: null //招行显示内容
        }
    };

    /*获取如何存款数据*/
   getHowDeposit() {

       Fetch.howDeposit({
           method: "POST"
       }).then((data) => {
           if (data.status == 200) {
               this.setState({
                   gonghangContent: data.repsoneContent[0].content,
                   jianhangContent: data.repsoneContent[1].content,
                   nonghangContent: data.repsoneContent[2].content,
                   nongkuahangContent: data.repsoneContent[3].content,
                   zhaohangContent: data.repsoneContent[4].content
               });
           }
       });
   }
    /*改变界面导航条内容*/

  changeHowDeposit() {
      if(this.state.gonghangContent == null){
          return '';
      }

      var ul_0 = <div className="zhaohang" dangerouslySetInnerHTML={{__html: this.state.gonghangContent}}></div>
      var ul_1 = <div className="zhaohang" dangerouslySetInnerHTML={{__html: this.state.jianhangContent}}></div>
      var ul_2 = <div className="zhaohang" dangerouslySetInnerHTML={{__html: this.state.nonghangContent}}></div>
      var ul_3 = <div className="zhaohang" dangerouslySetInnerHTML={{__html: this.state.nongkuahangContent}}></div>
      var ul_4 = <div className="zhaohang" dangerouslySetInnerHTML={{__html: this.state.zhaohangContent}}></div>
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

        }
    }
    componentDidMount() {
        this.getHowDeposit();
    };

    render() {
        const navList = ['工行', '建行', '农行', '农行(跨行)', '招行'];
        return (
            <div className="howDeposit_main">
                <ul className="h_select_list">
                    {
                        navList.map((value, index)=>{
                            return <li className={this.state.navListIndex === index ? 'h_select_list_active' : ''}
                                       onClick={() => {this.setState({navListIndex: index})}} key={index}>{value}</li>
                        })
                    }

                </ul>

               {this.changeHowDeposit()}

            </div>
        );
    }
}
