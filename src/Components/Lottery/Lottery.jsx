import React, {Component} from 'react';
import {observer} from 'mobx-react';

import './Lottery.scss';

import RightSider from './RightSider/RightSider';
import RightPlug from './../Common/RightPlug/RightPlug';
import ContentMian from './ContentMain/ContentMian';
import {stateVar} from "../../State";

const url1 = require("./sound/kaijiang.mp3");
const url1a = require("./sound/kaijiang.ogg");
const url2 = require("./sound/fengdan.mp3");
const url2a = require("./sound/fengdan.ogg");
const url3 = require("./sound/minute1.mp3");
const url3a = require("./sound/minute1.ogg");
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
