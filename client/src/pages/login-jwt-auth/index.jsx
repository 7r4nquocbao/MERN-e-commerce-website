import Axios from 'axios';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';

import { facebookToken, FACEBOOK_API, loginUser } from '../../api';
import { authenticate, isAuth } from '../../helpers/auth';
import FacebookLogin from 'react-facebook-login';
import { Link } from 'react-router-dom';
import './Login.scss';

import Header from '../../components/UI/Header';
import topLogo from '../../assets/Images/main-logo.png';
import { listUser, readUser } from '../../api';
import * as yub from 'yup';
import { FastField, Form, Formik } from 'formik';
import InputField from '../../custom-fields/InputField';
import { uiLoading } from '../../App';
import { toast } from 'react-toastify';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';



function LoginJWT(props) {

    const [state, setState] = useState({ message: '', name: '' });
    const [chat, setChat] = useState([]);

    const history = useHistory();

    useEffect(() => {
        document.title = 'Login';
    }, [])

    const [userData, setUserData] = useState({
        email: '',
        password: ''
    });

    const initialValues = {
        email: '',
        password: '',
    }

    const validateSchema = yub.object().shape({
        email: yub.string()
            .max(100, "Maximum 100 characters")
            .email("Invalid email form")
            .required("This field is required"),
        password: yub.string()
            .min(6, "Password is too short - should be 8 chars minimum.")
            .max(50, "Maximum 50 characters")
            .required('This field is required'),
    })

    const handleLogin = (values) => {
        //e.preventDefault();
        uiLoading(true);
        if (values) {
            loginUser(values).then(res => {
                authenticate(res, () => {
                    uiLoading(false);
                    history.push('/');
                });
                isAuth() && isAuth().role === 'admin' ? history.push('/admin') : console.log('customer role');
                console.log(res);
            }).catch(err => {
                console.log(err);
                uiLoading(false);
                toast.error(<div>
                    <ErrorOutlineIcon/> Account does not exist
                </div>)
            })
        }
    }

    return (

        <div className="login">
            <Header />
            <div className="login__opacity">
                <div className="login__main">
                    <div className="login__main__left">
                        <div className="login__main_left__logo">
                            <Link title="logo" to="/">
                                <img alt="logo" src={topLogo} width={200} height={180} />
                            </Link>
                        </div>
                    </div>
                    <div className="login__main__right">
                        <div className="login__main__right__content">
                            <div className="login__main__right__content__title">
                                Login
                            </div>

                            <Formik
                                initialValues={initialValues}
                                onSubmit={(values) => handleLogin(values)}
                                validationSchema={validateSchema}
                            >
                                {
                                    formikValues => {
                                        return (
                                            <Form>
                                                <FastField
                                                    name="email"
                                                    component={InputField}
                                                    type="email"
                                                    label="Email"
                                                    placeholder="Type your email address..."
                                                />
                                                <FastField
                                                    name="password"
                                                    component={InputField}

                                                    type="password"
                                                    label="Password"
                                                    placeholder="Type your password..."
                                                />
                                                <button title="login" type="submit" className="btn btn-link" >Login</button>
                                            </Form>
                                        )
                                    }
                                }
                            </Formik>
                            <div className="login__register">
                                Register in here <Link title="register" to="/registerjwt">Register</Link><br />
                                <Link title="reset password" to="/reset">Forgot password?</Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>


            {/* <FacebookLogin
                appId={FACEBOOK_API}
                autoLoad={true}
                fields="name,email,picture"
                callback={responseFacebook}
                cssClass="my-facebook-button-class"
                icon="fa-facebook"
            /> */}

        </div>
    );
}

export default LoginJWT;