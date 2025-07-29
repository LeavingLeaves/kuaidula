let running, i = 0, sentence = "", style;
function ToDBC(str) {
    let res = "";
    str = str.replaceAll(/\s\n\s+/g, "\n");
    str = str.replaceAll(/ +/g, "\u3000");
    // str = str.replaceAll(/([\u4e00-\u9fff])\1/g, "$1々");
    for (let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i);
        if (code === 10) { res += str[i]; }
        else if (code < 32) { continue; }
        else if (code < 127) { res = res + String.fromCharCode(code + 65248); }
        else { res += str[i]; }
    }
    return res;
}
$(function () {
    if (localStorage['speed']) { $('#speed').val(localStorage['speed']); }
    else { localStorage['speed'] = 15; }
    /*设置默认速度，原版speed为12，不同的浏览器打开离线页面修改速度后，会自动保存，下次打开仍不变*/
    function reset(deleteinput) {
        i = 0;
        if (deleteinput) {
            sentence = "";
            $('#input').val("");
        }
        $('#go').text('快读').removeClass('btn-danger').addClass('btn-success');
        window.clearInterval(running);
        running = null;
        $('#display').text('|———|');
    }
    $('#display').fitText(0.4); function holdPosition() {
        $('body').css('padding-top', /*($(window).height()- $('#main').height())/ 2*/ 0 + "px");
    }
    /*
    此段注释内容会使body的padding-top属性始终会有一段距离，原版即使手动删除后顶端的距离会重置
    ($(window).height()- $('#main').height())/ 2
    */
    holdPosition();
    window.onresize = holdPosition;
    $('#input').change(function () {
        sentence = ToDBC($('#input').val());
        style = "";
        let t = 0;
        for (let i = 0; i < sentence.length; i++) {
            if ("“「".includes(sentence[i])) { t++; }
            if ("”」".includes(sentence[i])) { t--; }
            if (!"“”「」".includes(sentence[i]) && t > 0) { style += "u"; }
            else style += " ";
        }
    });
    $('#go').click(pause);
    $('#speed').change(function () {
        localStorage['speed'] = parseInt($('#speed').val());
        pause();
        pause();
    });
    function scroll() {
        let sh = $('#input')[0].scrollHeight;
        let rh = parseInt(getComputedStyle($('#input')[0])['line-height']) * $('#input')[0].rows;
        let t = (rh + sh) * (i + 1) / (sentence.length + 1) - rh / 2;
        t = Math.max(0, Math.min(sh, t));
        $('#input')[0].scrollTop = t;
    }
    function pause() {
        const TextBox = document.getElementById("input");
        TextBox.value = sentence;
        if (running === null) {
            i = TextBox.selectionStart;
            if (i === sentence.length) { i = 0; }
            running = window.setInterval(
                function () {
                    // 用上这两行虽然可以实现同步显示与选中，但是会间歇导致显示卡顿
                    // TextBox.focus();
                    // TextBox.setSelectionRange(i, Math.min(i + 3, sentence.length));
                    let s = (sentence + "———").slice(i, i + 3);
                    s = s.replaceAll(/\s/g, "　").split('');
                    s = s.map((c, j) => style[i + j] === 'u' ? '<SPAN STYLE="text-decoration: underline gray">' + c + '</SPAN>' : c);
                    s = "|" + s.join("") + "|";
                    $('#display')[0].innerHTML = s;
                    // $('#display').text(s);
                    i = i + 1;
                    scroll();
                    if (i >= sentence.length) { reset(false); }
                }, 1000 / parseInt($('#speed').val()));
            $('#go').text('暂停').removeClass('btn-success').addClass('btn-danger');
        }
        else {
            window.clearInterval(running);
            running = null;
            TextBox.focus();
            TextBox.setSelectionRange(i - 1, Math.min(i - 1 + 3, sentence.length));
            scroll();
            $('#go').text('快读').removeClass('btn-danger').addClass('btn-success');
        }
    }
    $('#reset').click(reset);
    if (got === "")
        $('#input').text("十九八七六五四三二一开始！欢迎使用“快读啦”，你可以不用移动你的眼球就能阅读，复刻于谷歌应用商店的“快读啦”插件，相信大家已经明白怎么使用了，请尽兴！");
    else
        $('#input').text("十九八七六五四三二一开始！" + got);
    window.setTimeout(function () { $('#input').trigger('change'); $('#go').trigger('click'); }, 100);
});
(function (i, s, o, g, r, a, m) { i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () { (i[r].q = i[r].q || []).push(arguments) }, i[r].l = 1 * new Date(); a = s.createElement(o), m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m) })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga'); ga('create', 'UA-48583436-1', 'kuaidula.com'); ga('send', 'pageview');
