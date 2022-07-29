import Container from '@mui/material/Container';
import Layout, {siteTitle} from '../components/Layout';
import CardMonthList from '../components/Card.Month.List';
import DialogFormYear from '../components/Dialog.Form.Year';
import DialogFormYearMonth from '../components/Dialog.Form.YearMonth';
import {Breadcrumb} from "../components/Breadcrumb";

export default function Timesheet() {
    const pageTitle = `${siteTitle} - Timesheets`;
    const breadcrumbList = [
        {name: 'Home', url: '/'},
        {name: 'Timesheet'}
    ]

    return (
        <Layout pageTitle={pageTitle}>
            <Container>
                <Breadcrumb breadcrumbList={breadcrumbList}/>
                <DialogFormYear/>
                <CardMonthList/>
                <DialogFormYearMonth/>
            </Container>
        </Layout>
    );
}