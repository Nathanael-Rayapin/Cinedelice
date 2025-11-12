import { useForm, type FieldErrors, type SubmitHandler } from 'react-hook-form';
import { LiaEyeSlashSolid } from "react-icons/lia";
import { LiaEyeSolid } from "react-icons/lia";
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import type { ISignup } from '../../interfaces/auth';
import { signup } from '../../services/auth.service';
import PacmanLoader from 'react-spinners/PacmanLoader';
import './Signup.scss';

const pseudoPattern = /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/i;
const emailPattern = /^.+@.+$/i;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/;

const Signup = () => {
    const { register, handleSubmit, getValues, trigger, formState: { errors, isValid } } = useForm<ISignup>();
    const [loading, setLoading] = useState(false);
    const submitCountRef = useRef(0);
    const navigate = useNavigate();

    // Un simple log en attendant d'avoir l'endpoint d'inscription
    const onSubmit: SubmitHandler<ISignup> = async data => {
        const userData: ISignup = {
            username: data.username,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword,
            ageDeclaration: data.ageDeclaration,
            termOfUse: data.termOfUse
        }

        try {
            setLoading(true);
            await signup(userData);
        } catch (error) {
            console.error('Erreur lors de la création du compte', error);
        } finally {
            setLoading(false);
            navigate("/connexion");
        }
    };

    const onInvalid = (errors: FieldErrors<ISignup>) => {
        submitCountRef.current += 1;
        console.error(errors);
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Loading State
    if (loading) {
        return (
            <div className="loading-container">
                <PacmanLoader color="#fB8b24" />
            </div>
        );
    }

    return (
        <div className="signup">
            <h1>Inscription</h1>

            <form
                role='form'
                onSubmit={handleSubmit(onSubmit, onInvalid)}
                data-valid={isValid}
                autoComplete='off'
                aria-autocomplete='none'
            >
                <div className="username">
                    <label htmlFor="username">Pseudo</label>
                    <input
                        id='username'
                        autoFocus={true}
                        type="text"
                        maxLength={50}
                        className={`${errors.username ? "input input-error" : "input-default"}`}
                        {...register("username", {
                            required: { value: true, message: "Le pseudo est obligatoire" },
                            minLength: { value: 3, message: "Le pseudo doit contenir au moins 3 caractères" },
                            pattern: { value: pseudoPattern, message: "Le pseudo doit contenir uniquement des lettres, des chiffres et des tirets" },
                        })}
                    />

                    {errors.username && <p className="error" role="alert">{errors.username.message as string}</p>}
                </div>

                <div className="email">
                    <label htmlFor="email">Email</label>
                    <input
                        id='email'
                        type="email"
                        className={`${errors.email ? "input input-error" : "input-default"}`}
                        {...register("email", {
                            required: { value: true, message: "L'email est obligatoire" },
                            pattern: { value: emailPattern, message: "L'email doit être valide" },
                        })}
                    />

                    {errors.email && <p className="error" role="alert">{errors.email.message as string}</p>}
                </div>

                <div className="password">
                    <label htmlFor="password">Mot de passe</label>
                    <div className="password-field">
                        <input
                            id='password'
                            type={showPassword ? "text" : "password"}
                            className={`${errors.password ? "input input-error" : "input-default"}`}
                            {...register("password", {
                                required: { value: true, message: "Le mot de passe est obligatoire" },
                                minLength: { value: 8, message: "Le mot de passe doit contenir au moins 8 caractères" },
                                pattern: { value: passwordPattern, message: "Le mot de passe doit contenir au moins un chiffre, une lettre et un caractère spécial" },
                                onChange: () => {
                                    if (submitCountRef.current > 0) {
                                        void trigger("confirmPassword");
                                    }
                                }
                            })}
                        />
                        {showPassword
                            ? <LiaEyeSolid className='eye-icon' onClick={() => setShowPassword(false)} />
                            : <LiaEyeSlashSolid className='eye-icon' onClick={() => setShowPassword(true)} />
                        }
                    </div>

                    {errors.password && <p className="error" role="alert">{errors.password.message as string}</p>}
                </div>

                <div className="confirm-password">
                    <label htmlFor="confirmPassword">Confirmation du mot de passe</label>
                    <div className="password-field">
                        <input
                            id='confirmPassword'
                            type={showConfirmPassword ? "text" : "password"}
                            className={`${errors.confirmPassword ? "input input-error" : "input-default"}`}
                            {...register("confirmPassword", {
                                required: { value: true, message: "La confirmation du mot de passe est obligatoire" },
                                minLength: { value: 8, message: "La confirmation du mot de passe doit contenir au moins 8 caractères" },
                                validate: (value) => value === getValues("password") || "Les mots de passe ne correspondent pas"
                            })}
                        />
                        {showConfirmPassword
                            ? <LiaEyeSolid className='eye-icon' onClick={() => setShowConfirmPassword(false)} />
                            : <LiaEyeSlashSolid className='eye-icon' onClick={() => setShowConfirmPassword(true)} />
                        }
                    </div>

                    {errors.confirmPassword && <p className="error" role="alert">{errors.confirmPassword.message as string}</p>}

                </div>
                <div className="age-declaration">
                    <input
                        id='ageDeclaration'
                        type="checkbox"
                        className={`${errors.ageDeclaration && errors.ageDeclaration.message ? "checkbox checkbox-error" : "checkbox checkbox-sm checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"}`}
                        {...register("ageDeclaration", {
                            required: { value: true, message: "Vous devez certifier avoir 15 ans ou plus" },
                        })}
                    />
                    <label htmlFor="ageDeclaration">Je certifie avoir 15 ans ou plus</label>
                </div>

                <div className="term-of-use">
                    <input
                        id="termOfUse"
                        type="checkbox"
                        className={`${errors.termOfUse && errors.termOfUse.message ? "checkbox checkbox-error" : "checkbox checkbox-sm checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"}`}
                        {...register("termOfUse", {
                            required: { value: true, message: "Vous devez accepter les CGU" },
                        })}
                    />
                    <label htmlFor="termOfUse">J’accepte les <a href='/cgu'>CGU</a></label>
                </div>

                <button type='submit' className="submit-btn btn m-1">
                    Je m'inscris
                </button>

                <div className="have-an-account">
                    <p>Déjà un compte ?</p>
                    <Link to="/connexion">Se connecter</Link>
                </div>
            </form>
        </div>
    )
}

export default Signup