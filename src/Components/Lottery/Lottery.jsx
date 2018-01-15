import React, {Component} from 'react';
import {observer} from 'mobx-react';
import QueueAnim from 'rc-queue-anim';

import './Lottery.scss';

import RightSider from './RightSider/RightSider';
import ContentMian from './ContentMain/ContentMian';

var url1 = require("./sound/kaijiang.mp3");
var url1a = require("./sound/kaijiang.ogg");
var url2 = require("./sound/fengdan.mp3");
var url2a = require("./sound/fengdan.ogg");
var url3 = require("./sound/minute1.mp3");
var url3a = require("./sound/minute1.ogg");
@observer
export default class Lottery extends Component {
    render() {
        return (
        	<div className='main'>
	            <div className='all_bet'>
	                <ContentMian key="ContentMian"/>
	                <RightSider key="RightSider"/>
	            </div>
	            <audio preload='meta' id='kjsound' controls="controls" style={{width:0,height:0}}>
	            	<source src={url1}></source>
	            	<source src={url1a}></source>
	            </audio>
	            <audio preload='meta' id='fengdansound' controls="controls" style={{width:0,height:0}}>
		            <source src={url2}></source>
		            <source src={url2a}></source>
	            </audio>
	            <audio preload='meta' id='minutesound' controls="controls" style={{width:0,height:0}}>
	            	<source src={url3}></source>
	            	<source src={url3a}></source>
	            </audio>
            </div>
        );
    }
}
