var pwdInpu,nameInput;
    
    function check(){
    	pwdInput = $("#password");
        nameInput = $("#username");
    	if(nameInput.val() == ""){
            nameInput.focus();
            alert("请输入用户名！");
        }
        else if(pwdInput.val() == ""){
            pwdInput.focus();
            alert("请输入密码！");
        }
        else{
            $("#form_mark").submit();
        }
    }


$(function(){
    $('#load').click(function(){
        var params ={
            username: $("#username").val(),
            password: $("#password").val()
        };
        $.post('/verify', params, function(data){
            if(data.success){
                window.location.reload();
            }
            else{ $("#loginInfo").html(data.message); }
        });
    });

});    