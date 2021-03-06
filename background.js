chrome.runtime.onInstalled.addListener(function (object) {
    chrome.tabs.create({url: "/options.html"}, function (tab) {
        console.log("New tab launched with chrome-extension://fkbjdmhikmodadjbgpcdmjndkbnpllnk/options.html");
    });
});


function refresh(){
    chrome.storage.sync.get(['access_token'], function(result){
        url = 'https://twitchtos.herokuapp.com/refresh?access_token=' + result.access_token
        fetch(url).then(r => r.text()).then(result => {
            if(result == 'bruh'){
                chrome.tabs.create({url: "/options.html"}, function (tab) {
                    alert('Please sign in again.');
                });
            }
                console.log('Refreshing the thing ' + result)
                chrome.storage.sync.set({access_token: result,})
            })
    })
}

setInterval(refresh, 1000 * 500)

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) {
        var storageChange = changes[key];
        if(key == 'authcode'){
            authcode = storageChange.newValue
            fetch('https://twitchtos.herokuapp.com/auth?authcode=' + authcode).then(r => r.text()).then(result => {
                chrome.storage.sync.set({access_token: result,})
            })
            
        }
    }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if(changeInfo && changeInfo.status == "complete"){
        console.log("Tab updated: " + tab.url);

        chrome.tabs.sendMessage(tabId, {data: tab}, function(response) {
            console.log(response);
        });

    }
});