export default class customError {
    static createError({name, cause, message, code}) {
        const error = new Error();
        error.name = name;
        error.code = code;
        error.cause = cause;
        error.message = message
        throw error;
    }
}