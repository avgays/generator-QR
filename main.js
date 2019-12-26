/*
 * Copyright (c) 2014 Adobe Systems Incorporated. All rights reserved.
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 * 
 */

/* j shint latedef: false */
/*j shint multistr: true */
/*j shint esversion: 6 */

//jshint esversion: 9
//jshint node:true
//jshint -W100 

(function () {
    "use strict";

    //var DocumentManager = require("./lib/documentmanager"),
    //    StateManager = require("./lib/statemanager"),
    //    RenderManager = require("./lib/rendermanager"),
    //    AssetManager = require("./lib/assetmanager"),
    //    Headlights = require("./lib/headlights");
    
    

    var PLUGIN_ID = require("./package.json").name;
    var MENU_ID = "qr";
    var MENU_LABEL = "QR reader";

    var _generator,
        _config,
        _logger,
        _documentManager,
        _stateManager,
        _renderManager,
        _SONToCSSConverter;

    var _assetManagers = {};

    var _waitingDocuments = {},
        _canceledDocuments = {};

///////////
    //const app = require('http').createServer();
    //const io = require('socket.io')(app, {transports: ['websocket']});
    //var server = app.listen(3000);
    const io = require('socket.io')(3000);
    io.on('connection', (socket) => {
        console.log(">> socket.io connected");
        socket.emit('connected', {});
    });
///////////        
    
    const fs = require('fs');
    const path = require('path');
    
    //var scales = [0.1,0.2,0.4,0.6,0.8,1];
    var scales = [0.05, 0.1, 0.15, 0.2, 0.4, 0.6, 0.8, 1];
    var maxScale;
    var angles = [0,3,-6];
    var scaleN, pass;
    var directoryPath = 'G:/1009/nef/RAW0/';
    var au = 1009;
    //const fileType = ".NEF";
    var fileType = ".psd";


    var jsQR = require('jsqr');
    
    var myFiles = [];
    var myFile = {"path":"","filename":"","pice":"","oldfilename":"","bounds":{}};
    //var path,filename;
    var pices = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    var evExp = {'25/10' :-4.66,'2/1' :-4.33,'16/10' :-4.00,'13/10' :-3.66,'1/1':-3.00,'8/10':-2.66,'6/10':-2.33,'1/2':-2,'4/10':-1.67,'1/3':-1.33,'1/4':-1,'1/5':-0.67,'1/6':-0.33,'1/8':0.00,'1/10':0.33,'1/13':0.66,'1/15':1.00,'1/20':1.33,'1/25':1.66,'1/30':2.00,'1/40':2.33,'1/50':2.5,'1/60':2.66,'1/80':3.00,'1/100':3.35,'1/125':3.70,'1/160':4.00,'1/200':4.30,'1/250':4.60,'1/320':5.00};
    var evFNum = {'3/1':-3.30,'4/1':-2.97,'5/1':-2.61,'6/1':-2.23,'7/1':-1.81,'8/1':-1.4,'85/10':-1.24,'9/1':-1.07,'95/10':-0.90,'10/1':-0.74,'11/1':-0.4,'12/1':-0.2,'13/1':0,'14/1':0.2,'15/1':0.4,'16/1':0.6,'17/1':0.77,'18/1':0.93,'19/1':1.1,'20/1':1.26,'21/1':1.48,'22/1':1.6,'24/1':1.8,'25/1':1.85,'27/1':1.90,'29/1':2.0,'32/1':2.2};
    var EV, fDdistance;

    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host     : '127.0.0.1',
        port     : '3307',
        user     : 'root',
        password : '241636',
        database : 'verstka'
      });

    connection.connect(function(err) {
        if (err) {
          console.error('error connecting: ' + err.stack);
          return;
        }
        console.log('MySQL >>>>>>>> connected as id ' + connection.threadId);
      });

    var _document = null;
   

    /**
     * Initialize the Assets plugin.
     * 
     * @param {Generator} generator The Generator instance for this plugin.
     * @param {object} config Configuration options for this plugin.
     * @param {Logger} logger The Logger instance for this plugin.
     */
    function init(generator, config, logger) {
        _generator = generator;
        _config = config;
        _logger = logger;

        _generator.addMenuItem(MENU_ID, MENU_LABEL, true, false);
        _generator.onPhotoshopEvent("generatorMenuChanged", handleGeneratorMenuClicked);

        function initLater() {

        }
        process.nextTick(initLater);

    }
    function handleGeneratorMenuClicked(event) {
        // Ignore changes to other menus
        var menu = event.generatorMenuChanged;
        if (!menu || menu.name !== MENU_ID) {
            return;
        }
//        var startingMenuState = _generator.getMenuState(menu.name);
//        console.log("Menu event %s, starting state %s", stringify(event), stringify(startingMenuState));
        var params = {"key":"generator-QR"};
        _generator.evaluateJSXFileSharedSafe("./jsx/getCustomOptions.jsx", params).then(function(data) {
            console.log(">>>> type:", data.type, "path:", data.path, "au:", data.au );
            io.emit('log',`========================================================`);
            io.emit('log',`========================================================`);
            io.emit('log',`Тип: ${data.type}, путь: ${data.path}, аукцион: ${data.au}`);


            fileType = data.type;
            directoryPath = data.path;
            au = data.au;
            fs.readdir(path.normalize(directoryPath), function (err, files) {
                if (err) {
                    io.emit('log',`Unable to scan directory:  ${err}`);
                    return console.log('Unable to scan directory: ' + err);
                } 
                files.forEach(function (file) {
                    if (path.parse(file).ext == fileType) myFiles.push(file);
                });
                console.log("Всего:", myFiles.length); 
                io.emit('log',`Всего: ${myFiles.length}`);
                io.emit('log',`========================================================`);
                io.emit('log',`========================================================`);
                myStart();      
            });
        }).done();
    }


    /*********** CALLS ***********/
    function myStart(){
        console.log("Left ", myFiles.length); 
        io.emit('count',`Осталось: ${myFiles.length}`);
        let curDoc = myFiles.shift();
        console.log(curDoc);
        io.emit('log',`Файл: ${curDoc}`);
        if (curDoc) {
            let scriptPath = "../../plugins/generator-QR/open.jsx";
            let fullpath = directoryPath + curDoc;
            _generator.evaluateJSXFile(scriptPath, {"filename":fullpath, "fileType":fileType}).then(function(xmpdata){
                let [distance, exposure, fNumber] = xmpdata.split(';');
                EV = evExp[exposure] + evFNum[fNumber] ;
                fDdistance = distance;
                io.emit('log',`XMPdata: distance ${fDdistance}, exposure ${exposure}, fNumber ${fNumber}, EV ${EV}`);
                maxScale = (fDdistance>0 && fDdistance < 0.80)?4:scales.length-1;
                requestEntireDocument();
            }, function(err){
                console.error("err opening: ",err);
            }).done();

/*
            if (fileType==='.psd') {
                let scriptPath = "../../plugins/generator-QR/openPsd.jsx";
                let fullpath = directoryPath + curDoc;
                _generator.evaluateJSXFile(scriptPath, {"filename":fullpath}).then(function(xmpdata){
                    let [distance, exposure, fNumber] = xmpdata.split(';');
                    EV = evExp[exposure] + evFNum[fNumber] ;
                    fDdistance = distance;
                    io.emit('log',`XMPdata: distance ${fDdistance}, exposure ${exposure}, fNumber ${fNumber}, EV ${EV}`);
                    maxScale = (fDdistance>0 && fDdistance < 0.80)?4:scales.length-1;
                    requestEntireDocument();
                }, function(err){
                    console.error("err opening: ",err);
                }).done();

            } else { // NEF
                let scriptPath = "../../plugins/generator-QR/openNEF.jsx";
                let fullpath = directoryPath + curDoc;
                //let str = 'app.open(new File("' + directoryPath + curDoc + '"));';
                //_generator.evaluateJSXString(str).then(function(){
                _generator.evaluateJSXFile(scriptPath, {"filename":fullpath}).then(function(xmpdata){
                    let [distance, exposure, fNumber] = xmpdata.split(';');
                    EV = evExp[exposure] + evFNum[fNumber] ;
                    fDdistance = distance;
                    io.emit('log',`XMPdata: distance ${fDdistance}, exposure ${exposure}, fNumber ${fNumber}, EV ${EV}`);
                    maxScale = (fDdistance>0 && fDdistance < 0.80)?4:scales.length-1;
                    requestEntireDocument();
                }, function(err){
                    console.error("err opening: ",err);
                }).done();
            } */
        }
    }

    function requestEntireDocument(documentId) {
        if (!documentId) {
            //console.log("Determining the current document ID");
        }
        _generator.getDocumentInfo(documentId).then(
            function (document) {
                //console.log("Received complete document:", stringify(document));
                myFile.bounds = document.bounds;
                ////"bounds": {"top": 0,"left": 0,"bottom": 4912,"right": 7360},
                let fname = path.parse(document.file);
                myFile.oldfilename = fname.name+fname.ext;
                myFile.filename = fname.name;
                myFile.path = directoryPath;
                myFile.pice = "a";
                scaleN=0;
                pass = 0;
                /////////////////////
                io.emit('log',`Trying to guess -------------------------`);
                let guessScale;
                if (fDdistance==0) {
                    guessScale = scales.length-3;
                } else if (fDdistance < 0.42) {
                    guessScale = 0;
                }else if (fDdistance < 0.5) {
                    guessScale = 1;
                } else if (fDdistance < 0.7) {
                    guessScale = 2;
                } else {
                    guessScale = 3;
                }

                let scriptPath = "../../plugins/generator-QR/GuessCurves.jsx";
                let scriptParams = {};
                scriptParams.curve = (EV<0);
                _generator.evaluateJSXFile(scriptPath, scriptParams).then(function(data){
                    getFirstLayerBitmap(document, scales[guessScale]);
                }, function(err){
                    console.error("err Color correct: ", err);
                }).done();
                /////////////////////

                //getFirstLayerBitmap(document, scales[scaleN++]);
            },
            function (err) {
                console.error("Error in getDocumentInfo:", err);
            }
        ).done();
    }

    function getFirstLayerBitmap(document,scale, crop){
        _document = document;
        let settings = {"scaleX":scale, "scaleY":scale };
        //console.log("settings:", stringify(settings));
        _generator.getPixmap(_document.id, _document.layers[0].id, settings).then(
        function(pixmap){
                var pixels = pixmap.pixels;
                var len = pixels.length;
                var channels = pixmap.channelCount;

                // convert from ARGB to RGBA, we do this every 4 pixel values (channelCount) 
                for(var i=0;i<len;i+=channels){
                    pixels[i]   = pixels[i+1];
                    pixels[i+1] = pixels[i+2];
                    pixels[i+2] = pixels[i+3];
                    pixels[i+3] = 255;
                }
                //console.log("width " , pixmap.width, "height", pixmap.height, "len", len);
                var code = jsQR(pixmap.pixels, pixmap.width, pixmap.height, {});
                if (code && Number.isInteger(+code.data) && code.data > 0) {
                    console.log("Scale: " + (scale*100) + "% Data: ", code.data);
                    io.emit('log',`Scale: ${(scale*100)}% Data: ${code.data}`);
                    connection.query('SELECT pcount FROM `pcount` WHERE `numer` = ?', [code.data], function (error, results, fields) {
                        var pice = (results[0])?results[0].pcount:0;
                        myFile.filename = code.data;
                        myFile.pice = pices[pice];
                        //console.log("myFile.pice " + myFile.pice);
                        saveDocument();
                      });
                } else {
                    console.log("!Scale: " + (scale*100) + "% QR Error. " );
                    io.emit('log',`!Scale: ${(scale*100)}% QR Error`);
                    //if (scaleN < scales.length-1) {
                    if (scaleN==0 && pass == 0) {
                        io.emit('log',`PASS ${pass} -------------------------`);
                        let str = "app.activeDocument.activeHistoryState = app.activeDocument.historyStates.getByName('tempCurve')";
                        _generator.evaluateJSXString(str).then(function(){
                            getFirstLayerBitmap(_document, scales[scaleN++],false);
                        }, function(err){
                            console.error("err Revert: ", err);
                        }).done();

                    } else if (scaleN < maxScale) {
                        getFirstLayerBitmap(_document, scales[scaleN++],true);

                    //} else if (scaleN == scales.length-1) { 
                    } else if (scaleN == maxScale) { 
                        if (pass < 2) { //пробуем повернуть
                            pass++;
                            console.log("PASS" , pass, "-------------------------");
                            io.emit('log',`PASS ${pass} -------------------------`);
                            scaleN=0;
                            let str = "app.activeDocument.rotateCanvas(" + angles[pass] + ");";
                            _generator.evaluateJSXString(str).then(function(){
                                getFirstLayerBitmap(_document, scales[scaleN++],false);
                            }, function(err){
                                console.error("err Rotate: ", err);
                            }).done();

                        } else if (pass == 2) { //корректируем цвет
                            pass++;
                            console.log("PASS" , pass, "-------------------------");
                            io.emit('log',`PASS ${pass} -------------------------`);
                            scaleN=0;
                            let scriptPath = "../../plugins/generator-QR/curves.jsx";
                            _generator.evaluateJSXFile(scriptPath).then(function(data){
                                getFirstLayerBitmap(_document, scales[scaleN++],false);
                            }, function(err){
                                console.error("err Color correct: ", err);
                            }).done();

                        } else if (pass == 3) {
                            console.log("Last try");
                            io.emit('log',`Last try`);
                            let str = "app.activeDocument.activeHistoryState = app.activeDocument.historyStates.getByName('temp')";
                            _generator.evaluateJSXString(str).then(function(){
                                getFirstLayerBitmap(_document, scales[scaleN++],false);
                            }, function(err){
                                console.error("err Revert: ", err);
                            }).done();
                        } else {
                            io.emit('log',`Give up....`);
                        }

                    } else {
                        saveDocument();
                    }
                }
            },
            function(err){
                console.error("err pixmap:",err);
            }).done();
    } 


    /*********** HELPERS ***********/
    function saveDocument(){
       let fullpath = myFile.path + "../" + myFile.filename + myFile.pice;
       let scriptPath = "../../plugins/generator-QR/script"+ fileType + ".jsx";
        _generator.evaluateJSXFile(scriptPath, {"filename":fullpath,"width":myFile.bounds.right, "height":myFile.bounds.bottom}).then(function(data){
            console.log(data);
            io.emit('log', data);
            if (!isNaN(+myFile.filename)){
                connection.query('INSERT INTO `ag_au_temp` (`auct_num`,`numer`,`pice`) VALUE (?, ?, ?);', [au, myFile.filename, myFile.pice], function(error, results, fields) {
                    if (error) throw error;
                    //console.log('INSERT ' + results.affectedRows + ' rows');
                });
            }
            var oldPath = path.join(directoryPath, myFile.oldfilename);
            var newPath = path.join(directoryPath + 'R/' + myFile.oldfilename);
            fs.rename(oldPath, newPath, (err) => {
                if (err) throw err;
            });
            console.log("OK =====================================================");
            io.emit('log',`========================================================`);
            myStart();
        }, function(err){
            console.error("err JSXFile:",err);
        }).done();
    }

    function stringify(object) {
        try {
            return JSON.stringify(object, null, "    ");
        } catch (e) {
            console.error(e);
        }
        return String(object);
    }

    exports.init = init;
}());
