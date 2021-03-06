//===================
// Puerto
//===================
process.env.PORT = process.env.PORT || 3000;

//===================
// Entorno
//===================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===================
// Vencimiento del Token
//===================
//60 segundos
//60 minutos
//24 horas
//30 días
process.env.CADUCIDAD_TOKEN = '48h';

//===================
// SEED de autenticación 
//===================
process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'este-es-el-seed-desarrollo';

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;

//===================
// Google Client ID
//===================
process.env.CLIENT_ID = process.env.CLIENT_ID || '130424088309-70uk1qht1c5if1v4quh93tknlek48ksj.apps.googleusercontent.com'