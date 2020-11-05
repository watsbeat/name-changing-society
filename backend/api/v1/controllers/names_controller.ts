import moment from 'moment-timezone';
import { db } from '../config/db';

export default new (class Names {
    public async listNamesExpiringWithin28Days(): Promise<any> {
        try {
            const currentDate = moment().tz('Australia/Brisbane').format('YYYY-MM-DD');
            const twentyEightDaysFromToday = moment().tz('Australia/Brisbane').add(28, 'days').format('YYYY-MM-DD');
            // TODO: It's probably better to get exiry_date as a timestamp and use moment-timezone to format it later
            return await db.any(
                `SELECT full_name, TO_CHAR(expiry_date, 'yyyy-mm-dd') AS expiry_date FROM names WHERE expiry_date BETWEEN $1 AND $2`,
                [currentDate, twentyEightDaysFromToday]
            );
        } catch (err) {
            console.error(err);
            throw new Error(`Error getting names`);
        }
    }
})();
