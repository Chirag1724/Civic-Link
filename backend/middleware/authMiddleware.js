const jwt = require('jsonwebtoken');
module.exports = function(req,res,next){
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({ error:'No token' });
  const token = auth.split(' ')[1];
  try{
    const data = jwt.verify(token, process.env.JWT_SECRET || 'dev');
    req.user = { id: data.id, role: data.role, name: data.name };
    next();
  }catch(err){ res.status(401).json({ error:'Invalid token' }); }
};
