import * as React from "react";
import * as moment from "moment";
import { Row, Col, } from "react-bootstrap-typescript";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "./css/styles.less";

export default class Countdown extends React.Component<CountdownProps, CountdownState> {
    public componentWillMount() {
        //  clear the last interval since it's going to be recreated now
        if(this.state && this.state.timeout){
            clearInterval(this.state.timeout);
        }

        let seconds: number = this.getSeconds(this.props.endtime);
        let state: CountdownState = this.calculateTime(seconds);
        state.timeout = setInterval(this.doTick.bind(this),1000);

        this.setState(state);
    }

    public componentWillReceiveProps(nextProps:CountdownProps) {
        if(nextProps.endtime && nextProps.endtime != this.props.endtime){
            let seconds: number = this.getSeconds(nextProps.endtime);

            let state: CountdownState = this.calculateTime(seconds);
            state.complete = false;

            this.setState(state);
        }
    }

    public render():React.ReactElement<any> {
        return (
            <Row className={this.getClassName()}>
                <Col sm={3} xs={6} className="countdown-item">
                    <div className="countdown-number">{this.state.days}</div>
                    <div className="countdown-label">days</div>
                </Col>

                <Col sm={3} xs={6} className="countdown-item">
                    <div className="countdown-number">{this.state.hours}</div>
                    <div className="countdown-label">hours</div>
                </Col>

                <Col sm={3} xs={6} className="countdown-item">
                    <div className="countdown-number">{this.state.minutes}</div>
                    <div className="countdown-label">minutes</div>
                </Col>

                <Col sm={3} xs={6} className="countdown-item">
                    <div className="countdown-number">{this.state.seconds}</div>
                    <div className="countdown-label">seconds</div>
                </Col>
            </Row>
        );
    }

    private getClassName(): string {
        let css = ["countdown"];

        if(this.state.complete){
            css.push("is-complete");
        }

        return css.join(" ");
    }

    private doTick():void {
        if(this.state.total > 1){
            let state: CountdownState = this.calculateTime(this.state.total - 1);
            state.complete = false;

            this.setState(state);
        }else{
            this.setState({
                complete: true
            })
        }
    }

    private getSeconds(endtime: Date): number {
        return Math.ceil(moment(endtime).diff(moment())/1000);
    }

    private calculateTime(total: number): CountdownState {
        let seconds: number = total;

        // calculate (and subtract) whole days
        var days = Math.floor(seconds / 86400);
        seconds -= days * 86400;

        // calculate (and subtract) whole hours
        var hours = Math.floor(seconds / 3600) % 24;
        seconds -= hours * 3600;

        // calculate (and subtract) whole minutes
        var minutes = Math.floor(seconds / 60) % 60;
        seconds -= minutes * 60;

        // what's left is seconds, in theory the modulus is not required
        seconds = Math.ceil(seconds % 60);

        //  break down time into days, hours, minutes, seconds and set total as well
        return { days, hours, minutes, seconds, total };
    }
}

interface CountdownProps {
    endtime?: Date;
}

interface CountdownState {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    total?: number;
    complete?: boolean;
    timeout?: number;
}