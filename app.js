const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path'); // path 모듈 추가
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors());

// MySQL 연결 정보 설정
const connection = mysql.createConnection({
    host: '',
    user: 'root',
    password: 'Alskdjp',
    database: 'event1'
});

// MySQL 연결
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

// Body Parser 미들웨어 사용
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // JSON 파싱 활성화

// public 디렉토리를 정적 파일 루트 디렉토리로 설정
app.use(express.static(path.join(__dirname, 'public')));

// 이벤트 신청 폼 제출 처리
app.post('/submit-form', (req, res) => {
    console.log(req.body);
    const { name, age, gender, tel } = req.body;

    // MySQL에 데이터 저장
    const sql = 'INSERT INTO user (name, age, gender, tel) VALUES (?, ?, ?, ?)';
    connection.query(sql, [name, age, gender, tel], (err, result) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            res.status(500).json({ message: '이벤트 신청 실패' });
        } else {
            console.log('Data inserted into MySQL');
            res.status(200).json({ message: '이벤트 신청 성공' });
        }
    });
});

// 데이터 조회
app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM user';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data from MySQL:', err);
            res.status(500).json({ message: '데이터 조회 실패' });
        } else {
            res.status(200).json(results);
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
