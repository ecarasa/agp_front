import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMuiTheme } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import { ThemeProvider } from '@mui/material';
import TableGeneral from '../../../../components/layout/Table/TableGeneral'





describe('Pruebas en TablaGeneral', () => { 
    const theme = createMuiTheme({
        palette: {
          primary: blue,
        },
      });

    const rows = [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Jane', age: 25 },
        { id: 3, name: 'Bob', age: 40 },
    ];

    const columns =[
        {
            id: 'id',
            label: 'idperson',
        },
        {
            id: 'name',
            label: 'Nombre',
        },
        {
            id: 'age',
            label: 'Edad',
        },
    ]
    const renderTable = () =>
      render(
        <ThemeProvider theme={theme}>
            <TableGeneral rows={rows} headCells={columns}/>
        </ThemeProvider>
          
        
    );

    it('debe mostrar el nombre de la columna "name"', () => {
        renderTable();
        expect(screen.getByText('Jane')).toBeInTheDocument();
    });
 })