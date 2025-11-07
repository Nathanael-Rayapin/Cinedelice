import { fireEvent, render, screen, waitFor, type ByRoleMatcher, type ByRoleOptions } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Signup from "./Signup";
import { BrowserRouter } from "react-router";
import * as services from '../../services/auth.service';

describe("Signup Form", () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <Signup />
            </BrowserRouter>
        );
    });

    it("should not submit if the Pseudo is empty", async () => {
        const usernameInput = screen.getByLabelText(/Pseudo/);
        const submitButton = screen.getByRole("button", { name: /Je m'inscris/ });

        fireEvent.change(usernameInput, { target: { value: "" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            const errors = screen.getAllByRole('alert');
            expect(errors.length).toBeGreaterThan(0);
        });
    });

    it("should not submit if the Pseudo is shorter than 3 characters", async () => {
        const usernameInput = screen.getByLabelText(/Pseudo/);
        const submitButton = screen.getByRole("button", { name: /Je m'inscris/ });

        fireEvent.change(usernameInput, { target: { value: "Jo" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            const errors = screen.getAllByRole('alert');
            expect(errors.length).toBeGreaterThan(0);
        });
    });

    it("should submit if the Pseudo is valid", async () => {
        const usernameInput = screen.getByLabelText(/Pseudo/);
        const submitButton = screen.getByRole("button", { name: /Je m'inscris/ });

        fireEvent.change(usernameInput, { target: { value: "John" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(isRoleAbsent('alert')).toBe(true);
        });
    });

    it("should not submit if the Email is empty", async () => {
        const usernameInput = screen.getByLabelText(/Pseudo/);
        const emailInput = screen.getByLabelText(/Email/);

        const submitButton = screen.getByRole("button", { name: /Je m'inscris/ });

        fireEvent.change(usernameInput, { target: { value: "John" } });
        fireEvent.change(emailInput, { target: { value: "" } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            const errors = screen.getAllByRole('alert');
            expect(errors.length).toBeGreaterThan(0);
        });
    });

    it("should not submit if the Email is invalid", async () => {
        const form = screen.getByRole("form");
        const usernameInput = screen.getByLabelText(/Pseudo/);
        const emailInput = screen.getByLabelText(/Email/);

        const submitButton = screen.getByRole("button", { name: /Je m'inscris/ });

        fireEvent.change(usernameInput, { target: { value: "John" } });
        fireEvent.change(emailInput, { target: { value: "john.com" } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            // DataId for Email may be null because of type "Email" managed
            // natively by the browser, so we need to check the form instead
            expect(form.dataset.valid).toBe("false");
        });
    });

    it("should submit if the Email is valid", async () => {
        const usernameInput = screen.getByLabelText(/Pseudo/);
        const emailInput = screen.getByLabelText(/Email/);

        const submitButton = screen.getByRole("button", { name: /Je m'inscris/ });

        fireEvent.change(usernameInput, { target: { value: "John" } });
        fireEvent.change(emailInput, { target: { value: "john.doe@gmail.com" } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(isRoleAbsent('alert')).toBe(true);
        });
    });

    it("should not submit if the password is empty", async () => {
        const usernameInput = screen.getByLabelText(/Pseudo/);
        const emailInput = screen.getByLabelText(/Email/);
        const passwordInput = screen.getByLabelText(/Mot de passe/);

        const submitButton = screen.getByRole("button", { name: /Je m'inscris/ });

        fireEvent.change(usernameInput, { target: { value: "John" } });
        fireEvent.change(emailInput, { target: { value: "john.doe@gmail.com" } });
        fireEvent.change(passwordInput, { target: { value: "" } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            const errors = screen.getAllByRole('alert');
            expect(errors.length).toBeGreaterThan(0);
        });
    });

    it("should not submit if the password is invalid", async () => {
        const usernameInput = screen.getByLabelText(/Pseudo/);
        const emailInput = screen.getByLabelText(/Email/);
        const passwordInput = screen.getByLabelText(/Mot de passe/);

        const submitButton = screen.getByRole("button", { name: /Je m'inscris/ });

        const invalidPasswords = ["azerty", "AZERTY1", "Azerty1", "Azerty@", "123456"];

        fireEvent.change(usernameInput, { target: { value: "John" } });
        fireEvent.change(emailInput, { target: { value: "john.doe@gmail.com" } });

        for (const password of invalidPasswords) {
            fireEvent.change(passwordInput, { target: { value: password } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                const errors = screen.getAllByRole('alert');
                expect(errors.length).toBeGreaterThan(0);
            });
        }
    });

    it("should submit if the password is valid", async () => {
        const usernameInput = screen.getByLabelText(/Pseudo/);
        const emailInput = screen.getByLabelText(/Email/);
        const passwordInput = screen.getByLabelText(/Mot de passe/);

        const submitButton = screen.getByRole("button", { name: /Je m'inscris/ });

        fireEvent.change(usernameInput, { target: { value: "John" } });
        fireEvent.change(emailInput, { target: { value: "john.doe@gmail.com" } });
        fireEvent.change(passwordInput, { target: { value: "Azerty123!!!" } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(isRoleAbsent('alert')).toBe(true);
        });
    });

    it("should not submit if the confirm password is empty", async () => {
        const usernameInput = screen.getByLabelText(/Pseudo/);
        const emailInput = screen.getByLabelText(/Email/);
        const passwordInput = screen.getByLabelText(/Mot de passe/);
        const confirmPasswordInput = screen.getByLabelText(/Confirmation du mot de passe/);

        const submitButton = screen.getByRole("button", { name: /Je m'inscris/ });

        fireEvent.change(usernameInput, { target: { value: "John" } });
        fireEvent.change(emailInput, { target: { value: "john.doe@gmail.com" } });
        fireEvent.change(passwordInput, { target: { value: "Azerty123!!!" } });
        fireEvent.change(confirmPasswordInput, { target: { value: "" } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            const errors = screen.getAllByRole('alert');
            expect(errors.length).toBeGreaterThan(0);
        });
    });

    it("should not submit if the confirm password is invalid", async () => {
        const usernameInput = screen.getByLabelText(/Pseudo/);
        const emailInput = screen.getByLabelText(/Email/);
        const passwordInput = screen.getByLabelText(/Mot de passe/);
        const confirmPasswordInput = screen.getByLabelText(/Confirmation du mot de passe/);

        const submitButton = screen.getByRole("button", { name: /Je m'inscris/ });

        const invalidPasswords = ["azerty", "AZERTY1", "Azerty1", "Azerty@", "123456"];

        fireEvent.change(usernameInput, { target: { value: "John" } });
        fireEvent.change(emailInput, { target: { value: "john.doe@gmail.com" } });
        fireEvent.change(passwordInput, { target: { value: "Azerty123!!!" } });

        for (const password of invalidPasswords) {
            fireEvent.change(confirmPasswordInput, { target: { value: password } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                const errors = screen.getAllByRole('alert');
                expect(errors.length).toBeGreaterThan(0);
            });
        }
    });

    it("should not submit if the passwords do not match", async () => {
        const usernameInput = screen.getByLabelText(/Pseudo/);
        const emailInput = screen.getByLabelText(/Email/);
        const passwordInput = screen.getByLabelText(/Mot de passe/);
        const confirmPasswordInput = screen.getByLabelText(/Confirmation du mot de passe/);

        const submitButton = screen.getByRole("button", { name: /Je m'inscris/ });

        fireEvent.change(usernameInput, { target: { value: "John" } });
        fireEvent.change(emailInput, { target: { value: "john.doe@gmail.com" } });
        fireEvent.change(passwordInput, { target: { value: "Azerty123!" } });
        fireEvent.change(confirmPasswordInput, { target: { value: "Azerty123?" } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            const errors = screen.getAllByRole('alert');
            expect(errors.length).toBeGreaterThan(0);
        });
    });

    it("should submit if the confirm password is valid", async () => {
        const usernameInput = screen.getByLabelText(/Pseudo/);
        const emailInput = screen.getByLabelText(/Email/);
        const passwordInput = screen.getByLabelText(/Mot de passe/);
        const confirmPasswordInput = screen.getByLabelText(/Confirmation du mot de passe/);

        const submitButton = screen.getByRole("button", { name: /Je m'inscris/ });

        fireEvent.change(usernameInput, { target: { value: "John" } });
        fireEvent.change(emailInput, { target: { value: "john.doe@gmail.com" } });
        fireEvent.change(passwordInput, { target: { value: "Azerty123!!!" } });
        fireEvent.change(confirmPasswordInput, { target: { value: "Azerty123!!!" } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(isRoleAbsent('alert')).toBe(true);
        });
    });

    it("should not submit if AgeDeclaration is unchecked", async () => {
        const usernameInput = screen.getByLabelText(/Pseudo/);
        const emailInput = screen.getByLabelText(/Email/);
        const passwordInput = screen.getByLabelText(/Mot de passe/);
        const confirmPasswordInput = screen.getByLabelText(/Confirmation du mot de passe/);
        const ageCheckbox = screen.getByLabelText(/Je certifie avoir 15 ans ou plus/);

        const submitButton = screen.getByRole("button", { name: /Je m'inscris/ });

        fireEvent.change(usernameInput, { target: { value: "John" } });
        fireEvent.change(emailInput, { target: { value: "john.doe@gmail.com" } });
        fireEvent.change(passwordInput, { target: { value: "Azerty123!!!" } });
        fireEvent.change(confirmPasswordInput, { target: { value: "Azerty123!!!" } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(ageCheckbox).toHaveClass("checkbox-error");
        });
    });

    it("should submit if AgeDeclaration is checked", async () => {
        const usernameInput = screen.getByLabelText(/Pseudo/);
        const emailInput = screen.getByLabelText(/Email/);
        const passwordInput = screen.getByLabelText(/Mot de passe/);
        const confirmPasswordInput = screen.getByLabelText(/Confirmation du mot de passe/);
        const ageCheckbox = screen.getByLabelText(/Je certifie avoir 15 ans ou plus/);

        const submitButton = screen.getByRole("button", { name: /Je m'inscris/ });

        fireEvent.change(usernameInput, { target: { value: "John" } });
        fireEvent.change(emailInput, { target: { value: "john.doe@gmail.com" } });
        fireEvent.change(passwordInput, { target: { value: "Azerty123!!!" } });
        fireEvent.change(confirmPasswordInput, { target: { value: "Azerty123!!!" } });

        fireEvent.click(ageCheckbox);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(ageCheckbox).not.toHaveClass("checkbox-error");
        });
    });

    it("should not submit if TermOfUse is unchecked", async () => {
        const usernameInput = screen.getByLabelText(/Pseudo/);
        const emailInput = screen.getByLabelText(/Email/);
        const passwordInput = screen.getByLabelText(/Mot de passe/);
        const confirmPasswordInput = screen.getByLabelText(/Confirmation du mot de passe/);
        const termCheckbox = screen.getByLabelText(/J’accepte les CGU/);

        const submitButton = screen.getByRole("button", { name: /Je m'inscris/ });

        fireEvent.change(usernameInput, { target: { value: "John" } });
        fireEvent.change(emailInput, { target: { value: "john.doe@gmail.com" } });
        fireEvent.change(passwordInput, { target: { value: "Azerty123!!!" } });
        fireEvent.change(confirmPasswordInput, { target: { value: "Azerty123!!!" } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(termCheckbox).toHaveClass("checkbox-error");
        });
    });

    it("should submit if TermOfUse is checked", async () => {
        const termCheckbox = screen.getByLabelText(/J’accepte les CGU/);

        const submitButton = screen.getByRole("button", { name: /Je m'inscris/ });

        fireEvent.click(termCheckbox);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(termCheckbox).not.toHaveClass("checkbox-error");
        });
    });

    it("should call signup if all fields are valid", async () => {
        const usernameInput = screen.getByLabelText(/Pseudo/);
        const emailInput = screen.getByLabelText(/Email/);
        const passwordInput = screen.getByLabelText(/Mot de passe/);
        const confirmPasswordInput = screen.getByLabelText(/Confirmation du mot de passe/);
        const ageCheckbox = screen.getByLabelText(/Je certifie avoir 15 ans ou plus/);
        const termCheckbox = screen.getByLabelText(/J’accepte les CGU/);
        
        const submitButton = screen.getByRole("button", { name: /Je m'inscris/ });

        // Ici on espionne la fonction de signup pour savoir si elle a été appelée
        const signupSpy = vi.spyOn(services, "signup");

        fireEvent.change(usernameInput, { target: { value: "John" } });
        fireEvent.change(emailInput, { target: { value: "john.doe@gmail.com" } });
        fireEvent.change(passwordInput, { target: { value: "Azerty123!!!" } });
        fireEvent.change(confirmPasswordInput, { target: { value: "Azerty123!!!" } });

        fireEvent.click(ageCheckbox);
        fireEvent.click(termCheckbox);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(signupSpy).toHaveBeenCalled();
        });
    });
});

/**
 * Vérifie si un élément avec un rôle donné n'existe pas dans le DOM.
 * 
 * - La fonction `queryByRole` est trop permissive : elle renvoie `null` si elle ne trouve rien,
 *   mais ne signale jamais d'erreur. À cause de ça, un test peut passer même si le message
 *   d'erreur est affiché ou non.
 * 
 * - On n'utilise pas `getAllByRole` car cette fonction lèverait une erreur si aucun élément n'est trouvé.
 *   Dans un formulaire, si l'erreur n'est pas déclenchée, il n'y a pas d'alert et le test se casserait.
 * 
 * - Cette fonction renvoie simplement `true` si l’élément n’existe pas et `false` s’il existe,
 *   ce qui permet de tester de façon fiable la présence ou l’absence d’un message.
 */
export function isRoleAbsent(role: ByRoleMatcher, options?: ByRoleOptions): boolean {
    const element = screen.queryByRole(role, options);
    return element === null;
}

