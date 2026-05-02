$path = 'C:\Users\User\demo-geoscale-en\whatsapp-message.txt'
$bytes = [System.IO.File]::ReadAllBytes($path)
if ($bytes.Length -lt 3 -or $bytes[0] -ne 0xEF -or $bytes[1] -ne 0xBB -or $bytes[2] -ne 0xBF) {
    $bom = [byte[]](0xEF, 0xBB, 0xBF)
    $newBytes = $bom + $bytes
    [System.IO.File]::WriteAllBytes($path, $newBytes)
    Write-Host 'BOM added'
} else {
    Write-Host 'BOM already present'
}
