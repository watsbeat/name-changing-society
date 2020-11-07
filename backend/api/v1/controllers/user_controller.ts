import moment from 'moment';
import bcrypt from 'bcrypt';
import { db } from '../config/db';

export default new (class Users {
    /**
     * Check the db to see if a user with those registration details already exists
     * @param userDetails - the details the user submitted at signup
     */
    getUser = async (userDetails: any): Promise<any> => {
        try {
            const { username, email } = userDetails;
            return await db.oneOrNone('SELECT * FROM users WHERE username = $1 AND email = $2', [username, email]);
        } catch (err) {
            console.error(err);
            throw new Error('Error getting user.');
        }
    };

    /**
     * Create a new user in users db table with a hashed password
     * @param userDetails - the details the user submitted at signup
     */
    createNewUser = async (userDetails: any) => {
        try {
            const { username, email, password } = userDetails;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Remove null constraint for citizen_id from users - or get citizen id to add, or remove citizen_id col
            await db.none('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [
                username,
                email,
                hashedPassword,
            ]);
        } catch (err) {
            console.error(err);
            throw new Error('Failed to create new user in db.');
        }
    };

    /**
     * Create an entry for the user_id in the citizens table
     * @param userIdToAdd - the user_id to add
     */
    addUserToCitizensList = async (userIdToAdd: number) => {
        try {
            // TODO: Check to see if user is already has a citizen listing - future feat, assume they don't for now.
            await db.none(`INSERT INTO citizens (user_id) VALUES (${userIdToAdd})`);
        } catch (err) {
            console.error(err);
            throw new Error('Failed to add user to citizens list.');
        }
    };

    /**
     * Gets the name currently held by the user
     * @param citizen_id - the user to retrieve the current name for
     */
    async getUserCurrentName(citizen_id: number): Promise<any> {
        try {
            // TODO: Set constraint so user can only have a single entry for a given date
            // * Add another field to filter by to flag which name is active/not "retired"
            return await db.oneOrNone(
                `SELECT 
                    first_name,
                    middle_name,
                    last_name,
                    TO_CHAR(held_from, 'yyyy-mm-dd') as held_from,
                    TO_CHAR(held_to, 'yyyy-mm-dd') as held_to
                FROM names
                WHERE citizen_id = $1 AND current_date::date BETWEEN held_from AND held_to
                ORDER BY held_from, held_to`,
                citizen_id
            );
        } catch (err) {
            console.error(err);
            throw new Error(`No current name found user ${citizen_id}`);
        }
    }

    /**
     * Gets all the names that have been held be the user, historical and current
     * @param user_id - the user to retrieve name history for
     */
    async getUserHistoricalNames(user_id: number): Promise<any> {
        try {
            // TODO: Extract getCitizenIdForUser function
            const citizen_id = await db.one(`SELECT id FROM citizens WHERE user_id = $1`, user_id);
            return await db.any(
                `
                SELECT 
                    first_name,
                    middle_name,
                    last_name,
                    TO_CHAR(held_from, 'yyyy-mm-dd') as held_from,
                    TO_CHAR(held_to, 'yyyy-mm-dd') as held_to
                FROM names WHERE citizen_id = $1 ORDER BY held_to desc`,
                citizen_id.id
            );
        } catch (err) {
            console.error(err);
            throw new Error(`Error getting name history for user ${user_id}`);
        }
    }

    /**
     * Ensure the proposed new name hasn't belonged to the user in the past,
     * and no other citizen currently holds the name.
     * @param name - string
     * @param nameValue - string
     * @param citizenId - number
     */
    async isUniqueName(nameType: string, nameValue: string, citizenId: number) {
        try {
            await db.none(`SELECT * FROM names WHERE citizen_id = $1 AND ${nameType} = $2`, [citizenId, nameValue]);
            await db.none(
                `SELECT * FROM names WHERE ${nameType} = $1 AND current_date::date BETWEEN held_from AND held_to`,
                [nameValue]
            );
            return true;
        } catch (err) {
            throw new Error(`Make sure it's unique!`);
        }
    }

    /**
     * Creates a new full name for the user in the database
     * @param user_id - the id of the user to create the new name for
     * @param names - the first, middle, and last names to create
     */
    async submitNewName(user_id: number, names: any) {
        try {
            const { first_name, middle_name, last_name } = names;
            const citizen_id = await db.one(`SELECT id FROM citizens WHERE user_id = $1`, user_id);

            if (!user_id) {
                throw new Error('You must be a user!');
            }

            for (const [type, name] of Object.entries(names)) {
                if (typeof name !== 'string') {
                    throw new Error('Invalid name.');
                }

                const isUnique = await this.isUniqueName(type, name, citizen_id.id);
                
                if (!isUnique) {
                    throw new Error('You must ensure all submitted names are unique.');
                }
            }

            // Check if user has current name and set it to expired
            const currentDate = moment().tz('Australia/Brisbane').format('YYYY-MM-DD');
            const dayBefore = moment().tz('Australia/Brisbane').subtract('1', 'day').format('YYYY-MM-DD');

            const currentName = await this.getUserCurrentName(citizen_id.id);

            // * If no current name exists, insert the new name as held from the current date until infinity
            if (!currentName) {
                return await db.none(
                    `INSERT INTO names (
                        first_name,
                        middle_name,
                        last_name,
                        held_from,
                        held_to,
                        citizen_id
                        )
                    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [first_name, middle_name, last_name, currentDate, 'Infinity', citizen_id.id]
                );
            }

            // * If current name held_from date is the current date, overwrite with new name
            if (currentName.held_from === currentDate) {
                return await db.none(
                    `UPDATE names SET 
                        first_name = $1,
                        middle_name = $2,
                        last_name = $3
                    WHERE citizen_id = $4 AND held_from = $5`,
                    [first_name, middle_name, last_name, citizen_id.id, currentDate]
                );
            }

            // * If current name has a held_from date other than today, "close" it at the day before today
            const newHeldFromDate = currentDate === currentName.held_to ? currentDate : dayBefore;

            await db.none(`UPDATE names SET held_to = $1 WHERE citizen_id = $2 AND held_from = $3`, [
                newHeldFromDate,
                citizen_id.id,
                currentName.held_from,
            ]);

            // * Insert new current name after "closing" the previous one at the day before today
            return await db.none(
                `INSERT INTO names (
                    first_name,
                    middle_name,
                    last_name,
                    held_from,
                    held_to,
                    citizen_id
                    )
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [first_name, middle_name, last_name, currentDate, 'Infinity', citizen_id.id]
            );
        } catch (err) {
            throw new Error(`Failed to create new name. ${err}`);
        }
    }
})();
