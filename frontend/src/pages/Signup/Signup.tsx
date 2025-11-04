import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form';
import { LiaEyeSlashSolid } from "react-icons/lia";
import { LiaEyeSolid } from "react-icons/lia";

import { useState } from 'react';
import './Signup.scss';
import { Link } from 'react-router';

const pseudoPattern = /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/i;
const emailPattern = /^.+@.+$/i;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/;

const Signup = () => {
    const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm();

    // Un simple log en attendant d'avoir l'endpoint d'inscription
    const onSubmit: SubmitHandler<FieldValues> = data => console.log(data);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const passwordValue = watch("Password");

    return (
        <div className="signup">
            <h1>Inscription</h1>

            <form
                role='form'
                onSubmit={handleSubmit(onSubmit)}
                data-valid={isValid}>
                <div className="pseudo">
                    <label htmlFor="Pseudo">Pseudo</label>
                    <input
                        id='Pseudo'
                        autoFocus={true}
                        type="text"
                        maxLength={50}
                        className={`${errors.Pseudo ? "input input-error" : "input-default"}`}
                        {...register("Pseudo", {
                            required: { value: true, message: "Le pseudo est obligatoire" },
                            minLength: { value: 3, message: "Le pseudo doit contenir au moins 3 caractères" },
                            pattern: { value: pseudoPattern, message: "Le pseudo doit contenir uniquement des lettres, des chiffres et des tirets" },
                        })}
                    />

                    {errors.Pseudo && <p className="error" role="alert">{errors.Pseudo.message as string}</p>}
                </div>

                <div className="email">
                    <label htmlFor="Email">Email</label>
                    <input
                        id='Email'
                        type="email"
                        className={`${errors.Email ? "input input-error" : "input-default"}`}
                        {...register("Email", {
                            required: { value: true, message: "L'email est obligatoire" },
                            pattern: { value: emailPattern, message: "L'email doit être valide" },
                        })}
                    />

                    {errors.Email && <p className="error" role="alert">{errors.Email.message as string}</p>}
                </div>

                <div className="password">
                    <label htmlFor="Password">Mot de passe</label>
                    <div className="password-field">
                        <input
                            id='Password'
                            type={showPassword ? "text" : "password"}
                            className={`${errors.Password ? "input input-error" : "input-default"}`}
                            {...register("Password", {
                                required: { value: true, message: "Le mot de passe est obligatoire" },
                                minLength: { value: 8, message: "Le mot de passe doit contenir au moins 8 caractères" },
                                pattern: { value: passwordPattern, message: "Le mot de passe doit contenir au moins un chiffre, une lettre et un caractère spécial" }
                            })}
                        />
                        {showPassword
                            ? <LiaEyeSolid className='eye-icon' onClick={() => setShowPassword(false)} />
                            : <LiaEyeSlashSolid className='eye-icon' onClick={() => setShowPassword(true)} />
                        }
                    </div>

                    {errors.Password && <p className="error" role="alert">{errors.Password.message as string}</p>}
                </div>

                <div className="confirm-password">
                    <label htmlFor="ConfirmPassword">Confirmation du mot de passe</label>
                    <div className="password-field">
                        <input
                            id='ConfirmPassword'
                            type={showConfirmPassword ? "text" : "password"}
                            className={`${errors.ConfirmPassword ? "input input-error" : "input-default"}`}
                            {...register("ConfirmPassword", {
                                required: { value: true, message: "La confirmation du mot de passe est obligatoire" },
                                min: { value: 8, message: "La confirmation du mot de passe doit contenir au moins 8 caractères" },
                                pattern: { value: passwordPattern, message: "La ocnfirmation du mot de passe doit contenir au moins un chiffre, une lettre et un caractère spécial" },
                                validate: (value) => value === passwordValue || "Les mots de passe ne correspondent pas"
                            })}
                        />
                        {showConfirmPassword
                            ? <LiaEyeSolid className='eye-icon' onClick={() => setShowConfirmPassword(false)} />
                            : <LiaEyeSlashSolid className='eye-icon' onClick={() => setShowConfirmPassword(true)} />
                        }
                    </div>

                    {errors.ConfirmPassword && <p className="error" role="alert">{errors.ConfirmPassword.message as string}</p>}

                </div>
                <div className="age-declaration">
                    <input
                        id='AgeDeclaration'
                        type="checkbox"
                        className={`${errors.AgeDeclaration && errors.AgeDeclaration.message ? "checkbox checkbox-error" : "checkbox checkbox-sm checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"}`}
                        {...register("AgeDeclaration", {
                            required: { value: true, message: "Vous devez certifier avoir 15 ans ou plus" },
                        })}
                    />
                    <label htmlFor="AgeDeclaration">Je certifie avoir 15 ans ou plus</label>
                </div>

                <div className="term-of-use">
                    <input
                        id="TermOfUse"
                        type="checkbox"
                        className={`${errors.TermOfUse && errors.TermOfUse.message ? "checkbox checkbox-error" : "checkbox checkbox-sm checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"}`}
                        {...register("TermOfUse", {
                            required: { value: true, message: "Vous devez accepter les CGU" },
                        })}
                    />
                    <label htmlFor="TermOfUse">J’accepte les <a href='#'>CGU</a></label>
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