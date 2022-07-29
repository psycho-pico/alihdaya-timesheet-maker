import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import {save as saveSelected, thisYear} from '../lib/selected';
import Grid from "@mui/material/Grid";
import DialogContentText from "@mui/material/DialogContentText";
import {formatYear} from "../lib/helper";
import {DialogModulePaperComponent} from "./Dialog.module.PaperComponent";


export default function DialogFormYear() {
    const dispatch = useDispatch();
    const selectedYear = useSelector((state) => state.selected.value.year);
    const [open, setOpen] = useState(false);
    const [tempYear, setTempYear] = useState("");
    const [year, setYear] = useState("");

    useEffect(() => {
        setYear(selectedYear);
        setTempYear(selectedYear);
    }, [selectedYear]);

    const onChangeInputYear = (event) => {
        let newValue = formatYear(event.target.value);
        setTempYear(newValue);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (event) => {
        setOpen(false);
    };

    const handleSave = (event) => {
        event.preventDefault();
        let yearToSaved = tempYear
        if (tempYear === "") {
            yearToSaved = thisYear();
        }
        setYear(yearToSaved);
        dispatch(saveSelected({year: yearToSaved}));
        setOpen(false);
    };

    return (
        <div>
            <Button onClick={handleClickOpen} sx={{marginBottom: 2}}>Tahun {year}</Button>
            <Dialog open={open} onClose={handleClose} PaperComponent={DialogModulePaperComponent}>
                <DialogTitle className="draggable-area">Select Year</DialogTitle>
                <DialogContentText/>
                <DialogContent>
                    <form onSubmit={handleSave} id="form-picker-year">
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl sx={{width: 1}}>
                                    <TextField id="input-year" label="Select Year" variant="outlined"
                                               onChange={onChangeInputYear} value={tempYear} autoComplete="off"
                                               autoFocus={true}/>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" form="form-picker-year" variant="contained">Set</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}