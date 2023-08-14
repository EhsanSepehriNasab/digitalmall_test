const server = () =>{ 
    require('./src/repo/monogdb.js')
    const app = require('./src/main')

    app.listen(3000)
}

server()