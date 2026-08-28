import { Inject, Injectable } from "@nestjs/common";
import { Pool } from 'pg';

@Injectable()
export class UserRepository { 
    constructor (@Inject('PG_POOL') private readonly pool : Pool){}
    async findByEmail(email:string){
        const sql = `
            SELECT *
            FROM users
            WHERE email = $1;
        `
        const result = await this.pool.query(sql,[email]);
        return result.rows[0] ?? null;
    };

    async createAccount(email:string , password:string, display_name:string){
        const sql = `
            INSERT INTO users (email, password_hash, display_name)
            VALUES ($1,$2,$3)
            RETURNING user_id, email, display_name, created_at;
        `
        const result =  await this.pool.query(sql,[email, password, display_name])
        return result.rows[0]
    };
}