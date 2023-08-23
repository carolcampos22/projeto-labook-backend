import { CreatePostOutputDTO } from "../dtos/post/createPost.dto";
import { LikeOrDislikeDB, POST_LIKE, PostsDB, PostsDBWithCreatorName } from "../models/Posts";
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

    public findPostById = async (id: string): Promise<PostsDB | undefined> => {
        const [result] = await BaseDatabase.connection(PostDatabase.TABLE_POSTS).select().where({ id })

        return result as PostsDB | undefined

    }

    public updatePost = async (postDB: PostsDB): Promise<void> => {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS).update(postDB).where({ id: postDB.id })

    }

    public deletePostById = async (id: string): Promise<void> => {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS).delete().where({ id })
    }

    public findPostWithCreatorNameById = async (idToFind: string): Promise<PostsDBWithCreatorName | undefined> => {

        const [result] = await BaseDatabase
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
            .where({[`${PostDatabase.TABLE_POSTS}.id`]: idToFind})

        return result as PostsDBWithCreatorName | undefined
    }

    public findLikeOrDislike = async (likeOrDislikeDB: LikeOrDislikeDB):Promise<POST_LIKE | undefined> => {

        const [result]: Array<LikeOrDislikeDB | undefined> = await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
        .select()
        .where({
            user_id: likeOrDislikeDB.user_id,
            post_id: likeOrDislikeDB.post_id
        })

        if(result === undefined){
            return undefined
        } else if (result.like === 1){
            return POST_LIKE.LIKED
        } else {
            return POST_LIKE.DISLIKED
        }

    }

    public removeLikeOrDislike = async (
        likeOrDislikeDB: LikeOrDislikeDB
    ): Promise<void> => {
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
        .delete()
        .where({
            user_id: likeOrDislikeDB.user_id,
            post_id: likeOrDislikeDB.post_id
        })
    }

    public updateLikeOrDislike = async (likeOrDislikeDB: LikeOrDislikeDB): Promise<void> => {
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
        .update(likeOrDislikeDB)
        .where({
            user_id: likeOrDislikeDB.user_id,
            post_id: likeOrDislikeDB.post_id
        })
    }

    public insertLikeOrDislike = async (likeOrDislikeDB: LikeOrDislikeDB): Promise<void> => {
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
        .insert(likeOrDislikeDB)
        
    }
}   