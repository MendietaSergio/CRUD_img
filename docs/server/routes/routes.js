const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path');
const fs = require('fs')

//esto se puede usar en middleware
const diskstorage = multer.diskStorage({
    destination:path.join(__dirname,'../images'),//me permite juntar dos rutas y me crea la carpeta img
    filename: (req,file,cb)=>{
        cb(null, Date.now()+file.originalname)//guardo el nombre de archivo con al afeha

    }
})
const fileUpload = multer({
    storage: diskstorage
}).single('image')
router.get('/',  (req,res)=>{
    res.send("Welcome to my image app")
})
router.post('/image/post',fileUpload,(req,res)=>{
    req.getConnection((err, conn) => {
        if(err) return res.status(500).send('server error')

        const type = req.file.mimetype
        const name = req.file.originalname
        const data = fs.readFileSync(path.join(__dirname, '../images/' + req.file.filename))

        conn.query('INSERT INTO image set ?', [{type, name, data}], (err, rows) => {
            if(err) return res.status(500).send('server error')

            res.send('image saved!')
        })
    })
    console.log(req.file);
})
router.get('/image/get',(req,res)=>{
    req.getConnection((err, conn) => {
        if(err) return res.status(500).send('server error')

        conn.query('SELECT * FROM image', (err, rows) => {
            if(err) return res.status(500).send('server error')
            rows.map( img=>{
                //recibe la ruta y el dato de cada imagen.
                fs.writeFileSync(path.join(__dirname, '../dbImages/'+img.id +"_CRUD_img.png"),img.data)
            })
            const imageDir = fs.readdirSync(path.join(__dirname,'../dbImages/'));
            res.json(imageDir)
        })
    })
    console.log(req.file);
})


module.exports = router;