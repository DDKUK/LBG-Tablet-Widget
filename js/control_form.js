	function myFunction() {
			//Collect values ect and sumit them to scala here
    			document.getElementById("submit_button").style.color = "red";
	}

	$.ajax({
	    url: "http://localhost:8000//DMP.csv",
	    async: false,
	    success: function (csvd) {
	        data = $.csv2Array(csvd);
	    },
 	    dataType: "text",
	    complete: function () {
 	    // call a function on complete 
	    
	    headers = data[0];

	    data = data.splice(1, data.length - 1);
	    data = data.sort(compareBranchColumn);

	    for (var row in data)
	    {
		if (row >0){
			var option = document.createElement("option");
			option.value = data[row][headers.indexOf('Branch_Sort_Code')];
			option.text  = data[row][headers.indexOf('Branch_Sort_Code')] + ", " + data[row][headers.indexOf('Branch_Address')];
			var select = document.getElementById("selectbox");
			select.appendChild(option);
		}
	    }

	    function compareBranchColumn(a, b) {
    		if (a[headers.indexOf('Branch_Address')] === b[headers.indexOf('Branch_Address')]) {
    		    return 0;
    		}
    		else {
    		    return (a[headers.indexOf('Branch_Address')] < b[headers.indexOf('Branch_Address')]) ? -1 : 1;
    		}
	    }
	
        }
	});