

var startDisplayDialogs = app.displayDialogs;
var	startRulerUnits = app.preferences.rulerUnits;
var	startTypeUnits = app.preferences.typeUnits;    
    
app.displayDialogs = DialogModes.NO;
app.preferences.rulerUnits = Units.PIXELS;
app.preferences.typeUnits = TypeUnits.PIXELS;

var expJPG = new ExportOptionsSaveForWeb();
expJPG.format = SaveDocumentType.JPEG;
expJPG.includeProfile = false;
expJPG.quality = 80;

var mydoc = app.activeDocument; 
var angle = 0;
var bestAngle = 0;
var bestSquare = 100000000;
var mybounds, square;
var best = false;
var snapshot = mydoc.historyStates.getByName('temp');

mydoc.activeHistoryState = snapshot;

if (mydoc.info.keywords > '') {
    for (var Str in mydoc.info.keywords) {
        if (mydoc.info.keywords[Str].indexOf("rotate")>-1) {
            jsPh_loadSelection('maskTmp');
            jsPh_selection2Mask();
            mydoc.resizeImage(700, null, null, ResampleMethod.BICUBIC);
            jsPh_takeSnaphot('temp2');
            var snapshotSmall = mydoc.historyStates.getByName('temp2');
            while (angle < 5) {
                jsPh_selectMask ();
                jsPh_MaskAsSelection ();
                mybounds = mydoc.selection.bounds;
                square = (mybounds[2] - mybounds[0]) * (mybounds[3] - mybounds[1]);
                if (square > bestSquare) {
            //        break;
                } else {
                    bestAngle = angle;
                    bestSquare = square;
                }
                    angle += 0.3;
                    mydoc.rotateCanvas(0.3);
            }
            mydoc.activeHistoryState = snapshotSmall;
            angle = 0;
            while (angle > -5) {
                jsPh_selectMask ();
                jsPh_MaskAsSelection ();
                mybounds = mydoc.selection.bounds;
                square = (mybounds[2] - mybounds[0]) * (mybounds[3] - mybounds[1]); 
                if (square > bestSquare) {
                    //break;
                } else {
                    bestAngle = angle;
                    bestSquare = square;
                }
                angle -= 0.3;
                mydoc.rotateCanvas(-0.3);
            }
            mydoc.activeHistoryState = snapshot;
            //alert ("rotate", bestAngle);
        }
    }
}

jsPh_loadSelection('maskTmp');
jsPh_selection2Mask();
jsPh_DellChanell('maskTmp');
mydoc.rotateCanvas(bestAngle);

mydoc.saveAs(new File(params.filename + ".psd")); 

jsPh_MaskAsSelection ();
jsPh_Crop ();
mydoc.exportDocument(new File(params.filename + ".jpg"), ExportType.SAVEFORWEB, expJPG);

mydoc.close(SaveOptions.DONOTSAVECHANGES);

app.displayDialogs = startDisplayDialogs;
app.preferences.rulerUnits = startRulerUnits;
app.preferences.typeUnits = startTypeUnits;

"Saved: " + params.filename + ".psd Rotated: " + bestAngle + ".";
////////////////////////////////////////////////////////////////

function jsPh_Crop () {
	var idCrop = charIDToTypeID( 'Crop' );
	var desc4 = new ActionDescriptor();
	var idDlt = charIDToTypeID( 'Dlt ' );
	desc4.putBoolean( idDlt, true );
	executeAction( idCrop, desc4, DialogModes.NO );
}

function jsPh_MaskAsSelection () { //загрузить выделение из маски
	var idslct = charIDToTypeID( 'slct' );
	var desc12 = new ActionDescriptor();
	var idnull = charIDToTypeID( 'null' );
	var ref9 = new ActionReference();
	var idChnl = charIDToTypeID( 'Chnl' );
	var idMsk = charIDToTypeID( 'Msk ' );
	ref9.putEnumerated( idChnl, idChnl, idMsk );
	desc12.putReference( idnull, ref9 );
	var idMkVs = charIDToTypeID( 'MkVs' );
	desc12.putBoolean( idMkVs, false );
    executeAction( idslct, desc12, DialogModes.NO );
    
	var idsetd = charIDToTypeID( 'setd' );
	var desc9 = new ActionDescriptor();
	var ref5 = new ActionReference();
	var idfsel = charIDToTypeID( 'fsel' );
	ref5.putProperty( idChnl, idfsel );
	desc9.putReference( idnull, ref5 );
	var idT = charIDToTypeID( 'T   ' );
	var ref6 = new ActionReference();
	var idOrdn = charIDToTypeID( 'Ordn' );
	var idTrgt = charIDToTypeID( 'Trgt' );
	ref6.putEnumerated( idChnl, idOrdn, idTrgt );
	desc9.putReference( idT, ref6 );
	executeAction( idsetd, desc9, DialogModes.NO );
}


