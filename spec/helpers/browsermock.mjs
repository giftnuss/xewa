
function browserReset() {
    global.window = { navigator: {userAgent:""} };
}

export {browserReset};

if( !('window' in global) ) {
	browserReset();
}
