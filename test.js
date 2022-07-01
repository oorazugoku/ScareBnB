
// function checkDate(val) {
//     let today = new Date
//     let date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
//           if (Date.parse(val) < Date.parse(date)) {
//             throw new Error('Please enter a date After today.')
//           }
//           return true
// }

// console.log(checkDate('2022-06-01'))

function checkDate(val) {
          if (new Date(val) < new Date()) {
            throw new Error('Please enter a date After today.')
          }
          return true
}

console.log(checkDate('2022-07-02'))

