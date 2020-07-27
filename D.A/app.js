const express = require('express');
const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const morgan = require('morgan');
const createError = require('http-errors');
const numeral = require('numeral');
const path = require('path');
const handlebars = require('handlebars');
const app = express();

app.engine('hbs', exphbs({
    layoutsDir: 'views/layouts',
    defaultLayout: 'main.hbs',
    partialsDir: 'views/partials',
}));
S
app.set('view engine', 'hbs');
app.use(express.static('./public/'));

// app.use('/', require('./routes/category.route'));
app.get('/', (req, res) => {
    res.render('home');
});

const PORT = 3000;
app.listen(PORT, function() {
    console.log(`Server is running at http://localhost:${PORT}`);
})