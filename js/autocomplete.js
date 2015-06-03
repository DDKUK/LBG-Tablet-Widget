var comboCounter = 0;
$.widget( "custom.combobox", {
	
      _create: function() {
		  comboCounter ++;
        this.wrapper = $( "<span>" )
          .addClass( "custom-combobox"  )
		  .attr("id", "combo-" + comboCounter)
          .insertAfter( this.element );
 
        this.element.hide();
        this._createAutocomplete();
        this._createShowAllButton();
      },
 
      _createAutocomplete: function() {
        var selected = this.element.children( ":selected" ),
          value = selected.val() ? selected.text() : "";
 
        this.input = $( "<input>" )
          .appendTo( this.wrapper )
          .val( value )
          .attr( "title", "" )
          .attr( "type", "text" )
		  .attr("id", "olay_" + this.element.attr("id") )	
          .addClass( "ui-corner-left pixelinputbox"  )
          .autocomplete({
            delay: 0,
            minLength: 0,
            source: $.proxy( this, "_source" )
          })
          .tooltip({
            tooltipClass: ""
          });
 
        this._on( this.input, {
          autocompleteselect: function( event, ui ) {
            ui.item.option.selected = true;
            this._trigger( "select", event, {
              item: ui.item.option
            });
          },
 
          autocompletechange: "_removeIfInvalid"
        });
      },
 
      _createShowAllButton: function() {
        var input = this.input,
          wasOpen = false;
 
        $( "<a>" )
          .attr( "tabIndex", -1 )
          //.attr( "title", "Show All Items" )
          //.tooltip()
          .appendTo( this.wrapper )
          .button({
            icons: {
              primary: ""
            },
            text: false
          })
          .removeClass( "ui-corner-all" )
          .addClass( "pixelinputbutton" )
          .mousedown(function() {
            wasOpen = input.autocomplete( "widget" ).is( ":visible" );
          })
          .click(function() {
            input.focus();
 
            // Close if already visible
            if ( wasOpen ) {
              return;
            }
 
            // Pass empty string as value to search for, displaying all results
            input.autocomplete( "search", "" );
          });
      },
 
      _source: function( request, response ) {
    var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
    var select_el = this.element.get(0); // get dom element
    var rep = new Array(); // response array
    var maxRepSize = 20; // maximum response size
    // simple loop for the options
    for (var i = 0; i < select_el.length; i++) {
        var text = select_el.options[i].text;
        if ( select_el.options[i].value && ( !request.term || matcher.test(text) ) )
            // add element to result array
            rep.push({
                label: text.replace(
                        new RegExp(
                                "(?![^&;]+;)(?!<[^<>]*)(" +
                                $.ui.autocomplete.escapeRegex(request.term) +
                                ")(?![^<>]*>)(?![^&;]+;)", "gi"
                            ), "$1" ),
                value: text,
                option: select_el.options[i]
            });
								
			if ( rep.length > maxRepSize && select_el.id === "combobox" ) {

				//limit results to 20
				//console.log(select_el.id);
				//var lableitem = rep.push({
				//    label: "... Use Keyboard To Find More Results",
				//    value: "none",
				//    option: "0"
				//});
				//rep[51].attr("disabled",true);
				//console.log(rep[51]);
				//console.log(lableitem);
			
            break;
			}
		
     }
     // send response
     response( rep );
},

_select: function( event, ui ) {
    if ( ui.item.value == "none") {
		
        return false;		
    } else {
        ui.item.option.selected = true;
        self._trigger( "selected", event, {
            item: ui.item.option
        });
	
    }
},
_focus: function( event, ui ) {
    if ( ui.item.value == "none") {

        return false;
    }
},


 
      _removeIfInvalid: function( event, ui ) {
 
        // Selected an item, nothing to do
        if ( ui.item ) {
          return;
        }
 
        // Search for a match (case-insensitive)
        var value = this.input.val(),
          valueLowerCase = value.toLowerCase(),
          valid = false;
        this.element.children( "option" ).each(function() {
          if ( $( this ).text().toLowerCase() === valueLowerCase ) {
            this.selected = valid = true;
            return false;
          }
        });
 
        // Found a match, nothing to do
        if ( valid ) {
          return;
        }
 
		
 
 
        // Remove invalid value
        this.input
          .val( "" )
          .attr( "title", value + " didn't match any item" )
          
        this.element.val( "" );
        this._delay(function() {
          this.input.tooltip( "close" ).attr( "title", "" );
        }, 2500 );
        this.input.autocomplete( "instance" ).term = "";
      },
 
      _destroy: function() {
        this.wrapper.remove();
        this.element.show();
      }
    });
    ( jQuery );
	 	 
 
	 $(document).ready(function() {
		 

		 $("#toggle" ).click(function() {
             $( "#combobox" ).toggle();
         });
		 

		$("#selectbox_player" ).combobox({ 
		 
			 select: function (event, ui) { 
				
				//Reset Controls to default
				$("#olay_combobox").val("");
				$("#olay_selectbox_brand").val("");
				$("#olay_selectbox_position").val("");
				$("#olay_selectbox_formfactor").val("");
				
				//Reset ID's to default
				$("#combobox option:selected").val(0)
				$("#selectbox_brand option:selected").val(0)
				$("#selectbox_position option:selected").val(0)
				$("#selectbox_formfactor option:selected").val(0)						
										
				update_player();
				
				var val = document.getElementById("selectbox_player").value;
		
				document.getElementById("olay_selectbox_brand").focus();

				document.getElementById("selectbox_player").value = val;
				
				jsKeyboard.currentElement = $("#olay_selectbox_brand");
				jsKeyboard.currentElementCursorPosition = $("#olay_selectbox_brand").getCursorPosition();	


				//$('.pixelText').attr('style', 'border:none');				
				//$('#combo-2').find('.pixelText').attr('style', 'border: 1px solid red');
			 }	 
		 });
		 
		 
        
		 
        
		 		 
		 
		 $("#selectbox_brand" ).combobox({	

			 select: function (event, ui) { 
					
				//console.log(document.getElementById("selectbox_player").value);
				 
				removeOptions(document.getElementById("combobox"));
				update_sorts();
				
				//Reset Controls to default
				$("#olay_combobox").val("");
				$("#olay_selectbox_position").val("");
				$("#olay_selectbox_formfactor").val("");
				
				//Reset ID's to default
				$("#selectbox_combobox option:selected").val(0)
				$("#selectbox_position option:selected").val(0)
				$("#selectbox_formfactor option:selected").val(0)
												
				update_Position();

				var val = document.getElementById("selectbox_brand").value;
				
				$("#olay_combobox").focus(); 
				
				document.getElementById("selectbox_brand").value = val;
							
				jsKeyboard.currentElement = $("#olay_combobox");
				jsKeyboard.currentElementCursorPosition = $("#olay_combobox").getCursorPosition();
				
				//$('.pixelText').attr('style', 'border:none');				
				//$('#combo-3').find('.pixelText').attr('style', 'border: 1px solid red');
			 }

		 });
		 		 
		
		 $("#combobox" ).combobox({ 
		 
		 	select: function (event, ui) { 
				 var val = document.getElementById("combobox").value;
				 
				 $("#olay_selectbox_position").focus(); 
				 
				 document.getElementById("combobox").value = val;
				 
				 jsKeyboard.currentElement = $("#olay_selectbox_position");
				 jsKeyboard.currentElementCursorPosition = $("#olay_selectbox_position").getCursorPosition();
				 
				 //$('.pixelText').attr('style', 'border:none');				
				 //$('#combo-4').find('.pixelText').attr('style', 'border: 1px solid red');
			}
		 
		 });
		 
		 
		 $("#selectbox_position" ).combobox({ 
		 
		 	select: function (event, ui) { 
				//Reset Controls to default
				$("#olay_selectbox_formfactor").val("");
				//Reset ID's to default
				$("#selectbox_formfactor option:selected").val(0)
			 							
				var val = document.getElementById("selectbox_position").value;

				$("#olay_selectbox_formfactor").focus(); 
				
				document.getElementById("selectbox_position").value = val;
				
				jsKeyboard.currentElement = $("#olay_selectbox_formfactor");
				jsKeyboard.currentElementCursorPosition = $("#olay_selectbox_formfactor").getCursorPosition();
				
				update_FormFactor();
				
				//$('.pixelText').attr('style', 'border:none');				
				//$('#combo-5').find('.pixelText').attr('style', 'border: 1px solid red');		
				
			}
		 
		 });

		 
		 $("#selectbox_formfactor" ).combobox({

		 	 select: function (event, ui) { 
				 var val = document.getElementById("selectbox_formfactor").value;
			 
				 $("#olay_selectbox_formfactor").blur(); 
				 
				 document.getElementById("selectbox_formfactor").value = val;
				 
				 jsKeyboard.currentElement = $("#selectbox_player");
				 jsKeyboard.currentElementCursorPosition = 0;
				 
				 //$('.pixelText').attr('style', 'border:none');	
			 }

		 });

		 
		 
		 				
     });
	 





    

  
  
  


  