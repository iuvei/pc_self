/*倒转走势图*/
import React, {Component} from 'react';
import {  Table} from 'antd';
import './ReverseTable.scss'
import Line from '../line';


let trendAvailWidth=window.screen.availWidth-30;   //界面的有效宽度，控制表格滚动条出现的阈值
export default class ReverseTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            awardNoLength:0,  /*当前开奖号码个数，用来间接计算走势图折线图的起始显示位置*/
            tableData:[],     //走势图表格内容
            columns:[],  /*走势图表格表头*/


        }
    };

    /*
    * 渲染表头和表格数据
    * */
    getTable(){
        let data=this.props.responseData;
        let lotteryId=this.props.lotteryId;
        let tableData = [];     //走势图表格内容
        let columns=[];         //走势图表格表头
        let headAwardNo=[]; /*将开奖号码存为这个区块的最外层变量，从而在最后一次设置state*/

        /*重构后台返回的lotteryList
        * 将彩种id作为索引，彩种大类作为变量内容
        * */
        let lotteryBigType=[];
        let lotteryListFlag = data.repsoneContent.aData.lotteryList;
        for(let i=0; i<lotteryListFlag.length; i++){
            lotteryBigType[lotteryListFlag[i].lotteryid] = lotteryListFlag[i].lotterytype;
        }

        /*表头 begin*/


        /*获取开奖号码个数，从而控制开奖号码分成多少列*/
        let AwardNoChildren=[];
        let curHeardAwrdNo=data.repsoneContent.bonuscode[0].code;
        let iftwoballH=curHeardAwrdNo.charAt(2);
        if(iftwoballH!=" "){
            headAwardNo=curHeardAwrdNo.split("");
        }else{

            headAwardNo=curHeardAwrdNo.split(" ");
        }
       /*表头分成两行，在位置下分成：期号，开奖号码个数对应的列，如award0,award1...
       * 其余大表头下均由后台返回的data.repsoneContent.vaildnum长度决定*/

       /*开奖号码子表头除去award0以外，标准次数，当前次数行，开奖号码行，都不占列数*/
        const renderContent = (value, row, index) => {
            const obj = {
                children: value,
                props: {},
            };
            if ((index >= 0&&index <=2)) {
                obj.props.colSpan = 0;
            }
            return obj;
        };
        /*开奖期号子表头在标准间隔，标准次数，当前次数行不占列数*/
        const renderContentIssue = (value, row, index) => {
            const obj = {
                children: value,
                props: {},
            };
            if ((index >= 0&&index <2)) {
                obj.props.colSpan = 0;
            }


            return obj;
        };
        /*添加位置下的子表头期号，并在表头位置处不占列数*/
        AwardNoChildren.push({
            title: '期号',
            key: 'issue',
            dataIndex: `issue`,
            colSpan: 0,
            render: renderContentIssue,
        })
        /*添加位置下子表头award0，在表头位置下占所有子表头行数，在表格内容的前两行占此大表头下的所有列数，在期号文字显示
        * 行，占有所有开奖号码个数列*/
        AwardNoChildren.push({
            title: `标准间隔`,/*显示位置下的表头*/
            colSpan: headAwardNo.length+1,
            key: `award0`,
            className:"trend_awardNo",
           dataIndex: `award0`,
           render(value, row, index){
                const obj = {
                    children: value,
                    props: {},
                };
                if (index >= 0&&index < 2) {
                    obj.props.colSpan = headAwardNo.length+1;
                }
               if(index == 2){
                   obj.props.colSpan=headAwardNo.length;
               }
                return obj;
            }

        })
        /*开奖号码根据其开奖位数分成对应的列数，并加入到子表头*/
        for (let i = 1; i < headAwardNo.length; i++) {
            AwardNoChildren.push({
                title: `award${i}`,
                colSpan: 0,
                key: `award${i}`,
                className:"trend_awardNo",
                dataIndex: `award${i}`,
                render: renderContent,
            })
        }
        /*将位置下的子表头合入进总表头*/
        columns.push({
                title: '位置',
                dataIndex: "position",
                key: 'position',
                children: AwardNoChildren,
            }
        )



        /*位置大表头后其他大表头，以及其子表头的渲染
        * 并对表头下的数据进行加入类ball
        * 当大表头下显示单列数字时，加入类ball，从而画折线图*/
        let columnChildren = [];
        for (let i = 0; i < data.repsoneContent.lcodegroup.length; i++) {
            if(!(data.repsoneContent.bonuscode[0].wei[i] instanceof Array)&&          /*在大表头有多个子标题前提下显示单个数据，才加入类ball*/
                ((data.repsoneContent.vaildnum[i][0]=="1"||data.repsoneContent.vaildnum[i][0]=="0")||
                    (data.repsoneContent.vaildnum[0]=="1"||data.repsoneContent.vaildnum[0]=="0"))){
                if(data.repsoneContent.vaildnum[0] instanceof Array){ /*多个表头下的子标题不是一模一样的*/
                    for(let z = 0;z < data.repsoneContent.vaildnum[i].length ; z++){
                            columnChildren.push({
                                key: `children${i}${z}`,
                                dataIndex: `children${i}${z}`,
                                title: data.repsoneContent.vaildge,
                                render: (value, row, index) => {
                                    const obj = {
                                        children: {value},
                                        props: {},
                                    };
                                    if(index>2){
                                        if(value==0||value){
                                            obj.children=<div className="ball">{value}</div>;
                                        }
                                    }else{
                                        obj.children=value;
                                    }
                                    return obj;
                                },
                            });

                    }

                }else{/*所有大表头下的子标题一模一样*/

                    for (let z = 0; z <data.repsoneContent.vaildnum.length; z++) {
                        columnChildren.push({
                            key: `children${i}${z}`,
                            dataIndex: `children${i}${z}`,
                            title: data.repsoneContent.vaildge,
                            render: (value, row, index) => {
                                const obj = {
                                    children: {value},
                                    props: {},
                                };
                                if(index>2){
                                    if(value==0||value){
                                        obj.children=<div className="ball">{value}</div>;
                                    }
                                }else{
                                    obj.children=value;
                                }
                                return obj;
                            },
                        });
                    }
                }
            }else{
                if(data.repsoneContent.vaildnum[0] instanceof Array){ /*多个表头下的子标题不是一模一样的*/
                    for(let z = 0;z < data.repsoneContent.vaildnum[i].length ; z++){
                        columnChildren.push({
                            key: `children${i}${z}`,
                            dataIndex: `children${i}${z}`,
                            title: data.repsoneContent.vaildge,
                        });
                        }


                }else{/*所有大表头下的子标题一模一样*/

                    for (let z = 0; z <data.repsoneContent.vaildnum.length; z++) {
                        columnChildren.push({
                            key: `children${i}${z}`,
                            dataIndex: `children${i}${z}`,
                            title: data.repsoneContent.vaildge,
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
        /*在表头开始是标准次数，当前次数，奖号对应号码区间行*/
        tableData.push({
            award0: "标准次数",
            key:"standardNum",
        });
        tableData.push({
            award0: "当前次数",
            key:"curNum",
        });
        tableData.push({
            issue: "期号",
            award0:"开奖号码",
            key:"award0",
        });
        /*data.repsoneContent.appears是二维数组，一维对应大表头个数，二维对应子表头个数*/
        for (let i = 0; i < data.repsoneContent.appears.length; i++) {
            for (let j = 0; j < data.repsoneContent.appears[i].length; j++) {
                tableData[0][`children${i}${j}`] = data.repsoneContent.vaildci;
                tableData[1][`children${i}${j}`] =  data.repsoneContent.appears[i][j];
                if(data.repsoneContent.vaildnum[0] instanceof Array) { /*多个表头下的子标题不是一模一样的*/
                    tableData[2][`children${i}${j}`] =  data.repsoneContent.vaildnum[i][j];
                }else{/*所有大表头下的子标题一模一样*/
                    tableData[2][`children${i}${j}`] =  data.repsoneContent.vaildnum[j];
                }
            }

        }

        /*将表格内容用data.repsoneContent.bonuscode的长度进行遍历，数据渲染依据表格表头的dataindex
        * 因为是倒转表格，起始行数为表格第三行，结束行为获取数据的长度+3
        * 渲染的数据从表格返回数据最后一位到起始位*/
        for (let h = 3; h < data.repsoneContent.bonuscode.length+3; h++) {
            let i= data.repsoneContent.bonuscode.length-h+2;/*渲染的数据从表格返回数据最后一位到起始位*/
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

                tableAwardNo=curAwrdNo.split(" ");
            }


            /*根据开奖号码个数， 分别遍历开奖号码，并将每列加入键值*/
            for (let d = 0; d < tableAwardNo.length; d++) {
                tableData[h]["key"]=`tableData${i}${d}`;
                tableData[h][`award${d}`] = tableAwardNo[d];

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
                if(!(data.repsoneContent.vaildnum[0] instanceof Array)){ //多表头,并且多个大表头下的子表头内容都是同样的
                    if(lotteryBigType[lotteryId]==0){ //时时彩系列，不管是数字还是文字，返回的都是当前位置
                        if(data.repsoneContent.bonuscode[i].wei[j] instanceof Array){//同一大表头中显示多个数据

                            for(let z=0; z<data.repsoneContent.bonuscode[i].wei[j].length;z++){
                                let currentWei = data.repsoneContent.bonuscode[i].wei[j][z];
                                tableData[h][`children${j}${currentWei}`] = data.repsoneContent.vaildnum[currentWei];
                            }
                        }else{//同一大表头中显示1个数据
                            let currentWei = data.repsoneContent.bonuscode[i].wei[j];
                            tableData[h][`children${j}${currentWei}`] = data.repsoneContent.vaildnum[currentWei];
                        }

                    }else if(lotteryBigType[lotteryId]==2){ //11选5系列

                        if(data.repsoneContent.bonuscode[i].wei[j] instanceof Array){//同一大表头中显示多个数据
                            for(let z=0; z<data.repsoneContent.bonuscode[i].wei[j].length;z++){
                                let currentWei=null;
                                if(data.repsoneContent.vaildnum[0]=="1"){ //当前显示为数据
                                    currentWei = data.repsoneContent.bonuscode[i].wei[j][z]-1;
                                }else{//当前显示为文字
                                    currentWei = data.repsoneContent.bonuscode[i].wei[j][z];
                                }

                                tableData[h][`children${j}${currentWei}`] = data.repsoneContent.bonuscode[i].wei[j][z];
                            }
                        }else{//同一大表头中显示1个数据
                            let currentWei = null;
                            if(data.repsoneContent.vaildnum[0]=="1"){ //当前显示为数据
                                currentWei = data.repsoneContent.bonuscode[i].wei[j]-1;
                            }else{//当前显示为文字
                                currentWei = data.repsoneContent.bonuscode[i].wei[j];
                            }
                            tableData[h][`children${j}${currentWei}`] = data.repsoneContent.bonuscode[i].wei[j];
                        }
                    }
                }else{ /*多表头，并且多个大表头下的子表头内容都是不同的*/
                    if(data.repsoneContent.vaildnum[j] instanceof Array){ //大表头含有多个子元素
                        if(lotteryBigType[lotteryId]==0){ //时时彩系列
                            if(data.repsoneContent.bonuscode[i].wei[j] instanceof Array){//同一大表头中显示多个数据

                                for(let z=0; z<data.repsoneContent.bonuscode[i].wei[j].length;z++){
                                    let currentWei = data.repsoneContent.bonuscode[i].wei[j][z];
                                    tableData[h][`children${j}${currentWei}`] = data.repsoneContent.vaildnum[j][currentWei];
                                }
                            }else{ //同一大表头中仅显示一个数据
                                let currentWei = data.repsoneContent.bonuscode[i].wei[j];
                                tableData[h][`children${j}${currentWei}`] = data.repsoneContent.vaildnum[j][currentWei];
                            }

                        }else if(lotteryBigType[lotteryId]==2){ //11选5系列
                            if(data.repsoneContent.bonuscode[i].wei[j] instanceof Array){//同一大表头中显示多个数据
                                for(let z=0; z<data.repsoneContent.bonuscode[i].wei[j].length;z++){
                                    let currentWei=null;
                                    if(data.repsoneContent.vaildnum[j][0]=="1"){ //当前显示为数据
                                        currentWei = data.repsoneContent.bonuscode[i].wei[j][z]-1;
                                    }else{//当前显示为文字
                                        currentWei = data.repsoneContent.bonuscode[i].wei[j][z];
                                    }

                                    tableData[h][`children${j}${currentWei}`] = data.repsoneContent.bonuscode[i].wei[j][z];
                                }
                            }else{//同一大表头中显示1个数据
                                let currentWei = null;
                                if(data.repsoneContent.vaildnum[0]=="1"){ //当前显示为数据
                                    currentWei = data.repsoneContent.bonuscode[i].wei[j]-1;
                                }else{//当前显示为文字
                                    currentWei = data.repsoneContent.bonuscode[i].wei[j];
                                }
                                tableData[h][`children${j}${currentWei}`] = data.repsoneContent.bonuscode[i].wei[j];
                            }
                        }
                    }else{ //大表头下只有一个元素
                        tableData[h][`children${j}0`] = data.repsoneContent.bonuscode[i].wei[j];
                    }
                }
            }
        }


        this.setState({
            columns:columns,
            tableData:tableData,
            awardNoLength:headAwardNo.length,
        })

    }
    /*
      * 走势图折线
      * 遍历大表头，每个大表头下画折线
      */
    drawTrendLine(){
        let columns = this.state.columns;
        let bigColumn = columns.length -1; /*获取大表头的个数*/

        Line[3].init();
        Line[0].color('#cd232d');/*设置折线的颜色*/
        Line[0].bind(true,"has_line");
        Line[0].AttributeGroup=[];  /*将表格画线的起始位置，结束位置至空，因为有缓存*/
        let startCol=null;/*每个大表头的起始列位置*/
        let litleColLen=0;/*小标题个数*/
        for(let i=0;i< bigColumn ;i++) {
            if(columns[i+ 1].children){
                if (i == 0) {
                    startCol = this.state.awardNoLength + 1;
                } else {
                    startCol += litleColLen; /*起始行=上一次起始行+上一次的小标题个数*/
                }
                litleColLen = columns[i+ 1].children.length;/*对应表头的子标题长度*/
                Line[0].add(parseInt(startCol), 3, litleColLen, 0);/*四个参数：列起始位置，行起始位置，列起始位与下一起始列间距，结束行与底部行数*/
            }

        }

        Line[0].draw(true);
        Line[0].show(this.props.checked);/*通过显示折线复选框的选择状态，显示隐藏折线*/

    }
    onWindowResize(){
        let  windowWidth=$(window).width();
        if(($("table").width()>$('body').width()-45)||windowWidth<1200)
        {
            $('body').width($("table").width() +46+ "px");
        }else{
            $('body').width(windowWidth);
        }
        Line[0].remove(true);
        this.drawTrendLine();
    }

    componentWillMount(){
        this.getTable();
    };

    componentDidMount() {
        let windowWidth=$(window).width();
        /*当表格宽度大于body时，将body宽度等于表格宽度
        * 否则body等于实际界面显示宽度*/
        if($("table").width()>$('body').width()-40)
        {
            $('body').width($("table").width() +46+ "px");
        }else{
            $('body').width(windowWidth);

        }
        window.addEventListener('resize', this.onWindowResize.bind(this))
        this.drawTrendLine();

    };
    componentDidUpdate(){

        Line[0].show(this.props.checked);/*通过显示折线复选框的选择状态，显示隐藏折线*/


    }
    componentWillUpdate(){

    }
    componentWillUnmount(){
        Line[0].remove(true);   /*删除折线*/
        window.removeEventListener('resize', this.onWindowResize.bind(this))

    }
    render() {
        const columns = this.state.columns;
        const tableData = this.state.tableData;
        return ( <Table  columns={columns}
                         key="reverseTrendTable"
                         dataSource={tableData}
                         pagination={false}
                         bordered={true}
                         onChange={this.handleTableChange}
                         className="reverse_table_wrap"

            />
        );
    }
}
