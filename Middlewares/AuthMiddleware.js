import jwt from 'jsonwebtoken'
import  sql  from '../db/neon.js';
const Clave = 'ME ECHE DESARROLLO WEB Y MOVIL';
export const Auth = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.cookies.Seguridad, Clave)
        if (decoded) {
            req.user = decoded
            return next();
        }
    } catch (error) {
        return res.redirect('/Error');
    }
}
export const adminMiddleware = (req,res,next) =>{
    try {
        const decoded = jwt.verify(req.cookies.Seguridad, Clave)
        if (decoded) {
            req.user = decoded
            const admin =req.user.admin;
            if(admin){
                return next();
            }
            return res.render('ErrorA')
        }
    } catch (error) {
        return res.redirect('/Error');
    }
   
}
