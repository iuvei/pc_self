/*契约*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Button, Modal, Select } from 'antd';
const Option = Select.Option;
import common from '../../../CommonJs/common';

import './Contract.scss';

@observer
export default class Contract extends Component {
    constructor(props) {
        super(props);
    };
    render() {
        const { alterData, title, alterVisible, textDescribe, userList, contractInfo, disabledSelect ,isShowFoot} = this.props;
        return (
            <Modal
                title={"修改" + title}
                visible={alterVisible}
                wrapClassName="vertical-center-modal"
                destroyOnClose={true}
                footer={null}
                maskClosable={false}
                width={title == '日工资契约' ? 619 : 520}
                onCancel={()=>this.props.onCancel()}
                className="alter_dividend"
            >
                <div className="clear">
                    <ul className="a_c_list">
                        <li className="user_p">
                            <span>用户名：</span>
                            <Select
                                    showSearch
                                    labelInValue
                                    size="large" style={{ width: 275 }}
                                    onChange={(value)=>{this.props.onSelectUser(value, 'child')}}
                                    value={{ key: alterData.userid }}
                                    disabled={disabledSelect}
                                    optionFilterProp="children"
                                    getPopupContainer={() => document.getElementsByClassName('user_p')[0]}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {
                                    userList.map((item) => {
                                        return (
                                            <Option value={item.userid} key={item.username}>{item.username}</Option>
                                        )
                                    })
                                }
                            </Select>
                        </li>
                        <li className="type_p">
                            <span>契约类型：</span>
                            <Select size="large" style={{ width: 275 }}
                                    onChange={(value)=>{this.props.onSelectSys(value)}}
                                    value={title}
                                    disabled={disabledSelect}
                                    getPopupContainer={() => document.getElementsByClassName('type_p')[0]}
                            >
                                {
                                    contractInfo.map((item) => {
                                        return (
                                            <Option value={item.contract} key={''+item.id}>{item.contract}</Option>
                                        )
                                    })
                                }
                            </Select>
                        </li>
                    </ul>
                    <div className="clear">
                        {textDescribe}
                        <div className="a_c_name a_c_active right">
                            <p>{alterData.username}</p>
                            <p>{common.setDateTime(0)}</p>
                        </div>
                    </div>
                    <div className="a_c_btn" style={{display:(title == '日工资契约' && !isShowFoot) ? 'none' : ''}}>
                        <Button loading={this.props.affirmLoading}
                                onClick={()=>this.props.onAffirm('修改' ,alterData.username, title)}
                                type="primary"
                                className="a_c_cancel_btn"
                        >
                            确认修改
                        </Button>
                        <Button onClick={()=>this.props.onCancel()}
                        >
                            关闭
                        </Button>
                    </div>
                </div>
            </Modal>
        )
    }
}
