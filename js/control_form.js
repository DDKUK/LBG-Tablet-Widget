	$('.showresult').dialog({ autoOpen: false }); // Initialize dialog plugin

	function myFunction() {
			//Collect values ect and sumit them to scala here
    			//document.getElementById("submit_button").style.color = "red";
				document.getElementById("submit_button").disabled = true;	
				
				//DISABLE BUTTON			

				var result = Xpath("//player[@id = '"+ document.getElementById("selectbox_player").value +"']", xmlDoc);
				var iteration = result.iterateNext();
				console.log(iteration.getAttribute("sid"));
				console.log(iteration.getAttribute("name"));
				console.log(iteration.getAttribute("server"));
				console.log(iteration.getAttribute("serverurl"));
								
				console.log(document.getElementById("selectbox_brand").value);
				console.log(document.getElementById("combobox").value);
				console.log(document.getElementById("selectbox_position").value);				
				console.log(document.getElementById("selectbox_formfactor").value);
						
				//var data =  	  "{'command': 'connection_test','player_id'	  : '0','player_position' : '',";
				//var data = data + "'player_formfactor: '','player_brand' 	  : '','player_sortcode' :''}";

				var data = {
								'command': 'connection_test',
								'player_id': '0',
								'player_position' : '',
								'player_formfactor' : '',
								'player_brand' : '',
								'player_sortcode' : ''
						   };
				
				PostJson(data);
				

			
	}

	function PostJson(data)
	{		
		try{
				jQuery.ajax({
				type: "POST",
				url: 'http://localhost:9977',
				data: JSON.stringify(data),
				contentType: "application/json; charset=utf-8",
				dataType: "json",
					complete: function(datareply) {
						//Trigger Success
						check_connect("", datareply.responseText);
					},
					error : function(datareply) {
						//Trigger Fail
						check_connect("Unable to connect", datareply.responseText);
					}
				});
		}catch(e){
				check_connect("Unable to connect","");
		}
	}
	
	function check_connect(result, reply) {
		// code that depends on reply from scala
		if (result === "Unable to connect" && reply === "")
		{
			//DO SOMETHING ON FAIL
			connection_failure()
			
		} else 
		{
			if (reply != "" && result != "Unable to connect")
			{
			//DO SOMETHING SUCCESS WTIH THE RESULT
			connection_success(reply)					
			}
		}
		
		//Wait 5 seconds and re-enable the button
		setTimeout(re_enable_button(),5000);
	}
	
	function connection_failure()
	{
		//DISPLAY BUTTON TEXT AS RESULT
		console.log("We were unable to contact the server");
		document.getElementById('j_result').innerHTML = 'Failed To Contact Server';		
		$('.showresult').dialog("open"); // Open popup
	}
	
	function connection_success(reply)
	{
		//DISPLAY BUTTON TEXT AS RESULT
		console.log("Server Replied with: " + reply);
		document.getElementById('j_result').innerHTML = reply;		
		$('.showresult').dialog("open"); // Open popup
	}
	
	function re_enable_button()
	{
		//RE-ENABLE BUTTON
		document.getElementById("submit_button").disabled = false;	
	}
	
	function update_sorts(thisvalue) {
	data = data.sort(compareBranchColumn); 

	for (var row in data)
	{
		if (
			(thisvalue === "Lloyds" && (data[row][headers.indexOf('Branch_Sort_Code')].match("^30") || (data[row][headers.indexOf('Branch_Sort_Code')].match("^70") ))) ||
			(thisvalue === "Halifax" && (data[row][headers.indexOf('Branch_Sort_Code')].match("^11"))) || 
			(thisvalue === "Bank Of Scotland" && (data[row][headers.indexOf('Branch_Sort_Code')].match("^80"))) 
		   )
		{
		  if (row >0){
			var option = document.createElement("option");
			option.value = data[row][headers.indexOf('Branch_Sort_Code')];
			option.text  = data[row][headers.indexOf('Branch_Address')];
			var select = document.getElementById("combobox");
			select.appendChild(option);
		  }
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
	    
	function update_brands() {	
	
		removeOptions(document.getElementById("selectbox_brand"));
		xml_brands = Xpath("//brands/brand", xmlDoc);
	
		pos_allowed = CheckAllowed("//player[@id = '"+ document.getElementById("selectbox_player").value +"']/allowed_brands/brand")
		
		var select = document.getElementById("selectbox_brand");
		var iteration = xml_brands.iterateNext();
		while (iteration) {

			if(pos_allowed.indexOf(iteration.getAttribute("name")) > -1)
			{
		    var option = document.createElement("option");
		    option.value = iteration.getAttribute("name");
		    option.text  = iteration.getAttribute("name");		    
		    select.appendChild(option);
            
			}
			iteration = xml_brands.iterateNext();
			
		}
		
	}
		
	update_sorts();
	
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

	function update_Position() {
	
		removeOptions(document.getElementById("selectbox_position"));
		removeOptions(document.getElementById("selectbox_formfactor"));   

		xml_post = Xpath("//brand[@name = '"+ document.getElementById("selectbox_brand").value +"']/position", xmlDoc);

		pos_allowed = CheckAllowed("//player[@id = '"+ document.getElementById("selectbox_player").value +"']/allowed_positions/position")
		
		var iteration = xml_post.iterateNext();
		while (iteration) {

			//IF VALUE IS IN CURRENT PLAYER ALLOWED LIST
			if(pos_allowed.indexOf(iteration.getAttribute("name")) > -1)
			{	
				var option = document.createElement("option");
				option.value = iteration.getAttribute("name");
				option.text  = iteration.getAttribute("name");
				var select = document.getElementById("selectbox_position");
				select.appendChild(option);
			}

            iteration = xml_post.iterateNext();
        }

	}
	
	function CheckAllowed(xpath)
	{
		xml_allowed = Xpath(xpath, xmlDoc);		
		var pos_allowed = [];
		var al_iteration = xml_allowed.iterateNext();
		while (al_iteration) {
			pos_allowed.push(al_iteration.getAttribute("name"));
			al_iteration = xml_allowed.iterateNext();
		}	
		return pos_allowed;
	}

	function update_FormFactor() {

		removeOptions(document.getElementById("selectbox_formfactor"));    			
		xml_post = Xpath("//brand[@name = '"+ document.getElementById("selectbox_brand").value +"']/position[@name = '"+ document.getElementById("selectbox_position").value +"']/form", xmlDoc);
		pos_allowed = CheckAllowed("//player[@id = '"+ document.getElementById("selectbox_player").value +"']/allowed_forms/form")
		
		var iteration = xml_post.iterateNext();
		while (iteration) {

			//IF VALUE IS IN CURRENT PLAYER ALLOWED LIST
			if(pos_allowed.indexOf(iteration.getAttribute("name")) > -1)
			{
				var option = document.createElement("option");
				option.value = iteration.getAttribute("name");
				option.text  = iteration.getAttribute("name");
				var select = document.getElementById("selectbox_formfactor");
				select.appendChild(option);
			}

            iteration = xml_post.iterateNext();
        }

	}

	function update_player() {
				
		update_brands();
		if (document.getElementById("selectbox_player").value > 0)
		{
			document.getElementById("submit_button").disabled = false;				
		} else 
		{
			document.getElementById("submit_button").disabled = true;				
		}

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
	        option.text  = "";
	        selectbox.appendChild(option);
	}
