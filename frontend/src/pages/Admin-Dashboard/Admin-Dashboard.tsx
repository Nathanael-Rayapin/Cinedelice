import { useContext, useEffect, useState } from "react";
import { AuthContext, GlobalUIContext } from "../../store/interface";
import type { IUserDTO } from "../../interfaces/user";
import { getUsers } from "../../services/users.service";
import "./Admin-Dashboard.scss";

const AdminDashboard = () => {
    const [users, setUsers] = useState<IUserDTO[]>([]);
    const { setLoading, setErrorMsg } = useContext(GlobalUIContext);
    const { userId } = useContext(AuthContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);

                const users = await getUsers();
                setUsers(users);

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

    return (
        <div className="admin-dashboard-container">
            <h1>Back-Office</h1>

            <div className="overflow-x-auto">
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
                        {users.filter((user) => user.id !== userId).map((user) => (
                            <tr key={user.id}>
                                <td>{user.email}</td>
                                <td className="role">{user.role}</td>
                                <td className="action-btn">
                                    <button className="btn m-1 change-btn">
                                        Changer de rôle
                                    </button>
                                    <button className="btn m-1 delete-btn">
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;