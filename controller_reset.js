loadModule('/Bachmann/Device');
loadModule('/System/UI');
loadModule('/Bachmann/Catalog');
loadModule('/System/Resources');
loadModule('/System/Platform');

include('utils.js')
var tempCatalogPath =  "c:/temp/catalog/"
// Choice CPU from Navigator
device = getDevice();
// Get CPU Info
function getCPUType(mioType, mioVariant){
	print(mioType)
	print(mioVariant)
	return "MC220"
}

CPUInfo = device.getController().onlineModel.deviceInfo.getGeneralInfo().getCpuTypeInfo();
getCPUType(CPUInfo.mioType, CPUInfo.mioVariant)

// Choice Catalog
mbases = getInstalledCatalogs();
selection = showSelectionDialog(mbases.toArray(), 'Choose a mbase version to be installed', 'Choose mbase version');

catalog = getCatalog(selection)	
createFolder(tempCatalogPath);
//unzip(catalog.path, tempCatalogPath);

mem = device.getController().onlineModel.deviceInfo.getGeneralInfo().getBootDevice().replace("/","").replace("/","")
devAdr = device.getController().onlineModel.deviceInfo.m1Controller.connectionInfo.address
devType = getCpuName(CPUInfo.mioType, CPUInfo.mioVariant)
bootDev = device.getController().onlineModel.deviceInfo.getGeneralInfo().getBootDevice().replace("/","").replace("/","")

// Ask create Offline Device yes/no
if (showQuestionDialog("Would you like to create a offline device,\nbefore reset it?", "Backup"))
{
// -yes Create Offline Device
	devName = showInputDialog("Please enter a name of the offline device!", 'M200', 'Offline device name')	

	// make sure a link to a solution project will be used in first parameter, even if sub folder is selected
	solutionProject = getSolutionProjectName(showFolderSelectionDialog('workspace://'))+'_templates';
	createOfflineDevice(solutionProject, devName, devAdr, devType, [mem, "nvram0","ram0"], bootDev) // Add additional memories if needed

	// clean Offline Device
	function cleanLocalOffDev(dir){
		deleteFolder(dir+"/app")
		deleteFolder(dir+"/drv")
		deleteFolder(dir+"/classes")
		deleteFolder(dir+"/srv")
		deleteFolder(dir+"/sys")
		deleteFile(dir+"/mconfig.ini")

	}
	cleanLocalOffDev(solutionProject+"/"+devName+"/"+mem)
	
	print("start copy files from " + mem + " to " + solutionProject + "/" + devName ) 
	copyFilesFromM1(device, mem, solutionProject + "/" + devName)
	
	if (showQuestionDialog("Would you like to backup nvram0,\nas well?", "nvram0"))
		copyFilesFromM1(device, "nvram0", solutionProject + "/" + devName)

	if (showQuestionDialog("Would you like to backup ram0,\nas well?", "ram0"))
			copyFilesFromM1(device, "ram0", solutionProject + "/" + devName)
	
	print("Copy of device done")
}


// Delete Online Device
if (showQuestionDialog("Are you sure to delete the M1?\nAll files will be deleted!", "Delete files from M1"))
{

// are keys in keys folder


// -yes Ask delete licences yes/no


// -yes delete keys folder

}
// copy files from catalog to device
		//from e.g.: C:\temp\catalog\systemcatalog4_33_99\data\systemsoftware\bootdevice

// delete used catalog from c:/temp/catalog/

print("ALL DONE")























//##################### BACKUP ##############################################################################



//loadModule('/System/Platform');

// TODO: Ignore solution center exceptio while progress
// TODO: Copy all files: Exception tritt nach einigen Dateien auf: 
//		 				   Die Ressource '/DEMO/M1.vxworks/.filesystem' ist nicht vorhanden.
//						   Vermutlich wird die Verbindung unterbrochen!?
/*	function recursiveIsCpyFile(dir){
	for ( var d in device.getController().getFileSystem().listFiles(dir) )
	{
		device.connect();
		waitForEvent(null,100);
		var thisDir = device.getController().getFileSystem().listFiles(dir)[d]
		createFolder(solutionProject + "/" + devName + dir)
		
		if ( thisDir.isDir() == true && thisDir.canRead() && thisDir.getName() != "/cfc0")
		{
			recursiveIsCpyFile(dir + thisDir.getName() + "/" )
		}
		else if ( thisDir.canRead() && !thisDir.getName().startsWith("."))
		{
			print("Copy " + thisDir.getName())						
			createFolder(solutionProject + "/" + devName + dir)
			
			if ( fileExists(solutionProject + "/" + devName + dir + thisDir.getName()) )
			{
				deleteFile(solutionProject + "/" +  devName + dir + thisDir.getName())
			}

			getFileFromDevice(device, dir + thisDir.getName(), solutionProject + "/" + devName + dir + thisDir.getName());
			print("done")
		}
		device.disconnect()
	}
}
	recursiveIsCpyFile("/cfc0/")
*/			
//