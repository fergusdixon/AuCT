(function (){

	var segPanel = document.getElementsByClassName("segment-holder")[0];

	console.log("Generating segments...");

	for (var i = 0; i < 10; i++) {
		segPanel.innerHTML = segPanel.innerHTML + " <div class='btn-group'><a href='#' data-toggle='dropdown' class='btn btn-primary btn-lg dropdown-toggle audio-seg' id='seg-"+i+"' onclick=''>SEGMENT 1 <span class='caret'></span></a><audio id='audio' src='segments/sample_fruit_0000"+i+".wav' style='visibility: hidden; width: 0px; height: 0px;' controls preload='auto' autobuffer></audio><ul class='dropdown-menu' role='menu'><li><a href='#'>Label</a></li><li><a href='#'>Remove</a></li></ul></div>"

	}




}());
