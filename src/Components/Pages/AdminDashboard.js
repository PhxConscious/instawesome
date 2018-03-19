import React from 'react';
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom';
import { postFeedback } from '../../redux/actions/feedback';
import { getFreeUsers, postNewUserExpertJoin } from '../../redux/actions/userExpertJoin';
import { getAllUsers } from '../../redux/actions/userProgress';
import UserListItem from '../Admin/UserListItem';
import UserOverview from '../Admin/UserOverview';
import { Tab, Tabs } from 'react-mdl';
import '../../Styles/AdminDashboardStyles.css'

class AdminDashboard extends React.Component {
  constructor(props){
    super(props)
    this.state = {userObj: {}, activeTab: 0}
    this.selectUser = this.selectUser.bind(this);
    this.claimUser = this.claimUser.bind(this);
  }
  componentWillMount(){
    this.props.getFreeUsers()
    this.props.getAllUsers()
  }

  selectUser(user){
    this.setState({userObj: user})
  }

  claimUser(user){
    let { userInfo } = this.props;
    this.props.postNewUserExpertJoin({
      user_id: user.firebase_id,
      expert_id: userInfo.firebase_id})
      this.setState({
        userObj:{}
      })
  }

  render(){
    const { userInfo, allUsers, userExpertJoin } = this.props;
    let { userObj } = this.state;

    if (typeof(userInfo.currentUser)===undefined) {
      return <Redirect to='/'/>
    }

    let freeUsers;
    let unhitchedUsers
    if(userExpertJoin && userExpertJoin.freeUsers){
      freeUsers = userExpertJoin.freeUsers;
      unhitchedUsers = freeUsers.map((user, i) => {
        return <UserListItem
                  key={i}
                  user={user}
                  selectUser={this.selectUser}
                />
      })
    }

    let userList;
    if(allUsers){
      userList = allUsers.map((user, i) => {
        return (
          <div
            key={i}
            onClick={e=>this.setState({selectedUser:user})}>
            {user.first_name}
          </div>
        )
      })
    }

    if(userExpertJoin && userExpertJoin.freeUsers && allUsers){
      return (
        <div style={{width: "50vw", margin: "0 auto", marginTop: "100px"}}>
          <Tabs activeTab={this.state.activeTab} onChange={(tabId) => this.setState({ activeTab: tabId })} ripple>
            <Tab>Users</Tab>
            <Tab>Experts</Tab>
          </Tabs>
          <div>
              {this.state.activeTab === 0 ? <div
              id="userPanelContainer">

                <div id="usersPanelSelector">
                  <strong>User List</strong>
                    {userList}
                </div>

                <div id="userPanelDetail">
                  {this.state.selectedUser ? <UserOverview user={this.state.selectedUser}/>:''}
                </div>
              </div> : ''
            }

          </div>

        </div>
      )
    } else {
      return <div>loading expert panel...</div>
    }
  }
}

const mapStateToProps = state => {
  return {
    userInfo: state.userProgress.currentUser,
    allUsers: state.userProgress.allUsers,
    userExpertJoin: state.userExpertJoin
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getFreeUsers: () => {
      dispatch(getFreeUsers())
    },
    postNewUserExpertJoin: (obj) => {
      dispatch(postNewUserExpertJoin(obj))
    },
    getAllUsers: () => {
      dispatch(getAllUsers())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);
