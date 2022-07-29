import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import {save as saveStored} from '../lib/stored';
import Grid from "@mui/material/Grid";
import DialogContentText from "@mui/material/DialogContentText";
import {DialogModulePaperComponent} from "./Dialog.module.PaperComponent";


export default function DialogFormVariables({dialogFormVariablesOpen, onCloseDialogFormVariables}) {
    const dispatch = useDispatch();
    const storedVariablesData_redux = useSelector((state) => state.stored.value.variablesData);
    const [fullName, setFullName] = useState("");
    const [workUnit, setWorkUnit] = useState("");
    const [reportingManager, setReportingManager] = useState("");
    const [jobPosition, setJobPosition] = useState("");
    const [workingCompany, setWorkingCompany] = useState("");
    const [kepalaDivisi, setKepalaDivisi] = useState("");

    useEffect(() => {
        if (storedVariablesData_redux) {
            setFullName(storedVariablesData_redux?.full_name || "");
            setWorkUnit(storedVariablesData_redux?.work_unit || "");
            setReportingManager(storedVariablesData_redux?.reporting_manager || "");
            setJobPosition(storedVariablesData_redux?.job_position || "");
            setWorkingCompany(storedVariablesData_redux?.working_company || "");
            setKepalaDivisi(storedVariablesData_redux?.kepala_divisi || "");
        }
    }, [storedVariablesData_redux]);

    const handleSave = (event) => {
        event.preventDefault();
        const newVariables = {
            full_name: fullName,
            work_unit: workUnit,
            reporting_manager: reportingManager,
            job_position: jobPosition,
            working_company: workingCompany,
            kepala_divisi: kepalaDivisi
        }
        dispatch(saveStored({variablesData: newVariables}));
        onCloseDialogFormVariables();
    };

    const handle = {
        fullName: {
            change: (event) => {
                setFullName(event.target.value);
            }
        },
        workUnit: {
            change: (event) => {
                setWorkUnit(event.target.value);
            }
        },
        reportingManager: {
            change: (event) => {
                setReportingManager(event.target.value);
            }
        },
        jobPosition: {
            change: (event) => {
                setJobPosition(event.target.value);
            }
        },
        workingCompany: {
            change: (event) => {
                setWorkingCompany(event.target.value);
            }
        },
        kepalaDivisi: {
            change: (event) => {
                setKepalaDivisi(event.target.value);
            }
        },
    }

    return (
        <Dialog open={dialogFormVariablesOpen} onClose={onCloseDialogFormVariables} PaperComponent={DialogModulePaperComponent}>
            <DialogTitle className="draggable-area">Set Variables</DialogTitle>
            <DialogContentText/>
            <DialogContent>
                <form onSubmit={handleSave} id="form-variables">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormControl sx={{width: 1}}>
                                <TextField name="fullName" label="Full Name" variant="outlined" onChange={handle.fullName.change} value={fullName} />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl sx={{width: 1}}>
                                <TextField name="workUnit" label="Work Unit" variant="outlined" onChange={handle.workUnit.change} value={workUnit} />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl sx={{width: 1}}>
                                <TextField name="reportingManager" label="Reporting Manager" variant="outlined" onChange={handle.reportingManager.change} value={reportingManager} />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl sx={{width: 1}}>
                                <TextField name="jobPosition" label="Job Position" variant="outlined" onChange={handle.jobPosition.change} value={jobPosition} />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl sx={{width: 1}}>
                                <TextField name="workingCompany" label="Working Company" variant="outlined" onChange={handle.workingCompany.change} value={workingCompany} />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl sx={{width: 1}}>
                                <TextField name="kepalaDivisi" label="Kepala Divisi" variant="outlined" onChange={handle.kepalaDivisi.change} value={kepalaDivisi}/>
                            </FormControl>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCloseDialogFormVariables}>Cancel</Button>
                <Button type="submit" form="form-variables" variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    );
}