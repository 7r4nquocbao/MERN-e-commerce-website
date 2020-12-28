import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { activeUser } from '../../api';
import './JWT.scss';

function ActivationJWT(props) {

    useEffect(() => {
        document.title = 'Activation Account';
    }, [])

    const params = useParams();
    const { token } = params;

    const handleActive = e => {
        e.preventDefault();
        activeUser({ token: token }).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <div className="submit">
            <button title="active account" onClick={handleActive} className="btn btn-danger click-me">Click me~~~</button>
            <p>Click the button to active Account</p>
        </div>
    );
}

export default ActivationJWT;