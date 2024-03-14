//Libraries
const path = require('path');
const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const reservation = require('./Model/reservation');
const cors = require('cors');
const { check, checkSchema, validationResult } = require('express-validator');

//Setup defaults for script
const app = express();
app.use(cors());
app.use(express.static('public'));
const storage = multer.diskStorage({
    //Logic where to upload file
    destination: function (request, idPhoto, callback) {
        callback(null, 'public/uploads/')
    },
    //Logic to name the file when uploaded
    filename: function (request, idPhoto, callback) {
        callback(null, idPhoto.originalname + '-' + Date.now() + path.extname(idPhoto.originalname))
    }
})
const upload = multer({
    storage: storage,
    //Validation for file upload
    fileFilter: (request, idPhoto, callback) => {
        const allowedFileMimeTypes = ["image/png", "image/jpg", "image/jpeg"];
        callback(null, allowedFileMimeTypes.includes(idPhoto.mimetype));
    }
});
const port = 80 //Default port to http server
const connection = mysql.createConnection({
    host: "****",
    user: "****",
    password: "****",
    database: '****'
});

//The * in app.* needs to match the method type of the request
app.get(
    '/reservation/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            result = await reservation.getAllReservations(request.query);
        } catch (error) {
            return response
                .status(500) //Error code when something goes wrong with the server
                //.setHeader('Access-Control-Allow-Origin', '*') //Prevent CORS error
                .json({ message: 'Something went wrong with the server.' });

        }
        //Default response object
        response
            //.setHeader('Access-Control-Allow-Origin', '*') //Prevent CORS error
            .json({ 'data': result });

    });

