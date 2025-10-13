import { API_BASE_URL } from "../GlobalState"
const api = API_BASE_URL

class UserService {
    async CreateUser(userData) {
        const res = await fetch(`${api}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })
        if (!res.ok) throw new Error('Failed to create user')
        return res.json()
    }

    async UpdateUser(userData) {
        const res = await fetch(`${api}/users`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })
        if (!res.ok) throw new Error('Failed to update user')
        return res.json()
    }

    async DeleteUser(uid) {
        const res = await fetch(`${api}/users/${uid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (!res.ok) throw new Error('Failed to delete user')
        return res.ok
    }

    async GetUserById(uid) {
        const res = await fetch(`${api}/users/${uid}`)
        if (!res.ok) throw new Error('Failed to get user by id')
        return res.json()
    }
}