function jsPh_loadSelection(channelName) {
    var idsetd = charIDToTypeID( "setd" );
    var desc3492 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref38 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idfsel = charIDToTypeID( "fsel" );
        ref38.putProperty( idChnl, idfsel );
    desc3492.putReference( idnull, ref38 );
    var idT = charIDToTypeID( "T   " );
        var ref39 = new ActionReference();
        ref39.putName( idChnl, channelName );
    desc3492.putReference( idT, ref39 );
    executeAction( idsetd, desc3492, DialogModes.NO );
}

function jsPh_selection2Mask() {
    var idMk = charIDToTypeID( "Mk  " );
    var desc2155 = new ActionDescriptor();
    var idNw = charIDToTypeID( "Nw  " );
    var idChnl = charIDToTypeID( "Chnl" );
    desc2155.putClass( idNw, idChnl );
    var idAt = charIDToTypeID( "At  " );
    var ref29 = new ActionReference();
    var idMsk = charIDToTypeID( "Msk " );
    ref29.putEnumerated( idChnl, idChnl, idMsk );
    desc2155.putReference( idAt, ref29 );
    var idUsng = charIDToTypeID( "Usng" );
    var idUsrM = charIDToTypeID( "UsrM" );
    var idRvlS = charIDToTypeID( "RvlS" );
    desc2155.putEnumerated( idUsng, idUsrM, idRvlS );
    executeAction( idMk, desc2155, DialogModes.NO );
}

function jsPh_DellChanell (maskName) { //
    var idDlt = charIDToTypeID( "Dlt " );
    var desc16024 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref27 = new ActionReference();
    var idChnl = charIDToTypeID( "Chnl" );
    ref27.putName( idChnl, maskName );
    desc16024.putReference( idnull, ref27 );
    executeAction( idDlt, desc16024, DialogModes.NO );
}

function jsPh_takeSnaphot (myName) { //сделать снимок
    //myName = " " "My""";
    var idMk = charIDToTypeID( "Mk  " );
    var desc1038 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref3 = new ActionReference();
        var idSnpS = charIDToTypeID( "SnpS" );
        ref3.putClass( idSnpS );
    desc1038.putReference( idnull, ref3 );
    var idFrom = charIDToTypeID( "From" );
        var ref4 = new ActionReference();
        var idHstS = charIDToTypeID( "HstS" );
        var idCrnH = charIDToTypeID( "CrnH" );
        ref4.putProperty( idHstS, idCrnH );
    desc1038.putReference( idFrom, ref4 );
    var idNm = charIDToTypeID( "Nm  " );
    desc1038.putString( idNm, myName);
    var idUsng = charIDToTypeID( "Usng" );
    var idFllD = charIDToTypeID( "FllD" );
    desc1038.putEnumerated( idUsng, idHstS, idFllD );
    executeAction( idMk, desc1038, DialogModes.NO );
}

function jsPh_selectMask () { //выбор маски слоя
	var idslct = charIDToTypeID( 'slct' );
	var desc12 = new ActionDescriptor();
	var idnull = charIDToTypeID( 'null' );
	var ref9 = new ActionReference();
	var idChnl = charIDToTypeID( 'Chnl' );
	var idMsk = charIDToTypeID( 'Msk ' );
	ref9.putEnumerated( idChnl, idChnl, idMsk );
	desc12.putReference( idnull, ref9 );
	var idMkVs = charIDToTypeID( 'MkVs' );
	desc12.putBoolean( idMkVs, false );
	executeAction( idslct, desc12, DialogModes.NO );
}

function jsPh_MaskAsSelection () { //загрузить выделение из маски
	var idsetd = charIDToTypeID( 'setd' );
	var desc9 = new ActionDescriptor();
	var idnull = charIDToTypeID( 'null' );
	var ref5 = new ActionReference();
	var idChnl = charIDToTypeID( 'Chnl' );
	var idfsel = charIDToTypeID( 'fsel' );
	ref5.putProperty( idChnl, idfsel );
	desc9.putReference( idnull, ref5 );
	var idT = charIDToTypeID( 'T   ' );
	var ref6 = new ActionReference();
	var idOrdn = charIDToTypeID( 'Ordn' );
	var idTrgt = charIDToTypeID( 'Trgt' );
	ref6.putEnumerated( idChnl, idOrdn, idTrgt );
	desc9.putReference( idT, ref6 );
	executeAction( idsetd, desc9, DialogModes.NO );
}