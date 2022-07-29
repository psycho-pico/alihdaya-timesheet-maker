import Image from 'next/image';
import Link from 'next/link';
import {Button, Container} from '@mui/material';
import Layout, {siteTitle} from '../components/Layout';
import Box from "@mui/material/Box";

const pageTitle = siteTitle;

export default function Home() {
    return (
        <Layout pageTitle={pageTitle}>
            <Container>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="400px"
                >
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div>
                            <Image
                                priority
                                src="/images/logo.jpg"
                                height={300}
                                width={300}
                                alt={`Logo ${siteTitle}`}
                            />
                        </div>
                        <Link href="/timesheet">
                            <Button variant="contained">Timesheet</Button>
                        </Link>
                    </div>
                </Box>
            </Container>
        </Layout>
    );
}