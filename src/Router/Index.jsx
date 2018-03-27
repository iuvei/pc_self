import React from 'react';
import { Route, IndexRoute,IndexRedirect } from 'react-router';
import { stateVar } from '../State';
import {getCookie,getStore} from "../CommonJs/common";
import {
    login,
    dns,
    main,
    home,
    lottery,
    activity,
    activityDetails,
    fanshui,
    teamManage,
    gameRecord,
    report,
    teamStatistics,
    teamTable,
    selfTable,
    gameBill,
    teamList,
    marketing,
    selfInfo,
    contract,
    bankCardManage,
    security,
    message,
    financial,
    recharge,
    onlineTopUp,
    qqWallet,
    weChat,
    aliPay,
    eBank,
    promptlyRecharge,
    withdraw,
    affirmWithdraw,
    mentionFillingRecord,
    transfer,
    transferRecord,
    accountChange,
    dividend,
    otherGames,
    bobing,
    tendency,
    ea,
    pt,
    gt,
    sport,
    dayRate,
    person,
    afterRecord,
    sports,
    ptRecord,
    bobingRecord,
    lotteryBet,
    autoLogin,
    losesalary,
    aRdetails,
    helpInfo,
    howDeposit,
    playMethodIntroduce,
    commonProblems,
    aboutHengCai,
    lotteryReport,
    downLoadClient,
    selfCenter,
} from './Chunks';
/*
*通过判断是否登录过来控制导航条是否可以直接输入页面而进入相应页面
 */
