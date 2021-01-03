import config from '../../config';
import { createConnection, ConnectionOptions, Connection } from 'typeorm';
var pg = require('pg');
pg.defaults.ssl = true;
export interface DBInterface {
  connection: any;
}
export class Database {
 
  public async getConnection() {
    const connection = await createConnection(this.getOption())
    return connection
  }
  public getOption() {
    const options: ConnectionOptions = {
      type: config.database.database,
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.database,
      entities: [
        process.env.PWD+ '/server/models/*.ts'
      ],
      extra: {
        options: {
          encrypt: true
        },
        max: 20 /* Number of max pool */
      },
      logging: false,
      synchronize: true
    };
    return options;
  }

}

const db = new Database()
export default db