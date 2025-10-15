import { API_BASE_URL } from "../GlobalState"
import { v4 as uuidv4 } from 'uuid'
import { currentUser } from "../GlobalState"
 

const api = API_BASE_URL
const USER_STORAGE_KEY = 'hottake_user_profile'

class UserService {

    getUserProfile() {
        const userData = localStorage.getItem(USER_STORAGE_KEY)
        return userData ? JSON.parse(userData) : null
    }

    saveUserProfile(userData) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
    }

    updateUserProfile(newUserData) {
        const origUser = this.getUserProfile()

        const updatedUser = {
            id: origUser.id ? origUser.id : uuidv4(),
            name: newUserData.name ? newUserData.name : origUser.name,
            age: newUserData.age ? newUserData.age : origUser.age,
            gender: newUserData ? newUserData.gender : origUser.gender
        }

        // no need to recode this
        this.saveUserProfile(updatedUser)

        // updates the global currentUser with local form data
        Object.assign(currentUser, updatedUser) // NOTE: cannot directly assign imported object
    }

    clearUserProfile() {
        localStorage.removeItem(USER_STORAGE_KEY)
    }


}

export const userService = new UserService()