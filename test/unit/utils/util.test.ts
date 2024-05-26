import chai, { expect } from 'chai'
import deepEqualInAnyOrder from 'deep-equal-in-any-order'
import sinon from 'sinon'

import { type Response } from 'express'
import { jsonc } from 'jsonc'
import { formatResponse, formatResponseMessage, returnResponse } from '../../../src/utils/util'

chai.use(deepEqualInAnyOrder)

describe('utils/util', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('formatResponse', () => {
    it('should return a ResponseInfo object with the given statusCode and body', () => {
      const statusCode = 200
      const body = { message: 'Success' }
      const expectedResponse = {
        statusCode: 200,
        body: { message: 'Success' }
      }

      const result = formatResponse(statusCode, body)

      expect(result).to.deep.equalInAnyOrder(expectedResponse)
    })

    it('should work with any valid statusCode and body object', () => {
      const statusCode = 404
      const body = { error: 'Not Found' }
      const expectedResponse = {
        statusCode: 404,
        body: { error: 'Not Found' }
      }

      const result = formatResponse(statusCode, body)

      expect(result).to.deep.equalInAnyOrder(expectedResponse)
    })

    it('should handle empty body object', () => {
      const statusCode = 200
      const body = {}
      const expectedResponse = {
        statusCode: 200,
        body: {}
      }

      const result = formatResponse(statusCode, body)

      expect(result).to.deep.equalInAnyOrder(expectedResponse)
    })
  })

  describe('formatResponseMessage', () => {
    it('should return a ResponseInfo object with the given status code and message', () => {
      const statusCode = 200
      const message = 'Success'
      const expectedResponse = {
        statusCode: 200,
        body: { message: 'Success' }
      }

      const result = formatResponseMessage(statusCode, message)

      expect(result).to.deep.equalInAnyOrder(expectedResponse)
    })

    it('should include the message in the body of the ResponseInfo object', () => {
      const statusCode = 200
      const message = 'Success'

      const result = formatResponseMessage(statusCode, message)

      expect(result.body.message).to.equal('Success')
    })

    it('should return a ResponseInfo object with a message containing special characters', () => {
      const statusCode = 200
      const message = 'Special characters: !@#$%^&*()'
      const expectedResponse = {
        statusCode: 200,
        body: { message: 'Special characters: !@#$%^&*()' }
      }

      const result = formatResponseMessage(statusCode, message)

      expect(result).to.deep.equalInAnyOrder(expectedResponse)
    })

    it('should return a ResponseInfo object with a message containing unicode characters', () => {
      const statusCode = 200
      const message = 'Unicode characters: 😊🌍'
      const expectedResponse = {
        statusCode: 200,
        body: { message: 'Unicode characters: 😊🌍' }
      }

      const result = formatResponseMessage(statusCode, message)

      expect(result).to.deep.equalInAnyOrder(expectedResponse)
    })
  })

  describe('returnResponse', () => {
    it('should initiate an Express response with the provided status code and body', () => {
      const res = {
        status: sinon.stub().returnsThis(),
        set: sinon.stub().returnsThis(),
        send: sinon.stub()
      }
      const statusCode = 200
      const body = { message: 'Success' }

      returnResponse(res as unknown as Response, statusCode, body)

      sinon.assert.calledWith(res.status, statusCode)
      sinon.assert.calledWith(res.set, 'Content-Type', 'application/json')
      sinon.assert.calledWith(res.send, jsonc.stringify(body))
    })
  })
})
