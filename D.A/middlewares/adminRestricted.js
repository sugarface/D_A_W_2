module.exports = (req,res,next)=>{
    if(!req.user){
        var retUrl = req.originalUrl;
        return res.redirect(`/account/login?retUrl=${retUrl}`);
    }
    var user = req.user;
    if(req.user.PhanQuyen !== '1'){
        return res.redirect('/404');
    }
    next();
}