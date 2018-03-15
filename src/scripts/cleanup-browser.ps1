[CmdletBinding()]	
Param (
		[Parameter(Mandatory=$true)]
		[string]$Name
	)


Function Exit-script {
    param(
	    [string]$ErrorOutput
    )
    Throw $ErrorOutput
    Exit 0
}

Function Java-Cleanup {
    $javaDeploymentCache = "$env:USERPROFILE\AppData\LocalLow\Sun\Java\Deployment\cache\6.0"
    $javaDeploymentCache | % { Remove-Item -Recurse "$_\*" -Force -ErrorAction SilentlyContinue }
}

Function Cleanup-Chrome {
   #Get All Chrome Profiles for the Logged in User
    Try {
        $ChromeUserProfiles = Get-ChildItem -Path "$env:LocalAppdata\Google\Chrome\User Data\" -Force -ErrorAction Stop | ? { $_.BaseName.StartsWith("Profile") -or $_.BaseName -cmatch "Default"}
    } 
    catch [Exception]{
	    $ScriptError = $_.Exception.Message
        Exit-script -ErrorOutput $ScriptError
    }

    #Stop Chrome Process
    $null = Get-Process -Name "Chrome" -ErrorAction SilentlyContinue | Stop-process -PassThru -Force -ErrorAction SilentlyContinue

    #Copy-Item -Path "$($_.FullName)\Cache" -Destination $TempMSIPath -Force -ErrorAction SilentlyContinue

    #Clear Chrome Cache
    Try{
        $ChromeUserProfiles | % {
            $bookmarkFile = "$env:Temp\$([GUID]::NewGuid())"
            Copy-Item -Path "$($_.FullName)\Bookmarks" -Destination $bookmarkFile -Force -ErrorAction SilentlyContinue
            $_ | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
            $null = New-Item -ItemType Directory -Path $_.FullName
            Copy-Item -Path $bookmarkFile -Destination "$($_.FullName)\Bookmarks" -Force -ErrorAction SilentlyContinue
            $bookmarkFile | Remove-Item -Force -ErrorAction SilentlyContinue
    
        } 
    }
    catch [Exception]{
	    $ScriptError = $_.Exception.Message
        Exit-script -ErrorOutput $ScriptError
    } 

    Start-Process "Chrome"
}

Function Cleanup-IE {
    $IETracksIds = 4351
    #+256
    $IETracksIds | %{ Start-Process RunDll32 -WindowStyle Hidden -ArgumentList @("InetCpl.cpl,ClearMyTracksByProcess $_") -Wait -PassThru | Out-Null }

}



Invoke-Expression "Cleanup-$Name"



#Output
Write-Output( New-Object PSObject -Property @{ Action = "Success" } | ConvertTo-Json -Compress)