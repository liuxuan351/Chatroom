window.onload = function() {
  IM.init();
  IM.receive();
  IM.login();
  IM.postMessage();
  IM.forbidZoom();
}

// 定义 IM 命名空间
var IM = {};

IM.init = function() {
  // 建立到服务器的 socket 连接
  IM.socket = io.connect();

  // 监听 socket 的 connect 事件，表示连接已建立
  IM.socket.on('connect', function() {
    // 已经连接到服务器
    // document.getElementsByTagName('div')[2].className = 'show';
    document.getElementById('info').className = 'hide';
    $('#loginArea').fadeIn(2000);
    // document.getElementById('loginArea').className = 'show';
    document.getElementById('nickname').focus();
  })
};

IM.forbidZoom = function() {
  window.onmousewheel = document.onmousewheel = function(e) {
    e=e || window.event;
    if(e.wheelDelta && event.ctrlKey){//IE/Opera/Chrome
     event.returnValue=false;
    }else if(e.detail){//Firefox
     event.returnValue=false;
    }
  }
};

IM.formatDateTime = function(date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  var minute = date.getMinutes();
  minute = minute < 10 ? ('0' + minute) : minute;
  var seconds = date.getSeconds();
  seconds = seconds < 10 ? ('0' + seconds) : seconds;
  return y + '-' + m + '-' + d+' '+h+':'+minute+':'+seconds;
};

IM.receive = function() {
  IM.socket.on('loginFailed', function(data) {
    document.getElementById('info').innerHTML = '昵称已经被使用！';
  });

  IM.socket.on('loginSuccessed', function(nickname) {
    document.getElementsByTagName('div')[0].className = '';
    document.getElementsByTagName('div')[1].className = 'hide';
    IM.nickname = nickname;
    document.title = 'IM 聊天室 ---- ' + nickname;
    document.getElementById('writeContent').focus();
  });

  IM.socket.on('system', function(nickname, userLength, state) {
    var showContent = document.getElementById('showContent');
    var date = IM.formatDateTime(new Date());

    document.getElementById('userOnlineNum').innerHTML = userLength;
    if (state === 'login') {
      showContent.innerHTML += '<span style="color: #5b6169">' + '系统提示' + ' ( ' + date + ' ) ' + ': ' + nickname + ' 进入房间' + '</span>' + '<br>' ;
    } else {
      showContent.innerHTML += '<span style="color: #5b6169">' + '系统提示： ' + nickname + ' 离开了' + '</span>' + '<br>';
    }
  });

  IM.socket.on('msgBroadcast', function(msg) {
    console.log(555555);
    document.getElementById('showContent').innerHTML += msg;
  });
}

IM.login = function() {
  var loginBtn = document.getElementById('loginBtn');

  loginBtn.onclick = function() {
    var nickname = document.getElementById('nickname');

    if (nickname.value.length > 0) {
      IM.socket.emit('login', nickname.value)
    } else {
      nickname.focus();
      alert('请输入您的昵称！');
    }
  };
};

IM.postMessage = function() {
  var sendBtn = document.getElementById('sendBtn');

  sendBtn.onclick = function() {
    console.log(222);
    var message = document.getElementById('writeContent');

    if (message.value.length > 0) {
      var showContent = document.getElementById('showContent');
      var date = IM.formatDateTime(new Date());
      var msg = '<span style="color: #fff670">' + IM.nickname + '&nbsp;' + '&nbsp;' + '&nbsp;' + '&nbsp;' + date +
                '</span>' + '<br>' + '<span style="padding-left: 20px">' + message.value + '</span>' + '<br>';

      showContent.innerHTML += msg;
      IM.socket.emit('postMsg', msg);
      message.value = '';
    } else {
      message.focus();
      alert('请输入内容后再发送！');
    }

    message.focus();
  }
}
