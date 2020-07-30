var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select *, DAY(ThoiHan) AS day, MONTH(ThoiHan) AS month, YEAR(ThoiHan) AS year from docgia');
    },

    single: id => {
        return db.load(`
            select *, DAY(ThoiHan) AS day, MONTH(ThoiHan) AS month, YEAR(ThoiHan) AS year 
            from docgia where ID = ${id}
        `);
    },

    add: entity => {
        return db.add('docgia', entity);
    },

    // update: entity => {
    //     var id = entity.ID;
    //     delete entity.ID;
    //     return db.update('docgia', 'ID', entity, id);
    // },

    update: (entity, id) => {
        return db.update('docgia', 'ID', entity, id);
    },

    delete: id => {
        return db.delete('docgia', 'ID', id)
    }

};