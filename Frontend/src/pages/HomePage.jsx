import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaPlus, FaUser } from 'react-icons/fa'
import '../styles/HomePage.css'
import '../styles/BaseStyles.css'
import { currentUser } from "../GlobalState"

// model imports
import User from '../models/User'

// component imports
import DebateCard from '../components/DebateCard'

function HomePage() {
    const navigate = useNavigate() // setup navigate

    // mock data
    const [debates, setDebates] = useState([
        {
            id: 1,
            title: "dark souls II is a bad game",
            participantCount: 12,
        },
        {
            id: 2,
            title: "universal basic income: good or bad?",
            participantCount: 0,
        },
        {
            id: 3,
            title: "climate change policy debate",
            participantCount: 15,
        },
        {
            id: 4,
            title: "remote work vs office work",
            participantCount: 6
        },
        {
            id: 5,
            title: "squidward vs spongebob vs plankton vs krabs who will win?",
            participantCount: 2
        }
    ])

    return (
        <div className="container">
            <header className="header">
                <h1>🔥HotTake🔥</h1>
            </header>
            <main className="main">
                <div className="debates-list">
                    {debates.map(debate => (
                        <DebateCard
                            title={debate.title}
                            participantCount={debate.participantCount}
                            key={debate.id}
                        />
                    ))}
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
        </div>
    )
}

export default HomePage