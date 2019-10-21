'use strict';

const express = require('express');
const app = express();
const serveIndex = require('serve-index');

app.use(express.static('.'));
app.use(serveIndex('.', {icons: true}));
app.listen(process.env.PORT || 3000);
