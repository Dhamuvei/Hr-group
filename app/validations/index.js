// const Joi = require('joi')
// const options = {
//     abortEarly: false, // include all error
//     allowUnknown: true, // ignore unknown props
//     stripUnknown: true // remove unknown props
// }

// const fs = require('fs')
// const path = require('path')
// const basename = path.basename(__filename)
// fs.readdirSync(__dirname).filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
// }).forEach(file => {
//     file = path.basename(file, '.js')
//     module.exports[`${file}Validator`] = async (req, res, next) => {
//         try {
//             const schema = await require(path.join(__dirname, file))(Joi);
//             schema = schema.unknown(true);
//         req.body = await require(path.join(__dirname, file))(Joi).validateAsync(req.body, options)
//             return next()
//         } catch (error) {
//             if (error.isJoi) {
//                 error.status = 422
//                 return next(error)
//             } else next(error)
//         }
//     }

// })



// old validatore


const Joi = require('joi');
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

fs.readdirSync(__dirname).filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
}).forEach(file => {
    file = path.basename(file, '.js');
    module.exports[`${file}Validator`] = async (req, res, next) => {
        try {
            const schema = await require(path.join(__dirname, file))(Joi);

            // Allow all fields
            req.body = await schema.unknown(true).validateAsync(req.body, options);
            return next();
        } catch (error) {
            if (error.isJoi) {
                error.status = 422;
            }
            return next(error);
        }
    };
});

// new 

// const Joi = require('joi');
// const options = {
//     abortEarly: false, // include all errors
//     allowUnknown: true, // ignore unknown props
//     stripUnknown: true // remove unknown props
// };

// const fs = require('fs');
// const path = require('path');
// const basename = path.basename(__filename);

// // Function to load and compile all validators
// function loadValidators() {
//     const validators = {};

//     // Load all validator files from the current directory
//     const validatorFiles = fs.readdirSync(__dirname)
//         .filter(file => file !== basename && file.slice(-3) === '.js');

//     validatorFiles.forEach(file => {
//         const validatorName = path.basename(file, '.js');
//         validators[`${validatorName}Validator`] = async (req, res, next) => {
//             try {
//                 const schema = await require(path.join(__dirname, file))(Joi);
//                 // Allow all fields
//                 req.body = await schema.unknown(true).validateAsync(req.body, options);
//                 return next();
//             } catch (error) {
//                 if (error.isJoi) {
//                     error.status = 422;
//                 }
//                 return next(error);
//             }
//         };
//     });

//     return validators;
// }

// // Load validators
// module.exports = loadValidators();