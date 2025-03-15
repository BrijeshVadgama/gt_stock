import { z } from "zod";

const ordCartSchema = z.object({
  gencode: z.number().positive("Gencode must be a positive integer"),
  shcode: z.number().positive("Shcode must be a positive integer"),
  ccode: z.number().positive("Ccode must be a positive integer"),
  orders: z.array(
      z.object({
          grName: z.string().min(1, "Group Name is required"),
          quantity: z.number().positive("Quantity must be a positive integer"),
      })
  ).nonempty("Orders array cannot be empty"),
  orm: z.string().min(1, "ORM is required"),
  user_id: z.string().min(1, "User ID is required"),
});


export const validationOrderCart = async(data) =>{
    const result = await ordCartSchema.safeParseAsync(data)
    return result;
}