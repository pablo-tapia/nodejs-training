const data = require('./data');

module.exports = {
    getUserById(id, cb) {
        // simulate API call
        setTimeout(() => {
            const user = data.users.find(user => user.id === id);
            cb(user);
        }, 150);
    }, // end getUserById

    getPostsForUser(userId, cb) {
        // simulate API call
        setTimeout(() => {
            const posts = data.posts.filter(post => post.createdBy === userId);
            cb(posts);
        }, 150);
    }
}
