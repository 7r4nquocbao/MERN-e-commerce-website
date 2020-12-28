import React, { useEffect, useState } from 'react';
import { resetRequest } from '../../api';
import { ToastContainer, toast } from 'react-toastify';
import '../register-jwt-auth/Register.scss';
import Header from '../../components/UI/Header';
import { Link } from 'react-router-dom';
import { uiLoading } from '../../App';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

function ResetRequestJWT(props) {

    const [email, setEmail] = useState('');

    useEffect(() => {
        document.title = 'Reset Password';
    }, [])

    const handleRequest = e => {
        uiLoading(true);
        e.preventDefault();
        if (email) {
            resetRequest({ email }).then(res => {
                setEmail('');
                uiLoading(false);
                toast.success(<div>
                    <CheckCircleOutlineIcon/> Check your email!
                </div>)
            }).catch(err => {
                console.log(err);
            })
        } else {
            console.log('Email is required');
        }
    }

    return (
        <div>
            <Header />
            <div className="register">
                <div className="register__opacity">
                    <div className="register__main">
                        <div className="register__title">
                            Reset password
                    </div>

                        <ToastContainer />
                        <form onSubmit={handleRequest}>
                            <div className="form-group">
                                <label htmlFor="email">Email address</label>
                                <input type="email" className="form-control" id="email" placeholder="Type your email..."
                                    onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <button type="submit" className="btn btn-link">Submit</button>
                            <Link className="back-to" to="/login">Back to Login</Link>
                        </form>
                    </div>

                </div>
            </div>
        </div>

    );
}

export default ResetRequestJWT;