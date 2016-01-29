var canGet = true,
	iNowShow = 0,
	winTop = 0,
	iNowPage = 0;

$(function(){
	$(window).scroll(function (){
		pinterest();
		
	})
	showItem();


})

function pinterest(){
	var aLi = $("#items_list li"),
		liCount = aLi.length,
		liHeight = aLi.eq(0).height();
	if(liCount < 4) return;
	
	var	checkMark = getTop(liCount-1, aLi, true).T - $(window).height();
		winTop = $(window).scrollTop();
		console.log('checkMark:' + checkMark + 'winTop:' + winTop);
	if(winTop>checkMark&&canGet){
		console.log(2222222);
		canGet = false;
		$.ajax({
			type: 'POST',
			url:"/getMore",
			data: {page: iNowPage},
			success: function (data){
				if(data.lists.length>0){
					iNowPage++;
					console.log(data);
					createItem(data);
				}
			}
		});
	}
}

function createItem(data){
	var lists = data.lists,
		list = "";
	for (var i = 0; i < lists.length; i++) {
		var id = lists[i]._id,
			previewImg = lists[i].previewImg,
			title = lists[i].title,
			describe = lists[i].describe,
			author = lists[i].author,
			tags = lists[i].tags,
			span = "";

		// for (var j = 0; j < tags.length; j++) {
		// 	span += "<span>"+tags[j]+"</span>";
		// };

		list += '<li class="inner"><a target="_blank" href="./detail/'+ id +'"><img src="'+ previewImg +'"></a><div class="bottom"><p><span class="author"><img src="images/author.png"><span></span></span></p><h4 class="title"><a target="_blank" href="./detail/'+ id +'">'+ title +'</a></h4><p class="number"><span class="glyphicon glyphicon-thumbs-up"></span><span>6</span><span class="glyphicon glyphicon-comment"></span><span>4</span><span class="glyphicon glyphicon-share-alt"></span><span>9</span></p></div></li>';
	};
	$("#items_list").append(list);
	showItem();
	canGet = true;

}


var aLReset = [0, 330, 660]
function showItem(){	
	var aLi = $('#items_list li');
	setTimeout(function(){
		aLi.css({'opacity': 1});
		for(var j=iNowShow; j < aLi.length; j++) {
			if(j > 2){
				var min = getTop(j, aLi);
				aLi.eq(j).css({'left': min.L, 'top': min.T});	
			}
			else if(j == 0){
				aLi.eq(j).css({'left': aLReset[0], 'top': 0});
			}
			else if(j == 1){
				aLi.eq(j).css({'left': aLReset[1], 'top': 0});
			}
			else if(j == 2){
				aLi.eq(j).css({'left': aLReset[2], 'top': 0});
			}	
		};
		iNowShow = aLi.length;
	},300)
	
}

function getTop(iNow, aLi, getMaxTop){
	var aGetTop = [];

	for (var i = iNow-1; i >= 0; i--) {
		if(aLi.eq(i).position().left == aLReset[0]){
			aGetTop.push({'L': aLReset[0], 'T': aLi.eq(i).position().top+aLi.eq(i).outerHeight(true)});
			break;
		}
	};
	for (var i = iNow-1; i >= 0; i--) {
		if(aLi.eq(i).position().left == aLReset[1]){
			aGetTop.push({'L': aLReset[1], 'T': aLi.eq(i).position().top+aLi.eq(i).outerHeight(true)});
			break;
		}
	};
	for (var i = iNow-1; i >= 0; i--) {
		if(aLi.eq(i).position().left == aLReset[2]){
			aGetTop.push({'L': aLReset[2], 'T': aLi.eq(i).position().top+aLi.eq(i).outerHeight(true)});
			break;
		}
	};
	
	function  Sorts(a,b){
	    return a.T-b.T;
	}
	aGetTop.sort(Sorts);
	
	return (getMaxTop || getMaxTop == true) ? aGetTop[2] : aGetTop[0];
	

}