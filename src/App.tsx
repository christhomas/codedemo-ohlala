import * as React from "react";
import * as ReactDOM from "react-dom";
import * as moment from "moment";
import {
    Grid, Row, Col,
    FormGroup, FormControl, Button
} from "react-bootstrap-typescript";
import Countdown from "./Countdown";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "./css/styles.less";

export default class App extends React.Component<AppProps, AppState> {
    public constructor(props) {
        super(props);

        let seconds: number = 200;
        let endtime: Date = this.props.endtime || moment().add(seconds,"seconds").toDate();

        this.state = {
            endtime,
            seconds
        }
    }

    public render():React.ReactElement<any> {
        return (
            <Grid fluid className="main">
                <Row>
                    <Col sm={12}>
                        <h1 className="cursive">Countdown React Demo</h1>
                    </Col>
                </Row>

                <Countdown endtime={this.getTime()} />

                <Row className="seconds">
                    <h2>Update the timer by setting a number of seconds to current time</h2>
                    <FormGroup controlId="seconds"
                               validationState={this.isValid()}>
                        <FormControl
                            type="text"
                            value={this.state.seconds}
                            placeholder="Enter seconds"
                            onChange={this.setSeconds.bind(this)}
                            onKeyPress={this.handleEnter.bind(this)}
                        />
                    </FormGroup>
                    <Button type="submit" bsStyle="danger" onClick={this.setTime.bind(this)}>update</Button>
                </Row>

                <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Source+Sans+Pro:200,300,400,700" />
            </Grid>
        );
    }

    private checkInput(seconds: number): boolean {
        return !isNaN(seconds) && seconds > 0;
    }

    private isValid(): string {
        return this.checkInput(this.state.seconds) ? "success" : "error";
    }

    private getTime(): Date {
        return this.state.endtime;
    }

    private handleEnter(event:any):void {
        if (event.charCode == 13) {
            this.setTime(event);
        }
    }

    private setSeconds(event:any):void {
        let seconds: number = parseInt(event.target.value);

        if(!this.checkInput(seconds)){
            seconds = 0;
        }

        this.setState({seconds});
    }

    private setTime(event:any):boolean {
        if(this.checkInput(this.state.seconds)){
            this.setState({
                endtime: moment().add(this.state.seconds,"seconds").toDate()
            });
        }

        event.stopPropagation();
        return false;
    }
}

interface AppProps {
    endtime?: Date;
}

interface AppState {
    endtime?: Date;
    seconds?: number;
}

ReactDOM.render(<App/>, document.getElementById("application"));