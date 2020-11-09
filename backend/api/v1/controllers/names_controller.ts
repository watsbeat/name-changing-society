import moment from 'moment-timezone';
import { db } from '../config/db';

export default new (class Names {
    public async listNamesExpiringWithin28Days(): Promise<any> {
        try {
            // TODO: It's possibly better to select held_to as is and use moment-timezone to format it later
            const oneYearOld = moment().tz('Australia/Brisbane').subtract(1, 'years').format('YYYY-MM-DD');
            const twentyEightDaysFromExpiring = moment.tz('Australia/Brisbane').subtract(1, 'years').subtract(28, 'days').format('YYYY-MM-DD');
            return await db.any(
                `SELECT
                    first_name,
                    middle_name,
                    last_name,
                    TO_CHAR((held_from + interval '1 year'), 'yyyy-mm-dd') AS held_to
                FROM names
                WHERE held_from BETWEEN $1::date AND $2::date`,
                [twentyEightDaysFromExpiring, oneYearOld]
            );
        } catch (err) {
            console.error(err);
            throw new Error(`Error getting names`);
        }
    }
})();
