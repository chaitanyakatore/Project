import { createHmac, randomBytes } from "crypto";


export default function generatedHashedPassword(password){
    
    const salt = randomBytes(256).toString("hex");
    const hash = createHmac("sha256", salt).update(password).digest("hex");
    return { salt, password: hash };
}