import React, { useState, useEffect } from 'react';
import { firestore } from '../../services/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './admin.css';
import Modal from '../../components/lesson-modal'; // Assume both Lesson and User modals are similar
import LessonForm from '../lesson-form/index.jsx';
import UserForm from '../register/index.jsx';
import ConfirmationModal from '../../components/confirmation-modal';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [newLesson, setNewLesson] = useState({ title: '', description: '' });
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchLessons();
  }, []);

  const fetchUsers = async () => {
    const usersCollection = collection(firestore, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchLessons = async () => {
    const lessonsCollection = collection(firestore, 'lessons');
    const lessonsSnapshot = await getDocs(lessonsCollection);
    setLessons(lessonsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleAddUser = async (user) => {
    const usersCollection = collection(firestore, 'users');
    await addDoc(usersCollection, user);
    fetchUsers();
    setShowUserModal(false);
  };

  const handleAddLesson = async (lesson) => {
    const lessonsCollection = collection(firestore, 'lessons');
    await addDoc(lessonsCollection, lesson);
    fetchLessons();
    setShowLessonModal(false);
  };

  const handleDeleteUser = async (id) => {
    const userDoc = doc(firestore, 'users', id);
    await deleteDoc(userDoc);
    fetchUsers();
  };

  const handleDeleteLesson = async (id) => {
    const lessonDoc = doc(firestore, 'lessons', id);
    await deleteDoc(lessonDoc);
    fetchLessons();
  };

  const handleUpdateUser = async (id, updatedUser) => {
    const userDoc = doc(firestore, 'users', id);
    await updateDoc(userDoc, updatedUser);
    fetchUsers();
    setShowUserModal(false);
  };

  const handleUpdateLesson = async (id, updatedLesson) => {
    const lessonDoc = doc(firestore, 'lessons', id);
    await updateDoc(lessonDoc, updatedLesson);
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

  return (
    <div className="admin-container">
      <Tabs className="admin-tabs">
        <TabList>
          <Tab>Users</Tab>
          <Tab>Lessons</Tab>
          <Tab>Reports</Tab>

        </TabList>

        <TabPanel>
          <h2>Users</h2>
          <div className="admin-inputs">
            <button onClick={() => setShowUserModal(true)}>Add User</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className="actions">
                    <button onClick={() => openConfirmationModal('Are you sure you want to delete this user?', () => handleDeleteUser(user.id))}>Delete</button>
                    <button onClick={() => {
                      setCurrentUser(user);
                      setShowUserModal(true);
                    }}>Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabPanel>

        <TabPanel>
          <h2>Lessons</h2>
          <div className="admin-inputs">
            <button onClick={() => setShowLessonModal(true)}>Add Lesson</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr key={lesson.id}>
                  <td>{lesson.title}</td>
                  <td>{lesson.description}</td>
                  <td className="actions">
                    <button onClick={() => openConfirmationModal('Are you sure you want to delete this lesson?', () => handleDeleteLesson(lesson.id))}>Delete</button>
                    <button onClick={() => handleUpdateLesson(lesson.id, { title: 'Updated Title', description: 'Updated Description' })}>Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabPanel>

        <TabPanel>
          <h2>Reports</h2>
        </TabPanel>
      </Tabs>

      <Modal show={showLessonModal} onClose={() => setShowLessonModal(false)}>
        <LessonForm navAfter={false} onSubmit={handleAddLesson} />
      </Modal>

      <Modal show={showUserModal} onClose={() => setShowUserModal(false)}>
        <UserForm onSubmit={currentUser ? (data) => handleUpdateUser(currentUser.id, data) : handleAddUser} initialData={currentUser} />
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

export default Admin;
