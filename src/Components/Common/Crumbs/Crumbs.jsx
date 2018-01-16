/*面包屑导航*/
import React, {PureComponent} from 'react';
import {observer} from 'mobx-react';

import './Crumbs.scss';

@observer
export default class Crumbs extends PureComponent {
    /*点击面包屑导航*/
    onCrumbsName(item, i) {
        if(this.props.table.history.length-1 === i){
            return
        }
        let table = this.props.table;
        table.history.splice(i+1, table.history.length);
        this.props.onChildState(item, table);
    }

    render() {
        let history = this.props.table.history;
        return (
            <ul className="crumbs">
                <li style={{display: history.length > 5 ? '' : 'none'}}>···</li>
                {
                    history.map((item,i)=>{

                        return (
                            <li key={item.name} style={{display: history.length - i > 5 ? 'none' : ''}} onClick={()=>{this.onCrumbsName(item, i)}}>{item.name}</li>
                        )
                    })
                }
            </ul>
        )
    }
}
