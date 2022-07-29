import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import React, {useEffect, useState} from "react";
import {DialogModulePaperComponent} from "./Dialog.module.PaperComponent";

export default function CustomDialogPrompt({open, onClose, onClick, message = "hmm?"}) {

    return <Dialog
        open={open}
        onClose={onClose}
        PaperComponent={DialogModulePaperComponent}
    >
        <DialogTitle className="draggable-area">
            Wait!
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                {message}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} autoFocus>Cancel</Button>
            <Button onClick={onClick} variant="contained">
                Yes, baby!
            </Button>
        </DialogActions>
    </Dialog>;
}