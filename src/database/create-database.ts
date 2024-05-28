import { faker } from '@faker-js/faker'
import Database from 'better-sqlite3'

import { type Company } from '../models/company'

faker.seed(1)

export const createDatabase = (): Database.Database => {
  const db = new Database(':memory:', {})
  db.pragma('journal_mode = WAL')

  db.exec('CREATE TABLE company (\'companyName\' VARCHAR)')

  {
    const statement = db.prepare('INSERT INTO company (companyName) VALUES (?)')
    for (let i = 0; i < 20; i++) {
      statement.run(faker.company.name())
    }
  }

  const companyNames: string[] = []
  const companies = db.prepare('SELECT * FROM company ORDER BY companyName').all() as Company[]
  companies.forEach((company) => {
    companyNames.push(company.companyName)
  })

  db.exec('CREATE TABLE customer (\'firstName\' VARCHAR, \'lastName\' VARCHAR, \'companyName\' VARCHAR)')

  {
    const statement = db.prepare('INSERT INTO customer (firstName, lastName, companyName) VALUES (?, ?, ?)')
    for (let i = 0; i < 100; i++) {
      const firstName = faker.person.firstName()
      const lastName = faker.person.lastName()
      statement.run(firstName, lastName, companyNames[stringToNumber(firstName + '~~' + lastName)])
    }
  }

  return db
}

const stringToNumber = (str: string): number => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash + str.charCodeAt(i)) % 20
  }
  return hash
}
