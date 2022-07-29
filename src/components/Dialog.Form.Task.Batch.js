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
import { useDispatch, useSelector } from "react-redux";
import { save as saveStored } from "../lib/stored";
import Box from "@mui/material/Box";
import { DialogDelete } from "./Dialog.Delete";
import { scrollToCardDayId } from "./Card.Day.List";
import Typography from "@mui/material/Typography";
import CustomDialogPrompt from "./Dialog.Prompt";


export function DialogFormTaskBatch({
                                   isOpen,
                                   selectedDate,
                                   handleCloseFormTaskBatch,
                                   selectedMonth
                               }) {
    let yphForm = yphMakeForm({
                                  json: {
                                      initialState: "",
                                      validation: {
                                          max: 50000
                                      },
                                      handle: {
                                          change: (event) => setJson(event.target.value)
                                      }
                                  }
                              });

    const dispatch = useDispatch();
    const initialState = {
        date: new Date()
    };
    // FORM INPUT STATE
    const [json, setJson] = useState(yphForm.input.json.initialState);
    // OTHER STATE
    const [currentDate, setCurrentDate] = useState(initialState.date);
    const [openPromptDialogMessage, setOpenPromptDialogMessage] = useState(false);
    const [promptDialogMessage, setPromptDialogMessage] = useState("");
    const [batchData, setBatchData] = useState([]);

    useEffect(() => {
        setCurrentDate(selectedDate);
    }, [selectedDate]);

    const resetState = () => {
        setJson(yphForm.input.json.initialState);
    };

    yphForm.handle = {
        save: (event) => {
            event.preventDefault();
            let validJson = false;
            let jsonObject = [];
            try {
                jsonObject = JSON.parse(json);
                validJson = true;
            } catch (e) {}
            if (jsonObject.length < 1 || !validJson) {
                dispatch(saveStored({
                    message: {
                        type: "warning",
                        description: "Can't read JSON."
                    }
                }));
                return;
            }
            setBatchData(jsonObject);
            setOpenPromptDialogMessage(true);
            setPromptDialogMessage(`Are you sure to save ${jsonObject.length} task to timesheet ${selectedMonth?.name} ${currentDate.getFullYear()}?`)
        },
        closeDialog: () => {
            handleCloseFormTaskBatch();
        }
    };

    const saveBatch = (object) => {
        let date = object.date ? new Date(object.date) : null
        let day = date ? date.getDate() : 1;
        let type = object.overtime ? selectedTypes.OVERTIME : selectedTypes.TASK;
        const payLoad = {
            todo: {
                jira: object.jira,
                crf: object.crf,
                description: object.description
            },
            date: day,
            month: currentDate.getMonth().toString(),
            year: currentDate.getFullYear(),
            type: type,
            indexData: -1,
            initialDate: day,
            initialType: type
        };
        dispatch(saveTask(payLoad));
    };

    const handleProcessToSave = () => {
        console.log('start saving');
        console.log('jsonObject', batchData);
        batchData.map((object) => {
            console.log('saving: ', object);
            saveBatch(object);
        });
        console.log('done saving');
        setOpenPromptDialogMessage(false);
        resetState();
        handleCloseFormTaskBatch();
    }

    const handleClosePromptDialog = () => {
        setOpenPromptDialogMessage(false);
    }

    return (<>
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Dialog open={isOpen}
                    onClose={yphForm.handle.closeDialog}
                    PaperComponent={DialogModulePaperComponent}
                    fullWidth={true}
                    maxWidth={"md"}>
                <DialogTitle className="draggable-area">
                    Add Batch Task
                </DialogTitle>
                <DialogContentText />
                <DialogContent>
                    <Typography variant="subtitle2" sx={{marginBottom: 0}}>Format</Typography>
                    <Typography variant="body2" sx={{marginBottom: 2}}>
                        <code>{`[{description: "String", jira: "String", crf: "String", date: "String", overtime: boolean}, ...].`}</code>
                    </Typography>
                    <form id="form-task"
                          onSubmit={yphForm.handle.save}>
                        <Grid container
                              spacing={2}>
                            <Grid item
                                  xs={12}>
                                <FormControl sx={{width: 1}}>
                                    <TextField
                                        id={yphForm.input.json.id}
                                        value={json}
                                        onChange={yphForm.input.json.handle.change}
                                        multiline
                                        required
                                        rows={10}
                                        autoFocus={true}
                                        inputProps={{maxLength: yphForm.input.json.validation.max}}
                                        label="JSON"
                                        placeholder='Add JSON here.'
                                        helperText={`${json?.length || 0}/${yphForm.input.json.validation.max}`}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </form>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        marginTop: 5
                    }}>
                        <Box sx={{display: "flex"}}>
                            <Button onClick={yphForm.handle.closeDialog}>Cancel</Button>
                            <Button type="submit"
                                    form="form-task"
                                    variant="contained"
                                    sx={{marginLeft: 2}}>Add</Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
            <CustomDialogPrompt open={openPromptDialogMessage} onClose={handleClosePromptDialog} onClick={handleProcessToSave} message={promptDialogMessage} />
        </LocalizationProvider>
    </>);
}