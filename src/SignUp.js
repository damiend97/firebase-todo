import React from 'react';

function SignUp(props) {
    return (
        <div className="center-container">
            <div className="flex-center">
                <div className="auth-container">
                    Create an account
                    <form onSubmit={(e) => {props.signUp(e)}} id="signup-form">
                        <input onChange={(e) => {props.setUser(e.target.value)}} placeholder="username" className="m-bot" type="text" />
                        <input onChange={(e) => {props.setPass(e.target.value)}} placeholder="password" className="m-bot" type="password" />
                        <input type="submit" value="Signup" />
                    </form>
                    or &nbsp; <div className="signup-link" onClick={() => {props.setSignup(false)}}>login</div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;