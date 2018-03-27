/*走势图*/
import React, {Component} from 'react';
import { DatePicker, Checkbox,  Select,  Button } from 'antd';
import './Tendency.scss'
import Fetch from '../../Utils'
import NormalTable from "./NormalTable/NormalTable";
import ReverseTable from "./ReverseTable/ReverseTable";
import {setStore,getStore} from "../../CommonJs/common";
const Option = Select.Option;

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
            responseData:null,         /*请求返回的数据，作为属性传给走势图表格*/
            checked:true,         /*控制折线的显示*/
            reversetable:false, /*控制是否上下转换表格，boolean*/
        }
    };
    componentWillMount(){
        this.getTable();
    };

    componentDidMount() {
        this._ismount = true;
    };
    componentWillUnmount() {
        this._ismount = false;
    };
/*处理时间对象 begin*/
    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
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
    }

    onStartChange = (date, dateString) => {
        this.onChange('startValue',dateString);
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
        let postData=this.state.postData;
        postData.lotteryId=value;
        postData.TrendType=this.state.tableTrendTotal[value][0].id;
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
           if(this._ismount) {
               if(data.status==200) {

                   /*请求到数据后立马获取当前所有彩种以及相应彩种的所有走势图类型,只处理一次
                   * 并将走势图类型对应上彩种id进行数组重构
                   * 通过判断数组变量tableTrendTotal的长度判断是否进行数组重构(有待处理）
                   * */
                let tableTrendTotal=[],
                    tableTrend=[],
                    lotteryListFlag = data.repsoneContent.aData.lotteryList,
                    trendPic = data.repsoneContent.aData.trendPic;
                for(let i=0; i<lotteryListFlag.length; i++){
                    tableTrend=[];
                    for(let x in trendPic[lotteryListFlag[i].lotteryid][0]){
                        tableTrend.push({
                            id:x,
                            name:trendPic[lotteryListFlag[i].lotteryid][0][x],
                        })
                    }
                    tableTrendTotal[lotteryListFlag[i].lotteryid]=tableTrend;
                }
                this.setState({
                    tableTrendTotal:tableTrendTotal,
                });

                /*重构后台返回的lotteryList
                * 将彩种id作为索引，彩种大类作为变量内容
                * */
               let lotteryBigType=[];
                for(let i=0; i<lotteryListFlag.length; i++){
                    lotteryBigType[lotteryListFlag[i].lotteryid] = lotteryListFlag[i].lotterytype;
                }
                   this.setState({
                       trendPic:data.repsoneContent.aData.trenPic,
                       tableTrend:tableTrend,
                       loading: false,
                       lotteryBigType:lotteryBigType,
                       responseData:data,
                   })
               }else{

               }
           }
       })
   }
   /*倒转当前表格*/
    reverseTable() {
        setStore("reversetable",!this.state.reversetable);
        this.setState((prevState, props) => ({
            reversetable: !prevState.reversetable,
        }));

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
    /*控制折线图的显示隐藏*/
    displayChartLine(e){
        this.setState({
            checked: e.target.checked,
        });

    }
    /*正确显示表格，包括倒转表格和正常表格,当彩种为北京pk10时，表格生成滚动条*/
    displapyTable(){
         let reverseState= getStore("reversetable") ||this.state.reversetable;/*首先从缓存中获取表格显示样式*/
         if(!this.state.loading){
             if(reverseState){
                 return <ReverseTable responseData={this.state.responseData}  checked={this.state.checked} lotteryId={this.state.postData.lotteryId}/>;
             }else{
                 return <NormalTable responseData={this.state.responseData}  checked={this.state.checked} lotteryId={this.state.postData.lotteryId}/>;
             }
         }else{
             return "";
         }
    }
    render() {
        const { endOpen, tableTrendTotal } = this.state;
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

                        <Checkbox  checked={this.state.checked} onChange={(e)=>{this.displayChartLine(e)}}>显示走势折线</Checkbox>
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
                            allowClear={false}
                            format="YYYY-MM-DD"
                            placeholder="开始时间"
                            onChange={(date, dateString)=>{this.onStartChange(date, dateString)}}
                            onOpenChange={this.handleStartOpenChange}
                        />至
                        <DatePicker
                            disabledDate={()=>{this.disabledEndDate(this.state.endValue)}}
                            showTime
                            allowClear={false}
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
                <div className="c_table" >
                    { this.displapyTable() }
                </div>
            </div>
        );
    }
}
