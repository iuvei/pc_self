/*二级导航栏*/
import React, {PureComponent} from 'react';
import {observer} from 'mobx-react';
import {Link} from 'react-router';
import './ChildNav.scss'

@observer
export default class ChildNav extends PureComponent {
    constructor(props) {
        super(props);
    };
    handClick(index) {
        this.props.onChangeNavIndex(index);
    };
    render() {
        return (
            <div className="c_nav">
                <ul className="nav_list clear">
                    {
                        this.props.navList.map((item, index)=>{
                            return (
                                <li className={index === this.props.defaultIndex ? 'nav_active' : 'hvr-overline-from-left hvr-fade'} onClick={()=>{this.handClick(index)}} key={index}>

                                    {
                                        item.link != undefined ?
                                            <Link to={item.link}>{item.text}</Link> :
                                            <a href="javascript:void(0)">{item.name}</a>
                                    }
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}
