function hexToInst() {
    //
    // CLEAR OUTPUT REGION
    //
    document.getElementById("output").innerHTML = "";
    document.getElementById("test").innerHTML = "";
    document.getElementById("outInst").innerHTML = "";
    // 
    // INPUT PARSING (HEX TO BINARY)
    //
    var inputString = document.getElementById("hex").value;

    if (inputString.length == 10) {
        inputString = inputString.replace("0x", "");
        inputString = inputString.replace("0X", "");
    }
    if (inputString.length != 8)
    {
        document.getElementById("output").innerHTML = "Error, check that input has correct number of bits";
        return;
    }
    var i, parsedString="";
    for (i = 0; i < inputString.length; i += 1) {    
        if (hexTable.hasOwnProperty(inputString[i]) == false) {
            parsedString = false
        } 
        else {
            parsedString = parsedString + hexTable[inputString[i]];
        }
    }
    if (parsedString == false){
        document.getElementById("output").innerHTML = "Error, check that input is valid hex";
        return;
    }

    //
    // DETERMINE INSTRUCTION (IF VALID)
    // 
    var opcode = parsedString.substring(0, 6);
    var operation = "";

    if (opcodeTable.hasOwnProperty(opcode)) {
        if (opcode == "000000") {
            operation = parsedString.substring(parsedString.length - 6, parsedString.length);
            operation = functTable[operation];
        } else {
            operation = opcodeTable[opcode];
        }
    } else {
        document.getElementById("output").innerHTML = "Opcode not recognized";
    }

    //
    // DETERMINE FIELD VALUES BASED ON INSTRUCTION TYPE
    //
    
    var instructionOut = "";
    
    var rs="", rd="", rt="", shamt="", imm="", target="";
    var rs_c="", rd_c="", rt_c="", shamt_c="", imm_c="", target_c="";

    rs = parsedString.substring(6, 11);
    rt = parsedString.substring(11, 16);
    rd = parsedString.substring(16, 21);
    shamt = parsedString.substring(21, 26);
    imm = parsedString.substring(16);
    target = parsedString.substring(6);

    shamt_c = "0x" + parseInt(shamt, 2).toString(16).toUpperCase();
    imm_c = "0x" + parseInt(imm, 2).toString(16).toUpperCase();
    target_c = "0x" + parseInt(target, 2).toString(16).toUpperCase();
   
    // Depending on desired register convention, prep fields for output
    if (document.getElementById("num_rad").checked) {
        rs_c = registerTableNum[rs];
        rt_c = registerTableNum[rt];
        rd_c = registerTableNum[rd];    
    }
    else {
        rs_c = registerTableName[rs];
        rt_c = registerTableName[rt];
        rd_c = registerTableName[rd];
    }
    
    // 
    // GET OUTPUT TEMPLATE FOR OPERATION AND SUBSTITUE REAL FIELD VALUES
    //
    instructionOut = formatTable[operation.toUpperCase()];
    instructionOut = instructionOut.replace("op", operation.toString());
    instructionOut = instructionOut.replace("rd", rd_c.toString());
    instructionOut = instructionOut.replace("rs", rs_c.toString());
    instructionOut = instructionOut.replace("rt", rt_c.toString());
    instructionOut = instructionOut.replace("sa", shamt_c.toString());
    instructionOut = instructionOut.replace("target", target_c.toString());
    instructionOut = instructionOut.replace("offset", imm_c.toString());
    instructionOut = instructionOut.replace("imm", imm_c.toString());


    //
    // OUTPUT RESULTS TO PAGE
    //
    document.getElementById("resultsHeader").innerHTML = "Results:";
    document.getElementById("outInst").innerHTML = "Instruction: " + instructionOut;
    document.getElementById("output").innerHTML = "Hex: 0x" + inputString;
    document.getElementById("test").innerHTML = "Binary: " + parsedString;
    
}