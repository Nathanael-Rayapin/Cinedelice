import { useContext, useEffect } from "react";
import { GlobalUIContext } from "../../store/interface";
import { IoCloseOutline } from "react-icons/io5";
import type { IModalDefault, IModalPreview } from "../../interfaces/modal";
import "./Modal.scss";

interface IModalProps {
    show: boolean;
}

// On aurais pu aussi gérer la logique métier dans les composants/pages concernés
// Et ne gérer que la réponse (oui ou non) dans le composant Modal
const Modal = ({ show }: IModalProps) => {
    const { setShowModal, modalOptions } = useContext(GlobalUIContext);

    // Gérer l'affichage de la modale et la fermeture avec la touche Échap
    useEffect(() => {
        if (!show) return;

        const modal = document.getElementById('my-modal') as HTMLDialogElement;
        if (!modal) return;

        modal.showModal();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [show]);

    const handleClose = () => {
        setShowModal(false);
    }

    if (!modalOptions) return null;

    if (modalOptions.type === 'preview') {
        const previewOptions = modalOptions as IModalPreview;

        return (<div className="modal-container">
            <dialog id="my-modal" className="modal">
                <div className="modal-box">
                    {previewOptions.image && <img src={previewOptions.image} alt="Image de la recette" />}
                    <div className="modal-close">
                        <form method="dialog">
                            <IoCloseOutline
                                onKeyDown={() => handleClose()}
                                onClick={() => handleClose()}
                                className="btn" />
                        </form>
                    </div>
                </div>
            </dialog>
        </div>)
    }

    if (modalOptions.type === 'default') {
        const defaultOptions = modalOptions as IModalDefault;

        return <div className="modal-container">
            <dialog id="my-modal" className="modal">
                <div className="modal-box">
                    <p>{defaultOptions.title}</p>
                    <p>{defaultOptions.description}</p>
                    <div className="modal-action">
                        <button
                            className="btn m-1 action-btn back-btn"
                            type="button"
                            onClick={() => handleClose()}>
                            {defaultOptions.cancelButtonContent}
                        </button>
                        <button
                            className="btn m-1 action-btn submit-btn"
                            type="submit"
                            onClick={() => {
                                defaultOptions.onConfirm();
                                handleClose();
                            }}
                        >
                            {defaultOptions.confirmButtonContent}
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    }
}

export default Modal;