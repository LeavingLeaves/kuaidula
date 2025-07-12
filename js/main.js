let running, i = 0, sentence = "";
function ToDBC(str) {
    let res = "";
    str = str.replaceAll(/ +/g, "\u3000");
    str = str.replaceAll(/\n+/g, "\n");
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
        $('#display').text('------');
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
    $('#input').change(function () { sentence = ToDBC($('#input').val()); });
    $('#go').click(pause);
    $('#speed').change(function () {
        localStorage['speed'] = parseInt($('#speed').val());
        pause();
        pause();
    });
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
                    let s = ((i < sentence.length) ? sentence[i] : "--") + ((i + 1 < sentence.length) ? sentence[i + 1] : "--") + ((i + 2 < sentence.length) ? sentence[i + 2] : "--");
                    s = s.replaceAll(/\n/g, "\u3000");
                    $('#display').text(s);
                    i = i + 1;
                    let sh = $('#input')[0].scrollHeight;
                    let rh = parseInt(getComputedStyle($('#input')[0])['line-height']) * $('#input')[0].rows;
                    let t = (rh + sh) * (i + 1) / (sentence.length + 1) - rh / 2;
                    t = Math.max(0, Math.min(sh, t));
                    $('#input')[0].scrollTop = t;
                    if (i >= sentence.length) { reset(false); }
                }, 1000 / parseInt($('#speed').val()));
            $('#go').text('暂停').removeClass('btn-success').addClass('btn-danger');
        }
        else {
            TextBox.focus();
            TextBox.setSelectionRange(i, Math.min(i + 3, sentence.length));
            window.clearInterval(running);
            running = null;
            $('#go').text('快读').removeClass('btn-danger').addClass('btn-success');
        }
    }
    $('#reset').click(reset);
    if (got === "")
        $('#input').text("十九八七六五四三二一开始！欢迎使用“快读啦”，你可以不用移动你的眼球就能阅读，复刻于谷歌应用商店的“快读啦”插件，相信大家已经明白怎么使用了，请尽兴！");
    else
        $('#input').text("十九八七六五四三二一开始！" + got); window.setTimeout(function () { $('#input').trigger('change'); $('#go').trigger('click'); }, 100);
});
(function (i, s, o, g, r, a, m) { i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () { (i[r].q = i[r].q || []).push(arguments) }, i[r].l = 1 * new Date(); a = s.createElement(o), m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m) })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga'); ga('create', 'UA-48583436-1', 'kuaidula.com'); ga('send', 'pageview');
