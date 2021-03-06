import { Server } from 'http'
import { logger } from '../common/Logging'
import { ExpressConfig } from "./Express";
import { DatabaseConfig } from "./Database";
import { DocumentConfig } from './Document';
import { env } from "../config/Environment"


export class Application {
  server: Server;
  express: ExpressConfig;
  connection: DatabaseConfig;
  constructor() {
    this.app()
  }

  /**
   * jestでのテスト時に使用する
   * @returns Express
   */
  public async app() {
    try {
      this.connection = await new DatabaseConfig()
      this.express = await new ExpressConfig()
      await new DocumentConfig(this.express.app)
      const port: number = await env.PORT
      const host: string = await env.HOST
      this.server = await this.express.app.listen(port, host, () => {
        logger.info(`Server ready at http://${host}:${port}`)
        logger.info(`OpenAPI --> http://${host}:${port}/doc`)
      })
      return await this.server
    } catch(e) {
      console.log(e)
    }
  }
}