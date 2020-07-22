var global = {"version": "1.0"}

jQuery(document).ready(function ($) {
  if (window.history && window.history.pushState) {
    //window.history.pushState('forward', null, './#forward');
    $(window).on('popstate', function () {
      global.getPage();
    });
  }
  global.setup();
});

global.setup = function () {
  global.getPage()
  $(".page-link").on("click", function () {
    global.getPage($(this).attr("href").substr(3))
  })
}

global.html = null;
global.json = null;
global.name = null;

global.get = function (name, type) {
  global.name = name;
  if ($("#pages .page-" + global.name).length) {
    $("#pages .page").hide();
    $("#pages .page-" + global.name).show();
    return;
  }
  if (typeof (type) == "undefined") {
    type = "json";
  }
  let accept = (type == "json") ? 'application/json' : "text/html";
  $.ajax({
    url: "pages/" + name + "." + type,
    type: "GET",
    accept: accept,
    async: true,
    //timeout: 5000,
    success: function (result, textStatus, jqXHR) {
      if (type === "json") {
        global.json = result;
        global.get(name, "html")
      } else {
        global.html = result
        global.loadPage();
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR)
      console.log(textStatus)
    }
  });
}

global.getPage = function (page) {
  if ((typeof (page) == "undefined") || (page === "")) {
    var hash = window.location.hash.substr(1);
    page = "";
    if (hash.substr(0, 2) == "p-") {
      page = hash.substr(2);
    }
    if (page == "") {
      page = "home";
    }
  }
  global.get(page)
}

global.loadPage = function () {
  if ($("#pages .page-" + global.name).length == 0) {
    $("#pages").append('<div class="page page-' + global.name + '"></div>');
  }
  global.videos()
  global.images()

  var html = Mustache.render(global.html, global.json);
  $("#pages .page-" + global.name).html(html);
  $("#pages .page").hide();
  $("#pages .page-" + global.name).show();
}

global.idVideo = 100;
global.idimage = 1000;

global.videos = function () {
  // Add an html element to the json
  let vimeoTemplate = $("#vimeo").html();
  let youtubeTemplate = $("#youtube").html();
  for (name in global.json) {
    let v = global.json[name]
    if (v.type && v.type == "video") {
      if (v.list) {
        for (i in v.list) {
          let video = v.list[i];
          video.id = global.idVideo++;
          if (video.player == "vimeo") {
            global.json[name]['list'][i]['html'] = Mustache.render(vimeoTemplate, video);
          } else if (video.player == "youtube") {
            global.json[name]['list'][i]['html'] = Mustache.render(youtubeTemplate, video);
          }
        }
      } else {
        v.id = global.idVideo++;
        if (v.player == "vimeo") {
          global.json[name]['html'] = Mustache.render(vimeoTemplate, v);
        } else if (video.player == "youtube") {
          global.json[name]['html'] = Mustache.render(youtubeTemplate, v);
        }
      }
    }
  }
}

global.images = function () {
  // Add an html element to the json
  let imageTemplate = $("#image").html();
  for (name in global.json) {
    let v = global.json[name]
    if (v.type && v.type == "image") {
      if (v.list) {
        for (i in v.list) {
          let image = v.list[i];
          image.id = global.idImage++;
          global.json[name]['list'][i]['html'] = Mustache.render(imageTemplate, image);

        }
      } else {
        v.id = global.idImage++;
        global.json[name]['html'] = Mustache.render(imageTemplate, v);

      }
    }
  }
}