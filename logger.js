function log(req,res,next){
    console.log('Loggin...');
    next();
}

module.exports = log;

//Adding middleware outside