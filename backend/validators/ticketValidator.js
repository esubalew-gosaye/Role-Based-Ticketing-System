import joi from "joi";

const createTicketSchema = joi.object({
    title: joi.string().min(4).required(),
    description: joi.string().min(8).max(300).required()
})

export default {
    createTicketSchema
};