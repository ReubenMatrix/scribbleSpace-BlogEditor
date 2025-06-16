import * as z from "zod";

const formSchema = z.object({
  text: z.string().min(1, {
    message: "Post content is required.",
  }),
  image: z.any().optional(),
});

export type FormSchema = z.infer<typeof formSchema>;
export { formSchema };