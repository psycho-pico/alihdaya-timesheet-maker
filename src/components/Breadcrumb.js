import {Breadcrumbs, Link as MuiLink} from "@mui/material";
import Link from "next/link";
import Typography from "@mui/material/Typography";

export function Breadcrumb({breadcrumbList}) {
    return <Breadcrumbs aria-label="breadcrumb" sx={{marginTop: 1, marginBottom: 2}}>
        {breadcrumbList?.length > 0 && breadcrumbList.map((breadcrumb, key) =>
            breadcrumb?.url
                ? <Link key={key} href={breadcrumb?.url} passHref>
                    <MuiLink>
                        {breadcrumb.name}
                    </MuiLink>
                </Link>
                : <Typography key={key} color="text.primary">{breadcrumb.name}</Typography>
        )}
    </Breadcrumbs>;
}