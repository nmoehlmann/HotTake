import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '../styles/DebatePage.css'
import { BsFillCameraVideoOffFill, BsFillCameraVideoFill, BsMicFill, BsMicMuteFill } from 'react-icons/bs'
import { FaPhoneSlash } from 'react-icons/fa6'
import { FaTimes } from 'react-icons/fa'

// service imports
import { debatesService } from '../services/DebatesService'

// global imports
import { allDebates } from '../GlobalState'
import { currentUser } from '../GlobalState'

function DebatePage() {
    const navigate = useNavigate()
    const { debateId } = useParams() // gets ID from URL

    // error and load state
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [debate, setDebate] = useState(null)

    // controls state
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOn, setIsVideoOn] = useState(true)
    const [fullscreenUser, setFullscreenUser] = useState(null)

    const [participants, setParticipants] = useState([
        { id: 1, name: 'Alice', age: 22, gender: "female" },
        { id: 2, name: 'Bob', age: null, gender: null },
        { id: 3, name: 'Charlie', age: 25, gender: null },
        { id: 4, name: 'Diana', age: null, gender: "other" },
        { id: 5, name: 'Eve', age: 80, gender: "female" },
        { id: 6, name: 'Frank', age: 25, gender: "male" },
    ])

    useEffect(() => {
        // todo: replace with API call getting debate by id from server

        const getDebateById = async (debateId) => {
            setError('')
            setIsLoading(false)
            try {
                const debate = await debatesService.getDebateById(debateId)
                setDebate(debate)
            } catch (err) {
                console.error('Failed to get debate by id', err)
                setError('Failed to load debate. Please try again later')
            } finally {
                setIsLoading(false)
            }
        }

        getDebateById(debateId)
    }, [debateId])

    const handleLeaveDebate = () => {
        navigate('/')
    }

    const toggleMute = () => {
        setIsMuted(!isMuted)
    }

    const toggleVideo = () => {
        setIsVideoOn(!isVideoOn)
    }

    const openFullscreen = (participant) => {
        setFullscreenUser(participant)
    }

    const closeFullscreen = () => {
        setFullscreenUser(null)
    }

    return(
        <div className='debate-page-container'>
            <header className='debate-header'>
                <div className='title-container'>
                    <h1>{debate?.title}</h1>
                    <p>{debate?.participantCount} participants</p>
                </div>
                <div className='user-video-container'>
                    <video className='user-video' />
                    <div className='video-label'>
                        {currentUser.name && currentUser.name}
                        {currentUser.age && `, ${currentUser.age}`}
                        {currentUser.gender && `, ${currentUser.gender}`}
                    </div>
                    {!isVideoOn && <div className='video-off-indicator'><BsFillCameraVideoOffFill /></div>}
                    {isMuted && <div className='muted-indicator'><BsMicMuteFill /></div>}
                </div>
            </header>

            <main className='debate-main'>
                <div className='participants-grid'>
                    {participants.map(participant => (
                        <div
                            key={participant.id}
                            className={`participant-video`}
                            onClick={() => openFullscreen(participant)}
                        >
                            <video src="" className='participant-feed' />
                            <div className='participant-label-section'>
                                {participant.name && `${participant.name}`}
                                {participant.age && `, ${participant.age}`}
                                {participant.gender && `, ${participant.gender}`}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer className='debate-options'>
                <button 
                    className={`control-btn ${isMuted ? 'active' : ''}`}
                    onClick={toggleMute}
                >
                    {isMuted ? <BsMicMuteFill/> : <BsMicFill/>}
                </button>

                <button
                    className={`control-btn ${!isVideoOn ? 'active' : ''}`}
                    onClick={toggleVideo}
                >
                    {isVideoOn ? <BsFillCameraVideoFill/> : <BsFillCameraVideoOffFill />}
                </button>

                <button
                    className='control-btn leave-btn'
                    onClick={handleLeaveDebate}
                >
                    <FaPhoneSlash />
                </button>
            </footer>

            {fullscreenUser && (
                <div className='fullscreen-modal' onClick={closeFullscreen}>
                    <div className='fullscreen-content' onClick={(e) => e.stopPropagation()}>
                        <button className='close-fullscreen' onClick={closeFullscreen}>
                            <FaTimes />
                        </button>
                        <video src="" className='fullscreen-video' />
                        <div className='fullscreen-label'>{fullscreenUser.name}</div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DebatePage