//const authcontroller = require('../controllers/auth.controller')
const userController = require('../controllers/auth.controller');
const {verifySignUp} = require('../middelwares');
const {authJwt} = require('../middelwares');
const control = require('../controllers/user.controller');



module.exports = function(app){

    app.use(function(req,res,next){
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        )
        next();
    })

    app.post("/api/auth/signup",[
        verifySignUp.checkDuplicateUsernameOrEmail, 
        verifySignUp.checkRolesExited],
    userController.signup)

    app.post('/api/auth/signin', userController.signin);

    app.post('/api/auth/signout', userController.signout);

    app.post('/api/product',[authJwt.verifyToken, authJwt.isAdmin],userController.createProducts);

    app.put('/api/updateprod',[authJwt.verifyToken, authJwt.isAdmin] ,userController.updateProduct);

    app.delete('/api/deleteprod',[authJwt.verifyToken, authJwt.isAdmin],userController.deleteProducts);

    app.post('/api/addshopp',authJwt.verifyToken, userController.addproductCart);

    app.post('/api/createcupon',[authJwt.verifyToken, authJwt.isAdmin],userController.createCupon);
}