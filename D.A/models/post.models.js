var db = require('../utils/db');
module.exports = {
    all: () => {
        return db.load('select * from baiviet');
    },
    single: id => {
        return db.load(`select * from baiviet where ProID = ${id}`);
    },
    add: entity => {
        return db.add('baiviet', entity);
    },
    update: (id, entity) => {
        //Thu tu: bang can sua, DK sua la id, entity: nhung cot trong mysql can sua, id la 
        //gia tri id nguoi dung nhap vao
        return db.update('baiviet', 'ProID', entity, id);
    },

    updateUser: entity => {
        var id = entity.ProID;
        delete entity.ProID;
        return db.update('baiviet', 'ProID', entity, id);
    },

    delete: id => {
        return db.delete('baiviet', 'ProID', id);
    },
    // Lấy post mới nhất
    findpost: () => {
        return db.load('SELECT * from baiviet where TinhTrang = 2 order by NgayXuatBan desc limit 10');
    },
    // //lấy post nhiều view nhất
    findview: () => {
        return db.load('SELECT * from baiviet WHERE TinhTrang =2 order by LuotXem desc limit 10');
    },
    // //đếm số lượng views
    countview: () => {
        return db.updateView('UPDATE baiviet SET LuotXem = LuotXem + 1 WHERE ProID = ' + id);
    },
    //Lay bai viet chua dc duyet
    getAllNotApproved: () => {
        return db.load('select * from baiviet where TinhTrang = 1');
    },

    countGetNotApproved: () => {
        return db.load('select count(ProID) from baiviet where TinhTrang = 1');
    },
    updateStatusPost: () => {
        return db.updateDate('update baiviet set TinhTrang = 2 where DATEDIFF(NOW(), date_post) >= 0 and TinhTrang = 1');
    },
    approvedPost: () => {
        return db.load('select * from baiviet where TinhTrang = 2');
    },
    GetPostByUser: () => {
        return db.load('select * from baiviet bv, taikhoan tk where bv.IDUser = tk.ID limit 6');
    },
    countGetPostByUser: () => {
        return db.load('select count(tk.ID) from baiviet bv, taikhoan tk where bv.IDUser = tk.ID');
    }
};