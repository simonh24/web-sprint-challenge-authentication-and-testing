const request = require('supertest');
const server = require('./server.js');
const db = require('../database/dbConfig.js');

let token = '';

describe('server', function () {
    it('should run the tests', function () {
        expect(true).toBe(true);
    })
})

describe('/api/auth/login', function () {
    
    beforeEach(async () => {
        await request(server)
            .post('/api/auth/register')
            .send({
                "username": "simontest123",
                "password": "testpw"
            })
    })

    it('should respond with status 200', function () {
        return request(server)
            .post('/api/auth/login')
            .send({
                'username': 'simontest123',
                'password': 'testpw'
            })
            .then(res => {
                expect(res.status).toBe(200)
            })
    })

    it('should respond with message welcome to our api', function () {
        return request(server)
            .post('/api/auth/login')
            .send({
                'username': 'simontest123',
                'password': 'testpw'
            })
            .then(res => {
                expect(res.body.message).toBe("Welcome to our API")
            })
    })

    it('should respond with status 400', function () {
        return request(server)
            .post('/api/auth/login')
            .send({
                'username': 'simontest123'
            })
            .then(res => {
                expect(res.status).toBe(400)
            })
    })

    it('should respond with message invalid credentials', function () {
        return request(server)
            .post('/api/auth/login')
            .send({
                'username': 'simontest123',
                'password': 'testpw123'
            })
            .then(res => {
                expect(res.body.message).toBe("Invalid credentials")
            })
    })
})

describe('/api/auth/register', function () {
    
    beforeEach(async () => {
        await db("users").truncate();
    })

    it('should respond with status 400', function () {
        return request(server)
            .post('/api/auth/register')
            .send({
                "username": "jesttest"
            })
            .then(res => {
                expect(res.status).toBe(400);
            })
    })

    it('should respond with an err', function () {
        return request(server)
            .post('/api/auth/register')
            .send({
                "username": "jesttest"
            })
            .then(res => {
                token = res.body.token;
                expect(res.body.message).toBe("please provide username and password and the password shoud be alphanumeric")
            })
    })

    it('should respond with status 201', function () {
        return request(server)
            .post('/api/auth/register')
            .send({
                "username": "jesttest",
                "password": "testpw"
            })
            .then(res => {
                expect(res.status).toBe(201);
            })
    })

    it('should respond with a username', function () {
        return request(server)
            .post('/api/auth/register')
            .send({
                "username": "jesttest",
                "password": "testpw"
            })
            .then(res => {
                token = res.body.token;
                expect(res.body.data.username).toBe('jesttest')
            })
    })
})

describe('/api/jokes', function() {

    it('should respond with status 200', function() {
        return request(server)
            .get('/api/jokes')
            .set('token', token)
            .then(res => {
                expect(res.status).toBe(200);
            })
    })

    it('should respond with an array', function() {
        return request(server)
            .get('/api/jokes')
            .set('token', token)
            .then(res => {
                expect(Array.isArray(res.body)).toBe(true);
            })
    })

    it('should respond with status 401', function() {
        return request(server)
            .get('/api/jokes')
            .then(res => {
                expect(res.status).toBe(401);
            })
    })

    it('should respond with anti authentication', function() {
        return request(server)
            .get('/api/jokes')
            .then(res => {
                expect(res.body.you).toBe("shall not pass!");
            })
    })
})