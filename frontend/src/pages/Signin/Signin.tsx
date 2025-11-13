import { Link, useNavigate } from 'react-router';
import { LiaEyeSlashSolid, LiaEyeSolid } from 'react-icons/lia';
import { useContext, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { ISignin } from '../../interfaces/auth';
import { signin } from '../../services/auth.service';
import PacmanLoader from 'react-spinners/PacmanLoader';
import { AuthContext } from '../../store/interface';
import './Signin.scss';

const emailPattern = /^.+@.+$/i;

const Signin = () => {
    const { register, handleSubmit, formState: { errors, isValid } } = useForm<ISignin>();
    const [loading, setLoading] = useState(false);
    const authContext = useContext(AuthContext)
    const navigate = useNavigate()

    // Un simple log en attendant d'avoir l'endpoint d'inscription
    const onSubmit: SubmitHandler<ISignin> = async data => {
        const userData: ISignin = {
            email: data.email,
            password: data.password
        }

        try {
            setLoading(true);
            const data = await signin(userData);
            authContext.login(data);

            // On redirige (à terme on redirigera vers le profil)
            navigate('/pour-vous')

        } catch (error) {
            console.error('Erreur lors de la connexion au compte', error);
        } finally {
            setLoading(false);
        }
    };

    const [showPassword, setShowPassword] = useState(false);

    // Loading State
    if (loading) {
        return (
            <div className="loading-container">
                <PacmanLoader color="#fB8b24" />
            </div>
        );
    }

    return (
        <div className="signin">
            <h1>Connexion</h1>

            <form
                role='form'
                onSubmit={handleSubmit(onSubmit)}
                data-valid={isValid}>

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
                            })}
                        />
                        {showPassword
                            ? <LiaEyeSolid className='eye-icon' onClick={() => setShowPassword(false)} />
                            : <LiaEyeSlashSolid className='eye-icon' onClick={() => setShowPassword(true)} />
                        }
                    </div>

                    {errors.password && <p className="error" role="alert">{errors.password.message as string}</p>}
                </div>

                <button type='submit' className="submit-btn btn m-1">
                    Connexion
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