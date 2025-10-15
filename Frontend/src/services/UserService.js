import { API_BASE_URL } from "../GlobalState"


const api = API_BASE_URL
const USER_STORAGE_KEY = 'hottake_user_profile'

class UserService {

    getUserProfile() {
        const userData = localStorage.getItem(USER_STORAGE_KEY)
        return userData ? JSON.parse(userData) : null
    }

    saveUserProfile(userData) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
        return userData
    }

    updateUserProfile(userData) {
        const currentUser = this.getUserProfile()

        const updatedUser = {
            ...currentUser,
            ...userData,
            id: currentUser ? currentUser.id : 
        }
    }


}

export const userService = new UserService()