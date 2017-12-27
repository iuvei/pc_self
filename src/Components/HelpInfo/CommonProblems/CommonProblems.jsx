import React, {Component} from 'react';
import {observer} from 'mobx-react';
import 'whatwg-fetch'
import Fetch from '../../../Utils';
import './CommonProblems.scss';
@observer
export default class CommonProblems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commonProblemsContent: null //常见问题显示内容
        }
    };
    /*获取常见问题数据*/
    getCommonProblems() {

        Fetch.commonProblems({
            method: "POST"
        }).then((data) => {

            if (data.status == 200) {
                this.setState({
                    commonProblemsContent: data.repsoneContent
                });
            }
        });
    }
    componentDidMount() {
        this.getCommonProblems();
    };
    render() {
        return (
            <div className="commonProblems_main" dangerouslySetInnerHTML={{__html: this.state.commonProblemsContent}}>


            </div>
        );
    }
}
