(function () {

window.LiveViewCounter = window.LiveViewCounter || {io: null, socket: null};

const vars = {
    uid: {{json:uid}},
    total: {{json:total}},
};

const elem = document.currentScript.parentElement.appendChild(document.createElement('SPAN'));
elem.setAttribute('class', document.currentScript.getAttribute('class'));
refresh();

function refresh() {
    elem.innerText = vars.total;
}

load_socketio(function (socket) {
    socket.on(`update ${vars.uid}`, function (next) {
        vars.total = next;    
        refresh();
    });
});

function load_socketio(fn)
{
    if (is_ready()) {
        fire();
        return;
    }

    if (!document.getElementById('live-view-counter-socketio')) {
        document.write('<script id="live-view-counter-socketio" src="{{html:APP_URL}}/socket.io/socket.io.js"></script>');
    }

    tick();

    function tick() {
        if (is_ready()) {
            fire();
        }
        else {
            setTimeout(tick, 10);
        }
    }

    function is_ready() {
        if (typeof io === 'undefined') {
            return false;
        }
        window.LiveViewCounter.io = window.LiveViewCounter.io || io;
        window.LiveViewCounter.socket = window.LiveViewCounter.socket || window.LiveViewCounter.io({{json:APP_URL}});
        return true;
    }

    function fire() {
        setTimeout(function () { fn(window.LiveViewCounter.socket); }, 0);
    }
}
})();
