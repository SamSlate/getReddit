//get
function get(page, meth, dat, callback, err){
	$.ajax({
			url: page,
			method: meth,
			dataType: dat,
			timeout: 6000,
			async: true,
		success: function (response) {
			if(q.beta == 'debug') console.log('  success ('+meth+', '+dat+'):\n\t',page);
			if(q.beta == 'debug') console.log(response);
			callback(response);
		},
		error: function (request){
			console.log('  failed ('+meth+', '+dat+'):\n\t'+page);
			console.log(request);
			err(request);
		}
	});
}