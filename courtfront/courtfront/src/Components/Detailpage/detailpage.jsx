import { useSelector } from "react-redux";
import { useEffect } from "react";
import './detailpage.css'


function Detailshow() {
    const data = useSelector((state) => state.details)
    const data1 = data[0].messages
   useEffect(() => {
    (async () => {
      const response = await fetch('http://localhost:3000/save-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data1)
      });

      const result = await response.json();
      console.log(result);
    })();
  }, [data1]); 
    console.log(data1)
    return (
        <div className="top1">
            <h1>Case Details</h1>
            <div className="det-1">
                <p><span className="head1">Case No:</span> {data1.case_no}</p>
                <p><span className="head1">CNR No:</span> {data1.cnr_no}</p>
                <p><span className="head1">Date of Filing:</span> {data1.date_of_filing}</p>
                <p><span className="head1">Date of Registration:</span> {data1.date_of_registration}</p>
                <p><span className="head1">Status:</span> {data1.status}</p>
                <p><span className="head1">Petitioner:</span> {data1.petitioner}</p>
                <p><span className="head1">Respondent:</span> {data1.respondent}</p>
                <p><span className="head1">Filing Advocate:</span> {data1.filing_advocate}</p>
                <p><span className="head1">Dealing Assistant:</span> {data1.dealing_assistant}</p>
            </div>
              <div>
      <h2>Listing Details</h2>
      <table border="1" cellPadding="8" cellSpacing="0" width="100%">
        <thead style={{ backgroundColor: '#2b6cb0', color: '#fff' }}>
          <tr>
            <th>S.No</th>
            <th>Date</th>
            <th>Listing Info</th>
            <th>Court No</th>
          
            <th>PDF</th>
          </tr>
        </thead>
        <tbody className="row1">
          {data1.listing_details.map((item, index) => (
            <tr key={index}>
              <td>{item.serial_no}</td>
              <td>{item.date}</td>
              <td>{item.listing_details}</td>
              <td>{item.court_number}</td>
             
              <td>
                <a className="ref1" href={item.pdf_url} target="_blank" rel="noopener noreferrer">
                  View PDF
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>


        </div>
    )
}

export default Detailshow