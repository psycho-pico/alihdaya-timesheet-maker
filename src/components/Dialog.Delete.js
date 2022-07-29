import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import React from "react";
import {DialogModulePaperComponent} from "./Dialog.module.PaperComponent";

export function DialogDelete({open, onClose, onClick, itemToDelete = "this data"}) {
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
                You're about to delete <strong>{itemToDelete}</strong>. <br/>
                This action can't be undone, even if you pray to Allah. <br/>
                Are you sure?
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