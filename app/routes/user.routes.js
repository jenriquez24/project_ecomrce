const authcontroller = require('../controllers/auth.controller')
const controller = require('../controllers/user.controller')
const {authJwt} = require('../middelwares')

module.exports = function(app){
    app.use(function(req,res,next){
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        )
        next();
    })
    app.get("/api/test/all", controller.allAccess);

    app.get('/api/test/user',[authJwt.verifyToken], controller.userBoard)

    app.get('/api/test/moderator',[authJwt.verifyToken, authJwt.isModerator], controller.moderatorBoard)
    
    app.get('/api/test/admin', [authJwt.verifyToken, authJwt.isAdmin],controller.adminBoard)

 //   app.get('/api/getcart', [authJwt.verifyToken], authcontroller.getShop)



    //app.post('/api/product', controller1.createProducts)
}