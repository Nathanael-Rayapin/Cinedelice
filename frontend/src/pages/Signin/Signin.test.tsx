import { fireEvent, render, screen, waitFor, type ByRoleMatcher, type ByRoleOptions } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import Signin from "./Signin";
import { BrowserRouter } from "react-router";

describe("Signin Form", () => {

    beforeEach(() => {
        render(
            <BrowserRouter>
                <Signin />
            </BrowserRouter>
        );
    });

    it("should not submit if the email is empty", async () => {
        const emailInput = screen.getByLabelText(/Email/);

        const submitButton = screen.getByRole("button", { name: /Je me connecte/ });

        fireEvent.change(emailInput, { target: { value: "" } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            const errors = screen.getAllByRole('alert');
            expect(errors.length).toBeGreaterThan(0);
        });
    });

    it("should not submit if the email is invalid", async () => {
        const form = screen.getByRole("form");
        const emailInput = screen.getByLabelText(/Email/);

        const submitButton = screen.getByRole("button", { name: /Je me connecte/ });

        fireEvent.change(emailInput, { target: { value: "john.com" } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            // DataId for email may be null because of type "email" managed
            // natively by the browser, so we need to check the form instead
            expect(form.dataset.valid).toBe("false");
        });
    });

    it("should submit if the email is valid", async () => {
        const emailInput = screen.getByLabelText(/Email/);

        const submitButton = screen.getByRole("button", { name: /Je me connecte/ });

        fireEvent.change(emailInput, { target: { value: "john.doe@gmail.com" } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(isRoleAbsent('alert')).toBe(true);
        });
    });

    it("should not submit if the password is empty", async () => {
        const emailInput = screen.getByLabelText(/Email/);
        const passwordInput = screen.getByLabelText(/Mot de passe/);

        const submitButton = screen.getByRole("button", { name: /Je me connecte/ });

        fireEvent.change(emailInput, { target: { value: "john.doe@gmail.com" } });
        fireEvent.change(passwordInput, { target: { value: "" } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            const errors = screen.getAllByRole('alert');
            expect(errors.length).toBeGreaterThan(0);
        });
    });

    it("should submit if the password is valid", async () => {
        const emailInput = screen.getByLabelText(/Email/);
        const passwordInput = screen.getByLabelText(/Mot de passe/);

        const submitButton = screen.getByRole("button", { name: /Je me connecte/ });

        fireEvent.change(emailInput, { target: { value: "john.doe@gmail.com" } });
        fireEvent.change(passwordInput, { target: { value: "Azerty123!!!" } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(isRoleAbsent('alert')).toBe(true);
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

