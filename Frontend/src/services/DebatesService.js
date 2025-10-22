import { API_BASE_URL } from "../GlobalState"
import { currentUser } from "../GlobalState"
import Debate from "../models/Debate"
const api = API_BASE_URL

class DebatesService {
    async getAllDebates() {
        const res = await fetch(`${api}/debates`)
        if (!res.ok) throw new Error('Failed to get debates')
        const data = await res.json()
        const debates = data.map(d => new Debate(d))
        return debates
    }

    async getDebateById(id) {
        const res = await fetch(`${api}/debates/${id}`)
        if (!res.ok) throw new Error('Failed to get debate by id')
        const data = await res.json()
        const debate = new Debate(data)
        return debate
    }

    async createDebate(debateData) {
        debateData = {
            title: debateData.title,
            owner_id: currentUser.id,
            owner_name: currentUser.name,
            owner_age: currentUser.age,
            owner_gender: currentUser.gender
        }
        
        const res = await fetch(`${api}/debates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(debateData)
        })
        if (!res.ok) throw new Error('Failed to create debate')
        const data = res.json()
        const newDebate = new Debate(data)
        return newDebate
    }

    async deleteDebate(id) {
        const res = await fetch(`${api}/debates/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (!res.ok) throw new Error('Failed to delete debate')
        const data = res.json()
        const newDebate = new Debate(data)
        return newDebate
    }
}

export const debatesService = new DebatesService()