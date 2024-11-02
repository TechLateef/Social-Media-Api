
import  cookieParser from 'cookie-parser'
import helmet  from 'helmet'
import xss  from 'xss'
import  cors from 'cors'
import { urlencoded, json, raw } from 'express'
import  bodyParser from 'body-parser';

/**
 * Registers all custome and external middlewares
 * @param {Express} app The Express app
 */
const middlewaresRegister = (app: any) => {

var corsOptions = {
  origin: "*",
  methods:['GET', 'PUT', 'POST', 'PATCH','DELETE'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}
  app.use(cors(corsOptions))
  app.use(cookieParser())
  app.use(helmet())
//   app.use(xss());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

}

export default middlewaresRegister