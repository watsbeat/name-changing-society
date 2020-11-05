import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
		maxWidth: 500,
		margin: theme.spacing(5),
		color: '#8e2de2'
	},
}));

export default function NotFound() {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        Not Found 🤷🏻‍♀️
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Hmm... You seem to be lost. Try another link.
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
