const Joi = require('joi');
const helmet = requre('helmet');
const morgan = require('morgan');
const express = require('express');
const app = express();
const logger = require('./logger');
app.use(express.json()); 

//Creating custom middleware
app.use(logger)

//Environemnts
//Development : Run your code as you run it is development
//Production : To run in production environment : export NODE_ENV=production
// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`app: ${app.get('env')}`);

//Built in middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true})); // serving request of url like , key=value&key=value and populates to req.body
app.use(express.static('public')); // in url just put localhost:3000/readme.txt it will show this

//Third party middlewares
app.use(helmet());
if(app.get('env') === 'development'){
    app.use(morgan('tiny')); //every time you send request it will log the http request not use in production
    console.log('Morgan Enabled')
}

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
    {id: 4, name: 'course4'}
]

app.get('/',(req,res)=>{
    res.send("Hello World");
})

app.get('/api/courses/', (req,res)=>{
    res.send([1,2,3]);
})

//POST METHOD
app.post('/api/courses',(req,res)=>{
    const schema = {
        name: Joi.string().min(3).required()
    }

    const result = Joi.validate(req.body,schema);
    // console.log(result);

    // if(!req.body.name || req.body.name.length < 3){
    //     // 400 Bad Request
    //     res.status(400).send("Name is required and should be minimum 3 characters")
    //     return;
    // }

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(course,schema);
}

app.put('/api/courses/:id', (req,res)=>{
    //Look up the course
    //If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) {
        return res.status(404).send('The course with given id not found');
    }

    //Validate
    //If invalid, return 404 - Bad Request
    const result = validateCourse(req.body);
    const {error} = validateCourse(req.body); // result.error | object destructor
    if(error){
       return res.status(400).send(result.error.details[0].message);
    }

    //Update course
    course.name = req.body.name;
    //Return the updated course
    res.send(course);
})


//Route Parameters
app.get('/api/courses/:id', (req,res)=>{
    // res.send(req.params.id);
    //Handling Get
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with given id not found');
    res.send(course);
})


//Multiple Route Parameters
app.get('/api/posts/:year/:month', (req,res)=>{
    res.send(req.params)
})

//Query state paraemeters
// For example if you call /api/posts/2018/1?sortBy=name it will do it
app.get('/api/posts/:year/:month', (req,res)=>{
    res.send(req.query)
})

app.delete('/api/courses/:id', (req,res)=>{
    //Look up the course
    //Not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with given id not found');


    //Delete
    const index = course.indexOf(course);
    course.splice(index,1);

    res.send(course);

    //Return the same course
})

app.listen(3000,()=>{
    console.log("sever listening on port 3000")
});