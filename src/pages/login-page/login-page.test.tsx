import { render, screen } from '@testing-library/react';
import { withHistory, withStore } from '../../utils/mock-component';
import userEvent from '@testing-library/user-event';
import LoginPage from './login-page';
import { AuthorizationStatus, NameSpace } from '../../const';

vi.mock('../../services/api', () => ({
  createAPI: vi.fn(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }))
}));

describe('Login page', () => {

  const initialState = {
    [NameSpace.User]: {
      authorizationStatus: AuthorizationStatus.NoAuth,
      userData: null,
      favoriteOffers: []
    }
  };

  it('should render correctly', () => {
    const { withStoreComponent } = withStore(<LoginPage />, initialState);
    const preparedComponent = withHistory(withStoreComponent);

    render(preparedComponent);

    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('should render correctly when user enter login and password', async () => {
    const expectedLoginValue = 'test@gmail.com';
    const expectedPasswordValue = 'password123';

    const { withStoreComponent } = withStore(<LoginPage />, initialState);
    const preparedComponent = withHistory(withStoreComponent);

    render(preparedComponent);

    await userEvent.type(screen.getByTestId('emailElement'), expectedLoginValue);
    await userEvent.type(screen.getByTestId('passwordElement'), expectedPasswordValue);

    expect(screen.getByDisplayValue(expectedLoginValue)).toBeInTheDocument();
    expect(screen.getByDisplayValue(expectedPasswordValue)).toBeInTheDocument();
  });

  it('should show error when password has no letters', async () => {
    const { withStoreComponent } = withStore(<LoginPage />, initialState);
    const preparedComponent = withHistory(withStoreComponent);

    render(preparedComponent);

    await userEvent.type(screen.getByTestId('emailElement'), 'test@example.com');
    await userEvent.type(screen.getByTestId('passwordElement'), '12345678');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(screen.getByTestId('password-error')).toBeInTheDocument();
    expect(screen.getByText('Пароль должен содержать минимум одну букву и одну цифру')).toBeInTheDocument();
  });

  it('should show error when password has no digits', async () => {
    const { withStoreComponent } = withStore(<LoginPage />, initialState);
    const preparedComponent = withHistory(withStoreComponent);

    render(preparedComponent);

    await userEvent.type(screen.getByTestId('emailElement'), 'test@example.com');
    await userEvent.type(screen.getByTestId('passwordElement'), 'abcdefgh');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(screen.getByTestId('password-error')).toBeInTheDocument();
    expect(screen.getByText('Пароль должен содержать минимум одну букву и одну цифру')).toBeInTheDocument();
  });

  it('should not show error with valid password', async () => {
    const { withStoreComponent } = withStore(<LoginPage />, initialState);
    const preparedComponent = withHistory(withStoreComponent);

    render(preparedComponent);

    await userEvent.type(screen.getByTestId('emailElement'), 'test@example.com');
    await userEvent.type(screen.getByTestId('passwordElement'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(screen.queryByTestId('password-error')).not.toBeInTheDocument();
  });

  it('should clear password error when user starts typing after validation error', async () => {
    const { withStoreComponent } = withStore(<LoginPage />, initialState);
    const preparedComponent = withHistory(withStoreComponent);

    render(preparedComponent);

    const passwordInput = screen.getByTestId('passwordElement');

    await userEvent.type(screen.getByTestId('emailElement'), 'test@example.com');
    await userEvent.type(passwordInput, '12345678');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(screen.getByTestId('password-error')).toBeInTheDocument();

    await userEvent.type(passwordInput, 'a');
    expect(screen.queryByTestId('password-error')).not.toBeInTheDocument();
  });

  it('should validate password with cyrillic letters', async () => {
    const { withStoreComponent } = withStore(<LoginPage />, initialState);
    const preparedComponent = withHistory(withStoreComponent);

    render(preparedComponent);

    await userEvent.type(screen.getByTestId('emailElement'), 'test@example.com');
    await userEvent.type(screen.getByTestId('passwordElement'), 'пароль123');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(screen.queryByTestId('password-error')).not.toBeInTheDocument();
  });

  it('should have correct HTML attributes', () => {
    const { withStoreComponent } = withStore(<LoginPage />, initialState);
    const preparedComponent = withHistory(withStoreComponent);

    render(preparedComponent);

    const emailInput = screen.getByTestId('emailElement');
    const passwordInput = screen.getByTestId('passwordElement');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toBeRequired();
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toBeRequired();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('should have correct title', () => {
    const { withStoreComponent } = withStore(<LoginPage />, initialState);
    const preparedComponent = withHistory(withStoreComponent);

    render(preparedComponent);
    expect(document.title).toBe('Login');
  });
});
