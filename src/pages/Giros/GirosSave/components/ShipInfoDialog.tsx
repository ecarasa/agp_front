import _ from 'lodash';
import { SHIP_STATES } from '../../../../commons/States';
import { useTheme } from '@mui/material/styles';
import CancelIconAgp from '../../../../assets/icons/cancelIconAgp.png';
import CheckIconAgp from '../../../../assets/icons/checkIconAgp.png';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ShipsInformation from '../../../Buques/components/ShipsInformation';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function ShipInfoDialog({ setOpen, open }: any) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClose = () => {
        setOpen(null);
    };

    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={!_.isEmpty(open)}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                sx={{
                    '& .MuiDialogContent-root': {
                        padding: 0,
                        maxHeight: '660px',
                        overflow: 'auto'
                    },
                    '& .right-card-information': {
                        maxHeight: '100%'
                    }
                }}
            >
                <DialogContent>
                    <ShipsInformation
                        shipFullData={open}
                        showOnly
                        onClose={() => setOpen(null)}
                        extraData={
                            <>
                                {open?.activo &&
                                (open?.estado === 'AP' || open?.estado === 'SB') ? (
                                    <>
                                        <img
                                            style={{ margin: '0 4px' }}
                                            src={CheckIconAgp}
                                            alt="check"
                                            height={15}
                                        />
                                        {SHIP_STATES[open?.estado]}
                                    </>
                                ) : (
                                    <>
                                        <img
                                            style={{ margin: '0 4px' }}
                                            src={CancelIconAgp}
                                            alt="cancel"
                                            height={18}
                                        />
                                        {SHIP_STATES[open?.estado]}
                                    </>
                                )}
                            </>
                        }
                        loadingShip={() => {
                            return;
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
