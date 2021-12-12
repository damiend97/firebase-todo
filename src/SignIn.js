import React from 'react';

function SignIn(props) {
    return (
        <div className="center-container">
            <div className="flex-center">
                <div className="auth-container">
                    Log in to your account
                    <form onSubmit={(e) => {props.signIn(e)}} id="signin-form">
                        <input onChange={(e) => {props.setUser(e.target.value)}} placeholder="username" className="m-bot" type="text" />
                        <input onChange={(e) => {props.setPass(e.target.value)}} placeholder="password" className="m-bot" type="password" />
                        <input type="submit" value="Login" />
                    </form>
                    or &nbsp; <div className="signup-link" onClick={() => {props.setSignup(true)}}>signup</div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;