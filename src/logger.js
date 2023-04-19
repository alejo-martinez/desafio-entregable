import winston from 'winston';
import config from './config/config.js';

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'blue',
        warning: 'yellow',
        info: 'white',
        http: 'green',
        debug: 'white'
    }
}

const loger = (param) =>{
    if (param[0] === 'development') {
        const logger = winston.createLogger({
            levels: customLevelOptions.levels,
        
            transports: [
                new winston.transports.Console({
                level: 'debug', 
                format: winston.format.combine(
                    winston.format.colorize({colors: customLevelOptions.colors}),
                    winston.format.simple()
                )
            })
            ]
        })
        return logger
    } 
    else if (param[0] === 'production') {
        const logger = winston.createLogger({
            levels: customLevelOptions.levels,
            transports: [
                new winston.transports.Console({
                    level: 'info', 
                    format: winston.format.combine(
                        winston.format.colorize({colors: customLevelOptions.colors}),
                        winston.format.simple()
                    )
                }),
                new winston.transports.File({
                    filename: './errors.log',
                    level: 'error',
                    format: winston.format.simple()
                })
            ]
        })
        return logger
    }

}

export const addLogger = (req, res, next) =>{
    req.logger = loger(config.mode);
    // req.logger.error('Error')
    next();
}