import Names from './Names';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useGlobalState } from '../config/globalState';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    container: {
        width: `90vw`,
        padding: theme.spacing(3),
    }
}));

function BrowseNames() {
    const { store } = useGlobalState();
    const { names } = store;

    const classes = useStyles();
    
    return (
        <div className={classes.container}>
            <Names names={names} />
        </div>
    );
}

export default BrowseNames;

