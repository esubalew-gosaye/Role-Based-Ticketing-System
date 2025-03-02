import joi from "joi";

const signupSchema = joi.object(
    {
        email: joi.string().email().required(),
        role: joi.string(),
        password: joi.string().min(4).max(20).required(),
    },
    {
        abortEarly: false,
    }
)

const loginSchema = joi.object(
    {
        email: joi.string().email().required(),
        password: joi.string().min(4).max(20).required(),
    },
    {
        abortEarly: false,
    }
)

const acceptCodeSchema = joi.object(
    {
        email: joi.string().email().required(),
        code: joi.number().required(),
    }
)

const changePasswordSchema = joi.object({
    currentPassword: joi.string().min(4).max(20).required(),
    newPassword: joi.string().min(4).max(20).required(),
})

const verifyForgotPasswordCodeSchema = joi.object({
    email: joi.string().email().required(),
    code: joi.string().min(4).max(10).required(),
    newPassword: joi.string().min(4).max(20).required(),
})

export default {
    signupSchema,
    loginSchema,
    acceptCodeSchema,
    changePasswordSchema,
    verifyForgotPasswordCodeSchema,
} 