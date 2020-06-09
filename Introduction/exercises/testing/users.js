const users = new Array(20).fill(0)
.map((_, i) => {
  return {
    id: i,
    createdAt: Date.now() + i,
    email: `readycoder${i}@gmail.com`
  }
})

console.log(users);

// simulate async db call with promise
const findUser = (id) => new Promise((resolve, reject) => {
  const user = users.find(u => u.id == id)
  if (user !== undefined) {
    return resolve(user)
  } // end if
  reject(new Error(`No user with id "${id}"`))
})

// simulate async db call with promise
const deleteUser = (id) => new Promise((resolve, reject) => {
  const i = users.findIndex(u => u.id == id)
  console.log(i)
  if (i === undefined) {
    return reject(new Error(`No user with id "${id}"`))
  }

  users.slice(i, 1)
  resolve({id})
})

module.exports = {
  findUser,
  deleteUser
}
