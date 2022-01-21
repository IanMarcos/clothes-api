const Product = require('../models/product');

const renovateToken = (req, res) => {
    // const user = req.authUser;
    // const data = {uid: user._id, uName: user.name};
    // //Renueva el token
    // const cvToken = generateJWT(data);
    // res.status(200).json({results: {cvToken, user}});
}

const validatePassword = async(req, res) => {
    // const {password} = req.body;

    // const user = await User.findById(req.authUser);
    // if( !user || !user.active ){
    //     return res.status(401).json({ results:{ err:'En el token no había un usuario válido'} });
    // }

    // if(! await passwordMatch(password, user.password)){
    //     return res.status(400).json( {results: {err:'La contraseña no es válida'} } );
    // }
    
    // const uid = user._id.toString();

    // res.status(200).json( {results: {uid}});

}

const signIn = async(req, res) => {
    
    // const { email, password } = req.body;

    // try {
    //     //Validación de la existencia del correo activo en la DB
    //     const user =  await User.findOne({email});
    //     if( !user || !user.active ){
    //         return res.status(401).json({ results:{ err:'Correo o contraseña invalidos'} });
    //     }
    
    //     //Validación de la contraseña
    //     if(! await passwordMatch(password, user.password)){
    //         return res.status(401).json({ results:{ err:'Correo o contraseña invalidos'} });
    //     }
    
    //     //Generación del JWT
    //     const cvToken = generateJWT({uid: user._id, uName: user.name});

    //     const safeUser = {
    //         _id: user._id,
    //         name: user.name,
    //         email: user.email
    //     }
    //     res.status(200).json({results: {cvToken, user:safeUser} });
        
    // } catch (error) {
    //     res.status(500).json({ results: {err: {error} } });
    // }
}

module.exports = {
    signIn,
    renovateToken,
    validatePassword,
};
