import Draggable from "react-draggable";
import {Paper} from "@mui/material";

export function DialogModulePaperComponent(props) {
    return (<Draggable
        handle=".draggable-area"
        cancel={'[class*="MuiDialogContent-root"]'}
    >
        <Paper {...props} />
    </Draggable>);
}