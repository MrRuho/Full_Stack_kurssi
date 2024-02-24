const express = require('express')

module.exports = {
  getRequest: () => express.req,
  getResponse: () => express.res,
}