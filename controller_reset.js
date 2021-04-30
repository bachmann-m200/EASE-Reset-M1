loadModule('/Bachmann/Device');
loadModule('/System/UI');
loadModule('/Bachmann/Catalog');
loadModule('/System/Resources');

include('utils.js')

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
print(catalog.path)
print(catalog.vers)
unzip(catalog.path, "c:/temp/catalog/")


// Ask create Offline Device yes/no

if (showQuestionDialog("Would you like to create a offline device,\nbefore reset it?", "Backup")){
	print("yes")
	createOfflineDevice(Object container, String name, String ip, String cpuName, String[] memoryMedium, String bootDevice) : Device;

// -yes Create Offline Device
}


// Delete Online Device


// are keys in keys folder


// -yes Ask delete licences yes/no


// -yes delete keys folder


// copy files from catalog to device


