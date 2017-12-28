/*二级导航栏*/
import React, {PureComponent} from 'react';
import {observer} from 'mobx-react';
import {Link} from 'react-router';
import './ChildNav.scss'

@observer
export default class ChildNav extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            NavIndex: this.props.defaultIndex == undefined ? 0 : this.props.defaultIndex,
        };
    };
    handClick(index, item) {
        this.setState({NavIndex: index});
        this.props.onChangeNavIndex(index, item);
    };
    componentWillMount(){
        this.props.NavIndex !== undefined ? this.setState({NavIndex: parseInt(this.props.NavIndex.navIndex)}) : null
    };
    shouldComponentUpdate(nextProps, nextState){
        (nextProps.NavIndex !== undefined && nextProps.NavIndex.navIndex !== undefined) ?
            this.setState({NavIndex: parseInt(nextProps.NavIndex.navIndex)}) :
            null;
       return true
    };
    render() {
        console.log(this.state.NavIndex)
        return (
            <div className="c_nav">
                <ul className="nav_list clear">
                    {
                        this.props.navList.map((item, index)=>{
                            return (
                                <li className={index == this.state.NavIndex ? 'nav_active' : 'hvr-overline-from-left hvr-fade'} onClick={()=>{this.handClick(index, item)}} key={index}>

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
