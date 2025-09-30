import '../styles/EditProfilePage.css'
import { FaArrowLeft, FaVenus, FaMars, FaGenderless, FaCheck, FaBan } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { currentUser } from '../GlobalState'
import { useState, useEffect } from 'react'


function EditProfilePage() {
    const navigate = useNavigate()

    // local state form form
    const [formData, setFormData] = useState({
        name: currentUser.name,
        age: currentUser.age,
        gender: currentUser.gender
    })

    /* currently redundant but will be needed when currentUser is changed externally.
     * useEffect is called whenever currentUser changes.
    */
    useEffect(() => {
        setFormData({
            name: currentUser.name,
            age: currentUser.age,
            gender: currentUser.gender
         })
    }, [currentUser])

    // 
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ // prev = current formData
            ...prev,           // spread all existing fields
            [field]: value     // update just this one field 
                               // NOTE: variable in brackets is a reference to the value instead of literal interpretation of field containing either "name", "age", or "gender"
        }))
    }

    const handleSave = () => {
        // checks name
        if (!formData.name || formData.name.trim() === '') {
            alert('Name is required')
            return
        }

        // validate age if provided
        if (formData.age && formData.age !== '') {
            const ageNumber = parseInt(formData.age)
            if (isNaN(ageNumber) || ageNumber < 0 || ageNumber > 150) {
                alert('Age must be a valid number between 0 and 150')
                return
            }
        }

        // convert empty strings to null for save
        const saveData = {
            name: formData.name.trim(),
            age: formData.age && formData.age !== '' ? parseInt(formData.age) : null,
            gender: formData.gender || null
        }

        // updates the global currentUser with local form data
        Object.assign(currentUser, saveData) // NOTE: cannot directly assign imported object
        navigate('/')
    }

    const handleDiscard = () => {
        // resets form to original user data
        setFormData({
            name: currentUser.name,
            age: currentUser.age,
            gender: currentUser.gender
        })
        navigate('/')
    }

    return (
        <div className='profile-container'>
            <header className='profile-header-container'>
                <section className="profile-header-section">
                    <button className="back-btn" onClick={() => navigate('/')}>
                        <FaArrowLeft />
                    </button>
                    <h1>Profile</h1>
                </section>
            </header>
            <main className='profile-main-container'>
                <form action="" className="profile-form">
                    <div className="name-inp-container">
                        <h1>Name</h1>
                        <input 
                            required
                            className="name-inp" 
                            value={formData.name}
                            placeholder="Enter your name"
                            type="text"
                            onChange={(e) => handleInputChange('name', e.target.value)} />
                    </div>
                    <div className="age-inp-container">
                        <h1>Age</h1>
                        <input 
                            className="age-inp" 
                            type="number"
                            value={formData.age}
                            onChange={(e) => handleInputChange('age', e.target.value)}
                            placeholder="Enter your age" />
                    </div>
                    <div className="gender-inp-container">
                        <h1>Gender</h1>
                        <div className="gender-inp">
                            <button 
                                className={`male-btn ${formData.gender === 'male' ? 'selected' : ''}`}
                                type="button"
                                onClick={() => handleInputChange('gender', 'male')}>
                                <div className="male-icon">
                                    <FaMars />
                                </div>
                                <h2>Male</h2>
                            </button>
                            <button 
                                className={`female-btn ${formData.gender === 'female' ? 'selected' : ''}`}
                                type="button"
                                onClick={() => handleInputChange('gender', 'female')}>
                            <div className="female-icon">
                                <FaVenus />
                            </div>
                                <h2>Female</h2>
                            </button>
                            <button 
                                className={`other-btn ${formData.gender === 'other' ? 'selected' : ''}`}
                                type="button"
                                onClick={() => handleInputChange('gender', 'other')}>
                                <div className="other-icon">
                                    <FaGenderless />
                                </div>
                                <h2>Other</h2>
                            </button>
                        </div>
                    </div>
                </form>
            </main>
            <footer className="profile-footer-container">
                <section className='footer-options'>
                    <button className='discard-btn' onClick={handleDiscard}>
                        <FaBan />
                        <p className='btn-label'>Discard</p>
                    </button>
                    <button className='save-btn' onClick={handleSave}>
                        <FaCheck />
                        <p className='btn-label'>Save</p>
                    </button>
                </section>
            </footer>
        </div>
    )
}

export default EditProfilePage