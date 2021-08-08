const jsonwebtoken = require('jsonwebtoken')

//autenticação de usuário
exports.Auth = async (request, response, next) => {
  const authToken = request.headers.authorization;

  if(!authToken){
    return response.status(401).send()
  }

  const [, token] = authToken.split(" ");

  jsonwebtoken.verify(token, "2582cf5038bbd26c8bbf359a25de52e7", (err, data) => {
    if (err) {
      return response.status(401).send()
    } else {
      request.user = data
      return next()
    }
  })
}

//autenticação de administrador 
exports.AuthAdmin = async (request, response, next) => {
  const authToken = request.headers.authorization;

  if(!authToken){
    return response.status(401).send()
  }

  const [, token] = authToken.split(" ");

  jsonwebtoken.verify(token, "2582cf5038bbd26c8bbf359a25de52e7", (err, data) => {
    if (err || data.role != 'true') {
      return response.status(401).send()
    } else {
      request.user = data
      return next()
    }
  })
}
