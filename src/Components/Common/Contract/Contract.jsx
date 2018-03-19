/*契约*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Button, Modal, Select } from 'antd';
const Option = Select.Option;
import common from '../../../CommonJs/common';
import { stateVar } from '../../../State';

import './Contract.scss';

@observer
export default class Contract extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    /*修改契约*/
    onAffirm() {
        let contract_name = this.props.contract_name;
        this.props.onAffirm(contract_name);
    };
    /*取消关闭modal*/
    onCancel(){
        this.props.onCancel(this.props.contract_name);
    };
    /*是否已签订*/
    isSign() {
        let { disabled, alterData } = this.props;
        if(alterData.daily_salary_status == 1 || alterData.dividend_salary_status == 1 || alterData.useraccgroup_status == 1){
            return disabled ? 'a_c_name a_c_active' : 'a_c_name';
        }else{
            return disabled ? 'a_c_name a_c_active' : 'a_c_name';
        }
    };
    /*按钮*/
    onBtn(){
      const { alterData, hideBtn } = this.props;
      if(hideBtn){
          return (
              <div className="a_c_btn_one">
                  <Button onClick={()=>this.onCancel()}>关闭</Button>
              </div>
          )
      }else{
          if(alterData.buttons != undefined && alterData.buttons[1].text == '同意协议'){
              return (
                  <div className="a_c_btn">
                      <Button loading={this.props.affirmLoading}
                              onClick={()=>this.props.onConsent()}
                              type="primary"
                              className="a_c_cancel_btn"
                      >
                          同意
                      </Button>
                      <Button onClick={()=>this.onCancel()}
                      >
                          关闭
                      </Button>
                  </div>
              )
          }else if(stateVar.userInfo.userName == alterData.username){
              return (
                  <div className="a_c_btn_one">
                      <Button onClick={()=>this.onCancel()}>关闭</Button>
                  </div>
              )
          }else{
              return (
                  <div className="a_c_btn">
                      <Button loading={this.props.affirmLoading}
                              onClick={()=>this.onAffirm()}
                              type="primary"
                              className="a_c_cancel_btn"
                      >
                          确认修改
                      </Button>
                      <Button onClick={()=>this.onCancel()}
                      >
                          关闭
                      </Button>
                  </div>
              )
          }
      }
    };

    onSelectUser(item){
        this.props.onSelectUser(item, 'child')
    };
    onSelectSys(value){
        this.props.onSelectSys(value)
    };
    render() {
        const { alterData, title, alterVisible, textDescribe, userList, contractInfo, disabledSelect, userid } = this.props;

        return (
            <Modal
                visible={alterVisible}
                wrapClassName="vertical-center-modal"
                footer={null}
                maskClosable={false}
                closable={false}
                width={619}
                className="alter_dividend"
            >
                <div className="alter_content clear">
                    <ul className="a_c_list">
                        <li className="user_p">
                            <span>用户名：</span>
                            <Select
                                    showSearch
                                    labelInValue
                                    size="large" style={{ width: 275 }}
                                    onChange={(value)=>{this.onSelectUser(value)}}
                                    value={{ key: userid }}
                                    // defaultValue = {{ key: userid }}
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
                                    onChange={(value)=>{this.onSelectSys(value)}}
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
                    <div>
                        {textDescribe}
                        <div className="a_c_name a_c_active">
                            <p>{alterData.username}</p>
                            <p>{common.setDateTime(0)}</p>
                        </div>
                    </div>
                    {
                        this.onBtn()
                    }
                </div>
            </Modal>
        )
    }
}
