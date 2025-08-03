const express=require('express')
const app=express()
const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Karthick@spidy',
  database: 'courtcases'
});
const cors=require('cors')
const router=express.Router()
const bodyparser=require('body-parser')
const fetchCaseData = require('./scraper');
const path = require('path');
const getCaptchaFromCourt = require('./captcha');


app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/captcha.png', express.static(path.join(__dirname, 'public', 'captcha.png')));
app.use(router)

router.post('/save-case', (req, res) => {
  const {
    case_no, cnr_no, date_of_filing, date_of_registration,
    status, dealing_assistant, filing_advocate, petitioner, respondent
  } = req.body;

  const query = `
    INSERT INTO cases (
      case_no, cnr_no, date_of_filing, date_of_registration, status,
      dealing_assistant, filing_advocate, petitioner, respondent
    ) VALUES (?, ?, STR_TO_DATE(?, '%d-%b-%Y'), STR_TO_DATE(?, '%d-%b-%Y'), ?, ?, ?, ?, ?)
  `;

  const values = [
    case_no, cnr_no, date_of_filing, date_of_registration,
    status, dealing_assistant, filing_advocate, petitioner, respondent
  ];

  db.query(query, values, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Case saved', case_id: results.insertId });
  });
});

router.get('/getcaptcha', async (req, res) => {
     console.log("this path is working")
    try {
      const captchaText = await getCaptchaFromCourt();
      res.send({ captcha: captchaText });
      console.log("this path is working")
      console.log(captchaText)
    } catch (error) {
      res.status(500).send({ error: 'Failed to fetch CAPTCHA', details: error.message });
    }
  });
router.post('/casesubmit',async(req,res)=>{
      
      console.log(req.body)
      const { caseNumber, caseType, filingYear,captchaText}=req.body
      try{
       let result=await fetchCaseData({caseNumber, caseType, filingYear,captchaText})
       console.log({messages:result})
       res.send({messages:result})
       
      
      }
      catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Internal Server Error', details: err.message });
      }
})

app.listen(3000,()=>{
    console.log("server started successfully")
})