[1mdiff --git a/src/Components/AutoLogin/AutoLogin.scss b/src/Components/AutoLogin/AutoLogin.scss[m
[1mindex 4e18ae3..9c5c112 100644[m
[1m--- a/src/Components/AutoLogin/AutoLogin.scss[m
[1m+++ b/src/Components/AutoLogin/AutoLogin.scss[m
[36m@@ -5,7 +5,7 @@[m [m$width_100: 100%;[m
 [m
 .autologin_main{[m
     canvas{[m
[31m-        background-image: radial-gradient(ellipse farthest-corner at center top, #000105 0%, #000105 100%);[m
[32m+[m[32m        background-image: radial-gradient(ellipse farthest-corner at center top, #000d4d 0%, #000105 100%);[m
         position: absolute;[m
     }[m
     .l_nav_top{[m
[1mdiff --git a/src/Components/Financial/MentionFillingRecord/MentionFillingRecord.jsx b/src/Components/Financial/MentionFillingRecord/MentionFillingRecord.jsx[m
[1mindex 8cb869c..ecd4951 100644[m
[1m--- a/src/Components/Financial/MentionFillingRecord/MentionFillingRecord.jsx[m
[1m+++ b/src/Components/Financial/MentionFillingRecord/MentionFillingRecord.jsx[m
[36m@@ -3,7 +3,7 @@[m [mimport React, {Component} from 'react';[m
 import {observer} from 'mobx-react';[m
 import Fetch from '../../../Utils';[m
 import { stateVar } from '../../../State';[m
[31m-import { setDateTime, disabledDate, datedifference } from '../../../CommonJs/common';[m
[32m+[m[32mimport { setDateTime, disabledDate } from '../../../CommonJs/common';[m
 import { DatePicker,  Button, Checkbox, Input, Select, Table, Pagination } from 'antd';[m
 import moment from 'moment';[m
 const Option = Select.Option;[m
[36m@@ -111,7 +111,7 @@[m [mexport default class MentionFillingRecord extends Component {[m
         this.setState({postData: postData},()=>this.getData());[m
     };[m
     render() {[m
[31m-        const { response, postData } = this.state;[m
[32m+[m[32m        const { response } = this.state;[m
         const columns = [[m
             {[m
                 title: '账变编号',[m
[36m@@ -193,7 +193,7 @@[m [mexport default class MentionFillingRecord extends Component {[m
                                     placeholder="请选择查询结束日期"[m
                                     defaultValue={moment(setDateTime(1))}[m
                                     onChange={(date, dateString)=>{this.onChangeEndDate(date, dateString)}}[m
[31m-                                    disabledDate={(current) => disabledDate(current, -datedifference(postData.sdatetime, setDateTime(0)), 1)}[m
[32m+[m[32m                                    disabledDate={(current)=>disabledDate(current, -18, 0)}[m
                                 />[m
                             </li>[m
                         </ul>[m
[1mdiff --git a/src/Components/Financial/Recharge/AliPay/AliPay.jsx b/src/Components/Financial/Recharge/AliPay/AliPay.jsx[m
[1mindex fe3c462..0922e4c 100644[m
[1m--- a/src/Components/Financial/Recharge/AliPay/AliPay.jsx[m
[1m+++ b/src/Components/Financial/Recharge/AliPay/AliPay.jsx[m
[36m@@ -25,7 +25,7 @@[m [mexport default class AliPay extends Component {[m
                 tag: 'zhifubao', //充值分类  支付宝 zhifubao[m
                 payment: '', //银行渠道code[m
                 bid: null, //银行渠道id[m
[31m-                money: '',//充值金额[m
[32m+[m[32m                money: 0,//充值金额[m
                 rid: null, //充值银行id[m
                 code: 'zfbsm', //充值银行code[m
                 // alipayName: '', //支付宝转账需要填写姓名[m
[36m@@ -50,17 +50,16 @@[m [mexport default class AliPay extends Component {[m
         }).then((res)=>{[m
             if(this._ismount && res.status == 200){[m
                 let data = res.repsoneContent,[m
[31m-                    _data = data[0],[m
                     loadmin = 0,[m
                     loadmax = 0,[m
                     postData = this.state.postData;[m
[31m-                if(_data !== undefined){[m
[31m-                    postData.payment = _data.payport_name;[m
[31m-                    postData.bid = _data.id;[m
[31m-                    postData.rid = _data.rid;[m
[31m-                    postData.code = _data.code;[m
[31m-                    loadmin = _data.loadmin;[m
[31m-                    loadmax = _data.loadmax;[m
[32m+[m[32m                if(data[0] !== undefined){[m
[32m+[m[32m                    postData.payment = data[0].payport_name;[m
[32m+[m[32m                    postData.bid = data[0].id;[m
[32m+[m[32m                    postData.rid = data[0].rid;[m
[32m+[m[32m                    postData.code = data[0].code;[m
[32m+[m[32m                    loadmin = data[0].loadmin;[m
[32m+[m[32m                    loadmax = data[0].loadmax;[m
                 }[m
 [m
                 this.setState({[m
[36m@@ -123,22 +122,10 @@[m [mexport default class AliPay extends Component {[m
         let reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/;[m
         let r = reg.test(value);[m
         let val = parseFloat(value);[m
[31m-        if(postData.payment == 'zhifubaoc9'){[m
[31m-            if(r && val <=  parseFloat(loadmax) && val >= parseFloat(loadmin)){[m
[31m-                if((val <= 500 && val % 10 == 0) || (val > 500 && val % 50 == 0)){[m
[31m-                    validate.money = 0;[m
[31m-                }else{[m
[31m-                    validate.money = 1;[m
[31m-                }[m
[31m-            }else{[m
[31m-                validate.money = 1;[m
[31m-            }[m
[32m+[m[32m        if(!r || val == 0 || val < parseFloat(loadmin) || val > parseFloat(loadmax)){[m
[32m+[m[32m            validate.money = 1;[m
         }else{[m
[31m-            if(!r || val < parseFloat(loadmin) || val > parseFloat(loadmax)){[m
[31m-                validate.money = 1;[m
[31m-            }else{[m
[31m-                validate.money = 0;[m
[31m-            }[m
[32m+[m[32m            validate.money = 0;[m
         }[m
         postData.money = value;[m
         this.setState({postData, validate});[m
[36m@@ -162,15 +149,12 @@[m [mexport default class AliPay extends Component {[m
     }[m
     /*选择充值方式*/[m
     selectActive(rid, index){[m
[31m-        let {postData, validate, backList} = this.state,[m
[31m-            selectBank = backList.filter(item => item.rid == rid)[0];[m
[32m+[m[32m        let selectBank = this.state.backList.filter(item => item.rid == rid)[0],[m
[32m+[m[32m            postData = this.state.postData;[m
         postData.payment = selectBank.payport_name;[m
[31m-        postData.money = '';[m
         postData.bid = parseInt(selectBank.id);[m
         postData.rid = parseInt(selectBank.rid);[m
         postData.code = selectBank.code;[m
[31m-        validate.money = 2;[m
[31m-[m
         if(selectBank.code == 'zfbsm'){[m
             delete postData.alipayName[m
         }[m
[36m@@ -179,7 +163,6 @@[m [mexport default class AliPay extends Component {[m
             loadmin: selectBank.loadmin,[m
             loadmax: selectBank.loadmax,[m
             postData: postData,[m
[31m-            validate,[m
         });[m
     };[m
     /*enter键提交*/[m
[36m@@ -189,7 +172,7 @@[m [mexport default class AliPay extends Component {[m
         }[m
     }[m
     render() {[m
[31m-        const { backList, postData } = this.state;[m
[32m+[m[32m        const { backList } = this.state;[m
         return ([m
             <div className="ali_main" onKeyDown={(e)=>this.onSubmit(e)}>[m
                 <div className="ali_m_hint">[m
[36m@@ -232,7 +215,6 @@[m [mexport default class AliPay extends Component {[m
                         <span className="ali_m_li_w">充值金额：</span>[m
                         <InputNumber min={0} size="large"[m
                                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}[m
[31m-                                     value={postData.money}[m
                                      parser={value => value.replace(/\$\s?|(,*)/g, '')}[m
                                      onChange={(value)=>{this.onRechargeAmoun