// this function verifies disk space in kilobytes
function verifyDiskSpace(dirPath, spaceRequired)
{
  var spaceAvailable;

  // Get the available disk space on the given path
  spaceAvailable = fileGetDiskSpaceAvailable(dirPath);

  // Convert the available disk space into kilobytes
  spaceAvailable = parseInt(spaceAvailable / 1024);

  // do the verification
  if(spaceAvailable < spaceRequired)
  {
    logComment("Insufficient disk space: " + dirPath);
    logComment("  required : " + spaceRequired + " K");
    logComment("  available: " + spaceAvailable + " K");
    return(false);
  }

  return(true);
}

var srDest = 1;

var err = initInstall("JavaScript Debugger", "venkman",
                      "0.9.87.4"); 

logComment("initInstall: " + err);

if (verifyDiskSpace(getFolder("Program"), srDest))
{
    addFile("JavaScript Debugger", "chrome/venkman.jar",
            getFolder("Chrome"), "");

    addFile("JavaScript Debugger Service", "components/venkman-service.js",
            getFolder("Components"), "");

    registerChrome(CONTENT | DELAYED_CHROME, 
                   getFolder("Chrome","venkman.jar"),
                   "content/venkman/");
    registerChrome(CONTENT | DELAYED_CHROME, 
                   getFolder("Chrome","venkman.jar"),
                   "content/venkman/sm/");
    registerChrome(LOCALE | DELAYED_CHROME, 
                   getFolder("Chrome", "venkman.jar"),
                   "locale/en-US/venkman/");
    registerChrome(SKIN | DELAYED_CHROME, 
                   getFolder("Chrome", "venkman.jar"),
                   "skin/modern/venkman/");

    if (err==SUCCESS)
        performInstall(); 
    else
        cancelInstall(err);
}
else
    cancelInstall(INSUFFICIENT_DISK_SPACE);
