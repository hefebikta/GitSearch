var OCCookies = {
    getCookie: function (cname) {
        var name = cname + '=';
        var ca = document.cookie.split(';');
        for (var i = ca.length - 1 ; i >= 0; i--) {
            var c = ca[i].trim();
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        //cookie not found - relocate to login page
        return null;
        //location.assign('/Account/Login?ReturnUrl=' + location.pathname);
    },

    createCookie: function (name, value, hours) {
        if (hours) {
            var date = new Date();
            date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        }
        else var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    },

    eraseCookie: function (name) {
        OCCookies.createCookie(name, "", -1);
    }

}