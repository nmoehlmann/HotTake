class User {
    constructor(data) {
        this.name = data.name || null
        this.age = data.age || null
        this.gender = data.gender || null
    }
}

export default User