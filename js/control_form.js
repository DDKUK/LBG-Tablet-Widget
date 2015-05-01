	function myFunction() {
			//Collect values ect and sumit them to scala here
    			document.getElementById("submit_button").style.color = "red";
	}

	$.ajax({
	    url: "http://localhost:8000//Contextulisation_data.csv",
	    async: false,
	    success: function (csvd) {
	        data = $.csv2Array(csvd);
	    },
 	    dataType: "text",
	    complete: function () {
 	    // call a function on complete 
	    
	    headers = data[0];

	    data = data.splice(5, data.length - 5);
	    data = data.sort(compareBranchColumn);

	    for (var row in data)
	    {
		if (row >0){
			var option = document.createElement("option");
			option.value = data[row][headers.indexOf('branch_Sortcode')];
			option.text  = data[row][headers.indexOf('branch_Sortcode')] + ", " + data[row][headers.indexOf('xxxxxx1xxxxxx')];
			var select = document.getElementById("selectbox");
			select.appendChild(option);
		}
	    }

	    function compareBranchColumn(a, b) {
    		if (a[headers.indexOf('Branch_Address')] === b[headers.indexOf('xxxxxx1xxxxxx')]) {
    		    return 0;
    		}
    		else {
    		    return (a[headers.indexOf('Branch_Address')] < b[headers.indexOf('xxxxxx1xxxxxx')]) ? -1 : 1;
    		}
	    }
	
        }
	});

	var data_brands = [];
	var data_positions = [];
	var xmlDoc = null;

	$.ajax({

	    url: "http://localhost:8000//LBG_tablet_config.xml",
	    async: false,
	    success: function (csvd) {

		if (window.DOMParser)
  		{
			parser=new DOMParser();
			xmlDoc=parser.parseFromString(csvd,"text/xml");
		}
		else // Internet Explorer
		{
			xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async=false;
			xmlDoc.loadXML(csvd); 
		}				
		
		xml_brands = xmlDoc.getElementsByTagName("brand");		
		for (var i = 0, n = xml_brands.length; i < n; i++)
		{
			data_brands.push( xml_brands[i].getAttribute("name") );
		}

		xml_pos = Xpath("//brand[@name = 'Halifax']/position", xmlDoc);

		var iteration = xml_pos.iterateNext();
		while (iteration) {
                    data_positions.push(iteration.getAttribute("name"));
                    iteration = xml_pos.iterateNext();
                }		

		data_brands	= data_brands.sort()
		data_positions	= data_positions.sort()

	    },
 	    dataType: "text",
	    complete: function () {
 	    // call a function on complete 
	    
	    for (var row in data_brands)
	    {					
			var option = document.createElement("option");
			option.value = data_brands[row];
			option.text  = data_brands[row];
			var select = document.getElementById("selectbox_brand");
			select.appendChild(option);				
	    }

	    var select = document.getElementById("selectbox_player");
	    xml_post = Xpath("//players/player", xmlDoc);

	    var iteration = xml_post.iterateNext();
	    while (iteration) {

		    var option = document.createElement("option");
		    option.value = iteration.getAttribute("id");
		    option.text  = iteration.getAttribute("server") + ": " + iteration.getAttribute("name");		    
		    select.appendChild(option);
                    iteration = xml_post.iterateNext();
            }

        }
	});

	function Xpath(path, xml)
	{
		return xml.evaluate(path, xml, null, 5, null);
	}

	function update_Position() {

		removeOptions(document.getElementById("selectbox_position"));
		removeOptions(document.getElementById("selectbox_formfactor"));   

		xml_post = Xpath("//brand[@name = '"+ document.getElementById("selectbox_brand").value +"']/position", xmlDoc);

		var iteration = xml_post.iterateNext();
		while (iteration) {

		    var option = document.createElement("option");
		    option.value = iteration.getAttribute("name");
		    option.text  = iteration.getAttribute("name");
		    var select = document.getElementById("selectbox_position");
		    select.appendChild(option);

                    iteration = xml_post.iterateNext();
                }

	}

	function update_FormFactor() {

		removeOptions(document.getElementById("selectbox_formfactor"));    			

		xml_post = Xpath("//brand[@name = '"+ document.getElementById("selectbox_brand").value +"']/position[@name = '"+ document.getElementById("selectbox_position").value +"']/form", xmlDoc);

		var iteration = xml_post.iterateNext();
		while (iteration) {

		    var option = document.createElement("option");
		    option.value = iteration.getAttribute("name");
		    option.text  = iteration.getAttribute("name");
		    var select = document.getElementById("selectbox_formfactor");
		    select.appendChild(option);

                    iteration = xml_post.iterateNext();
                }

	}

	function update_player() {
		
		document.getElementById("submit_button").disabled = false;

	}

	function removeOptions(selectbox)
	{
	    var i;
	    for(i=selectbox.options.length-1;i>=0;i--)
	    {
	        selectbox.remove(i);
	    }

	    var option = document.createElement("option");
	    option.value = "0";
	    option.text  = "~Please Select~";
	    selectbox.appendChild(option);
	}
