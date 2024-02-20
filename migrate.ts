export default {
    uri: process.env.MONGO_URL,
    collection: 'migrations',
    migrationsPath: './migrations',
    templatePath: './migrations/template.ts',
    autosync: false,
}
