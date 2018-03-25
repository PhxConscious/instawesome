import React from 'react';
import {connect} from 'react-redux';
import {Redirect, Link} from 'react-router-dom';
import {withCookies, Cookies} from 'react-cookie';
import styles from '../../Styles/SplashPageStyles.css'

class Splash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            goBackThruLogin: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loginRefresh = this.loginRefresh.bind(this);
    }

    handleSubmit() {
        this.setState({goBackThruLogin: true})
    }

    loginRefresh() {
        console.log("loginRefresh")
        const {cookies} = this.props;
        cookies.remove('hash');
        window.location.reload();
        alert("Sorry you're having technical difficulties! Please bear with us as continue improving as quickly as we can. Clicking this link will ensure your login info is reset - try logging in again.")
    }

    render() {
        let {userInfo, companyInfo} = this.props;
        let {goBackThruLogin} = this.state;

        if (goBackThruLogin) {
            return <Redirect to={'/'}/>
        }

        if (userInfo && !userInfo.user_email) {
            return (
                <div className='ladingPageContent'>
                    <p className='splashText'>Thanks for coming to see us. Please log back in</p>
                    <form
                        onSubmit={e => {
                            e.preventDefault()
                            this.handleSubmit()
                        }}>
                        <button className="splashButton" type="submit">
                            Login now
                        </button>
                    </form>
                    <button className="splashButton" onClick={this.loginRefresh}>
                        Trouble logging in?
                    </button>
                </div>
            )
        } else {
            return (
                <div className='ladingPageContent'>
                    <div className='splashText'>
                        This is the spash page where users gain an idea of what they can do on the site.
                        We could also put up some kind of article feed - do we have content coming off of wordpress?
                        <div>
                            {companyInfo.companyList && companyInfo.companyList.length === 0 ? <div>
                                <h3 className='splashText'>We notice you haven't set up your company yet...</h3>
                                <p className='splashText'>Please set up your company profile immediately so that we can
                                    better help you.</p>
                                <div className='addCompanyText'>
                                    <Link className='linkTo ' to='/profile'>
                                      Add My Company
                                    </Link>
                                </div>
                            </div> : <div>
                                <h3 className='splashText'>Welcome back to instAwesome.</h3>
                                <Link className='linkTo' to='/learn/dashboard'>
                                    Continue The Journey
                                </Link>
                            </div>}
                        </div>
                    </div>
                </div>
            )
        }

    }
}

const mapStateToProps = state => ({
    userInfo: state.userProgress.currentUser,
    companyInfo: state.companyInfo
})
export default withCookies(connect(mapStateToProps, null)(Splash));
