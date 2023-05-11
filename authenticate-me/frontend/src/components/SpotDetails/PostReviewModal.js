import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { postReview, getReviews, getUserReviews } from '../../store/reviews';
import { getOneSpot } from '../../store/spots';
import { useModal } from '../../context/Modal';
import './PostReviewModal.css';

const PostReviewModal = ({ spotId, setPosted }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [review, setReview] = useState('');
    const [stars, setStars] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newReview = {
            review,
            stars
        }

        return dispatch(postReview(newReview, spotId))
            .then(setPosted(true))
            .then(closeModal)
            .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
                setErrors(data.errors);
                return alert('Review must be filled out');
            }
        });
    }

    const disableButton = (review, stars) => {
        if (review.length < 10) return true;
        if (stars < 1) return true;
        return false;
    }

    let className = "fa-regular fa-star fa-lg";
    // console.log('stars ', stars);


    return (
        <form className='add-review-house' onSubmit={handleSubmit}>
            <h1>How was your stay?</h1>
            <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder='Leave your review here...'
                />
            {(errors.review || errors.stars) && (
            <>
                <p className='display-errors'>*{errors.review}</p>
                <p className='display-errors'>*{errors.stars}</p>
            </>
                )}
            <div className='star-box-span-house'>
                <div className='stars-box'>
                    <i className={className} style={{color: '#b39003'}}
                        onClick={() => {
                            setStars(1);
                            className += ' filled';
                        }}></i>
                    <i className={className} style={{color: '#b39003'}}
                        onClick={() => {
                            setStars(2);
                            className += ' filled';
                        }}></i>
                    <i className={className} style={{color: '#b39003'}}
                        onClick={() => {
                            setStars(3);
                            className += ' filled';
                        }}></i>
                    <i className={className} style={{color: '#b39003'}}
                        onClick={() => {
                            setStars(4);
                            className += ' filled';
                        }}></i>
                    <i className={className} style={{color: '#b39003'}}
                        onClick={() => {
                            setStars(5);
                            className += ' filled';
                        }}></i>
                </div>
                <span>Stars</span>

            </div>
            <button className='submit-review-button' disabled={disableButton(review, stars)}
            >Submit Your Review</button>
        </form>
    )
}

export default PostReviewModal;
