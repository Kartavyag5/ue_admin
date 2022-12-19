import * as React from "react";
import Paper from "@material-ui/core/Paper";
import {
  ViewState,
  EditingState,
  IntegratedEditing,
} from "@devexpress/dx-react-scheduler";
const {
  Scheduler,
  WeekView,
  Appointments,
  DateNavigator,
  Toolbar,
} = require("@devexpress/dx-react-scheduler-material-ui");
import { withStyles } from "@material-ui/core/styles";
// import { withStyles } from "@material-ui/core/styles";
import style from "./index.module.css";
import { getCalendarHeight, getChildNum } from "../../helper/calendarView";

// For reference: https://codesandbox.io/s/affectionate-matsumoto-fig4u?file=/demo.js:3085-5323

type MyProps = {
  scheduleClickFunction: any;
  gameSchedules: Array<any>;
};

type MyState = {
  data: any;
  currentDate: string;
  childEle: any;

}

const styles = () => ({
  appointment: {
    backgroundColor: "#02549A",
    color: "white",
  },
});

export default class ScheduleView extends React.PureComponent<
  MyProps,
  MyState
> {
  constructor(props) {
    super(props);
    this.state = {
      data: props.gameSchedules,
      currentDate: new Date().toDateString(),
      childEle: 70,
    };

    this.commitChanges = this.commitChanges.bind(this);
  }

  componentDidMount() {  //setting default view of calendar to 9am
    let nodes = document.querySelectorAll('div');
    let childNum = getChildNum()
    console.log(childNum);
    console.log(childNum && nodes[childNum]);
    this.setState({ childEle: getChildNum() })
    nodes[this.state.childEle].scrollIntoView(false)
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.state.childEle);
    if (this.state.childEle !== prevState.childEle) {
      let nodes = document.querySelectorAll('div');
      nodes[this.state.childEle].scrollIntoView(false)
    }
  }

  onScheduleCardClick = (scheduleData) => {
    this.props.scheduleClickFunction(scheduleData);
  };

  // ToolBar = React.useCallback(
  //   (props) => {
  //     return <Toolbar.Root {...props} style={{ background: "red" }} />;
  //   },
  //   []
  // );

  ToolBar = (props) => {
    return (
      <Toolbar.Root {...props} style={{ background: "#F5F5F5" }}></Toolbar.Root>
    );
  };

  // Appointment = ({ classes, ...restProps }: any) => (
  //   <Appointments.Appointment
  //     {...restProps}
  //     onClick={() => this.onScheduleCardClick()}
  //   />
  // );

  Appointment = withStyles(styles, { name: "Appointment" })(
    ({ classes, ...restProps }: any) => {
      return (
        <Appointments.Appointment
          className={classes.appointment}
          onClick={() => this.onScheduleCardClick(restProps.data)}
        >
          <div className={style.content_container}>
            <div>{restProps.data.gameName}</div>
            <div>{restProps.data.communityName}</div>
            <div>{restProps.data.hostName}</div>
          </div>
        </Appointments.Appointment>
      );
    }
  );

  // AppointmentContent = ({ classes, ...restProps }: any) => (
  //   <Appointments.AppointmentContent {...restProps} />
  // );

  commitChanges({ added, changed, deleted }) {
    // TODO: Check if this is needed.
  }

  nextWeekdayDate(date, day_in_week) {
    var ret = new Date(date || new Date());
    ret.setDate(ret.getDate() + (day_in_week - 1 - ret.getDay() + 7) % 7 + 1);
    return ret;
  }
  onNewDateSelection(event) {
    console.log(event)
    // let d = new Date(event)
    // let o = new Date(event)
    // console.log(new Date(d.setDate(d.getDate() - d.getDay())))
    // console.log(new Date(o.setDate(o.getDate() + o.getDay())))
    console.log("Next sun", this.nextWeekdayDate(new Date(event), 7));
    console.log("Next sat", this.nextWeekdayDate(new Date(event), 6));
    // TODO: Check if this is needed.
  }

  render() {
    const { currentDate, data }: any = this.state;
    return (
      <Paper>
        <Scheduler data={data} height={getCalendarHeight()}>
          <ViewState defaultCurrentDate={currentDate} onCurrentDateChange={() => this.onNewDateSelection} />
          <EditingState onCommitChanges={this.commitChanges} />
          <IntegratedEditing />
          <WeekView startDayHour={0} endDayHour={24} />
          <Toolbar rootComponent={this.ToolBar} />
          <DateNavigator />
          <Appointments
            appointmentComponent={this.Appointment}
          // appointmentContentComponent={this.AppointmentContent}
          />
        </Scheduler>
      </Paper>
    );
  }
}
