@echo off
cd /d %~dp0
color 0F
title KrkrExtract Fast Launcher
mode con: cols=80 lines=25
set exepath=none
set fastboot=Fast BOOT!
set input=%1
call :trans
if not %input%=="" (
  if %input%=="CONSOLE" (
    goto Console
  ) else goto fastboot
)
set fastboot=
:0
set input=""
cls
echo Make sure that this bat and KrkrExtract are in the same place, then drag the
echo game's main program to here then press the Enter key to launch Krkrextract.
echo Or you can input the path manually then press the Enter key.
echo.
echo Sepcial Command:
echo     /help    - Read help
echo     /opf     - Open output folder
echo     /root    - Open KrkrExtract root folder
echo     /console - Open console
echo.
if not %exepath%==none (
  echo If you don't input the path, the launcher will launch KrkrExtract with the last
  echo inputted path.
  echo Last inputted path: %exepath%
  echo.
)
set /p input=INPUT: 
call :trans
:fastboot
if %input%=="" (
  if %exepath%==none (
    goto 0
  )
) else (
  if /i %input%=="/help" (
    goto help
  ) else if /i %input%=="/opf" (
    start KrkrExtract_Output
    goto 0
  ) else if /i %input%=="/root" (
    start "" %cd%
    goto 0
  ) else if /i %input%=="/console" (
    start "" %0 CONSOLE
    goto 0
  ) else (
    if NOT EXIST %input% (
      cls
      echo ¡¾ !¡¿ERROR!
      <nul set /p=________________________________________________________________________________
      echo %input%
      echo does not exist!
      echo.
      echo Press any key return.
      pause >nul
      goto 0
    ) else (
      set exepath=%input%
    )
  )
)
cls
echo Launching...
echo.%fastboot%
set fastboot=
KrkrExtract %exepath%
goto 0
:trans
set trans="%input%"
set trans=%trans:"=%
set input="%trans%"
goto :eof
:help
cls
echo KrkrExtract Fast Launcher - A third party tool for KrkrExtract
<nul set /p=________________________________________________________________________________
echo A tool for resolving the problem that KrkrExtract 4.0.1.0 and later version
echo cannot be started in explorer without being with the game's main program in the
echo same directory.
echo.
echo You can drag the game's main program to this bat in explorer to launch
echo KrkrExtract quickly.
echo.
echo About Universal Dumper.
<nul set /p=Universal Dumper can only be used on KrkrZ core games. And it is unstable, so it
echo doesn't work sometimes.
echo To use, just click the button "!!Dump!!", and then KrkrExtract will extract all
echo files of the game.
echo.
echo Press any key return to the main page.
pause >nul
goto 0
:Console
cls
title Console
color 0F
cmd
exit