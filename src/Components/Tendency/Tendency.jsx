/*走势图*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { DatePicker, Checkbox, Table, Select, Input,  Button, Icon } from 'antd';
import './Tendency.scss'
import line from './line'
import 'whatwg-fetch'
import Fetch from '../../Utils'
const Option = Select.Option;


console.log(line)
const data = [];

@observer
export default class Tendency extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startValue: null,
            endValue: null,
            endOpen: false,
            tableData:[],
            appears:[],
            loading: false,
            renderTable:false,

        }
    };


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

    onStartChange = (value) => {
        this.onChange('startValue', value);
    }

    onEndChange = (value) => {
        this.onChange('endValue', value);
    }

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }

    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    }
    trendType(){
        trendType.map((value,index)=>{
            return (
                <Option value={index} key={index}>{value}</Option>
            )
        })
    }

   getTable(){
       this.setState({ loading: true });
       Fetch.trend(
           {
               method: "POST",
               body:JSON.stringify({
                   "lotteryId":1,
                   "issueCount":30,
                   "TrendType":1} )
           }).then((data)=>{
           console.log('trend',data)
           if(data.status==200){


               this.setState({
                   tableData:data.repsoneContent.bonuscode,
                   appears:data.repsoneContent.appears,
                   trendType:data.repsoneContent.Trend,
                   loading: false,
               })
               let periodNo=data.repsoneContent.bonuscode;
               for (let j = 0; j < 30; j++) {


                   let myriabit=periodNo[j].wei[0];
                   let kibbit=periodNo[j].wei[1];
                   let hundred=periodNo[j].wei[2];
                   let decade=periodNo[j].wei[3];
                   let unit=periodNo[j].wei[4];
                   data.push({
                       No: periodNo[j].issue,
                       awardNo: periodNo[j].code,


                   });
                   data[j][`myriabit${myriabit}`]=myriabit;
                   $(".ant-table-tbody").find("tr").eq(j).find("td").eq(parseInt(myriabit)+2).addClass('charball');
                   data[j][`kibbit${kibbit}`]=kibbit;
                   $(".ant-table-tbody").find("tr").eq(j).find("td").eq(parseInt(kibbit)+12).addClass('charball');
                   data[j][`hundred${hundred}`]=hundred;
                   $(".ant-table-tbody").find("tr").eq(j).find("td").eq(parseInt(hundred)+22).addClass('charball');
                   data[j][`decade${decade}`]=decade;
                   $(".ant-table-tbody").find("tr").eq(j).find("td").eq(parseInt(decade)+32).addClass('charball');
                   data[j][`unit${unit}`]=unit;
                   $(".ant-table-tbody").find("tr").eq(j).find("td").eq(parseInt(unit)+42).addClass('charball');

               }
               for(let j=30; j<33; j++) {
                   if(j==31||j==30){
                       if(j==30){
                           data.push({
                               No: "标准间隔",
                               awardNo: "标准间隔",
                           })
                       }
                       if(j==31){
                           data.push({
                               No: "标准次数",
                               awardNo: "标准次数",
                           })
                       }
                       for (let i = 0; i < 10; i++) {
                           data[j][`myriabit${i}`] = 10;
                           data[j][`kibbit${i}`]=10;
                           data[j][`hundred${i}`]=10;
                           data[j][`decade${i}`]=10;
                           data[j][`unit${i}`]=10;

                       }
                   }
                   if(j==32){
                       let  appears=this.state. appears;
                       data.push({
                           No: "当前次数",
                           awardNo: "当前次数",
                       })
                       for (let i = 0; i < 10; i++) {
                           data[j][`myriabit${i}`] = appears[0][i];
                           data[j][`kibbit${i}`]=appears[1][i];
                           data[j][`hundred${i}`]=appears[2][i];
                           data[j][`decade${i}`]=appears[3][i];
                           data[j][`unit${i}`]=appears[4][i];

                       }
                   }
                   /* if(j==33){
                        data.push({
                            No: "位置",
                            awardNo: "位置",
                        })
                        for (let i = 0; i < 10; i++) {
                            data[j][`myriabit${i}`] = "万位";
                            data[j][`kibbit${i}`]="千位";
                            data[j][`hundred${i}`]= "百位";
                            data[j][`decade${i}`]="十位";
                            data[j][`unit${i}`]="个位";

                        }
                    }*/




               }


           }else{

           }
       })

   }
    componentWillMount(){
        this.getTable();
    };

    componentDidMount() {
       this.render();
       this.forceUpdate();
        //this.fetch();
      //  $("tr").eq(5).css('background-color','red');
       // let DrawLine=line.DrawLine;
       // let Chart=line.Chart;

        line.fw.onReady(function() {
            line.Chart.init();

            line.DrawLine.bind("ant-table-tbody", true);

            line.DrawLine.color('#499495');
            line.DrawLine.add(2, 0, 10, 0);
            line.DrawLine.draw(line.Chart.ini.default_has_line);
            /*if($(".ant-table-tbody").width()>$('body').width())
            {
                $('body').width($(".ant-table-tbody").width() + "px");
            }*/
            /*$("#container").height($("#chartsTable").height() + "px");
            $("#missedTable").width($("#chartsTable").width() + "px");*/
            resize();
        })


        function resize(){
            window.onresize = func;
            function func(){
                window.location.href=window.location.href;
            }
        }

    };

    render() {
     const tablehMyriabit=[];
     const tablehKibbit=[];
     const tablehHundreds=[];
     const tablehDecade=[];
     const tablehUnit=[];
     //let trendType=this.state.trendType;

console.log("render");
const trendType=this.state.trendType;
/*将万位、千位、百位，十位、个位的具体标题位循环出来*/
     for(let i=0;i<10;i++){

             tablehMyriabit.push({
                 title: i,
                 dataIndex: 'myriabit'+i,
                 key: 'myriabit'+i,

             })
             tablehKibbit.push({
                 title: i,
                 dataIndex: 'kibbit'+i,
                 key: 'kibbit'+i,

             })
             tablehHundreds.push({
                 title: i,
                 dataIndex: 'hundred'+i,
                 key: 'hundred'+i,

             })
             tablehDecade.push({
                 title: i,
                 dataIndex: 'decade'+i,
                 key: 'decade'+i,

             })
             tablehUnit.push({
                 title: i,
                 dataIndex: 'unit'+i,
                 key: 'unit'+i,

             })
         }



     const columns=[{
         title: '期号',
         dataIndex: "No",
         key: 'No',
         render(value, row, index) {
             let obj = {
                 children: value,
                 props: {}
             };

             if (index >= 30) {
                 obj.props.colSpan = 2;
             }


             return obj;
         }

     }, {
         title: '开奖号码',
         dataIndex: "awardNo",
         key: 'awardNo',
         render(value, row, index) {
             let obj = {
                 children: value,
                 props: {}
             };

             if (index >= 30) {
                 obj.props.colSpan = 0;
             }


             return obj;
         }
     },{
         title:"万位",
         children: tablehMyriabit,


     },{
         title:"千位",
         children: tablehKibbit,

     },{
         title:"百位",
         children: tablehHundreds,

     },{
         title:"十位",
         children: tablehDecade,

     },{
         title:"个位",
         children: tablehUnit,

     }]




    /* for (let j = 0; j < 30; j++) {

             let periodNo=this.state.tableData;
             let myriabit=periodNo[j].wei[0];
             let kibbit=periodNo[j].wei[1];
             let hundred=periodNo[j].wei[2];
             let decade=periodNo[j].wei[3];
             let unit=periodNo[j].wei[4];
             data.push({
                 No: periodNo[j].issue,
                 awardNo: periodNo[j].code,


             });
             data[j][`myriabit${myriabit}`]=myriabit;
         $(".ant-table-tbody").find("tr").eq(j).find("td").eq(parseInt(myriabit)+2).addClass('charball');
             data[j][`kibbit${kibbit}`]=kibbit;
         $(".ant-table-tbody").find("tr").eq(j).find("td").eq(parseInt(kibbit)+12).addClass('charball');
             data[j][`hundred${hundred}`]=hundred;
         $(".ant-table-tbody").find("tr").eq(j).find("td").eq(parseInt(hundred)+22).addClass('charball');
             data[j][`decade${decade}`]=decade;
         $(".ant-table-tbody").find("tr").eq(j).find("td").eq(parseInt(decade)+32).addClass('charball');
             data[j][`unit${unit}`]=unit;
         $(".ant-table-tbody").find("tr").eq(j).find("td").eq(parseInt(unit)+42).addClass('charball');

         }
     for(let j=30; j<33; j++) {
         if(j==31||j==30){
             if(j==30){
                 data.push({
                     No: "标准间隔",
                     awardNo: "标准间隔",
                 })
             }
             if(j==31){
                 data.push({
                     No: "标准次数",
                     awardNo: "标准次数",
                 })
             }
             for (let i = 0; i < 10; i++) {
                 data[j][`myriabit${i}`] = 10;
                 data[j][`kibbit${i}`]=10;
                 data[j][`hundred${i}`]=10;
                 data[j][`decade${i}`]=10;
                 data[j][`unit${i}`]=10;

             }
     }
     if(j==32){
             let  appears=this.state. appears;
         data.push({
             No: "当前次数",
             awardNo: "当前次数",
         })
         for (let i = 0; i < 10; i++) {
             data[j][`myriabit${i}`] = appears[0][i];
             data[j][`kibbit${i}`]=appears[1][i];
             data[j][`hundred${i}`]=appears[2][i];
             data[j][`decade${i}`]=appears[3][i];
             data[j][`unit${i}`]=appears[4][i];

         }
     }
    /!* if(j==33){
         data.push({
             No: "位置",
             awardNo: "位置",
         })
         for (let i = 0; i < 10; i++) {
             data[j][`myriabit${i}`] = "万位";
             data[j][`kibbit${i}`]="千位";
             data[j][`hundred${i}`]= "百位";
             data[j][`decade${i}`]="十位";
             data[j][`unit${i}`]="个位";

         }
     }*!/




         }*/



       /* 表格底部*/
        const tfoot= <table className="" ><tbody className="ant-table-tbody"><tr className="ant-table-row  ant-table-row-level-0">
            <td colSpan={2}>位置</td><td colSpan={10}>万位</td><td colSpan={10}>千位</td><td colSpan={10}>百位</td><td colSpan={10}>十位</td><td colSpan={10}>个位</td>
        </tr>
        </tbody></table>;




        const { startValue, endValue, endOpen } = this.state;
        return (
            <div className='tendency-main'>
                <ul className='t-top'>
                    <li>
                        <Select defaultValue="重庆时时彩" style={{ minWidth: 160 }} onChange={(value)=>{this.handleChangeMethod(value)}}>
                            <Option value="jack">重庆时时彩</Option>
                            <Option value="lucy">重庆时时彩</Option>
                            <Option value="Yiminghe">重庆时时彩</Option>
                        </Select>
                    </li>
                    <li>
                        <Select defaultValue="五星基本走势图" style={{ minWidth: 160 }} onChange={(value)=>{this.handleChangeMethod(value)}}>
                            {
                                trendType.map((value,index)=>{
                                    return (
                                        <Option value={index} key={index}>{value}</Option>
                                    )
                                })
                            }
                        </Select>
                    </li>
                    <li>
                        <Checkbox id="has_line" >显示走势折线</Checkbox>
                    </li>
                    <li>
                        <a className='t-r-table' href="javascript:void(0)">表格上下转换</a>
                    </li>
                    <li></li>
                    <li>当前统计期数：100</li>
                    <li>
                        <ul className='t-period clear'>
                            <li>最近30期</li>
                            <li>最近50期</li>
                            <li>最近100期</li>
                        </ul>
                    </li>

                    <li>日期：
                        <DatePicker
                            disabledDate={this.disabledStartDate}
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            value={startValue}
                            placeholder="Start"
                            onChange={this.onStartChange}
                            onOpenChange={this.handleStartOpenChange}
                        />至
                        <DatePicker
                            disabledDate={this.disabledEndDate}
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            value={endValue}
                            placeholder="End"
                            onChange={this.onEndChange}
                            open={endOpen}
                            onOpenChange={this.handleEndOpenChange}
                        />
                    </li>
                    <li>
                        <Button type="primary"  onClick={()=>{this.search()}}>
                          查询
                        </Button>
                    </li>
                </ul>
                <div className="c_table" id="chartsTable">

                      <Table columns={columns}
                          rowKey={record => record.registered}
                          dataSource={data}
                          pagination={false}
                          bordered={true}
                          footer={() => tfoot}
                          loading={this.state.loading}
                          onChange={this.handleTableChange}


                    />
                </div>
            </div>
        );
    }
}
