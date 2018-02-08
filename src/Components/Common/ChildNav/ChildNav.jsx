/*二级导航栏*/
import React, {PureComponent} from 'react';
import {observer} from 'mobx-react';
import {Link} from 'react-router';
import { stateVar } from '../../../State';
import './ChildNav.scss';

@observer
export default class ChildNav extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            // NavIndex: this.props.defaultIndex == undefined ? 0 : this.props.defaultIndex,
        };
    };
    componentDidMount(){
        stateVar.childNavIndex = this.props.defaultIndex == undefined ? 0 : this.props.defaultIndex;
    }
    handClick(index, item) {
        // this.setState({NavIndex: index});
        stateVar.childNavIndex = index;
        this.props.onChangeNavIndex(index, item);
    };
    /*选中项*/
    onSelectClass(index) {
        if(this.props.defaultIndex != undefined){
            return index == this.props.defaultIndex ? 'nav_active' : '';
        }else{
            return index == stateVar.childNavIndex ? 'nav_active' : '';
        }
    }

    render() {
        return (
            <div className="c_nav">
                <ul className="nav_list clear">
                    {
                        this.props.navList.map((item, index)=>{
                            return (
                                <li className={this.onSelectClass(index)} onClick={()=>{this.handClick(index, item)}} key={index}>
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
