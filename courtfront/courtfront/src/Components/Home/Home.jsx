import React from "react";
import './Home.css'
import { useNavigate } from "react-router-dom";


function Home() {
    const navigate = useNavigate()
    return (
        <div>
                <h1>Delhi High Court</h1>
            <div className="homebut">
            
                <p >The Delhi High Court was established on October 31, 1966 and serves the National Capital Territory of Delhi.
                    It functions under Article 214 of the Indian Constitution with civil, criminal, writ, and constitutional jurisdiction.
                    Located at Sher Shah Road, it has both original and appellate jurisdiction.
                    The court consists of Single and Division Benches to hear various matters.
                    It supervises subordinate courts within Delhi.
                    The High Court has adopted digital tools like e-filing and virtual hearings.
                    Its website delhihighcourt.nic.in provides public access to orders and listings.
                    The court is a leader in judicial digitization and innovation across Indian courts.</p>
                <button onClick={()=>navigate('/newcase')}>View Cases</button>
            </div>
        </div>
    )
}

export default Home