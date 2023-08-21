import { CreatePostOutputDTO } from "../dtos/post/createPost.dto";
import { PostsDB, PostsDBWithCreatorName } from "../models/Posts";
import { BaseDatabase } from "./Basedatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes"

    public insertPost = async (postDB: PostsDB): Promise<void> => {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS).insert(postDB)

        const output: CreatePostOutputDTO = undefined

        return output
    }

    public getPostWithCreatorName = async (): Promise<PostsDBWithCreatorName[]> => {

        const result: PostsDBWithCreatorName[] = await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .select(
            `${PostDatabase.TABLE_POSTS}.id`,
            `${PostDatabase.TABLE_POSTS}.creator_id`,
            `${PostDatabase.TABLE_POSTS}.content`,
            `${PostDatabase.TABLE_POSTS}.likes`,
            `${PostDatabase.TABLE_POSTS}.dislikes`,
            `${PostDatabase.TABLE_POSTS}.created_at`,
            `${PostDatabase.TABLE_POSTS}.updated_at`,
            `${UserDatabase.TABLE_USERS}.name as creator_name`
        )
        .join(`${UserDatabase.TABLE_USERS}`, 
            `${PostDatabase.TABLE_POSTS}.creator_id`, 
            "=", 
            `${UserDatabase.TABLE_USERS}.id`
        )

        return result
    }
}