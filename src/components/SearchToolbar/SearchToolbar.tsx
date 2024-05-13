import { Box, Button, Grid, Link, Toolbar, Typography } from '@mui/material';
import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SearchInput from '../layout/SearchInput';

interface SearchProps {
    onChange: any;
    children: ReactElement;
    inputSearchName: string;
    placeHolder?: string;
    onClick?: any;
    clearFilters?: any;
    hiddeButtons?: boolean;
    label?: string | null;
    type?: string;
    width?: string;
    hideFilterButton?: boolean;
    disabled?: boolean;
}

const SearchToolbar = ({
    onChange,
    children,
    clearFilters,
    inputSearchName,
    placeHolder,
    onClick,
    hiddeButtons,
    label = null,
    type,
    width,
    hideFilterButton = false,
    disabled = false
}: SearchProps) => {
    const { t } = useTranslation('userForm');
    const [openFilters, setOpenFilters] = useState<boolean>(false);

    return (
        <>
            <Toolbar
                sx={{
                    background: '#FFFFFF',
                    boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.25)',
                    borderRadius: '16px'
                }}
            >
                <SearchInput
                    background={'#FFFFFF'}
                    handleSearch={onChange}
                    name={inputSearchName}
                    placeHolder={placeHolder}
                    label={label}
                    type={type}
                    width={width}
                />
                {!hideFilterButton && (
                    <Link
                        underline="none"
                        onClick={() => {
                            setOpenFilters(!openFilters);
                        }}
                        sx={{ marginLeft: '2rem', cursor: 'pointer' }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography id="toolbar_button_dropdown">
                                {t('filtrosToolbar.filter')}
                            </Typography>
                            {!openFilters ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />}
                        </Box>
                    </Link>
                )}
            </Toolbar>
            {openFilters && (
                <Grid className="filters-container-toolbar" container spacing={2} mt={0.5}>
                    {children}
                    {!hiddeButtons && (
                        <Grid
                            item
                            xs={12}
                            sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center' } }}
                        >
                            <Button
                                name="toolbar_search_button"
                                variant="contained"
                                disabled={disabled}
                                onClick={() => onClick()}
                            >
                                Buscar
                            </Button>
                            <Button
                                name="toolbar_clear_button"
                                variant="outlined"
                                onClick={() => clearFilters()}
                            >
                                Limpiar
                            </Button>
                        </Grid>
                    )}
                </Grid>
            )}
        </>
    );
};

export default SearchToolbar;
