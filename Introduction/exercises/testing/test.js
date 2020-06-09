const { findUser } = require('./users');
// write some tests
describe('users', () => {
    test('findUser', done => {
        expect(findUser(2)).toBe(2);
    })
})
