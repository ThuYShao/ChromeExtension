//var baseUrl = "http://127.0.0.1:8000";
// var baseUrl = "http://166.111.138.86:15016";
//var checkUrl = baseUrl + "/user/check/"; // verify user
//var dataUrl = baseUrl + "/exp_domain_expertise/data/"; // save data
//var taskUrl = baseUrl + "/exp_domain_expertise/task_type/"; //get task type (if right)
//var username, password;
//var debug = true; 

if (debug) console.log('Server Mainpage is loaded')

// get right type save in local storage
function get_task_type(){
    var server_url = window.location.href;
    chrome.runtime.sendMessage({task_type: "request", url: server_url}, function (response) {
        if (debug) console.log(response); 
        if (response.task_type == 1) {
            /*if (debug) {
                console.log('get task_type');
                console.log(response.task_type); 
            }*/
            localStorage['task_type'] = 1;
            return;
        }else if (response.task_type == 0) {
            /*if (debug) {
                console.log('get task_type, right = 0');
                console.log(response.task_type);
            }*/
            localStorage['task_type'] = 0;
            return; 
        }else{
            /*if (debug) {
                console.log('get task_type failed, right=1');
                console.log(response.task_type);
            }*/
            localStorage['task_type'] = 1;
            return;
        }
    });
}

get_task_type();

if (debug) {
    console.log('get task_id and task_type in server page');
    console.log(localStorage['task_id']); 
    console.log(localStorage['task_type']);
}

