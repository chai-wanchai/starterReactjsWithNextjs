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
      type: 'mysql',
      host: config.mysql.host,
      port: config.mysql.port,
      username: config.mysql.username,
      password: config.mysql.password,
      database: config.mysql.database,
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