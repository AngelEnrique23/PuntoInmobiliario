import  express  from "express";
import { formularioLogin, formularioRegistro, formularioResetpsswd, confirmar, registrar, ressetPassword } from "../controllers/usuarioController.js";
const router = express.Router();


router.get('/login', formularioLogin )
router.get('/registro', formularioRegistro)
router.post('/registro', registrar)
router.get('/confirmar:token', confirmar)
router.get('/password-reset', formularioResetpsswd)
router.post('/password-reset', ressetPassword)
export default router;