import React, { useState, useEffect } from 'react';
import { firestore } from '../../services/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, deleteField } from 'firebase/firestore';
import 'react-tabs/style/react-tabs.css';
import './admin.css';
import { DataGrid } from '@mui/x-data-grid';
import Modal from '../../components/lesson-modal'; // Assume both Lesson and User modals are similar
import ConfirmationModal from '../../components/confirmation-modal';

import UserForm from '../register/register-form.js';
import { Button } from '../../components/ui/button.jsx';
import { searchUsersByName } from '../../constants/user-actions.js';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Input } from '../../components/ui/input.jsx';
import UserUpdateForm from '../../components/user-form.jsx';
import { useSelector } from 'react-redux';
import { selectUserDoc } from '../../redux/auth-slice.js';

const UsersTab = () => {

    const user = useSelector(selectUserDoc);

    const [users, setUsers] = useState([]);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [onConfirmAction, setOnConfirmAction] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const usersCollection = collection(firestore, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };


    const handleDeleteUser = async (id) => {
        const userDoc = doc(firestore, 'users', id);
        await deleteDoc(userDoc);
        fetchUsers();
    };

    const handleRoleChange = async (id, isAdmin) => {
        const userDoc = doc(firestore, 'users', id);
        await updateDoc(userDoc, { role: isAdmin ? 'admin' : deleteField() });
        fetchUsers();
    };

    const openConfirmationModal = (message, onConfirm) => {
        setConfirmationMessage(message);
        setOnConfirmAction(() => onConfirm);
        setShowConfirmationModal(true);
    };


    const confirmAction = () => {
        if (onConfirmAction) {
            onConfirmAction();
        }
        setShowConfirmationModal(false);
    };

    const handleUpdateUser = async (id) => {
        setShowUpdateModal(id)
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        const result = await searchUsersByName(searchText);
        setUsers(result);
    }

    const columns = [
        {
            field: 'fullName',
            headerName: 'שם מלא',
            width: 200,
        },
        {
            field: 'email',
            headerName: 'אימייל',
            width: 200,

        },
        {
            field: 'college',
            headerName: 'מכללה',
            width: 200,

        },
        {
            field: 'class',
            headerName: 'כיתה',
            width: 200,

        },
        {
            field: 'track',
            headerName: 'מסלול',
            width: 200,

        },
        {
            field: 'phone',
            headerName: 'טלפון',
            width: 200,
        },
        {
            field: 'role',
            headerName: 'מנהל',
            width: 50,
            renderCell: (params) => (
                <input
                    disabled={user.id === params.row.id}
                    type="checkbox"
                    checked={params.row.role === 'admin'}
                    onChange={(e) => handleRoleChange(params.row.id, e.target.checked)}
                />
            )
        },
        {
            field: 'actions',
            headerName: 'פעולות',
            width: 200,
            renderCell: (params) => (
                <div className='flex gap-3'>
                    <Button onClick={() => {
                        handleUpdateUser(params.row.id);
                    }}>עדכון</Button>
                    <Button onClick={() => openConfirmationModal('Are you sure you want to delete this user?', () => handleDeleteUser(params.row.id))} variant="destructive">מחיקה</Button>
                </div>
            )

        }
    ];


    return (
        <div className="admin-container">
            <h2>משתמשים רשומים</h2>

            <form onSubmit={handleSearch} className="flex items-center relative py-5 max-w-[300px] gap-5">
                <Input
                    onChange={(e) => setSearchText(e.target.value)}
                    value={searchText}
                    type="text"
                    className="min-w-[300px] h-12 text-lg"
                    placeholder="חיפוש"
                />
                <MagnifyingGlassIcon className="absolute left-2 size-7" />
                <Button type="submit" className="h-12">
                    חיפוש
                </Button>
            </form>

            <div >
                <DataGrid
                    rows={users.map(user => ({ id: user.id, ...user }))}
                    columns={columns.map((column) => ({
                        ...column,
                        resizable: false,
                        display: 'flex'
                    }))}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    pageSizeOptions={[10]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </div>

            <Modal show={Boolean(showUpdateModal)} onClose={() => setShowUpdateModal(null)}>
                <h1 className='pb-5'>עדכון משתמש</h1>
                <UserUpdateForm uid={showUpdateModal} afterUpdate={(input) => {
                    setUsers(prev => {
                        return prev.map((user) => {
                            if (user.id === showUpdateModal) {
                                return { ...user, ...input }
                            }
                            return user;
                        })
                    })

                    setShowUpdateModal(null);
                }} />
            </Modal>

            <ConfirmationModal
                show={showConfirmationModal}
                onClose={() => setShowConfirmationModal(false)}
                onConfirm={confirmAction}
                message={confirmationMessage}
            />
        </div>
    );
};

export default UsersTab;
