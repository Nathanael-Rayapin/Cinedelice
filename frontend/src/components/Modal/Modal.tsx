import { useContext, useEffect } from "react";
import { GlobalUIContext } from "../../store/interface";
import { IoCloseOutline } from "react-icons/io5";
import type { IModalDraft, IModalPreview } from "../../interfaces/modal";
import { useNavigate } from "react-router";
import { showSnackbar } from "../../utils/snackbar";
import "./Modal.scss";

interface IModalProps {
    show: boolean;
}
// Composant Modal pour afficher des modales de prévisualisation ou de brouillon
const Modal = ({ show }: IModalProps) => {
    const { setShowModal, modalOptions } = useContext(GlobalUIContext);
    const navigate = useNavigate();

    // Gérer l'affichage de la modale et la fermeture avec la touche Échap
    useEffect(() => {
        if (!show) return;

        const modal = document.getElementById('preview_modal') as HTMLDialogElement;
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

    const handleDraft = async (draftData: FormData) => {
        try {
            // TODO: Créer la recette en brouillon quand on aura l'API dédiée
            // await createRecipe(draftData);
            showSnackbar("Cette fonctionnalité n'est pas encore disponible", true);
        } catch (error) {
            showSnackbar("Oups ! Une erreur s'est produite. Veuillez réessayer plus tard.", false);
        } finally {
            handleClose();
            navigate("/profil/mes-recettes");
        }
    }

    const handleClose = () => {
        setShowModal(false);
    }

    if (!modalOptions) return null;

    if (modalOptions.type === 'preview') {
        const previewOptions = modalOptions as IModalPreview;

        return (<div className="modal-container">
            <dialog id="preview_modal" className="modal">
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
            <dialog id="preview_modal" className="modal">
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
                            onClick={() => handleDraft(draftOptions.draftData)}>
                            {draftOptions.confirmButtonContent}
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    }
}

export default Modal;