const requireAuth = (nextState, replace) => {
    if(nextState.location.pathname=="/tendency"){/*当push或者通过a链接的pathname为“/tendency”直接进入其目录*/
        stateVar.auth =true;
    }
    if (!stateVar.auth) {
        if(nextState.location.pathname!="/tendency"){
            replace({ pathname: '/' }) // 路由重定向到根目录
        }

    }else{
        // ...
    }
}
const routes = params => (
    <Route path="/">
        <IndexRedirect to={(getCookie("sess") && (getStore('session') == getCookie("sess")))?"/autoLogin":"/login"} />
        <Route path="/autoLogin" getComponent={autoLogin} params={params}/>
        <Route path="/login" getComponent={login} params={params}/>
        <Route path="/dns" getComponent={dns} params={params}/>
        <Route path="/main" getComponent={main} params={params} onEnter={requireAuth}  >
            <IndexRoute getComponent={lottery} />
            <Route path="/home" getComponent={home} params={params}/>
            <Route path="/lottery" getComponent={lottery} params={params}/>
            <Route path="/activity" getComponent={activity} params={params}/>
            <Route path="/activity/activityDetails" getComponent={activityDetails} params={params}/>
            <Route path="/activity/fanshui" getComponent={fanshui} params={params}/>
            <Route path="/tendency" getComponent={tendency} params={params}/>
            <Route path="/teamManage" getComponent={teamManage} params={params}>
                <IndexRoute getComponent={teamStatistics} />
                <Route path="/teamManage/teamList" getComponent={teamList} params={params}/>
                <Route path="/teamManage/teamStatistics" getComponent={teamStatistics} params={params}/>
                <Route path="/teamManage/marketing" getComponent={marketing} params={params}/>
                <Route path="/teamManage/contract" getComponent={contract} params={params}/>
            </Route>
            <Route path="/selfInfo" getComponent={selfInfo} params={params}>
                <IndexRoute getComponent={selfCenter} />
                <Route path="/selfInfo/selfCenter" getComponent={selfCenter} params={params}/>
                <Route path="/selfInfo/bankCardManage" getComponent={bankCardManage} params={params}/>
                <Route path="/selfInfo/security" getComponent={security} params={params}/>
                <Route path="/selfInfo/message" getComponent={message} params={params}/>
            </Route>
            <Route path="/gameRecord" getComponent={gameRecord} params={params}>
                <IndexRoute getComponent={lotteryBet} />
                <Route path="/gameRecord/lotteryBet" getComponent={lotteryBet} params={params}/>
                <Route path="/gameRecord/person" getComponent={person} params={params}/>
                <Route path="/gameRecord/afterRecord" getComponent={afterRecord} params={params}/>
                <Route path="/gameRecord/aRdetails" getComponent={aRdetails} params={params}/>
                <Route path="/gameRecord/sports" getComponent={sports} params={params}/>
                <Route path="/gameRecord/ptRecord" getComponent={ptRecord} params={params}/>
                <Route path="/gameRecord/bobingRecord" getComponent={bobingRecord} params={params}/>
            </Route>

            <Route path="/financial" getComponent={financial} params={params}>
                <IndexRoute getComponent={recharge} />
                <Route path="/financial/recharge" getComponent={recharge} params={params}>
                    <IndexRoute getComponent={onlineTopUp} />
                    <Route path="/financial/recharge/promptlyRecharge" getComponent={promptlyRecharge} params={params}/>
                    <Route path="/financial/recharge/onlineTopUp" getComponent={onlineTopUp} params={params}/>
                    <Route path="/financial/recharge/qqWallet" getComponent={qqWallet} params={params}/>
                    <Route path="/financial/recharge/weChat" getComponent={weChat} params={params}/>
                    <Route path="/financial/recharge/aliPay" getComponent={aliPay} params={params}/>
                    <Route path="/financial/recharge/eBank" getComponent={eBank} params={params}/>
                </Route>
                <Route path="/financial/withdraw" getComponent={withdraw} params={params}/>
                <Route path="/financial/mentionFillingRecord" getComponent={mentionFillingRecord} params={params}/>
                <Route path="/financial/transfer" getComponent={transfer} params={params}/>
                <Route path="/financial/transferRecord" getComponent={transferRecord} params={params}/>
                <Route path="/financial/accountChange" getComponent={accountChange} params={params}/>
                <Route path="/financial/withdraw/affirmWithdraw" getComponent={affirmWithdraw} params={params}/>
            </Route>
            <Route path="/report" getComponent={report} params={params}>
                <IndexRoute getComponent={gameBill} />
                <Route path="/report/gameBill" getComponent={gameBill} params={params}/>
                <Route path="/report/teamTable" getComponent={teamTable} params={params}/>
                <Route path="/report/selfTable" getComponent={selfTable} params={params}/>
                <Route path="/report/dividend" getComponent={dividend} params={params}/>
                <Route path="/report/losesalary" getComponent={losesalary} params={params}/>
                <Route path="/report/dayRate" getComponent={dayRate} params={params}/>
                <Route path="/report/lotteryReport" getComponent={lotteryReport} params={params}/>
            </Route>
            <Route path="/helpInfo" getComponent={helpInfo} params={params}>
                <IndexRoute getComponent={howDeposit} />
                <Route path="/helpInfo/howDeposit" getComponent={howDeposit} params={params}/>
                <Route path="/helpInfo/playMethodIntroduce" getComponent={playMethodIntroduce} params={params}/>
                <Route path="/helpInfo/commonProblems" getComponent={commonProblems} params={params}/>
                <Route path="/helpInfo/aboutHengCai" getComponent={aboutHengCai} params={params}/>
            </Route>
            <Route path="/downLoadClient" getComponent={downLoadClient} params={params}/>

            <Route path="/otherGames" getComponent={otherGames} params={params}/>
            <Route path="/otherGames/bobing" getComponent={bobing} params={params}/>
            <Route path="/otherGames/ea" getComponent={ea} params={params}/>
            <Route path="/otherGames/gt" getComponent={gt} params={params}/>
            <Route path="/otherGames/sport" getComponent={sport} params={params}/>
            <Route path="/otherGames/pt" getComponent={pt} params={params}/>
        </Route>
    </Route>

);

export default { routes };
