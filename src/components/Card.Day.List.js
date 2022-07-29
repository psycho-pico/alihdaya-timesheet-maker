import Grid from '@mui/material/Grid';
import {getAllDaysInMonth} from '../lib/months';
import CardDay from "./Card.Day";
import {useEffect, useState} from "react";
import {DialogFormTask} from "./Dialog.Form.Task";
import {DialogFormTaskBatch} from "./Dialog.Form.Task.Batch";
import {useDispatch, useSelector} from "react-redux";
import {LocalizationProvider, PickersDay, StaticDatePicker} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {save as saveStored} from "../lib/stored";
import Box from "@mui/material/Box";
import { Badge, Button } from "@mui/material";
import {initMonthYearTask} from "../lib/tasks";
import {selectedTypes} from "./Dialog.Select.TaskType";


const scrollToCardDayId = (elemId, newValueDate, oldValueDay) => {
    const element = document.getElementById(elemId);
    window.scroll({
        top: element.offsetTop - (newValueDate < oldValueDay ? 1 : 0),
        behavior: 'smooth'
    });
    setTimeout(() => {
        window.scrollBy(0, 1);
    }, 750);
}

export default function CardDayList({selectedMonth, selectedYear}) {
    const dispatch = useDispatch();
    const storedTasks_redux = useSelector((state) => state.tasks.value?.dates) || [];
    const allDaysInMonth = getAllDaysInMonth(selectedYear, selectedMonth?.id);
    const [openFormTask, setOpenFormTask] = useState(false);
    const [openFormTaskBatch, setOpenFormTaskBatch] = useState(false);
    const [storedTasks, setStoredTasks] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dialogFormTaskDefaultValue, setDialogFormTaskDefaultValue] = useState(null);
    const [focusedScrolledDay, setFocusedScrolledDay] = useState(null);
    const [scrollSpy, setScrollSpy] = useState(true);

    useEffect(() => {
        dispatch(initMonthYearTask({year: selectedYear.toString(), month: selectedMonth?.id}));
    }, []);

    useEffect(() => {
        let dayStoredTask = storedTasks_redux?.map((object) => {
            if (object.task.length > 0 || object.overtime.length > 0) {
                return {date: object.date, overtime: object.overtime.length, task: object.task.length};
            }
            return null;
        })
        dayStoredTask = dayStoredTask.filter((object) => object !== null);
        setStoredTasks(dayStoredTask);
    }, [storedTasks_redux]);

    useEffect(() => {
        if (focusedScrolledDay) {
        }
    }, [focusedScrolledDay]);

    useEffect(() => {
        const sections = [];
        let timeoutId;
        allDaysInMonth.map((day, key) => {
            const cardDate = document.getElementById(`card-date-${day.getDate()}`);
            const cardDateTop = cardDate.offsetTop - 10;
            const cardDateHeight = cardDate.offsetHeight;
            sections[day.getDate()] = [cardDateTop, cardDateTop + cardDateHeight];
        })
        const onScroll = () => {
            const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
            let dayScrolled = 0;
            let day = 0;
            clearTimeout(timeoutId)
            for (day in sections) {
                if (scrollSpy && sections[day][0] <= scrollPosition && sections[day][1] >= scrollPosition) {
                    if (day.toString() !== focusedScrolledDay?.getDate().toString()) {
                        timeoutId = setTimeout(function () {
                            dayScrolled = day;
                            setFocusedScrolledDay(new Date(selectedYear, selectedMonth.id, dayScrolled));
                        }, 200);
                    }
                }
            }
            if (scrollSpy && scrollPosition <= sections[1][0]) {
                setFocusedScrolledDay(new Date(selectedYear, selectedMonth.id, 1));
            }
        };
        window.addEventListener("scroll", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    });

    const handleOpenFormTask = ({type, date, defaultValue = null}) => {
        setDialogFormTaskDefaultValue(null);
        if (defaultValue) {
            setDialogFormTaskDefaultValue(defaultValue);
        }
        const newDate = new Date(selectedYear, selectedMonth.id, parseInt(date));
        setSelectedType(type);
        setSelectedDate(newDate);
        setOpenFormTask(true);
    };

    const handleOpenFormTaskBatch = () => {
        const newDate = new Date(selectedYear, selectedMonth.id, 1);
        setSelectedDate(newDate);
        setOpenFormTaskBatch(true);
    };

    const handleCloseFormTask = () => {
        setOpenFormTask(false);
    };

    const handleCloseFormTaskBatch = () => {
        setOpenFormTaskBatch(false);
    };

    return (<div>
        <Grid container>
            <Grid item md={5} lg={4} display={{xs: 'none', md: 'block', lg: 'block'}}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <Box sx={{position: "fixed"}}>
                        <StaticDatePicker
                            displayStaticWrapperAs="desktop"
                            value={focusedScrolledDay}
                            onChange={(newValue) => {
                                if (new Date(newValue).getMonth() !== selectedDate.getMonth() || new Date(newValue).getFullYear() !== selectedDate.getFullYear()) {
                                    dispatch(saveStored({
                                        message: {
                                            type: "warning",
                                            description: "Only select date on this month."
                                        }
                                    }));
                                    return;
                                }
                                scrollToCardDayId(`card-date-${new Date(newValue).getDate()}`, new Date(newValue), focusedScrolledDay);
                                setFocusedScrolledDay(new Date(newValue));
                            }}
                            renderInput={(params) => <div/>}
                            renderDay={(day, _value, DayComponentProps) => {
                                let isSelectedTask = false;
                                let isSelectedOvertime = false;
                                if (!DayComponentProps.outsideCurrentMonth && selectedMonth?.id === day._d.getMonth() && selectedYear === day._d.getFullYear().toString()) {
                                    isSelectedTask = [...storedTasks].filter((object) => object.task > 0).map((object) => object.date).indexOf(day._d.getDate()) >= 0;
                                    isSelectedOvertime = [...storedTasks].filter((object) => object.overtime > 0).map((object) => object.date).indexOf(day._d.getDate()) >= 0;
                                }
                                return (
                                    <Badge
                                        key={day.toString()}
                                        overlap="circular"
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                          }}
                                        badgeContent={ (isSelectedTask || isSelectedOvertime) &&
                                            <Badge color={isSelectedTask && isSelectedOvertime ? 'tertiary' : isSelectedOvertime ? 'secondary' : 'primaryDarken'} variant="dot" />
                                        }
                                    >
                                        <PickersDay {...DayComponentProps} sx={{color: "primary"}} />
                                    </Badge>
                                )
                            }}
                        />
                    </Box>
                </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={7} lg={8}>
                <Button variant={"contained"} sx={{marginBottom: 3}} onClick={handleOpenFormTaskBatch}>Add Batch</Button>
                {allDaysInMonth?.length > 0 && <Grid container spacing={2}>
                    {allDaysInMonth.map((day, key) => {
                        return (<Grid key={key} item xs={12} sm={12} md={12} lg={12} xl={12}
                                      id={`card-date-${day.getDate()}`}>
                            <CardDay day={day} handleOpenFormTask={handleOpenFormTask}/>
                        </Grid>);
                    })}
                </Grid>}
            </Grid>
        </Grid>
        <DialogFormTask isOpen={openFormTask} selectedDate={selectedDate}
                        selectedType={selectedType}
                        handleCloseFormTask={handleCloseFormTask}
                        defaultValue={dialogFormTaskDefaultValue}/>
        <DialogFormTaskBatch isOpen={openFormTaskBatch} selectedDate={selectedDate}
                        handleCloseFormTaskBatch={handleCloseFormTaskBatch} selectedMonth={selectedMonth}/>
    </div>)

}

export {scrollToCardDayId}