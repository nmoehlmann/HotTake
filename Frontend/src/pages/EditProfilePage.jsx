import '../styles/EditProfilePage.css'
import { FaArrowLeft, FaVenus, FaMars, FaGenderless } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'


function EditProfilePage() {
    const navigate = useNavigate()
    return (
        <div>
            <header>
                <section className="header-container">
                    <button className="back-btn" onClick={() => navigate('/')}>
                        <FaArrowLeft />
                    </button>
                    <h1>Profile</h1>
                </section>
            </header>
            <main>
                <form action="" className="profile-form">
                    <div className="name-inp-container">
                        <h1>Name</h1>
                        <input className="name-inp" type="text" />
                    </div>
                    <div className="age-inp-container">
                        <h1>Age</h1>
                        <input className="age-inp" type="integer" />
                    </div>
                    <div className="gender-inp-container">
                        <h1>Gender</h1>
                        <div className="gender-inp">
                            <button className="male-btn">
                                <div className="male-icon">
                                    <FaMars />
                                </div>
                                <h2>Male</h2>
                            </button>
                            <button className="female-btn">
                            <div className="female-icon">
                                <FaVenus />
                            </div>
                                <h2>Female</h2>
                            </button>
                            <button className="other-btn">
                                <div className="other-icon">
                                    <FaGenderless />
                                </div>
                                <h2>Other</h2>
                            </button>
                        </div>
                    </div>
                </form>
            </main>
            <footer>

            </footer>
        </div>
    )
}

export default EditProfilePage