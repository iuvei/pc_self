/*资金帐变*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';

import CommonSelect from '../Common/CommonSelect'

@observer
export default class AccountChange extends Component {
    render() {
        const columns = [
            {
                title: '账变编号',
                dataIndex: 'name',
            }, {
                title: '用户名',
                dataIndex: 'age',
            }, {
                title: '时间',
                dataIndex: 'address',
            }, {
                title: '类型',
                key: 'action',
            }, {
                title: '收入',
                key: 'action1',
            }, {
                title: '支出',
                key: 'action2',
            }, {
                title: '金额',
                key: 'action5',
            },{
                title: '状态',
                key: 'action3',
            }, {
                title: '备注',
                key: 'action4',
            }
        ];
        const data = [
            {
                key: '1',
                name: 'John Brown',
                age: 32,
                address: 'New York No. 1 Lake Park',
            }, {
                key: '2',
                name: 'Jim Green',
                age: 42,
                address: 'London No. 1 Lake Park',
            }, {
                key: '3',
                name: 'Joe Black',
                age: 32,
                address: 'Sidney No. 1 Lake Park',
            }
        ];
        const footer = ['总收入', '总支出'];
        return (
            <div>
                <CommonSelect columns={columns} data={data} footer={footer}/>
            </div>
        );
    }
}
