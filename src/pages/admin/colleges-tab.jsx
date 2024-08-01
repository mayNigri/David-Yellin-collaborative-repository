import React, { useState, useEffect } from 'react';
import { addCollege, getColleges, removeCollege } from '../../constants/config-actions';
import { Button } from '../../components/ui/button';
import { TrashIcon } from 'lucide-react';
import { Input } from '../../components/ui/input';

function CollegesTab() {

    const [colleges, setColleges] = useState([]);
    const [newCollege, setNewCollege] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        getColleges()
            .then((c) => setColleges(c))
    }, [])

    return (
        <div className='space-y-2'>
            <h2>רשימת מכללות</h2>
            {colleges.map((college) => (
                <div key={college.id} className='flex gap-2 items-center'>
                    <h3>
                        {college}
                    </h3>
                    <div>
                        <Button onClick={async () => {
                            setError("")
                            try {
                                await removeCollege(college)
                                setColleges(colleges.filter(c => c !== college))
                            }
                            catch (e) {
                                setError(e.message)
                            }
                        }} variant="destructive"><TrashIcon /></Button>
                    </div>
                </div>
            ))}

            <div className='flex gap-2 items-center max-w-[400px]'>
                <Input onChange={e => setNewCollege(e.target.value)} value={newCollege} />
                <Button onClick={async () => {
                    setError("")
                    try {
                        addCollege(newCollege)
                        setColleges([...colleges, newCollege])
                        setNewCollege("")
                    }
                    catch (e) {
                        setError(e.message)
                    }
                }}>הוספה</Button>
            </div>

            {error && <p className='text-red-600'>{error}</p>}
        </div>
    );
}

export default CollegesTab;