import dotenv from 'dotenv';

dotenv.config()



// TYPES

type TConfig = {
  [key: string]: EnvironmentConfig;
};

type EnvironmentConfig = {
    app: AppConfig,
    db: DbConfig
};

type AppConfig = {
    PORT: string | number
};

type DbConfig = {
    URI: string
}



// ENVIRONMENTS - PRODUCTION OR DEVELOPMENT

if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: 'env.production' });
} else {
    dotenv.config({ path: 'env.development '});
}

const ENV = process.env.NODE_ENV ?? 'development';

const CONFIG : TConfig = {
    development: {
        app: {
            PORT: process.env.PORT || 4000
        },
        db: {
            URI: process.env.DATABASE_URI || ''
        }
    },

    production: {
        app: {
            PORT: process.env.PORT || 8080
        },
        db: {
            URI: process.env.DATABASE_URI || ''
        }
    }
}

export default CONFIG[ENV]