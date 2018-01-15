/*走势图*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { DatePicker, Checkbox, Table, Select, Input,  Button, Icon } from 'antd';
import './Tendency.scss'
import 'whatwg-fetch'
import Fetch from '../../Utils'
const Option = Select.Option;

let tableData = [];     //走势图表格内容
let columns=[];         //走势图表格表头
let trendAvailWidth=window.screen.availWidth;   //界面的有效宽度，控制表格滚动条出现的阈值
@observer
export default class Tendency extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startValue: null,           //表格查询起始日期
            endValue: null,             //表格查询结束日期
            endOpen: false,
            postData:{ //查询表格数据的requestData
                lotteryId:1,              //查询彩种
                issueCount:30,               //查询期数
                TrendType:1                //查询走势图类型

            },
            loading: true,
            tableTrendTotal:[],                 //所有彩种对应包含的走势图类型
            lotteryValue:"重庆时时彩",          //当前彩种名称
            lotteryBigType:null,                  //每一个彩种对应的大彩种，例：重庆时时彩属于时时彩
            lotteryCurType:"五星基本走势图" ,                  //当前彩种的走势图类型对应名字



        }
    };

/*处理时间对象 begin*/
    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        console.log("startValue5555",startValue);
        console.log("endValue",endValue);
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }

    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
        console.log("startValue",this.state.startValue);
    }

    onStartChange = (date, dateString) => {
        this.onChange('startValue',dateString);
        console.log("startValue22",dateString);
    }

    onEndChange = (date, dateString) => {
        this.onChange('endValue', dateString);
    }

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }

    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    }
/*处理时间对象 end*/
/*选择不同走势图类型*/
    handleChangeMethod(value){
        console.log("handleChangeMethod",value);
        let postData=this.state.postData,
            lotteryCurType=null;
        postData.TrendType=value;
        for(let i=0;i<this.state.tableTrendTotal[this.state.postData.lotteryId].length;i++){
            if(value==this.state.tableTrendTotal[this.state.postData.lotteryId][i].id){
                lotteryCurType = this.state.tableTrendTotal[this.state.postData.lotteryId][i].name;
            }
        }
        this.setState({
            postData: postData,
            lotteryCurType:lotteryCurType,
        })
        this.getTable();
    };

    /*选择不同彩种类型
    * 并请求对应彩种下的第一种走势图类型*/
    handleChangePlayType(value){
        console.log("value",value);
        let postData=this.state.postData;
        postData.lotteryId=value;
        postData.TrendType=this.state.tableTrendTotal[value][0].id;
        console.log("postData.TrendType",postData.TrendType);
        this.setState({
            postData: postData,
            lotteryCurType:this.state.tableTrendTotal[value][0].name,
        })

        this.getTable();
    }

