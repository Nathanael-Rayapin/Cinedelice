import { useContext, useEffect, useState } from "react";
import { AuthContext, GlobalUIContext } from "../../store/interface";
import type { IUserDTO } from "../../interfaces/user";
import { deleteUser, getUsers, updateUserRole } from "../../services/users.service";
import type { Role } from "../../interfaces/auth";
import "./Admin-Dashboard.scss";

const AdminDashboard = () => {
    const [users, setUsers] = useState<IUserDTO[]>([]);
    const { setLoading, setErrorMsg, setModalOptions, setShowModal } = useContext(GlobalUIContext);
    const { userId } = useContext(AuthContext);
    const [loadingBtn, setLoadingBtn] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);

                const users = await getUsers();
                setUsers(users || []);

            } catch (error) {
                if (error instanceof Error) {
                    setErrorMsg(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleRoleChange = (userId: number, currentRole: Role) => {
        const newRole = currentRole === "admin" ? "user" : "admin";

        setModalOptions({
            title: "Changer de rôle",
            description: "Etes-vous sûr de vouloir changer le rôle de cet utilisateur ?",
            cancelButtonContent: "Annuler",
            confirmButtonContent: "Confirmer",
            type: "default",
            onConfirm: async () => {
                try {
                    setLoadingBtn(true);
                    const user = await updateUserRole(userId, newRole);
                    setUsers(users.map(u => u.id === userId ? user : u));
                } catch (error) {
                    setErrorMsg(error instanceof Error ? error.message : 'Une erreur est survenue.');
                } finally {
                    setLoadingBtn(false);
                }
            },
        });
        setShowModal(true);
    }

    const handleDelete = (userId: number) => {
        setModalOptions({
            title: "Supprimer l'utilisateur",
            description: "Êtes-vous sûr de vouloir supprimer cet utilisateur ?",
            cancelButtonContent: "Annuler",
            confirmButtonContent: "Confirmer",
            type: "default",
            onConfirm: async () => {
                try {
                    setLoadingBtn(true);
                    await deleteUser(userId);
                    setUsers(users.filter(u => u.id !== userId));
                } catch (error) {
                    setErrorMsg(error instanceof Error ? error.message : 'Une erreur est survenue.');
                } finally {
                    setLoadingBtn(false);
                }
            },
        });
        setShowModal(true);
    }

    return (
        <div className="admin-dashboard-container">
            <h1>Back-Office</h1>

            <div className="overflow-x-auto">
                {users.filter((user) => user.id !== userId && user.role !== 'admin').length === 0 ? (
                    <div className="no-data-found">
                        <h2 className="no-users-message">Aucun utilisateur trouvé.</h2>
                    </div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Adresse email</th>
                                <th>Rôle</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Je ne dois pas voir mon propre profil car si je change mon propre rôle
                        techniquement je ne devrais plus avoir accès à ce dashboard */}
                            {users.filter((user) => user.id !== userId && user.role !== 'admin').map((user) => (
                                <tr key={user.id}>
                                    <td>{user.email}</td>
                                    <td className="role">{user.role}</td>
                                    <td className="action-btn">
                                        <button
                                            className="btn m-1 change-btn"
                                            onClick={() => handleRoleChange(user.id, user.role)}>
                                            {loadingBtn ? (
                                                <>
                                                    <span className="loading loading-spinner"></span>Changer de rôle
                                                </>
                                            ) : (
                                                "Changer de rôle"
                                            )}
                                        </button>
                                        <button
                                            className="btn m-1 delete-btn"
                                            onClick={() => handleDelete(user.id)}>
                                            {loadingBtn ? (
                                                <>
                                                    <span className="loading loading-spinner"></span>Supprimer
                                                </>
                                            ) : (
                                                "Supprimer"
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;