module.exports = {
    dialect: 'mongodb',
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'etnobook',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
};