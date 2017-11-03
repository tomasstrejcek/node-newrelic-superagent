const newrelic = require('newrelic')
const superagent = require('superagent')



const test = async () => {
  try {
    const result = await superagent.get('http://localhost:3000/test').retry(3).timeout(1000)
    console.log(result)
  } catch (err) {
    console.error(err)
  }
}

const test2 = async () => {
  try {
    const result = await superagent.get('http://localhost:3000/test').timeout(500)
    console.log(result)
  } catch (err) {
    console.error(err)
  }
}

const test3 = async () => {
  try {
    const result = await superagent.get('https://www.google.com')
    // console.log(result)
  } catch (err) {
    console.error(err)
  }
}


const express = require('express')
const app = express()

app.get('/test', function (req, res) {
  console.error('test called')

  req.on('close', (err) => {
    newrelic.pushTransactionName(':terminated')
    const tr = newrelic.getTransaction()
    tr.end()
  })

})

app.get('/launch', async (req, res) => {
  await test()

  res.send('test launched')
})

app.get('/launch-noretry', async (req, res) => {
  await test2()
  res.send('test launched')
})

app.get('/launch-success', async (req, res) => {
  await test3()
  res.send('test launched')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})