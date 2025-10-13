import { API_BASE_URL } from "../GlobalState"
const api = API_BASE_URL

class DebatesService {
    async getAllDebates() {
        const res = await fetch(`${api}/debates`)
        if (!reponse.ok) throw new Error('Failed to get debates')
        return res.json()
    }

    async getDebateById(id) {
        const res = await fetch(`${api}/debates/${id}`)
        if (!res.ok) throw new Error('Failed to get debate by id')
        return res.json()
    }

    async createDebate(debateData) {
        const res = await fetch(`${api}/debates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(debateData)
        })
        if (!Response.ok) throw new Error('Failed to create debate')
        return res.json()
    }

    async deleteDebate(id) {
        const res = await fetch(`${api}/debates/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (!res.ok) throw new Error('Failed to delete debate')
        return res.ok
    }
}