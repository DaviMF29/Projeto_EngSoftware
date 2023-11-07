const jwt = require("jsonwebtoken");
require("dotenv").config();

function checkToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) return res.status(401).json({ msg: "Acesso negado!" });
  
    try {
      const secret = process.env.SECRET;
  
      jwt.verify(token, secret);
  
      next();
    } catch (err) {
      res.status(400).json({ msg: "O Token é inválido!" });
    }
  }

const verifyTokenAuth = (req, res, next) => {
    verifyToken(req, res, ()=> {
        const userId = parseInt(req.user.id);
        const paramsId = parseInt(req.params.id);
        if(userId === paramsId || req.user.is_admin){
            next();
        } else {
            return res.status(200).json({
                Status: "Não é possível executar essa ação"
            })
        }
    })
};

const verifyTokenAdmin = (req, res, next) => {
    verifyToken(req, res, ()=> {
        if(req.user.is_admin){
            next();
        } else {
            return res.status(200).json({
                Status: "Não é possível executar essa ação"
            })
        }
    })
};

const verifyTokenScientist = (req, res, next) => {
    verifyToken(req, res, ()=> {
        if(req.user.is_admin){
            next();
        } else {
            return res.status(200).json({
                Status: "Não é possível executar essa ação"
            })
        }
    })
};

module.exports = { checkToken, verifyTokenAuth, verifyTokenAdmin, verifyTokenScientist  };