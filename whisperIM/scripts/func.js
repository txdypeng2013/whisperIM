var baseurl = "https://minami.cc/im/";
//https://minami.cc/im/
//http://127.0.0.1/im/
function GetDataByUrl_Post(url, data) {
    var msg;
    var url = baseurl + url;
    $.ajax({
        url: url,
        type: "Post",
        async: false,
        data: data,
        dataType: "json",
        beforeSend: function (request) 
		{  
      		
        },
        success: function (e) 
		{
            msg = e;
        },

        error: function (ex) 			
		{
            if (ex.status == 401) 
				{

            } else {
                alert(ex.responseText);
            }

        }
    });
    toast(msg.message);
    return msg;
}