// @ts-check
/**
 * A quick demo to check how good is the htmldiff.js library
 * when comparing HTML
 *
 * @version 0.1
 */
const htmlDiff = require('node-htmldiff');
const { parse } = require('querystring');
const fetch = require('node-fetch');
const http = require('http');
const url = require('url');
const filesystem = require('fs');
const path = require('path');

const port = 3000;
const hostname = '127.0.0.1';
const router = {
    'GET /': {
        file: 'index.html',
        mime: 'text/html',
    },
    'GET /style.css': {
        file: 'style.css',
        mime: 'text/css',
    },
    'POST /diff.html': {
        file: 'diff.html',
        mime: 'text/html',
    },
};

/**
 * Finds assets and dispatch them as response
 * @param {string} name - full asset name
 */
const dispatch = async (name) => {
    const filePath = path.join(__dirname, 'templates', name);
    return filesystem.promises.readFile(filePath, { encoding: 'utf-8' });
}; // end dispatch

/**
 * Function to listen to incoming messages and process a response
 * @param {object} request
 * @param {object} response
 */
const serverFunction = async (request, response) => {
    const { method, url: URL } = request;
    const route = url.parse(URL).pathname;
    const match = router[`${method} ${route}`];

    if (!match) {
        response.writeHead(404);
        console.log(method, route, 404);
        response.end();
        return;
    } // end if

    response.writeHead(200, { 'Content-Type': `${match.mime}` });
    let html = await dispatch(match.file);
    if (route === '/diff.html' && method === 'POST') {
        let body = '';
        request.on('data', (data) => { body += data; });
        request.on('end', async () => {
            try {
                const contentUrl = 'https://0doh5zkty0.execute-api.us-east-1.amazonaws.com/dev/tacnt/published?rid=';
                const { original, revised } = parse(body);
                const originalResponse = await fetch(`${contentUrl}${original}`, {
                    headers: { Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InNjb3BlcyI6WyJHRVQvdGFjbnQvZHJhZnQiLCJHRVQvdGFjbnQvcHVibGlzaGVkIiwiR0VUL3RhZW50L2VudGl0aWVzIiwiR0VUL3RhdGQvY2hhcnQvcHJldmlldyJdfSwicm9sZXMiOlsiZHJ1cGFsIl0sImlhdCI6MTU5MTg4NTkwMSwiZXhwIjoxNTk0NDc3OTAxLCJhdWQiOiJkZW1pYW5oIn0.pMU_VdIzEavlQhAF38ORU73Em5a8G7w4hisCSvK6zEU' },
                });
                const revisedResponse = await fetch(`${contentUrl}${revised}`, {
                    headers: { Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InNjb3BlcyI6WyJHRVQvdGFjbnQvZHJhZnQiLCJHRVQvdGFjbnQvcHVibGlzaGVkIiwiR0VUL3RhZW50L2VudGl0aWVzIiwiR0VUL3RhdGQvY2hhcnQvcHJldmlldyJdfSwicm9sZXMiOlsiZHJ1cGFsIl0sImlhdCI6MTU5MTg4NTkwMSwiZXhwIjoxNTk0NDc3OTAxLCJhdWQiOiJkZW1pYW5oIn0.pMU_VdIzEavlQhAF38ORU73Em5a8G7w4hisCSvK6zEU' },
                });
                const jOriginal = await originalResponse.json();
                const jRevised = await revisedResponse.json();

                const diff = htmlDiff(jOriginal.document, jRevised.document);

                html = html.replace(/{original}/g, jOriginal.document).replace(/{diff}/g, diff).replace(/{rid}/g, jOriginal.rid);
                response.write(html);
                console.log(method, route, 200);
                response.end();
            } catch (error) {
                response.writeHead(503);
                console.log(error.message);
            } // end try - catch
        });
        return;
    } // end if
    response.write(html);
    console.log(method, route, 200);
    response.end();
};

const server = http.createServer(serverFunction);

server.listen(port, hostname, () => {
    console.log(`Server listening on ${port} with hostname ${hostname}`);
});
