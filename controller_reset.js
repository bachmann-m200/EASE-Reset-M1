loadModule('/Bachmann/Device');
loadModule('/System/UI');
loadModule('/Bachmann/Catalog');
loadModule('/System/Resources');


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
function getCatalog(selection){
	var version  = java.lang.System.getProperty("SolutionCenter.version").replace(" ","");
	version = version.substr(0,version.search("Branch"))
	
	mbase = selection.slice(7)
	
	if(mbase == "4.00 Release")
		mbase = "4_00r99";
	else if(mbase == "4.10 Release")
		mbase = "4_10r99";
	else if (mbase.endsWith("Release"))
		mbase = mbase.replace(" Release","_99")
	else
		mbase = mbase.replace(" MS","_")
		
	mbase = mbase.replace(".","_").split("_")
	if(mbase[2]){
		if(mbase[2].length == 1)
			mbase[2] = "0"+mbase[2]
		mbase = mbase[0]+"_"+mbase[1]+"_"+mbase[2]
	}
	else
		mbase = mbase[0]+"_"+mbase[1]
	
	var catalogs =  findFiles("at.bachmann.app.dman.systemcatalog"+mbase+"*","C:/bachmann/SolutionCenter/"+version+"/plugins")
	if(!catalogs[0]){
		showErrorDialog("Could not find any catalog with " + selection +"!\nPlease restart and choose another one!")
		return -1
	}
	else
		return {path:catalogs[0],vers:mbase}
}

mbases = getInstalledCatalogs();
selection = showSelectionDialog(mbases.toArray(), 'Choose a mbase version to be installed', 'Choose mbase version');

catalog = getCatalog(selection)
print(catalog.path)
print(catalog.vers)

unzip(catalog.path, "c:/temp/catalog/")


// Ask create Offline Device yes/no

if (showQuestionDialog("Would you like to create a offline device,\nbefore reset it?", "Backup")){
	print("yes")
// -yes Create Offline Device
}


// Delete Online Device


// are keys in keys folder


// -yes Ask delete licences yes/no


// -yes delete keys folder


// copy files from catalog to device


