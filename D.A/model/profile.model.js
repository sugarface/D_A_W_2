var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from taikhoan');
    },

    allWithDetails: () => {
        return db.load(`
      select c.*, count(p.ProID) as num_of_products
      from categories c left join products p on c.CatID = p.CatID
      group by c.CatID, c.CatName
    `);
    },

    single: id => {
        return db.load(`select * from taikhoan where ID = ${id}`);
    },

    /**
     * @param {*} entity { CatName: ... }
     */

    /**
     * @param {*} entity { CatID, CatName }
     */
    update: entity => {
        var id = entity.CatID;
        delete entity.CatID;
        return db.update('taikhoan', 'ID', entity, id);
    },

};