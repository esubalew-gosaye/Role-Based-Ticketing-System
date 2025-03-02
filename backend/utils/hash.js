import bcrypt  from "bcryptjs"
import { createHmac } from 'crypto'

export const contentHash = async (content, salt) => {
    return await bcrypt.hash(content, salt)
}

export const compareHashedContent = async (content, hashedContent) =>{
    return await bcrypt.compare(content, hashedContent)
}

export const hashCode = (content, key) => {
    return createHmac('sha256', key).update(content).digest('hex')
}