//Action to handle form submission
app.post('/reservation/',

    //Should be the name of the 'idPhoto' field in the request
    upload.fields([{ name: 'idPhoto', maxCount: 1 }]), //checks that the upload only accepts 1 file. 0 files or more than one aren't accepted 

    check('inputFirstName', "Invalid Name")
        .isLength({ min: 2 })
        .matches(/^[a-zA-Z\s,'-]*$/),

    check('inputLastName', "Invalid Name")
        .isLength({ min: 2 })
        .matches(/^[a-zA-Z\s,'-]*$/),

    //Validation for 'numLanes' field in request
    check('numLanes', "Please select the number of lanes you would like to reserve.")
        .isIn(["1", "2", "3", "4", "5", "6", "7", "8", "Whole Games Center"]),

    //Validation for "inputDate"
    check('inputDate', "Please select the date of your reservation.")
        .isDate(),

    //Validation for "inputStartTime"
    //  Uses regular to check time: HH:MM 24-hour format, optional leading 0
    //  Source: https://stackoverflow.com/questions/7536755/regular-expression-for-matching-hhmm-time-format
    check('inputStartTime', "Please select the start time of your reservation.")
        .matches('^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$'),

    //Validation for "inputEndTime"
    //  Uses regular to check time: HH:MM 24-hour format, optional leading 0
    //  Source: https://stackoverflow.com/questions/7536755/regular-expression-for-matching-hhmm-time-format
    check('inputEndTime', "Please select the time your reservation will end.")
        .matches('^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$'),

    //Validation for 'student' field in request
    check('isBSU', "Please select if you attend or work at BSU.")
        .isIn(['1', '0']),

    //Validation for 'file' field in request. references multer in order to make sure it is an accepted file type
    checkSchema({
        'idPhoto': {
            custom: {
                options: (value, { req, path }) => {
                    console.log(req);
                    console.log(path);
                    //true = no validation error; false = something wrong 
                    return 0 === parseInt(req.body.isBSU) || (1 === parseInt(req.body.isBSU) && !!req.files[path]);
                },
                errorMessage: 'Please upload an image of your student or staff ID',
            },
        },
    }),

    //Validation for 'inputMisc' field in request
    check('inputMisc', "Please enter any additional information. If you don't have anything to add, write 'NA'")
        .trim()
        .isLength({ min: 2 })
        .matches(/^[a-zA-Z0-9\s\\\/\.,_-]*$/),

    check('isPaying', "Please select if you plan on paying before the day of your reservation.")
        .isIn(['1', '0']),

    async (request, response) => {
        const errors = validationResult(request)
        if (!errors.isEmpty()) { //new
            return response
                .status(400)
                //.setHeader('Access-Control-Allow-Origin', '*') //Prevent CORS error
                .json({
                    message: 'Request fields or files are invalid.',
                    errors: errors.array(),
                });
        }

        try {
            console.log(request.files);
            //We trying this block of code first 
            await reservation.insert(request.body, request.files);
            return response
                //.setHeader('Access-Control-Allow-Origin', '*') //Prevent CORS error
                .json({ message: 'OK!' });
        } catch (error) {
            //If there are any errors, then we run this block of code
            return response
                .status(500) //Error code when something goes wrong with the server
                //.setHeader('Access-Control-Allow-Origin', '*') //Prevent CORS error
                .json({ message: 'Something went wrong with the server.' });
        }
    });

//Action to handle update submission
app.put('/reservation/:id/', //upload.none(),

    //Should be the name of the 'idPhoto' field in the request
    upload.fields([{ name: 'idPhoto', maxCount: 1 }]), //checks that the upload only accepts 1 file. 0 files or more than one aren't accepted 

    check('inputFirstName', "Invalid input.")
        .isLength({ min: 2 })
        .matches(/^[a-zA-Z\s,'-]*$/),

    check('inputLastName', "Invalid input.")
        .isLength({ min: 2 })
        .matches(/^[a-zA-Z\s,'-]*$/),

    //Validation for 'numLanes' field in request
    check('numLanes', "Invalid input.")
        .isIn(["1", "2", "3", "4", "5", "6", "7", "8", "Whole Games Center"]),

    //Validation for "inputDate"
    check('inputDate', "Invalid date.")
        .isDate(),

    //Validation for "inputStartTime"
    //  Uses regular to check time: HH:MM 24-hour format, optional leading 0
    //  Source: https://stackoverflow.com/questions/7536755/regular-expression-for-matching-hhmm-time-format
    check('inputStartTime', "Invalid start time.")
        .matches('^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$'),

    //Validation for "inputEndTime"
    //  Uses regular to check time: HH:MM 24-hour format, optional leading 0
    //  Source: https://stackoverflow.com/questions/7536755/regular-expression-for-matching-hhmm-time-format
    check('inputEndTime', "Invalid end time.")
        .matches('^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$'),

    //Validation for 'student' field in request
    check('isBSU', "Invalid input.")
        .isIn(['1', '0']),

    //Validation for 'file' field in request. references multer in order to make sure it is an accepted file type
    checkSchema({
        'idPhoto': {
            custom: {
                options: (value, { req, path }) => {
                    //true = no validation error; false = something wrong 
                    return 0 === parseInt(req.body.isBSU) || (1 === parseInt(req.body.isBSU) && !!req.files[path]);
                },
                errorMessage: 'Invalid upload',
            },
        },
    }),

    //Validation for 'inputMisc' field in request
    check('inputMisc', "Please enter any additional information. If you don't have anything to add, write 'NA'")
        .trim()
        .isLength({ min: 2 })
        .matches(/^[a-zA-Z0-9\s\\\/\.,_-]*$/),

    check('isPaying', "Invalid input.")
        .isIn(['1', '0']),

    check('id', "id is not int").isInt(),

   async (request, response) => {

        const errors = validationResult(request)
        if (!errors.isEmpty()) { //new
            return response
                .status(400)
                //.setHeader('Access-Control-Allow-Origin', '*') //Prevent CORS error
                .json({
                    message: 'Request fields or files are invalid.',
                    errors: errors.array(),
                });
        }

        try {
            //We trying this block of code first 
            await reservation.update(request.params.id, request.body, request.files);
            return response
                //.setHeader('Access-Control-Allow-Origin', '*') //Prevent CORS error
                .json({ message: 'OK!' });
        } catch (error) {
            //If there are any errors, then we run this block of code
            return response
                .status(500) //Error code when something goes wrong with the server
                //.setHeader('Access-Control-Allow-Origin', '*') //Prevent CORS error
                .json({ message: 'Something went wrong with the server.' });
        }

    });

app.get(
    '/reservation/:id/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            result = await reservation.getPrevResponse(request.params.id);
        } catch (error) {
            return response
                .status(500) //Error code when something goes wrong with the server
                //.setHeader('Access-Control-Allow-Origin', '*') //Prevent CORS error
                .json({ message: 'Something went wrong with the server.' });

        }
        //Default response object
        response
            //.setHeader('Access-Control-Allow-Origin', '*') //Prevent CORS error
            .json({ prevResponse: result });

    }
);

app.delete(
    '/reservation/:id/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            result = await reservation.deleteReservation(request.params.id);
        } catch (error) {
            return response
                .status(500) //Error code when something goes wrong with the server
                //.setHeader('Access-Control-Allow-Origin', '*') //Prevent CORS error
                .json({ message: 'Something went wrong with the server.' });

        }
        //Default response object
        response
            //.setHeader('Access-Control-Allow-Origin', '*') //Prevent CORS error
            .json({ data: result });

    });

app.listen(port, () => {
    console.log(`Application listening at http://localhost:${port}`);
})