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
}

export default Debate