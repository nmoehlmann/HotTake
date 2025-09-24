import { FaCheck, FaTimes } from 'react-icons/fa'
import '../styles/ConfirmationModal.css'

function ConfirmationModal({ isOpen, onClose, debate, onConfirm }) {
    if (!isOpen) return null

    return (
        <div className='modal-overlay' onClick={onClose}>
            <div className='modal-container'>
                <header className='modal-header'>
                    <h1>Join Debate?</h1>
                </header>
                <main className='modal-content'>
                    <h2>{debate.title}</h2>
                    <p>{`${debate.participantCount} people are debating`}</p>
                    <p>Do you want to join this debate?</p>
                </main>
                <footer className='modal-options'>
                    <button className='cancel-btn' onClick={onClose}>
                        <FaTimes /> Cancel
                    </button>
                    <button className='join-btn' onClick={onConfirm}>
                        <FaCheck /> Join
                    </button>
                </footer>
            </div>
        </div>
    )
}

export default ConfirmationModal