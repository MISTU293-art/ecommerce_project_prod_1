import app from './app.js';

const PORT=process.env.PORT;

if(!PORT){
    console.log(`Port Missing In .env ${PORT}`)
}

app.listen(PORT,()=>{
    console.log(`Server Run On http://localhost:${PORT}`)
})