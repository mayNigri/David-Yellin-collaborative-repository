import React, { useState, useEffect, useMemo } from "react";
import { collection, addDoc, getDocs, setDoc, doc } from "firebase/firestore";
import { StarIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/auth-slice";
import { lessonRef } from "../constants/refs";
import { firestore } from "../services/firebase";

const Rating = ({ lessonId }) => {
    const { uid } = useSelector(selectUser);

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [ratings, setRatings] = useState([])


    const averageRating = useMemo(() => {
        const total = ratings.length;
        const sum = ratings.map(r => r.rate).reduce((a, b) => a + b, 0);
        return total > 0 ? sum / total : 0;
    }, [ratings])

    const totalRatings = useMemo(() => {
        return ratings.length
    }, [ratings])

    const alreadyRated = useMemo(() => {
        return Boolean(ratings.find(r => r.id === uid))
    }, [])


    const fetchRatings = async () => {
        const querySnapshot = await getDocs(collection(firestore, lessonRef(lessonId).path, "ratings"));
        setRatings(querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        })))

        setRating(querySnapshot.docs.find(doc => doc.id === uid)?.data()?.rate || 0)
    };

    useEffect(() => {
        fetchRatings();
    }, []);

    const handleClick = async (rate) => {
        setRating(rate);
        try {
            await setDoc(doc(firestore, lessonRef(lessonId).path, "ratings", uid), { rate });
            setRatings(prev => {
                return [...prev.filter((p) => p.id !== uid), { id: uid, rate }]
            });
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    return (
        <div className="star-rating py-2 space-y-2">
            <div className="average-rating">
                <p>דירוג ממוצע: {averageRating.toFixed(1)} ({totalRatings} דירוגים)</p>
            </div>
            <div className="flex space-x-reverse space-x-1">
                {new Array(5).fill(null).map((star, index) => {
                    index += 1;
                    return (
                        <StarIcon className={index <= (hover || rating) ? "fill-yellow-400" : "off"} onClick={() => handleClick(index)} />
                    );
                })}
            </div>
        </div>
    );
};

export default Rating;