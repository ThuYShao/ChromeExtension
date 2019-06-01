// get right type save in local storage
//console.log('get task type load')

function get_task_type(){
    console.log('Get Task type')
    var server_url = window.location.href;
    chrome.runtime.sendMessage({task_type: "request", url: server_url}, function (response) {
        if (debug) console.log(response); 
        if (response.task_type >= 0) {
            if (debug) console.log('get task_id and task_type success');
        }else{
            if (debug) console.log('fail to get task_id and task_type');
        }
    });
}

get_task_type();