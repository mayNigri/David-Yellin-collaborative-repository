import React, { useState, useEffect } from 'react';
import { firestore } from '../../services/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, deleteField } from 'firebase/firestore';
import 'react-tabs/style/react-tabs.css';
import './admin.css';
import { DataGrid } from '@mui/x-data-grid';
import Modal from '../../components/lesson-modal'; // Assume both Lesson and User modals are similar
import ConfirmationModal from '../../components/confirmation-modal';
import { Button } from '../../components/ui/button.jsx';
import LessonFormPage from '../lesson-form/index.jsx';
import { Input } from '../../components/ui/input.jsx';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { deleteLesson, searchLessonByName } from '../../constants/lesson-actions.js';
import LessonForm from '../lesson-form/lesson-form.jsx';

const LessonsTab = () => {
    const [lessons, setLessons] = useState([]);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [onConfirmAction, setOnConfirmAction] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState(null);

    useEffect(() => {
        fetchLessons();
    }, []);

    const fetchLessons = async () => {
        const lessonsCollection = collection(firestore, 'lessons');
        const lessonsSnapshot = await getDocs(lessonsCollection);
        setLessons(lessonsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };


    const handleDeleteLesson = async (id) => {
        await deleteLesson(id);
        fetchLessons();
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


    const handleUpdateLesson = async (id) => {
        setShowUpdateModal(id)
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        const result = await searchLessonByName(searchText);
        setLessons(result);
    }


    const columns = [
        {
            field: 'name',
            headerName: 'שם המערך',
            width: 200,
        },
        {
            field: 'class',
            headerName: 'חוג',
            width: 200,

        },
        {
            field: 'grade',
            headerName: 'שנה',
            width: 100,

        },
        {
            field: 'track',
            headerName: 'מסלול',
            width: 200,

        },
        {
            field: 'description',
            headerName: 'תיאור',
            width: 200,

        },
        {
            field: 'createdAt',
            headerName: 'נוצר בתאריך',
            width: 150,
            renderCell: (params) => (
                new Date(params.row.createdAt.toMillis()).toLocaleDateString('en-GB')
            )
        },
        {
            field: 'updatedAt',
            headerName: 'עודכן בתאריך',
            width: 150,
            renderCell: (params) => (
                new Date(params.row.updatedAt.toMillis()).toLocaleDateString('en-GB')
            )
        },
        {
            field: 'actions',
            headerName: 'פעולות',
            width: 200,
            renderCell: (params) => (
                <div className='flex gap-3'>
                    <Button onClick={() => handleUpdateLesson(params.row.id)}>עדכון</Button>
                    <Button variant="destructive" onClick={() => openConfirmationModal('Are you sure you want to delete this lesson?', () => handleDeleteLesson(params.row.id))}>מחיקה</Button>
                </div>
            )

        }
    ];


    return (
        <div className="admin-container">

            <h2>מערכי שיעור</h2>

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
                    rows={lessons.map(lesson => ({ id: lesson.id, ...lesson }))}
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
                <h1 className='pb-5'>עידכון מערך</h1>
                <LessonForm navAfter={false} id={showUpdateModal}
                    afterUpdate={(input) => {
                        setLessons(prev => {
                            return prev.map((lesson) => {
                                if (lesson.id === showUpdateModal) {
                                    return { ...lesson, ...input }
                                }
                                return lesson;
                            })
                        })
                        setShowUpdateModal(null);
                    }}
                />
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

export default LessonsTab;
