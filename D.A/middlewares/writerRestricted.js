module.exports = (req,res,next)=>{
    if(!req.user){
        var retUrl = req.originalUrl;
        return res.redirect(`/account/login?retUrl=${retUrl}`);
    }
    if(req.user.PhanQuyen !== '2' && req.user.PhanQuyen !== '1'){
        return res.redirect('/404');
    }
    next();
}