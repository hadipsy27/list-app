const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.static('public'));

// ------------------------------------------------
// konfigurasi untuk mengakses nilai form
// console.log(req.body.itemName);
// console.log(req.params.id);
app.use(express.urlencoded({extended: false}));
// ------------------------------------------------

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'list_app'
});

app.get('/', (req, res) => {
  res.render('top.ejs');
});

app.get('/index', (req, res) => {
  connection.query(
    'SELECT * FROM items',
    (error, results) => {
      res.render('index.ejs', {items: results});
    }
  );
});

app.get('/new', (req, res) => {
  res.render('new.ejs');
});

app.post('/create', (req, res) => {
  connection.query(
    'INSERT INTO items (name) values (?)',
    [req.body.itemName],
    (error, results) => {
      connection.query(
        'SELECT * FROM items',
        (error, results) => {
          // res.render('index.ejs', {items: results});

          // -------------------------------------------------------------------------
          // supaya data tidak terduplikat ketika di reload maka pakai  res.redirect()
          res.redirect('/index');
        }
      );
    }
  )
});

app.post('/delete/:id', (req, res) => {
  // cek di teminal apakan id sudah di dapatkan
  // console.log(req.params.id);
  connection.query(
    'DELETE FROM items where id = ?',
    [req.params.id],
    (error, results) => {
      // console.log(req.params.id);
      res.redirect('/index');
    }
  )
});

app.get('/edit/:id', (req, res) => {
  connection.query(
    'SELECT * FROM items WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.render('edit.ejs', {data: results[0]});
    }
  );
})

app.post('/update/:id',(req,res)=>{
  // res.redirect('/index');
  connection.query(
    'UPDATE items SET name = ? WHERE id = ?',
    [req.body.item, req.params.id],
    (error, results)=> {
      res.redirect('/index');
    }
  )
})



app.listen(3000);