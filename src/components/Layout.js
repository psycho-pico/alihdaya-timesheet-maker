import Head from 'next/head';
import moduleCSS from './Layout.module.scss';
import {
    Alert,
    AppBar,
    Backdrop, Button,
    CircularProgress,
    FormControlLabel,
    FormGroup,
    IconButton,
    Slide,
    Snackbar,
    Toolbar,
    useScrollTrigger
} from "@mui/material";
import Container from "@mui/material/Container";
import MenuIcon from '@mui/icons-material/Menu';
import Typography from "@mui/material/Typography";
import Image from "next/image";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Link from "next/link";
import {MaterialUISwitch} from "./Layout.module.MaterialUISwitch";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {save as saveSelected} from '../lib/selected';
import {removeTasksMessage} from "../lib/tasks";
import {removeStoredMessage} from "../lib/stored";
import DialogFormVariables from "./Dialog.Form.Variables";

export const siteTitle = 'Alihdaya Timesheet Maker';

function HideOnScroll(props) {
    const {children, window} = props;
    const trigger = useScrollTrigger({
        target: window ? window() : undefined
    });

    return (<Slide id="header-wrapper" appear={false} direction="down" in={!trigger}>
        {children}
    </Slide>);
}

HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired, window: PropTypes.func
};

export default function Layout({pageTitle, children, blank = false}) {
    const dispatch = useDispatch();
    const themes_redux = useSelector((state) => state.selected.value.themes);
    const selectedTheme_redux = useSelector((state) => state.selected.value.theme);
    const messageStored_redux = useSelector((state) => state.stored.value.message);
    const messageTasks_redux = useSelector((state) => state.tasks.value.message);
    const [themeIsDark, setThemeIsDark] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({});
    const [dialogFormVariablesOpen, setDialogFormVariablesOpen] = useState(false);

    useEffect(() => {
        if (messageStored_redux && messageStored_redux.description !== undefined && messageStored_redux.type !== undefined) {
            setSnackbar({
                type: messageStored_redux?.type,
                description: messageStored_redux?.description
            });
            setSnackbarOpen(true);
            dispatch(removeStoredMessage());
        }
    }, [messageStored_redux]);

    useEffect(() => {
        if (messageTasks_redux && messageTasks_redux.description !== undefined && messageTasks_redux.type !== undefined) {
            setSnackbar({
                type: messageTasks_redux?.type,
                description: messageTasks_redux?.description
            });
            setSnackbarOpen(true);
            dispatch(removeTasksMessage());
        }
    }, [messageTasks_redux]);

    useEffect(() => {
        const themeIsDark = !!themes_redux.indexOf(selectedTheme_redux);
        setThemeIsDark(themeIsDark);
    }, [selectedTheme_redux]);

    const onChangeThemeSwitch = (event) => {
        const isChecked = event.target.checked;
        setThemeIsDark(isChecked);
        dispatch(saveSelected({theme: themes_redux[~~isChecked]}));
    };

    const openDialogFormVariables = () => {
        setDialogFormVariablesOpen(true);
    };

    const onCloseDialogFormVariables = () => {
        setDialogFormVariablesOpen(false);
    };

    return <>
        <Backdrop
            sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
            open={blank}
        >
            <CircularProgress color="inherit"/>
        </Backdrop>
        <Head>
            <title>{pageTitle}</title>
            <meta
                name="description"
                content="Make timesheet faster!"
            />
            <meta
                property="og:image"
                content="/images/logo.jpg"
            />
            <link rel="icon" href="/favicon.ico"/>
            <meta name="viewport" content="initial-scale=1, width=device-width"/>
            <meta name="og:title" content={pageTitle}/>
            <meta name="twitter:card" content="summary_large_image"/>

            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            />
        </Head>
        <HideOnScroll>
            <AppBar>
                <Container>
                    <Toolbar disableGutters>
                        <Image src="/images/logo-simple.png" height={30} width={30}/>
                        <Link href="/" passHref>
                            <Typography variant="h6" noWrap component="a"
                                        sx={{mr: 2, display: {xs: 'flex'}, color: 'inherit', marginLeft: '.5rem'}}>
                                Timesheet Maker
                            </Typography>
                        </Link>
                        <Box sx={{flexGrow: 1}}></Box>
                        <FormGroup>
                            <FormControlLabel
                                control={<MaterialUISwitch sx={{m: 1}} checked={themeIsDark}
                                                           onChange={onChangeThemeSwitch}/>}
                                label=" "
                            />
                        </FormGroup>
                        <Button color={"secondary"} onClick={openDialogFormVariables}>Variables</Button>
                    </Toolbar>
                </Container>
            </AppBar>
        </HideOnScroll>
        <Toolbar/>
        {children}
        <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)}>
            <Alert variant="filled" onClose={() => setSnackbarOpen(false)} severity={snackbar?.type}
                   sx={{width: '100%'}}>
                {snackbar?.description}
            </Alert>
        </Snackbar>
        <Box sx={{marginBottom: 2}} className={moduleCSS.footer}>Made with 💙 psycho-pico</Box>
        <DialogFormVariables dialogFormVariablesOpen={dialogFormVariablesOpen} onCloseDialogFormVariables={onCloseDialogFormVariables} />
    </>
}