const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = db.user;
const Role = db.role;
const products = db.products;
const cart = db.shoppingcart;
const Cupon = db.cupon;


exports.signup = (req, res) => {
  try {
    let password = bcrypt.hashSync(req.body.password, 8);

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: password,
    });
    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (req.body.roles) {
        Role.find(
          {
            name: { $in: req.body.roles },
          },
          (err, roles) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            user.roles = roles.map((role) => role._id);
            user.save((err) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
              res.send({ message: "Usuario Creado Correctamente" });
            });
          }
        );
      } else {
        Role.findOne({ name: "user" }, (err, role) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          console.log(role);
          user.roles = [role._id];
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: "Usuario Creado Correctamente" });
          });
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

exports.signin = (req, res) => {
  User.findOne({ username: req.body.username }).populate("roles", "__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        res.status(404).send({ message: "Usuario no encontrado" });
        return;
      }
      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        res.status(401).send({ message: "Password Invalido" });
        return;
      }
      const token = jwt.sign({ id: user.id }, process.env.jwtSecret, {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400,
      });
      let authorities = [];
      for (let index = 0; index < user.roles.length; index++) {
        const element = user.roles[index];
        authorities.push(element);
      }
      req.session.token = token;
      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        roles: authorities,
      });
    });
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    res.status(200).send({ message: "Tu session ha terminado" });
  } catch (error) {
    this.next(error);
  }
};

exports.createProducts = async (req, res) => {
  try {

    
    
   const { id, nombre, descripcion, precio, categoria, stock} = req.body;
    const ProductExist = await products.findOne({ id: id });
    if (ProductExist) {
      return res.status(400).send
      
      ({ message: "Producto ya se encuentra registrado" });
    }
    //Crear un nuevo producto

    const newproducts = new products({id, nombre, descripcion, precio, categoria, stock});
    await newproducts.save();
    res.status(200).send({ message: "Producto agregado correctamente" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

exports.updateProduct = async (req, res) => {

  try {
        const { id,nombre, descripcion,precio,categoria, stock } = req.body;
        const userId = req.userId; // Obtener el ID del usuario del token

      // Buscar el producto por su identity
      const product = await products.findOne({ id: id });
        if (!product) {
              return res.status(404).send({ message: "Producto no existe en la base de datos" });
      }

      // Actualizar el precio del 
      product.id = id;
      product.nombre = nombre;
      product.descripcion = descripcion;
      product.precio = precio;
      product.categoria = categoria;
      product.stock = stock;

      await product.save();

        res.status(200).send({ message: "Se actualizaron datos de producto", product });
      } catch (err) {
        console.log(err);
          res.status(500).send({ err });
  }
}

exports.deleteProducts= async (req, res) => {
  try {
    const { id } = req.body;
    const product = await products.findOne({ id: id });
    if (!product) {
      return res.status(404).send({ message: "Este producto no se encuentra registrado" });
    }
    await product.remove();
    res.status(200).send({ message: "Articulo anulado correctamente" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
}

exports.addproductCart = async (req, res) => {
  try {
      const { id, precio,cantidad,total } = req.body;
      const userId = req.userId; // id del usuario
    
      const product = await products.findOne({ id: id }); // obtener producto por su ID
      if (!product) {
          return res.status(404).send({ message: "Producto no encontrado" });
      }
      const newCart = new cart({id, precio,cantidad,total, userId});
      await newCart.save();
      res.status(200).send({message:"Producto agregado al carrito",userId})
       }  catch (err){
        console.log(userId);
        res.status(500).send({ message: err });
      }

};


// exports.getShop = async (req, res) => {
//   try {
//     const userId = req.userId; // Obtener el ID del usuario del token
//     const cart = await cart.findOne({ userId: userId }).populate('items.productId');
//     if (!cart) {
//       return res.status(404).send({ message: "Carrito no encontrado" });
//     }
//     res.status(200).send(cart);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({ message: err});
//   }
// }

exports.createCupon = async (req, res) => {
  try {
      const { id, Name, descuento, estado } = req.body;
      const ExistCupon = await Cupon.findOne({ id: id });
      if (ExistCupon) {
        return res.status(400).send
        
        ({ message: "Cupon ya se encuentra ingresado" });
      }

      const newCupon = new Cupon({ // crear cupon
          id,
          Name,
          descuento,
          estado
      });

      await newCupon.save();
        res.status(201).send({ message: "Se creó cupón exitosamente" });
  }   catch (err) {
       console.error("Error al crear el cupón:", err);
        return res.status(500).send({ message: "Error al crear el cupón" });
  }
};