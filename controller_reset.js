/* 
* name : M1 Reset
* image : platform:/plugin/at.bachmann.ui.solution/icons/deploy.png
* description : Reset M1 to a catalog version
* toolbar : Solution Navigator
* menu : Solution Navigator
*/
loadModule('/Bachmann/Device');
loadModule('/System/UI');
loadModule('/Bachmann/Catalog');
loadModule('/System/Resources');
loadModule('/System/Platform');

include('utils.js')
var tempCatalogPath =  "c:/temp/catalog/"
var keysFolder = "keys"

// Choose CPU from Navigator
var device = getDevice();
var partitions = device.getController().getFileSystem().getRoot().listFiles()

// Get CPU Info
CPUInfo = device.getController().onlineModel.deviceInfo.getGeneralInfo().getCpuTypeInfo();
// Get needen information from online device
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
	
	print("start copy files from " + device.getController().getName() + " to " + solutionProject + "/" + devName ) 

	for ( var drive in partitions)
	{
		if (showQuestionDialog("Would you like to backup " + partitions[drive].getName() + "\nas well?", partitions[drive].getName()))
			copyFilesFromM1(device, "/"+partitions[drive].getName(), solutionProject + "/" + devName)

	}
	print("Copy of device done")
}

// Delete Online Device
if (showQuestionDialog("Are you sure to format the memory of the M1?\n\nWill ask for each memory again!", "Delete files from M1"))
{
	var deleteKeys = null; // null = Startup; true = delete keys; false = keep keys
	
	function cleanDevice(m1,dir)
	{
		m1.connect()
		var thisDir = m1.getController().getFileSystem().listFiles(dir)
		for ( f in thisDir )
		{
			if ( thisDir[f].name.search(keysFolder) != -1 && deleteKeys == null)
			{
				// -Ask delete licences | no = continue -> next folder or file;
				if ( showQuestionDialog("!!! ATTENTION !!!\n\nFound keys on device.\nAre you sure to DELETE the key-files as well?", "Confirm delete of keys") == false )
					continue;
			}
			if (thisDir[f].canDelete())
				thisDir[f].delete()
		}		
	}
	for ( var drive in partitions)
	{
		if (showQuestionDialog("Would you like to delete " + partitions[drive].getName() + "\nas well?", partitions[drive].getName()))
			cleanDevice(device,"/"+partitions[drive].getName())	
	}
}
if (showQuestionDialog("Do you like to update your bootdevice "+mem, "Update "+mem))
{
// copy files from catalog to device
	// Choose Catalog
	mbases = getInstalledCatalogs();
	selection = showSelectionDialog(mbases.toArray(), 'Choose a mbase version to be installed', 'Choose mbase version');
	catalog = getCatalog(selection)	
	createFolder(tempCatalogPath);
	unzip(catalog.path, tempCatalogPath);
	
	var bootdevFiles = tempCatalogPath + "systemcatalog" + catalog.vers + "/data/systemsoftware/bootdevice"
	var regexArr = []
	
	function copyFilesToM1(m1, dir)
	{
		m1.connect()
		var files = findFiles('*', dir, true)
		for (var f in files)
		{
			regexArr[f] = new RegExp(/bootdevice.(.*)/gm);
			var result = regexArr[f].exec(files[f].path)			
			putFileToDevice(device, files[f].path, "/" + mem + "/" + result[1].replace(/\\/g, '/'));	
		}		
	}
	copyFilesToM1(device, bootdevFiles)

	// delete used catalog
	deleteFolder(tempCatalogPath); // TODO: Check why this is not deleting the catalog folder. Recursive delete?
}
if (showQuestionDialog("Do you like to reboot the M1 to complete reset?", "Reboot M1"))
	device.reboot()

showInfoDialog("Reset and/or update of choose device is finished", "Done");
