loadModule('/Bachmann/Device');
loadModule('/System/Resources');
loadModule('/System/Platform');

var m1  = getDevice()
var localDir = "C:/temp/device"
var cnt = 0

createFolder(localDir+"/cfc0/");
recursivGetFile("/cfc0/app")
createFolder(localDir+"/flash0");
recursivGetFile("/flash0/")
createFolder(localDir+"/nvram0");
recursivGetFile("/nvram0/")

print("Files copied: " + cnt)

function recursivGetFile(dirPath)
{
	var dir = m1.getController().getFileSystem().listFiles(dirPath)
	for ( f in dir )
	{
		m1.connect()
		var fPath = m1.getController().getFileSystem().listFiles(dirPath)[f].path
		var fName = m1.getController().getFileSystem().listFiles(dirPath)[f].name
		
		if (m1.getController().getFileSystem().listFiles(dirPath)[f].isDir())
		{
			m1.connect()
			createFolder(localDir + fPath)
			recursivGetFile(fPath)
		}
		else
		{
			waitForEvent(null,250);
			m1.connect()
			print(fPath + fName)
			getFileFromDevice(m1, fPath + fName, localDir + fPath + fName);
			waitForEvent(null,250);
			cnt += 1;
		}
	}
}