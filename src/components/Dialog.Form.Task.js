import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { dateIsWeekend } from "../lib/months";
import { remove as removeTask, save as saveTask } from "../lib/tasks";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import DialogContentText from "@mui/material/DialogContentText";
import { useEffect, useState } from "react";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DialogModulePaperComponent } from "./Dialog.module.PaperComponent";
import DialogSelectTaskType, { selectedTypes } from "./Dialog.Select.TaskType";
import yphMakeForm from "../lib/yphMakeForm";
import { useDispatch } from "react-redux";
import { save as saveStored } from "../lib/stored";
import Box from "@mui/material/Box";
import { DialogDelete } from "./Dialog.Delete";
import { scrollToCardDayId } from "./Card.Day.List";


export function DialogFormTask({
                                   isOpen,
                                   selectedType,
                                   selectedDate,
                                   handleCloseFormTask,
                                   defaultValue
                               }) {
    let yphForm = yphMakeForm({
                                  description: {
                                      initialState: "",
                                      validation: {
                                          max: 500
                                      },
                                      handle: {
                                          change: (event) => setDescription(event.target.value)
                                      }
                                  },
                                  jira: {
                                      initialState: "",
                                      validation: {
                                          max: 50
                                      },
                                      handle: {
                                          change: (event) => setJira(event.target.value)
                                      }
                                  },
                                  crf: {
                                      initialState: "",
                                      validation: {
                                          max: 50
                                      },
                                      handle: {
                                          change: (event) => setCrf(event.target.value)
                                      }
                                  }
                              });

    const dispatch = useDispatch();
    const initialState = {
        type: selectedTypes.TASK,
        typeOpen: false,
        isTypeHasChanged: false,
        date: new Date(),
        isWeekend: false,
        isMakeAnother: false
    };
    // FORM INPUT STATE
    const [jira, setJira] = useState(yphForm.input.jira.initialState);
    const [crf, setCrf] = useState(yphForm.input.crf.initialState);
    const [description, setDescription] = useState(yphForm.input.description.initialState);
    const [indexData, setIndexData] = useState(-1);
    // OTHER STATE
    const [editMode, setEditMode] = useState(false);
    const [type, setType] = useState(initialState.type);
    const [typeOpen, setTypeOpen] = useState(initialState.typeOpen);
    const [isTypeHasChanged, setIsTypeHasChanged] = useState(initialState.isTypeHasChanged);
    const [currentDate, setCurrentDate] = useState(initialState.date);
    const [isWeekend, setIsWeekend] = useState(initialState.isWeekend);
    const [isMakeAnother, setIsMakeAnother] = useState(initialState.isMakeAnother);
    const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);

    useEffect(() => {
        if (defaultValue) {
            setJira(defaultValue.jira);
            setCrf(defaultValue.crf);
            setDescription(defaultValue.description);
            setIndexData(defaultValue.indexData);
            setEditMode(true);
            setIsMakeAnother(false);
            return;
        }
        setJira(yphForm.input.jira.initialState);
        setCrf(yphForm.input.crf.initialState);
        setDescription(yphForm.input.description.initialState);
        setIndexData(-1);
        setEditMode(false);
    }, [defaultValue]);

    useEffect(() => {
        const selectedType_ = validatedSelectedType(selectedType);
        setType(selectedType_);
    }, [selectedType]);

    useEffect(() => {
        setCurrentDate(selectedDate);
    }, [selectedDate]);

    useEffect(() => {
        const isWeekend_ = dateIsWeekend(currentDate);
        setIsWeekend(isWeekend_);
        if (isWeekend_) {
            setType(selectedTypes.OVERTIME);
            return;
        }
        if (isTypeHasChanged) {
            setType(type);
            return;
        }
        setType(validatedSelectedType(selectedType));
    }, [currentDate]);

    const validatedSelectedType = (selectedType) => {
        return selectedType && selectedType.toUpperCase() === selectedTypes.OVERTIME.toUpperCase()
               ? selectedTypes.OVERTIME
               : selectedTypes.TASK;
    };

    const resetState = () => {
        setDescription(yphForm.input.jira.initialState);
        setJira(yphForm.input.crf.initialState);
        setCrf(yphForm.input.description.initialState);
    };

    yphForm.handle = {
        save: (event) => {
            event.preventDefault();
            const payLoad = {
                todo: {
                    jira: jira,
                    crf: crf,
                    description: description
                },
                date: currentDate.getDate(),
                month: currentDate.getMonth().toString(),
                year: currentDate.getFullYear(),
                type: type,
                indexData: indexData,
                initialDate: selectedDate.getDate(),
                initialType: selectedType
            };
            console.log('payLoad', payLoad);
            dispatch(saveTask(payLoad));
            resetState();
            if (isMakeAnother) {
                document.querySelector(`#${yphForm.input.jira.id}`).focus();
                return;
            }
            handleCloseFormTask();
            setIsMakeAnother(initialState.isMakeAnother);
            setIsTypeHasChanged(false);
            // setTimeout(() => {
            //     scrollToCardDayId(`card-date-${currentDate.getDate()}`, currentDate, selectedDate)
            //     // TODO: Add highlight to added task element
            // }, 200);
        },
        deleteConfirmed: () => {
            setDialogDeleteOpen(false);
            const payLoad = {
                month: currentDate.getMonth().toString(),
                year: currentDate.getFullYear(),
                indexData: indexData,
                initialDate: selectedDate.getDate(),
                initialType: selectedType
            };
            dispatch(removeTask(payLoad));
            resetState();
            handleCloseFormTask();
            setIsTypeHasChanged(false);
        },
        closeDialog: () => {
            setIsTypeHasChanged(false);
            handleCloseFormTask();
        }
    };

    const handle = {
        dialogSelectTaskType: {
            open: () => {
                setTypeOpen(true);
            },
            close: () => {
                setTypeOpen(false);
            },
            select: (chosenType) => {
                if (chosenType !== null) {
                    setType(chosenType);
                    setIsTypeHasChanged(true);
                    setTypeOpen(false);
                }
            }
        },
        datePicker: {
            change: (newValue) => {
                const newDate = new Date(newValue);
                if (newDate.getMonth().toString() !== selectedDate.getMonth().toString() || newDate.getFullYear().toString() !== selectedDate.getFullYear().toString()) {
                    dispatch(saveStored({
                                            message: {
                                                type: "warning",
                                                description: "Only select date on this month."
                                            }
                                        }));
                    return;
                }
                setCurrentDate(newDate);
            }
        },
        checkboxMakeAnother: {
            change: (event) => {
                setIsMakeAnother(event.target.checked);
            }
        },
        dialogDelete: {
            open: () => {
                setDialogDeleteOpen(true);
            },
            close: () => {
                setDialogDeleteOpen(false);
            }
        }
    };

    return (<>
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Dialog open={isOpen}
                    onClose={yphForm.handle.closeDialog}
                    PaperComponent={DialogModulePaperComponent}>
                <DialogTitle className="draggable-area">
                    {editMode ? "Edit" : "Add New"}
                    {' '}
                    {!isWeekend ? <span style={{
                        cursor: "pointer",
                        textDecoration: "underline"
                    }}
                                        onClick={handle.dialogSelectTaskType.open}>{type}</span> : type}
                </DialogTitle>
                <DialogContentText />
                <DialogContent>
                    <form id="form-task"
                          onSubmit={yphForm.handle.save}>
                        <Grid container
                              spacing={2}
                              sx={{marginBottom: 4}}>
                            <Grid item
                                  xs={12}
                                  sm={6}>
                                <FormControl sx={{width: 1}}>
                                    <DesktopDatePicker
                                        label="Date"
                                        inputFormat="DD/MM/yyyy"
                                        value={currentDate}
                                        renderInput={(params) => <TextField readOnly {...params} />}
                                        onChange={handle.datePicker.change} />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container
                              spacing={2}>
                            <Grid item
                                  xs={12}
                                  sm={6}>
                                <FormControl sx={{width: 1}}>
                                    <TextField id={yphForm.input.jira.id}
                                               value={jira}
                                               onChange={yphForm.input.jira.handle.change}
                                               label="Jira Link / Code"
                                               variant="outlined"
                                               helperText=" "
                                               autoComplete="off"
                                               autoFocus={true}
                                               inputProps={{maxLength: yphForm.input.jira.validation.max}} />
                                </FormControl>
                            </Grid>
                            <Grid item
                                  xs={12}
                                  sm={6}>
                                <FormControl sx={{width: 1}}>
                                    <TextField id={yphForm.input.crf.id}
                                               value={crf}
                                               onChange={yphForm.input.crf.handle.change}
                                               label="CRF / G-Canvas Number"
                                               variant="outlined"
                                               helperText=" "
                                               autoComplete="off"
                                               inputProps={{maxLength: yphForm.input.crf.validation.max}} />
                                </FormControl>
                            </Grid>
                            <Grid item
                                  xs={12}>
                                <FormControl sx={{width: 1}}>
                                    <TextField
                                        id={yphForm.input.description.id}
                                        value={description}
                                        onChange={yphForm.input.description.handle.change}
                                        multiline
                                        required
                                        rows={3}
                                        inputProps={{maxLength: yphForm.input.description.validation.max}}
                                        label="Description"
                                        placeholder="Copas Jira title or describe your task here."
                                        helperText={`${description?.length || 0}/${yphForm.input.description.validation.max}`}
                                    />
                                </FormControl>
                            </Grid>
                            {!editMode &&
                                <Grid item
                                      xs={12}>
                                    <FormControl>
                                        <FormControlLabel
                                            control={<Checkbox checked={isMakeAnother}
                                                               onChange={handle.checkboxMakeAnother.change} />}
                                            label="Make another?"
                                        />
                                    </FormControl>
                                </Grid>
                            }
                        </Grid>
                    </form>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        marginTop: 5
                    }}>
                        {editMode ?
                         <Button color="error"
                                 onClick={handle.dialogDelete.open}>Delete</Button>
                                  : <div></div>
                        }
                        <Box sx={{display: "flex"}}>
                            <Button onClick={yphForm.handle.closeDialog}>Cancel</Button>
                            <Button type="submit"
                                    form="form-task"
                                    variant="contained"
                                    sx={{marginLeft: 2}}>{editMode ? "Update" : "Add"}</Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
            <DialogSelectTaskType typeOpen={typeOpen}
                                  onClose={handle.dialogSelectTaskType.close}
                                  onSelect={handle.dialogSelectTaskType.select} />
            <DialogDelete open={dialogDeleteOpen}
                          onClose={handle.dialogDelete.close}
                          onClick={yphForm.handle.deleteConfirmed}
                          itemToDelete={`this ${type}`} />
        </LocalizationProvider>
    </>);
}