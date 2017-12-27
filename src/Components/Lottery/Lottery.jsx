import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Row, Col } from 'antd';
import QueueAnim from 'rc-queue-anim';

import './Lottery.scss';

import RightSider from './RightSider/RightSider';
import ContentMian from './ContentMain/ContentMian';

@observer
export default class Lottery extends Component {
    // shouldComponentUpdate(nextProps, nextState){
    //     Perf.start();
    //     return true
    // }
    // componentDidUpdate() {
    //     Perf.stop();
    //     var measurements = Perf.getLastMeasurements();
    //     Perf.printInclusive(measurements);
    // }
    render() {
        return (
            <div>
                {/*<QueueAnim duration={1000}*/}
                    {/*animConfig={[*/}
                    {/*{ opacity: [1, 0], translateY: [0, 50] }*/}
                    {/*]}>*/}
                    <Row type="flex" justify="center" align="top" key="betcenter">
                        <Col span={20}>
                            <ContentMian key="ContentMian"/>
                        </Col>
                        <Col span={4}>
                            <RightSider/>
                        </Col>
                    </Row>
                {/*</QueueAnim>*/}
            </div>
        );
    }
}
