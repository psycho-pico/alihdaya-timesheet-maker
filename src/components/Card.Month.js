import {useRouter} from 'next/router';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import {CardActionArea, IconButton} from '@mui/material';

export default function CardMonth({year, month, isThisMonth, handleClickDelete}) {
    const router = useRouter();

    const handleClickDetail = () => {
        router.push(`/timesheet/${year}/${month.id}`);
    }

    return (
        <Card className={isThisMonth ? 'selected' : ''}>
            <CardActionArea onClick={handleClickDetail}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        {month.name}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <IconButton aria-label="delete" data-year={year} data-month={month.id} onClick={handleClickDelete}>
                    <DeleteIcon/>
                </IconButton>
            </CardActions>
        </Card>
    );
}