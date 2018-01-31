/*绑定邮箱*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Input,Button, Modal } from 'antd';
import Fetch from '../../../../Utils';
import { stateVar } from '../../../../State';
import { onValidate } from '../../../../CommonJs/common';

@observer
export default class BindingEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailLoading: false,
            disabled: stateVar.userInfo.email == '' ? true : false,
            validate: {
                email: 2,// 0：对；1：错
            },
            postData: {
                flag: 'update', // 修改信息
                email: stateVar.userInfo.email,
            }
        };
    };
    componentDidMount() {
        this._ismount = true;
    };
    componentWillUnmount() {
        this._ismount = false;
    };
    /*提交*/
    onSubmitEmail(e) {
        let disabled = this.state.disabled,
            validate = this.state.validate,
            postData = this.state.postData;

        if(disabled){
            if(validate.email != 0) {
                return
            }
            this.setState({emailLoading: true});
            Fetch.changename({
                method: 'POST',
                body: JSON.stringify(postData),
            }).then((res)=>{
                if(this._ismount){
                    this.setState({emailLoading: false});
                    if(res.status == 200){
                        let _this = this;
                        Modal.success({
                            title: res.shortMessage,
                            onOk(){
                                validate.email = 2;
                                stateVar.userInfo.email = postData.email;
                                _this.setState({disabled: !disabled});
                            }
                        });
                    }else{
                        Modal.warning({
                            title: res.shortMessage,
                        });
                    }
                }
            })
        } else {
            this.setState({disabled: !disabled});
        }
    };
    /*正则验证邮箱*/
    onChangeEmail(e) {
        let value = e.target.value,
            postData = this.state.postData,
            validate = this.state.validate;
        postData.email = value;
        if (value != '') {
            let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            let r = reg.test(value);
            if (r) {
                validate.email = 0;
            } else {
                validate.email = 1;
            }
        }else{
            validate.email = 0;
        }
        this.setState({
            validate: validate,
            postData: postData,
        });
    };

    render() {
        const userInfo = stateVar.userInfo;
        const disabled = this.state.disabled;
        const postData = this.state.postData;
        return (
            <div  className="sec_k_main clear">
                {
                    <ul className="sec_k_list">
                        <li >
                            <span className="sec_k_left">{userInfo.email != '' && !disabled ? '已绑定邮箱：' :  '输入您的邮箱：'}</span>
                            <Input size="large" placeholder="请输入您的邮箱"
                                   disabled={ userInfo.email != '' && !disabled}
                                   value={postData.email}
                                   onChange={(e)=>this.onChangeEmail(e)}
                                   className={onValidate('email', this.state.validate)}

                            />
                        </li>
                        <li className="s_m_primary_btn">
                            <span className="sec_k_left"></span>
                            <Button type="primary" size="large"  className='sec_m_btn' loading={this.state.emailLoading} onClick={(e)=>{this.onSubmitEmail(e)}}>
                                {disabled ? '提交' : '修改'}
                            </Button>
                        </li>
                    </ul>
                }

            </div>
        )
    }
}
