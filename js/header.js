//HEADER.js
console.log("header.js");
function startStop(string, start, stop){
	if(start == 0)
		if(string.indexOf(stop) > 0)
			return string.substring(0, string.indexOf(stop));
			
	if(string.indexOf(start) > 0)  
		if(stop == 0) //0 = to end, string '0' to search
			return string.substring(string.indexOf(start) + start.length, string.length);
		else 
		{
			string = string.substring(string.indexOf(start) + start.length, string.length);
			
			if(string.indexOf(stop) > 0)
				return string.substring(0, string.indexOf(stop));
			//else 
				//if(q.beta == 'debug') console.log("  stop not found:" + stop + " in " + string);
		}
	else if(q.beta == 'debug') console.log("  start not found: " + start + " in " + string);	
	return null;
}
function openEl(tag,a,text){
	var node = document.createElement(tag);
	var i = 0;
	if(a.length!=0)
		while(i<(a.length-1))
		{
			node.setAttribute(a[i], a[++i]);
			i++;
		}
	//node.appendChild(document.createTextNode(text));		
	node.innerHTML = text;
	return node;
}
function query_string(){
    // This function is anonymous, is executed immediately and
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var found = false;
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[i] != ""){
                // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string"){
                var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
                found = true;
            }
        }
    }
    if(found){
        console.log("query_string: ");
        console.log(query_string);
    }
    else console.log("no query_string");
    return query_string;
}