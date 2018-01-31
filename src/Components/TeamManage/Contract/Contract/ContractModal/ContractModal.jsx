import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Button, Icon,Modal,Select,Slider,InputNumber ,message } from 'antd';
import Fetch from '../../../../../Utils';
import './ContractModal.scss';
import guanbi  from  './Img/guanbi.png'

const Option=Select.Option
/*数据提交成功显示信息*/
const success = (value) => {
    message.success(value);
};
/*数据提交失败显示信息*/
const error = (value) => {
    message.error(value);
};
@observer
export default class ContractModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,               //控制提交按钮的加载状态
            ModalTitle: false,
            visible:false,                //控制契约模态框的显示
            navListIndex:4,               //控制当前契约类型
            modalClass:"center-modal-c", //控制模态框不同类型的
            contactType:"请选择需要创建契约的系统" ,                          //当前被选中契约类型
            today:null,//当天日期
            value:'',
            sliderValue: null,     //设置当前下级用户的奖金组级别
            userList:[], //下级用户列表（代理）
            contractInfo:[],//契约类型
            userid:null, //下级用户userid
            username:null,//下级用户username
            parentid:null,//当前用户id
            currentUserInfo:{   //当前用户信息
                salary_ratio_1:null,  //当前用户日销量>=1万时的日工资比例
                salary_ratio_10:null, //当前用户日销量>=10万时的日工资比例
                salary_ratio_30:null, //当前用户日销量>=30万时的日工资比例
                salary_ratio_50:null, //当前用户日销量>=50万时的日工资比例
                salary_ratio_70:null, //当前用户日销量>=70万时的日工资比例
                salary_ratio_100:null, //当前用户日销量>=100万时的日工资比例
                prize_group:null,      //当前用户奖金组级别

            },
            childrenQuotaStatus:null,        //下级用户配额契约签订状态
            checkStatus:false,               //控制当前界面是查看页（true），还是修改页面(false)
            contractTxt:'提交契约',                  //控制契约按钮显示文字内容
            getSalary:{                      //获取日工资契约数据
                salary_ratio_1:null,  //下级用户日销量>=1万时的日工资比例
                salary_ratio_10:null, //下级用户日销量>=10万时的日工资比例
                salary_ratio_30:null, //下级用户日销量>=30万时的日工资比例
                salary_ratio_50:null, //下级用户日销量>=50万时的日工资比例
                salary_ratio_70:null, //下级用户日销量>=70万时的日工资比例
                salary_ratio_100:null, //下级用户日销量>=100万时的日工资比例
            },
            setSalary:{                 //设置日工资契约数据
                salary_ratio:[],        //提交的日工资设置数组
                salary_ratio_1:null,
                salary_ratio_10:null,
                salary_ratio_30:null,
                salary_ratio_50:null,
                salary_ratio_70:null,
                salary_ratio_100:null,
            } ,
            dividend_radio:null,             //获取分红契约数据（分红比例）
            setdividend_radio:null,         //设置分红契约数据
            getAwardTeam:{                   //获取的当前下级用户的奖金组信息
                groupLevel:null,             //当前下级用户的奖金组级别
                selfPoint:null,                //当前用户的自身返点
                childrenPoint:null,              //当前下级用户返点
            },
            getQuota:{                       //获取配额契约
                point:null,               //当前下级用户利益点
                quota1956display:true,    //由当前用户利益点决定是否显示对应奖金组配置内容
                quota1954display:true,
                quota1952display:true,
                quota1950display:true,
                accnum1956:null,        //对应奖金组的剩余配额
                accnum1954:null,
                accnum1952:null,
                accnum1950:null,
                subaccnum1956:null,   //对应奖金组已经配置的配额
                subaccnum1954:null,
                subaccnum1952:null,
                subaccnum1950:null,
            },
            setQuota:{
                accgroup:[],              //修改的对应的奖金组，用agid代替
                accnum:[],                //修改的相对应的配额数据，与accgroup顺序一致
                setSubaccnum1956:"",   //设置对应奖金组的配额
                setSubaccnum1954:"",
                setSubaccnum1952:"",
                setSubaccnum1950:"",
            }

        };
    };


    /*获取用户信息
    *当前用户的奖金组级别，userid，分红比例签订状态，日工资签订状态，调用当前用户获取日工资6挡比例的请求
    *获取下级用户列表，包括userid，username，奖金组级别，分红比例签订状态，日工资契约签订状态
    * */
    getUserInfo(){
        let userlist = [];
        let id=null,
            contractInfo=[];         //当前登录用户拥有的契约类型
            Fetch.childrenList({method: "POST",
                body: JSON.stringify({
                    pn: 100,
                })}).then((data)=> {
            if(this._ismount){
                if(data.status==200){
                    let currentUserInfo=this.state.currentUserInfo;
                    currentUserInfo.prize_group=data.repsoneContent.self.prize_group;
                    this.setState({
                        parentid:data.repsoneContent.users[0].userid,
                        currentUserInfo:currentUserInfo,
                    })
                    for(let i=0 ;i<data.repsoneContent.results.length;i++){
                        if(parseInt(data.repsoneContent.results[i].usertype)){
                            id = data.repsoneContent.results[i].userid;
                            userlist[id]={
                                name:data.repsoneContent.results[i].username,
                                prize_group:data.repsoneContent.results[i].prize_group,
                                daily_salary_status:data.repsoneContent.results[i].daily_salary_status,
                                dividend_salary_status:data.repsoneContent.results[i].dividend_salary_status,
                                useraccgroup_status:data.repsoneContent.results[i].useraccgroup_status,
                            };
                        }
                    }
                    if(parseInt(data.repsoneContent.self.daily_salary_status)){
                        contractInfo.push({
                            id:0,
                            contract:"日工资契约",
                        })
                        this.getCurrentUserSalaryData();
                    }
                    if(parseInt(data.repsoneContent.self.dividend_salary_status)){
                        contractInfo.push({
                            id:1,
                            contract:"分红契约",
                        })

                    }
                    contractInfo.push({
                        id:2,
                        contract:"奖金组契约",
                    })

                    if(parseInt(data.repsoneContent.self.useraccgroup_status)){
                        contractInfo.push({
                            id:3,
                            contract:"配额契约",
                        })
                    }

                    this.setState({
                        userList:userlist,
                        contractInfo:contractInfo,

                    })

                }
            }

        })

    }
    /*获取当前用户日工资契约*/
    getCurrentUserSalaryData(){
        Fetch.dailysalaryself({
            method: "POST",
            body: JSON.stringify({
                gmt_sale:this.state.today,
                userid:this.state.parentid,
            })
        }).then((data)=> {
            if(this._ismount){
                if(data.status==200){
                    let currentUserInfo=this.state.currentUserInfo;
                    currentUserInfo.salary_ratio_1=data.repsoneContent.pros[0][0].salary_ratio;
                    currentUserInfo.salary_ratio_10=data.repsoneContent.pros[0][1].salary_ratio;
                    currentUserInfo.salary_ratio_30=data.repsoneContent.pros[0][2].salary_ratio;
                    currentUserInfo.salary_ratio_50=data.repsoneContent.pros[0][3].salary_ratio;
                    currentUserInfo.salary_ratio_70=data.repsoneContent.pros[0][4].salary_ratio;
                    currentUserInfo.salary_ratio_100=data.repsoneContent.pros[0][5].salary_ratio;
                    this.setState({
                        currentUserInfo:currentUserInfo,
                    })
                }
            }


        })
    }
    /*获取日工资契约数据*/
    getSalaryData(uid){
        let userid = uid||this.state.userid;
        Fetch.dailysalaryupdate({
            method: "POST",
            body: JSON.stringify({
                userid:userid,
                gmt_sale:this.state.today,
                parentid:this.state.parentid,
            })
        }).then((data)=> {
            if(this._ismount){
                if(data.status==200){
                    let getSalary=this.state.getSalary;
                    getSalary.salary_ratio_1 = data.repsoneContent.pros[0].salary_ratio;
                    getSalary.salary_ratio_10 = data.repsoneContent.pros[1].salary_ratio;
                    getSalary.salary_ratio_30 = data.repsoneContent.pros[2].salary_ratio;
                    getSalary.salary_ratio_50 = data.repsoneContent.pros[3].salary_ratio;
                    getSalary.salary_ratio_70 = data.repsoneContent.pros[4].salary_ratio;
                    getSalary.salary_ratio_100 = data.repsoneContent.pros[5].salary_ratio;
                    this.setState({
                        getSalary:getSalary,
                    })
                }
            }



        })
    }
    /*设置日工资契约数据
    * 切换查看状态和修改契约状态
    * 对提交数据是否为空进行验证
    * 对操作成功和失败进行提醒
    * */
    setSalaryData(){
        if(this.state.checkStatus){
            this.setState({
                checkStatus:false,
                contractTxt:"签订契约"
            })
        }else{
            let setSalary=this.state.setSalary;
            this.setState({
                loading:true,
            });
            if(!(setSalary.salary_ratio_1&&setSalary.salary_ratio_10&&setSalary.salary_ratio_30&&
                setSalary.salary_ratio_50&&setSalary.salary_ratio_70&&setSalary.salary_ratio_100)){
                error("不能为空！");
                this.setState({
                    loading:false,
                });
            }else{
                setSalary.salary_ratio.push({
                    sale:10000,
                    salary_ratio:setSalary.salary_ratio_1,
                })
                setSalary.salary_ratio.push({
                    sale:100000,
                    salary_ratio:setSalary.salary_ratio_10,
                })
                setSalary.salary_ratio.push({
                    sale:300000,
                    salary_ratio:setSalary.salary_ratio_30,
                })
                setSalary.salary_ratio.push({
                    sale:500000,
                    salary_ratio:setSalary.salary_ratio_50,
                })
                setSalary.salary_ratio.push({
                    sale:700000,
                    salary_ratio:setSalary.salary_ratio_70,
                })
                setSalary.salary_ratio.push({
                    sale:1000000,
                    salary_ratio:setSalary.salary_ratio_100,
                })

                this.setState({
                    setSalary:setSalary,
                })
                Fetch.dailysalaryupdate({
                    method: "POST",
                    body: JSON.stringify({
                        userid:this.state.userid,
                        gmt_sale:this.state.today,
                        parentid:this.state.parentid,
                        salary_ratio:this.state.setSalary.salary_ratio,
                    })
                }).then((data)=> {
                    let setSalary=this.state.setSalary;
                    setSalary.salary_ratio=[];
                    this.setState({
                        loading:false,
                        setSalary:setSalary,
                    });
                    if(this._ismount){
                        if(data.status=200){
                            success(data.shortMessage);
                            let userInfo=this.state.userList;
                            userInfo[this.state.userid].daily_salary_status=1;
                            this.setState({
                                userInfo:userInfo,
                            });
                        }else{
                            error(data.shortMessage);
                        }
                    }

                });

            }

        }
    }
    /*获取分红契约数据(分红比例)*/
    getPortionData(uid){
        let userid = uid||this.state.userid;
        Fetch.diviratio({
            method: "POST",
            body: JSON.stringify({
                userid:userid,
                tag:"getdividend",
            })
        }).then((data)=> {
            if(this._ismount){
                if(data.status==200){
                    this.setState({
                        dividend_radio:data.repsoneContent.dividend_radio,
                    })
                }
            }

        })
    }
    /*设置分红契约数据
    * 切换查看状态和修改契约状态
    * 对提交数据是否为空进行验证
    * 对操作成功和失败进行提醒
    * */
    setPortionData(){
        if(this.state.checkStatus){
            this.setState({
                checkStatus:false,
                contractTxt:"签订契约"
            })
        }else{
            this.setState({
                loading:true,
            });
            if(!this.state.setdividend_radio){
                error("不能为空！");
                this.setState({
                    loading:false,
                });
            }else{
                Fetch.diviratio({
                    method: "POST",
                    body: JSON.stringify({
                        userid:this.state.userid,
                        dividend_radio:this.state.setdividend_radio,
                    })
                }).then((data)=> {
                    this.setState({
                        loading:false,
                        setdividend_radio:null,
                    });
                    if(this._ismount){
                        if(data.status=200){
                            success(data.shortMessage);
                            let userInfo=this.state.userList;
                            userInfo[this.state.userid].dividend_salary_status=1;
                            this.setState({
                                userInfo:userInfo,
                            });
                        }else{
                            error(data.shortMessage);
                        }
                    }

                });

            }

        }
    }
    /*获取奖金组契约数据*/
    getAwardTeamData(uid){
        let userid = uid||this.state.userid;
        Fetch.awardTeam({
            method: "POST",
            body: JSON.stringify({
                uid:userid,
            })
        }).then((data)=> {
            if(this._ismount){
                if(data.status==200){
                    let getAwardTeam=this.state.getAwardTeam;
                    getAwardTeam.groupLevel=data.repsoneContent.groupLevel;
                    getAwardTeam.selfPoint=data.repsoneContent.selfPoint;
                    this.setState({
                        getAwardTeam:getAwardTeam,
                        sliderValue:data.repsoneContent.groupLevel,

                    })
                }
            }

        })
    }
    /*设置奖金组契约数据
    * 切换查看状态和修改契约状态
    * 对操作成功和失败进行提醒
    * */
    setAwardTeamData(){
        if(this.state.checkStatus){
            this.setState({
                checkStatus:false,
                contractTxt:"签订契约"
            })
        }else{
            this.setState({
                loading:true,
            });
            let groupLevel=this.state.sliderValue;
            let high=0.0780-((1956-parseInt(groupLevel))/2)*0.001;
            let keeppoint=((parseFloat(this.state.getAwardTeam.selfPoint)-high)*100).toFixed(3);
            Fetch.awardTeam({
                method: "POST",
                body: JSON.stringify({
                    uid:this.state.userid,
                    flag:"rapid",
                    groupLevel:this.state.sliderValue,
                    selfPoint:this.state.getAwardTeam.selfPoint,
                    keeppoint:keeppoint,

                })
            }).then((data)=> {
                this.setState({
                    loading:false,
                });
                if(this._ismount){
                    if(data.status=200){
                        success(data.shortMessage);
                    }else{
                        error(data.shortMessage);
                    }
                }

            });



        }
    }
    /*获取配额契约数据*/
    getQuotaData(uid){
        let userid=uid||this.state.userid;
        Fetch.quota({method: "POST",
            body: JSON.stringify({
                uid:userid,
            })
        }).then((data)=> {
            if(this._ismount){
                if(data.status==200){
                    let getQuota = this.state.getQuota;
                    getQuota.point = data.repsoneContent.point;
                    switch (getQuota.point){
                        case 0.078:
                            getQuota.quota1956display=true;
                            getQuota.quota1954display=true;
                            getQuota.quota1952display=true;
                            getQuota.quota1950display=true;
                            getQuota.accnum1956 = data.repsoneContent.aAllUserTypeAccNum[0].accnum;
                            getQuota.accnum1954 = data.repsoneContent.aAllUserTypeAccNum[1].accnum;
                            getQuota.accnum1952 = data.repsoneContent.aAllUserTypeAccNum[2].accnum;
                            getQuota.accnum1950 = data.repsoneContent.aAllUserTypeAccNum[3].accnum;
                            getQuota.subaccnum1956 = data.repsoneContent.aAllUserTypeAccNum[0].subaccnum;
                            getQuota.subaccnum1954 = data.repsoneContent.aAllUserTypeAccNum[1].subaccnum;
                            getQuota.subaccnum1952 = data.repsoneContent.aAllUserTypeAccNum[2].subaccnum;
                            getQuota.subaccnum1950 = data.repsoneContent.aAllUserTypeAccNum[3].subaccnum;
                            break;
                        case 0.077:
                            getQuota.quota1956display=false;
                            getQuota.quota1954display=true;
                            getQuota.quota1952display=true;
                            getQuota.quota1950display=true;
                            getQuota.accnum1954 = data.repsoneContent.aAllUserTypeAccNum[1].accnum;
                            getQuota.accnum1952 = data.repsoneContent.aAllUserTypeAccNum[2].accnum;
                            getQuota.accnum1950 = data.repsoneContent.aAllUserTypeAccNum[3].accnum;
                            getQuota.subaccnum1954 = data.repsoneContent.aAllUserTypeAccNum[1].subaccnum;
                            getQuota.subaccnum1952 = data.repsoneContent.aAllUserTypeAccNum[2].subaccnum;
                            getQuota.subaccnum1950 = data.repsoneContent.aAllUserTypeAccNum[3].subaccnum;
                            getQuota.subaccnum1956 = null;
                            break;
                        case 0.076:
                            getQuota.quota1956display=false;
                            getQuota.quota1954display=false;
                            getQuota.quota1952display=true;
                            getQuota.quota1950display=true;
                            getQuota.accnum1952 = data.repsoneContent.aAllUserTypeAccNum[2].accnum;
                            getQuota.accnum1950 = data.repsoneContent.aAllUserTypeAccNum[3].accnum;
                            getQuota.subaccnum1952 = data.repsoneContent.aAllUserTypeAccNum[2].subaccnum;
                            getQuota.subaccnum1950 = data.repsoneContent.aAllUserTypeAccNum[3].subaccnum;
                            getQuota.subaccnum1956 = null;
                            getQuota.subaccnum1954 = null;
                            break;
                        case 0.075:
                            getQuota.quota1956display=false;
                            getQuota.quota1954display=false;
                            getQuota.quota1952display=false;
                            getQuota.quota1950display=true;
                            getQuota.accnum1950 = data.repsoneContent.aAllUserTypeAccNum[3].accnum;
                            getQuota.subaccnum1950 = data.repsoneContent.aAllUserTypeAccNum[3].subaccnum;
                            getQuota.subaccnum1956 = null;
                            getQuota.subaccnum1954 = null;
                            getQuota.subaccnum1952 = null;
                            break;
                    }
                    this.setState({
                        getQuota:getQuota,
                    })
                }
            }

        });
    }
    /*
    *切换配额契约查看状态和修改状态
    *当为查看状态时，仅处理将查看状态改为修改状态
    * 当为修改状态时，设置配额契约数据
    * */
    setQuotaData(){
        if(this.state.checkStatus){
            this.setState({
                checkStatus:false,
                contractTxt:"签订契约",
            })
        }else{
            this.setState({
                loading:true,

            });
            if(!(this.state.setQuota.setSubaccnum1956||this.state.setQuota.setSubaccnum1954
                    ||this.state.setQuota.setSubaccnum1952||this.state.setQuota.setSubaccnum1950)){
                error("不能为空！");
                this.setState({
                    loading:false,
                });
            }else{
                let setQuota=this.state.setQuota;
                if(this.state.setQuota.setSubaccnum1956){
                    setQuota.accnum.push(this.state.setQuota.setSubaccnum1956);
                    setQuota.accgroup.push(25);
                }
                if(this.state.setQuota.setSubaccnum1954){
                    setQuota.accnum.push(this.state.setQuota.setSubaccnum1954);
                    setQuota.accgroup.push(24);
                }
                if(this.state.setQuota.setSubaccnum1952){
                    setQuota.accnum.push(this.state.setQuota.setSubaccnum1952);
                    setQuota.accgroup.push(23);
                }
                if(this.state.setQuota.setSubaccnum1950){
                    setQuota.accnum.push(this.state.setQuota.setSubaccnum1950);
                    setQuota.accgroup.push(8);
                }
                this.setState({
                    setQuota:setQuota,
                })
                Fetch.quota({method: "POST",
                    body: JSON.stringify({
                        accgroup:this.state.setQuota.accgroup,
                        accnum:this.state.setQuota.accnum,
                        "flag":"post",
                        uid:this.state.userid,
                    })
                }).then((data)=> {
                    let setQuota=this.state.setQuota;
                    setQuota.accnum=[];
                    setQuota.accgroup=[];
                    this.setState({
                        loading:false,
                        setQuota:setQuota,
                    });
                    if(this._ismount){
                        if(data.status=200){
                            success(data.shortMessage);
                            let userInfo=this.state.userList;
                            userInfo[this.state.userid].useraccgroup_status=1;
                            this.setState({
                                userInfo:userInfo,
                            });
                        }else{
                            error(data.shortMessage);
                        }
                    }

                });
            }

        }
        }
    /*配额1956inputnumber内容更改事件
    * 并对输入数字限定为向下取整的整数*/
    onChange1956(value){
        let setQuota=this.state.setQuota;
        if(value){
            setQuota.setSubaccnum1956 = Math.floor(value);
            this.setState({
                setQuota:setQuota,
            })
        }

    }
    /*配额1954inputnumber内容更改事件
    * 并对输入数字限定为向下取整的整数*/
    onChange1954(value){
        let setQuota=this.state.setQuota;
        if(value){
            setQuota.setSubaccnum1954 = Math.floor(value);
            this.setState({
                setQuota:setQuota,
            })
        }

    }
    /*配额1956inputnumber内容更改事件
    * 并对输入数字限定为向下取整的整数*/
    onChange1952(value){
        let setQuota=this.state.setQuota;
        if(value){
            setQuota.setSubaccnum1952 =Math.floor(value);
            this.setState({
                setQuota:setQuota,
            })
        }

    }
    /*配额1956inputnumber内容更改事件
    * 并对输入数字限定为向下取整的整数*/
    onChange1950(value){
        let setQuota=this.state.setQuota;
        if(value){
            setQuota.setSubaccnum1950 =Math.floor(value);
            this.setState({
                setQuota:setQuota,
            })
        }

    }
    /*获取日工资一档设置数据*/
    onChangeSalary1(value){
        let setSalary=this.state.setSalary;
        if(value){
            setSalary.salary_ratio_1=value;
            this.setState({
                setSalary:setSalary,
            })
        }
    }

    /*获取日工资二档设置数据*/
    onChangeSalary10(value){
        let setSalary=this.state.setSalary;
        if(value){
            setSalary.salary_ratio_10=value;
            this.setState({
                setSalary:setSalary,
            })
        }
    }
    /*获取日工资三档设置数据*/
    onChangeSalary30(value){
        let setSalary=this.state.setSalary;
        if(value){
            setSalary.salary_ratio_30=value;
            this.setState({
                setSalary:setSalary,
            })
        }
    }
    /*获取日工资四档设置数据*/
    onChangeSalary50(value){
        let setSalary=this.state.setSalary;
        if(value){
            setSalary.salary_ratio_50=value;
            this.setState({
                setSalary:setSalary,
            })
        }
    }
    /*获取日工资五档设置数据*/
    onChangeSalary70(value){
        let setSalary=this.state.setSalary;
        if(value){
            setSalary.salary_ratio_70=value;
            this.setState({
                setSalary:setSalary,
            })
        }
    }
    /*获取日工资六档设置数据*/
    onChangeSalary100(value){
        let setSalary=this.state.setSalary;
        if(value){
            setSalary.salary_ratio_100=value;
            this.setState({
                setSalary:setSalary,
            })
        }
    }
    /*获取分红契约数字输入框中的值*/
    onChangeDividenSalary(value){
        if(value){
            this.setState({
                setdividend_radio:value,
            })
        }
    }
    /*选择不同的契约类型显示不同的契约html内容*/
    contractType() {
        const setQuota=this.state.setQuota;
        const getSalary=this.state.getSalary;
        const currentUserInfo=this.state.currentUserInfo;
        const ul_0 =<div>

            <ul  className='c_speci_contract0'>
                <li>
                    契约内容：
                </li>
                <li>
                    <span>第一档：日销量≥1万元时，日工资比例为</span>
                    <span style={{display: this.state.checkStatus ? 'inline-block' : 'none'}}>{getSalary.salary_ratio_1}</span>
                    <InputNumber min={getSalary.salary_ratio_1?getSalary.salary_ratio_1:0} max={currentUserInfo.salary_ratio_1} style={{display: this.state.checkStatus ? 'none' : 'inline-block'}} size="small" placeholder={getSalary.salary_ratio_1?getSalary.salary_ratio_1:0} onChange={(value)=>this.onChangeSalary1(value)}  />
                    <span>%；</span><span style={{display: this.state.checkStatus ? 'none' : 'inline-block'}}>({getSalary.salary_ratio_1?getSalary.salary_ratio_1:0}-{currentUserInfo.salary_ratio_1}之间)</span>
                </li>
                <li>
                    <span>第二档：日销量≥10万元时，日工资比例为</span>
                    <span style={{display: this.state.checkStatus ? 'inline-block' : 'none'}}>{getSalary.salary_ratio_10}</span>
                    <InputNumber min={getSalary.salary_ratio_10?getSalary.salary_ratio_10:0} max={currentUserInfo.salary_ratio_10} style={{display: this.state.checkStatus ? 'none' : 'inline-block'}} size="small" placeholder={getSalary.salary_ratio_10?getSalary.salary_ratio_10:0} onChange={(value)=>this.onChangeSalary10(value)} />
                    <span>%；</span>
                    <span style={{display: this.state.checkStatus ? 'none' : 'inline-block'}}>({getSalary.salary_ratio_10?getSalary.salary_ratio_10:0}-{currentUserInfo.salary_ratio_10}之间)</span>
                </li>
                <li>
                    <span>第三档：日销量≥30万元时，日工资比例为</span>
                    <span style={{display: this.state.checkStatus ? 'inline-block' : 'none'}}>{getSalary.salary_ratio_30}</span>
                    <InputNumber min={getSalary.salary_ratio_30?getSalary.salary_ratio_30:0} max={currentUserInfo.salary_ratio_30} style={{display: this.state.checkStatus ? 'none' : 'inline-block'}} size="small" placeholder={getSalary.salary_ratio_30?getSalary.salary_ratio_30:0} onChange={(value)=>this.onChangeSalary30(value)} />
                    <span>%；</span>
                    <span style={{display: this.state.checkStatus ? 'none' : 'inline-block'}}>({getSalary.salary_ratio_30?getSalary.salary_ratio_30:0}-{currentUserInfo.salary_ratio_30}之间)</span>
                </li>
                <li>
                    <span>第四档：日销量≥50万元时，日工资比例为</span>
                    <span style={{display: this.state.checkStatus ? 'inline-block' : 'none'}}>{getSalary.salary_ratio_50}</span>
                    <InputNumber min={getSalary.salary_ratio_50?getSalary.salary_ratio_50:0} max={currentUserInfo.salary_ratio_50} style={{display: this.state.checkStatus ? 'none' : 'inline-block'}} size="small" placeholder={getSalary.salary_ratio_50?getSalary.salary_ratio_50:0} onChange={(value)=>this.onChangeSalary50(value)}/>
                    <span>%；</span>
                    <span style={{display: this.state.checkStatus ? 'none' : 'inline-block'}}>({getSalary.salary_ratio_50?getSalary.salary_ratio_50:0}-{currentUserInfo.salary_ratio_50}之间)</span>
                </li>
                <li>
                    <span>第五档：日销量≥70万元时，日工资比例为</span>
                    <span style={{display: this.state.checkStatus ? 'inline-block' : 'none'}}>{getSalary.salary_ratio_70}</span>
                    <InputNumber min={getSalary.salary_ratio_70?getSalary.salary_ratio_70:0} max={currentUserInfo.salary_ratio_70} style={{display: this.state.checkStatus ? 'none' : 'inline-block'}} size="small" placeholder={getSalary.salary_ratio_70?getSalary.salary_ratio_70:0}  onChange={(value)=>this.onChangeSalary70(value)}/>
                    <span>%；</span>
                    <span style={{display: this.state.checkStatus ? 'none' : 'inline-block'}}>({getSalary.salary_ratio_70?getSalary.salary_ratio_70:0}-{currentUserInfo.salary_ratio_70}之间)</span>
                </li>
                <li>
                    <span>第六档：日销量≥100万元时，日工资比例为</span>
                    <span style={{display: this.state.checkStatus ? 'inline-block' : 'none'}}>{getSalary.salary_ratio_100}</span>
                    <InputNumber min={getSalary.salary_ratio_100?getSalary.salary_ratio_100:0} max={currentUserInfo.salary_ratio_100} style={{display: this.state.checkStatus ? 'none' : 'inline-block'}} size="small" placeholder={getSalary.salary_ratio_100?getSalary.salary_ratio_100:0}  onChange={(value)=>this.onChangeSalary100(value)}/>
                    <span>%；</span>
                    <span style={{display: this.state.checkStatus ? 'none' : 'inline-block'}}>({getSalary.salary_ratio_100?getSalary.salary_ratio_100:0}-{currentUserInfo.salary_ratio_100}之间)</span>
                </li>
            </ul>
            <div  className={this.state.checkStatus? 'c_b_user0 active' : 'c_b_user0'}>
                <p>{this.state.username}</p>
                <p>{this.state.today}</p>
            </div>
            <div className='c_btn0'>
                <Button type="primary" onClick={()=>this.setSalaryData()}  loading={this.state.loading}>{this.state.contractTxt}</Button>
                <Button type="primary" className='c_btn_cancel0'onClick={()=>this.onCancel()}>取消</Button>
            </div>

        </div>;
        const ul_1 =<div>
            <ul className= 'c_speci_contract1'>
                <li>契约内容：</li>
                <li>如该用户每半月结算净盈亏总值时为负数，可获得分红，金额为亏</li>
                <li>
                    <span>损值的</span><span style={{display: this.state.checkStatus ? 'inline-block' : 'none'}}>{this.state.dividend_radio}</span>
                    <InputNumber size="small" placeholder="" min={0} max={100} style={{display: this.state.checkStatus ? 'none' : 'inline-block'}} onChange={(value)=>this.onChangeDividenSalary(value)}/>
                    <span>%。</span>
                </li>
            </ul>
            <div  className={this.state.checkStatus? 'c_b_user1 active' : 'c_b_user1'}>
                <p>{this.state.username}</p>
                <p>{this.state.today}</p>
            </div>
            <div className='c_btn1'>
                <Button type="primary" loading={this.state.loading} onClick={()=>this.setPortionData()}>{this.state.contractTxt}</Button>
                <Button type="primary" className='c_btn_cancel1' onClick={()=>this.onCancel()}>取消</Button>
            </div>

        </div>;
        const ul_2 =<div>
            <ul  className= 'c_speci_contract2'>
                <li className='c-title'>契约内容：</li>
                <li>
                    <span>该用户的奖金组级别为</span>
                    <span style={{display: this.state.checkStatus ? 'inline-block' : 'none'}}>{this.state.getAwardTeam.groupLevel}</span>
                    <InputNumber
                        min={this.state.getAwardTeam.groupLevel}
                        max={this.state.currentUserInfo.prize_group}
                        step={2}
                        style={{ marginLeft: 16,display: this.state.checkStatus ? 'none' : 'inline-block' }}
                        value={this.state.sliderValue}
                        onChange={(value)=>this.onChangeSlider(value)}
                    />
                </li>
                <li style={{display: this.state.checkStatus ? 'none' : 'block'}}>
                    <ul className="c_k_slider">
                        <li>
                            <Icon type="left" className='c_slider_icon' onClick={()=>{
                                let sliderValue=this.state.sliderValue;
                                sliderValue=sliderValue-2;
                                this.setState({
                                    sliderValue:sliderValue,
                                })
                                }}/>
                        </li>
                        <li style={{width: '290px'}}>
                            <Slider min={this.state.getAwardTeam.groupLevel} tipFormatter={null}
                                    max={this.state.currentUserInfo.prize_group}
                                    onChange={(value)=>{this.onChangeSlider(value)}}
                                    value={this.state.sliderValue}
                                    step={2}
                            />

                        </li>
                        <li>
                            <Icon type="right" className='c_slider_icon' onClick={()=>{
                                let sliderValue=this.state.sliderValue;
                                sliderValue=sliderValue+2;
                                this.setState({
                                    sliderValue:sliderValue,
                                })
                            }}/>
                        </li>
                    </ul>
                </li>
                <li style={{marginLeft:142,display: this.state.checkStatus ? 'none' : 'block'}}>{this.state.getAwardTeam.groupLevel}-{this.state.currentUserInfo.prize_group}</li>
            </ul>
            <div  className={this.state.checkStatus? 'c_b_user2 active' : 'c_b_user2'}>
                <p>{this.state.username}</p>
                <p>{this.state.today}</p>
            </div>
            <div className='c_btn2'>
                <Button type="primary" loading={this.state.loading} onClick={()=>this.setAwardTeamData()}>{this.state.contractTxt}</Button>
                <Button type="primary" className='c_btn_cancel2' onClick={()=>this.onCancel()}>取消</Button>
            </div>
        </div>;
        const ul_3 =<div>

            <ul className='c_speci_contract0'>
                <li>
                    契约内容：
                </li>
                <li>
                    该用户可继续推广下级，其中可推广
                </li>
                <li style={{display: this.state.getQuota.quota1956display ? 'block' : 'none'}}>
                    <span>奖金组1956的配额为 {this.state.getQuota.subaccnum1956?this.state.getQuota.subaccnum1956:0} 个，</span>
                    <div style={{display: this.state.checkStatus ? 'none' : 'inline-block'}}>再增加
                        <InputNumber min={0} max={this.state.getQuota.accnum1956} step={1} size="small" value={setQuota.setSubaccnum1956} placeholder="" onChange={(value)=>this.onChange1956(value)}/>
                        <span>个（剩余可分配{this.state.getQuota.accnum1956}个）</span>
                    </div>

                </li>
                <li style={{display: this.state.getQuota.quota1954display ? 'block' : 'none'}}>
                    <span>奖金组1954的配额为 {this.state.getQuota.subaccnum1954?this.state.getQuota.subaccnum1954:0} 个，</span>
                    <div style={{display: this.state.checkStatus ? 'none' : 'inline-block'}}>再增加
                        <InputNumber min={0} max={this.state.getQuota.accnum1954} step={1} size="small" value={setQuota.setSubaccnum1954} placeholder="" onChange={(value)=>this.onChange1954(value)}/>
                        <span>个（剩余可分配{this.state.getQuota.accnum1954}个）</span>
                    </div>

                </li>
                <li style={{display: this.state.getQuota.quota1952display ? 'block' : 'none'}}>
                    <span>奖金组1952的配额为 {this.state.getQuota.subaccnum1952?this.state.getQuota.subaccnum1952:0} 个，</span>
                    <div style={{display: this.state.checkStatus ? 'none' : 'inline-block'}}>再增加
                        <InputNumber min={0} max={this.state.getQuota.accnum1952} step={1} size="small" value={setQuota.setSubaccnum1952} placeholder=""  onChange={(value)=>this.onChange1952(value)}/>
                        <span>个（剩余可分配{this.state.getQuota.accnum1952}个）</span>
                    </div>

                </li>
                <li style={{display: this.state.getQuota.quota1950display ? 'block' : 'none'}}>
                    <span>奖金组1950的配额为 {this.state.getQuota.subaccnum1950?this.state.getQuota.subaccnum1950:0} 个，</span>
                    <div style={{display: this.state.checkStatus ? 'none' : 'inline-block'}}>再增加
                        <InputNumber min={0} max={this.state.getQuota.accnum1950} step={1} size="small" value={setQuota.setSubaccnum1950} placeholder="" onChange={(value)=>this.onChange1950(value)}/>
                        <span>个（剩余可分配{this.state.getQuota.accnum1950}个）</span>
                    </div>

                </li>
                <li>
                    奖金组为1948及以下剩余配额：无限。
                </li>

            </ul>
            <div  className={this.state.checkStatus? 'c_b_user2 active' : 'c_b_user2'}>
                <p>{this.state.username}</p>
                <p>{this.state.today}</p>
            </div>
            <div className='c_btn0'>
                <Button type="primary" onClick={()=>this.setQuotaData()} loading={this.state.loading}>{this.state.contractTxt}</Button>
                <Button type="primary" className='c_btn_cancel0'onClick={()=>this.onCancel()}>取消</Button>
            </div>

        </div>;
        switch (parseInt(this.state.navListIndex)) {
            case 0:
                return ul_0;
                break;
            case 1:
                return ul_1;
                break;
            case 2:
                return ul_2;
                break;
            case 3:
                return ul_3;
                break;
        }
    }
    showModal() {
        this.setState({
            visible: true,
        });
    };
    /*在切换不同用户
    * 或者切换不同契约类型时，
    * 请求对应用户下的特定契约类型的数据
    * 传入参数，@index,此时的契约类型索引
    * @uid,当前用户id的userid
    * */
    getCurUserCurContractData(index,uid){
        let userInfo = this.state.userList;
        let curIndex = index||this.state.navListIndex;
        let userid = uid||this.state.userid;
        switch (parseInt(curIndex)){
            case 0:
                if(parseInt(userInfo[userid].daily_salary_status)){
                    this.setState({
                        checkStatus:true,
                        contractTxt:"修改契约",
                    })
                }else{
                    this.setState({
                        checkStatus:false,
                        contractTxt:"签订契约",
                    })
                }
                this.getSalaryData(userid);
                break;
            case 1:
                if(parseInt(userInfo[userid].dividend_salary_status)){
                    this.setState({
                        checkStatus:true,
                        contractTxt:"修改契约",
                    })
                }else{
                    this.setState({
                        checkStatus:false,
                        contractTxt:"签订契约",
                    })
                }
                this.getPortionData(userid);
                break;
            case 2:
                this.setState({
                    checkStatus:true,     //奖金组契约一进入必定是查看状态
                    contractTxt:"修改契约",
                })
                this.getAwardTeamData(userid);
                break;
            case 3:
                if(parseInt(userInfo[userid].useraccgroup_status)){
                    this.setState({
                        checkStatus:true,
                        contractTxt:"修改契约",
                    })
                }else{
                    this.setState({
                        checkStatus:false,
                        contractTxt:"签订契约",
                    })
                }
                this.getQuotaData(userid);
                break;

        }
    }
    /*选择下级用户*/
    onSelectUser(value){
        let userInfo=this.state.userList;
        let contractInfo=this.state.contractInfo;
        this.setState({
            userid:value.key,
            username:value.label,
        })
        if(parseInt(userInfo[value.key].prize_group)<1950) {
            if(contractInfo[contractInfo.length-1].id==3){
                contractInfo.pop();
            }
            if(this.state.navListIndex==3){
                this.onSelectSys(0);
                $(".ant-select-selection-selected-value").text("日工资契约");

            }


        }else{
            if(contractInfo[contractInfo.length-1].id!=3){
                contractInfo.push({
                    id:3,
                    contract:"配额契约",
                });
            }
        }
        this.setState({
            contractInfo:contractInfo,
        })
        this.getCurUserCurContractData('',value.key);


    }
    /*选择特定类型的契约
    * 从而更改不同的样式背景
    * 获取当前用户在特定契约下是否已经签订过契约，从而决定是查看状态，还是修改状态
    * */
    onSelectSys(value){
        console.log("fakdjfladfj",value)
        let index=value;
        if(value==3){
            index=2;
        }
        this.setState({
            navListIndex: value,
            modalClass:"center-modal-c"+index,


        })
        this.getCurUserCurContractData(value,'');

    };
    onCancel(){
        this.props.transferMsg(false);


    };
    // 滑动条,数字输入框更改数据
    onChangeSlider(value) {
        if(value){

                this.setState({
                    sliderValue:Math.floor(value),
                })


        }else{
            this.setState({
                sliderValue:this.state.getAwardTeam.groupLevel,
            })

        }

    };
    componentDidMount() {
        this._ismount = true;
        var myDate=new Date();
        let today=null; //显示当天日期
        let month=null; //当前月
        if(parseInt(myDate.getMonth()+1)<10){
            month = "0"+ parseInt(myDate.getMonth()+1);
        }else{
            month = parseInt(myDate.getMonth()+1);
        }
        today=myDate.getFullYear()+'-'+month+'-'+myDate.getDate();
        this.setState({
            today:today,
        })
        this.getUserInfo();

    };
    componentWillUnmount(){
        this._ismount = false;
    }
    render() {
        const userInfo=this.state.userList;
        const contractInfo= this.state.contractInfo;
        return (
            <Modal ref="myModal"
                   title=""
                   wrapClassName={this.state.modalClass}
                   visible={this.props.visible}
                   footer={null}
                   closable={false}
            >
               <img className='c_m_guanbi' src={guanbi}  style={{display: this.state.navListIndex==4 ? 'block' : 'none'}} onClick={()=>this.onCancel()}/>
                <div className="c_aa_form">

                    <ul className="c_aa_list">
                        <li className="c_user">
                            <span className="c_aa_left_text">用户名：</span>
                            <Select size="large" style={{ width: 280 }} labelInValue onChange={(value)=>{this.onSelectUser(value)}} getPopupContainer={() => document.getElementsByClassName('c_user')[0]} placeholder="请选择需要创建契约的用户">
                                {userInfo.map((item, index) => {
                                    return (
                                        <Option value={index} key={index}>{item.name}</Option>
                                    )
                                })
                                }
                            </Select>
                        </li>
                        <li className="c_contractType">
                            <span className="c_aa_left_text">契约类型：</span>
                            <Select className="c_aa_marg" size="large"   style={{ width: 280 }}  onChange={(value)=>{this.onSelectSys(value)}} git={() => document.getElementsByClassName('c_contractType')[0]} placeholder="请选择需要创建契约的系统">
                                {this.state.userid?contractInfo.map((item,index) => {
                                    return (
                                        <Option value={item.id} key={item.id}>{item.contract}</Option>
                                    )
                                }):''
                                }
                            </Select>
                        </li>

                    </ul>
                    {this.contractType()}
                </div>
            </Modal>
        )
    }
}
