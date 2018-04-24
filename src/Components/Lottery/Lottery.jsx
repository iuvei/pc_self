import React, {Component} from 'react';
import {observer} from 'mobx-react';

import './Lottery.scss';

import RightSider from './RightSider/RightSider';
import RightPlug from './../Common/RightPlug/RightPlug';
import ContentMian from './ContentMain/ContentMian';
import {stateVar} from "../../State";

import url1 from "./sound/kaijiang.mp3";
import url1a from "./sound/kaijiang.ogg";
import url2 from "./sound/fengdan.mp3";
import url2a from "./sound/fengdan.ogg";
import url3 from "./sound/minute1.mp3";
import url3a from "./sound/minute1.ogg";

@observer
export default class Lottery extends Component {
    render() {
        return (
            <div className={`main theme-${stateVar.activeTheme}`}>
                <div className='all_bet'>
                    <ContentMian key="ContentMian"/>
                    <RightSider key="RightSider"/>
                </div>
                <audio preload='meta' id='kjsound' controls="controls" style={{width: 0, height: 0}}>
                    <source src={url1}></source>
                    <source src={url1a}></source>
                </audio>
                <audio preload='meta' id='fengdansound' controls="controls" style={{width: 0, height: 0}}>
                    <source src={url2}></source>
                    <source src={url2a}></source>
                </audio>
                <audio preload='meta' id='minutesound' controls="controls" style={{width: 0, height: 0}}>
                    <source src={url3}></source>
                    <source src={url3a}></source>
                </audio>
                <RightPlug/>
            </div>
        );
    }
}
