import User from "./models/User";

const API_BASE_URL = 'http://localhost:3000/api'
export { API_BASE_URL }

let currentUser = new User({name: "John Doe", age: null, gender: null})
export { currentUser }

let allDebates = [
        {
            id: 1,
            title: "dark souls II is a bad game",
            participantCount: 12,
        },
        {
            id: 2,
            title: "universal basic income: good or bad?",
            participantCount: 0,
        },
        {
            id: 3,
            title: "climate change policy debate",
            participantCount: 15,
        },
        {
            id: 4,
            title: "remote work vs office work",
            participantCount: 6
        },
        {
            id: 5,
            title: "squidward vs spongebob vs plankton vs krabs who will win?",
            participantCount: 2
        }
]
export { allDebates }

