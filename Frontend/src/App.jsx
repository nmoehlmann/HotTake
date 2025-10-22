import { useState, useEffect } from 'react'
import { userService } from './services/UserService'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// import pages
import HomePage from './pages/HomePage'
import DebatePage from './pages/DebatePage'
import EditProfilePage from './pages/EditProfilePage'
import CreateDebatePage from './pages/CreateDebatePage'

function App() {
  // initialize user profile on app load
  useEffect(() => {
    const profileInitialized = userService.initializeUserProfile()
    if (!profileInitialized) {
      console.log("No profile was found in localstorage. User needs to create a profile.")
    }
  }, [])

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* home page */}
          <Route path="/" element={<HomePage />}/>

          {/* debate page */}
          <Route path="/debate/:debateId" element={<DebatePage />}/>

          {/* profile page */}
          <Route path="/profile" element={<EditProfilePage />}/>

          {/* create debate page */}
          <Route path="/create-debate" element={<CreateDebatePage />}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App