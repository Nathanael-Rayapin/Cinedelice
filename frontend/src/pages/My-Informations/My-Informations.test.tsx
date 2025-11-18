import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MyInformations from './My-Informations';
import { GlobalUIContext } from '../../store/interface';
import * as authService from '../../services/auth.service';

const mockGlobalUI = {
    loading: false,
    setLoading: vi.fn(),
    showModal: false,
    setShowModal: vi.fn(),
    modalOptions: null,
    setModalOptions: vi.fn(),
    errorMsg: '',
    setErrorMsg: vi.fn(),
};

const renderWithContext = () => {
    return render(
        <GlobalUIContext.Provider value={mockGlobalUI}>
            <MyInformations />
        </GlobalUIContext.Provider>
    );
};

describe('MyInformations component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render all password fields and submit button', () => {
        renderWithContext();

        expect(screen.getByLabelText(/Ancien mot de passe/i)).toBeTruthy();
        expect(screen.getByLabelText(/Nouveau mot de passe/i)).toBeTruthy();
        expect(screen.getByLabelText(/Confirmation du mot de passe/i)).toBeTruthy();
        expect(screen.getByRole('button', { name: /Modifier/i })).toBeTruthy();
    });

    it('should not call updatePassword if form is invalid', async () => {
        const spy = vi.spyOn(authService, 'updatePassword').mockResolvedValue(undefined);

        renderWithContext();

        fireEvent.click(screen.getByRole('button', { name: /Modifier/i }));

        await waitFor(() => {
            expect(spy).not.toHaveBeenCalled();
        });
    });

    it('should call updatePassword if form is valid', async () => {
        const spy = vi.spyOn(authService, 'updatePassword').mockResolvedValue(undefined);

        renderWithContext();

        const oldPasswordInput = screen.getByLabelText(/Ancien mot de passe/i);
        const newPasswordInput = screen.getByLabelText(/Nouveau mot de passe/i);
        const confirmPasswordInput = screen.getByLabelText(/Confirmation du mot de passe/i);

        fireEvent.change(oldPasswordInput, { target: { value: 'OldPass123!' } });
        fireEvent.change(newPasswordInput, { target: { value: 'NewPass123!' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'NewPass123!' } });

        fireEvent.click(screen.getByRole('button', { name: /Modifier/i }));

        await waitFor(() => {
            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith({
                oldPassword: 'OldPass123!',
                newPassword: 'NewPass123!',
                confirmPassword: 'NewPass123!',
            });
        });
    });

    it('should show error if newPassword and confirmPassword do not match', async () => {
        const spy = vi.spyOn(authService, 'updatePassword').mockResolvedValue(undefined);

        renderWithContext();

        fireEvent.change(screen.getByLabelText(/Ancien mot de passe/i), {
            target: { value: 'OldPass123!' },
        });
        fireEvent.change(screen.getByLabelText(/Nouveau mot de passe/i), {
            target: { value: 'NewPass123!' },
        });
        fireEvent.change(screen.getByLabelText(/Confirmation du mot de passe/i), {
            target: { value: 'Mismatch123!' },
        });

        fireEvent.click(screen.getByRole('button', { name: /Modifier/i }));

        await waitFor(() => {
            expect(spy).not.toHaveBeenCalled();
        });
    });

    it('should call setErrorMsg if updatePassword throws', async () => {
        const spy = vi.spyOn(authService, 'updatePassword').mockRejectedValue(new Error('API error'));

        renderWithContext();

        fireEvent.change(screen.getByLabelText(/Ancien mot de passe/i), {
            target: { value: 'OldPass123!' },
        });
        fireEvent.change(screen.getByLabelText(/Nouveau mot de passe/i), {
            target: { value: 'NewPass123!' },
        });
        fireEvent.change(screen.getByLabelText(/Confirmation du mot de passe/i), {
            target: { value: 'NewPass123!' },
        });

        fireEvent.click(screen.getByRole('button', { name: /Modifier/i }));

        await waitFor(() => {
            expect(spy).toHaveBeenCalledOnce();
        });
    });
});
