;
(function($w, $d) {
  var $notices =
    $d.getElementsByTagName('i'),
    $modal = null,
    $closebtn = null,
    $noticedesc = null,
    originaloverflow = '',
    i, noticeslen = $notices.length,
    $dbfx = $d.getElementById('dbfx'),
    $btn = $d.getElementById('fullscreen'),
    $body = $d.body || $d.getElementsByTagName('body')[0];

  function getScroll(dir) {
    if (dir === 'top') {
      if (typeof pageYOffset != 'undefined') {
        return pageYOffset;
      } else {
        var $body = document.body;
        var $html = document.documentElement;
        return (($html.clientHeight) ? $html : $body).scrollTop;
      }
    } else if (dir === 'left') {
      if (typeof pageXOffset != 'undefined') {
        return pageXOffset;
      } else {
        var $body = document.body;
        var $html = document.documentElement;
        return (($html.clientHeight) ? $html : $body).scrollLeft;
      }
    }
  }

  function getCoords($elem) {
    var $box = $elem.getBoundingClientRect();

    var pageYOffset = getScroll('top');
    var pageXOffset = getScroll('left');
    return {
      top: $box.top + pageYOffset,
      left: $box.left + pageXOffset
    }
  }

  function setPosition(anchor, position, elem) {
    var anchorCoords = getCoords(anchor),
      topMargin = -10;

    switch (position) {
      case "top":
        elem.style.left = anchorCoords.left + "px";
        elem.style.top = anchorCoords.top - elem.offsetHeight + topMargin + "px";
        break;

      case "right":
        elem.style.left = anchorCoords.left + anchor.offsetWidth + "px";
        elem.style.top = anchorCoords.top + "px";
        break;

      case "bottom":
        elem.style.left = anchorCoords.left + "px";
        elem.style.top = anchorCoords.top + anchor.offsetHeight + "px";
        break;
    }
  }

  function showNote($related, pos, htmlstr) {
    $noticedesc = $d.createElement('div');

    $noticedesc.innerHTML = '<div class="arrow-down"></div>' + htmlstr;
    $noticedesc.className = "notice-desc";

    document.body.appendChild($noticedesc);
    setPosition($related, pos, $noticedesc);
  }

  function mouseenterhandler(evt) {
    evt = evt || window.event;
    var $dom = evt.target || evt.srcElement;
    var clientRect = getCoords($dom);
    showNote($dom, 'top', $dom.getAttribute('data-desc'));
  }

  function mouseleavehandler(evt) {
    document.body.removeChild($noticedesc);
  }

  for (i = 0; i < noticeslen; i += 1) {
    if ($notices[i] && $notices[i].getAttribute('data-role')) {
      $notices[i].onmouseenter = mouseenterhandler;
      $notices[i].onmouseleave = mouseleavehandler;
    }
  }

  // fullscreen
  function hidden() {
    $body.style.overflow = 'hidden';
  }

  function destroyModal() {
    if ($modal) $body.removeChild($modal);
    $d.onkeydown = $closebtn.onclick = null;
  }

  function appendModal() {
    $modal = $d.createElement('div');
    $modal.className = "fullscreen-layer";
    var htmlstr = '<h1>' +
      '<span>' + '@symbol@' + '</span>' +
      '<span>' + '杜邦分析' + '</span>' +
      '<span>' + '@datetime@' + '</span>' +
      '<img id="closelay" class="close" width="20" height="20" src="./close.png"/>' +
      '</h1>';
    var desc = $dbfx.getAttribute('data-fulldesc').split('|');
    htmlstr = htmlstr.replace('@symbol@', desc[0]).replace('@datetime@', desc[1]);

    $modal.innerHTML = htmlstr + $dbfx.outerHTML;
    $body.appendChild($modal);
    $notices = $d.getElementsByTagName('i');
    noticeslen = $notices.length;
    for (i = 0; i < noticeslen; i += 1) {
      if ($notices[i] && $notices[i].getAttribute('data-role')) {
        $notices[i].onmouseenter = mouseenterhandler;
        $notices[i].onmouseleave = mouseleavehandler;
      }
    }
    $closebtn = $d.getElementById('closelay')
    $d.onkeydown = $closebtn.onclick = keydownaction;
  }

  function keydownaction(evt) {
    evt = evt || window.event;
    var evtType = evt.type,
      which = window.event ? evt.keyCode : evt.which;
    if (evtType === "keydown" && which === 27) destroyModal();
    else destroyModal();
  }

  function onclickhandler(evt) {
    var evt = evt || window.event;
    hidden();
    appendModal();
  }
  $btn.onclick = onclickhandler;
}(window, document))
