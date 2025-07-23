import dotenv from 'dotenv';

dotenv.config()

const NODE_ENV = process.env.NODE_ENV || 'development'; 

if (NODE_ENV === 'production'){
    dotenv.config({ path: '.env.production' })
} 


// TYPES

type TConfig = {
  [key: string]: EnvironmentConfig;
};

type AppConfig = {
    PORT: number
};

type DbConfig = {
    url: string
};

type EnvironmentConfig = {
    app: AppConfig,
    db: DbConfig
};


const config : TConfig = {
    development: {
        app: {
            PORT: Number(process.env.PORT) || 4000
        },
        db: {
            url: process.env.DATABASE_URL || ''
        }
    },

    production: {
        app: {
            PORT: Number(process.env.PORT) || 8080
        },
        db: {
            url: process.env.DATABASE_URL || ''
        }
    }
}

export default config[NODE_ENV]