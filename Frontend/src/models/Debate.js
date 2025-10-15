class Debate {
    constructor(data) {
        this.id = data.id
        this.title = data.title
        this.created_at = data.created_at
        this.owner_id = data.owner_id
        this.participants = data.participants
    }

    formattedDate() {
        return this.created_at.toLocaleDateString()
    }

    // participantCount() {
    //     return this.participants.length
    // }

    // instead of method, this retrieves the participant count as a property would
    get participantCount() {
        return Object.keys(this.participants).length
    }
}

export default Debate