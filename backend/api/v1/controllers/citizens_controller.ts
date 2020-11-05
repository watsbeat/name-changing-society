import { db } from '../config/db';

export default new (class Citizens {
    public async getCitizens(): Promise<any> {
        try {
            return await db.any('SELECT * FROM citizens');
        } catch (err) {
            console.error(err);
            throw new Error(`Error getting citizens`);
        }
    }
})();
