import Database from 'better-sqlite3'
import { expect } from 'chai'
import sinon from 'sinon'

import { companyGet } from '../../../src/services/company'

// Prepare database.
const db = new Database(':memory:', {})
db.pragma('journal_mode = WAL')
db.exec('CREATE TABLE company (\'companyName\' VARCHAR)')
const statement = db.prepare('INSERT INTO company (companyName) VALUES (?)')
statement.run('Aardvark Limited')
statement.run('Buffalo Corporation')
statement.run('Cat Incorporated')
statement.run('Duck Partnership')

describe('services/company', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('companyGet', () => {
    it('should return a 200 status code on successful data retrieval', async () => {
      const response = await companyGet(db)
      expect(response.statusCode).to.equal(200)
    })

    it('should return a list of companies sorted by companyName', async () => {
      const response = await companyGet(db)
      expect(response.body.length).to.equal(4)
      expect(response.body[0].companyName).to.equal('Aardvark Limited')
      expect(response.body[1].companyName).to.equal('Buffalo Corporation')
      expect(response.body[2].companyName).to.equal('Cat Incorporated')
      expect(response.body[3].companyName).to.equal('Duck Partnership')
    })
  })
})
