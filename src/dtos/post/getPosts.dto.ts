import { z } from "zod";
import { PostsModel } from "../../models/Posts";

export interface GetPostsInputDTO {
    token: string
}

export type GetPostsOutputDTO = PostsModel[]

export const GetPostsSchema = z.object({
    token: z.string().min(1)
}).transform(data => data as GetPostsInputDTO)