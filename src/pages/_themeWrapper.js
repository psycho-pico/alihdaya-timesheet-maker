import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {createTheme} from "@mui/material/styles";
import {pink, red, teal} from "@mui/material/colors";
import {CssBaseline, ThemeProvider} from "@mui/material";

const ThemeWrapper = (props) => {
    const themes_redux = useSelector((state) => state.selected.value.themes);
    const selectedTheme_redux = useSelector((state) => state.selected.value.theme);
    const [theme, setTheme] = useState(themes_redux[1]);
    // TODO: Create theme file for each teme
    const defaultTheme = {
        primary: {
            main: teal[600],
        },
        primaryDarken: {
            main: teal[900],
        },
        secondary: {
            main: '#e39a23',
        },
        tertiary: {
            main: '#e32340',
        },
        error: {
            main: red[800]
        }
    }
    const [themePalette, setThemePalette] = useState(createTheme({palette: {mode: 'dark', ...defaultTheme}}));

    useEffect(() => {
        setTheme(selectedTheme_redux);
    }, [selectedTheme_redux]);

    useEffect(() => {
        const themePalette_ = createTheme({palette: {mode: theme, ...defaultTheme}});
        setThemePalette(themePalette_);
    }, [theme]);

    return <>
        <ThemeProvider theme={themePalette}>
            <CssBaseline/>
            {props.children}
        </ThemeProvider>
    </>
}

export default ThemeWrapper;