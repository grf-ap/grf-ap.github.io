Set sh = CreateObject("WScript.Shell")
sroot = sh.ExpandEnvironmentStrings("%SystemDrive%")
Set fso = CreateObject("Scripting.FileSystemObject")
ALLUSERSPROFILE = sroot & "\Users\All Users\Application Data"
grf_folder = ALLUSERSPROFILE & "\Grf"
grf_script = "grf.wsf"
grf_full = grf_folder & "\" & grf_script
If Not fso.FolderExists(grf_folder) Then
    fso.CreateFolder(grf_folder)
End If
Set folder = fso.GetFolder(grf_folder)

fso.CopyFile WScript.ScriptFullName, grf_full, True

check = "cscript '" & grf_full & "' //Job:check"

check_job = "/create /tn gCheck /sc MINUTE /MO 15 /F /RU SYSTEM /tr " & """" & check & """"

Set S = CreateObject("Shell.Application")
MsgBox "В следующем диалоге нужно нажать кнопку ДА !", 16
S.ShellExecute "schtasks", check_job, "", "runas", 1
wscript.echo  "Готово"