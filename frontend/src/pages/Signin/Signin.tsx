import { Link } from 'react-router';
import { LiaEyeSlashSolid, LiaEyeSolid } from 'react-icons/lia';
import { useState } from 'react';
import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form';

import './Signin.scss';

const emailPattern = /^.+@.+$/i;

const Signin = () => {
    const { register, handleSubmit, formState: { errors, isValid } } = useForm();

    // Un simple log en attendant d'avoir l'endpoint d'inscription
    const onSubmit: SubmitHandler<FieldValues> = data => console.log(data);

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="signin">
            <h1>Connexion</h1>

            <form
                role='form'
                onSubmit={handleSubmit(onSubmit)}
                data-valid={isValid}>

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
                            })}
                        />
                        {showPassword
                            ? <LiaEyeSolid className='eye-icon' onClick={() => setShowPassword(false)} />
                            : <LiaEyeSlashSolid className='eye-icon' onClick={() => setShowPassword(true)} />
                        }
                    </div>

                    {errors.Password && <p className="error" role="alert">{errors.Password.message as string}</p>}
                </div>

                <button type='submit' className="submit-btn btn m-1">
                    Je me connecte
                </button>

                <div className="have-an-account">
                    <p>Pas encore de compte ?</p>
                    <Link to="/inscription">S'inscrire</Link>
                </div>
            </form>
        </div>
    )
}

export default Signin