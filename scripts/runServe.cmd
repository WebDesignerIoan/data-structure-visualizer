@echo off

cd /d %~dp0..

echo Starting development server...

npx serve .

pause