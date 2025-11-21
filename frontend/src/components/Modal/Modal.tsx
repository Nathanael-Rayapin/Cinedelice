import { useContext, useEffect } from "react";
import { GlobalUIContext } from "../../store/interface";
import { IoCloseOutline } from "react-icons/io5";
import type { IModalDelete, IModalDraft, IModalPreview } from "../../interfaces/modal";
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

    if (modalOptions.type === 'draft') {
        const draftOptions = modalOptions as IModalDraft;

        return <div className="modal-container">
            <dialog id="my-modal" className="modal">
                <div className="modal-box">
                    <p>{draftOptions.title}</p>
                    <p>{draftOptions.description}</p>
                    <div className="modal-action">
                        <button
                            className="btn m-1 action-btn back-btn"
                            type="button"
                            onClick={() => handleClose()}>
                            {draftOptions.cancelButtonContent}
                        </button>
                        <button
                            className="btn m-1 action-btn submit-btn"
                            type="submit"
                            onClick={() => {
                                draftOptions.onConfirm();
                                handleClose();
                            }}
                        >
                            {draftOptions.confirmButtonContent}
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    }

    if (modalOptions.type === 'delete') {
        const deleteOptions = modalOptions as IModalDelete;

        return <div className="modal-container">
            <dialog id="my-modal" className="modal">
                <div className="modal-box">
                    <p>{deleteOptions.title}</p>
                    <p>{deleteOptions.description}</p>
                    <div className="modal-action">
                        <button
                            className="btn m-1 action-btn back-btn"
                            type="button"
                            onClick={() => handleClose()}>
                            {deleteOptions.cancelButtonContent}
                        </button>
                        <button
                            className="btn m-1 action-btn submit-btn"
                            type="submit"
                            onClick={() => {
                                deleteOptions.onConfirm();
                                handleClose();
                            }}
                        >
                            {deleteOptions.confirmButtonContent}
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    }
}

export default Modal;