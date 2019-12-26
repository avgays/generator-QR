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

var snapshot = mydoc.historyStates.getByName('temp');
mydoc.activeHistoryState = snapshot;

// =======================================================
var idautoCutout = stringIDToTypeID( "autoCutout" );
    var desc2139 = new ActionDescriptor();
    var idsampleAllLayers = stringIDToTypeID( "sampleAllLayers" );
    desc2139.putBoolean( idsampleAllLayers, false );
executeAction( idautoCutout, desc2139, DialogModes.NO );

// =======================================================
var idsetd = charIDToTypeID( "setd" );
    var desc2140 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref25 = new ActionReference();
        var idPrpr = charIDToTypeID( "Prpr" );
        var idQucM = charIDToTypeID( "QucM" );
        ref25.putProperty( idPrpr, idQucM );
        var idDcmn = charIDToTypeID( "Dcmn" );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref25.putEnumerated( idDcmn, idOrdn, idTrgt );
    desc2140.putReference( idnull, ref25 );
executeAction( idsetd, desc2140, DialogModes.NO );

// =======================================================
var idslct = charIDToTypeID( "slct" );
    var desc2141 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref26 = new ActionReference();
        var idmagicWandTool = stringIDToTypeID( "magicWandTool" );
        ref26.putClass( idmagicWandTool );
    desc2141.putReference( idnull, ref26 );
    var iddontRecord = stringIDToTypeID( "dontRecord" );
    desc2141.putBoolean( iddontRecord, true );
    var idforceNotify = stringIDToTypeID( "forceNotify" );
    desc2141.putBoolean( idforceNotify, true );
executeAction( idslct, desc2141, DialogModes.NO );


//////////// jsPh_selectCenter((params.width / 2) , (params.height / 2));
jsPh_selectCenter((mydoc.width / 2) , (mydoc.height / 2));


// =======================================================
var idInvs = charIDToTypeID( "Invs" );
executeAction( idInvs, undefined, DialogModes.NO );

// =======================================================
var idFl = charIDToTypeID( "Fl  " );
    var desc2150 = new ActionDescriptor();
    var idUsng = charIDToTypeID( "Usng" );
    var idFlCn = charIDToTypeID( "FlCn" );
    var idBlck = charIDToTypeID( "Blck" );
    desc2150.putEnumerated( idUsng, idFlCn, idBlck );
    var idOpct = charIDToTypeID( "Opct" );
    var idPrc = charIDToTypeID( "#Prc" );
    desc2150.putUnitDouble( idOpct, idPrc, 100.000000 );
    var idMd = charIDToTypeID( "Md  " );
    var idBlnM = charIDToTypeID( "BlnM" );
    var idNrml = charIDToTypeID( "Nrml" );
    desc2150.putEnumerated( idMd, idBlnM, idNrml );
executeAction( idFl, desc2150, DialogModes.NO );


// =======================================================
var idCler = charIDToTypeID( "Cler" );
    var desc2154 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref28 = new ActionReference();
        var idPrpr = charIDToTypeID( "Prpr" );
        var idQucM = charIDToTypeID( "QucM" );
        ref28.putProperty( idPrpr, idQucM );
        var idDcmn = charIDToTypeID( "Dcmn" );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref28.putEnumerated( idDcmn, idOrdn, idTrgt );
    desc2154.putReference( idnull, ref28 );
executeAction( idCler, desc2154, DialogModes.NO );

jsPh_saveSelection("22");



var myProxyDoc = mydoc.duplicate();
var angle = 0;
var bestAngle = 0;
var bestSquare = 100000000;
var mybounds, square;
var best = false;
myProxyDoc.resizeImage(700, null, null, ResampleMethod.BICUBIC);

jsPh_loadSelection("22");
jsPh_selection2Mask();

jsPh_takeSnaphot("My");
var snapshot = myProxyDoc.historyStates.getByName("My");
while (angle < 5) {
    jsPh_selectMask ();
    jsPh_MaskAsSelection ();
    mybounds = myProxyDoc.selection.bounds;
    square = (mybounds[2] - mybounds[0]) * (mybounds[3] - mybounds[1]);
    if (square > bestSquare) {
        break;
    } else {
        bestAngle = angle;
        bestSquare = square;
        angle += 0.3;
        myProxyDoc.rotateCanvas(0.3);
    }
}
if (bestAngle==0) {
    myProxyDoc.activeHistoryState = snapshot;
    angle = 0;
    while (angle > -5) {
        jsPh_selectMask ();
        jsPh_MaskAsSelection ();
        mybounds = myProxyDoc.selection.bounds;
        square = (mybounds[2] - mybounds[0]) * (mybounds[3] - mybounds[1]); 
        if (square > bestSquare) {
            break;
        } else {
            bestAngle = angle;
            bestSquare = square;
            angle -= 0.3;
            myProxyDoc.rotateCanvas(-0.3);
        }
    }
}
myProxyDoc.close(SaveOptions.DONOTSAVECHANGES);


