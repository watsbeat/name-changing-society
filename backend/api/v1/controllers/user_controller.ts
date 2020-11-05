import moment from 'moment';
import { db } from '../config/db';

export default new (class Users {
    async getUserCurrentName(user_id: number): Promise<any> {
        try {
            // TODO: set constraint so user can only have a single entry for a given date
            return await db.one(
                'SELECT * FROM names WHERE user_id = $1 AND current_date BETWEEN start_date AND expiry_date',
                user_id
            );
        } catch (err) {
            console.error(err);
            throw new Error(`Error getting current name for user ${user_id}`);
        }
    }

    async getUserHistoricalNames(user_id: number): Promise<any> {
        try {
            return await db.any(
                `
                SELECT 
                    full_name,
                    TO_CHAR(start_date, 'yyyy-mm-dd') as start_date,
                    TO_CHAR(expiry_date, 'yyyy-mm-dd') as expiry_date
                FROM names WHERE user_id = $1 ORDER BY expiry_date desc`,
                user_id
            );
        } catch (err) {
            console.error(err);
            throw new Error(`Error getting name history for user ${user_id}`);
        }
    }

    async submitNewName(user_id: number, name: string) {
        try {
            // TODO: user_id or citizen_id cannot be null
            // Check for uniqueness
            await db.none(
                `SELECT * FROM names WHERE full_name = $1 AND current_date BETWEEN start_date AND expiry_date`,
                name
            );
            const currentDate = moment().tz('Australia/Brisbane').format('YYYY-MM-DD');
            const oneYearLater = moment().tz('Australia/Brisbane').add(1, 'year').format('YYYY-MM-DD');
            return await db.none(
                'INSERT INTO names (full_name, user_id, start_date, expiry_date) VALUES ($1, $2, $3, $4)',
                [name, user_id, currentDate, oneYearLater]
            );
        } catch (err) {
            console.error(err);
            throw new Error(`Error submitting new name. Make sure it's unique!`);
        }
    }
})();
