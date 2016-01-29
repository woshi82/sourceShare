$(function(){
	$("#submit").click(function (){
		var item = {
			"previewImg": $(".inputPreviewImg").val(),
			"inputAppendix": $(".inputAppendix").val(),
			"title": $("#inputTitle").val(),
			"describe": $("#inputDescribe").val(),
			"tags": $("#inputTags").val(),
			"author": $("#inputAuthor").val()
		};
		// if(item.link!=""&&item.title!=""&&item.describe!=""&&item.tags!=""&&item.author!=""){
			if(item.title!=""){
			//alert($('.inputPreviewImg')[0].files.length);
			var files = $('.inputPreviewImg')[0].files;
			//alert(JSON.stringify(item));
			if (files) {
				$("#form_mark").submit();
			}else{
				alert("请选择一个文件再提交！！！");
			}	
		}else{
			alert("请填写完整！！！");
		}
	});

	var $previewImgList = $('.previewImgList'),
		$selectImg = $('.selectImg'),
		$selectAppendix = $('.selectAppendix'),
		$previewAppendixList  = $('.previewAppendixList ');

	//上传图片生成预览图
	bindOnChange();
	$previewImgList.on('click', '.delete', function(){
		var parent = $(this).parents('li'),
			index = parent.index();
		parent.remove();
		$('.inputPreviewImg').eq(index).remove();
	})

	//上传压缩文件并显示
	$selectAppendix.on('change', '.inputAppendix', function(){
		
		var fileName = $(this)[0].files[0].name; 
		if(fileName.split('.').pop() !== 'zip' && fileName.split('.').pop() !== 'rar'){
			alert('抱歉仅支持.zip或.rar的压缩文件');	
		}
		else{
			if($previewAppendixList.find('li').length !== 0) $previewAppendixList.find('li').remove();
			$previewAppendixList.append('<li class="clearfix"> <span class="appendixName">'+ fileName +'</span><span class="state">上传成功 </span><a class="delete">X</a></li>');
		}
		//fileDelete($(this));
	})
	$previewAppendixList.on('click', '.delete', function(){
		var parent = $(this).parents('li');
		parent.remove();
		fileDelete($('.inputAppendix'));
	})

	//清空file内容
	function fileDelete(fileObj) {
		fileObj.after(fileObj.clone().val(""));
		fileObj.remove();
	}

	function bindOnChange(){
		$selectImg.on('change', '.inputPreviewImg', function(){
			var fileName = $(this)[0].files[0].name; 
			if(fileName.split('.').pop() !== 'jpg' && fileName.split('.').pop() !== 'png'){
				fileDelete($(this));
				alert('抱歉仅支持.jpg或.png的压缩文件');	
			}
			else {
				onChange($(this));
			}
		})
	}
	
	function onChange(_this){
		if(setImagePreview(_this[0])){
			_this.css({'z-index': 0}) //将已经上传的file移开
			_this.after('<input class="inputPreviewImg" type="file", name="previewImg"/>');
		};
	}

	function setImagePreview(source) { 
		var target,targetParent,
			sTarget = '<li class="clearfix"><img src="/images/1.png" /><textarea> </textarea><a class="delete" href="javascript:;">X</a>';
        if(source.files && source.files[0]){  
            //火狐下，直接设img属性  
            //target.style.display = 'block';                       
            //target.src = source.files[0].getAsDataURL();  
            $previewImgList.append(sTarget) ;
            targetParent = $previewImgList.find('li:last-child');
            target = targetParent.find('img')[0];
            //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式    
            target.src = window.URL.createObjectURL(source.files[0]);  
        }
        else{  
            //IE下，使用滤镜  
            source.select();  
            var imgSrc = document.selection.createRange().text;  
            //必须设置初始大小  
           // targetParent.style.width = "340px";  
           // targetParent.style.height = "300px";  
            //图片异常的捕捉，防止用户修改后缀来伪造图片  
            try{  
                targetParent.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(  sizingMethod=scale)";  
                targetParent.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src =   imgSrc;  
            }catch(e){  
                alert("您上传的图片格式不正确，请重新选择!");  
                return false;  
            }  
            target.style.display = 'none';  
            document.selection.empty();  
        }  
        //address.value = target.src;
        //console.log(target.src);
        return true;  
    }  




})
