var hashtagRegex = /(^|\s)#(\w+)/g,
	hashtagSolution = "linkify",
	linkedHashtag = '$1<a href="https://twitter.com/search?q=%23$2&src=hash" target="_blank" class="hashtags-on-facebook">#$2</a>',
	hashtags = [
		"believe",
		"belieberforever",
		"ILoveJustin",
		"JustinIsMyEverything",
		"JustinIsPerfect",
		"ILoveYouJustin",
		"IBELIEVE",
		"BELIEBER2013",
		"HashtagsOnFacebook",
		"IShouldProbablyGetATwitter",
		"BeliebOrDie",
		"believeacoustic",
		"BELIEBERFAMILY",
		"NoShameInBeliebing",
		"BELIEBERSUNITE"
	],
	//pagingElementCount = 0, //will factor in paging to limit DOM crawling to new elements (infinite scroll) only
	containsHashtag = function( element ) {
		var string = element.innerHTML ? element.innerHTML : element.innerText;
		return string.search(hashtagRegex) >= 0;
	},
	hashtagOption = function(text) {
		switch(hashtagSolution) {
			case "remove": //removes hashtags
				return text.replace(hashtagRegex,"")
			case "linkify": //links hashtags to Twitter search
				return text.replace(hashtagRegex,linkedHashtag);
			case "replace": //replaces hashtags with Belieber hashtags
				return text.replace(hashtagRegex,function(a,b){
					var ht = hashtags[Math.floor(Math.random()*hashtags.length)];
					return b+'<a href="https://twitter.com/search?q=%23'+ht+'&src=hash" target="_blank" class="hashtags-on-facebook">#'+ht+'</a>';
				});
			default:
				return text.replace(hashtagRegex,linkedHashtag);
		}
	},
	replaceHashtags = function() {
		$(".userContent, .UFICommentBody span").each(function() {
			if(containsHashtag(this)){
				this.innerHTML = hashtagOption(this.innerHTML);
			};
		});
	};

chrome.storage.sync.get("hashtag_solution", function(obj) {
	hashtagSolution = obj.hashtag_solution || "linkify";
	replaceHashtags();
});
chrome.storage.onChanged.addListener(function(changes, namespace) {
	for (key in changes) {
		if(key === "hashtag_solution") {
			hashtagSolution = changes[key].newValue;
			replaceHashtags();
		}
	}
});

$("#pagelet_stream_pager, #pagelet_timeline_recent_more_pager").bind('DOMSubtreeModified', function(event){ //called on paging change/infinite scroll
	replaceHashtags();
});