/*
* 输入：全局变量当前彩种，用户选择走势图类型，显示期数，开始时间
* 查询走势图信息
* */
   getTable(issueCount){
       /*每次请求前将表单数据清空*/
       tableData = [];
       columns=[];
       issueCount=issueCount||this.state.postData.issueCount;
       this.setState({ loading: true });
       Fetch.trend(
           {
               method: "POST",
               body:JSON.stringify({
                   lotteryId:this.state.postData.lotteryId,
                   issueCount:issueCount,
                   TrendType:this.state.postData.TrendType,
                   starttime: this.state.startValue,
                   endtime:this.state.endValue,
               } )
           }).then((data)=>{
           console.log('trend',data)
           console.log('qwwera',data.repsoneContent.Trend);

           if(this._ismount) {
               if(data.status==200) {
                    /*请求到数据后立马获取当前所有彩种以及相应彩种的所有走势图类型,只处理一次
                    * 并将走势图类型对应上彩种id进行数组重构
                    * 通过判断数组变量tableTrendTotal的长度判断是否进行数组重构(有待处理）
                    * */

                        let trendPic=[],
                            tableTrendTotal=[],
                            tableTrend=[];
                        trendPic=data.repsoneContent.aData.trendPic;
                        for(let i=0;i<23;i++){
                            tableTrend=[];
                            for(let x in trendPic[data.repsoneContent.aData.lotteryList[i].lotteryid][0]){
                                tableTrend.push({
                                    id:x,
                                    name:trendPic[data.repsoneContent.aData.lotteryList[i].lotteryid][0][x],
                                })

                            }
                            tableTrendTotal[data.repsoneContent.aData.lotteryList[i].lotteryid]=tableTrend;
                        }


                        console.log("tableTrendTotal",tableTrendTotal);
                        this.setState({
                            tableTrendTotal:tableTrendTotal,

                        })

                /*重构后台返回的lotteryList
                * 将彩种id作为索引，彩种大类作为变量内容
                * */
               let lotteryBigType=[];
                for(let i=0; i<23; i++){
                    lotteryBigType[data.repsoneContent.aData.lotteryList[i].lotteryid]=data.repsoneContent.aData.lotteryList[i].lotterytype;
                }
                console.log("lotteryBigType",lotteryBigType);
                   /*表头 begin*/

                   /*控制特定列进行分列
                   * 当table内容行数>=data.repsoneContent.bonuscode.length（后台返回表格数据长度）对应表头不分列
                   * */
                   const renderContent = (value, row, index) => {
                       const obj = {
                           children: value,
                           props: {},
                       };
                       if (index >= data.repsoneContent.bonuscode.length) {
                           obj.props.colSpan = 0;
                       }
                       return obj;
                   };
                   /*表头添加期号
                   * 当table内容行数>=data.repsoneContent.bonuscode.length（后台返回表格数据长度）期号表头不分列
                   * */
                   columns.push({
                       title: '期号',
                       dataIndex: "issue",
                       key: 'issue',
                       render(value, row, index) {
                           let obj = {
                               children: value,
                               props: {}
                           };
                           if (index >= data.repsoneContent.bonuscode.length) {
                               obj.props.colSpan = 0;
                           }
                           return obj;
                       }

                   });
                   /*获取开奖号码个数，从而控制表头开奖号码分成多少列*/
                   let headAwardNo=[];
                   let curHeardAwrdNo=data.repsoneContent.bonuscode[0].code;
                   let iftwoballH=curHeardAwrdNo.charAt(2);
                   if(iftwoballH!=" "){
                       headAwardNo=curHeardAwrdNo.split("");
                   }else{

                       headAwardNo=curHeardAwrdNo.split(" ");
                   }
                    /*表头添加开奖号码
                    * 当table内容行数>=data.repsoneContent.bonuscode.length（后台返回表格数据长度）开奖号码表头分割成开奖号码个数（headAwardNo.length + 1）对应的列数
                    * */
                   columns.push({
                       title: '开奖号码',
                       dataIndex: "award0",
                       key: 'awardNo',
                       className:"trend_awardNo",
                       onHeaderCell(column){
                           console.log("onHeaderCel",column);
                       },
                       colSpan: headAwardNo.length,
                       render(value, row, index) {
                           let obj = {
                               children: value,
                               props: {}
                           };

                           if (index >= data.repsoneContent.bonuscode.length) {
                               obj.props.colSpan = headAwardNo.length + 1;
                           }


                           return obj;
                       }
                   });
                   /*开奖号码根据其开奖位数分成对应的列数*/
                   for (let i = 1; i < headAwardNo.length; i++) {
                       columns.push({
                           title: `award${i}`,
                           colSpan: 0,
                           key: `award${i}`,
                           className:"trend_awardNo",
                           dataIndex: `award${i}`,
                           render: renderContent,
                       })
                   }
                    /*将表头的第一行用data.repsoneContent.lcodegroup遍历
                    *将表头的第二行用data.repsoneContent.vaildnum遍历
                    *当 data.repsoneContent.vaildnum为一维数组时，所有返回表头用同一列遍历
                    * 并且渲染表尾大表头第一列colSpan=data.repsoneContent.vaildnum.length,大表头下剩下表头colSpan=0
                    *当 data.repsoneContent.vaildnum为二维数组时，相应表头用此变量下的对应数组遍历
                    * 并且渲染表尾大表头第一列colSpan=data.repsoneContent.vaildnum[i].length,大表头下剩下表头colSpan=0
                    *当data.repsoneContent.vaildnum对应数组下为空时，表头没有子元素
                    * */

                   let vailLen=data.repsoneContent.vaildnum.length;
                   let columnChildren = [];
                   for (let i = 0; i < data.repsoneContent.lcodegroup.length; i++) {

                       if(data.repsoneContent.vaildnum[0] instanceof Array){
                           for(let z = 0;z < data.repsoneContent.vaildnum[i].length ; z++){
                               debugger;
                                if( z==0){
                                    columnChildren.push({
                                        key: `children${i}${z}`,
                                        dataIndex: `children${i}${z}`,
                                        title: data.repsoneContent.vaildnum[i][z],
                                        render: (value, row, index) => {
                                            const obj = {
                                                children: value,
                                                props: {},
                                            };
                                            if (index >= data.repsoneContent.bonuscode.length+3) {
                                                obj.props.colSpan = data.repsoneContent.vaildnum[i].length;
                                            }
                                            return obj;
                                        },
                                    });
                                }else{
                                    columnChildren.push({
                                        key: `children${i}${z}`,
                                        dataIndex: `children${i}${z}`,
                                        title: data.repsoneContent.vaildnum[i][z],
                                        render: (value, row, index) => {
                                            const obj = {
                                                children: value,
                                                props: {},
                                            };
                                            if (index >= data.repsoneContent.bonuscode.length+3) {
                                                obj.props.colSpan = 0;
                                            }
                                            return obj;
                                        },
                                    });
                                }
                           }

                       }else{

                           for (let j = 0; j <data.repsoneContent.vaildnum.length; j++) {
                                if(j==0){
                                    columnChildren.push({
                                        key: `children${i}${j}`,
                                        dataIndex: `children${i}${j}`,
                                        title: data.repsoneContent.vaildnum[j],
                                        render: (value, row, index) => {
                                            const obj = {
                                                children: value,
                                                props: {},
                                            };
                                            if (index >= data.repsoneContent.bonuscode.length+3) {
                                                obj.props.colSpan = data.repsoneContent.vaildnum.length;
                                            }
                                            return obj;
                                        },
                                    });
                                }else{
                                    columnChildren.push({
                                        key: `children${i}${j}`,
                                        dataIndex: `children${i}${j}`,
                                        title: data.repsoneContent.vaildnum[j],
                                        render: (value, row, index) => {
                                            const obj = {
                                                children: value,
                                                props: {},
                                            };
                                            if (index >= data.repsoneContent.bonuscode.length+3) {
                                                obj.props.colSpan = 0;
                                            }
                                            return obj;
                                        },
                                    });
                                }
                           }
                       }
                    if(columnChildren==''){
                        columns.push({
                            key: `colums${i}`,
                            title: data.repsoneContent.lcodegroup[i],
                            dataIndex: `children${i}0`,

                        });
                    }else{
                        columns.push({
                            key: `colums${i}`,
                            dataIndex: `colums${i}`,
                            title: data.repsoneContent.lcodegroup[i],
                            children: columnChildren,
                        });
                    }


                       columnChildren=[];

                   }
                   /*表头 end*/

                   /*表格内容 begin*/



                    /*将表格内容用data.repsoneContent.bonuscode进行遍历，依据表格表头的dataindex*/
                   for (let i = 0; i < data.repsoneContent.bonuscode.length; i++) {
                       tableData.push({
                           issue: data.repsoneContent.bonuscode[i].issue,
                           key:"issue${i}",
                       });
                       /*将开奖号码重新封装成一个数组*/
                       let tableAwardNo=[];
                       let curAwrdNo=data.repsoneContent.bonuscode[i].code;
                       let iftwoball=curAwrdNo.charAt(2);
                       if(iftwoball!=" "){
                           tableAwardNo=curAwrdNo.split("");
                       }else{
                           console.log("dsgg");

                           tableAwardNo=curAwrdNo.split(" ");
                       }

                        /*根据开奖号码个数， 分别遍历开奖号码，并将每列加入键值*/
                       for (let d = 0; d < tableAwardNo.length; d++) {
                           tableData[i]["key"]=`tableData${i}${d}`;
                           tableData[i][`award${d}`] = tableAwardNo[d];

                       }
                       /*遍历表格中的内容，显示的内容除了单表头，都是获取对应位置的表头标题
                       * 当前走势图是多表头时，
                       * 1.彩种大系列为时时彩，不管是数字还是文字，返回的都是当前位置
                       * 1.1 当大表头显示多个内容时，
                       * 1.2当大表头显示的是文字时，
                       * 2.彩种大系列为11选5，
                       * 1.1 当大表头显示多个内容时，
                       * 1.1.1 当前显示内容为数字时，返回的都是当前位置+1
                       * 1.1.1 当前显示内容为文字时，返回的都是当前位置
                       * 1.2当大表头显示单个内容时，
                       * 1.2.1 当前显示内容为数字时，返回的都是当前位置+1
                       * 1.2.2 当前显示内容为文字时，返回的都是当前位置
                       * 当前走势图为单表头时，
                       * 1.显示的内容就是当前返回数据data.repsoneContent.bonuscode[i].wei[j]的内容
                       **/
                       for (let j = 0; j < data.repsoneContent.lcodegroup.length; j++) {
                            if(!(data.repsoneContent.vaildnum[0] instanceof Array)){ //多表头,并且表头内容都是同样的
                                if(lotteryBigType[this.state.postData.lotteryId]==0){ //时时彩系列，不管是数字还是文字，返回的都是当前位置
                                    if(data.repsoneContent.bonuscode[i].wei[j] instanceof Array){//同一大表头中显示多个数据

                                        for(let z=0; z<data.repsoneContent.bonuscode[i].wei[j].length;z++){
                                            let currentWei = data.repsoneContent.bonuscode[i].wei[j][z];
                                            tableData[i][`children${j}${currentWei}`] = data.repsoneContent.vaildnum[currentWei];
                                        }
                                    }else{//同一大表头中显示1个数据
                                        let currentWei = data.repsoneContent.bonuscode[i].wei[j];
                                        tableData[i][`children${j}${currentWei}`] = data.repsoneContent.vaildnum[currentWei];
                                    }

                                }else if(lotteryBigType[this.state.postData.lotteryId]==2){ //11选5系列

                                    if(data.repsoneContent.bonuscode[i].wei[j] instanceof Array){//同一大表头中显示多个数据
                                        for(let z=0; z<data.repsoneContent.bonuscode[i].wei[j].length;z++){
                                            let currentWei=null;
                                            if(data.repsoneContent.vaildnum[0]=="1"){ //当前显示为数据
                                                currentWei = data.repsoneContent.bonuscode[i].wei[j][z]-1;
                                            }else{//当前显示为文字
                                                currentWei = data.repsoneContent.bonuscode[i].wei[j][z];
                                            }

                                            tableData[i][`children${j}${currentWei}`] = data.repsoneContent.bonuscode[i].wei[j][z];
                                        }
                                    }else{//同一大表头中显示1个数据
                                        let currentWei = null;
                                        if(data.repsoneContent.vaildnum[0]=="1"){ //当前显示为数据
                                            currentWei = data.repsoneContent.bonuscode[i].wei[j]-1;
                                        }else{//当前显示为文字
                                            currentWei = data.repsoneContent.bonuscode[i].wei[j];
                                        }
                                        tableData[i][`children${j}${currentWei}`] = data.repsoneContent.bonuscode[i].wei[j];
                                    }
                                }
                            }else{
                               // debugger;
                                if(data.repsoneContent.vaildnum[j] instanceof Array){ //多表头
                                    if(lotteryBigType[this.state.postData.lotteryId]==0){ //时时彩系列
                                        if(data.repsoneContent.bonuscode[i].wei[j] instanceof Array){//同一大表头中显示多个数据

                                            for(let z=0; z<data.repsoneContent.bonuscode[i].wei[j].length;z++){
                                                let currentWei = data.repsoneContent.bonuscode[i].wei[j][z];
                                                tableData[i][`children${j}${currentWei}`] = data.repsoneContent.vaildnum[j][currentWei];
                                            }
                                        }else{ //同一大表头中仅显示一个数据
                                            let currentWei = data.repsoneContent.bonuscode[i].wei[j];
                                            tableData[i][`children${j}${currentWei}`] = data.repsoneContent.vaildnum[j][currentWei];
                                            console.log("data.repsoneContent.vaildnum[j][currentWei]",data.repsoneContent.vaildnum[j][currentWei]);
                                        }

                                    }else if(lotteryBigType[this.state.postData.lotteryId]==2){ //11选5系列
                                        if(data.repsoneContent.bonuscode[i].wei[j] instanceof Array){//同一大表头中显示多个数据
                                            for(let z=0; z<data.repsoneContent.bonuscode[i].wei[j].length;z++){
                                                let currentWei=null;
                                                if(data.repsoneContent.vaildnum[j][0]=="1"){ //当前显示为数据
                                                    currentWei = data.repsoneContent.bonuscode[i].wei[j][z]-1;
                                                }else{//当前显示为文字
                                                    currentWei = data.repsoneContent.bonuscode[i].wei[j][z];
                                                }

                                                tableData[i][`children${j}${currentWei}`] = data.repsoneContent.bonuscode[i].wei[j][z];
                                            }
                                        }else{//同一大表头中显示1个数据
                                            let currentWei = null;
                                            if(data.repsoneContent.vaildnum[0]=="1"){ //当前显示为数据
                                                currentWei = data.repsoneContent.bonuscode[i].wei[j]-1;
                                            }else{//当前显示为文字
                                                currentWei = data.repsoneContent.bonuscode[i].wei[j];
                                            }
                                            tableData[i][`children${j}${currentWei}`] = data.repsoneContent.bonuscode[i].wei[j];
                                        }
                                    }
                                }else{ //单表头
                                    tableData[i][`children${j}0`] = data.repsoneContent.bonuscode[i].wei[j];
                                }
                            }
                       }
                   }

                    /*表格内容添加标准间隔，依据data.repsoneContent.vaildge
                    *标准次数，依据data.repsoneContent.vaildci
                    *当前次数，依据data.repsoneContent.appears
                    * 表格底部显示
                    * 标准间隔行数为tableData[data.repsoneContent.bonuscode.length]，标准次数和当前次数,位置分别在前一行上+1
                    * */
                   tableData.push({
                       issue: "标准间隔",
                       award0: "标准间隔",
                       key:"standardGap",
                   })
                   tableData.push({
                       issue: "标准次数",
                       award0: "标准次数",
                       key:"standardnum",
                   })
                   tableData.push({
                       issue: "当前次数",
                       award0: "当前次数",
                       key:"curnum",
                   })
                   tableData.push({
                       issue: "位置",
                       award0: "位置",
                       key:"position",
                   })
                   for (let i = 0; i < data.repsoneContent.appears.length; i++) {
                       for (let j = 0; j < data.repsoneContent.appears[i].length; j++) {
                           tableData[data.repsoneContent.bonuscode.length][`children${i}${j}`] = data.repsoneContent.vaildge;
                           tableData[data.repsoneContent.bonuscode.length+1][`children${i}${j}`] = data.repsoneContent.vaildci;
                           tableData[data.repsoneContent.bonuscode.length+2][`children${i}${j}`] = data.repsoneContent.appears[i][j];
                       }

                   }
                   /*
                   * 表格底部显示，同表格头部第一行内容一样*/
                   for (let j = 0; j < data.repsoneContent.lcodegroup.length; j++){
                           tableData[data.repsoneContent.bonuscode.length+3][`children${j}0`] = data.repsoneContent.lcodegroup[j];

                   }


                    /*表格内容 end*/

                   console.log("tableData",tableData);
                   console.log("columns",columns);


                   this.setState({
                       trendPic:data.repsoneContent.aData.trenPic,
                       tableTrend:tableTrend,
                       loading: false,
                       lotteryBigType:lotteryBigType,
                   })
               }else{

               }
           }
       })
   }
   /*倒转当前表格*/
    reverseTable() {

    }
    /*选择最近30期，最近50期，最近100期,并请求对应的表格行数*/
    onShortcutTime(val) {
        let postData = this.state.postData;
        if(postData.issueCount == val) {
        }else{
            postData.issueCount = val;
            this.getTable(val);
        }
        this.setState({postData: postData});
    };

    componentWillMount(){
        this._ismount = false;
        this.getTable();
    };

    componentDidMount() {
        this._ismount = true;
    };

    render() {
        const tableTrendTotal=this.state.tableTrendTotal;
        const { startValue, endValue, endOpen } = this.state;
        const shortcutTime = [
            {
                text: '最近30期',
                id: 30
            },{
                text: '最近50期',
                id: 50
            },{
                text: '最近100期',
                id: 100
            }
        ];
        const footer = () => 'Here is footer';
        return (
            <div className='tendency-main'>
                <ul className='t-top'>
                    <li>
                        <Select style={{ minWidth: 160 }}   defaultValue={this.state.lotteryValue} onChange={(value)=>{this.handleChangePlayType(value)}}>
                            <Option value="1" key="1">重庆时时彩</Option>
                            <Option value="5" key="5">山东11选5</Option>
                            <Option value="6" key="6">新疆时时彩</Option>
                            <Option value="7" key="7">江西11选5</Option>
                            <Option value="8" key="8">广东11选5</Option>
                            <Option value="11" key="11">福彩3D</Option>
                            <Option value="13" key="13">天津时时彩</Option>
                            <Option value="14" key="14">泰国300秒</Option>
                            <Option value="19" key="19">泰国60秒</Option>
                            <Option value="21" key="21">泰国11选5</Option>
                            <Option value="23" key="23">泰国秒秒彩</Option>
                            <Option value="26" key="26">北京pk10</Option>
                            <Option value="29" key="29">腾讯分分彩</Option>
                        </Select>
                    </li>
                    <li>
                        <Select  style={{ minWidth: 160 }}  value={this.state.lotteryCurType}  onChange={(value)=>{this.handleChangeMethod(value)}}>
                            {
                                !this.state.loading? tableTrendTotal[this.state.postData.lotteryId].map((value,index)=>{
                                    return (
                                        <Option value={value.id} key={value.id}>{value.name}</Option>
                                    )
                                }):""
                            }
                        </Select>
                    </li>
                    <li>
                        <Checkbox id="has_line" >显示走势折线</Checkbox>
                    </li>
                    <li>
                        <a className='t-r-table' href="javascript:void(0)" onClick={()=>{this.reverseTable()}} >表格上下转换</a>
                    </li>
                    <li></li>
                    <li>当前统计期数：{this.state.postData.issueCount}</li>
                    <li>
                        <ul className='t-period clear'>
                            {
                                shortcutTime.map((item,i)=>{
                                    return <li className={item.id === this.state.postData.issueCount ? 't_period_btn_active' : ''} onClick={()=>{this.onShortcutTime(item.id)}} key={item.id}>{item.text}</li>
                                })
                            }
                        </ul>
                    </li>
                    <li>日期：
                        <DatePicker
                            disabledDate={()=>{this.disabledStartDate(this.state.startValue)}}
                            showTime
                            format="YYYY-MM-DD"
                            placeholder="开始时间"
                            onChange={(date, dateString)=>{this.onStartChange(date, dateString)}}
                            onOpenChange={this.handleStartOpenChange}
                        />至
                        <DatePicker
                            disabledDate={()=>{this.disabledEndDate(this.state.endValue)}}
                            showTime
                            format="YYYY-MM-DD"
                            placeholder="结束时间"
                            onChange={(date, dateString)=>{this.onEndChange(date, dateString)}}
                            open={endOpen}
                            onOpenChange={this.handleEndOpenChange}
                        />
                    </li>
                    <li>
                        <Button type="primary"  onClick={()=>{this.getTable()}}>
                          查询
                        </Button>
                    </li>
                </ul>
                <div className="c_table" id="chartsTable">
                    {!this.state.loading ? <Table columns={columns}
                                                 key="trend"
                                                 dataSource={tableData}
                                                 pagination={false}
                                                 bordered={true}
                                                 loading={this.state.loading}
                                                 onChange={this.handleTableChange}
                                                 scroll={{ x: trendAvailWidth}}
                                                 className="trend_table_wrap"



                    />:""}

                </div>
            </div>
        );
    }
}
