import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Grid from '@mui/material/Grid';
import CardMonth from './Card.Month';
import {getAllMonths, getMonthById} from '../lib/months';
import {remove as removeStored} from '../lib/stored';
import {DialogDelete} from "./Dialog.Delete";


export default function CardMonthList() {
    const dispatch = useDispatch();
    const selectedYear_redux = useSelector((state) => state.selected.value.year);
    const storedYearMonth_redux = useSelector((state) => state.stored.value.yearMonth);
    const date = new Date();
    const allMonthsData = getAllMonths();
    const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
    const [tempYearMonthToDelete, setTempYearMonthToDelete] = useState({});
    const [monthsOfYear, setMonthsOfYear] = useState();

    useEffect(() => {
        const monthsOfYear_ = storedYearMonth_redux.find((object) => object.year?.toString() === selectedYear_redux?.toString())?.months;
        setMonthsOfYear(monthsOfYear_)
    }, [selectedYear_redux, storedYearMonth_redux]);

    const handleClickDelete = (event) => {
        const yearMonth = {
            year: event.target.dataset.year,
            month: getMonthById(event.target.dataset.month)
        }
        setTempYearMonthToDelete(yearMonth);
        setDialogDeleteOpen(true);
    };

    const handleCloseModalDelete = () => {
        setDialogDeleteOpen(false);
        setTempYearMonthToDelete({});
    };

    const handleClickDeleteConfirmed = () => {
        dispatch(removeStored({yearMonth: tempYearMonthToDelete}));
        handleCloseModalDelete();
    };

    return (
        <div>
            {monthsOfYear?.length > 0 &&
                <Grid container spacing={2}>
                    {monthsOfYear.map((month, key) =>
                        <Grid key={key} item xs={6} sm={6} md={4} lg={3} xl={2}>
                            <CardMonth year={selectedYear_redux} month={month}
                                       isThisMonth={allMonthsData[date.getMonth()].name === month?.name}
                                       handleClickDelete={handleClickDelete}/>
                        </Grid>
                    )}
                </Grid>
            }
            <DialogDelete open={dialogDeleteOpen} onClose={handleCloseModalDelete} onClick={handleClickDeleteConfirmed}
                          itemToDelete="this month and its contents"/>
        </div>
    );
}