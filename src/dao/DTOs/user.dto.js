import { createHash } from "../../utils.js";

export default class UserDTO {
    constructor(user) {
        this.name = user.name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.password = createHash(user.password)
    }
}