class Debate {
    constructor(data) {
        this.id = data.id
        this.title = data.title
        this.participant_count = data.participantCount
        this.created_at = data.created_at
        this.owner_id = data.owner_id
    }
}

export default Debate