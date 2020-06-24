var express = require('express')

var app = express();

app.use(express.static('.'));
app.get('/', (req, res) => {
    res.send(' yes, am alive!')
})

app.listen( 3003, () => console.log('application is listeninsg on port 3000') )
