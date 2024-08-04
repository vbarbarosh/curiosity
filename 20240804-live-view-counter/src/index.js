#!/usr/bin/env node

require('dotenv/config');

const SocketIO = require('socket.io');
const body_parser = require('body-parser');
const cli = require('@vbarbarosh/node-helpers/src/cli');
const db = require('../db');
const db_hits_count = require('../db/hits/count');
const db_hits_insert = require('../db/hits/insert');
const express = require('express');
const express_params = require('@vbarbarosh/express-helpers/src/express_params');
const express_routes = require('@vbarbarosh/express-helpers/src/express_routes');
const express_run = require('@vbarbarosh/express-helpers/src/express_run');
const fs_path_resolve = require('@vbarbarosh/node-helpers/src/fs_path_resolve');
const fs_read_utf8 = require('@vbarbarosh/node-helpers/src/fs_read_utf8');
const he = require('he');
const http = require('http');
const path = require('path');

cli(main);

async function main()
{
    const app = express();
    const server = http.createServer(app);
    const io = new SocketIO.Server(server, {
        cors: {
            origin: '*',
        },
    });

    io.on('connection', function (socket) {
        // console.log('io.connection');
        socket.on('disconnect', function () {
            // console.log('socket.disconnect');
        });
    });

    app.use(function (req, res, next) {
        req.io = io;
        next();
    });

    app.use(express.static(path.resolve(__dirname, 'static'), {index: false}));
    app.use(body_parser.json());

    express_routes(app, [
        {req: 'GET /', fn: (req,res) => res.redirect(301, '/index.html')},
        {req: 'GET /hit.js', fn: hit},
        {req: 'GET /widget.js', fn: widget},
        {req: 'GET /echo/*', fn: echo},
        {req: 'POST /api/v1/articles', fn: echo},
        {req: 'DELETE /api/v1/articles/:uid', fn: echo},
        {req: 'ALL *', fn: page404},
    ]);

    app.listen = server.listen.bind(server);
    await express_run(app, 3000, '0.0.0.0');
    await db.end();
}

async function echo(req, res)
{
    res.status(200).send(express_params(req));
}

async function hit(req, res)
{
    const path = req.query.uid || '';
    await db_hits_insert({path});
    req.io.emit(`update ${path}`, await db_hits_count({path}));
    res.status(200).type('text/javascript').send();
}

async function widget(req, res)
{
    const uid = req.query.uid;
    const total = await db_hits_count({path: uid});
    const body = await fs_read_utf8(fs_path_resolve(__dirname, 'live/live-view-counter.js'));
    const body2 = body.replace(/\{\{(\w+):(\w+)\}\}/mg, function (m, type, name) {
        let value;
        switch (name) {
        case 'uid': value = uid; break;
        case 'total': value = total; break;
        case 'APP_URL': value = process.env.APP_URL; break;
        default:
            throw new Error(`Invalid variable name: ${name}`);
        }
        switch (type) {
        case 'json':
            return JSON.stringify(value);
        case 'html':
            return he.encode(value);
        }
    });
    res.status(200).type('text/javascript').send(body2);
}

async function page404(req, res)
{
    res.status(404).send(`Page not found: ${req.path}`);
}
