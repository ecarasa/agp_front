import { Grid } from '@mui/material';

interface Props {
    children?: any;
    openCard?: boolean;
}

export const Table = ({ children, openCard }: Props) => {
    if (!children) return null;
    return (
        <Grid container direction="row" justifyContent="center" alignItems="flex-start" spacing={3}>
            <Grid item xs={openCard ? 6 : 12} lg={openCard ? 8 : 12}>
                {children}
            </Grid>
        </Grid>
    );
};
