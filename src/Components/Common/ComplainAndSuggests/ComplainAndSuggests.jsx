/*投诉与建议模态框*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Button,Modal ,Input,message} from 'antd';
import 'whatwg-fetch'
import Fetch from '../../../Utils';
import './ComplainAndSuggests.scss';
import { stateVar } from '../../../State';
/*数据提交成功显示信息*/
const success = (value) => {
    message.success(value);
};
/*数据提交失败显示信息*/
const error = (value) => {
    message.error(value);
};

@observer
export default class ComplainAndSuggests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,  //控制模态框的显示
            loading:false,   //控制提交按钮的提交状态
            titleLength:0,      //控制标题的长度< 15
            txtLength:0,     //控制输入内容的长度 <1000
            complainTitle:null,      //投诉的标题
            complainContent:null,     //投诉的内容
        }
    };
    /*提交投诉标题以及内容
    * 验证标题和内容是否为空
    * 优化网络请求
    * 显示后台返回数据
    * */
    onSubmit= () => {
        this.setState({
            loading:true,
        });
        if(!(this.state.titleLength>0&&this.state.txtLength>0)){
            error("不能为空！");
            this.setState({
                loading:false,
            });
        }else{
            Fetch.complainAndSuggests({method: "POST",
                body: JSON.stringify({
                    userid: stateVar.userInfo.userId,
                    title:this.state.complainTitle,
                    content:this.state.complainContent,
                })}).then((data)=> {
                if (this._ismount) {
                    this.setState({
                        loading:false,
                    });
                    if (data.status == 200) {
                        this.props.hideTousuModal();
                        success(data.shortMessage);
                    }else{
                        error(data.shortMessage);
                    }
                }
            });
        }

    };
    /*点击×关闭莫泰框*/
    handleCancel = (e) => {
        this.props.transferMsg(false);
    };
    /*通过文本框的默认事件获取输入内容的长度*/
    onChangeTxt(e){
        this.setState({
            complainContent:e.target.value,
            txtLength:e.target.value.length,
        });
    };
    /*通过input的默认事件获取输入内容的长度*/
    onChangeTitle(e){
        this.setState({
            complainTitle:e.target.value,
            titleLength:e.target.value.length,
        });
    }
    /*监听文本输入框的键盘按下事件，当文字数>1000,只可以删除，不能输入*/
    onLimitTxtLen(e){
        if(this.state.txtLength>=1000){
            if(!(e.keyCode==8||e.keyCode==46))
                e.preventDefault();
        }
    }
    /*监听input的键盘按下事件，当文字数>15,只可以删除，不能输入*/
    onLimitTitleLen(e){
        if(this.state.titleLength>=15){
            if(!(e.keyCode==8||e.keyCode==46))
                e.preventDefault();
        }
    }
    componentDidMount() {
        this._ismount = true;
    }
    componentWillUnmount(){
        this._ismount = false;
    }
    render() {
        return (
            <Modal
                title={this.props.title}
                visible={this.props.visible}
                wrapClassName="complain-modal"
                onCancel={this.handleCancel}
                maskClosable={false}
                footer={null}
            >
                <ul className='complain_main'>
                   <li>
                       标题
                       <Input placeholder="" onChange={(e)=>{this.onChangeTitle(e)}} onKeyDown={(e)=>{this.onLimitTitleLen(e)}} />
                   </li>
                    <li>
                        内容
                        <textarea rows="3" cols="20" className='complain_textarea' onChange={(e)=>{this.onChangeTxt(e)}} onKeyDown={(e)=>{this.onLimitTxtLen(e)}}>

                        </textarea>
                        <div className='c_tip'>{this.state.txtLength}/1000</div>
                    </li>

                    <div className='btn_group'>
                        <Button  type="primary"  onClick={()=>{this.onSubmit()}} loading={this.state.loading}>
                            提交
                        </Button>
                        <span className='c_warn_txt'>(每位用户每天最多提交3次)</span>
                    </div>
                </ul>


            </Modal>
        )
    }
}

