import React, {useEffect, useState} from 'react';
import Router from 'next/router';
import Link from 'next/link';
import {useDispatch, useSelector} from 'react-redux';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Layout, {siteTitle} from '../../components/Layout';
import CardDayList from '../../components/Card.Day.List';
import {Breadcrumb} from "../../components/Breadcrumb";
import DownloadIcon from '@mui/icons-material/Download';
import downloadTimesheetDoc from "../../lib/downloadTimesheetDoc";
import {initMonthYearTask} from "../../lib/tasks";
import {validateNullOrEmptyObject} from "../../lib/helper";
import CustomDialogPrompt from "../../components/Dialog.Prompt";


MonthYear.getInitialProps = (appContext) => {
    return {slug: appContext.query.slug}
}

export default function MonthYear({slug}) {
    const dispatch = useDispatch();
    const storedYearMonth_redux = useSelector((state) => state.stored.value.yearMonth);
    const storedVariablesData_redux = useSelector((state) => state.stored.value.variablesData);
    const storedTasks_redux = useSelector((state) => state.tasks.value?.dates) || [];
    const [selectedYear, monthId] = slug;
    const [selectedMonth, setSelectedMonth] = useState();
    const [storedTasks, setStoredTasks] = useState();
    const [blank, setBlank] = useState(true);
    const [promptDialogMessage, setPromptDialogMessage] = useState(null);
    const [openPromptDialogMessage, setOpenPromptDialogMessage] = useState(false);
    const pageTitle = `${siteTitle} - Timesheet ${selectedMonth?.name} ${selectedYear}`;
    const breadcrumbList = [
        {name: 'Home', url: '/'},
        {name: 'Timesheet', url: '/timesheet'},
        {name: 'Detail'},
    ]

    useEffect(() => {
        setPromptDialogMessage("All variable data is not filled in. Are you sure to continue?");
    }, []);

    useEffect(() => {
        setStoredTasks(storedTasks_redux);
    }, [storedTasks_redux]);

    useEffect(() => {
        const selectedMonth = storedYearMonth_redux
            .find((object) => object.year?.toString() === selectedYear?.toString())
            ?.months
            ?.find((object) => object.id?.toString() === monthId?.toString());
        if (parseInt(selectedYear).toString().length !== 4) {
            Router.push('/timesheet?err=404');
        }
        if (parseInt(monthId) < 0 && parseInt(monthId) > 11) {
            Router.push('/timesheet?err=404');
        }
        if (!selectedMonth || selectedMonth.length === 0) {
            Router.push('/timesheet?err=404');
        }
        setBlank(false);
        setSelectedMonth(selectedMonth);
    }, [storedYearMonth_redux]);

    const getDownloadTimesheetDoc = () => {
        dispatch(initMonthYearTask({year: selectedYear, month: selectedMonth.id}));
        downloadTimesheetDoc(dispatch, storedVariablesData_redux, selectedYear, selectedMonth, storedTasks);
        setOpenPromptDialogMessage(false);
    }

    const prepareDownloadTimesheetDoc = () => {
        if (!validateNullOrEmptyObject(storedVariablesData_redux) ) {
            setOpenPromptDialogMessage(true);
            return;
        }
        getDownloadTimesheetDoc();
    }

    return (
        <Layout pageTitle={pageTitle} blank={blank}>
            <Container>
                <Breadcrumb breadcrumbList={breadcrumbList}/>
                <Button variant="contained" endIcon={<DownloadIcon />} onClick={prepareDownloadTimesheetDoc}>Monthly Report .docx</Button>
                <h3>Timesheet {selectedMonth?.name} {selectedYear}</h3>
                <CardDayList selectedMonth={selectedMonth} selectedYear={selectedYear}/>
                <CustomDialogPrompt open={openPromptDialogMessage} onClose={() => setOpenPromptDialogMessage(false)} onClick={getDownloadTimesheetDoc} message={promptDialogMessage} />
            </Container>
        </Layout>
    )
}
