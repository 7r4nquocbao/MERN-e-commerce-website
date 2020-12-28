import { green } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Timeline from '@material-ui/lab/Timeline';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { cancelOrder, getOrderOfUser, readUser, updateUser } from '../../../api';
import TrackingItem from '../../../components/tracking-item';
import Banner from '../../../components/UI/Banner/MainBanner';
import Header from '../../../components/UI/Header';
import TopMenu from '../../../components/UI/TopMenu';
import Images from '../../../constants/images';
import dataAdditional from '../../../constants/local-db.json';
import { getCookie, isAuth, signOut } from '../../../helpers/auth';
import './style.scss';

const GreenRadio = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        border: 'solid 2px #e9ecef',
        display: 'block'
    },
    heading: {
        fontSize: theme.typography.pxToRem(20),
        fontWeight: theme.typography.fontWeightRegular,
        fontFamily: 'Quicksand',
    },
    column: {
        flexBasis: '50%',
    }
}));

function Profile(props) {

    const history = useHistory();

    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const { orderStatus } = dataAdditional;

    const [userInfo, setUserInfo] = useState([]);

    const [selectedValue, setSelectedValue] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);
    const [orders, setOrders] = useState([]);
    const [action, setAction] = useState(false);

    const [dateOptions, setDateOptions] = useState({
        dates: [],
        months: [],
        years: []
    })

    const [birthday, setBirthDay] = useState({
        date: 0,
        month: 0,
        year: 0
    });

    useEffect(() => {
        loadProfile();
        createDateOptions();
        getOrderOfUser(isAuth()._id).then(res => {
            setOrders(res.data);
        }).catch(err => {
            console.log(err);
        });
        setAction(false);
        document.title = 'Profile';
    }, [action]);

    const cancelUserOrder = (id) => {
        cancelOrder(id).then(res => {
            console.log(res);
            setAction(true);
        }).catch(err => {
            console.log(err);
        })
    }

    const displayTracking = () => {
        return (
            orders && orders.reverse().map((item, index) => {
                if (item.status !== 'Order Arrived' && item.isCancel === false) {
                    return (
                        <TrackingItem orderId={item._id} key={index} handleCancel={cancelUserOrder} />
                    )
                }
            })
        )
    }

    const displayOrders = () => {
        return (
            orders && orders.reverse().map((item, index) => {
                if (item.status === 'Order Arrived' || item.isCancel === true) {
                    return (
                        <tr>
                            <td className='m-0 p-0'>
                                <TrackingItem orderId={item._id} key={index} />
                            </td>
                        </tr>

                    )
                }
            })
        )
    }

    const handleChange = (event) => {
        setUserInfo({ ...userInfo, gender: event.target.value });
    };

    const createDateOptions = () => {

        let dates = [];
        let months = [];
        let years = [];

        for (let index = 0; index <= new Date().getFullYear() - 1910; index++) {
            if (index < 12) {
                months.push({ value: index, label: index + 1 });
            }
            if (index < 31) {
                dates.push({ value: index + 1, label: index + 1 });
            }
            years.push({ value: index + 1900, label: index + 1900 });
        }
        years.reverse();
        setDateOptions({ dates, months, years });

    }

    const loadProfile = () => {
        const token = getCookie('token');
        readUser(isAuth()._id, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            setUserInfo(res.data);
            setSelectedValue(res.data.gender);
            setBirthDay(res.data.birthday);
        }).catch(err => {
            signOut();
            history.push('/login');
        })
    }

    const updateProfile = () => {
        const user = { ...userInfo, _id: isAuth()._id, birthday: birthday };
        const token = getCookie('token');
        console.log(token);
        if (isDisabled === false) {
            updateUser(user, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            })
            setIsDisabled(!isDisabled);
        } else {
            setIsDisabled(!isDisabled);
        }
    }

    return (
        <div>
            <Header />
            <TopMenu />
            <Banner backgroundUrl={Images.Search} title="User Information" />
            <div className="container">
                <div className="row">
                    <div className="col-8 table-shadow">
                        <div className={`info-table ${isDisabled ? 'disable' : ''}`}>

                            <div className="info-row">
                                <label>Name</label>
                                <input className="form-control" value={userInfo.name} onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} />
                            </div>
                            <div className="info-row">
                                <label className="mr-3">Gender</label>
                                <label className="ml-3">Male</label>
                                <GreenRadio
                                    checked={userInfo.gender === 'male'}
                                    onChange={handleChange}
                                    value='male'
                                />
                                <label className="ml-3">Female</label>
                                <Radio
                                    checked={userInfo.gender === 'female'}
                                    onChange={handleChange}
                                    value='female'
                                />
                            </div>
                            <div className="info-row">
                                <label className="mr-3">Birthday</label>
                                <div className="form-row">
                                    <div className="col">
                                        <Select options={dateOptions.dates}
                                            onChange={(value) => setBirthDay({ ...birthday, date: value.value })}
                                            value={{ value: birthday.date, label: birthday.date }} />
                                    </div>
                                    <div className="col">
                                        <Select options={dateOptions.months}
                                            onChange={(value) => setBirthDay({ ...birthday, month: value.value })}
                                            value={{ value: birthday.month, label: birthday.month + 1 }} />
                                    </div>
                                    <div className="col">
                                        <Select options={dateOptions.years}
                                            onChange={(value) => setBirthDay({ ...birthday, year: value.value })}
                                            value={{ value: birthday.year, label: birthday.year }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="info-row">
                                <label>Phone</label>
                                <input className="form-control" value={userInfo.phone} onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })} />
                            </div>
                            <div className="info-row">
                                <label>Address</label>
                                <input className="form-control" value={userInfo.address} onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })} />
                            </div>
                            <div className="info-row">
                                <label>Point <b>{userInfo.point}</b></label>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end pb-4 pr-4">
                            <a title="reset password" className="btn btn-light" href="/reset">
                                Reset password
                            </a>
                            <button className={`btn ${isDisabled ? 'btn-secondary' : 'btn-success'}`} onClick={() => updateProfile()}>
                                {isDisabled ? 'Modify' : 'Save'}
                            </button>
                        </div>
                    </div>

                    <div className="col">
                        <Timeline align="alternate">
                            <TimelineItem>
                                <TimelineSeparator>
                                    <TimelineDot color={`${userInfo.point < 100 ? "secondary" : 'grey'}`} />
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>Normal</TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineSeparator>
                                    <TimelineDot color={`${userInfo.point > 100 ? "secondary" : 'grey'}`} />
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>Silver</TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineSeparator>
                                    <TimelineDot color={`${userInfo.point > 200 ? "secondary" : 'grey'}`} />
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>Gold</TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineSeparator>
                                    <TimelineDot color={`${userInfo.point > 300 ? "secondary" : 'grey'}`} />
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>Platium</TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineSeparator>
                                    <TimelineDot color={`${userInfo.point > 400 ? "secondary" : 'grey'}`} />
                                </TimelineSeparator>
                                <TimelineContent>Diamond</TimelineContent>
                            </TimelineItem>
                        </Timeline>
                    </div>
                </div>

                <h4 className="pt-5 pb-3">Tracking</h4>
                {displayTracking()}

                <h4 className="pt-5 pb-3">History</h4>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Order#</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayOrders()}
                    </tbody>
                </table>

            </div>


        </div>
    );
}

export default Profile;