import { API_BASE_URL } from "../GlobalState"

class DebatesService {
    async getAllDebates() {
        const res = await fetch(`${API_BASE_URL}/debates`)
        if (!reponse.ok) throw new Error('Failed to get debates')
        return res.json()
    }

    async getDebateById(id) {
        const res = await fetch(`${API_BASE_URL}/debates/${id}`)
        if (!res.ok) throw new Error('Failed to get debate by id')
        return res.json()
    }
}