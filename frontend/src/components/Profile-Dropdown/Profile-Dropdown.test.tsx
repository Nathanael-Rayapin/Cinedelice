import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileDropdown from './Profile-Dropdown';
import { AuthContext } from '../../store/interface';
import { BrowserRouter } from 'react-router';

describe('ProfileDropdown', () => {

  it('should render links for unauthenticated users', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            isAuth: false,
            setIsAuth: vi.fn(),
            logout: vi.fn(),
            login: vi.fn(),
          }}
        >
          <ProfileDropdown />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText('Connexion')).toBeTruthy();
    expect(screen.getByText('Inscription')).toBeTruthy();
  });

  it('should render links for authenticated users and handle logout', () => {
    const logoutMock = vi.fn();
    const setIsAuthMock = vi.fn();

    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            isAuth: true,
            setIsAuth: setIsAuthMock,
            logout: logoutMock,
            login: vi.fn(),
          }}
        >
          <ProfileDropdown />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText('Mon profil')).toBeTruthy();
    expect(screen.getByText('Déconnexion')).toBeTruthy();

    fireEvent.click(screen.getByText('Déconnexion'));
    expect(logoutMock).toHaveBeenCalled();
  });
});
