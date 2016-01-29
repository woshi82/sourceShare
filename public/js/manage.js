requestAnimationFrame = window.requestAnimationFrame
	|| window.webkitRequestAnimationFrame
	|| function(callback) {
		setTimeout(callback, 1000 / 60);
	};
$(function(){
    var sAll=$('#sAll'),
    	$pTitle = $('.pTitle'),
    	iChecked = 0;
	$('.manageList').on('click', '.delete', function(){
        if(confirm("确认删除?")){
        	var IDdata = {'ID': $(this).attr('sourceId')}; 
	        $.ajax({
	        	type: 'POST',
	        	url: '/admin/imgDelete',
	        	data: IDdata,
	        	success: function(data){
	        		alert(data);
	        		$('.manageList li').eq(index).remove();
	        	}
	        });
	    }
    })

	

	for (var i = 0; i < $('.personList .check').length; i++) {
		if( $('.personList .check').eq(i).is(':checked') ){
			this.iChecked++;
		}
	};
	if(this.iChecked>0){
		$('.num').html(this.iChecked);
		$pTitle.find('div').hide().filter('.sAllBtn').show();
	}

	$('.personList').on('mouseover', 'li', function(){
		$(this).css('background-color','rgb(240, 248, 253)').find('.btn-group').show();
	})
	$('.personList').on('mouseout', 'li',function(){
		$(this).css('background-color','#F2F2F2').find('.btn-group').hide();
	})
	
    sAll.click(function(){
        if($(this).is(':checked')){
            $('.personList .check').prop('checked', true);
            $pTitle.find('div').hide().filter('.sAllBtn').show();
            iChecked = $('.personList .check').length;            
        }
        else{
            $('.personList .check').removeAttr('checked');
            $pTitle.find('div').show().filter('.sAllBtn').hide();
            iChecked = 0;
        }
        $('.num').html(iChecked);
    });

    $('.personList').on('click', 'li', function(e){
    	//如果选中目标
    	if($(this).find('.check').is(':checked')){
    		$(this).find('.check').removeAttr('checked');
    		sAll.removeAttr('checked');	
    		iChecked--
    		if(iChecked==0)  $pTitle.find('div').show().filter('.sAllBtn').hide();	
    	}
    	else{ 
    		$(this).find('.check').prop('checked', true);
    		$pTitle.find('div').hide().filter('.sAllBtn').show();
    		iChecked++;
    	}
    	$('.num').html(iChecked);
    })
    $('.personList').on('click', '.check', function(e){
    	//如果选中目标
    	e.stopPropagation();
    	if($(this).is(':checked')){
    		$pTitle.find('div').hide().filter('.sAllBtn').show();
    		iChecked++;
    	}
    	else{ 
    		sAll.removeAttr('checked');	
    		iChecked--
    		if(iChecked==0)  $pTitle.find('div').show().filter('.sAllBtn').hide();
    	}
    	$('.num').html(iChecked);
    	
    	//return false;
    })

  
    var bMove=true;

    $('#moveWindow').click(function(){       
        if(bMove){
            $('#uploadWindow').stop().animate({bottom: 0,},200);
            bMove=false;
            setTimeout(function(){
                $('#moveWindow').removeClass('glyphicon-chevron-up');
                $('#moveWindow').addClass('glyphicon-chevron-down');

            }, 200);
        }    
        else{
            $('#uploadWindow').stop().animate({bottom: -364+'px'},200);
            bMove=true;
            setTimeout(function(){
                $('#moveWindow').removeClass('glyphicon-chevron-down');
                $('#moveWindow').addClass('glyphicon-chevron-up');
            }, 200);
        }

    });

    function YunPan(){
	}
	YunPan.prototype.getUploadProgress = function (sizeData){
		var _this = this;
		//获取上传进程
		function getUploadProgress(){
			$.ajax({
		    	type: 'POST',
		        url : '/admin/uploaderProgress',
		        data: sizeData,
		        success:function(msg){
		            _this.percent = msg.percent;
		            _li.find('.progress-bar').css("width", _this.percent +"%");
		            _li.find('.progressInfo').html(_this.percent +"%");
		            if(_this.percent < 100){
	                	requestAnimationFrame(getUploadProgress);
		            }
		            else{
		            	_li.find('.progress-bar').hide();
		            	_li.find('.progressInfo').html('<span class="glyphicon glyphicon-ok"></span>');
		            	_li.find('.close').hide();	
		            }
		        }
		    })
		}
		requestAnimationFrame(getUploadProgress);
	    
	}

	YunPan.prototype.globalUploader = function (sizeData){
	    // 发起上传文件请求
	    this.formData = new FormData($('#global_uploader_form')[0]);
	    this.sCatalog = this.getCatalog();
	    this.formData.append("catalog", this.sCatalog);
	    $.ajax({ 
	    	type: 'POST',
	        url: '/admin/globalUploader',
	        data:  this.formData, 
            processData: false,  
            contentType: false,  
	        success:function(data){
	            // console.log(data);  
	            //填充主界面
	            $('.personList').prepend('<li><div class="name"><a href="javascript:;" class="link"><input type="checkbox" class="check"><span class=""></span><b>'+ data.name +'</b></a><div class="btn-group" style="display: none;"><a href="javascript:;" class="glyphicon glyphicon-download-alt"></a><a href="javascript:;" class="glyphicon glyphicon-share"></a></div></div><div class="size">'+data.size+'</div><div class="date"></div></li>');
	            var span = $('.personList li').eq(0).find('.link span');
	            if(data.type == 0){
	            	span.addClass('glyphicon glyphicon-folder-open');
	            }
	            else if(data.type == 1){
	            	span.addClass('glyphicon glyphicon-inbox');
	            }
	            else if(data.type == 2){
	            	span.addClass('glyphicon glyphicon-picture');
	            }
	            else if(data.type == 10){
	            	span.addClass('glyphicon glyphicon-question-sign');
	            }
	           
	        }
	    });
	    this.getUploadProgress(sizeData);
	}
	YunPan.prototype.getCatalog = function (){
		//获取当前目录
		this.sCatalog = '/';
		for (var i = 0; i < $('.crumbs>div.item').length; i++) {
			this.sCatalog += $('.crumbs>div.item').eq(i).html() + '/';
		};
		return this.sCatalog;
	}

	//点击返回上一级、目录的hash变化
	YunPan.prototype.prevHash = function (hashLen){
		var aHash = hash.split('/'),
			sHash = '';
		for (var i = 0; i < hashLen; i++) {
			sHash += aHash[i] + '/';
		};
		hash = sHash;
		
	}

	YunPan.prototype.hashChange = function(){
		var _this = this;
		hash = window.location.hash;
		if(hash){
			hash = window.location.hash.substring(1).split('=')[1];
			$crumbs.html('<a class="item btnAll" href="javascript:void(0);">全部文件</a>')
			if(hash && hash !== '/'){
				var aHash = hash.split('/');
				aHash.shift();
				aHash.pop();
				var sdivItem = '';		
				for (var i = 0; i < aHash.length; i++) {
					if(i !== aHash.length - 1){
						sdivItem += ' > <div class="item a">'+ aHash[i] +'</div>';
					}
					else{
						sdivItem += ' > <div class="item">'+ aHash[i] +'</div>';
					}
				};
				$crumbs.prepend('<a class="item btnPrev" href="javascript:void(0);"> 返回上一级</a> | ')
				$crumbs.append(sdivItem);			
			}
		}
		else{
			hash = '/'
		}
		_this.reqItems(hash);
	}

	YunPan.prototype.fileDelete = function (fileObj) {
		//清空file内容
		fileObj.after(fileObj.clone().val(""));
		fileObj.remove();
	}
	YunPan.prototype.checkSize = function (size){
		//大小转换
		this.sizeK = parseFloat(size/1024).toFixed(1);
		if(this.sizeK >= 1024){
			this.sizeM = parseFloat(this.sizeK/1024);
			if(this.sizeM >= 1024){
				return (parseFloat(this.sizeM/1024).toFixed(1)) + 'G';
			}
			return (this.sizeM.toFixed(1)) + 'M';
		}
		else{
			return (this.sizeK) + 'kb';
		}
	}

	

	YunPan.prototype.reqItems = function (catalogs){
		//请求项目
		this.catalog = {
			'catalog': catalogs,
		}
		$.ajax({
	    	type: 'POST',
	        url : '/admin/reqItems',
	        data: this.catalog,
	        success:function(data){
	            $('.personList li').remove();
            	for (var i = 0; i < data.length; i++) {
            		$('.personList').append('<li><div class="name"><a href="javascript:;" class="link"><input type="checkbox" class="check"><span class=""></span><b>'+ data[i].name +'</b></a><div class="btn-group" style="display: none;"><a href="javascript:;" class="glyphicon glyphicon-download-alt"></a><a href="javascript:;" class="glyphicon glyphicon-share"></a></div></div><div class="size">'+data[i].size+'</div><div class="date">'+data[i].meta.updateAt+'</div></li>');
            		var span = $('.personList li').eq(i).find('.link span'),
            			b = $('.personList li').eq(i).find('.link b'),
            			type = data[i].type;
		            if(type == 0){
		            	span.addClass('glyphicon glyphicon-folder-open');
		            	b.addClass('folder');
		            }
		            else if(type == 1){
		            	span.addClass('glyphicon glyphicon-folder-inbox');
		            }
		            else if(type == 2){
		            	span.addClass('glyphicon glyphicon-folder-picture');
		            }
		            else if(type == 10){
		            	span.addClass('glyphicon glyphicon-question-sign');
		            }		

            	};
	        }
	    })
	}
	YunPan.prototype.createFolder = function (){
		this.sCatalog = this.getCatalog();
		this.newFolder = {
			'catalog': this.sCatalog,
			'folderName': $('.personList .inputFileName').val()
		}
		$.ajax({
	    	type: 'POST',
	        url : '/admin/createFolder',
	        data: this.newFolder,
	        success:function(data){
	            $('.personList li').eq(0).find('.link').remove();
	            $('.personList li').eq(0).find('.name').prepend('<a href="javascript:;'+data.name+'" class="link folder"><input type="checkbox" class="check"><span class="glyphicon glyphicon-folder-open"></span><b class="folder">'+data.name+'</b></a>');
	            $('.personList li').eq(0).find('.date').html(data.meta.createAt);
	        }
	    })
	}

	var yunpan = new YunPan();

    var sizeData,
    	$uploadWindow = $('#uploadWindow'),
    	$uploadWindowList = $('.uploadWindowList'),
    	_li;
	var $crumbs = $('.crumbs'),
		hash;
	//监听hash值的变化
    window.onhashchange = function(){	
    	yunpan.hashChange()
	}
	//初始化页面
	yunpan.hashChange();

    	//初始化高度
	// $(window).on('resize', function(){
	// 	$('.personList').css('ov')
	// })
    $uploadWindowList.on('click', '.removeUploader', function(){
    	var uploadEnd = {
    		'uploadEnd': true
    	}
    	// if(confirm("确认删除下载进程?")){
        	console.log(uploadEnd);
        	$.ajax({ 
		    	type: 'POST',
		        url: '/admin/removeUploader',
		        data:  uploadEnd, 
		        processData: false,  
            	contentType: false, 
		        success:function(data){   	
		            console.log("删除下载进程");
		            $('#uploadWindow .list').find('li').eq(index).remove();
		        }
		    });
           
        // }
    })


    $('#closeWindow').click(function(){
        $('#uploadWindow').css({'opacity': 0, 'bottom': -364});
    });

    //上传压缩文件并显示
	$('#global_uploader_form').on('change', '.global_uploader', function(){
		if($('.global_uploader')[0].files[0]){
			var uploadFile = $('.global_uploader')[0].files[0];
			sizeData = {
				'fullSize' : uploadFile.size
			}
			$uploadWindowList.append('<li><div role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" class="progress-bar progress-bar-info"></div><div class="name "><span class="glyphicon glyphicon-file"></span>'+ uploadFile.name +'</div><div class="size"><span>'+ yunpan.checkSize(uploadFile.size) +'</span></div><div class="local"><a href="javascript:;">我的文件 </a></div><div class="progressInfo">0%</div><div class="close"><a href="javascript:;" class="glyphicon glyphicon-remove removeUploader"></a></div></li>');
			$uploadWindow.css({'opacity': 1, 'transition': '500ms', 'bottom': 0});
			_li = $uploadWindowList.children("li:last-child");
            bMove=false;
			yunpan.globalUploader(sizeData);
			yunpan.fileDelete($(this));
		}
		
	});
	//新建文件夹
	$('.createfile').on('click', function(){
		if($('.personList .inputFileName').length){
			$('.personList .inputFileName').parents('li').remove();
		}
		$('.personList').prepend('<li><div class="name"><a href="javascript:;" class="link "><input type="checkbox" class="check"><span class="glyphicon glyphicon-folder-open"></span><input class="inputFileName" type="text" value="新建文件夹"/><span class="sure"></span><span class="cancel"></span></a><div class="btn-group" style="display: none;"><a href="javascript:;" class="glyphicon glyphicon-download-alt"></a><a href="javascript:;" class="glyphicon glyphicon-share"></a></div></div><div class="size">-</div><div class="date">-</div></li>');
		$('.personList .inputFileName').select().on('click', function(e){
			e.stopPropagation();
		});
		$('.personList .cancel').on('click', function(e){
			e.stopPropagation();
			$(this).parents('li').remove();			
		})
		$('.personList .sure').on('click', function(e){
			e.stopPropagation();
			yunpan.createFolder();
		})	
	})
	
	//点击文件夹
	$('.personList').on('click', '.folder', function(e){
		e.stopPropagation();
		// if($crumbs.find('div.item').length > 0){
		// 	$crumbs.find('div.item').addClass('a')
		// 	$crumbs.append(' > <div class="item">'+ $(this).html() +'</div>');
			
		// }else{
		// 	$crumbs.prepend('<a class="item btnPrev" href="javascript:void(0);"> 返回上一级</a> | ')
		// 	$crumbs.append(' > <div class="item">'+ $(this).html() +'</div>');
		// }
		hash += $(this).html() + '/'

		//文件夹路由功能未解决
		window.location.hash = '#path='+hash;
	})
	//点击全部文件
	$crumbs.on('click', 'a.btnAll', function(){
		// $crumbs.html('<a class="item btnAll" href="javascript:void(0);")> 全部文件</a>');
		hash = '/';
		window.location.hash = '#path='+ hash;

	})
	//点击返回上一级
	$crumbs.on('click', 'a.btnPrev', function(){
		// if($('div.item.a').length > 0){
		// 	yunpan.prevCatalog($('div.item.a').length);	
		// }
		// else{
		// 	$crumbs.html('<a class="item btnAll" href="javascript:void(0);")> 全部文件</a>');
		// }
		yunpan.prevHash($('div.item.a').length + 1);
		window.location.hash = '#path='+ hash;
	})
	//点击目录
	$crumbs.on('click', 'div.item.a', function(){
		// var aHash = hash.split('/'),
		// 	sHash = '';
		// for (var i = 0; i < $(this).index(); i++) {
		// 	sHash += aHash[i] + '/';
		// };
		// console.log(sHash);
		// hash = sHash;	
		yunpan.prevHash($(this).index());
		window.location.hash = '#path='+ hash;

		
	})
	

}); 
