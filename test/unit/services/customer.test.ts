import Database from 'better-sqlite3'
import { expect } from 'chai'
import sinon from 'sinon'

import { customerGet } from '../../../src/services/customer'

// Prepare database.
const db = new Database(':memory:', {})
db.pragma('journal_mode = WAL')
db.exec('CREATE TABLE customer (\'firstName\' VARCHAR, \'lastName\' VARCHAR, \'companyName\' VARCHAR)')
const statement = db.prepare('INSERT INTO customer (firstName, lastName, companyName) VALUES (?, ?, ?)')
statement.run('Alan', 'Dunham', 'Aardvark Limited')
statement.run('Alan', 'Chapman', 'Cat Incorporated')
statement.run('Bob', 'Benson', 'Duck Partnership')
statement.run('Charles', 'Atkins', 'Buffalo Corporation')
statement.run('Dennis', 'Atkins', 'Buffalo Corporation')

describe('services/customer', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('customerGet', () => {
    it('should return a 200 status code on successful data retrieval', async () => {
      const response = await customerGet(db, '', '')
      expect(response.statusCode).to.equal(200)
    })

    it('with no filter should return a complete list of customers', async () => {
      const response = await customerGet(db, '', '')
      expect(response.body.length).to.equal(5)
      expect(response.body[0].firstName).to.equal('Alan')
      expect(response.body[0].lastName).to.equal('Chapman')
      expect(response.body[0].companyName).to.equal('Cat Incorporated')
      expect(response.body[1].firstName).to.equal('Alan')
      expect(response.body[1].lastName).to.equal('Dunham')
      expect(response.body[1].companyName).to.equal('Aardvark Limited')
      expect(response.body[2].firstName).to.equal('Bob')
      expect(response.body[2].lastName).to.equal('Benson')
      expect(response.body[2].companyName).to.equal('Duck Partnership')
      expect(response.body[3].firstName).to.equal('Charles')
      expect(response.body[3].lastName).to.equal('Atkins')
      expect(response.body[3].companyName).to.equal('Buffalo Corporation')
      expect(response.body[4].firstName).to.equal('Dennis')
      expect(response.body[4].lastName).to.equal('Atkins')
      expect(response.body[4].companyName).to.equal('Buffalo Corporation')
    })

    it('with a companyName filter should return a list of customers with that company name', async () => {
      const response = await customerGet(db, 'companyName|Buffalo Corporation', '')
      expect(response.body.length).to.equal(2)
      expect(response.body[0].firstName).to.equal('Charles')
      expect(response.body[0].lastName).to.equal('Atkins')
      expect(response.body[0].companyName).to.equal('Buffalo Corporation')
      expect(response.body[1].firstName).to.equal('Dennis')
      expect(response.body[1].lastName).to.equal('Atkins')
      expect(response.body[1].companyName).to.equal('Buffalo Corporation')
    })

    it('with a lowercase companyname filter should return a list of customers with that company name', async () => {
      const response = await customerGet(db, 'companyname|Buffalo Corporation', '')
      expect(response.body.length).to.equal(2)
      expect(response.body[0].firstName).to.equal('Charles')
      expect(response.body[0].lastName).to.equal('Atkins')
      expect(response.body[0].companyName).to.equal('Buffalo Corporation')
      expect(response.body[1].firstName).to.equal('Dennis')
      expect(response.body[1].lastName).to.equal('Atkins')
      expect(response.body[1].companyName).to.equal('Buffalo Corporation')
    })

    it('with an uppercase COMPANYNAME filter should return a list of customers with that company name', async () => {
      const response = await customerGet(db, 'COMPANYNAME|Buffalo Corporation', '')
      expect(response.body.length).to.equal(2)
      expect(response.body[0].firstName).to.equal('Charles')
      expect(response.body[0].lastName).to.equal('Atkins')
      expect(response.body[0].companyName).to.equal('Buffalo Corporation')
      expect(response.body[1].firstName).to.equal('Dennis')
      expect(response.body[1].lastName).to.equal('Atkins')
      expect(response.body[1].companyName).to.equal('Buffalo Corporation')
    })

    it('with no sort should return a list of customers sorted by firstName asc, lastName asc', async () => {
      const response = await customerGet(db, '', '')
      expect(response.body[0].firstName).to.equal('Alan')
      expect(response.body[0].lastName).to.equal('Chapman')
      expect(response.body[0].companyName).to.equal('Cat Incorporated')
      expect(response.body[1].firstName).to.equal('Alan')
      expect(response.body[1].lastName).to.equal('Dunham')
      expect(response.body[1].companyName).to.equal('Aardvark Limited')
      expect(response.body[2].firstName).to.equal('Bob')
      expect(response.body[2].lastName).to.equal('Benson')
      expect(response.body[2].companyName).to.equal('Duck Partnership')
      expect(response.body[3].firstName).to.equal('Charles')
      expect(response.body[3].lastName).to.equal('Atkins')
      expect(response.body[3].companyName).to.equal('Buffalo Corporation')
      expect(response.body[4].firstName).to.equal('Dennis')
      expect(response.body[4].lastName).to.equal('Atkins')
      expect(response.body[4].companyName).to.equal('Buffalo Corporation')
    })

    it('with firstName asc sort should return a list of customers sorted by firstName asc, lastName asc', async () => {
      const response = await customerGet(db, '', 'firstName|asc')
      expect(response.body[0].firstName).to.equal('Alan')
      expect(response.body[0].lastName).to.equal('Chapman')
      expect(response.body[0].companyName).to.equal('Cat Incorporated')
      expect(response.body[1].firstName).to.equal('Alan')
      expect(response.body[1].lastName).to.equal('Dunham')
      expect(response.body[1].companyName).to.equal('Aardvark Limited')
      expect(response.body[2].firstName).to.equal('Bob')
      expect(response.body[2].lastName).to.equal('Benson')
      expect(response.body[2].companyName).to.equal('Duck Partnership')
      expect(response.body[3].firstName).to.equal('Charles')
      expect(response.body[3].lastName).to.equal('Atkins')
      expect(response.body[3].companyName).to.equal('Buffalo Corporation')
      expect(response.body[4].firstName).to.equal('Dennis')
      expect(response.body[4].lastName).to.equal('Atkins')
      expect(response.body[4].companyName).to.equal('Buffalo Corporation')
    })

    it('with firstName desc sort should return a list of customers sorted by firstName desc, lastName desc', async () => {
      const response = await customerGet(db, '', 'firstName|desc')
      expect(response.body[0].firstName).to.equal('Dennis')
      expect(response.body[0].lastName).to.equal('Atkins')
      expect(response.body[0].companyName).to.equal('Buffalo Corporation')
      expect(response.body[1].firstName).to.equal('Charles')
      expect(response.body[1].lastName).to.equal('Atkins')
      expect(response.body[1].companyName).to.equal('Buffalo Corporation')
      expect(response.body[2].firstName).to.equal('Bob')
      expect(response.body[2].lastName).to.equal('Benson')
      expect(response.body[2].companyName).to.equal('Duck Partnership')
      expect(response.body[3].firstName).to.equal('Alan')
      expect(response.body[3].lastName).to.equal('Dunham')
      expect(response.body[3].companyName).to.equal('Aardvark Limited')
      expect(response.body[4].firstName).to.equal('Alan')
      expect(response.body[4].lastName).to.equal('Chapman')
      expect(response.body[4].companyName).to.equal('Cat Incorporated')
    })

    it('with lastName asc sort should return a list of customers sorted by lastName asc, firstName asc', async () => {
      const response = await customerGet(db, '', 'lastName|asc')
      expect(response.body[0].firstName).to.equal('Charles')
      expect(response.body[0].lastName).to.equal('Atkins')
      expect(response.body[0].companyName).to.equal('Buffalo Corporation')
      expect(response.body[1].firstName).to.equal('Dennis')
      expect(response.body[1].lastName).to.equal('Atkins')
      expect(response.body[1].companyName).to.equal('Buffalo Corporation')
      expect(response.body[2].firstName).to.equal('Bob')
      expect(response.body[2].lastName).to.equal('Benson')
      expect(response.body[2].companyName).to.equal('Duck Partnership')
      expect(response.body[3].firstName).to.equal('Alan')
      expect(response.body[3].lastName).to.equal('Chapman')
      expect(response.body[3].companyName).to.equal('Cat Incorporated')
      expect(response.body[4].firstName).to.equal('Alan')
      expect(response.body[4].lastName).to.equal('Dunham')
      expect(response.body[4].companyName).to.equal('Aardvark Limited')
    })

    it('with lastName desc sort should return a list of customers sorted by lastName desc, firstName desc', async () => {
      const response = await customerGet(db, '', 'lastName|desc')
      expect(response.body[0].firstName).to.equal('Alan')
      expect(response.body[0].lastName).to.equal('Dunham')
      expect(response.body[0].companyName).to.equal('Aardvark Limited')
      expect(response.body[1].firstName).to.equal('Alan')
      expect(response.body[1].lastName).to.equal('Chapman')
      expect(response.body[1].companyName).to.equal('Cat Incorporated')
      expect(response.body[2].firstName).to.equal('Bob')
      expect(response.body[2].lastName).to.equal('Benson')
      expect(response.body[2].companyName).to.equal('Duck Partnership')
      expect(response.body[3].firstName).to.equal('Dennis')
      expect(response.body[3].lastName).to.equal('Atkins')
      expect(response.body[3].companyName).to.equal('Buffalo Corporation')
      expect(response.body[4].firstName).to.equal('Charles')
      expect(response.body[4].lastName).to.equal('Atkins')
      expect(response.body[4].companyName).to.equal('Buffalo Corporation')
    })

    it('with companyName asc sort should return a list of customers sorted by companyName asc firstName asc, lastName asc', async () => {
      const response = await customerGet(db, '', 'companyName|asc')
      expect(response.body[0].firstName).to.equal('Alan')
      expect(response.body[0].lastName).to.equal('Dunham')
      expect(response.body[0].companyName).to.equal('Aardvark Limited')
      expect(response.body[1].firstName).to.equal('Charles')
      expect(response.body[1].lastName).to.equal('Atkins')
      expect(response.body[1].companyName).to.equal('Buffalo Corporation')
      expect(response.body[2].firstName).to.equal('Dennis')
      expect(response.body[2].lastName).to.equal('Atkins')
      expect(response.body[2].companyName).to.equal('Buffalo Corporation')
      expect(response.body[3].firstName).to.equal('Alan')
      expect(response.body[3].lastName).to.equal('Chapman')
      expect(response.body[3].companyName).to.equal('Cat Incorporated')
      expect(response.body[4].firstName).to.equal('Bob')
      expect(response.body[4].lastName).to.equal('Benson')
      expect(response.body[4].companyName).to.equal('Duck Partnership')
    })

    it('with companyName desc sort should return a list of customers sorted by companyName desc firstName desc, lastName desc', async () => {
      const response = await customerGet(db, '', 'companyName|desc')
      expect(response.body[0].firstName).to.equal('Bob')
      expect(response.body[0].lastName).to.equal('Benson')
      expect(response.body[0].companyName).to.equal('Duck Partnership')
      expect(response.body[1].firstName).to.equal('Alan')
      expect(response.body[1].lastName).to.equal('Chapman')
      expect(response.body[1].companyName).to.equal('Cat Incorporated')
      expect(response.body[2].firstName).to.equal('Dennis')
      expect(response.body[2].lastName).to.equal('Atkins')
      expect(response.body[2].companyName).to.equal('Buffalo Corporation')
      expect(response.body[3].firstName).to.equal('Charles')
      expect(response.body[3].lastName).to.equal('Atkins')
      expect(response.body[3].companyName).to.equal('Buffalo Corporation')
      expect(response.body[4].firstName).to.equal('Alan')
      expect(response.body[4].lastName).to.equal('Dunham')
      expect(response.body[4].companyName).to.equal('Aardvark Limited')
    })

    it('with all lowercase companyname desc sort should return a list of customers sorted by companyName desc firstName desc, lastName desc', async () => {
      const response = await customerGet(db, '', 'companyname|desc')
      expect(response.body[0].firstName).to.equal('Bob')
      expect(response.body[0].lastName).to.equal('Benson')
      expect(response.body[0].companyName).to.equal('Duck Partnership')
      expect(response.body[1].firstName).to.equal('Alan')
      expect(response.body[1].lastName).to.equal('Chapman')
      expect(response.body[1].companyName).to.equal('Cat Incorporated')
      expect(response.body[2].firstName).to.equal('Dennis')
      expect(response.body[2].lastName).to.equal('Atkins')
      expect(response.body[2].companyName).to.equal('Buffalo Corporation')
      expect(response.body[3].firstName).to.equal('Charles')
      expect(response.body[3].lastName).to.equal('Atkins')
      expect(response.body[3].companyName).to.equal('Buffalo Corporation')
      expect(response.body[4].firstName).to.equal('Alan')
      expect(response.body[4].lastName).to.equal('Dunham')
      expect(response.body[4].companyName).to.equal('Aardvark Limited')
    })

    it('with all uppercase COMPANYNAME DESC sort should return a list of customers sorted by companyName desc firstName desc, lastName desc', async () => {
      const response = await customerGet(db, '', 'COMPANYNAME|DESC')
      expect(response.body[0].firstName).to.equal('Bob')
      expect(response.body[0].lastName).to.equal('Benson')
      expect(response.body[0].companyName).to.equal('Duck Partnership')
      expect(response.body[1].firstName).to.equal('Alan')
      expect(response.body[1].lastName).to.equal('Chapman')
      expect(response.body[1].companyName).to.equal('Cat Incorporated')
      expect(response.body[2].firstName).to.equal('Dennis')
      expect(response.body[2].lastName).to.equal('Atkins')
      expect(response.body[2].companyName).to.equal('Buffalo Corporation')
      expect(response.body[3].firstName).to.equal('Charles')
      expect(response.body[3].lastName).to.equal('Atkins')
      expect(response.body[3].companyName).to.equal('Buffalo Corporation')
      expect(response.body[4].firstName).to.equal('Alan')
      expect(response.body[4].lastName).to.equal('Dunham')
      expect(response.body[4].companyName).to.equal('Aardvark Limited')
    })
  })
})