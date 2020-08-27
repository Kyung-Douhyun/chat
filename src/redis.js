const redis = require('redis');
const redisClient = redis.createClient(6379, 'localhost');
redisClient.auth('secret', function (err) {
	if (err) throw err;
});
redisClient.on('error', function (err) {
	console.log('Redis error: ' + err);
});

module.exports = redisClient;
