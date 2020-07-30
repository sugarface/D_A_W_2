var db = require('../utils/db');
var config = require('../config/default.json');

module.exports = {
    all: () => {
        return db.load('select * from baiviet');
    },

    // top 10 bài viết mới nhất
    latestNews: () => {
        return db.load(`
            SELECT bv.*, con.*, DAY(bv.NgayDang) AS day, MONTH(bv.NgayDang) AS month, YEAR(bv.NgayDang) AS year  
            FROM baiviet bv JOIN chuyenmuccon con ON bv.ChuyenMucConID = con.ID            
            ORDER BY bv.NgayDang desc LIMIT 0,10
        `);
    },

    // top 10 chuyên mục, mỗi chuyên mục 1 bài mới nhất
    latestNewsCat: () => {
        return db.load(`
            SELECT bv.*, con.*, DAY(bv.NgayDang) AS day, MONTH(bv.NgayDang) AS month, YEAR(bv.NgayDang) AS year  
            FROM baiviet bv JOIN chuyenmuccon con ON bv.ChuyenMucConID = con.ID
            GROUP BY bv.ChuyenMucConID 
            ORDER BY bv.NgayDang desc LIMIT 0,10
        `);
    },

    // 10 bài viết được xem nhiều nhất
    latestViews: () => {
        return db.load(`
            SELECT bv.*, con.*, DAY(bv.NgayDang) AS day, MONTH(bv.NgayDang) AS month, YEAR(bv.NgayDang) AS year  
            FROM baiviet bv JOIN chuyenmuccon con ON bv.ChuyenMucConID = con.ID
            GROUP BY bv.LuotXem
            ORDER BY bv.LuotXem desc LIMIT 0,10
        `);
    },

    // 4 bài viết nổi bật trong tuần
    popularNews: () => {
        return db.load(`
            SELECT bv.*, con.*, DAY(bv.NgayDang) AS day, MONTH(bv.NgayDang) AS month, YEAR(bv.NgayDang) AS year 
            FROM baiviet bv JOIN chuyenmuccon con ON bv.ChuyenMucConID = con.ID
            WHERE DATEDIFF(NOW(), bv.NgayDang) <= 7
            GROUP BY DAY(bv.NgayDang) LIMIT 4
        `);
    },

    // 5 bài viết cùng chuyên mục
    sameCat: () => {
        return db.load(`
            SELECT bv.*, con.*, DAY(bv.NgayDang) AS day, MONTH(bv.NgayDang) AS month, YEAR(bv.NgayDang) AS year  
            FROM baiviet bv JOIN chuyenmuccon con ON bv.ChuyenMucConID = con.ID            
            ORDER BY bv.NgayDang desc LIMIT 0,5
        `);
    },


    // // xem danh sách bài viết
    // allByCat: CatId => {
    //     return db.load(`
    //         SELECT bv.*, con.*, DAY(bv.NgayDang) as day, MONTH(bv.NgayDang) AS month, YEAR(bv.NgayDang) AS year
    //         FROM baiviet bv JOIN chuyenmuccon con 
    //         ON bv.ChuyenMucConID = con.ID AND bv.ChuyenMucConID = ${CatId} 
    //     `);
    // },

    // đếm tổng số tag bài viết
    countByTag: tagId => {
        return db.load(`select count(*) as total from baiviet where TagID = ${tagId}`);
    },

    // phân trang
    pageByTag: (tagId, start_offset) => {
        var lim = config.paginate.default;
        return db.load(`
            select bv.*, t.*, DAY(bv.NgayDang) as day, MONTH(bv.NgayDang) AS month, YEAR(bv.NgayDang) AS year 
            from baiviet bv, tag t
            where bv.TagID = t.TagID
            and bv.TagID = ${tagId} limit ${lim} offset ${start_offset}
        `);
    },

    // đếm tổng số danh mục bài viết
    countByCat: catId => {
        return db.load(`select count(*) as total from baiviet where ChuyenMucConID = ${catId}`);
    },

    // phân trang
    pageByCat: (catId, start_offset) => {
        var lim = config.paginate.default;
        return db.load(`
            select bv.*, con.*, DAY(bv.NgayDang) as day, MONTH(bv.NgayDang) AS month, YEAR(bv.NgayDang) AS year 
            from baiviet bv, chuyenmuccon con
            where bv.ChuyenMucConID = con.ID and ChuyenMucConID = ${catId} limit ${lim} offset ${start_offset}
        `);
    },

    // tìm kiếm full-text search
    seachFullText: key => {
        return db.load(`
            SELECT *, DAY(NgayDang) as day, MONTH(NgayDang) AS month, YEAR(NgayDang) AS year 
            FROM baiviet
            WHERE MATCH(TieuDe, NDTomTat, NoiDung) AGAINST('${key}') limit 5
        `);
    },

    // danh sách bình luận
    allComment: () => {
        return db.load(`
            SELECT dg.*, DAY(dg.NgayBinhLuan) AS day, MONTH(dg.NgayBinhLuan) AS month, YEAR(dg.NgayBinhLuan) AS year 
            FROM docgia dg
        `);
    },

    single: id => {
        return db.load(`
            SELECT bv.*, con.*, DAY(bv.NgayDang) AS day, MONTH(bv.NgayDang) AS month, YEAR(bv.NgayDang) AS year 
            FROM baiviet bv JOIN chuyenmuccon con ON bv.ChuyenMucConID = con.ID
            WHERE ProID = ${id}
        `);
    },

    add: entity => {
        return db.add('baiviet', entity);
    },

    update: entity => {
        var id = entity.ProID;
        delete entity.ProID;
        return db.update('baiviet', 'ProID', entity, id);
    },

    delete: id => {
        return db.delete('baiviet', 'ProID', id)
    }

};