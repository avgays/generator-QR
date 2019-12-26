jsPh_takeSnaphot('tempCurve');

if (params.curve) {
    var idCrvs = charIDToTypeID( "Crvs" );
    var desc152 = new ActionDescriptor();
    var idpresetKind = stringIDToTypeID( "presetKind" );
    var idpresetKindType = stringIDToTypeID( "presetKindType" );
    var idpresetKindCustom = stringIDToTypeID( "presetKindCustom" );
    desc152.putEnumerated( idpresetKind, idpresetKindType, idpresetKindCustom );
    var idAdjs = charIDToTypeID( "Adjs" );
        var list1 = new ActionList();
            var desc153 = new ActionDescriptor();
            var idChnl = charIDToTypeID( "Chnl" );
                var ref3 = new ActionReference();
                var idChnl = charIDToTypeID( "Chnl" );
                var idChnl = charIDToTypeID( "Chnl" );
                var idCmps = charIDToTypeID( "Cmps" );
                ref3.putEnumerated( idChnl, idChnl, idCmps );
            desc153.putReference( idChnl, ref3 );
            var idCrv = charIDToTypeID( "Crv " );
                var list2 = new ActionList();
                    var desc154 = new ActionDescriptor();
                    var idHrzn = charIDToTypeID( "Hrzn" );
                    desc154.putDouble( idHrzn, 179.000000 );
                    var idVrtc = charIDToTypeID( "Vrtc" );
                    desc154.putDouble( idVrtc, 0.000000 );
                var idPnt = charIDToTypeID( "Pnt " );
                list2.putObject( idPnt, desc154 );
                    var desc155 = new ActionDescriptor();
                    var idHrzn = charIDToTypeID( "Hrzn" );
                    desc155.putDouble( idHrzn, 255.000000 );
                    var idVrtc = charIDToTypeID( "Vrtc" );
                    desc155.putDouble( idVrtc, 255.000000 );
                var idPnt = charIDToTypeID( "Pnt " );
                list2.putObject( idPnt, desc155 );
            desc153.putList( idCrv, list2 );
        var idCrvA = charIDToTypeID( "CrvA" );
        list1.putObject( idCrvA, desc153 );
    desc152.putList( idAdjs, list1 );
    executeAction( idCrvs, desc152, DialogModes.NO );
}
//alert ("Curve " + params.curve);

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