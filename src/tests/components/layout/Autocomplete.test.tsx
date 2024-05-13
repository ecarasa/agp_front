import React from 'react';
import { render, fireEvent, getAllByRole, screen } from '@testing-library/react';
import Autocompletar from '../../../components/layout/Autocomplete';

describe('Autocomplete', () => {
    test('renders with options', () => {
        const options = ['apple', 'banana', 'cherry'];
        const setValue = jest.fn();
        const { getByRole, getByText } = render(
            <Autocompletar value="" setValue={setValue} options={options} />
        );
        // Find the Autocomplete input field and simulate a change event
        const input = screen.getAllByRole('combobox')[0];

        fireEvent.change(input, { target: { value: 'a' } });

        // Find the option that was created as a result of the search
        const option = screen.getByText('apple');

        // Simulate a click event on the option
        fireEvent.click(option);

        // Expect that setValue was called with the selected option
        expect(setValue).toHaveBeenCalledWith('apple');
    });
});
