import React, {useEffect} from 'react';
import {Provider} from 'react-redux'
import store from '../app/store'
import PropTypes from 'prop-types';
import {CacheProvider} from '@emotion/react';
import NProgress from 'nprogress';

import createEmotionCache from '../utility/createEmotionCache';
import {useRouter} from "next/router";
import '../styles/global.scss';
import ThemeWrapper from "./_themeWrapper";

const clientSideEmotionCache = createEmotionCache();
const AlihdayaTimesheetMakerApp = (props) => {
    const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;
    const router = useRouter();

    useEffect(() => {
        router.events.on('routeChangeStart', () => NProgress.start());
        router.events.on('routeChangeComplete', () => NProgress.done());
        router.events.on('routeChangeError', () => NProgress.done());
    }, []);

    return (<Provider store={store}>
        <CacheProvider value={emotionCache}>
            <ThemeWrapper>
                <Component {...pageProps} />
            </ThemeWrapper>
        </CacheProvider>
    </Provider>);
};

export default AlihdayaTimesheetMakerApp;

AlihdayaTimesheetMakerApp.propTypes = {
    Component: PropTypes.elementType.isRequired, emotionCache: PropTypes.object, pageProps: PropTypes.object.isRequired,
};