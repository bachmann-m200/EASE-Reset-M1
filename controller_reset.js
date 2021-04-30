loadModule('/Bachmann/Device');
loadModule('/System/UI');
loadModule('/Bachmann/Catalog');
loadModule('/System/Resources');

include('utils.js')

// Choice CPU from Navigator
device = getDevice();
print(device)
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
unzip(catalog.path, "c:/temp/catalog/")

mem = device.getController().onlineModel.deviceInfo.getGeneralInfo().getBootDevice().replace("/","").replace("/","")
devAdr = device.getController().onlineModel.deviceInfo.m1Controller.connectionInfo.address
devType = getCpuName(CPUInfo.mioType, CPUInfo.mioVariant)
bootDev = device.getController().onlineModel.deviceInfo.getGeneralInfo().getBootDevice().replace("/","").replace("/","")

// Ask create Offline Device yes/no
if (showQuestionDialog("Would you like to create a offline device,\nbefore reset it?", "Backup")){
	devName = showInputDialog("Please enter a name of the offline device!", 'M200', 'Offline device name')	
	// TODO: make sure a link to a solution project will be used in first parameter, even if sub folder is selected
	createOfflineDevice(showFolderSelectionDialog('workspace://')+'/_templates', devName, devAdr, devType, [mem, "nvram0"], bootDev) // Add additional memories if needed
	// TODO: Copy all files:
	
// -yes Create Offline Device
}


// Delete Online Device


// are keys in keys folder


// -yes Ask delete licences yes/no


// -yes delete keys folder


// copy files from catalog to device


