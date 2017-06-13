import React from 'react';
import { Link } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';
import $ from 'jquery';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import Dialog from 'material-ui/Dialog';
import axios from 'axios';
import moment from 'moment';
import BigCalendar from 'react-big-calendar';
BigCalendar.momentLocalizer(moment);

import calanderCss from 'react-big-calendar/lib/css/react-big-calendar.css';




const styles = {
  drawer: {
    background: '#33414E'
  },
  overlay: {
    // background: 'none'
  },
  appBar: {
    background: '#33414E'
  },
  menuItem: {
    color: '#FFFFFF',
    fontWeight: 300
  },
  subheader: {
    color: '#999',
    fontWeight: 300
  },
  user: {
    padding: '15px',
    marginLeft: 0,
    background: '#2D3945',
    color: '#999',
    fontWeight: 300,
  }
};

class Drawers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openPrimary: false,
      openSecondary: false,
      open: false,
      jobsAppliedTo: null,
      loaded: false,
      gCalEvents: []
    };
    this.handleTogglePrimary = this.handleTogglePrimary.bind(this);
    this.handleToggleSecondary = this.handleToggleSecondary.bind(this);
    this.handleClosePrimary = this.handleClosePrimary.bind(this);
    this.handleCloseSecondary = this.handleCloseSecondary.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.fetchAllAppliedJob();
    this.getGcal();

  }

  getGcal() {
    let context = this;
    $.ajax({
      type: 'GET',
      url: '/gCalender',
      datatype: 'json'
    })
    .done(data => {

      let storage = [];
      data = JSON.parse(data);

      data.items.forEach((index) => {
        let temp = {};
        let start = index.start.dateTime;
        let end = index.end.dateTime;

        let startYear, startMonth, startDay, startHour, startMinutes;
        let endYear, endMonth, endDay, endHour, endMinutes;

        if (start) {
          startYear = Number(start.slice(0, 4));
          startMonth = Number(start.slice(5, 7));
          startDay = Number(start.slice(8, 10));
          startHour = Number(start.slice(11, 13));
          startMinutes = Number(start.slice(14, 16));
        }

        if (end) {
          endYear = Number(end.slice(0, 4));
          endMonth = Number(end.slice(5, 7));
          endDay = Number(end.slice(8, 10));
          endHour = Number(start.slice(11, 13));
          endMinutes = Number(end.slice(14, 16));
        }

        temp['title'] = index.summary;
        temp['start'] = new Date(startYear, startMonth, startDay, startHour, startMinutes, 0, 0);
        temp['end'] = new Date(endYear, endMonth, endDay, endHour, endMinutes, 0, 0);
        temp['desc'] = 'index.description';

        storage.push(temp);
      });
      this.setState({
        gCalEvents: storage
      });
    })
    .catch(err => {
      console.log('did not get gcal');
    });
  }


  handleOpen() {
    this.setState({open: true});
  }

  handleClose() {
    this.setState({open: false});
  }

  // Toggles state of primary drawer (left-menu)
  handleTogglePrimary() {
    this.setState({
      openPrimary: !this.state.openPrimary,
    });
  }

  // Toggles state of secondary drawer (right-menu)
  handleToggleSecondary() {
    this.setState({
      openSecondary: !this.state.openSecondary,
    });
  }

  // Closes menu when an item is clicked
  handleClosePrimary() {
    this.setState({
      openPrimary: false,
    });
  }

  // Closes menu when an item is clicked
  handleCloseSecondary() {
    this.setState({
      openSecondary: false,
    });
  }

  fetchAllAppliedJob() {
    let context = this;
    $.ajax({
      type: 'GET',
      url: '/user',
      datatype: 'json'
    })
    .done(data => {
      if (data.email) {
        axios.get('/ReturnJobsApplied', {
          params: {
            google_id: data.id
          }
        })
        .then((jobs) => {
          console.log('Success getting jobs! - inside drawer', jobs);
          let datesObj = {};
          let yAxis = ['Applied'];
          let xAxis = [];

          jobs.data.forEach((job) => {
            let convertedDate = (new Date(job.created_at)).toDateString();
            if (!datesObj[convertedDate]) {
              datesObj[convertedDate] = 1;
            } else {
              datesObj[convertedDate] += 1;
            }
          });

          for (let key in datesObj) {
            yAxis.push(datesObj[key]);
            xAxis.push(key);
          }

          // console.log(xAxis);
          // console.log(yAxis);
          context.setState({
            barChartDates: xAxis,
            barChartJobsApplied: yAxis,
            jobsAppliedTo: jobs.data,
            loaded: true
          });
        })
        .catch(err => {
          console.error('Error occured getting jobs', err);
        });
      }
    });
  }

  render() {
    const actions = [
      <button type="button" className="btn btn-default" onTouchTap={this.handleClose}>Cancel</button>,
      <a className="btn btn-primary" href="/auth/google"><i className="fa fa-google" aria-hidden="true"></i> Log In</a>
    ];
    const events = [
      {
        start: '2015-07-20',
        end: '2015-07-02',
        eventClasses: 'optionalEvent',
        title: 'test event',
        description: 'This is a test description of an event',
      },
      {
        start: '2015-07-19',
        end: '2015-07-25',
        title: 'test event',
        description: 'This is a test description of an event',
        data: 'you can add what ever random data you may want to use later',
      },
    ];


    return (
      <div>

        {/* Navigation bar */}
        <AppBar
          title="BestFit"
          iconElementRight={<FlatButton label="Activity" />}
          onLeftIconButtonTouchTap={this.handleTogglePrimary}
          onRightIconButtonTouchTap={this.handleToggleSecondary}
          style={styles.appBar}
        />

        {/* Primary drawer (left-menu) */}
        <Drawer
          containerStyle={styles.drawer}
          overlayStyle={styles.overlay}
          docked={false}
          width={225}
          open={this.state.openPrimary}
          onRequestChange={(openPrimary) => this.setState({openPrimary})}
        >
          <ul>
            <li style={styles.user}>
              <div className="container-fluid" style={styles.user}>
                <div className="flex-center">
                  { this.props.nameOnly === 'Guest' ?
                    <i className="fa fa-user-circle fa-5x" aria-hidden="true" > </i>
                   :
                    <img src={this.props.avatar} className="img-fluid rounded-circle" />
                  }
                </div>
                <br/>
                <p className="text-center" > {this.props.nameOnly}</p>
              </div>
            </li>
            <Subheader style={styles.subheader}>BESTFIT</Subheader>
            <MenuItem style={styles.menuItem} onTouchTap={this.handleClosePrimary} leftIcon={<i className="fa fa-home" aria-hidden="true"></i>} containerElement={<Link to="/dashboard" className="router-link-color"></Link>}>Home</MenuItem>
            { this.props.loggedIn === false ?
              <MenuItem style={styles.menuItem} onTouchTap={this.handleOpen} leftIcon={<i className="fa fa-list" aria-hidden="true"></i>}>Job History</MenuItem>
             :
              <MenuItem style={styles.menuItem} onTouchTap={this.handleClosePrimary} leftIcon={<i className="fa fa-list" aria-hidden="true"></i>} containerElement={<Link to="/jobhistory" className="router-link-color"></Link>}>Job History</MenuItem>
            }
            { this.props.loggedIn === false ?
              <MenuItem style={styles.menuItem} onTouchTap={this.handleOpen} leftIcon={<i className="fa fa-pencil" aria-hidden="true"></i>}>Résumé</MenuItem>
             :
              <MenuItem style={styles.menuItem} onTouchTap={this.handleClosePrimary} leftIcon={<i className="fa fa-pencil" aria-hidden="true"></i>} containerElement={<Link to="/resume" className="router-link-color"></Link>}>Résumé</MenuItem>
            }
            { this.props.loggedIn === false ?
              <MenuItem style={styles.menuItem} onTouchTap={this.handleOpen} leftIcon={<i className="fa fa-area-chart" aria-hidden="true"></i>}>Smart Analysis</MenuItem>
             :
              <MenuItem style={styles.menuItem} onTouchTap={this.handleClosePrimary} leftIcon={<i className="fa fa-area-chart" aria-hidden="true"></i>} containerElement={<Link to="/smartanalysis" className="router-link-color"></Link>}>Smart Analysis</MenuItem>
            }
            <Subheader style={styles.subheader}>SIGN OUT</Subheader>
            <MenuItem style={styles.menuItem} onTouchTap={this.handleClosePrimary} leftIcon={<i className="fa fa-sign-out" aria-hidden="true"></i>} href="/logout">Sign Out</MenuItem>
            <Dialog
              title="Log in to continue"
              actions={actions}
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClose}
            >
              Please log in to use this feature.
            </Dialog>

          </ul>
          {/*
          <Divider />
          <Divider />
          */}
        </Drawer>

        {/* Secondary drawer (right-menu) */}
        <Drawer
          docked={false}
          width={350}
          openSecondary={true}
          open={this.state.openSecondary}
          onRequestChange={(openSecondary) => this.setState({openSecondary})}
          containerStyle={styles.drawer}
        >
        <MenuItem onTouchTap={this.handleCloseSecondary}>
          <Subheader style={styles.subheader}>Calendar</Subheader>
          </MenuItem>
            <div className="card text-center z-depth-2">
              <BigCalendar
                style={{height: '420px', width: '300px'}}
                events={this.state.gCalEvents}
                default={['week', 'agenda']}
              />
            </div>
          <Subheader style={styles.subheader}>Recently Applied</Subheader>
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-12">
            {this.state.loaded === false ?
              <p>Loading...</p>
            :
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Job Title</th>
                    <th>Posting</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.jobsAppliedTo.map((job, idx) => {
                    let parsedJob = JSON.parse(job.job_data);
                    return (
                      <tr key={idx}>
                        <td>{parsedJob.indeed.company}</td>
                        <td>{parsedJob.indeed.jobtitle}</td>
                        <td><a target="_blank" href={parsedJob.indeed.url}>Link</a></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            }
              </div>
            </div>
          </div>
        </Drawer>

      </div>
    );
  }
}

export default Drawers;
