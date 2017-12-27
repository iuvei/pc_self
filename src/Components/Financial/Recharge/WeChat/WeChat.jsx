/*微信*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';

@observer
export default class WeChat extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {
        return (
            <div>
                WeChat
            </div>
        )
    }
}
