import {DialogModulePaperComponent} from "./Dialog.module.PaperComponent";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import {List, ListItem, ListItemAvatar, ListItemText} from "@mui/material";

export const selectedTypes = {
    TASK: "Task", OVERTIME: "Overtime"
}

const DialogSelectTaskType = ({typeOpen, onClose, onSelect}) => {
    return <Dialog open={typeOpen} onClose={onClose} PaperComponent={DialogModulePaperComponent}>
        <DialogTitle className="draggable-area">Choose Type</DialogTitle>
        <List sx={{pt: 0}}>
            {Object.values(selectedTypes).map((item, key) => <ListItem button key={key}
                                                                       onClick={() => onSelect(item)}>
                <ListItemAvatar>
                    {item === selectedTypes.OVERTIME ? '⌚' : '📃'}
                </ListItemAvatar>
                <ListItemText primary={item}/>
            </ListItem>)}
        </List>
    </Dialog>
}

export default DialogSelectTaskType;