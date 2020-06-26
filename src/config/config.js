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

//'mongodb+srv://juli:juli@cluster0-ugleq.mongodb.net/cafe'
 
