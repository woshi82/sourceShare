$(function(){

    
	$("#submit").click(function (){
		var item = {
			"previewImg": $("#inputPreviewImgLink").val(),
			"link": $("#inputLink").val(),
			"title": $("#inputTitle").val(),
			"describe": $("#inputDescribe").val(),
			"tags": $("#inputTags").val(),
			"author": $("#inputAuthor").val()
		};
		if(item.link!=""&&item.title!=""&&item.describe!=""&&item.tags!=""&&item.author!=""){

			if($("#inputPreviewImg").val()){
				var files = $('#inputPreviewImg')[0].files;

				if (files) {
					document.getElementById("form_mark").submit();
				}else{
					alert("你要选择一个文件在提交啊！！！");
				}
			}else{
				if(item.previewImg!=""){
					$.ajax({
						type: 'POST',
						url:"/submit_item",
						data: {
							item: item
						},
						success: function (data){
							alert("提交成功！！！");
							//$("#form_mark input").val("");
						}
					});
				}else{
					alert("不上传图片就得给图片链接哦！！！");
				}
			};
		}else{
			alert("请填写完整！！！");
		}
	});
})
