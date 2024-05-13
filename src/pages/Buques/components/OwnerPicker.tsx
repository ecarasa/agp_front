import { Box, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';

function OwnerPicker({ value, ownersData, handleChangeOwnersData }: any) {
    return (
        <Box
            sx={{
                padding: '0 12px',
                borderRadius: '16px',
                display: 'flex',
                justifyContent: 'flex-start'
            }}
        >
            <FormControl
                sx={{
                    alignItems: 'center',
                    gap: '10px',
                    flexDirection: 'row',
                    '& .MuiFormLabel-root.Mui-focused': {
                        color: '#00000099'
                    }
                }}
            >
                <RadioGroup row name="row-radio-buttons-group">
                    <FormControlLabel
                        sx={{ color: !ownersData?.[value] ? 'var(--primary)' : 'inherit' }}
                        control={
                            <Radio
                                value={value}
                                name="existente"
                                checked={!ownersData?.[value]}
                                onChange={handleChangeOwnersData}
                            />
                        }
                        label="Existente"
                    />
                    <FormControlLabel
                        sx={{ color: ownersData?.[value] ? 'var(--primary)' : 'inherit' }}
                        control={
                            <Radio
                                value={value}
                                name="nuevo"
                                checked={ownersData?.[value]}
                                onChange={handleChangeOwnersData}
                            />
                        }
                        label="Nuevo"
                    />
                </RadioGroup>
            </FormControl>
        </Box>
    );
}

export default OwnerPicker;
