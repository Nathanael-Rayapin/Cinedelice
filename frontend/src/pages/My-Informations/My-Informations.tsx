/* eslint-disable @typescript-eslint/no-unused-vars */
import { useForm, type FieldErrors, type SubmitHandler } from "react-hook-form";
import type { IUpdateProfile } from "../../interfaces/user";
import { useContext, useRef, useState } from "react";
import { passwordPattern } from "../../utils/utils";
import { LiaEyeSlashSolid, LiaEyeSolid } from "react-icons/lia";
import { updatePassword } from "../../services/auth.service";
import { GlobalUIContext } from "../../store/interface";
import "./My-Informations.scss";

const MyInformations = () => {
    const { register, handleSubmit, getValues, trigger, formState: { errors, isValid }, reset } = useForm<IUpdateProfile>();
    const { setErrorMsg } = useContext(GlobalUIContext);
    const [loadingBtn, setLoadingBtn] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const submitCountRef = useRef(0);

    const onSubmit: SubmitHandler<IUpdateProfile> = async data => {
        const userData: IUpdateProfile = {
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword
        }

        try {
            setLoadingBtn(true);
            await updatePassword(userData);
            reset();
        } catch (error) {
            setErrorMsg(error instanceof Error ? error.message : "Une erreur est survenue.");
        } finally {
            setLoadingBtn(false);
        }
    };

    const onInvalid = (_errors: FieldErrors<IUpdateProfile>) => {
        submitCountRef.current += 1;
    };

    return (
        <div className="my-informations">
            <h2>Éditer mes informations</h2>
            <div className="informations">
                <form
                    role='form'
                    onSubmit={handleSubmit(onSubmit, onInvalid)}
                    data-valid={isValid}
                    autoComplete='off'
                    aria-autocomplete='none'
                >

                    <div className="password">
                        <label htmlFor="oldPassword">Ancien mot de passe</label>
                        <div className="password-field">
                            <input
                                id='oldPassword'
                                type={showPassword ? "text" : "password"}
                                className={`${errors.oldPassword ? "input input-error" : "input-default"}`}
                                autoComplete="new-password"
                                {...register("oldPassword", {
                                    required: { value: true, message: "Le mot de passe est obligatoire" },
                                })}
                            />
                            {showPassword
                                ? <LiaEyeSolid className='eye-icon' onClick={() => setShowPassword(false)} />
                                : <LiaEyeSlashSolid className='eye-icon' onClick={() => setShowPassword(true)} />
                            }
                        </div>

                        {errors.oldPassword && <p className="error" role="alert">{errors.oldPassword.message as string}</p>}
                    </div>

                    <div className="password">
                        <label htmlFor="newPassword">Nouveau mot de passe</label>
                        <div className="password-field">
                            <input
                                id='newPassword'
                                type={showPassword ? "text" : "password"}
                                className={`${errors.newPassword ? "input input-error" : "input-default"}`}
                                autoComplete="new-password"
                                {...register("newPassword", {
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

                        {errors.newPassword && <p className="error" role="alert">{errors.newPassword.message as string}</p>}
                    </div>

                    <div className="confirm-password">
                        <label htmlFor="confirmPassword">Confirmation du mot de passe</label>
                        <div className="password-field">
                            <input
                                id='confirmPassword'
                                type={showConfirmPassword ? "text" : "password"}
                                className={`${errors.confirmPassword ? "input input-error" : "input-default"}`}
                                autoComplete="new-password"
                                {...register("confirmPassword", {
                                    required: { value: true, message: "La confirmation du mot de passe est obligatoire" },
                                    minLength: { value: 8, message: "La confirmation du mot de passe doit contenir au moins 8 caractères" },
                                    validate: (value) => value === getValues("newPassword") || "Les mots de passe ne correspondent pas"
                                })}
                            />
                            {showConfirmPassword
                                ? <LiaEyeSolid className='eye-icon' onClick={() => setShowConfirmPassword(false)} />
                                : <LiaEyeSlashSolid className='eye-icon' onClick={() => setShowConfirmPassword(true)} />
                            }
                        </div>

                        {errors.confirmPassword && <p className="error" role="alert">{errors.confirmPassword.message as string}</p>}
                    </div>

                    <button type="submit" className="submit-btn btn m-1">
                        {loadingBtn
                            ? <><span className="loading loading-spinner"></span> Modifier</>
                            : "Modifier"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default MyInformations;