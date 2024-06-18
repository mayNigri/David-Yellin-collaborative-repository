import { getDoc, doc } from 'firebase/firestore'
import { useEffect, useState } from 'react';
import { firestore } from '../../services/firebase';
import { Lesson } from '../../models/Lesson';
import LessonCard from '../../components/lesson-card';
import FiltersModal from '../../components/filters-modal';
const HomePage = () => {

    const [showFilters, setShowFilters] = useState(false)
    return (
        <div>
            <h1>דף הבית</h1>
            <p>שלום יואב</p>
            <div>
                <div className='flex flex-row items-center space-x-reverse space-x-2 justify-between'>
                    <div className='flex flex-row items-center space-x-reverse space-x-2'>
                        <input type='text' placeholder='חיפוש' />
                        <button onClick={() => setShowFilters(true)}>סינון</button>
                        <button className="bg-black p-2 text-white rounded-md">חיפוש</button>
                    </div>

                    <div>
                        <a href="/lesson" className="bg-black p-2 text-white rounded-md">יצירת מערך שיעור</a>
                    </div>
                </div>

                <div className='grid grid-cols-3 gap-3'>
                    <a href="/lesson/1"><LessonCard /></a>
                    <a href="/lesson/1"><LessonCard /></a>
                    <a href="/lesson/1"><LessonCard /></a>
                    <a href="/lesson/1"><LessonCard /></a>
                    <a href="/lesson/1"><LessonCard /></a>
                    <a href="/lesson/1"><LessonCard /></a>
                    <a href="/lesson/1"><LessonCard /></a>

                </div>

                {showFilters && <FiltersModal onDismiss={() => setShowFilters(false)} />}

            </div>
        </div>
    )
}

export default HomePage;