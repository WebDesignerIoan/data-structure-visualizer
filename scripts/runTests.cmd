@echo off

cd /d %~dp0..

echo Running tests...

npm test

pause