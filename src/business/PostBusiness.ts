import { PostDatabase } from "../database/PostDatabase";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/post/createPost.dto";
import { DeletePostInputDTO, DeletePostOutputDTO } from "../dtos/post/deletePost.dto";
import { EditPostInputDTO, EditPostOutputDTO } from "../dtos/post/editPost.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/post/getPosts.dto";
import { LikeOrDislikePostInputDTO, LikeOrDislikePostOutputDTO } from "../dtos/post/likeOrDislikePost.dto";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { LikeOrDislikeDB, POST_LIKE, Post } from "../models/Posts";
import { USER_ROLES } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) {}

    public createPost = async (input: CreatePostInputDTO): Promise <CreatePostOutputDTO> => {
        const {content, token} = input

        const payload = this.tokenManager.getPayload(token)

        if(!payload){
            throw new UnauthorizedError()
        }

        const id = this.idGenerator.generate()

        const post = new Post(
            id,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            payload.id,
            payload.name
        )


        await this.postDatabase.insertPost(post.toDBModel())
    }

    public getPost = async (input: GetPostsInputDTO):  Promise<GetPostsOutputDTO> => {
        const {token} = input

        const payload = this.tokenManager.getPayload(token)

        if(!payload){
            throw new UnauthorizedError()
        }

        const postsDBWithCreatorName = await this.postDatabase.getPostWithCreatorName()

        const posts = postsDBWithCreatorName.map((postCreatorName) => {
            const post = new Post(
                postCreatorName.id,
                postCreatorName.content,
                postCreatorName.likes,
                postCreatorName.dislikes,
                postCreatorName.created_at,
                postCreatorName.updated_at,
                postCreatorName.creator_id,
                postCreatorName.creator_name
            )

            return post.toBusinessModel()
        })

        const output: GetPostsOutputDTO = posts

        return output
    }

    public editPost = async (input: EditPostInputDTO): Promise <EditPostOutputDTO> => {
        const {content, token, idToEdit} = input

        const payload = this.tokenManager.getPayload(token)

        if(!payload){
            throw new UnauthorizedError()
        }

        const postDB = await this.postDatabase.findPostById(idToEdit)

        if (!postDB) {
            throw new NotFoundError("ID de post não encontrada")
        }

        if (payload.id !== postDB.creator_id){
            throw new ForbiddenError("Somente quem criou o post pode editá-lo")
        }

        const post = new Post(
            postDB.id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at,
            postDB.creator_id,
            payload.name
        )

        post.setContent(content)

        const updatedPostdDB = post.toDBModel()

        await this.postDatabase.updatePost(updatedPostdDB)
        const output: EditPostOutputDTO = undefined  
        
        return output
    }

    public deletePost = async (input: DeletePostInputDTO): Promise <DeletePostOutputDTO> => {
        const {token, idToDelete} = input

        const payload = this.tokenManager.getPayload(token)

        if(!payload){
            throw new UnauthorizedError()
        }

        const postDB = await this.postDatabase.findPostById(idToDelete)

        if (!postDB) {
            throw new NotFoundError("ID de post não encontrada")
        }

        if (payload.role !== USER_ROLES.ADMIN){
            if (payload.id !== postDB.creator_id){
                throw new ForbiddenError("Somente quem criou o post pode editá-lo")
            }
        }



        await this.postDatabase.deletePostById(idToDelete)
        const output: DeletePostOutputDTO = undefined  
        
        return output
    }
    
    public likeOrDislikePost = async (input: LikeOrDislikePostInputDTO): Promise <LikeOrDislikePostOutputDTO> => {
        const {token, like, postId} = input

        const payload = this.tokenManager.getPayload(token)

        if(!payload){
            throw new UnauthorizedError()
        }

        const postDBWithCreatorName = await this.postDatabase.findPostWithCreatorNameById(postId)

        if(!postDBWithCreatorName){
            throw new NotFoundError("ID de playlist não encontrada")
        }

        const post = new Post(
            postDBWithCreatorName.id,
            postDBWithCreatorName.content,
            postDBWithCreatorName.likes,
            postDBWithCreatorName.dislikes,
            postDBWithCreatorName.created_at,
            postDBWithCreatorName.updated_at,
            postDBWithCreatorName.creator_id,
            postDBWithCreatorName.creator_name
        )


        const likeOrDislikeDB: LikeOrDislikeDB = {
            user_id: payload.id,
            post_id: postId,
            like: like ? 1 : 0

        }

        const likeOrDislikeExists = await this.postDatabase.findLikeOrDislike(likeOrDislikeDB)

        if (likeOrDislikeExists === POST_LIKE.LIKED){
            if(like){
                await this.postDatabase.removeLikeOrDislike(likeOrDislikeDB)
                post.removeLike()
            } else {
                await this.postDatabase.updateLikeOrDislike(likeOrDislikeDB)
                post.removeLike()
                post.addDislike()
            }
        } else if (likeOrDislikeExists === POST_LIKE.DISLIKED) {
            if(!like){
                await this.postDatabase.removeLikeOrDislike(likeOrDislikeDB)
                post.removeDislike()
            } else {
                await this.postDatabase.updateLikeOrDislike(likeOrDislikeDB)
                post.removeDislike()
                post.addLike()
            }
        } else {
            await this.postDatabase.insertLikeOrDislike(likeOrDislikeDB)

            like ? post.addLike() : post.addDislike()
        }

        const updatedPostDB = post.toDBModel()
        await this.postDatabase.updatePost(updatedPostDB)

        const output: LikeOrDislikePostOutputDTO = undefined

        return output
    }
}