import { Inject, Injectable ,  } from "@nestjs/common";
import {PoolClient, Pool} from 'pg';

@Injectable()
export class GroupRepository{
    constructor(@Inject('PG_POOL') private pool : Pool ){}
    async createGroup(client:PoolClient,groupname:string , user_id :string){
        const sql = `
            INSERT INTO groups(display_name , created_by)
            VALUES($1,$2)
            RETURNING group_id , display_name , created_by , created_at; 
        `
        const result = await client.query(sql,[groupname,user_id]);
        return result.rows[0];
    }
    async addMember(client:PoolClient,group_id :string , user_id : string){
        const sql = `
            INSERT INTO group_members(group_id, user_id)
            VALUES($1,$2)
            RETURNING group_id , user_id;
        `
        const result = await client.query(sql,[group_id,user_id]);
        return result.rows[0];
    }    
    async showMember(group_id:string){
        const sql = `
            SELECT email, users.display_name
            FROM group_members gm 
            JOIN users ON gm.user_id = users.user_id
            WHERE gm.group_id = $1;
        `
        const result = await this.pool.query(sql,[group_id]);
        return result.rows;
    }
    async findGroup(group_id:string){
        const sql =`
            SELECT *
            FROM groups
            where group_id = $1;
        `
        const result = await this.pool.query(sql,[group_id])
        return result.rows[0]??null;
    }

    async inviteMember(group_id:string, user_id:string){
        const sql = `
            INSERT INTO group_members(group_id, user_id)
            VALUES ($1, $2)
            RETURNING *; 
        `
        const result = await this.pool.query(sql,[group_id,user_id]);
        return result.rows[0]
    }

    async checkSameUser(group_id:string, user_id:string){
        const sql = `
            SELECT *
            FROM group_members
            WHERE group_id = $1 and user_id = $2;
        `
        const result = await this.pool.query(sql,[group_id,user_id]);
        return result.rows[0] ?? null
    }
}