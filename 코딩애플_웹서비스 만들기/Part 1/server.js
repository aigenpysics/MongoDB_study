// npm init -y 라이브러리 설치를 위한 셋팅
// npm install express 

const express = require(`express`)
const app = express()

//폴더를 등록을 해야 html에서 막 가져다와 쓸 수 있음
app.use(express.static(__dirname + '/public'))
//ejs 셋팅
app.set('view engine', 'ejs')


const { MongoClient } = require('mongodb')

let db
const url = 'mongodb+srv://gimjeongheon38:1004@cluster0.8vxj3uo.mongodb.net/?retryWrites=true&w=majority'
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')
  app.listen(8080, ()=>{
    console.log(`http://localhost:8080 에서 서버 실행 중`)
})
}).catch((err)=>{
  console.log(err)
})

app.get('/', (request, response) =>{
    response.send('반갑다.')
})

app.get('/news', (request, response) =>{
    //db.collection('post').insertOne({title:'테스트'})
    response.send('오늘의 뉴스')
})

app.get('/html', (request, response) =>{
    response.sendFile(__dirname + '/index.html') //__dirname은 현재 경로
})

//nodemon 소스코드가 수정될 떄마다 서버를 다시 실행해주는 프로그램.
//npm install -g nodemon
//npm install mongodb@5 

//npm install ejs

app.get('/list', async(request, response) =>{
    //컬렉션의 모든 doc 출력하는 법.
    //await은 정해진 곳에만 붙힐 수 있다.
    let result = await db.collection('post').find().toArray() //await 실행 다 할떄까지 기달 ㅋㅋ
    //console.log(result)
    //response.send('Show me what you got in DB.') 응답은 1번만 가능.
    response.render('list.ejs', {posts : result})
})

app.get('/time', async(req,res) => {
   res.render('time.ejs', {data : new Date()})
})


//<%- 기능으로 가져옴.
//<%= 문자열로 가져옴.