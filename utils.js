	function getCatalog(selection) {
		var version = java.lang.System.getProperty("SolutionCenter.version")
				.replace(" ", "");
		version = version.substr(0, version.search("Branch"))
	
		mbase = selection.slice(7)
	
		if (mbase == "4.00 Release")
			mbase = "4_00r99";
		else if (mbase == "4.10 Release")
			mbase = "4_10r99";
		else if (mbase.endsWith("Release"))
			mbase = mbase.replace(" Release", "_99")
		else
			mbase = mbase.replace(" MS", "_")
	
		mbase = mbase.replace(".", "_").split("_")
		if (mbase[2]) {
			if (mbase[2].length == 1)
				mbase[2] = "0" + mbase[2]
			mbase = mbase[0] + "_" + mbase[1] + "_" + mbase[2]
		} else
			mbase = mbase[0] + "_" + mbase[1]
	
		var catalogs = findFiles(
				"at.bachmann.app.dman.systemcatalog" + mbase + "*",
				"C:/bachmann/SolutionCenter/" + version + "/plugins")
		if (!catalogs[0]) {
			showErrorDialog("Could not find any catalog with " + selection
					+ "!\nPlease restart and choose another one!")
			return -1
		} else
			return {
				path : catalogs[0],
				vers : mbase
			}
	}
	
	function getCpuName(type, variant) {
		switch (type) {
		case 49: 
			return 'MPC2XX'
		case 50: 
			return 'MX2XX'
		case 97: 
			switch (variant) {
			case 2:	
				return 'MC206/212';
			case 3:
				return 'MC206/212';
			case 0:
				return 'MC205/210';
			case 1:
				return 'MC205/210';
			case 4:
				return 'MC220';
			}
		case 82:
			switch (variant) {
			case 0 - 1:
				return 'MH212'
			case 2:
				return 'MH230'
			}
		}
	
	}

	function getSolutionProjectName(str){
		const regex = /workspace:..\S*?\//gm;
		let m;
		var result;

		while ((m = regex.exec(str)) !== null) {
		    // This is necessary to avoid infinite loops with zero-width matches
		    if (m.index === regex.lastIndex) {
		        regex.lastIndex++;
		    }
		    
		    // The result can be accessed through the `m`-variable.
		    m.forEach((match, groupIndex) => {
		    	return match;
		    });
		}
//		return result
	}