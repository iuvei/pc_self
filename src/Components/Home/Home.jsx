import React, {Component} from 'react';
import {observer} from 'mobx-react';
import './Home.scss'

import HomeMainTop from './HomeMainTop/HomeMainTop'
import HomeMainLottery from './HomeMainLottery/HomeMainLottery'
import HomeMainActive from './HomeMainActive/HomeMainActive'
import HomeMainBottom from './HomeMainBottom/HomeMainBottom'
import HomeMainLeft from './HomeMainLeft/HomeMainLeft'

@observer
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    };
    shouldComponentUpdate(){
        return (this.props.router.location.action === 'PUSH')
    };
    componentDidMount() {

    };



    render() {
        const main = [
            <HomeMainTop key="HomeMainTop"/>,
            <HomeMainLottery key="HomeMainLottery"/>,
            <HomeMainActive key="HomeMainActive"/>,
            <HomeMainBottom key="HomeMainBottom"/>,
            <HomeMainLeft key="HomeMainLeft"/>,
        ];
        return (
            <div className="home_main">
                {main}
            </div>
        )
    }
}
