/*走势图列表*/
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Row, Col} from 'antd';
import { stateVar } from '../../State';
import './TendList.scss';

@observer
export default class TendList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {
        const {lotteryType} = stateVar;
        return (
            <div className={`otherGames_main theme-${stateVar.activeTheme}`}>
                <Row type="flex" justify="center" align="top" className="main_width" >
                    <Col span={24}>
                        <ul className="tend_list">
                            {
                                lotteryType.map((items, i) => {
                                        return (
                                            <li key={items.typeName}>
                                                <div className="tend_lottery_type left">
                                                    <img className="icon_img"
                                                         src={require('../Lottery/LeftSider/Img/left_' + (i + 2) + '.png')}/>
                                                    <p>{items.typeName}</p>
                                                </div>
                                                <ul className="tend_lottery_list">
                                                    {
                                                        items.lotteryList.map((item) => {
                                                            return (
                                                                <li className='left' key={item.nav}>
                                                                    <a href={item.disabled || item.tendency ? 'javascript:void(0)' : stateVar.httpUrl + "#/tendency?id=" + item.lotteryid}
                                                                       target="_blank"
                                                                       className={item.disabled || item.tendency ? 'disabled_style' : ''}
                                                                    >
                                                                    {/*<a href={item.disabled || item.tendency ? 'javascript:void(0)' : window.location.origin + "#/tendency?id=" + item.lotteryid}*/}
                                                                       {/*target="_blank"*/}
                                                                       {/*className={item.disabled || item.tendency ? 'disabled_style' : ''}*/}
                                                                    {/*>*/}
                                                                        {
                                                                            item.imgUrl ?
                                                                                <img className="tend_lottery_img" src={require('../Lottery/ContentTop/Img/' + item.imgUrl + '.png')}/> :
                                                                                null
                                                                        }
                                                                        <p>{item.cnname}</p>
                                                                    </a>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </li>
                                        )
                                    }
                                )
                            }
                        </ul>
                    </Col>
                </Row>
            </div>
        )
    }
}
