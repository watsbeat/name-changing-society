import moment from 'moment';
import { db } from '../config/db';

export default new (class Users {
    async getUserCurrentName(user_id: number): Promise<any> {
        try {
            // TODO: Set constraint so user can only have a single entry for a given date
            return await db.oneOrNone(
                `SELECT 
                    full_name,
                    TO_CHAR(start_date, 'yyyy-mm-dd') as start_date,
                    TO_CHAR(expiry_date, 'yyyy-mm-dd') as expiry_date
                FROM names
                WHERE user_id = $1 AND current_date BETWEEN start_date AND expiry_date`,
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

    async isUniqueName(name: string) {
        try {
            return await db.none(
                `SELECT * FROM names WHERE full_name = $1 AND current_date BETWEEN start_date AND expiry_date`,
                name
            );
        } catch (err) {
            console.log(err);
            throw new Error(`Make sure it's unique!`);
        }
    }

    async submitNewName(user_id: number, name: string) {
        try {
            if (!user_id) {
                throw new Error('Must be a user!');
            }

            if (typeof name !== 'string') {
                throw new Error('Invalid name');
            }
            // Check for uniqueness
            await this.isUniqueName(name);

            // Check if user has current name and set it to expired
            const currentDate = moment().tz('Australia/Brisbane').format('YYYY-MM-DD');
            const dayBefore = moment().tz('Australia/Brisbane').subtract('1', 'day').format('YYYY-MM-DD');

            const currentName = await db.oneOrNone(
                `SELECT * FROM names WHERE user_id = $1 AND $2 BETWEEN start_date AND expiry_date`,
                [user_id, currentDate]
            );


            // TODO: Set current name to expired - handle this better
            if (currentName) {
                console.log(currentDate, 'expiry date:', currentName.expiry_date)
                const newExpiryDate = (currentDate === currentName.expiry_date) ? currentDate : dayBefore;
                console.log('set to:', newExpiryDate);

                await db.none(
                    `UPDATE names SET expiry_date = $1 WHERE user_id = $2 AND expiry_date = $3`,
                    [newExpiryDate, user_id, currentName.expiry_date]
                );
            }

            const oneYearLater = moment().tz('Australia/Brisbane').add(1, 'year').format('YYYY-MM-DD');
            return await db.none(
                'INSERT INTO names (full_name, user_id, start_date, expiry_date) VALUES ($1, $2, $3, $4)',
                [name, user_id, currentDate, oneYearLater]
            );
        } catch (err) {
            throw new Error(`Failed to create new name. ${err}`);
        }
    }
})();
