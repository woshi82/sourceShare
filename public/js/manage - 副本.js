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

	function YunPan(){

	}

	YunPan.prototype.init = function(){
		this.
	}


	$('.personList').on('mouseover', 'li', function(){
		$(this).css('background-color','rgb(240, 248, 253)').find('.btn-group').show();
	})
	$('.personList').on('mouseout', 'li',function(){
		$(this).css('background-color','#F2F2F2').find('.btn-group').hide();
	})

	for (var i = 0; i < $('.personList .check').length; i++) {
		if( $('.personList .check').eq(i).is(':checked') ){
			iChecked++;
		}
	};
	if(iChecked>0){
		$('.num').html(iChecked);
		$pTitle.find('div').hide().filter('.sAllBtn').show();
	}
	
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
    	console.log($(this).find('.check').is(':checked'));
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

            $('#uploadWindow').stop().animate({
                bottom: 0,
            },200);
            bMove=false;
            setTimeout(function(){
                $('#moveWindow').removeClass('glyphicon-chevron-up');
                $('#moveWindow').addClass('glyphicon-chevron-down');

            }, 200);
        }    
        else{

            $('#uploadWindow').stop().animate({
                bottom: -364+'px',
            },200);
            bMove=true;
            setTimeout(function(){
                $('#moveWindow').removeClass('glyphicon-chevron-down');
                $('#moveWindow').addClass('glyphicon-chevron-up');

            }, 200);
        }

    });

    var sizeData,
    	$uploadWindow = $('#uploadWindow'),
    	$uploadWindowList = $('.uploadWindowList'),
    	_li;

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

    var fileSize;
    //上传压缩文件并显示
	$('#global_uploader_form').on('change', '.global_uploader', function(){
		if($('.global_uploader')[0].files[0]){
			var uploadFile = $('.global_uploader')[0].files[0];
			sizeData = {
				'fullSize' : uploadFile.size
			}
			fileSize = checkSize(uploadFile.size);
			$uploadWindowList.append('<li><div role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" class="progress-bar progress-bar-info"></div><div class="name "><span class="glyphicon glyphicon-file"></span>'+ uploadFile.name +'</div><div class="size"><span>'+ fileSize +'</span></div><div class="local"><a href="javascript:;">我的文件 </a></div><div class="progressInfo">0%</div><div class="close"><a href="javascript:;" class="glyphicon glyphicon-remove removeUploader"></a></div></li>');
			$uploadWindow.css({'opacity': 1, 'transition': '500ms', 'bottom': 0});
			_li = $uploadWindowList.children("li:last-child");
            bMove=false;
			globalUploader();
			fileDelete($(this));
		}
		
	});
	
	
	function globalUploader(){
	    // 发起上传文件请求
	    var formData = new FormData($('#global_uploader_form')[0]);
	    var sCatalog = getCatalog();
	    formData.append("catalog", sCatalog);
	    $.ajax({ 
	    	type: 'POST',
	        url: '/admin/globalUploader',
	        data:  formData, 
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
	            	span.addClass('glyphicon glyphicon-folder-inbox');
	            }
	            else if(data.type == 2){
	            	span.addClass('glyphicon glyphicon-folder-picture');
	            }
	            else if(data.type == 10){
	            	span.addClass('glyphicon glyphicon-question-sign');
	            }
	           
	        }
	    });
	   getUploadProgress();
	}
	function getUploadProgress(){
	    $.ajax({
	    	type: 'POST',
	        url : '/admin/uploaderProgress',
	        data: sizeData,
	        success:function(msg){
	            percent = msg.percent;
	            _li.find('.progress-bar').css("width", percent +"%");
	            _li.find('.progressInfo').html(percent +"%");
	            if(percent < 100){
                	getUploadProgress();
	            }
	            else{
	            	_li.find('.progress-bar').hide();
	            	_li.find('.progressInfo').html('<span class="glyphicon glyphicon-ok"></span>');
	            	_li.find('.close').hide();

	            	
	            }
	        }
	    })
	}
	//清空file内容
	function fileDelete(fileObj) {
		fileObj.after(fileObj.clone().val(""));
		fileObj.remove();
	}

	function checkSize(size){
		var sizeK = parseFloat(size/1024).toFixed(1);
		if(sizeK >= 1024){
			var sizeM = parseFloat(sizeK/1024)
			if(sizeM >= 1024){
				return (parseFloat(sizeM/1024).toFixed(1)) + 'G';
			}
			return (sizeM.toFixed(1)) + 'M';
		}
		else{
			return (sizeK) + 'kb';
		}
	}

	$('.createfile').on('click', function(){
		if($('.personList .inputFileName').length){
			$('.personList .inputFileName').parents('li').remove();

		}
		$('.personList').prepend('<li><div class="name"><a href="javascript:;" class="link "><input type="checkbox" class="check"><span class="glyphicon glyphicon-folder-open"></span><input class="inputFileName" type="text" value="新建文件夹"/><span class="sure"></span><span class="cancel"></span></a><div class="btn-group" style="display: none;"><a href="javascript:;" class="glyphicon glyphicon-download-alt"></a><a href="javascript:;" class="glyphicon glyphicon-share"></a></div></div><div class="size">-</div><div class="date">-</div></li>');
		$('.personList .inputFileName').select().on('click', function(e){
			e.stopPropagation();
		});
		$('.personList .cancel').on('click', function(e){
			$(this).parents('li').remove();
			e.stopPropagation();
		})
		$('.personList .sure').on('click', function(e){
			e.stopPropagation();
			//获取当前目录
			var sCatalog = getCatalog();
			var newFolder = {
				'catalog': sCatalog,
				'folderName': $('.personList .inputFileName').val()
			}
			console.log(sCatalog);
			$.ajax({
		    	type: 'POST',
		        url : '/admin/createFolder',
		        data: newFolder,
		        success:function(data){
		            $('.personList li').eq(0).find('.link').remove();
		            $('.personList li').eq(0).find('.name').prepend('<a href="javascript:;'+data.name+'" class="link folder"><input type="checkbox" class="check"><span class="glyphicon glyphicon-folder-open"></span><b class="folder">'+data.name+'</b></a>');
		            $('.personList li').eq(0).find('.date').html(data.meta.createAt);
		        }
		    })
			
		})
		

	})
	function getCatalog(){
		//获取当前目录
		var sCatalog = '/';
		for (var i = 0; i < $('.crumbs>div.item').length; i++) {
			sCatalog += $('.crumbs>div.item').eq(i).html() + '/';
		};
		return sCatalog;
	}
	//生成目录
	var $crumbs = $('.crumbs');
	$('.personList').on('click', '.folder', function(e){
		e.stopPropagation();
		if($crumbs.find('div.item').length > 0){
			$crumbs.find('div.item').addClass('a')
			$crumbs.append(' > <div class="item">'+ $(this).html() +'</div>');
			
		}else{
			$crumbs.prepend('<a class="item btnPrev" href="javascript:void(0);"> 返回上一级</a> | ')
			$crumbs.append(' > <div class="item">'+ $(this).html() +'</div>');
		}
		reqItems(getCatalog())
		

	})
	$crumbs.on('click', 'a.btnAll', function(){
		$crumbs.html('<a class="item btnAll" href="javascript:void(0);")> 全部文件</a>');
		reqItems(getCatalog());
	})
	$crumbs.on('click', 'a.btnPrev', function(){
		if($('div.item.a').length > 0){
			prevCatalog($('div.item.a').length);	
		}
		else{
			$crumbs.html('<a class="item btnAll" href="javascript:void(0);")> 全部文件</a>');
		}
		
		reqItems(getCatalog());
	})
	$crumbs.on('click', 'div.item.a', function(){
		prevCatalog($(this).index()-1)	
		reqItems(getCatalog());
		
	})

	function prevCatalog(divLen){
		var sHtml = '';
		for (var i = 0; i < divLen; i++) {
			sHtml += ' > <div class="item a">'+ $crumbs.find('div.item').eq(i).html() +'</div>'
		};
		$crumbs.html('<a class="item btnPrev" href="javascript:void(0);"> 返回上一级</a> | <a class="item btnAll" href="javascript:void(0);")> 全部文件</a>'+ sHtml);
		$crumbs.find('div.item').eq(divLen-1).removeClass('a');
	}

	function reqItems(catalogs){
		var catalog = {
			'catalog': catalogs,
		}
		$.ajax({
	    	type: 'POST',
	        url : '/admin/reqItems',
	        data: catalog,
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



}); 
