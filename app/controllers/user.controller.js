exports.allAccess=(req,res)=>{
    res.status(200).send("Contenido Publico")
}

exports.userBoard=(req,res)=>{
    res.status(200).send("Contenido del USer")
}

exports.moderatorBoard=(req,res)=>{
    res.status(200).send("Contenido del moderador")
}

exports.adminBoard=(req,res)=>{
    res.status(200).send("Contenido del Admin")
}

