import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { hashHistory } from 'react-router';
import { Input,Button,Icon,Checkbox,Modal  } from 'antd';
import Fetch from '../../Utils';
import md5 from 'md5';
import { stateVar } from '../../State';
import onCanvas from './canvas';
import './Login.scss';

import loginSrc from './Img/logo.png';
import speedSrc from './Img/speed.png';
import dnsSrc from './Img/dns.png';
import serviceSrc from './Img/service.png';
import speedSrc_active from './Img/speed_active.png';
import dnsSrc_active from './Img/dns_active.png';
import serviceSrc_active from './Img/service_active.png';
import {removeStore, setStore,getStore, onValidate, _code } from "../../CommonJs/common";
const validImgSrc= stateVar.httpUrl + '/pcservice/index.php?useValid=true';

@observer
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {     //后缀带M为模态框上的数据
            resetUserid: null,
            loading: false,
            account: getStore('userName'),  //用户名
            accountM: '',
            password: getStore('loginPwd'),
            passwordM: '',
            aptchac: '', //验证码
            aptchacM:'',
            stopAnimation: '',
            navListIndex: 0, //控制登录模式
            visible1: false, //控制模态框显示
            visible2: false,
            visible3: false,
            validImg:'',   //验证码图片
            validImgM:'',
            session: null,//提交后台时带的sess
            warn:null,//登录错误提示信息
            warnM:null,
            warnM1:null,
            displayWarn:false,//控制显示提示信息
            displayWarnM:false,
            displayWarnM1:false,
            newPwdM:'',
            confirmPwdM:'',
            checkPw:getStore('checkFlag'),
            speedSrc:speedSrc,
            serviceSrc:serviceSrc,
            dnsSrc:dnsSrc,
			showWechat:'none',
            validate: {
                newpass: 2,
                confirm_newpass: 2
            },
            activityClose: true, // 显示活动
        }
    };
    componentDidMount() {
        // let indx = Math.floor(Math.random()*(onCanvas.length-1));
        this._ismount = true;
        stateVar.nowlottery.lotteryId = 'ssc';
        onCanvas[0]();
        this.getSession();
        this.getWechat();
        this.getKefu();
        if(stateVar.userInfo.sType == 'demo'){
            this.setState({account: null})
        }
    };
    componentWillUnmount(){
        this._ismount = false;
        window.removeEventListener('resize', function (event) {
            event.preventDefault();
        });
        if(window._closeAnimationFrame){
            window.cancelAnimationFrame(window._closeAnimationFrame);
        }
    };
    getKefu(){
        Fetch.kefu({
            method: "POST"
        }).then((res)=>{
            if(this._ismount && res.status == 200){
                let data = res.repsoneContent;
                stateVar.httpService = data.kefulink;
                stateVar.httpCS = data.domain;
                setStore("kefu",data);
            }
        })
    };
    /*
    * 获取前后台交互所需带的sess
    * 同时使页面已加载页面就将图片的请求加上sess
    * */
    getSession(){
        Fetch.getSess({method: "POST"}).then((data)=>{
            let parseData = data;
            this.setState({
                session: parseData.repsoneContent,
            }, ()=>{
                this.refreshImg();
                this.refreshImgModal();
            });
            setStore("session",parseData.repsoneContent);
            document.cookie = 'sess='+ parseData.repsoneContent + ';path=/';
        })
    }
    /*
     * 获取微信登录地址
     */
    getWechat(){
        Fetch.login({
        	method: "POST",
        	body:JSON.stringify({sType:"wechat"})
        }).then((data)=>{
            _code('wechatLink', data.repsoneContent.url, 200, 175);
        })
    }
    /*
    * 正常登录按下enter按钮处理提交
    */
    loginEnter(e){
        if(e.keyCode==13){
            this.enterLogin();
        }
    }
    /*
    *试玩模式按下enter按钮处理提交 */
    trygameloginEnter(e){
        if(e.keyCode==13){
            this.enterTryGameLogin();
        }
    }
    /*
    * 点击登录后的处理
    * 1.验证用户名或密码为空
    * 2.验证验证码是否为空
    * 3.验证成功后数据提交后台
    * 4.验证成功后进入主界面
    * 5.根据后台返回数据显示错误信息
    */
    enterLogin() {
        this.setState({ loading: true });
        if(!this.state.account||!this.state.password){
            this.setState({
                warn:"用户名或密码为空",
                displayWarn:true,
                loading: false,
            });
        }else if(this.state.aptchac==''){
            this.setState({
                warn:"验证码为空",
                displayWarn:true,
                loading:false,
            });
        }else {
            this.login();
        }

    };
    /*
    * 试玩模式登录
    * 验证验证码是否为空
    * 验证成功后进入主界面
    * 根据后台返回数据显示错误信息
    * */
    enterTryGameLogin(){
        if(this.state.aptchac==''){
            this.setState({
                warn:"验证码为空",
                displayWarn:true,
                loading:false,
            });
        }else {
            this.trygameLogin()
        }
    }
    /*
    * 请求登录接口（试玩模式）
    * 并存储登录后所需使用的数据
    * */
    trygameLogin(){
        Fetch.login({
            method: "POST",
            body: JSON.stringify({
                "sType": 'demo',
                "validcode": this.state.aptchac
            })
        }).then((data)=>{
            if(this._ismount){
                this.setState({ loading: false });
                let result = data.repsoneContent;
                if(data.status==200) {
                    stateVar.auth=true;
                    stateVar.userInfo = {
                        userId:result.userid,
                        userName: result.username,
                        userType: result.usertype,
                        accGroup: result.accGroup,
                        lastIp: result.lastip,
                        sType: result.sType,
                        lastTime: result.lasttime,
                        issetbank: result.issetbank,
                        setquestion: result.setquestion,
                        setsecurity: result.setsecurity,
                        email: result.email,

                    };

                    setStore("userId",result.userid);
                    setStore("userName",result.username);
                    setStore("userType",result.usertype);
                    setStore("accGroup",result.accGroup);
                    setStore("lastIp",result.lastip);
                    setStore("sType",result.sType);
                    setStore("lastTime",result.lasttime);
                    setStore("issetbank",result.issetbank);
                    setStore("setquestion",result.setquestion);
                    setStore("setsecurity",result.setsecurity);
                    setStore("pushDomain",result.push_domain);
                    setStore("email",result.emai);
                    hashHistory.push('/lottery');
                }else{
                    this.setState({
                        warn:data.shortMessage,
                        displayWarn:true,
                    });
                    if(data.shortMessage == '验证码错误'){
                        this.getSession()
                    }
                }
            }

        })
    };
    /*
    * 请求登录接口
    * 并存储登录后所需用的数据
    * */
    login() {
        let { aptchac, password, account } = this.state;
        //登录
        Fetch.login({
            method: "POST",
            body: JSON.stringify({
                "sType": 'formal',
                "username": account,
                "loginpass": md5((md5(aptchac) + md5(password))),
                "validcode": aptchac
            })
        }).then((data)=>{
            if(this._ismount){
                this.setState({ loading: false });
                if(data.status==200){
                    let result = data.repsoneContent;
                    stateVar.auth=true;
                    stateVar.userInfo = {
                        userId:result.userid,
                        userName: result.username,
                        userType: result.usertype,
                        accGroup: result.accGroup,
                        lastIp: result.lastip,
                        sType: result.sType,
                        lastTime: result.lasttime,
                        issetbank: result.issetbank,
                        setquestion: result.setquestion,
                        setsecurity: result.setsecurity,
                        email: result.email,
                    };

                    setStore("userName",result.username);
                    setStore("pushDomain",result.push_domain);
                    setStore("userId",result.userid);
                    setStore("userType",result.usertype);
                    setStore("accGroup",result.accGroup);
                    setStore("lastIp",result.lastip);
                    setStore("sType",result.sType);
                    setStore("lastTime",result.lasttime);
                    setStore("issetbank",result.issetbank);
                    setStore("setquestion",result.setquestion);
                    setStore("setsecurity",result.setsecurity);
                    setStore("email",result.email);

                    if(this.state.checkPw){
                        setStore("loginPwd",this.state.password);
                        setStore("checkFlag",this.state.checkPw);
                    }else{
                        removeStore("loginPwd");
                        removeStore("checkFlag");
                    }
                    hashHistory.push('/lottery');
                }else{
                    this.setState({
                        warn:data.shortMessage,
                        displayWarn:true,
                    });
                    if(data.shortMessage == '验证码错误'){
                        this.getSession()
                    }
                }
            }
        })
    };

    onCheckedPw(e) {
        this.setState({checkPw:e.target.checked});
    }
    onAccount(e) {
        this.setState({account:e.target.value});
    }
    onAccountM(e) {
        this.setState({accountM:e.target.value});
    }
    onPwd(e) {
        this.setState({password: e.target.value});
    }
    onPwdM(e) {
        this.setState({passwordM: e.target.value});
    }
    onNewPwdM(e) {
        let value = e.target.value,
            validate = this.state.validate;
        if (value != '') {
            let reg = /^(?![^a-zA-Z]+$)(?!\D+$).{6,16}$/,
                r = reg.test(value);
            if (r) {
                validate.newpass = 0;
            } else {
                validate.newpass = 1;
            }
        }else{
            validate.newpass = 1;
        }
        this.setState({newPwdM: value});
    }
    onConfirmPwdM(e) {
        let value = e.target.value,
            {validate, newPwdM} = this.state;
        if(value === newPwdM && value != ''){
            validate.confirm_newpass = 0;
        }else{
            validate.confirm_newpass = 1;
        }
        this.setState({confirmPwdM: value});
    }
    refreshImg(){
        this.setState({validImg:validImgSrc+'?rand='+Math.random()+"&sess="+this.state.session});
    }
    refreshImgModal(){
        this.setState({validImgM:validImgSrc+'?rand='+Math.random()+"&sess="+this.state.session});
    }
    onAptchac(e) {
        this.setState({aptchac: e.target.value});
    }
    onaptchacM(e) {
        this.setState({aptchacM: e.target.value});
    }
    /*
    * 忘记密码后的弹出框处理
    * 1.找回密码（包括显示提示信息和提交数据）
    * 2.重置密码（包括显示提示信息和提交数据）
    * 登录即同意协议的模态框显示
    * */
    showModal(value) {
        if (value === 'forget_pwd') { //显示忘记密码模态框
            this.setState({
                visible1: true,
                displayWarn:false,
            });
        } else if(value ==='reset_pwd'){ //显示重置密码模态框
            let {accountM, passwordM, aptchacM} = this.state;
            if(accountM==''|| passwordM==''){
                this.setState({
                    warnM:"用户名或密码为空",
                    displayWarnM:true,
                });
            }else if(aptchacM==''){
                this.setState({
                    warnM:"验证码为空",
                    displayWarnM:true,
                });
            }else{
                Fetch.resetPwd(  //找回密码
                    {
                        method: "POST",
                        body:JSON.stringify({
                            "flag": 'changepasscheck',
                            "username": accountM,
                            "loginpass": md5(passwordM),
                            "validcode": aptchacM
                        })
                    }).then((res)=>{
                    if(res.status==200){
                        this.setState({
                            displayWarnM:false,
                            visible1: false,
                            visible2: true,
                            resetUserid: res.repsoneContent.userid
                        });
                    }else{
                        this.setState({
                            warnM:res.shortMessage,
                            displayWarnM:true,
                        });
                        if(res.shortMessage == '验证码错误'){
                            this.getSession()
                        }
                    }
                })

            }
        }else if(value ==='suggest'){
            let {newPwdM, confirmPwdM} = this.state;
            if(newPwdM=='' || confirmPwdM==''){
                this.setState({
                    warnM1:"密码为空",
                    displayWarnM1:true,
                });
            }else if(newPwdM != confirmPwdM){
                this.setState({
                    warnM1:"两次输入密码不同",
                    displayWarnM1:true,
                });
            }else{
                let {validate} = this.state;
                if(validate.newpass == 0 && validate.confirm_newpass == 0){
                    Fetch.resetPwd(  //重置密码
                        {
                            method: "POST",
                            body:JSON.stringify({
                                "flag": 'changeseritycheck',
                                "userid": this.state.resetUserid,
                                "changetype":"loginpass",
                                "newpass":md5(newPwdM),
                                "confirm_newpass":md5(confirmPwdM),
                            })
                        }).then((data)=>{
                        if(data.status==200){
                            this.setState({
                                visible3: true,
                            }, ()=>{
                                this.onCancelSetPassw();
                                this.onCancelInputPassw();
                            });
                        }else{
                            this.setState({
                                warnM1:data.shortMessage,
                                displayWarnM1:true,
                            });
                        }
                    })
                }else{
                    if(validate.newpass == 2) {
                        validate.newpass == 1
                    }
                    if(validate.confirm_newpass == 2) {
                        validate.confirm_newpass == 1
                    }
                    this.setState({validate})
                }
            }
        }else if(value ==='l_accept'){//显示登录即同意协议模态框
            this.setState({
                visible4: true,
                displayWarn:false,
            });
        }

    };
    /*切换登录模式
    * 1.将上个模式的报错信息隐藏
    * 2.将验证码图片置为初始状态*/
    onChangLoginMode(index){
        this.setState({
            navListIndex: index,
            displayWarn:false,
            showWechat:'none'
        });
    }
    /*关闭找回密码modal*/
    onCancelInputPassw() {
        this.setState({
            visible1: false,
            displayWarnM:false,
            accountM: null,
            passwordM: null,
            aptchacM: null,
        })
    }
    onCancelSetPassw() {
        let {validate} = this.state;
        validate.newpass = 2;
        validate.confirm_newpass = 2;
        this.setState({
            visible2: false,
            displayWarnM1:false,
            newPwdM: null,
            confirmPwdM: null,
            validate,
        }, ()=>this.onCancelInputPassw());
    }
    loginMain() {
        /*
        * 账号登录
        */
        const ul_0 =  <div className="login_wrap">
            <div className='l_input' onKeyDown={(e)=>{this.loginEnter(e)}}>
                <Input size="large" className='login_input' autoFocus value={this.state.account} onChange={(e)=>{this.onAccount(e)}} placeholder="用户名"/>
                <div className="l_password">
                    <Input type="password" size="large" value={this.state.password} onChange={(e)=>{this.onPwd(e)}} placeholder="密码"  />
                    <span className="l_forget" onClick={()=>{this.showModal('forget_pwd')}}>忘记密码？</span>
                </div>
                <div className="l_vali">
                    <Input size="large" className='login_input'
                           value={this.state.aptchac}
                           onChange={(e)=>{this.onAptchac(e)}}
                           placeholder="验证码"
                    />
                    <img className="l_valicode" src={this.state.validImg} onClick={()=>{this.getSession()}}/>
                </div>

            </div>

            <Button type="primary" className='login_btn' icon="right-circle"
                    loading={this.state.loading}
                    onClick={()=>{this.enterLogin()}}
            >
                立即登录
            </Button>
            <Checkbox style={{color:'#fff',marginTop:10}} checked={this.state.checkPw} onChange={(e)=>{this.onCheckedPw(e)}}>记住密码</Checkbox>
            <div>

                <div>
                    <Modal
                        title="找回密码"
                        wrapClassName="vertical-center-modal find_password_modal"
                        maskClosable={false}
                        width={300}
                        visible={this.state.visible1}
                        onCancel={()=>this.onCancelInputPassw()}
                        footer={null}
                    >
                        <ul className="password_list">
                            <li>
                                <Input size="large"  placeholder="用户名"
                                       value={this.state.accountM}
                                       onChange={(e)=>{this.onAccountM(e)}}
                                />
                            </li>
                            <li>
                                <Input type="password" size="large"  placeholder="资金密码"
                                       value={this.state.passwordM}
                                       onChange={(e)=>{this.onPwdM(e)}}
                                />
                            </li>
                            <li className="l_m_vali">
                                <Input size="large"
                                       value={this.state.aptchacM}
                                       onChange={(e)=>{this.onaptchacM(e)}}
                                       placeholder="验证码"
                                />
                                <img className="l_m_valicode" src={this.state.validImgM} onClick={()=>{this.getSession()}}/>

                                <div className='hint_text'>
                                    <span style={{display: this.state.displayWarnM ? 'block' : 'none' }}>
                                        操作失败:{this.state.warnM}
                                    </span>
                                </div>
                            </li>
                            <li>
                                <Button type="primary"  onClick={()=>{this.showModal('reset_pwd')}}>
                                    下一步
                                </Button>
                            </li>
                        </ul>
                    </Modal>
                    <Modal
                        title="重置密码"
                        wrapClassName="vertical-center-modal find_password_modal"
                        width={300}
                        maskClosable={false}
                        visible={this.state.visible2}
                        onCancel={()=>this.onCancelSetPassw()}
                        footer={null}
                    >
                        <ul className="password_list">
                            <li>
                                <p className='m_name'>{this.state.accountM}</p>
                            </li>
                            <li>
                                <Input type="password" size="large"
                                       placeholder="新登录密码"
                                       value={this.state.newPwdM}
                                       onChange={(e)=>{this.onNewPwdM(e)}}
                                       className={onValidate('newpass', this.state.validate)}
                                />
                                <p className="password_text">密码由字母和数字组成6-16个字符</p>
                            </li>
                            <li>
                                <Input type="password" size="large"
                                       placeholder="确认新登录密码"
                                       value={this.state.confirmPwdM}
                                       onChange={(e)=>{this.onConfirmPwdM(e)}}
                                       className={onValidate('confirm_newpass', this.state.validate)}
                                />
                                <div className='hint_text'>
                                    <span style={{display: this.state.displayWarnM1 ? 'block' : 'none' }}>
                                        操作失败:{this.state.warnM1}
                                    </span>
                                </div>
                            </li>
                            <li>
                                <Button className='suggest_btn' type="primary" onClick={()=>{this.showModal('suggest')}} >
                                    确定
                                </Button>
                            </li>
                        </ul>
                    </Modal>
                    <Modal
                        title="提示"
                        wrapClassName="vertical-center-modal hint_modal_succeed"
                        width={300}
                        maskClosable={false}
                        visible={this.state.visible3}
                        onCancel={()=>{this.setState({ visible3: false })}}
                        footer={null}
                    >
                        <Icon type="check-circle-o" style={{ fontSize: 65, color: '#73b573', marginBottom: 20 }}/>
                        <p className='m_p_input'>密码重置成功</p>
                        <Button  type="primary" onClick={()=>{this.setState({ visible3: false })}} >
                            确定
                        </Button>
                    </Modal>
                </div>

            </div>
            <div>
                <a  className='l_accept'  onClick={()=>{this.showModal('l_accept')}}>登录即同意《协议与条款》</a>
                <div>
                    <Modal
                        title="《协议与条款》"
                        wrapClassName="vertical-center-modal m_accept_contract"
                        maskClosable={false}
                        visible={this.state.visible4}
                        onCancel={()=>{this.setState({ visible4: false })}}
                        footer={<Button className="l_m_btn" type="primary" onClick={()=>{this.setState({ visible4: false })}} >
                            确定并同意
                        </Button>}
                        closable={false}
                    >
                        <div className='m_contract'>
                            <p>《恒彩在线》是持菲律宾共和国合法经营执照，并受其相关法律保护和约束的线上游戏平台运营商。</p>
                            <p>用户在登录使用平台服务前，请仔细阅读以下内容，并确认使用平台服务符合所在国家和居住地的法律及规定。本平台不承担任何因用户违反当地法规引起的任何责任。用户一经登录平台，则视为完全接受平台所有之规定。</p>
                            <p className="m_c_title">1.交易协定 </p>
                            <p>1.1本平台所有开奖数据均使用具有公信力的第三方开奖结果，以投注站的视频信号为基准。如发生因开奖机构引起的开奖错误，将采用开奖机构修正并最终确定的结果。本平台有权在上述事件发生时即时终止资金交易，并进行相应订单修正处理。
                            </p>
                            <p>1.2用户在本平台投注完成后，请核对投注记录，确保投注成功以避免争议；投注过程中，若发生网络问题而导致与平台服务器连接失败，所有已被确认的订单仍然有效，用户在重新登录时，请再次核对并确认投注记录。
                            </p>
                            <p>1.3用户在本平台充值汇款，请按相关流程和规定，确认汇入账号为平台网站提供的即时有效的汇款信息，因填入错误的信息（汇款账号或流水号）而导致的无法到账或到账延迟，本平台不承担任何责任，并保留对违规填写流水号用户的处罚权.
                            </p>
                            <p>1.4用户在本平台提款前，须确认本人使用的银行账号。因用户个人银行账号变更而未及时通知平台而引起的损失，平台不承担任何责任。
                            </p>
                            <p>1.5有历史资金交易记录且余额≤2元的账户，累计7天无账变（无充值，无提现，无投注，无返点），将被禁用，禁用累计7天且无下级，将被系统注销；新注册账号累计超过7天无账变将被禁用，禁用累计7天且无下级，将被系统注销。
                            </p>
                            <p>1.6用户在本平台游戏，若有作弊、欺编、攻击、破坏本平台正常运作的行为或利用系统漏洞侵害平台和其他客户的权益，一经核实，本平台有权禁用、冻结和注销用户账户，终止其继续使用本平台服务，并有权没收所有不当所得。
                            </p>
                            <p>1.7本平台用户可查交易记录只保留7天，如有争议，以平台保留的最终备份数据为最后处理依据。
                            </p>
                            <p className="m_c_title">2.责任声明</p>
                            <p>2.1用户须年满18周岁以上方可使用本平台服务，请不要沉溺于游戏。
                            </p>
                            <p>2.2在本平台以账号和密码登录后进行的任何操作行为，均被视为有效操作。用户有责任保护自己的账号、密码和其他个人隐私资料。若用户个人资料保护不当造成账户被盗用（如中木马病毒等），用户发现后，应立即通知上级代理或本平台来冻结张号、修改资料，从而终止损失；已经造成的资金和财产损失，本平台不承担赔付责任。
                            </p>
                            <p>2.3本平台使用“网页式在线客服”并作为唯一的方式为用户提供即时咨询服务。用户从其他方式获得的服务，本平台不保证其真实性，不承担由此引起的任何责任。
                            </p>
                            <p>2.4本平台建议用户本人在平台进行个人密码修改、投注、充值、提现等重要操作，平台不会委托他人（任何个人或团体）替用户进行上述操作，用户通过他人操作造成的任何损失,本平台不承担责任。
                            </p>
                            <p>2.5用户在本平台绑定的由邮箱须真实有效，邮箱一经绑定，不得修改，若由于个人错误绑 定导致的损失，平台不承担任何责任。
                            </p>
                            <p>2.6因自然灾害或第三方因素等不可控力，如ISP（互联网接入提供商）故障、用户所在国政府限制措施行为，导致平台网站资料损坏、资料丟失、访问异常等情况，本平台不承担任何责任，但将尽力减少因此而给用户造成的损失，且用户有义务配合行动以减轻事件影响。
                            </p>
                            <p>2.7本平台保留不时修订、更新本条款和平台游戏规则的权利。经修订、更新的条款和游戏规则，在公布时即生效，用户在上述修订和更新公布后，继续使用本平台服务时，则视为用户同意并接受本平台条款和游戏规则的修订和更新。
                            </p>
                            <p>2.8 本公司保留对其他未尽事宜或争议的解释权和修订权。
                            </p>
                        </div>
                    </Modal>
                </div>
            </div>
        </div>;
        /*
        * 试玩账号
        */
        const ul_1 =  <div className="login_wrap">
            <div className='l_input' onKeyDown={(e)=>{this.trygameloginEnter(e)}}>
                <p className='l_try_txt'>恭喜您获得<span className='l_try_888'>8888</span>元免费试玩体验金！</p>
                <div className="l_vali">
                    <Input size="large" className='login_input'
                           value={this.state.aptchac}
                           onChange={(e)=>{this.onAptchac(e)}}
                           placeholder="验证码"
                    />
                    <img className="l_valicode" src={this.state.validImg} onClick={()=>{this.getSession()}}/>
                </div>

            </div>

            <Button type="primary" className='login_btn' icon="right-circle" loading={this.state.loading} onClick={()=>{this.enterTryGameLogin()}}>
                立即登录
            </Button>
        </div>;

        switch (this.state.navListIndex) {

            case 0:
                return ul_0;
                break;
            case 1:
                return ul_1;
                break;
            case 2:
            	return ul_2;
            	break;
        }
    };
    /*
     * 点击微信切换
     */
	tigger(){
		let tempWechat;
		if(this.state.showWechat == 'none'){
			tempWechat = 'block';
		}else{
			tempWechat = 'none';
		}
		this.setState({showWechat:tempWechat});
	}
    render() {

        const navList = ['账号登录', '试玩模式'];
        return (
            <div className='login_main'>
                <canvas id="canvas"></canvas>
                <div className="l_nav_top">
                    <div className="l_nav_top_content">
                        <ul className="l_n_t_list right">
                            <li className='l_speed' onMouseEnter={()=>{
                                this.setState({
                                    speedSrc:speedSrc_active,
                                });}} onMouseLeave={()=>{this.setState({
                                speedSrc:speedSrc,
                            });}}>
                                <a href={stateVar.httpCS} target="_blank">
                                    <img  src={this.state.speedSrc}/>
                                    <span>域名测速</span>
                                </a>
                            </li>
                            <li className='l_dns' onMouseEnter={()=>{
                                this.setState({
                                    dnsSrc:dnsSrc_active,
                                });}} onMouseLeave={()=>{this.setState({
                                dnsSrc:dnsSrc,
                            });}}>
                                <a href="#/dns" target="_blank">
                                    <img  src={this.state.dnsSrc}  /><span>防劫持教程</span>
                                </a>
                            </li>

                            <li className='l_sevice' onMouseEnter={()=>{
                                this.setState({
                                    serviceSrc:serviceSrc_active,
                                });}} onMouseLeave={()=>{this.setState({
                                serviceSrc:serviceSrc,
                            });}}>
                                <a href={stateVar.httpService} target="_blank">
                                    <img src={this.state.serviceSrc} />
                                    <span>在线客服</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="login">
                    <div className="loginLogo">
                        <img src={loginSrc} />
                    </div>
                    <div className="login_content">
                        <div className='l_m_content'>
                            <ul className="l_m_select_list clear">
                                {
                                    navList.map((value, index)=>{
                                        return <li className={this.state.navListIndex === index ? 'l_m_select_list_active' : ''}
                                                   onClick={()=> {this.onChangLoginMode(index)}} key={index}>{value}</li>
                                    })
                                }
                            </ul>
                            <div className='l_m_select_list_active' onClick={()=>this.tigger()}>微信登录手机版</div>
                            <div className='wechatQrcode' style={{display:this.state.showWechat}}>
                                <div id="wechatLink"></div>
                            </div>
                        </div>
                        { this.loginMain() }
                    </div>
                    <div  className='l-warn' style={{display: this.state.displayWarn ? 'block' : 'none'}}>
                        <div className='failure_text'>
                            操作失败:{this.state.warn}
                        </div>
                    </div>
                </div>
                <div className="activity_content" style={{display: this.state.activityClose ? 'block' : 'none'}}>
                    <a href="https://q1893.cn" className="pc_activity" target="_blank"></a>
                    <div className="close_content">
                        <Icon className="activity_close" type="close" onClick={()=>this.setState({activityClose: false})}/>
                    </div>
                </div>
            </div>
        );
    }
}
