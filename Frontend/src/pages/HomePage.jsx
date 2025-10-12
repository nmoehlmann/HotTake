import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaPlus, FaUser } from 'react-icons/fa'
import '../styles/HomePage.css'
import '../styles/BaseStyles.css'
import { currentUser } from "../GlobalState"
import { allDebates } from "../GlobalState"

// model imports
import User from '../models/User'

// component imports
import DebateCard from '../components/DebateCard'
import ConfirmationModal from '../components/ConfirmationModal'

function HomePage() {
    const navigate = useNavigate() // setup navigate

    // modal state
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedDebate, setSelectedDebate] = useState(null)

    // loading and error states
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleDebateClick = (debate) => {
        setSelectedDebate(debate)
        setIsModalOpen(true)
    }

    const handleJoinDebate = () => {
        console.log(`joining debate ${selectedDebate.title}`)
        navigate(`/debate/${selectedDebate.id}`)
        setIsModalOpen(false)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedDebate(null)
    }


    
    return (
        <div className="container">
            <header className="header">
                <h1>🔥HotTake🔥</h1>
            </header>
            <main className="main">
                <div className="debates-list">
                    {allDebates.map(debate => (
                        <div key={debate.id} onClick={() => {handleDebateClick(debate)}}>
                            <DebateCard
                                title={debate.title}
                                participantCount={debate.participantCount}
                            />
                        </div>))}
                </div>
            </main>
            <footer className="footer">
                <button className="profile-btn" onClick={() => navigate('/profile')}>
                    <div className="btn-content">
                        <FaUser />
                        <span>Profile</span>
                    </div>
                </button>
                <button className="create-btn" onClick={() => navigate('/create-debate')}>
                    <div className="btn-content">
                        <FaPlus />
                        <span>Create</span>
                    </div>
                </button>
            </footer>

            {/* confirmation modal */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                debate={selectedDebate}
                onConfirm={handleJoinDebate}
            />
        </div>
    )
}

export default HomePage