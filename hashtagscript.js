var hashtagRegex = /(^|\s)#(\w+)/g,
	hashtagSolution = "linkify",
	linkedHashtag = '$1<a href="https://twitter.com/search?q=%23$2&src=hash" target="_blank" class="hashtags-on-facebook">#$2</a>',
	spanStart = '<span class="hashtag-wrapper">',
	spanEnd = '</span>',
	restoreSpan = '<span class="restore-hashtag">#restore</span>',
	classes = ".userContent, .UFICommentBody span, .webMessengerMessageGroup p, .hasCaption span, .text_exposed_root",
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
				return text.replace(hashtagRegex,function(a,b){
					var a = a.substring(a.search("#")+1),
						span = spanStart + '<span class="hashtags-on-facebook active"></span><a href="https://twitter.com/search?q=%23'+a+'&src=hash" target="_blank" class="hashtags-on-facebook hidden">#'+a+'</a>'+spanEnd;
					return b + span;
				});
			case "linkify": //links hashtags to Twitter search
				return text.replace(hashtagRegex,linkedHashtag);
			case "replace": //replaces hashtags with Belieber hashtags
				return text.replace(hashtagRegex,function(a,b){
					var ht = hashtags[Math.floor(Math.random()*hashtags.length)],
						a = a.substring(a.search("#")+1),
						span = spanStart + '<a href="https://twitter.com/search?q=%23'+ht+'&src=hash" target="_blank" class="hashtags-on-facebook active">#'+ht+'</a><a href="https://twitter.com/search?q=%23'+a+'&src=hash" target="_blank" class="hashtags-on-facebook hidden">#'+a+'</a>'+spanEnd;
					return b + span;
				});
			default:
				return text.replace(hashtagRegex,linkedHashtag);
		}
	},
	replaceHashtags = function() {
		$(classes).each(function() {
			if(containsHashtag(this)){
				this.innerHTML = hashtagOption(this.innerHTML);
				if(hashtagSolution !== "linkify") {
					this.innerHTML = this.innerHTML + ' ' + restoreSpan;
					$(this).bind({mouseenter: function(){
						$(this).find(".restore-hashtag").fadeIn();
					}, mouseleave: function(){
						$(this).find(".restore-hashtag").fadeOut();
					}});
					$(this).find(".restore-hashtag").on("click",function() {
						var active = $(this).parent().find(".hashtags-on-facebook.active"),
							original = $(this).parent().find(".hashtags-on-facebook.hidden");
						active.removeClass('active').addClass('hidden');
						original.removeClass('hidden').addClass('active');
					});
				}
			}
		});
	};
chrome.storage.sync.get("hashtag_solution", function(obj) {
	hashtagSolution = obj.hashtag_solution || "linkify";
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
$(document).ready(function() {
	setTimeout(replaceHashtags, 1000);
});
