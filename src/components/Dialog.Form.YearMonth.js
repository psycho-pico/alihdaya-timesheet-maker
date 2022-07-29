import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import {getAllMonths, getMonthById, getThisMonth} from '../lib/months';
import {remove as removeStored, save as saveStored} from '../lib/stored';
import {save as saveSelected} from '../lib/selected';
import Grid from "@mui/material/Grid";
import DialogContentText from "@mui/material/DialogContentText";
import {Checkbox, FormControlLabel} from "@mui/material";
import {DialogDelete} from "./Dialog.Delete";
import {formatYear} from "../lib/helper";
import {DialogModulePaperComponent} from "./Dialog.module.PaperComponent";


export default function DialogFormYearMonth() {
    const dispatch = useDispatch();
    const selectedYear_redux = useSelector((state) => state.selected.value.year);
    const allMonthsData = getAllMonths();
    const thisMonth = getThisMonth();
    const [open, setOpen] = useState(false);
    const [openDeleteAllMonth, setOpenDeleteAllMonth] = useState(false);
    const [tempYear, setTempYear] = useState("");
    const [tempMonth, setTempMonth] = useState({});
    const [isMakeAnother, setIsMakeAnother] = useState(false);

    useEffect(() => {
        setTempYear(selectedYear_redux);
    }, [selectedYear_redux]);

    useEffect(() => {
        setTempMonth(thisMonth);
    }, [thisMonth]);

    const onChangeInputYear = (event) => {
        let newValue = formatYear(event.target.value);
        setTempYear(newValue);
    };

    const onChangeChangeMonth = (event) => {
        if (event.target.value === "all") {
            setTempMonth({id: "all"});
            return;
        }
        const selectedMonth = getMonthById(event.target.value);
        setTempMonth(selectedMonth);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = (event) => {
        event.preventDefault();
        let monthsToStore = [tempMonth];
        if (tempMonth.id === "all") {
            monthsToStore = allMonthsData;
        }
        dispatch(saveSelected({year: tempYear}));
        monthsToStore.map((month) => {
            const yearMonth = {
                year: tempYear,
                month: month
            }
            dispatch(saveStored({yearMonth: yearMonth}));
        });

        if (!isMakeAnother) {
            setOpen(false);
        }
    };

    const onChangeCheckboxMakeAnother = (event) => {
        setIsMakeAnother(event.target.checked);
    };

    const handleOpenModalDeleteAllMonth = () => {
        setOpenDeleteAllMonth(true);
    }

    const handleCloseModalDeleteAllMonth = () => {
        setOpenDeleteAllMonth(false);
    }

    const handleClickDeleteAllMonthConfirmed = () => {
        allMonthsData.map((month) => {
            const yearMonth = {
                year: tempYear,
                month: month
            }
            dispatch(removeStored({yearMonth: yearMonth}));
        });
        handleCloseModalDeleteAllMonth();
    }

    return (
        <div>
            <Button onClick={handleClickOpen} sx={{marginTop: 2}}>Add</Button>
            <Button color="error" onClick={handleOpenModalDeleteAllMonth} sx={{marginTop: 2}}>Delete All</Button>
            <Dialog open={open} onClose={handleClose} PaperComponent={DialogModulePaperComponent}>
                <DialogTitle className="draggable-area">Add Month</DialogTitle>
                <DialogContentText/>
                <DialogContent>
                    <form onSubmit={handleSave} id="form-picker-month">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <FormControl sx={{width: 1}}>
                                    <TextField required={true} id="input-year" name="input-year" label="Select Year"
                                               variant="outlined"
                                               onChange={onChangeInputYear} value={tempYear} autoComplete="off"/>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl sx={{width: 1}}>
                                    <InputLabel id="demo-simple-select-label">Month</InputLabel>
                                    <Select
                                        required={true}
                                        labelId="select-month-label"
                                        id="select-month"
                                        value={tempMonth.id}
                                        label="Month"
                                        onChange={onChangeChangeMonth}
                                    >
                                        <MenuItem value="all">All Month</MenuItem>
                                        {allMonthsData.map(({id, name}) => {
                                            return (
                                                <MenuItem key={id} value={id}>{name}</MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl>
                                    <FormControlLabel
                                        control={<Checkbox checked={isMakeAnother}
                                                           onChange={onChangeCheckboxMakeAnother}/>}
                                        label="Make another?"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" form="form-picker-month" variant="contained">Add</Button>
                </DialogActions>
            </Dialog>
            <DialogDelete open={openDeleteAllMonth} onClose={handleCloseModalDeleteAllMonth}
                          onClick={handleClickDeleteAllMonthConfirmed}
                          itemToDelete="all month and its content on selected year"/>
        </div>
    );
}