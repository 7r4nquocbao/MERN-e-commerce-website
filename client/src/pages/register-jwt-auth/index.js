import { FastField, Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'reactstrap';
import * as Yup from 'yup';
import { registerUser } from '../../api';
import { uiLoading } from '../../App';
import topLogo from '../../assets/Images/main-logo.png';
import Header from '../../components/UI/Header';
import { DATE, MONTH, YEAR } from '../../constants/dateOfBirth';
import InputField from '../../custom-fields/InputField';
import RadioField from '../../custom-fields/RadioField';
import SelectField from '../../custom-fields/SelectField';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import WarningIcon from '@material-ui/icons/Warning';
import './Register.scss';

function RegisterJWTAuth(props) {

    useEffect(() => {
        document.title = 'Register';
    }, [])

    const initialValues = {
        name: '',
        gender: 'male',
        email: '',
        date: '',
        month: '',
        year: '',
        password: '',
        confirm: '',
        address: '',
        phone: '',

    };

    const validationSchema = Yup.object().shape({
        name: Yup.string()
        .min(2, "Minimum 2 characters")
        .max(50, "Maximum 50 characters")
        .required('This field is required'),

        email: Yup.string()
        .email("Invalid email format")
        .required('This field is required'),

        password: Yup.string()
        .min(6, "Password is too short - should be 8 chars minimum.")
        .max(50, "Maximum 50 characters")
        .required('This field is required'),

        confirm: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('This field is required'),

        address: Yup.string()
        .min(10, "Invalid address")
        .max(200, "Maximum 100 characters")
        .required('This field is required'),

        phone: Yup.number()
        .required('This field is required'),
        date: Yup.string().required('This field is required'),
        month: Yup.string().required('This field is required'),
        year: Yup.string().required('This field is required'),
    })

    const handleSubmit = (val) => {

        uiLoading(true);
        console.log(val);
        const dateOfBirth = { 
            name: val.name,
            gender: val.gender,
            email: val.email,
            password: val.password,
            address: val.address,
            phone: val.phone,
            birthday: {
                date: val.date, 
                month: val.month,
                year: val.year,
            }

        }

        registerUser(dateOfBirth).then(res => {
            console.log(res);
            uiLoading(false);
            toast.success(<div>
                <CheckCircleOutlineIcon/> Check your email!
            </div>)
        }).catch(err => {
            console.log(err);
            uiLoading(false);
            toast.error(<div>
                <WarningIcon/> Error!
            </div>)
        })
    }

    return (
        <div>
            <Header/>
            <div className="register">
               <div className="register__opacity">
               <div className="register__main">
                    <div className="d-flex justify-content-center pt-2">
                        <Link title="logo" to="/">
                            <img alt="logo" src={topLogo} width={120} height={100}/>
                        </Link>
                        
                    </div>
                    <div className="register__title">
                        Register
                    </div>

                    <Formik
                        initialValues = {initialValues}
                        onSubmit = {(values) => handleSubmit(values)}
                        validationSchema={validationSchema}
                    >
                        {
                            formikValues => {
                                //do something
                                
                                return(
                                    <Form>
                                        <FastField
                                            name="name"
                                            component={InputField}

                                            label="Name"
                                            placeholder="Type your Name..."
                                        />
                                        <div className="d-flex">
                                        <FastField
                                            name="gender"
                                            component={RadioField}

                                            label="Male"
                                            id="male"
                                        />
                                        <FastField
                                            name="gender"
                                            component={RadioField}

                                            label="Female"
                                            id="female"
                                        />
                                        </div>

                                        <FastField
                                            name="email"
                                            component={InputField}

                                            type="email"
                                            label="Email"
                                            placeholder="Type your Email..."
                                        />
                                        <FastField
                                            name="password"
                                            component={InputField}
                                            
                                            type="password"
                                            label="Password"
                                            placeholder="Type your Password..."
                                        />
                                        <FastField
                                            name="confirm"
                                            component={InputField}

                                            type="password"
                                            label="Confirm password"
                                            placeholder="Type your Confirm password..."
                                        />
                                        <p className="mb-2">Date of Birth</p>
                                        <div className="d-flex">
                                            <FastField
                                                name="date"
                                                component={SelectField}

                                                placeholder="Date"
                                                options={DATE}

                                            />
                                            <FastField
                                                name="month"
                                                component={SelectField}
                                                placeholder="Month"
                                                options={MONTH}

                                            />
                                            <FastField
                                                name="year"
                                                component={SelectField}

                                                placeholder="Year"
                                                options={YEAR}

                                            />
                                        </div>
   
                                        <FastField
                                            name="address"
                                            component={InputField}

                                            label="Address"
                                            placeholder="Type your Address..."
                                        />
                                         <FastField
                                            name="phone"
                                            component={InputField}

                                            type="text"
                                            label="Phone number"
                                            placeholder="Type your phone number..."
                                        />
                                        
                                        <Button title="register" type="submit">Register</Button>
                                        <Link title="back to login" className="back-to" to="/login">Back to Login</Link>
                                    </Form>
                                )
                            }
                        }
                    </Formik>

                </div>

               </div>
 
                            
        </div>
        </div>
        
    );
}

export default RegisterJWTAuth;