if (ExternalObject.AdobeXMPScript == undefined) ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript');

var startDisplayDialogs = app.displayDialogs;
var	startRulerUnits = app.preferences.rulerUnits;
var	startTypeUnits = app.preferences.typeUnits;    
    
app.displayDialogs = DialogModes.NO;
app.preferences.rulerUnits = Units.PIXELS;
app.preferences.typeUnits = TypeUnits.PIXELS;

var mydoc = app.open(new File(params.filename));

if (params.fileType==='.psd') {
    jsPh_Mask2Chanell('maskTmp');
}

jsPh_takeSnaphot('temp');
mydoc.crop(new Array (0,0,(mydoc.width.value/3),(mydoc.height.value)));

var xmp = new XMPMeta(mydoc.xmpMetadata.rawData); 
var myDistance = xmp.getProperty(XMPConst.NS_EXIF_AUX,"ApproximateFocusDistance");
if (myDistance ) {
    myDistance  = myDistance.value.split('/')[0] / myDistance.value.split('/')[1]; 
} else {
    myDistance  = 0;
}
var Exposure = xmp.getProperty(XMPConst.NS_EXIF,"ExposureTime");
Exposure = (Exposure)?Exposure.value:0;

var FNumber = xmp.getProperty(XMPConst.NS_EXIF,"FNumber");
FNumber = (FNumber)?FNumber.value:"14/1";


app.displayDialogs = startDisplayDialogs;
app.preferences.rulerUnits = startRulerUnits;
app.preferences.typeUnits = startTypeUnits;


function jsPh_Mask2Chanell (maskName) { //
    var idslct = charIDToTypeID( "slct" );
    var desc608 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref14 = new ActionReference();
    var idChnl = charIDToTypeID( "Chnl" );
    var idMsk = charIDToTypeID( "Msk " );
    ref14.putEnumerated( idChnl, idChnl, idMsk );
    desc608.putReference( idnull, ref14 );
    executeAction( idslct, desc608, DialogModes.NO );

    var idDplc = charIDToTypeID( "Dplc" );
    var desc9968 = new ActionDescriptor();
    var ref25 = new ActionReference();
    var idOrdn = charIDToTypeID( "Ordn" );
    var idTrgt = charIDToTypeID( "Trgt" );
    ref25.putEnumerated( idChnl, idOrdn, idTrgt );
    desc9968.putReference( idnull, ref25 );
    var idNm = charIDToTypeID( "Nm  " );
    desc9968.putString( idNm, maskName );
    executeAction( idDplc, desc9968, DialogModes.NO );

    var idDlt = charIDToTypeID( "Dlt " );
    var desc1428 = new ActionDescriptor();
    var ref20 = new ActionReference();
    ref20.putEnumerated( idChnl, idChnl, idMsk );
    desc1428.putReference( idnull, ref20 );
    executeAction( idDlt, desc1428, DialogModes.NO );
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


myDistance + ";" + Exposure + ";" + FNumber;