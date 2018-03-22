/*走势图*/
import React, {Component} from 'react';
import {  Table} from 'antd';
import './NormalTable.scss'
import Line from '../line';


export default class NormalTable extends Component {
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
            lotteryBigType[lotteryListFlag[i].lotteryid]=lotteryListFlag[i].lotterytype;
        }

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

        let columnChildren = [];
        for (let i = 0; i < data.repsoneContent.lcodegroup.length; i++) {
            if(!(data.repsoneContent.bonuscode[0].wei[i] instanceof Array)&&          /*在大表头有多个子标题前提下显示单个数据，才加入类ball*/
                ((data.repsoneContent.vaildnum[i][0]=="1"||data.repsoneContent.vaildnum[i][0]=="0")||
                    (data.repsoneContent.vaildnum[0]=="1"||data.repsoneContent.vaildnum[0]=="0"))){
                if(data.repsoneContent.vaildnum[0] instanceof Array){ /*多个表头下的子标题不是一模一样的*/
                    for(let z = 0;z < data.repsoneContent.vaildnum[i].length ; z++){
                        if( z==0){/*表格最后一行要显示位置，以及表头的大标题，所以第0行分割成对应子标题的列数*/
                            columnChildren.push({
                                key: `children${i}${z}`,
                                dataIndex: `children${i}${z}`,
                                title: data.repsoneContent.vaildnum[i][z],
                                render: (value, row, index) => {
                                    const obj = {
                                        children: {value},
                                        props: {},
                                    };


                                    if(value==0||value){/*表格内容中在标准期数行以前的有值的就加入类ball或者值为0*/
                                        if (index < data.repsoneContent.bonuscode.length) {
                                            obj.children=<div className="ball">{value}</div>;

                                        }else{
                                            obj.children=value;
                                        }
                                    }
                                    if (index >= data.repsoneContent.bonuscode.length+3) {
                                        obj.props.colSpan = data.repsoneContent.vaildnum[i].length;

                                    }
                                    return obj;
                                },
                            });
                        }else{/*表格最后一行要显示位置，以及表头的大标题，所以第0行后都不渲染*/
                            columnChildren.push({
                                key: `children${i}${z}`,
                                dataIndex: `children${i}${z}`,
                                title: data.repsoneContent.vaildnum[i][z],
                                render: (value, row, index) => {
                                    const obj = {
                                        children: {value},
                                        props: {},
                                    };


                                    if(value==0||value){
                                        if (index < data.repsoneContent.bonuscode.length) {
                                            obj.children=<div className="ball">{value}</div>;

                                        }else{
                                            obj.children=value;
                                        }
                                    }
                                    if (index >= data.repsoneContent.bonuscode.length+3) {
                                        obj.props.colSpan = 0;

                                    }
                                    return obj;
                                },
                            });
                        }
                    }

                }else{/*所有大表头下的子标题一模一样*/

                    for (let j = 0; j <data.repsoneContent.vaildnum.length; j++) {
                        if(j==0){
                            columnChildren.push({
                                key: `children${i}${j}`,
                                dataIndex: `children${i}${j}`,
                                title: data.repsoneContent.vaildnum[j],
                                render: (value, row, index) => {
                                    const obj = {
                                        children: {value},
                                        props: {},
                                    };


                                    if(value==0||value){
                                        if (index < data.repsoneContent.bonuscode.length) {
                                            obj.children=<div className="ball">{value}</div>;

                                        }else{
                                            obj.children=value;
                                        }
                                    }
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
                                        children: {value},
                                        props: {},
                                    };


                                    if(value==0||value){
                                        if (index < data.repsoneContent.bonuscode.length) {
                                            obj.children=<div className="ball">{value}</div>;

                                        }else{
                                            obj.children=value;
                                        }
                                    }
                                    if (index >= data.repsoneContent.bonuscode.length+3) {
                                        obj.props.colSpan = 0;

                                    }
                                    return obj;
                                },
                            });
                        }
                    }
                }
            }else{
                if(data.repsoneContent.vaildnum[0] instanceof Array){ /*多个表头下的子标题不是一模一样的*/
                    for(let z = 0;z < data.repsoneContent.vaildnum[i].length ; z++){
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

                }else{/*所有大表头下的子标题一模一样*/

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
                if(!(data.repsoneContent.vaildnum[0] instanceof Array)){ //多表头,并且多个大表头下的子表头内容都是同样的
                    if(lotteryBigType[lotteryId]==0){ //时时彩系列，不管是数字还是文字，返回的都是当前位置
                        if(data.repsoneContent.bonuscode[i].wei[j] instanceof Array){//同一大表头中显示多个数据

                            for(let z=0; z<data.repsoneContent.bonuscode[i].wei[j].length;z++){
                                let currentWei = data.repsoneContent.bonuscode[i].wei[j][z];
                                tableData[i][`children${j}${currentWei}`] = data.repsoneContent.vaildnum[currentWei];
                            }
                        }else{//同一大表头中显示1个数据
                            let currentWei = data.repsoneContent.bonuscode[i].wei[j];
                            tableData[i][`children${j}${currentWei}`] = data.repsoneContent.vaildnum[currentWei];
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
                }else{ /*多表头，并且多个大表头下的子表头内容都是不同的*/
                    if(data.repsoneContent.vaildnum[j] instanceof Array){ //大表头含有多个子元素
                        if(lotteryBigType[lotteryId]==0){ //时时彩系列
                            if(data.repsoneContent.bonuscode[i].wei[j] instanceof Array){//同一大表头中显示多个数据

                                for(let z=0; z<data.repsoneContent.bonuscode[i].wei[j].length;z++){
                                    let currentWei = data.repsoneContent.bonuscode[i].wei[j][z];
                                    tableData[i][`children${j}${currentWei}`] = data.repsoneContent.vaildnum[j][currentWei];
                                }
                            }else{ //同一大表头中仅显示一个数据
                                let currentWei = data.repsoneContent.bonuscode[i].wei[j];
                                tableData[i][`children${j}${currentWei}`] = data.repsoneContent.vaildnum[j][currentWei];
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
                    }else{ //大表头下只有一个元素
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
        let bigColumn = columns.length - this.state.awardNoLength -1; /*获取大表头的个数*/

        Line[3].init();
        Line[0].color('#cd232d');/*设置折线的颜色*/
        Line[0].bind(true,"has_line");
        Line[0].AttributeGroup=[];  /*将表格画线的起始位置，结束位置至空，因为有缓存*/
        let startCol=null;/*每个大表头的起始列位置*/
        let litleColLen=0;/*小标题个数*/
        for(let i=0;i< bigColumn ;i++) {
            if(columns[this.state.awardNoLength +i+ 1].children){
                if (i == 0) {
                    startCol = this.state.awardNoLength + 1;
                } else {
                    startCol += litleColLen; /*起始行=上一次起始行+上一次的小标题个数*/
                }
                litleColLen = columns[this.state.awardNoLength +i+ 1].children.length;/*对应表头的子标题长度*/
                Line[0].add(parseInt(startCol), 0, litleColLen, 4);/*四个参数：列起始位置，行起始位置，列起始位与下一起始列间距，结束行与底部行数*/
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
                      key="trend"
                      dataSource={tableData}
                      pagination={false}
                      bordered={true}
                      onChange={this.handleTableChange}
                      className="trend_table_wrap"

                />
        );
    }
}
