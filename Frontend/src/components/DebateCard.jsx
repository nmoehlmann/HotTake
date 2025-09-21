import '../styles/DebateCard.css'

function DebateCard({ title, participantCount }) {
    return (
        <div className="debate-card-container">
            <section className="content">
                <p>{title}</p>
                <p>{participantCount} participants</p>
            </section>
        </div>
    )
}

export default DebateCard