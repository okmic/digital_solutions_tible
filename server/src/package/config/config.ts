import { config } from "dotenv"

if(process.env.MODE === "development_docker") {    
} else {
    config()
}
const valueOrError = (value: any): string  => {
    if(!value) throw new Error('Invalid env value')
    return value as string
}
export default {
    PORT: Number(valueOrError(process.env.PORT)),
    ME_URL: valueOrError(process.env.ME_URL),
    MONGODB_URI: valueOrError(process.env.MONGODB_URI),
    DB_NAME: valueOrError(process.env.MONGO_DB_NAME),
}
