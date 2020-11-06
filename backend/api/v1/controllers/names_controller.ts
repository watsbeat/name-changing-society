import moment from 'moment-timezone';
import { db } from '../config/db';

export default new (class Names {
    public async listNamesExpiringWithin28Days(): Promise<any> {
        try {
            // TODO: It's possibly better to select held_to as is and use moment-timezone to format it later
            const currentDate = moment().tz('Australia/Brisbane').format('YYYY-MM-DD');
            const twentyEightDaysFromToday = moment().tz('Australia/Brisbane').add(28, 'days').format('YYYY-MM-DD');
            return await db.any(
                `SELECT 
                    first_name,
                    middle_name,
                    last_name,
                    TO_CHAR(held_to, 'yyyy-mm-dd') AS held_to
                FROM names
                WHERE held_to BETWEEN $1 AND $2`,
                [currentDate, twentyEightDaysFromToday]
            );
        } catch (err) {
            console.error(err);
            throw new Error(`Error getting names`);
        }
    }
})();
