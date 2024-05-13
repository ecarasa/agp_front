import { WidthFull } from '@mui/icons-material';
import { Box, FormControl, TextField } from '@mui/material';
import React from 'react';

function TextFileElement(props: any) {
    const {
        name,
        setName,
        label,
        required = false,
        variant = 'outlined',
        disabled = false,
        fullWidth = false,
        width,
        type = 'text',
        color = '',
        readOnly = false,
        helperText = '',
        placeholder = '',
        error = false,
        multiline = false,
        rows = 0,
        maxRows = 0,
        size = '',
        margin = 'none',
        minWidth = '25%',
        onChange,
        id
    } = props;

    return (
        <TextField
            fullWidth={fullWidth}
            error={error}
            required={required}
            disabled={disabled}
            multiline={multiline}
            type={type}
            color={color}
            id={id}
            label={label}
            value={name}
            variant={variant}
            InputProps={{
                readOnly: readOnly
            }}
            placeholder={placeholder}
            helperText={helperText}
            rows={rows}
            maxRows={maxRows}
            size={size}
            margin={margin}
            style={{
                width: width,
                minWidth: minWidth
            }}
            onChange={onChange}
        />
    );
}

export default TextFileElement;
