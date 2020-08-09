var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from taikhoan');
    },

    single: id => {
        // return db.load(`select * from taikhoan where ID = ${id}`);
        return db.load(`select *, day(NgaySinh) as day, month(NgaySinh) as month, year(NgaySinh) as year from taikhoan where ID = ${id}`);
    },

    singleByUserName: userName => {
        return db.load(`select * from taikhoan where NguoiDung = '${userName}'`);
    },

    singleByEmail: email => {
        return db.load(`select * from taikhoan where Email = '${email}'`);
    },

    singleByPass: matkhau => {
        return db.load(`select * from taikhoan where MatKhau = '${matkhau}'`);
    },

    add: entity => {
        return db.add('taikhoan', entity);
    },

    update: (entity, id) => {
        return db.update('taikhoan', 'ID', entity, id);
    },

    updateUser: entity => {
        var id = entity.ID;
        delete entity.ID;
        return db.update('taikhoan', 'ID', entity, id);
    },

    delete: id => {
        return db.delete('taikhoan', 'ID', id);
    },

    confirmEmail: email => {
        return db.load(`select * from taikhoan where Email = '${email}'`);
    }
};