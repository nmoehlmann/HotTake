import '../styles/CreateDebatePage.css'
import { FaArrowLeft, FaBan, FaCheck, FaSpinner } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { debatesService } from '../services/DebatesService'

function CreateDebatePage() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        title: ''
    })

    // loading and error states
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSave = async () => {
        // validate data
        if (!formData.title || formData.title.trim() === '') {
            setError('Title is required')
            return
        }

        try {
            setIsLoading(true)
            setError('')

            // test spinner
            // return new Promise(resolve => setTimeout(resolve, 5000))
            const newDebate = await debatesService.createDebate(formData)

            // navigate to new debate
            navigate(`/debate/${newDebate.id}`)
        } catch (err) {
            console.error('Failed to create debate', err)
            setError('Failed to create debate. Please try again.')
            setIsLoading(false)
        }
    }

    const handleDiscard = () => {
        setFormData({
            title: ''
        })
        navigate('/')
    }

    return(
        <div className='create-debate-container'>
            <header className='create-debate-header'>
                <section className="create-debate-header-section">
                    <button className='back-btn' onClick={() => navigate('/')}>
                        <FaArrowLeft />
                    </button>
                    <h1>Create Debate</h1>
                </section>
            </header>
            <main className='create-debate-main-container'>
                <form action="" className='debate-form'>
                    <div className='title-inp-container'>
                        <h1>Title</h1>
                        <input 
                            type="text" 
                            className='title-inp'
                            placeholder="Enter title of debate here..."
                            maxLength="25"
                            onChange={(e) => handleInputChange('title', e.target.value)} />
                    </div>

                    {error && <div className='error-message'>{error}</div>}
                </form>
            </main>
            <footer className='create-debate-footer-container'>
                <section className='footer-options'>
                    <button className='discard-btn' onClick={handleDiscard}>
                        <FaBan />
                        <p className='btn-label'>Discard</p>
                    </button>
                    <button 
                        className='save-btn' 
                        onClick={handleSave}
                        disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <FaSpinner className='spinner' />
                                <p className='btn-label'>Creating</p>
                            </>
                        ) : (
                            <>
                                <FaCheck />
                                <p className='btn-label'>Submit</p>
                            </>
                        )}
                    </button>
                </section>
            </footer>
        </div>
    )
}

export default CreateDebatePage