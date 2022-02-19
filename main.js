const express = require('express');
const app = express();

const fs = require('fs');
const pug = require('pug');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { abort } = require('process');

let db = mysql.createConnection({
    host: 'localhost',
    user: 'nodejs',
    password: 'nojy99',
    database: 'mystudy'
});

db.connect();

const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res){
    db.query('SELECT * FROM diary', function(err, data){
        if(err){throw err;}
        const renderedPug = pug.renderFile('./public/template/home.pug', {diary: data});

        res.send(renderedPug);
    })
});

app.get('/create', function(req, res){
    db.query('SELECT * FROM diary', function(err, data){
        if(err){throw err;}
        const renderedPug = pug.renderFile('./public/template/create.pug', {diary: data});
        
        res.send(renderedPug);
    })
});

app.post('/create_process', function(req, res){
    db.query('INSERT INTO diary(title, content, created, author_id) VALUES (?, ?, NOW(), 4)', [req.body.title, req.body.content], function(err, result){
        if(err) {throw err;}
        res.redirect('/');
    });
});

app.post('/delete_process', function(req, res){
    db.query('DELETE FROM diary WHERE id=?', [req.body.diaryId], function(err, result){
        if(err) {throw err;}
        console.log(req.body.diaryId);
        res.redirect('/');
    })
})

app.get('/diary/:diaryId', function(req, res){
    db.query('SELECT * FROM diary', function(err, data){
        if(err){throw err;}
        let renderedPug;
        data.forEach(diary => {
            if(diary.id == req.params.diaryId){
                renderedPug = pug.renderFile('./public/template/read.pug', {diary: data, curDiary: diary});
            }
        });
        res.send(renderedPug);
    })
});

app.listen(port, function(){
    console.log(`start Server Port:${port}`);
});