const express = require('express')
const router = express.Router()

module.exports = () => {
  const routerSignUp = new SingUpRouter()
  router.post('/signup', ExpressRouterAdapter.adapt(routerSignUp))
}

class ExpressRouterAdapter {
  static adapter (router) {
    return async (req, res) => {
      const httpRequest = {
        body: req.body
      }
      const httpResponse = await router.route(httpRequest)
      res.status(httpResponse.status).json(httpResponse.body)
    }
  }
}

// Presentation
// singup-router
class SingUpRouter {
  async route (httpRequest) {
    const { email, password, repeatPassword } = httpRequest.body
    const user = new SingUpUseCase().singup(email, password, repeatPassword)
    return {
      statusCode: 200,
      body: user
    }
  }
}

// Domain
// signup-usecase
class SingUpUseCase {
  async signUp (email, password, repeatPassword) {
    if (password === repeatPassword) {
      new AddAccountRepository().add(email, password)
    }
  }
}

// Infra
// add-account-repository
const mongoose = require('mongoose')
const AccountModel = mongoose.model('Account')

class AddAccountRepository {
  async add (email, password) {
    const user = await AccountModel.create({ email, password })
    return user
  }
}
