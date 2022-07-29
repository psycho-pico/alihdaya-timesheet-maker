import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import {dateIsWeekend, getFormattedTimesheetDate} from "../lib/months";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {initMonthYearTask} from '../lib/tasks';
import {Avatar, CardActionArea, Divider, List, ListItem, ListItemAvatar, ListItemText, Skeleton} from "@mui/material";
import Box from "@mui/material/Box";
import {selectedTypes} from "./Dialog.Select.TaskType";


export default function CardDay({day, handleOpenFormTask}) {
    const dispatch = useDispatch();
    const storedTasks_redux = useSelector((state) => state.tasks.value?.dates) || [];
    const today = new Date();
    const isWeekend = dateIsWeekend(day);
    const isToday = today.getMonth() === day.getMonth() && today.getFullYear() === day.getFullYear() && today.getDate() === day.getDate();
    const [storedTasks, setStoredTasks] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(initMonthYearTask({year: day.getFullYear(), month: day.getMonth()}));
    }, []);

    useEffect(() => {
        const dayStoredTask = storedTasks_redux?.find(object => object.date.toString() === day.getDate().toString()) || {};
        setStoredTasks(dayStoredTask);
        setLoading(false);
    }, [storedTasks_redux]);

    return (loading
            ? <Skeleton/>
            : <Card sx={{minWidth: 275}} className={isToday ? 'selected' : ''}>
                <CardContent>

                    {/*Full Date*/}
                    <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                        {getFormattedTimesheetDate(day)}
                    </Typography>

                    {/*Name of The Day*/}
                    <Typography variant="h5" component="div"
                                color={isWeekend ? 'error' : 'text.primary'}
                                title={isWeekend ? 'Weekend' : ''}>
                        {day.toLocaleDateString(['id', 'en-US'], {weekday: 'long'})}
                    </Typography>

                    {/*Duration*/}
                    {/*TODO: ADD, EDIT, DELETE DURATION*/}
                    {(isWeekend && storedTasks?.overtime?.length > 0) || (!isWeekend) ?
                        <Typography variant="body2" color="text.secondary">
                            Duration: {storedTasks?.task?.length > 0 && storedTasks?.overtime.length > 0 ? 1.5 : 1} day
                        </Typography>
                        : <Box />
                    }

                    {/*Tasks*/}
                    {storedTasks?.task && storedTasks?.task.length > 0 &&
                        <>
                            <List>
                                {storedTasks?.task.map(({crf, description, jira}, key) => {
                                    return (
                                        <CardActionArea key={key} sx={{cursor: "pointer"}} onClick={() => handleOpenFormTask({
                                            type: selectedTypes.TASK, date: day.getDate(), defaultValue: {
                                                description: description,
                                                jira: jira,
                                                crf: crf,
                                                indexData: key
                                            }
                                        })}>
                                            <ListItem alignItems="flex-start">
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        {key + 1}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    secondary={description}
                                                    primary={
                                                        <>
                                                            {jira && <>
                                                                <Typography component="span" variant="caption"
                                                                            color="primary">
                                                                    Jira
                                                                </Typography>
                                                                {" "}
                                                                {jira}
                                                            </>}
                                                            {crf && jira && <>
                                                                <Typography component="span" variant="body1"
                                                                            color="text.secondary"
                                                                            sx={{marginRight: 1, marginLeft: 1}}>
                                                                    •
                                                                </Typography>
                                                            </>}
                                                            {crf && <>
                                                                <Typography component="span" variant="caption"
                                                                            color="primary">
                                                                    CRF / G-Canvas Number
                                                                </Typography>
                                                                {" "}
                                                                {crf}
                                                            </>}
                                                        </>
                                                    }
                                                />
                                            </ListItem>
                                            <Divider variant="inset" component="li"/>
                                        </CardActionArea>
                                    )
                                })}
                            </List>
                        </>
                    }

                    {/*Overtime*/}
                    {storedTasks?.overtime && storedTasks?.overtime.length > 0 &&
                        <>
                            <Typography component={'h6'} variant="h6" color="text.primary" sx={{marginTop: 3}}>
                                Overtime
                            </Typography>
                            <List>
                                {storedTasks?.overtime.map(({crf, description, jira}, key) => {
                                    return (
                                        <CardActionArea key={key} sx={{cursor: "pointer"}} onClick={() => handleOpenFormTask({
                                            type: selectedTypes.OVERTIME, date: day.getDate(), defaultValue: {
                                                description: description,
                                                jira: jira,
                                                crf: crf,
                                                indexData: key
                                            }
                                        })}>
                                            <ListItem alignItems="flex-start">
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        {key + 1}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    secondary={description}
                                                    primary={
                                                        <>
                                                            {jira && <>
                                                                <Typography component="span" variant="caption"
                                                                            color="primary">
                                                                    Jira
                                                                </Typography>
                                                                {" "}
                                                                {jira}
                                                            </>}
                                                            {crf && jira && <>
                                                                {crf && <>
                                                                    <Typography component="span" variant="body1"
                                                                                color="text.secondary"
                                                                                sx={{marginRight: 1, marginLeft: 1}}>
                                                                        •
                                                                    </Typography>
                                                                </>}
                                                                <Typography component="span" variant="caption"
                                                                            color="primary">
                                                                    CRF
                                                                </Typography>
                                                                {" "}
                                                                {crf}
                                                            </>}
                                                        </>
                                                    }
                                                />
                                            </ListItem>
                                            <Divider variant="inset" component="li"/>
                                        </CardActionArea>
                                    )
                                })}
                            </List>
                        </>
                    }
                </CardContent>
                <CardActions>
                    {!isWeekend &&
                        <Button size="small"
                                onClick={() => handleOpenFormTask({type: selectedTypes.TASK, date: day.getDate()})}>Add
                            Task</Button>
                    }
                    <Button size="small"
                            onClick={() => handleOpenFormTask({type: selectedTypes.OVERTIME, date: day.getDate()})}>Add
                        Overtime</Button>
                </CardActions>
            </Card>
    )
}