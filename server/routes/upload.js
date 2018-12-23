//
//
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());


app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    //Validar tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos validas son ' + tiposValidos.join(', '),
            },
        });
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    //Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones validas son ' + extensionesValidas.join(', '),
                ext: extension
            },
        });
    }

    //Cambiar nombre archivo
    let nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extension}`;

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivo);
        } else {
            imagenUsuario(id, res, nombreArchivo);
        }

    });
});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {

            borrarArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {

            borrarArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioSaved) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                usuario: usuarioSaved,
                img: nombreArchivo
            });
        })

    });

}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {

            borrarArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {

            borrarArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoSaved) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                producto: productoSaved,
                img: nombreArchivo
            });
        })

    });

}

function borrarArchivo(nombreArchivo, tipo) {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;