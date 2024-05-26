import { faker } from '@faker-js/faker'
import type Database from 'better-sqlite3'

import { type Company } from '../models/company'

faker.seed(1)

export const createTables = (db: Database.Database): void => {
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
      const randomInt = Math.floor(Math.random() * 20)
      statement.run(faker.person.firstName(), faker.person.lastName(), companyNames[randomInt])
    }
  }
}
