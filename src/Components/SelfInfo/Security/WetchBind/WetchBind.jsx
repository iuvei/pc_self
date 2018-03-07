import React, {Component} from 'react';
import {observer} from 'mobx-react';
import './WetchBind.scss';
let QRCode = require('qrcode.react');

@observer
export default class WetchBind extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {
        return (
            <div className='wetch_bind'>
                <QRCode value={'http://10.63.15.242/pcservice/_api/registerlink.php?key=7fa53b299661fda0e7cf6d06b6c4756a'}
                        size={200}
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                />
                <p>微信扫一扫，绑定微信</p>
            </div>
        )
    }
}
