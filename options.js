// Saves options to chrome storage.
function save_options() {
	var solution;
	if(document.getElementById('hashtag_remove').checked) {
		solution = "remove";
	}
	else if(document.getElementById('hashtag_linkify').checked) {
		solution = "linkify";
	}
	else {
		solution = "replace";
	}
	chrome.storage.sync.set({"hashtag_solution": solution });
	// Update status to let user know options were saved.
	var status = document.getElementById("status");
	status.innerHTML = "Options Saved.";
	setTimeout(function() {
		status.innerHTML = "";
	}, 750);
}

// Restores radio button state to saved value from chrome storage.
function restore_options() {
	var htsol;
	chrome.storage.sync.get("hashtag_solution", function(obj) {
		htsol = obj.hashtag_solution;
		if (!htsol) {
			return;
		}
		var select = document.getElementById("hashtags");
		for (var i = 0; i < select.children.length; i++) {
			var child = select.children[i];
			if (child.type == "radio" && child.value == htsol) {
				child.checked = true;
				break;
			}
		}
	});
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);