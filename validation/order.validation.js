import zod from 'zod';

const Order = zod.object({
    orderDetails:zod.array(zod.object({
        gencode:zod.number(),
        shcode:zod.number(),
        ccode:zod.number(),
        orders:zod.array(zod.object({
            grName:zod.string(),
            quantity:zod.number()
        })),
        orm:zod.string()
    }))
})

export const validationOrder = async(data) =>{
    const result = await Order.safeParseAsync(data)
    return result;
}