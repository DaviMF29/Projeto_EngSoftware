import bcrypt from 'bcrypt'
import { loginService, generateToken } from '../services/auth.service.js'

const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await loginService(email)

        if(!user){
            return res.status(404).send({message: "Usuário ou senha inválidos"})
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password)
        
        if(!passwordIsValid) {
            return res.status(400).send({message: "Usuário ou senha inválidos"})
        }
        
        const token = generateToken(user.id)

        res.send({token})

    } catch (err) {
        res.status(500).send(err.message)
    }
}

export { login }
