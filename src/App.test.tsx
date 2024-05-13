import { getByText, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';

test('renders learn react link', () => {
    const { container } = render(
        <Provider store={store}>
            <App />
        </Provider>
    );

    expect(container).toMatchSnapshot();
    //expect(getByText(/learn/i)).toBeTruthy();
});
