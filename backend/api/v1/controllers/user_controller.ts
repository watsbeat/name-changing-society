import moment from 'moment';
import { db } from '../config/db';

export default new (class Users {
    async getUserCurrentName(user_id: number): Promise<any> {
        try {
            // TODO: Set constraint so user can only have a single entry for a given date
            return await db.oneOrNone(
                `SELECT 
                    first_name,
                    middle_name,
                    last_name,
                    TO_CHAR(held_from, 'yyyy-mm-dd') as held_from,
                    TO_CHAR(held_to, 'yyyy-mm-dd') as held_to
                FROM names
                WHERE user_id = $1 AND current_date::date BETWEEN held_from AND held_to`,
                user_id
            );
        } catch (err) {
            console.error(err);
            throw new Error(`No current name found user ${user_id}`);
        }
    }

    async getUserHistoricalNames(user_id: number): Promise<any> {
        try {
            return await db.any(
                `
                SELECT 
                    first_name,
                    middle_name,
                    last_name
                    TO_CHAR(start_date, 'yyyy-mm-dd') as held_from,
                    TO_CHAR(expiry_date, 'yyyy-mm-dd') as held_to
                FROM names WHERE user_id = $1 ORDER BY held_to desc`,
                user_id
            );
        } catch (err) {
            console.error(err);
            throw new Error(`Error getting name history for user ${user_id}`);
        }
    }

    /**
     * Ensure the proposed new name hasn't belonged to the user in the past, and no other citizen currently has it.
     * @param name - string
     * @param user_id - number
     */
    async isUniqueName(nameType: string, nameValue: string, user_id: number) {
        try {
            // TODO: check if vulnerable to SQL injection
            const type = nameType;
            await db.none(`SELECT * FROM names WHERE user_id = $1 AND $2 = $3`, [user_id, nameValue, type]);
            return await db.none(
                `SELECT * FROM names WHERE $1 = $2 AND current_date::date BETWEEN held_from AND held_to`,
                [nameValue, nameType]
            );
        } catch (err) {
            console.log(err);
            throw new Error(`Make sure it's unique!`);
        }
    }

    async submitNewName(user_id: number, names: any) {
        try {
            if (!user_id) {
                throw new Error('You must be a user!');
            }

            for (const name in names) {
                if (typeof name !== 'string') {
                    throw new Error('Invalid name.');
                }
                await this.isUniqueName(names[name], name, user_id);
            }

            // Check if user has current name and set it to expired
            const currentDate = moment().tz('Australia/Brisbane').format('YYYY-MM-DD');
            const dayBefore = moment().tz('Australia/Brisbane').subtract('1', 'day').format('YYYY-MM-DD');

            const currentName = await db.oneOrNone(
                `SELECT * FROM names WHERE user_id = $1 AND $2::date BETWEEN held_from AND held_to`,
                [user_id, currentDate]
            );

            // TODO: Set current name to expired - handle this better
            if (currentName) {
                const newEndDate = currentDate === currentName.expiry_date ? currentDate : dayBefore;

                await db.none(`UPDATE names SET held_to = $1 WHERE user_id = $2 AND held_to = $3`, [
                    newEndDate,
                    user_id,
                    currentName.held_from,
                ]);
            }

            const citizen_id = await db.one(`SELECT id FROM citizens WHERE user_id = $1`, user_id);
            const { first_name, middle_name, last_name } = names;
            const oneYearLater = moment().tz('Australia/Brisbane').add(1, 'year').format('YYYY-MM-DD');
            
            return await db.none(
                `INSERT INTO names (
                    first_name,
                    middle_name,
                    last_name,
                    held_from,
                    held_to,
                    citizen_id,
                    user_id
                    )
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [first_name, middle_name, last_name, currentDate, oneYearLater, citizen_id, user_id]
            );
        } catch (err) {
            throw new Error(`Failed to create new name. ${err}`);
        }
    }
})();
