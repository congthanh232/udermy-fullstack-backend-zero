const connection = require('../config/database')


let user =[];
const getHomepage = (req,res)=> {

    connection. query(
'select * from Users u',
function (err, results, fields) {
user = results;
console.log("»>>results= ", results);
console.log(">>check user:",results);
res.send(JSON.stringify(user))
}
);
}

const getABC = (req,res)=> {
    res.send('Check abc')
}

const getHoiDanIT = (req,res) => {
    res.render('sample.ejs')
}

module.exports = {
    getHomepage,
    getABC,
    getHoiDanIT
}