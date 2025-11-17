import { useContext, useEffect } from "react";
import { GlobalUIContext } from "../../store/interface";
import { IoCloseOutline } from "react-icons/io5";

import "./Modal.scss";

interface IModalProps {
    show: boolean;
}

const Modal = ({ show }: IModalProps) => {
    const { setShowModal, modalOptions } = useContext(GlobalUIContext);

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

    const handleClose = () => {
        setShowModal(false);
    }

    if (!modalOptions) return null;

    return (
        <div className="modal-container">
            <dialog id="preview_modal" className="modal">
                <div className="modal-box">
                    {modalOptions.image && <img src={modalOptions.image} alt={modalOptions.title} />}
                    <div className="modal-action">
                        <form method="dialog">
                            <IoCloseOutline
                                onKeyDown={() => handleClose()}
                                onClick={() => handleClose()}
                                className="btn" />
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
}

export default Modal;