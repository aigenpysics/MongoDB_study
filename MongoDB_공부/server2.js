const express = require(`express`)
const app = express()
const { MongoClient,ObjectId } = require('mongodb')

app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
//유저가 보낸 데이터를 req.body에 넣어주는 것을 돕는 코드
app.use(express.json())
app.use(express.urlencoded({extended:true}))

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
    response.send('시작합니다.')
})

app.get('/write', (req, res) =>{
    res.render('write.ejs')
})

//url을 만들고 누르면 get 요청하게 만들기
app.get('/time', async(req,res) => {
  res.render('time.ejs', {data : new Date()})
})

app.post('/add', async(req, res) =>{
  console.log(req.body)
  try{
    if (req.body.title == ''){
      res.send("제목 입력이 되지 않았습니다.")
    }else{
      await db.collection('post').insertOne({title:req.body.title,content:req.body.content
      })
    }
  }catch(e){
    console.log(e)
    res.status(500).send("서버에 에러가 발생하였습니다.")
  }
  res.redirect('/list')
})

app.get('/list', async(request, response) =>{
  let result = await db.collection('post').find().toArray() //await 실행 다 할떄까지 기달 ㅋㅋ
  response.render('list.ejs', {posts : result})
})
//상세페이지 이동.
//URL 파라미터. 비슷한 url을 가진 api를 여러개 만들 필요가 없다.  

//Object ID를 알고 접근하는 경우.
  app.get('/detail/:saying', async(req,res)=>{ //detail/뒤에 아무말이나 치면 해당 api가 실행.
     
    try{
      //req.params.saying //user가 url에 입력한 문자를 가져옴.
      let data = await db.collection('post').findOne({_id : new ObjectId(req.params.saying)})
      if (data == null){
        res.send('이상한 url이 입력되었습니다.')
      }
      else{
        //디버깅용
        //console.log(req.params.saying)
        res.render('detail.ejs',{data : data}) 
      }
    }catch(e){
      console.log(e)
      res.send('이상한 url이 입력되었습니다.')
    }
  })

