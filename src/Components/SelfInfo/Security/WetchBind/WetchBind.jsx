import React, {Component} from 'react';
import {observer} from 'mobx-react';
import './WetchBind.scss';
import Fetch from '../../../../Utils';
let QRCode = require('qrcode.react');

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
            if(this._ismount && res.status === 200){
                this.setState({wechatUrl:res.repsoneContent.url});
            }else{
                Modal.warning({
                    title: res.shortMessage,
                });
            }
        })
    };
    render() {
        return (
            <div className='wetch_bind'>
                <QRCode value={this.state.wechatUrl}
                        size={200}
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                />
                <p>微信扫一扫，绑定微信</p>
            </div>
        )
    }
}
