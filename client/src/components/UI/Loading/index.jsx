import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import './loading.scss';

function LoadingUI(props) {

    const {active} = props;

    if(active) {
        return (
            <div className="loading-ui">
                <CircularProgress size={'5rem'} color="secondary" />
            </div>
        );
    } else {
        return (<div></div>);
    }

}

export default LoadingUI;