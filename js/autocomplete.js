   (function( $ ) {
   
	   
         $.widget( "custom.combobox", {
			 			 
			 
             _create: function() {				 
				 
				 this.wrapper = $( "<span>" )
				.addClass( "custom-combobox" )
				.insertAfter( this.element );
				 	 
				 
                 var self = this,
                     select = this.element.hide(),
                     selected = select.children( ":selected" ),
                     value = selected.val() ? selected.text() : "";
                 var input = this.input = $( "<input>" )
                     .insertAfter( select )
                     .val( value )
		     .attr("id", "olay_" + select.attr("id") )					
                     .autocomplete({
                         delay: 0,
                         minLength: 0,
                         source: function( request, response ) {
                             var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
                             response( select.children( "option" ).map(function() {
                                 var text = $( this ).text();
                                 if ( this.value && ( !request.term || matcher.test(text) ) )
                                     return {
                                         label: text.replace(
                                             new RegExp(
                                                 "(?![^&;]+;)(?!<[^<>]*)(" +
                                                 $.ui.autocomplete.escapeRegex(request.term) +
                                                 ")(?![^<>]*>)(?![^&;]+;)", "gi"
                                             ), "<strong>$1</strong>" ),
                                         value: text,
                                         option: this
                                     };
                             }) );
                         },
                         select: function( event, ui ) {
                             ui.item.option.selected = true;
                             self._trigger( "selected", event, {
                                 item: ui.item.option
                             });

							 jsKeyboard.currentElement.setCursorPosition(ui.item.option.text.length);	
 
                             select.trigger("change");    
							 
                         },
						 				 
                         change: function( event, ui ) {						 
							 														
                             if ( !ui.item ) {
                                 var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i" ),
                                     valid = false;
                                 select.children( "option" ).each(function() {
                                     if ( $( this ).text().match( matcher ) ) {
                                         this.selected = valid = true;	
											
                                         return false;
                                     }
                                 });
                                 if ( !valid ) {
                                     // remove invalid value, as it didn't match anything
                                     $( this ).val( "" );
                                     select.val( "" );
                                     input.data( "autocomplete" ).term = "";									 
                                     return false;
                                 }
                             }							 							 
							 
                         }
                     })
                     .addClass( "ui-input-box  ui-widget ui-widget-content ui-state-default ui-corner-left" );
 
                 input.data( "autocomplete" )._renderItem = function( ul, item ) {
                     return $( "<li></li>" )
                         .data( "item.autocomplete", item )
                         .append( "<a>" + item.label + "</a>" )
                         .appendTo( ul );
                 };
 
                 this.button = $( "<button type='button'>&nbsp;</button>" )
                     .attr( "tabIndex", -1 )
                     .attr( "title", "Show All Items" )
                     .insertAfter( input )
                     .button({
                         icons: {
                             primary: "ui-icon-triangle-1-s"
                         },
                         text: false
                     })
                     .removeClass( "ui-corner-all" )
                     .addClass( "ui-input-box2 ui-corner-right ui-button-icon"  )
                     .click(function() {
                         // close if already visible
                         if ( input.autocomplete( "widget" ).is( ":visible" ) ) {
                             input.autocomplete( "close" );
                             return;
                         }
 
                         // pass empty string as value to search for, displaying all results
                         input.autocomplete( "search", "" );
                         input.focus();
                     });
             },
 
             destroy: function() {
                 this.input.remove();
                 this.button.remove();
                 this.element.show();
                 $.Widget.prototype.destroy.call( this );
             }
         });
     })( jQuery );
	 
	 	 	
	 	 
 
	 $(document).ready(function() {



         $("#combobox" ).combobox({ });
		 
         $("#toggle" ).click(function() {
             $( "#combobox" ).toggle();
         });
		 
		 		 
		 
		 $("#selectbox_brand" ).combobox({		 });
		 $("#selectbox_brand").change(function() {
			 	
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
         });
		 $("#selectbox_position" ).combobox({ });
		 $("#selectbox_position").change(function() {	
	
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
         });
		 
		 $("#selectbox_formfactor" ).combobox({ });
		 
		 $("#selectbox_formfactor" ).change(function() {	
		 
		 	 var val = document.getElementById("selectbox_formfactor").value;
		 
		 	 $("#olay_selectbox_formfactor").blur(); 
			 
			 document.getElementById("selectbox_formfactor").value = val;
			 
			 jsKeyboard.currentElement = $("#selectbox_player");
			 jsKeyboard.currentElementCursorPosition = 0;
		 });		 
		 
		 $("#selectbox_player" ).combobox({ });
		 				
		 $("#selectbox_player").change(function() {			

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
	
         });		 	 
         $("#combobox").change(function() {
			 
			 var val = document.getElementById("combobox").value;
			 
			 $("#olay_selectbox_position").focus(); 
			 
			 document.getElementById("combobox").value = val;
			 
			 jsKeyboard.currentElement = $("#olay_selectbox_position");
			 jsKeyboard.currentElementCursorPosition = $("#olay_selectbox_position").getCursorPosition();
		 });
     });
	 





    

  
  
  


  