/*网银转账*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';

@observer
export default class EBank extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {
        return (
            <div>
                EBank
            </div>
        )
    }
}
