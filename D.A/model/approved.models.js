var db = require('../utils/db');
module.exports = {
    allApproved : ()=>{
        return db.load('select * from baiviet');
    },
    single: id => {       
    return db.load( `select TinhTrang from baiviet where ProID = ${id}`);
    },
    add : entity => {
    return db.add('baiviet', entity);
    }
};