mydoc.rotateCanvas(bestAngle);
jsPh_loadSelection();
var mybounds = mydoc.selection.bounds;
var expand = 20;
var myRegion = [ [mybounds[0]-expand, mybounds[1]-expand], [mybounds[2]+expand, mybounds[1]-expand], [mybounds[2]+expand,mybounds[3]+expand], [mybounds[0]-expand,mybounds[3]+expand], [mybounds[0]-expand,mybounds[1]-expand]];
mydoc.selection.select(myRegion);


// =======================================================
var idMk = charIDToTypeID( "Mk  " );
    var desc2155 = new ActionDescriptor();
    var idNw = charIDToTypeID( "Nw  " );
    var idChnl = charIDToTypeID( "Chnl" );
    desc2155.putClass( idNw, idChnl );
    var idAt = charIDToTypeID( "At  " );
        var ref29 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idChnl = charIDToTypeID( "Chnl" );
        var idMsk = charIDToTypeID( "Msk " );
        ref29.putEnumerated( idChnl, idChnl, idMsk );
    desc2155.putReference( idAt, ref29 );
    var idUsng = charIDToTypeID( "Usng" );
    var idUsrM = charIDToTypeID( "UsrM" );
    var idRvlS = charIDToTypeID( "RvlS" );
    desc2155.putEnumerated( idUsng, idUsrM, idRvlS );
executeAction( idMk, desc2155, DialogModes.NO );

//mydoc.rotateCanvas(bestAngle);

mydoc.saveAs(new File(params.filename + ".psd")); 

//mydoc.selection.select(myRegion);
jsPh_MaskAsSelection ();
jsPh_Crop ();
mydoc.exportDocument(new File(params.filename + ".jpg"), ExportType.SAVEFORWEB, expJPG);

mydoc.close(SaveOptions.DONOTSAVECHANGES);

app.displayDialogs = startDisplayDialogs;
app.preferences.rulerUnits = startRulerUnits;
app.preferences.typeUnits = startTypeUnits;





////////////////////////////////////////////////////////////////

function jsPh_Crop () {
	var idCrop = charIDToTypeID( 'Crop' );
	var desc4 = new ActionDescriptor();
	var idDlt = charIDToTypeID( 'Dlt ' );
	desc4.putBoolean( idDlt, true );
	executeAction( idCrop, desc4, DialogModes.NO );
}

function jsPh_takeSnaphot (snaphotName) {
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
//    desc1038.putString( idNm, """My""" );
    desc1038.putString( idNm, snaphotName );
    var idUsng = charIDToTypeID( "Usng" );
    var idFllD = charIDToTypeID( "FllD" );
    desc1038.putEnumerated( idUsng, idHstS, idFllD );
    executeAction( idMk, desc1038, DialogModes.NO );
}

function jsPh_MaskAsSelection () {
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
function jsPh_selectMask () { //выбор слоя маски
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

function jsPh_saveSelection(selName) {
    var idDplc = charIDToTypeID( "Dplc" );
    var desc2396 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref33 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idfsel = charIDToTypeID( "fsel" );
        ref33.putProperty( idChnl, idfsel );
    desc2396.putReference( idnull, ref33 );
    var idNm = charIDToTypeID( "Nm  " );
    desc2396.putString( idNm, selName );
//    desc2396.putString( idNm, """22""" );
executeAction( idDplc, desc2396, DialogModes.NO );
}

function jsPh_loadSelection(selName) {
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
        //ref39.putName( idChnl, "22" );
        ref39.putName( idChnl, selName );
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


function jsPh_selectCenter(x,y) {
var idsetd = charIDToTypeID( "setd" );
    var desc2142 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref27 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idfsel = charIDToTypeID( "fsel" );
        ref27.putProperty( idChnl, idfsel );
    desc2142.putReference( idnull, ref27 );
    var idT = charIDToTypeID( "T   " );
        var desc2143 = new ActionDescriptor();
        var idHrzn = charIDToTypeID( "Hrzn" );
        var idPxl = charIDToTypeID( "#Pxl" );
        //desc2143.putUnitDouble( idHrzn, idPxl, 3775.000000 );
        desc2143.putUnitDouble( idHrzn, idPxl, x );
        var idVrtc = charIDToTypeID( "Vrtc" );
        //desc2143.putUnitDouble( idVrtc, idPxl, 2479.000000 );
        desc2143.putUnitDouble( idVrtc, idPxl, y );
    var idPnt = charIDToTypeID( "Pnt " );
    desc2142.putObject( idT, idPnt, desc2143 );
    var idTlrn = charIDToTypeID( "Tlrn" );
    desc2142.putInteger( idTlrn, 32 );
    var idAntA = charIDToTypeID( "AntA" );
    desc2142.putBoolean( idAntA, true );
    executeAction( idsetd, desc2142, DialogModes.NO );
}

"Saved: " + params.filename + ".psd Rotated: " + bestAngle + ".";