var PORT = process.env.PORT || 3001;
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const path = require('path');
const router = express.Router();

// this keeps track of how many views does each comic have
let comicCounter = {};

// The following 2 routes just serves the page, the page itself will determine its current comic and button link etc
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

router.get('/:comicID', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// Since we cannot fetch this website from frontend given cors issue therefore we have to fetch it from the backend and have the frontend fetch it from the backend
router.get('/getComic/:comicID', cors(), async (req, res, next) => {
    const cid = Number(req.params.comicID);
    const resp = await fetch(`https://xkcd.com/${cid > 0 ? String(cid) + '/' : ''}info.0.json`);
    const jsonResp = await resp.json();
    res.json(jsonResp);
});

// Since we cannot pass this information to the frontend therefore we have to let the frontend request the informatino on how many times the comic has been viewed
router.get('/comicCount/:comicID', (req, res) => {
	const cid = req.params.comicID;
	if (cid in comicCounter) {
		comicCounter[cid] += 1;
	} else {
		comicCounter[cid] = 1;
	}
	console.log(comicCounter[cid]);
	res.json({"count": comicCounter[cid]});
});

app.use('/', router);
app.listen(PORT);
