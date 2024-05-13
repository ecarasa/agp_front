import AlertDialog from './AlertDialog';
import { screen, render } from '@testing-library/react';

const renderComponent = (props) => render(<AlertDialog {...props} />);

const expectText = (children) => expect(screen.getByText(children)).toBeInTheDocument();

const params = {
    title: 'Título, Consulta o Afirmación',
    text: 'Descripción importante relevante a la acción descripta, breve y precisa, con detalle hasta la tercera línea. ',
    customButtons: (
        <div data-testid="customButtons">
            <button>A</button> <button>B</button>
        </div>
    )
};

describe('<Alert/>', () => {
    it('Render title', () => {
        renderComponent({ ...params });
        expect(screen.getByText(params.title)).toBeInTheDocument();
    });

    it('Render CustomButtons', () => {
        renderComponent({ customButtons: params.customButtons });
        expectText(/A/i);
        expectText(/B/i);
    });

    it('Render button text', () => {
        renderComponent({ buttonText: 'Confirmar' });
        expectText(/Confirmar/i);
    });
});
