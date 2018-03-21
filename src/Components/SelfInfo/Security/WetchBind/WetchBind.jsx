import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Modal } from 'antd';
import './WetchBind.scss';
import Fetch from '../../../../Utils';
import { _code } from '../../../../CommonJs/common';

@observer
export default class WetchBind extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	wechatUrl:''
        };
    };
	componentDidMount() {
        this._ismount = true;
        this.getData();
    };
    getData(){
    	Fetch.wechatbind({
            method:'POST',
            body: JSON.stringify({tag:"getWechatUrl"}),
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200){
                    _code('wetch_bind', res.repsoneContent.url, 250, 220);
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    render() {
        return (
            <div className='wetch_bind'>
                <div id="wetch_bind"></div>
                <p>微信扫一扫，绑定微信</p>
            </div>
        )
    }
}
