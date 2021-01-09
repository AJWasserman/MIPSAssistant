function instToHex() {
    //
    // CLEAR OUTPUT REGION
    //
    document.getElementById("output").innerHTML = "";
    document.getElementById("test").innerHTML = "";
    document.getElementById("outInst").innerHTML = "";


    // 
    // INPUT PARSING
    //
    var inputString = document.getElementById("inputInstruction").value;
    var parsedString = inputString.toLowerCase();

    parsedString = parsedString.replace(/,/g, ''); 
    parsedString = parsedString.replace(/\(/g, ' '); 
    parsedString = parsedString.replace(/\)/g, ' '); 
    parsedString = parsedString.trim(); 

    var inputFields = parsedString.split(' ');

    var instructionName = parsedString.split(' ')[0].toUpperCase();
    var opcode = "000000", funct="000000";
    
    //
    // Find opcode
    //
    var found = false;
    for (var property in opcodeTable) {
        if (opcodeTable.hasOwnProperty(property)) {
            if (opcodeTable[property] == instructionName) {
                opcode = property;
                found = true;
            }
        }
    }

    //
    // Find funct if opcode is SPECIAL
    //
    if (opcode == "000000") {
        for (var fun in functTable) {
            if (functTable.hasOwnProperty(fun)) {
                if (functTable[fun] == instructionName) {
                    funct = fun;
                    found = true;
                }
            }
        }
    }


    // If opcode/funct is invalid, exit and report error
    if (!found) {
        document.getElementById("outInst").innerHTML = "Invalid instruction";
        return;
    }

    

    //
    // Determine instruction type
    //
    var format = "";
    // R type instruction
	if(opcode == "000000"){
	    format = rFormat;
	}
	// J type instruction
	else if (opcode == "000010" || opcode == "000011"){
	    format = jFormat;
	}
	// I type instruction
	else {
	    format = iFormat;
    } 

    
    
    var instFormat = formatTable[instructionName];
    var instFields = instFormat;
    
    
    instFields = instFields.replace(/\(/, " ");
    instFields = instFields.replace(/\)/, " ");
    instFields = instFields.split(" ");

    var rs="$0", rd="$0", rt="$0", shamt="00000", imm="0000000000000000", target="00000000000000000000000000";
    var rs_c="00000", rd_c="00000", rt_c="00000", shamt_c="00000", imm_c="", target_c="";
    var i;
    for (i = 0; i < instFields.length; i++) {   
        if (instFields[i] == "rd") {
            rd = inputFields[i];
        }
        else if (instFields[i] == "rs") {
            rs = inputFields[i];
        }
        else if (instFields[i] == "rt") {
            rt = inputFields[i];
        }
        else if (instFields[i] == "offset") {
            imm = inputFields[i];
        }
        else if (instFields[i] == "imm") {
            imm = inputFields[i];
        }
        else if (instFields[i] == "sa") {
            shamt = inputFields[i];
        }
        else if (instFields[i] == "target") {
            target = inputFields[i];
        }
    }

    if (registerToBinary.hasOwnProperty(rd.toString())) {
        rd_c = registerToBinary[rd.toString()];
    } else {
        document.getElementById("outInst").innerHTML = "Invalid register";
        return;
    }
    if (registerToBinary.hasOwnProperty(rt.toString())) {
        rt_c = registerToBinary[rt.toString()];
    } else {
        document.getElementById("outInst").innerHTML = "Invalid register";
        return;
    }
    if (registerToBinary.hasOwnProperty(rs.toString())) {
        rs_c = registerToBinary[rs.toString()];
    } else {
        document.getElementById("outInst").innerHTML = "Invalid register";
        return;
    }

    shamt_c = parseInt(shamt, 16).toString(2);

    if (shamt_c.length > 5) {
        document.getElementById("outInst").innerHTML = "Invalid shift amount";
        return;
    }
    
    while (shamt_c.length < 5)
    {
        shamt_c = "0" + shamt_c;
    }

    if (format == iFormat) {
        imm = imm.toUpperCase();
        if (!imm.includes("0X")) {
            document.getElementById("output").innerHTML = "Error, check that immediate is in hex format";
            return;
        }
        imm = imm.replace("0x", "");
        imm = imm.replace("0X", "");
        var k, immTemp="";
        for (k = 0; k < imm.length; k += 1) {    
            if (hexTable.hasOwnProperty(imm[k]) == false) {
                immTemp = false;
                break;
            } 
            else {
                immTemp = immTemp + hexTable[imm[k]];
            }
        }
        if (immTemp == false){
            document.getElementById("output").innerHTML = "Error, check that immediate is valid hex";
            return;
        } else {
            imm_c = immTemp;
        }
        while (imm_c.length < 16) {
            imm_c = "0" + imm_c;
        }
    }

    if (format == jFormat) {
        target = target.toUpperCase();
        if (!target.includes("0X")) {
            document.getElementById("output").innerHTML = "Error, check that target is in hex format";
            return;
        }
        target = target.replace("0x", "");
        target = target.replace("0X", "");
        var o, targetTemp="";
        for (o = 0; o < target.length; o += 1) {    
            if (hexTable.hasOwnProperty(target[o]) == false) {
                targetTemp = "invalid";
                break;
            } 
            else {
                targetTemp = targetTemp + hexTable[target[o]];
            }
        }
        if (targetTemp == "invalid"){
            document.getElementById("output").innerHTML = "Error, check that target is valid hex";
            return;
        } else {
            target_c = targetTemp;
        }
        while (target_c.length < 26) {
            target_c = "0" + target_c;
        }
        target_c = target_c.substring(target_c.length-26);
    }


    var binaryOut = "";
    binaryOut = format;
    binaryOut = binaryOut.replace("op", opcode);
    binaryOut = binaryOut.replace("rd", rd_c);
    binaryOut =  binaryOut.replace("rs", rs_c);
    binaryOut = binaryOut.replace("rt", rt_c);
    binaryOut = binaryOut.replace("sa", shamt_c);
    binaryOut = binaryOut.replace("imm", imm_c);
    binaryOut = binaryOut.replace("offset", imm_c);
    binaryOut = binaryOut.replace("funct", funct);
    binaryOut = binaryOut.replace("target", target_c);
    binaryOut = binaryOut.replace(/\s/g, "");

    //
    // Make sure output hex is 8 digits
    //
    var hexOut ="";
    hexOut = parseInt(binaryOut, 2).toString(16).toUpperCase();
    while (hexOut.length < 8) {
        hexOut = "0" + hexOut;
    }

    //
    // OUTPUT RESULTS TO PAGE
    //
    document.getElementById("resultsHeader").innerHTML = "Results:";
    document.getElementById("outInst").innerHTML = "Instruction: " + inputString.replace(/,/g, "");

    document.getElementById("output").innerHTML = "Hex: 0x" + hexOut;
    document.getElementById("test").innerHTML = "Binary: " + binaryOut;
}


