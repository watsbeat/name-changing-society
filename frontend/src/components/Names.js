import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import {
    TableContainer,
    Table,
    TableHead,
    TableCell,
    TableRow,
    TableBody,
    TableFooter,
    TablePagination,
    IconButton,
    Paper
} from '@material-ui/core';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
    paper: {
        padding: theme.spacing(5),
        textAlign: 'center',
    },
}));

const StyledTableCell = withStyles((theme) => ({
    head: {
        color: theme.palette.common.white,
        paddingLeft: 20
    },
    body: {
        fontSize: 14,
        paddingLeft: 20,
        // color: '#4a00e0'
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        // '&:nth-of-type(odd)': {
        //     backgroundColor: '#D5FFF3',
        // },
        // '&:nth-of-type(even)': {
        //     backgroundColor: '#FFFFFF',
        // },
    },
    head: {
        background: 'linear-gradient(to right, #0cebeb, #20e3b2, #29ffc6)'
    }
}))(TableRow);

function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

function createData(first_name, middle_name, last_name, held_to) {
    return {
        first_name,
        middle_name,
        last_name,
        held_to
    };
}

const useStyles2 = makeStyles({
    table: {
        minWidth: 200,
    },
    title: {
        color: 'gray',
        paddingTop: '20px',
        paddingLeft: '20px',
    },
    disc: {
        fontSize: '16px',
        color: 'gray',
        paddingLeft: '20px',
	},
});

export default function Names({ names }) {
    const classes = useStyles2();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    if (!names) {
        return null;
    }

    const rows = names
        .sort((a, b) => b.held_to - a.held_to)
        .map((name) => createData(name.first_name, name.middle_name, name.last_name, name.held_to));

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Paper data-cy="names" className={classes.paper}>
            <h1 className={classes.title}>Browse Upcoming Names 👀</h1>
			<p className={classes.disc}>
				List of names that will become available to use within the next 28 days.
			</p>
            <TableContainer>
                <Table className={classes.table} aria-label="names table">
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>
                                <strong>Name</strong>
                            </StyledTableCell>
                            <StyledTableCell>
                                <strong>Available From</strong>
                            </StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : rows
                        ).map((row) => (
                            <StyledTableRow data-cy="names" key={row.first_name}>
                                <StyledTableCell component="th" scope="row" style={{ width: '25%' }} align="left">
                                    {row.first_name}
                                </StyledTableCell>
                                <StyledTableCell component="th" scope="row" style={{ width: '25%' }} align="left">
                                    {row.middle_name}
                                </StyledTableCell>
                                <StyledTableCell component="th" scope="row" style={{ width: '25%' }} align="left">
                                    {row.last_name}
                                </StyledTableCell>
                                <StyledTableCell style={{ width: '25%' }} align="left">
                                    {row.held_to}
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}

                        {emptyRows > 0 && (
                            <StyledTableRow style={{ height: 53 * emptyRows }}>
                                <StyledTableCell colSpan={6} />
                            </StyledTableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={12}
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' },
                                native: true,
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableFooter>
                </Table>
            </TableContainer>
        </Paper>
    );
}
