import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';

function SearchInput(props: any) {
    const {
        label = '',
        background,
        handleSearch,
        search,
        setSearch,
        name = '',
        size = 'small',
        fullWidth = false,
        width = '',
        placeHolder = '',
        type
    } = props;
    return (
        <>
            <FormControl
                sx={{ width: { width }, fullWidth: { fullWidth } }}
                variant="outlined"
                size={size}
            >
                <InputLabel>{label}</InputLabel>
                <OutlinedInput
                    type={type || 'text'}
                    placeholder={placeHolder}
                    sx={{
                        background: background,
                        borderRadius: '8px'
                    }}
                    value={search}
                    onChange={(e: any) => {
                        handleSearch(e);
                        if (setSearch) setSearch(e.target.value);
                    }}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={(e) => handleSearch(name, search)}
                                edge="end"
                            >
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    }
                    label={label}
                    name={name}
                />
            </FormControl>
        </>
    );
}

export default SearchInput;
