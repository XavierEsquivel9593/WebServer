process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

 let URL;
 let x;

 //Palabra Secreta 
process.env.SECRETO =process.env.SECRETO || 'gatitos';

//Tiempo 
process.env.TIEMPO= process.env.TIEMPO || '1hr';

if(process.env.NODE_ENV === 'dev'){
    URL='mongodb://localhost:27017/cafe';
}else{
    URL= process.env.MONGO;
    //URL='mongodb+srv://Xavier:123@cluster0-igcgx.mongodb.net/cafe';
}

process.env.URLDB = URL;

//google
//process.env.CLIENTE_ID =process.env.CLIENTE_ID || '73u1p7w60jtJSsRBOzSnw71R';
process.env.CLIENTE_ID =process.env.CLIENTE_ID || '889830066064-p7f5egmtrt8l80c1r7uut3bj29picpuu.apps.googleusercontent.com';

//'mongodb+srv://juli:juli@cluster0-ugleq.mongodb.net/cafe'
 
